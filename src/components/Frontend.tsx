import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Globe, 
  ShoppingBag, 
  MessageCircle, 
  Instagram, 
  Library, 
  Compass, 
  Briefcase, 
  ShieldAlert, 
  ChevronRight, 
  FileText, 
  Download, 
  ExternalLink,
  ArrowLeft,
  GraduationCap,
  Users,
  LayoutDashboard,
  Upload,
  UserCircle,
  Menu,
  X,
  Plus,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Department, Resource } from '../types';

const SECRET_CODE = 'SLZ-2026';

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 1, name: 'BS English', whatsapp_link: 'https://chat.whatsapp.com/Jd5ReObT8V82BuQQHvP8zL' },
  { id: 2, name: 'BS Chemistry', whatsapp_link: 'https://chat.whatsapp.com/JOrTsUNoxUz3pkhk2IwRrX' },
  { id: 3, name: 'BS Computer Science (BSCS)', whatsapp_link: 'https://chat.whatsapp.com/FgokbFFSTk97rS2IjXU7S2' },
  { id: 4, name: 'BS Information Technology (BSIT)', whatsapp_link: 'https://chat.whatsapp.com/CN29l48FI3UCzU8vM7y02Z' },
  { id: 5, name: 'BS Botany', whatsapp_link: 'https://chat.whatsapp.com/FlzUdgtjO5rGSkfNn1omeG' },
  { id: 6, name: 'BS Statistics', whatsapp_link: 'https://chat.whatsapp.com/G7j3sa7KF69E5yqVYkvBlE' },
  { id: 7, name: 'BBA Department', whatsapp_link: 'https://chat.whatsapp.com/DAck5r6xL0rI16SFjSLIBp' },
  { id: 8, name: 'BS Islamiyat', whatsapp_link: 'https://chat.whatsapp.com/ELZAlLcIIpK8dV3cEP8NzD' },
  { id: 9, name: 'BS Zoology', whatsapp_link: 'https://chat.whatsapp.com/BUJ53hvRZ6UCGYNpjEykdJ' },
  { id: 10, name: 'PHARM-D (Prof-01)', whatsapp_link: 'https://chat.whatsapp.com/GxUzlQCR2ROIsTfHT8F4JX' },
  { id: 11, name: 'PHARM-D (Prof-02)', whatsapp_link: 'https://chat.whatsapp.com/IWUY8XFn7Ta8t4EIWWzTre' },
  { id: 12, name: 'PHARM-D (Prof-03)', whatsapp_link: 'https://chat.whatsapp.com/I9Zh7AaQZxO9aXUmIdwwcT' }
];

const PLATFORMS = [
  { title: 'Official Website', icon: <Globe />, desc: 'Access the main university portal.', variant: 'white', link: 'https://studentslearningzone.site/' },
  { title: 'Books Store', icon: <ShoppingBag />, desc: 'Get your academic books easily.', variant: 'black', link: 'https://books.studentslearningzone.site/' },
  { title: 'WhatsApp Channel', icon: <MessageCircle />, desc: 'Stay updated with real-time news.', variant: 'black', link: 'https://whatsapp.com/channel/0029Vb6nPjuAojYoZdD8GQ1i' },
  { title: 'Instagram Page', icon: <Instagram />, desc: 'Follow us for campus highlights.', variant: 'white', link: 'https://www.instagram.com/students_learning_zone2025?igsh=d3ZncHlpZWQ4bzZ0' },
];

const SOCIETIES = [
  { title: 'SLZ Library', icon: <Library />, desc: 'Digital repository of knowledge.', variant: 'white', link: 'https://chat.whatsapp.com/EeLotj5ox18IQdgFcM6zGh' },
  { title: 'SLZ Explorers Society', icon: <Compass />, desc: 'Adventure and learning combined.', variant: 'black', link: 'https://chat.whatsapp.com/G6U8ubBhV8kBd9cwd8qZLn' },
  { title: 'SLZ Jobs & Career Network', icon: <Briefcase />, desc: 'Your bridge to professional life.', variant: 'black', link: 'https://chat.whatsapp.com/Cqo75fJ5TO73ETZbPQ5Afo' },
  { title: 'SLZ Complaint Area', icon: <ShieldAlert />, desc: 'We are here to listen and help.', variant: 'white', link: 'https://chat.whatsapp.com/KNX6FMfQJyrCcnuWgIFha9' },
];

