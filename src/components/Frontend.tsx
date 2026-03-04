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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Department, Resource, Subject, Category } from '../types';

const PLATFORMS = [
  { title: 'Official Website', icon: <Globe />, desc: 'Access the main university portal.', color: 'bg-blue-100', link: 'https://studentslearningzone.site/' },
  { title: 'Books Store', icon: <ShoppingBag />, desc: 'Get your academic books easily.', color: 'bg-yellow-100', link: 'https://books.studentslearningzone.site/' },
  { title: 'WhatsApp Channel', icon: <MessageCircle />, desc: 'Stay updated with real-time news.', color: 'bg-green-100', link: 'https://whatsapp.com/channel/0029Vb6nPjuAojYoZdD8GQ1i' },
  { title: 'Instagram Page', icon: <Instagram />, desc: 'Follow us for campus highlights.', color: 'bg-pink-100', link: 'https://www.instagram.com/students_learning_zone2025?igsh=d3ZncHlpZWQ4bzZ0' },
];

const SOCIETIES = [
  { title: 'SLZ Library', icon: <Library />, desc: 'Digital repository of knowledge.', color: 'bg-indigo-100', link: 'https://chat.whatsapp.com/EeLotj5ox18IQdgFcM6zGh' },
  { title: 'SLZ Explorers Society', icon: <Compass />, desc: 'Adventure and learning combined.', color: 'bg-orange-100', link: 'https://chat.whatsapp.com/G6U8ubBhV8kBd9cwd8qZLn' },
  { title: 'SLZ Jobs & Career Network', icon: <Briefcase />, desc: 'Your bridge to professional life.', color: 'bg-emerald-100', link: 'https://chat.whatsapp.com/Cqo75fJ5TO73ETZbPQ5Afo' },
  { title: 'SLZ Complaint Area', icon: <ShieldAlert />, desc: 'We are here to listen and help.', color: 'bg-red-100', link: 'https://chat.whatsapp.com/KNX6FMfQJyrCcnuWgIFha9' },
];

