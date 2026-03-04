import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';

console.log('Starting SLZ Server...');
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const dbPath = process.env.VERCEL ? '/tmp/slz.db' : 'slz.db';
const db = new Database(dbPath);
const JWT_SECRET = 'slz-jwt-secret-key-2026-v1';

// --- Database Initialization ---
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      whatsapp_link TEXT
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id INTEGER,
      semester_number INTEGER,
      subject_name TEXT,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id INTEGER,
      semester_number INTEGER,
      subject_id INTEGER,
      category_id INTEGER,
      title TEXT,
      drive_link TEXT,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  // Seed Admin if not exists (password: admin123)
  const adminExists = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
  if (!adminExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
  }

  // Seed initial categories if empty
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (catCount.count === 0) {
    const cats = ['Notes', 'Past Papers', 'Assignments', 'Quiz', 'Announcement', 'Other'];
    const insertCat = db.prepare('INSERT INTO categories (category_name) VALUES (?)');
    cats.forEach(c => insertCat.run(c));
  }

  // Seed initial departments if empty
  const deptCount = db.prepare('SELECT COUNT(*) as count FROM departments').get() as { count: number };
  if (deptCount.count === 0) {
    const initialDepts = [
      { name: 'BS English', link: 'https://chat.whatsapp.com/Jd5ReObT8V82BuQQHvP8zL' },
      { name: 'BS Chemistry', link: 'https://chat.whatsapp.com/JOrTsUNoxUz3pkhk2IwRrX' },
      { name: 'BS Computer Science (BSCS)', link: 'https://chat.whatsapp.com/FgokbFFSTk97rS2IjXU7S2' },
      { name: 'BS Information Technology (BSIT)', link: 'https://chat.whatsapp.com/CN29l48FI3UCzU8vM7y02Z' },
      { name: 'BS Botany', link: 'https://chat.whatsapp.com/FlzUdgtjO5rGSkfNn1omeG' },
      { name: 'BS Statistics', link: 'https://chat.whatsapp.com/G7j3sa7KF69E5yqVYkvBlE' },
      { name: 'BBA Department', link: 'https://chat.whatsapp.com/DAck5r6xL0rI16SFjSLIBp' },
      { name: 'BS Islamiyat', link: 'https://chat.whatsapp.com/ELZAlLcIIpK8dV3cEP8NzD' },
      { name: 'BS Zoology', link: 'https://chat.whatsapp.com/BUJ53hvRZ6UCGYNpjEykdJ' },
      { name: 'PHARM-D (Prof-01)', link: 'https://chat.whatsapp.com/GxUzlQCR2ROIsTfHT8F4JX' },
      { name: 'PHARM-D (Prof-02)', link: 'https://chat.whatsapp.com/IWUY8XFn7Ta8t4EIWWzTre' },
      { name: 'PHARM-D (Prof-03)', link: 'https://chat.whatsapp.com/I9Zh7AaQZxO9aXUmIdwwcT' }
    ];
    const insertDept = db.prepare('INSERT INTO departments (name, whatsapp_link) VALUES (?, ?)');
    initialDepts.forEach(d => insertDept.run(d.name, d.link));
  }
} catch (dbError) {
  console.error('Database initialization error:', dbError);
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(morgan('dev'));
  app.use(express.json());

  // --- Health Check ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- Auth Middleware ---
  const isAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn(`[Unauthorized] No token provided for path: ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.adminId = decoded.adminId;
      next();
    } catch (err) {
      console.warn(`[Unauthorized] Invalid token for path: ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // --- Auth Routes ---
  app.post('/api/auth/login', (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username) as any;
      if (admin && bcrypt.compareSync(password, admin.password_hash)) {
        const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token, message: 'Logged in' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (loginError: any) {
      console.error('Login error:', loginError);
      res.status(500).json({ error: `Server error: ${loginError.message}` });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ loggedIn: false });
    }

    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, JWT_SECRET);
      res.json({ loggedIn: true });
    } catch (err) {
      res.json({ loggedIn: false });
    }
  });

  // --- Public Data Routes ---
  app.get('/api/departments', (req, res) => {
    const depts = db.prepare('SELECT * FROM departments').all();
    res.json(depts);
  });

  app.get('/api/categories', (req, res) => {
    const cats = db.prepare('SELECT * FROM categories').all();
    res.json(cats);
  });

  app.get('/api/subjects', (req, res) => {
    const { department_id, semester } = req.query;
    let query = 'SELECT * FROM subjects WHERE 1=1';
    const params = [];
    if (department_id) {
      query += ' AND department_id = ?';
      params.push(department_id);
    }
    if (semester) {
      query += ' AND semester_number = ?';
      params.push(semester);
    }
    const subjects = db.prepare(query).all(...params);
    res.json(subjects);
  });

  app.get('/api/resources', (req, res) => {
    const { department_id, semester, subject_id, status } = req.query;
    let query = `
      SELECT r.*, d.name as department_name, s.subject_name, c.category_name 
      FROM resources r
      JOIN departments d ON r.department_id = d.id
      JOIN subjects s ON r.subject_id = s.id
      JOIN categories c ON r.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (department_id) {
      query += ' AND r.department_id = ?';
      params.push(department_id);
    }
    if (semester) {
      query += ' AND r.semester_number = ?';
      params.push(semester);
    }
    if (subject_id) {
      query += ' AND r.subject_id = ?';
      params.push(subject_id);
    }
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    } else {
      query += " AND r.status = 'active'";
    }
    query += ' ORDER BY r.created_at DESC';
    const resources = db.prepare(query).all(...params);
    res.json(resources);
  });

  // --- Admin CRUD Routes ---
  
  // Departments
  app.post('/api/admin/departments', isAdmin, (req, res) => {
    const { name, whatsapp_link } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Department name is required' });
    }
    try {
      const result = db.prepare('INSERT INTO departments (name, whatsapp_link) VALUES (?, ?)').run(name.trim(), whatsapp_link || null);
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      if (e.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Department already exists' });
      }
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/admin/departments/:id', isAdmin, (req, res) => {
    const { name, whatsapp_link } = req.body;
    db.prepare('UPDATE departments SET name = ?, whatsapp_link = ? WHERE id = ?').run(name, whatsapp_link || null, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/departments/:id', isAdmin, (req, res) => {
    db.prepare('DELETE FROM departments WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Subjects
  app.post('/api/admin/subjects', isAdmin, (req, res) => {
    const { department_id, semester_number, subject_name } = req.body;
    if (!department_id || !semester_number || !subject_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    try {
      const result = db.prepare('INSERT INTO subjects (department_id, semester_number, subject_name) VALUES (?, ?, ?)').run(department_id, semester_number, subject_name.trim());
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/admin/subjects/:id', isAdmin, (req, res) => {
    const { subject_name, semester_number } = req.body;
    db.prepare('UPDATE subjects SET subject_name = ?, semester_number = ? WHERE id = ?').run(subject_name, semester_number, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/subjects/:id', isAdmin, (req, res) => {
    db.prepare('DELETE FROM subjects WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Categories
  app.post('/api/admin/categories', isAdmin, (req, res) => {
    const { name } = req.body;
    const result = db.prepare('INSERT INTO categories (category_name) VALUES (?)').run(name);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/admin/categories/:id', isAdmin, (req, res) => {
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Resources
  app.post('/api/admin/resources', isAdmin, (req, res) => {
    const { department_id, semester_number, subject_id, category_id, title, drive_link, description } = req.body;
    const result = db.prepare(`
      INSERT INTO resources (department_id, semester_number, subject_id, category_id, title, drive_link, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(department_id, semester_number, subject_id, category_id, title, drive_link, description);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/admin/resources/:id', isAdmin, (req, res) => {
    const { title, drive_link, description, category_id, semester_number, subject_id, status } = req.body;
    db.prepare(`
      UPDATE resources 
      SET title = ?, drive_link = ?, description = ?, category_id = ?, semester_number = ?, subject_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, drive_link, description, category_id, semester_number, subject_id, status || 'active', req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/resources/:id', isAdmin, (req, res) => {
    db.prepare('DELETE FROM resources WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Stats
  app.get('/api/admin/stats', isAdmin, (req, res) => {
    const depts = db.prepare('SELECT COUNT(*) as count FROM departments').get() as any;
    const subjects = db.prepare('SELECT COUNT(*) as count FROM subjects').get() as any;
    const resources = db.prepare("SELECT COUNT(*) as count FROM resources WHERE status = 'active'").get() as any;
    const recent = db.prepare(`
      SELECT r.*, d.name as department_name 
      FROM resources r 
      JOIN departments d ON r.department_id = d.id 
      ORDER BY r.created_at DESC LIMIT 5
    `).all();
    res.json({
      departments: depts.count,
      subjects: subjects.count,
      resources: resources.count,
      recent
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