const Navbar = ({ onHome, isAdmin, onToggleAdmin }: { onHome: () => void; isAdmin: boolean; onToggleAdmin: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/10 px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onHome}>
          <div className="w-10 h-10 bg-black flex items-center justify-center text-primary font-black text-xl rounded-xl transition-transform group-hover:scale-110">
            S
          </div>
          <span className="font-black text-xl tracking-tighter hidden sm:block">SLZ PU</span>
        </div>

        <div className="hidden md:flex items-center gap-10 font-bold text-sm uppercase tracking-widest">
          <button onClick={onHome} className="hover:text-primary transition-colors">About us</button>
          <a href="#departments" className="hover:text-primary transition-colors">Departments</a>
          <a href="#societies" className="hover:text-primary transition-colors">Societies</a>
          <button 
            onClick={onToggleAdmin} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black transition-all ${isAdmin ? 'bg-primary text-black' : 'bg-white text-black hover:bg-black hover:text-white'}`}
          >
            {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
            {isAdmin ? 'Edit Mode On' : 'Edit Mode'}
          </button>
          <button 
            onClick={() => window.open('https://chat.whatsapp.com/channel/0029Vb6nPjuAojYoZdD8GQ1i', '_blank')}
            className="px-6 py-2 rounded-full border-2 border-black font-black hover:bg-black hover:text-white transition-all"
          >
            Departments
          </button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-black p-6 flex flex-col gap-6 font-bold uppercase tracking-widest text-sm shadow-xl"
          >
            <button onClick={() => { onHome(); setIsOpen(false); }} className="text-left">About us</button>
            <a href="#departments" onClick={() => setIsOpen(false)}>Departments</a>
            <a href="#societies" onClick={() => setIsOpen(false)}>Societies</a>
            <button onClick={() => { onToggleAdmin(); setIsOpen(false); }} className="text-left flex items-center gap-2">
              {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
              {isAdmin ? 'Edit Mode On' : 'Edit Mode'}
            </button>
            <button className="brutal-btn brutal-btn-primary w-full rounded-full">Request a quote</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ResourceCard: React.FC<{ resource: Resource; isAdmin: boolean; onDelete: (id: number) => void }> = ({ resource, isAdmin, onDelete }) => (
  <div className="brutal-card p-6 flex flex-col gap-4 group relative bg-white hover:bg-black hover:text-white transition-all duration-300">
    {isAdmin && (
      <button 
        onClick={() => onDelete(resource.id)}
        className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
      >
        <Trash2 size={18} />
      </button>
    )}
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-1 rounded-md w-fit mb-2 group-hover:bg-primary group-hover:text-black transition-colors">
          {resource.category_name || 'Resource'}
        </span>
        <h3 className="text-xl font-black leading-tight">{resource.title}</h3>
      </div>
    </div>
    <p className="text-sm font-medium opacity-60 line-clamp-2">{resource.description || 'No description provided.'}</p>
    <div className="mt-auto pt-4">
      <a 
        href={resource.drive_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-black text-xs uppercase tracking-widest group-hover:text-primary transition-colors"
      >
        <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
        Learn more
      </a>
    </div>
  </div>
);

const DepartmentPage = ({ dept, onBack, isAdmin, resources, onAddResource, onDeleteResource }: { 
  dept: Department, 
  onBack: () => void, 
  isAdmin: boolean,
  resources: Resource[],
  onAddResource: (res: Omit<Resource, 'id' | 'created_at' | 'updated_at'>) => void,
  onDeleteResource: (id: number) => void
}) => {
  const [activeSemester, setActiveSemester] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    drive_link: '',
    description: '',
    category_name: 'Notes'
  });

  const filteredResources = resources.filter(r => r.department_id === dept.id && r.semester_number === activeSemester);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResource({
      ...newResource,
      department_id: dept.id,
      semester_number: activeSemester,
      subject_id: 0,
      category_id: 0,
      status: 'active'
    });
    setNewResource({ title: '', drive_link: '', description: '', category_name: 'Notes' });
    setShowAddModal(false);
  };
  
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={onBack} className="flex items-center gap-2 font-black uppercase tracking-widest text-xs mb-12 hover:text-primary transition-colors">
        <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
          <ArrowLeft size={16} />
        </div>
        Back to Home
      </button>

      <div className="mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] mb-4">
          Academic Portal
        </span>
        <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight uppercase tracking-tighter">
          {dept.name}
        </h1>
        <p className="text-lg font-medium opacity-60 max-w-2xl">
          Access specialized academic resources, past papers, and community support for the {dept.name} department.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <button
            key={sem}
            onClick={() => setActiveSemester(sem)}
            className={`px-6 py-2 rounded-full border-2 border-black font-black text-xs uppercase tracking-widest transition-all ${activeSemester === sem ? 'bg-primary text-black' : 'bg-white text-black hover:bg-black hover:text-white'}`}
          >
            Sem {sem}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-primary flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                Semester {activeSemester} Resources
              </h2>
              {isAdmin && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 rounded-full bg-primary text-black border-2 border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Resource
                </button>
              )}
            </div>

            {filteredResources.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredResources.map(r => (
                  <ResourceCard 
                    key={r.id} 
                    resource={r} 
                    isAdmin={isAdmin} 
                    onDelete={onDeleteResource} 
                  />
                ))}
              </div>
            ) : (
              <div className="brutal-card p-16 bg-gray-50/50 border-dashed text-center">
                <div className="w-20 h-20 bg-white rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="opacity-20" />
                </div>
                <p className="font-black text-xl mb-2 uppercase tracking-tight">No resources found yet.</p>
                <p className="font-medium text-gray-400 max-w-xs mx-auto">The admin is working on uploading materials for this semester.</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <div className="brutal-card p-8 bg-black text-white">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tight">
              <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              Community
            </h3>
            <p className="font-medium opacity-70 mb-8 leading-relaxed">Join the official WhatsApp group for {dept.name} students to stay updated with real-time news and peer support.</p>
            <button 
              onClick={() => window.open(dept.whatsapp_link || 'https://chat.whatsapp.com/channel/0029Vb6nPjuAojYoZdD8GQ1i', '_blank')}
              className="w-full py-4 rounded-full bg-primary text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              Join WhatsApp Group
            </button>
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="brutal-card bg-white p-10 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">Add New Resource</h3>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div>
                  <label className="block font-black text-[10px] uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Calculus Notes - Unit 1"
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"
                    value={newResource.title}
                    onChange={e => setNewResource({...newResource, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-black text-[10px] uppercase tracking-widest mb-2">Drive Link</label>
                  <input 
                    type="url" 
                    required 
                    placeholder="https://drive.google.com/..."
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"
                    value={newResource.drive_link}
                    onChange={e => setNewResource({...newResource, drive_link: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block font-black text-[10px] uppercase tracking-widest mb-2">Category</label>
                  <select 
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none appearance-none bg-white"
                    value={newResource.category_name}
                    onChange={e => setNewResource({...newResource, category_name: e.target.value})}
                  >
                    <option>Notes</option>
                    <option>Past Papers</option>
                    <option>Assignments</option>
                    <option>Quiz</option>
                    <option>Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-[10px] uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    placeholder="Briefly describe the resource..."
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none h-32 resize-none"
                    value={newResource.description}
                    onChange={e => setNewResource({...newResource, description: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full py-4 rounded-full bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-all">
                  Save Resource
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Frontend() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{ type: 'dept' | 'res', id: number } | null>(null);
  const [tempCode, setTempCode] = useState('');
  const [newDeptData, setNewDeptData] = useState({ name: '', whatsapp_link: '' });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedDepts = localStorage.getItem('slz_departments');
    const savedResources = localStorage.getItem('slz_resources');

    if (savedDepts) {
      setDepartments(JSON.parse(savedDepts));
    } else {
      setDepartments(INITIAL_DEPARTMENTS);
      localStorage.setItem('slz_departments', JSON.stringify(INITIAL_DEPARTMENTS));
    }

    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      setResources([]);
      localStorage.setItem('slz_resources', JSON.stringify([]));
    }

    setLoading(false);
  }, []);

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowCodeModal(true);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempCode === SECRET_CODE) {
      setIsAdmin(true);
      setShowCodeModal(false);
      setTempCode('');
    } else {
      alert('Incorrect Secret Code!');
    }
  };

  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptData.name) return;
    
    const newDept: Department = {
      id: Date.now(),
      name: newDeptData.name,
      whatsapp_link: newDeptData.whatsapp_link || ''
    };

    const updated = [...departments, newDept];
    setDepartments(updated);
    localStorage.setItem('slz_departments', JSON.stringify(updated));
    setNewDeptData({ name: '', whatsapp_link: '' });
    setShowAddDeptModal(false);
  };

  const handleDeleteDept = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal({ type: 'dept', id });
  };

  const confirmDelete = () => {
    if (!showDeleteModal) return;
    
    if (showDeleteModal.type === 'dept') {
      const updatedDepts = departments.filter(d => d.id !== showDeleteModal.id);
      const updatedResources = resources.filter(r => r.department_id !== showDeleteModal.id);
      setDepartments(updatedDepts);
      setResources(updatedResources);
      localStorage.setItem('slz_departments', JSON.stringify(updatedDepts));
      localStorage.setItem('slz_resources', JSON.stringify(updatedResources));
    } else {
      const updated = resources.filter(r => r.id !== showDeleteModal.id);
      setResources(updated);
      localStorage.setItem('slz_resources', JSON.stringify(updated));
    }
    
    setShowDeleteModal(null);
  };

  const handleAddResource = (resData: Omit<Resource, 'id' | 'created_at' | 'updated_at'>) => {
    const newRes: Resource = {
      ...resData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updated = [...resources, newRes];
    setResources(updated);
    localStorage.setItem('slz_resources', JSON.stringify(updated));
  };

  const handleDeleteResource = (id: number) => {
    setShowDeleteModal({ type: 'res', id });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-8 border-black border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (selectedDept) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onHome={() => setSelectedDept(null)} isAdmin={isAdmin} onToggleAdmin={toggleAdmin} />
        <main className="flex-grow">
          <DepartmentPage 
            dept={selectedDept} 
            onBack={() => setSelectedDept(null)} 
            isAdmin={isAdmin}
            resources={resources}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-primary selection:text-black">
      <Navbar onHome={() => setSelectedDept(null)} isAdmin={isAdmin} onToggleAdmin={toggleAdmin} />

      {/* Hero */}
      <header className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] mb-8">
              Established 2026
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase">
              Navigating the <br />
              <span className="text-primary">digital landscape</span> <br />
              for success
            </h1>
            <p className="text-lg md:text-xl font-medium mb-12 max-w-lg text-gray-500 leading-relaxed">
              Our academic agency helps students grow and succeed through a range of services including resources, career guidance, and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#departments" className="px-8 py-4 rounded-full bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-all text-center">
                Browse through departments 
              </a>
            </div>
          </motion.div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 animate-float">
              <div className="w-full aspect-square bg-black rounded-[3rem] flex items-center justify-center p-12 overflow-hidden group">
                <div className="relative w-full h-full border-4 border-primary/30 rounded-[2rem] flex items-center justify-center">
                  <GraduationCap size={160} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black">
                    <Plus size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Platforms Grid */}
      <section className="py-12 border-y border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {PLATFORMS.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-black text-xl tracking-tighter uppercase">
                {React.cloneElement(p.icon as React.ReactElement, { size: 20 })}
                {p.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <span className="px-4 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] w-fit">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Empowering the <br />
              <span className="text-primary">next generation</span> <br />
              of scholars
            </h2>
            <p className="text-lg font-medium text-gray-500 leading-relaxed">
              Students Learning Zone (SLZ) is a student-driven platform that provides quality education support, academic resources, career guidance, and a strong learning community for university students.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <div className="text-4xl font-black mb-2 tracking-tighter">2026</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Founded</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2 tracking-tighter">10k+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resources</div>
              </div>
            </div>
          </div>
          <div className="brutal-card p-12 bg-primary flex flex-col gap-8">
            <div className="w-16 h-16 rounded-2xl bg-black text-primary flex items-center justify-center">
              <Users size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight leading-none">
              Built by students, <br /> for students.
            </h3>
            <p className="font-black text-sm uppercase tracking-widest leading-relaxed">
              We believe in the power of collaborative learning. Our platform is designed to bridge the gap between academic theory and professional practice.
            </p>
          </div>
        </div>
      </section>

      {/* Services/Societies */}
      <section id="societies" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-20">
            <span className="px-4 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] w-fit">
              Services
            </span>
            <p className="text-sm font-medium text-gray-400 max-w-md">
              At our digital learning agency, we offer a range of services to help students grow and succeed online. These services include:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SOCIETIES.map((soc, idx) => (
              <a 
                key={idx}
                href={soc.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`brutal-card p-10 flex flex-col sm:flex-row gap-8 items-start group ${soc.variant === 'black' ? 'bg-black text-white' : 'bg-white text-black'}`}
              >
                <div className="flex-grow space-y-4">
                  <h3 className={`text-2xl font-black uppercase tracking-tight ${soc.variant === 'white' ? 'bg-primary text-black inline-block px-2' : ''}`}>
                    {soc.title}
                  </h3>
                  <p className="font-medium opacity-60 text-sm leading-relaxed">{soc.desc}</p>
                  <div className="pt-4">
                    <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                      <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      Learn more
                    </div>
                  </div>
                </div>
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0 ${soc.variant === 'black' ? 'bg-white text-black' : 'bg-black text-primary'}`}>
                  {React.cloneElement(soc.icon as React.ReactElement, { size: 40 })}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="py-32 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-6">
              <span className="px-4 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] w-fit">
                Academic
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Academic <br /> Departments
              </h2>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setShowAddDeptModal(true)}
                className="px-8 py-4 rounded-full bg-primary text-black border-2 border-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all"
              >
                Add Department
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {departments.length > 0 ? (
              departments.map((dept) => (
                <button 
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  className="brutal-card p-8 text-left flex flex-col gap-6 group hover:bg-black hover:text-white transition-all duration-300 relative"
                >
                  {isAdmin && (
                    <button 
                      onClick={(e) => handleDeleteDept(dept.id, e)}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black group-hover:bg-white transition-colors">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase leading-tight tracking-tight">{dept.name}</h3>
                  <div className="flex items-center gap-3 mt-auto font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                    <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    View Resources
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-black/10 bg-white">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <LayoutDashboard size={40} className="text-gray-200" />
                </div>
                <p className="text-2xl font-black uppercase tracking-tight mb-2">No Departments Available</p>
                <p className="font-medium text-gray-400">Please check back later or contact the administrator.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Secret Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="brutal-card bg-white p-10 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">Enter Secret Code</h3>
                <button onClick={() => setShowCodeModal(false)} className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div>
                  <label className="block font-black text-[10px] uppercase tracking-widest mb-2">Secret Code</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Enter code..."
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"
                    value={tempCode}
                    onChange={e => setTempCode(e.target.value)}
                    autoFocus
                  />
                </div>
                <button type="submit" className="w-full py-4 rounded-full bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-all">
                  Enable Edit Mode
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddDeptModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="brutal-card bg-white p-10 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">Add Department</h3>
                <button onClick={() => setShowAddDeptModal(false)} className="w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddDeptSubmit} className="space-y-6">
                <div>
                  <label className="block font-black text-[10px] uppercase tracking-widest mb-2">Department Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. BS Physics"
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"
                    value={newDeptData.name}
                    onChange={e => setNewDeptData({...newDeptData, name: e.target.value})}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block font-black text-[10px] uppercase tracking-widest mb-2">WhatsApp Link (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"
                    value={newDeptData.whatsapp_link}
                    onChange={e => setNewDeptData({...newDeptData, whatsapp_link: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full py-4 rounded-full bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-all">
                  Save Department
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="brutal-card bg-white p-10 w-full max-w-md text-center"
            >
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Are you sure?</h3>
              <p className="font-medium text-gray-500 mb-10">
                {showDeleteModal.type === 'dept' 
                  ? 'This will permanently delete the department and all its associated resources. This action cannot be undone.' 
                  : 'This resource will be permanently removed. This action cannot be undone.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-4 rounded-full border-2 border-black font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-full bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Footer = () => (
  <footer className="bg-black text-white py-24 px-4 rounded-t-[4rem] -mt-16 relative z-20">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
      <div className="md:col-span-2 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary flex items-center justify-center text-black font-black text-2xl rounded-xl">
            S
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase">SLZ PU</span>
        </div>
        <p className="font-medium text-gray-400 max-w-md leading-relaxed">
          The ultimate academic hub for PU students. Empowering education through community, shared resources, and digital innovation.
        </p>
      </div>
      <div>
        <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-primary">Quick Links</h4>
        <ul className="space-y-4 font-black uppercase text-[10px] tracking-[0.2em]">
          <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
          <li><a href="#departments" className="hover:text-primary transition-colors">Departments</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-primary">Contact</h4>
        <p className="font-black uppercase text-[10px] tracking-[0.2em]">© 2026 Students Learning Zone – PU</p>
      </div>
    </div>
  </footer>
);
