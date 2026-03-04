import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Lock, User } from 'lucide-react';
import Frontend from './components/Frontend';
import AdminPanel from './components/AdminPanel';

type AppView = 'frontend' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [view, setView] = useState<AppView>('frontend');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (retries = 3) => {
    const token = localStorage.getItem('slz_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.loggedIn) {
        setIsLoggedIn(true);
        setView('admin-dashboard');
      } else {
        localStorage.removeItem('slz_token');
      }
    } catch (e: any) {
      console.error('Auth check failed', e);
      if (retries > 0) {
        console.log(`Retrying auth check... (${retries} left)`);
        setTimeout(() => checkAuth(retries - 1), 1000);
        return;
      }
      setLoginError(`Connection error: ${e.message || 'Failed to connect to server'}`);
    } finally {
      if (retries === 0) setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = 'Login failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `Server returned ${res.status}: ${errorText.slice(0, 50)}...`;
        }
        setLoginError(errorMessage);
        return;
      }

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('slz_token', data.token);
        setIsLoggedIn(true);
        setView('admin-dashboard');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (e: any) {
      console.error('Login error:', e);
      setLoginError(`Connection error: ${e.message || 'Unknown error'}`);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('slz_token');
    await fetch('/api/auth/logout', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    localStorage.removeItem('slz_token');
    setIsLoggedIn(false);
    setView('frontend');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-8 border-black border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {view === 'frontend' && (
          <motion.div key="frontend" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Frontend onAdmin={() => setView(isLoggedIn ? 'admin-dashboard' : 'admin-login')} />
          </motion.div>
        )}

        {view === 'admin-login' && (
          <motion.div 
            key="login" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="min-h-screen flex items-center justify-center bg-accent p-4"
          >
            <div className="brutal-card bg-white p-8 w-full max-w-md">
              <div className="flex items-center gap-2 mb-8 justify-center">
                <div className="w-12 h-12 bg-primary border-2 border-black flex items-center justify-center text-white font-black text-2xl shadow-brutal-sm">
                  SLZ
                </div>
                <h2 className="text-2xl font-black uppercase">Admin Login</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block font-black text-sm uppercase mb-2 flex items-center gap-2">
                    <User size={16} /> Username
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 border-4 border-black font-bold focus:bg-blue-50 transition-colors"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-2 flex items-center gap-2">
                    <Lock size={16} /> Password
                  </label>
                  <input 
                    type="password" 
                    className="w-full p-3 border-4 border-black font-bold focus:bg-blue-50 transition-colors"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                
                {loginError && (
                  <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm flex items-center gap-2">
                    <ShieldAlert size={16} /> {loginError}
                  </div>
                )}

                <button type="submit" className="w-full brutal-btn-primary py-4 text-lg">
                  Login to Dashboard
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setView('frontend')}
                  className="w-full text-center font-bold text-gray-500 hover:text-black transition-colors"
                >
                  Back to Website
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {view === 'admin-dashboard' && isLoggedIn && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminPanel onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