const Navbar = ({ onHome, onAdmin }: { onHome: () => void; onAdmin: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onHome}>
          <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center text-white font-black text-xl shadow-brutal-sm group-hover:-rotate-6 transition-transform">
            SLZ
          </div>
          <span className="font-black text-xl tracking-tighter hidden sm:block">STUDENTS LEARNING ZONE</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-bold">
          <button onClick={onHome} className="hover:text-primary transition-colors">Home</button>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#departments" className="hover:text-primary transition-colors">Departments</a>
          <button onClick={onAdmin} className="hover:text-primary transition-colors">Admin</button>
          <button 
            onClick={() => alert('Community feature coming soon! Join our WhatsApp for now.')}
            className="brutal-btn brutal-btn-accent py-2 px-4 text-sm"
          >
            Join Community
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
            className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black p-4 flex flex-col gap-4 font-bold"
          >
            <button onClick={() => { onHome(); setIsOpen(false); }} className="text-left">Home</button>
            <a href="#about" onClick={() => setIsOpen(false)}>About</a>
            <a href="#departments" onClick={() => setIsOpen(false)}>Departments</a>
            <button onClick={() => { onAdmin(); setIsOpen(false); }}>Admin</button>
            <button className="brutal-btn brutal-btn-accent w-full">Join Community</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
  <div className="brutal-card p-4 flex flex-col gap-3 group">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FileText className="text-primary" size={20} />
        <span className="font-bold">{resource.title}</span>
      </div>
      <span className="text-xs font-black uppercase bg-black text-white px-2 py-1">{resource.category_name}</span>
    </div>
    <p className="text-sm font-bold text-gray-600">{resource.subject_name}</p>
    <div className="grid grid-cols-1 gap-2 mt-2">
      <a 
        href={resource.drive_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="brutal-btn brutal-btn-primary py-1 px-2 text-xs flex items-center justify-center gap-1"
      >
        <ExternalLink size={14} /> Open Drive Folder
      </a>
    </div>
  </div>
);

const DepartmentPage = ({ dept, onBack }: { dept: Department, onBack: () => void }) => {
  const [activeSemester, setActiveSemester] = useState(1);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [dept.id, activeSemester]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resources?department_id=${dept.id}&semester=${activeSemester}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={onBack} className="brutal-btn bg-white mb-8 flex items-center gap-2 hover:bg-gray-50">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="brutal-card bg-primary text-white p-8 mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase">{dept.name}</h1>
          <p className="text-xl opacity-90 font-bold">Academic Resources & Support Portal</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <button
            key={sem}
            onClick={() => setActiveSemester(sem)}
            className={`brutal-btn ${activeSemester === sem ? 'brutal-btn-accent' : 'bg-white text-black'} py-2 px-4`}
          >
            Semester {sem}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <BookOpen className="text-primary" /> Semester {activeSemester} Resources
            </h2>
            {loading ? (
              <p className="font-bold">Loading resources...</p>
            ) : resources.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {(resources || []).map(r => <ResourceCard key={r.id} resource={r} />)}
              </div>
            ) : (
              <div className="brutal-card p-12 bg-gray-50 text-center">
                <p className="font-black text-xl mb-2">No resources found yet.</p>
                <p className="font-bold text-gray-500">The admin is working on uploading materials for this semester.</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="brutal-card p-6 bg-green-50">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <MessageCircle className="text-green-600" /> Community
            </h3>
            <p className="font-bold mb-4">Join the official WhatsApp group for {dept.name} students.</p>
            <button 
              onClick={() => window.open(dept.whatsapp_link || 'https://chat.whatsapp.com/channel/0029Vb6nPjuAojYoZdD8GQ1i', '_blank')}
              className="brutal-btn bg-green-500 text-white w-full flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Join WhatsApp Group
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Frontend({ onAdmin }: { onAdmin: () => void }) {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = (retries = 3) => {
      fetch('/api/departments')
        .then(res => res.json())
        .then(data => {
          setDepartments(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          if (retries > 0) {
            setTimeout(() => fetchDepts(retries - 1), 1000);
          } else {
            setLoading(false);
          }
        });
    };
    fetchDepts();
  }, []);

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
        <Navbar onHome={() => setSelectedDept(null)} onAdmin={onAdmin} />
        <main className="flex-grow">
          <DepartmentPage dept={selectedDept} onBack={() => setSelectedDept(null)} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onHome={() => setSelectedDept(null)} onAdmin={onAdmin} />

      {/* Hero */}
      <header className="relative py-20 md:py-32 px-4 overflow-hidden bg-white border-b-4 border-black">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-accent border-2 border-black px-4 py-1 font-black text-sm mb-6 shadow-brutal-sm -rotate-2">
              ESTABLISHED 2026
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none uppercase">
              Welcome to <br />
              <span className="text-primary">Students Learning Zone</span> – PU
            </h1>
            <p className="text-xl md:text-2xl font-bold mb-10 max-w-2xl mx-auto text-gray-700">
              A Zone Built for Students. Quality education support, academic resources, and career guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#departments" className="brutal-btn brutal-btn-primary text-lg flex items-center justify-center gap-2">
                Join Your Department <ChevronRight />
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-accent border-b-4 border-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="brutal-card bg-white p-8 rotate-1">
            <h2 className="text-4xl font-black mb-6 uppercase">About SLZ</h2>
            <p className="text-xl font-bold leading-relaxed mb-6">
              Students Learning Zone (SLZ) is a student-driven platform that provides quality education support, academic resources, career guidance, and a strong learning community for university students.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-black uppercase">Our Mission</h3>
            <p className="text-lg font-bold">To empower every student at PU with the tools they need to excel academically and professionally through collaborative learning.</p>
          </div>
        </div>
      </section>

      {/* Societies */}
      <section id="societies" className="py-20 px-4 bg-accent border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-12">Societies & Support Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOCIETIES.map((soc, idx) => (
              <a 
                key={idx}
                href={soc.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`brutal-card p-6 ${soc.color} hover:-translate-y-1 transition-transform cursor-pointer block`}
              >
                <div className="w-12 h-12 brutal-border bg-white flex items-center justify-center mb-4">
                  {React.cloneElement(soc.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-xl font-black uppercase mb-2">{soc.title}</h3>
                <p className="font-bold text-sm opacity-80">{soc.desc}</p>
                <div className="mt-4 flex items-center gap-1 font-black text-xs uppercase">
                  Join Now <ChevronRight size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-20 px-4 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-12">Official Platforms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORMS.map((plat, idx) => (
              <a 
                key={idx}
                href={plat.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`brutal-card p-6 ${plat.color} hover:-translate-y-1 transition-transform cursor-pointer block`}
              >
                <div className="w-12 h-12 brutal-border bg-white flex items-center justify-center mb-4">
                  {React.cloneElement(plat.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-xl font-black uppercase mb-2">{plat.title}</h3>
                <p className="font-bold text-sm opacity-80">{plat.desc}</p>
                <div className="mt-4 flex items-center gap-1 font-black text-xs uppercase">
                  Visit Platform <ChevronRight size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="py-20 px-4 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-12">Academic Departments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.length > 0 ? (
              departments.map((dept) => (
                <button 
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  className="brutal-card p-6 text-left flex flex-col gap-4 group hover:bg-primary hover:text-white transition-all hover:-translate-y-1"
                >
                  <div className="w-16 h-16 brutal-border bg-accent flex items-center justify-center text-black group-hover:bg-white transition-colors">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase leading-tight">{dept.name}</h3>
                  <div className="flex items-center gap-2 mt-auto font-bold text-sm">
                    View Resources <ChevronRight size={16} />
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-4 border-dashed border-black bg-gray-50">
                <p className="text-2xl font-black uppercase mb-2">No Departments Available</p>
                <p className="font-bold text-gray-500">Please check back later or contact the administrator.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const Footer = () => (
  <footer className="bg-white border-t-4 border-black py-16 px-4">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-primary border-2 border-black flex items-center justify-center text-white font-black text-2xl shadow-brutal-sm">
            SLZ
          </div>
          <span className="font-black text-2xl tracking-tighter">STUDENTS LEARNING ZONE</span>
        </div>
        <p className="font-bold text-gray-600 max-w-md mb-8">
          The ultimate academic hub for PU students. Empowering education through community and shared resources.
        </p>
      </div>
      <div>
        <h4 className="font-black uppercase mb-6 text-lg">Quick Links</h4>
        <ul className="space-y-4 font-bold">
          <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
          <li><a href="#departments" className="hover:text-primary transition-colors">Departments</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black uppercase mb-6 text-lg">Contact</h4>
        <p className="font-bold">© 2026 Students Learning Zone – PU</p>
      </div>
    </div>
  </footer>
);
