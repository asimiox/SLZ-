import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  ChevronRight, 
  BookOpen, 
  Library, 
  Briefcase, 
  ShieldAlert, 
  FileText, 
  Download, 
  ExternalLink,
  Search,
  Check,
  X,
  AlertCircle,
  Menu,
  Settings,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Department, Subject, Category, Resource, AdminStats } from '../types';

type AdminView = 'dashboard' | 'resources' | 'departments' | 'subjects' | 'categories';

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [depts, setDepts] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    department_id: 0,
    semester_number: 1,
    subject_id: 0,
    category_id: 0,
    title: '',
    drive_link: '',
    description: ''
  });

  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptLink, setNewDeptLink] = useState('');
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [newSubject, setNewSubject] = useState({ department_id: 0, semester_number: 1, subject_name: '' });

  useEffect(() => {
    fetchStats();
    fetchDepts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeView === 'resources') fetchResources();
    if (activeView === 'subjects') fetchSubjects();
  }, [activeView]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('slz_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const checkResponse = async (res: Response) => {
    if (res.status === 401) {
      console.warn('Unauthorized response detected in AdminPanel, logging out...');
      localStorage.removeItem('slz_token');
      onLogout();
      return false;
    }
    return true;
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: getAuthHeaders()
      });
      if (await checkResponse(res)) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchDepts = async () => {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) {
        const data = await res.json();
        setDepts(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchSubjects = async (deptId?: number) => {
    try {
      const url = deptId ? `/api/subjects?department_id=${deptId}` : '/api/subjects';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources?status=active');
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (e) { console.error(e); }
  };

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newResource)
      });
      if (await checkResponse(res)) {
        if (res.ok) {
          showMessage('Resource added successfully!');
          setNewResource({ department_id: 0, semester_number: 1, subject_id: 0, category_id: 0, title: '', drive_link: '', description: '' });
          fetchResources();
          fetchStats();
        } else {
          const err = await res.json();
          showMessage(err.error || 'Failed to add resource', 'error');
        }
      }
    } catch (e) {
      showMessage('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/resources/${editingResource.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editingResource)
      });
      if (await checkResponse(res)) {
        if (res.ok) {
          showMessage('Resource updated successfully!');
          setEditingResource(null);
          fetchResources();
        } else {
          const err = await res.json();
          showMessage(err.error || 'Failed to update resource', 'error');
        }
      }
    } catch (e) {
      showMessage('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (await checkResponse(res)) {
        if (res.ok) {
          showMessage('Resource deleted');
          fetchResources();
          fetchStats();
        }
      }
    } catch (e) { showMessage('Network error', 'error'); }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newDeptName, whatsapp_link: newDeptLink })
      });
      if (await checkResponse(res)) {
        if (res.ok) {
          showMessage('Department added');
          setNewDeptName('');
          setNewDeptLink('');
          fetchDepts();
          fetchStats();
        } else {
          const err = await res.json();
          showMessage(err.error || 'Failed to add department', 'error');
        }
      }
    } catch (e) { showMessage('Network error', 'error'); }
  };

  const handleUpdateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !editingDept.name.trim()) return;
    try {
      const res = await fetch(`/api/admin/departments/${editingDept.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: editingDept.name, whatsapp_link: editingDept.whatsapp_link })
      });
      if (await checkResponse(res)) {
        if (res.ok) {
          showMessage('Department updated');
          setEditingDept(null);
          fetchDepts();
        } else {
          const err = await res.json();
          showMessage(err.error || 'Failed to update department', 'error');
        }
      }
    } catch (e) { showMessage('Network error', 'error'); }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.subject_name.trim() || !newSubject.department_id) {
      showMessage('Please fill all fields', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSubject)
      });
      if (await checkResponse(res)) {
        if (res.ok) {
          showMessage('Subject added');
          setNewSubject({ ...newSubject, subject_name: '' });
          fetchSubjects();
          fetchStats();
        } else {
          const err = await res.json();
          showMessage(err.error || 'Failed to add subject', 'error');
        }
      }
    } catch (e) { showMessage('Network error', 'error'); }
  };

  const refreshData = () => {
    fetchStats();
    fetchDepts();
    fetchCategories();
    if (activeView === 'resources') fetchResources();
    if (activeView === 'subjects') fetchSubjects();
    showMessage('Data refreshed');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'resources', label: 'Resources', icon: <FileText size={20} /> },
    { id: 'departments', label: 'Departments', icon: <Library size={20} /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen size={20} /> },
    { id: 'categories', label: 'Categories', icon: <Layers size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary text-white p-4 border-b-4 border-black flex justify-between items-center sticky top-0 z-50 shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent border-2 border-black flex items-center justify-center text-black font-black text-lg">
            SLZ
          </div>
          <h1 className="font-black text-xl tracking-tighter uppercase">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refreshData} className="p-2 border-2 border-white hover:bg-white hover:text-primary transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 border-2 border-white hover:bg-white hover:text-primary transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r-4 border-black flex flex-col transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:block p-8 border-b-4 border-black bg-primary text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-primary font-black text-xl shadow-brutal-sm">
              SLZ
            </div>
            <h1 className="font-black text-2xl tracking-tighter">ADMIN</h1>
          </div>
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Management System</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as AdminView);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 font-black uppercase text-sm border-2 border-black transition-all ${
                activeView === item.id 
                  ? 'bg-accent shadow-brutal-sm translate-x-1 translate-y-1' 
                  : 'hover:bg-gray-50 hover:translate-x-1'
              }`}
            >
              <span className={activeView === item.id ? 'text-black' : 'text-gray-500'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t-4 border-black bg-gray-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 brutal-btn bg-red-500 text-white font-black uppercase text-sm py-4"
          >
            <LogOut size={18} /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-[60] p-4 border-4 border-black shadow-brutal font-bold flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-400' : 'bg-red-400'
              }`}
            >
              {message.type === 'success' ? <Check /> : <AlertCircle />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto">
          {activeView === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase">Admin Dashboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                <div className="brutal-card p-6 bg-blue-100">
                  <h3 className="text-lg font-black uppercase mb-2">Departments</h3>
                  <p className="text-4xl md:text-5xl font-black">{stats?.departments || 0}</p>
                </div>
                <div className="brutal-card p-6 bg-yellow-100">
                  <h3 className="text-lg font-black uppercase mb-2">Subjects</h3>
                  <p className="text-4xl md:text-5xl font-black">{stats?.subjects || 0}</p>
                </div>
                <div className="brutal-card p-6 bg-green-100">
                  <h3 className="text-lg font-black uppercase mb-2">Resources</h3>
                  <p className="text-4xl md:text-5xl font-black">{stats?.resources || 0}</p>
                </div>
              </div>

              <div className="brutal-card p-6 md:p-8 bg-white overflow-hidden">
                <h3 className="text-xl md:text-2xl font-black uppercase mb-6">Recent Uploads</h3>
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b-4 border-black text-left">
                        <th className="p-4 font-black uppercase text-sm">Title</th>
                        <th className="p-4 font-black uppercase text-sm">Department</th>
                        <th className="p-4 font-black uppercase text-sm">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recent || []).length > 0 ? (
                        stats?.recent.map((r) => (
                          <tr key={r.id} className="border-b-2 border-black hover:bg-gray-50">
                            <td className="p-4 font-bold">{r.title}</td>
                            <td className="p-4 font-bold">{r.department_name}</td>
                            <td className="p-4 text-sm font-bold">{new Date(r.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-8 text-center font-bold text-gray-400 italic">No recent uploads</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'resources' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-black uppercase">Resource Management</h2>
                <button 
                  onClick={() => setEditingResource(null)} 
                  className="brutal-btn-accent flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <Plus size={20} /> Add New Resource
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                  <div className="brutal-card p-6 bg-white lg:sticky lg:top-8">
                    <h3 className="text-xl font-black uppercase mb-6">
                      {editingResource ? 'Edit Resource' : 'Add New Resource'}
                    </h3>
                    <form onSubmit={editingResource ? handleUpdateResource : handleAddResource} className="space-y-4">
                      <div>
                        <label className="block font-black text-xs uppercase mb-1">Department</label>
                        <select 
                          className="w-full p-2 border-2 border-black font-bold text-sm"
                          value={editingResource ? editingResource.department_id : newResource.department_id}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (editingResource) setEditingResource({ ...editingResource, department_id: val });
                            else {
                              setNewResource({ ...newResource, department_id: val });
                              fetchSubjects(val);
                            }
                          }}
                          required
                        >
                          <option value="">Select Department</option>
                          {(depts || []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-black text-xs uppercase mb-1">Semester</label>
                        <select 
                          className="w-full p-2 border-2 border-black font-bold text-sm"
                          value={editingResource ? editingResource.semester_number : newResource.semester_number}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (editingResource) setEditingResource({ ...editingResource, semester_number: val });
                            else setNewResource({ ...newResource, semester_number: val });
                          }}
                          required
                        >
                          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-black text-xs uppercase mb-1">Subject</label>
                        <select 
                          className="w-full p-2 border-2 border-black font-bold text-sm"
                          value={editingResource ? editingResource.subject_id : newResource.subject_id}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (editingResource) setEditingResource({ ...editingResource, subject_id: val });
                            else setNewResource({ ...newResource, subject_id: val });
                          }}
                          required
                        >
                          <option value="">Select Subject</option>
                          {(subjects || []).filter(s => s.department_id === (editingResource?.department_id || newResource.department_id)).map(s => (
                            <option key={s.id} value={s.id}>{s.subject_name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-black text-xs uppercase mb-1">Category</label>
                        <select 
                          className="w-full p-2 border-2 border-black font-bold text-sm"
                          value={editingResource ? editingResource.category_id : newResource.category_id}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (editingResource) setEditingResource({ ...editingResource, category_id: val });
                            else setNewResource({ ...newResource, category_id: val });
                          }}
                          required
                        >
                          <option value="">Select Category</option>
                          {(categories || []).map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-black text-xs uppercase mb-1">Title</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border-2 border-black font-bold text-sm"
                          value={editingResource ? editingResource.title : newResource.title}
                          onChange={(e) => {
                            if (editingResource) setEditingResource({ ...editingResource, title: e.target.value });
                            else setNewResource({ ...newResource, title: e.target.value });
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-black text-xs uppercase mb-1">Drive Link</label>
                        <input 
                          type="url" 
                          className="w-full p-2 border-2 border-black font-bold text-sm"
                          value={editingResource ? editingResource.drive_link : newResource.drive_link}
                          onChange={(e) => {
                            if (editingResource) setEditingResource({ ...editingResource, drive_link: e.target.value });
                            else setNewResource({ ...newResource, drive_link: e.target.value });
                          }}
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full brutal-btn-primary py-3"
                      >
                        {loading ? 'Saving...' : editingResource ? 'Update Resource' : 'Add Resource'}
                      </button>
                      {editingResource && (
                        <button 
                          type="button" 
                          onClick={() => setEditingResource(null)}
                          className="w-full brutal-btn bg-gray-200 py-3"
                        >
                          Cancel
                        </button>
                      )}
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                  <div className="brutal-card p-6 bg-white">
                    <h3 className="text-xl font-black uppercase mb-6">Existing Resources</h3>
                    <div className="space-y-4">
                      {(resources || []).length > 0 ? (
                        resources.map((r) => (
                          <div key={r.id} className="p-4 border-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50">
                            <div>
                              <p className="font-black text-lg leading-tight">{r.title}</p>
                              <p className="text-xs font-bold text-gray-600 mt-1">
                                {r.department_name} • Sem {r.semester_number} • {r.category_name}
                              </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button 
                                onClick={() => {
                                  setEditingResource(r);
                                  fetchSubjects(r.department_id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex-1 sm:flex-none p-2 border-2 border-black hover:bg-yellow-100 flex justify-center"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteResource(r.id)}
                                className="flex-1 sm:flex-none p-2 border-2 border-black hover:bg-red-100 flex justify-center"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-8 font-bold text-gray-400 italic">No resources found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'departments' && (
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase">Department Management</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="brutal-card p-6 bg-white">
                  <h3 className="text-xl font-black uppercase mb-6">Add Department</h3>
                  <form onSubmit={handleAddDept} className="space-y-4">
                    <div>
                      <label className="block font-black text-sm uppercase mb-1">Department Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. BSCS"
                        className="w-full p-3 border-2 border-black font-bold"
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-black text-sm uppercase mb-1">WhatsApp Group Link (Optional)</label>
                      <input 
                        type="url" 
                        placeholder="https://chat.whatsapp.com/..."
                        className="w-full p-3 border-2 border-black font-bold"
                        value={newDeptLink}
                        onChange={(e) => setNewDeptLink(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="brutal-btn-primary w-full py-3">Add Department</button>
                  </form>
                </div>
                {editingDept && (
                  <div className="brutal-card p-6 bg-yellow-50">
                    <h3 className="text-xl font-black uppercase mb-6">Edit Department</h3>
                    <form onSubmit={handleUpdateDept} className="space-y-4">
                      <div>
                        <label className="block font-black text-sm uppercase mb-1">Department Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border-2 border-black font-bold"
                          value={editingDept.name}
                          onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-black text-sm uppercase mb-1">WhatsApp Group Link</label>
                        <input 
                          type="url" 
                          className="w-full p-3 border-2 border-black font-bold"
                          value={editingDept.whatsapp_link || ''}
                          onChange={(e) => setEditingDept({ ...editingDept, whatsapp_link: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="brutal-btn-primary flex-grow py-3">Update</button>
                        <button type="button" onClick={() => setEditingDept(null)} className="brutal-btn bg-white px-6 py-3">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="brutal-card p-6 bg-white">
                  <h3 className="text-xl font-black uppercase mb-6">Existing Departments</h3>
                  <div className="space-y-2">
                    {(depts || []).length > 0 ? (
                      depts.map(d => (
                        <div key={d.id} className="p-4 border-2 border-black flex justify-between items-center bg-gray-50">
                          <div className="flex flex-col">
                            <span className="font-bold">{d.name}</span>
                            {d.whatsapp_link && (
                              <span className="text-xs text-green-600 font-bold truncate max-w-[200px]">{d.whatsapp_link}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingDept(d)}
                              className="p-2 hover:bg-blue-100 text-blue-600 transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={async () => {
                                if (confirm('Delete department and all its subjects/resources?')) {
                                  try {
                                    const res = await fetch(`/api/admin/departments/${d.id}`, { 
                                      method: 'DELETE',
                                      headers: getAuthHeaders()
                                    });
                                    if (await checkResponse(res)) {
                                      if (res.ok) {
                                        showMessage('Department deleted');
                                        fetchDepts();
                                        fetchStats();
                                      }
                                    }
                                  } catch (e) { showMessage('Network error', 'error'); }
                                }
                              }}
                              className="text-red-500 hover:scale-110 transition-transform p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 font-bold text-gray-400 italic">No departments added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'subjects' && (
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase">Subject Management</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="brutal-card p-6 bg-white">
                  <h3 className="text-xl font-black uppercase mb-6">Add Subject</h3>
                  <form onSubmit={handleAddSubject} className="space-y-4">
                    <div>
                      <label className="block font-black text-xs uppercase mb-1">Department</label>
                      <select 
                        className="w-full p-3 border-2 border-black font-bold"
                        value={newSubject.department_id}
                        onChange={(e) => setNewSubject({ ...newSubject, department_id: parseInt(e.target.value) })}
                        required
                      >
                        <option value="">Select Department</option>
                        {(depts || []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-black text-xs uppercase mb-1">Semester</label>
                      <select 
                        className="w-full p-3 border-2 border-black font-bold"
                        value={newSubject.semester_number}
                        onChange={(e) => setNewSubject({ ...newSubject, semester_number: parseInt(e.target.value) })}
                        required
                      >
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-black text-xs uppercase mb-1">Subject Name</label>
                      <input 
                        type="text" 
                        placeholder="Subject Name"
                        className="w-full p-3 border-2 border-black font-bold"
                        value={newSubject.subject_name}
                        onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="w-full brutal-btn-primary py-3">Add Subject</button>
                  </form>
                </div>
                <div className="brutal-card p-6 bg-white">
                  <h3 className="text-xl font-black uppercase mb-6">Existing Subjects</h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {(subjects || []).length > 0 ? (
                      subjects.map(s => (
                        <div key={s.id} className="p-4 border-2 border-black flex justify-between items-center bg-gray-50">
                          <div>
                            <span className="font-bold">{s.subject_name}</span>
                            <p className="text-xs font-bold text-gray-500">Sem {s.semester_number}</p>
                          </div>
                          <button 
                            onClick={async () => {
                              if (confirm('Delete subject?')) {
                                try {
                                  const res = await fetch(`/api/admin/subjects/${s.id}`, { 
                                    method: 'DELETE',
                                    headers: getAuthHeaders()
                                  });
                                  if (await checkResponse(res)) {
                                    if (res.ok) {
                                      showMessage('Subject deleted');
                                      fetchSubjects();
                                      fetchStats();
                                    }
                                  }
                                } catch (e) { showMessage('Network error', 'error'); }
                              }
                            }}
                            className="text-red-500 hover:scale-110 transition-transform p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 font-bold text-gray-400 italic">No subjects added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'categories' && (
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase">Category Management</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="brutal-card p-6 bg-white">
                  <h3 className="text-xl font-black uppercase mb-6">Add Category</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const name = (e.currentTarget.elements.namedItem('catName') as HTMLInputElement).value;
                    try {
                      const res = await fetch('/api/admin/categories', {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ name })
                      });
                      if (await checkResponse(res)) {
                        if (res.ok) {
                          showMessage('Category added');
                          (e.currentTarget.elements.namedItem('catName') as HTMLInputElement).value = '';
                          fetchCategories();
                        }
                      }
                    } catch (e) { showMessage('Network error', 'error'); }
                  }} className="flex flex-col sm:flex-row gap-4">
                    <input 
                      name="catName"
                      type="text" 
                      placeholder="Category Name"
                      className="flex-grow p-3 border-2 border-black font-bold"
                      required
                    />
                    <button type="submit" className="brutal-btn-primary px-8 py-3">Add</button>
                  </form>
                </div>
                <div className="brutal-card p-6 bg-white">
                  <h3 className="text-xl font-black uppercase mb-6">Existing Categories</h3>
                  <div className="space-y-2">
                    {(categories || []).map(c => (
                      <div key={c.id} className="p-4 border-2 border-black flex justify-between items-center bg-gray-50">
                        <span className="font-bold">{c.category_name}</span>
                        <button 
                          onClick={async () => {
                            if (confirm('Delete category?')) {
                              try {
                                const res = await fetch(`/api/admin/categories/${c.id}`, { 
                                  method: 'DELETE',
                                  headers: getAuthHeaders()
                                });
                                if (await checkResponse(res)) {
                                  if (res.ok) {
                                    showMessage('Category deleted');
                                    fetchCategories();
                                  }
                                }
                              } catch (e) { showMessage('Network error', 'error'); }
                            }
                          }}
                          className="text-red-500 hover:scale-110 transition-transform p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
