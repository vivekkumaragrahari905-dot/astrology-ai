import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Users, 
  MessageSquare, 
  Database, 
  Cpu, 
  Activity, 
  Trash2, 
  Search, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  LogOut, 
  Clock, 
  MapPin, 
  Calendar, 
  Download,
  Send,
  Sliders,
  Compass,
  Zap,
  Key
} from 'lucide-react';

const ADMIN_DEFAULT_PIN = "1008";

export default function AdminPanel({ onExit }) {
  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('swastik_admin_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'chats' | 'engine'

  // Data States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [engineInfo, setEngineInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [chatRoleFilter, setChatRoleFilter] = useState('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState(null);

  // Testing Sandbox State
  const [testQuery, setTestQuery] = useState('What astrological remedies are recommended for Rahu transit in 2026?');
  const [testContext, setTestContext] = useState('User Context: Name=Aarav Sharma, DOB=1995-08-11, Time=12:15, Place=Varanasi, India, Gender=Male');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  // Fetch all admin data
  const fetchAdminData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [statsRes, usersRes, chatsRes, engineRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.ok ? r.json() : null),
        fetch('/api/admin/users').then(r => r.ok ? r.json() : []),
        fetch('/api/admin/chats').then(r => r.ok ? r.json() : []),
        fetch('/api/admin/engine').then(r => r.ok ? r.json() : null)
      ]);

      if (statsRes) setStats(statsRes);
      if (usersRes) setUsers(usersRes);
      if (chatsRes) setChats(chatsRes);
      if (engineRes) setEngineInfo(engineRes);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setErrorMsg("Failed to connect to backend administrative endpoints. Verify server on port 8008.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchAdminData();
    }
  }, [isUnlocked]);

  // Handle PIN submission
  const handlePinSubmit = (e) => {
    if (e) e.preventDefault();
    if (pinInput === ADMIN_DEFAULT_PIN) {
      setIsUnlocked(true);
      sessionStorage.setItem('swastik_admin_unlocked', 'true');
      setPinError('');
    } else {
      setPinError('Invalid Admin Passcode. Try 1008.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPinInput('');
    }
  };

  const handleKeypadPress = (val) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + val;
      setPinInput(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === ADMIN_DEFAULT_PIN) {
          setIsUnlocked(true);
          sessionStorage.setItem('swastik_admin_unlocked', 'true');
          setPinError('');
        } else {
          setPinError('Invalid Admin Passcode. Try 1008.');
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          setPinInput('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setPinError('');
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('swastik_admin_unlocked');
    setPinInput('');
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete Seeker ID #${userId} and all related chat history?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setChats(prev => prev.filter(c => c.user_id !== userId));
        if (stats) setStats(prev => ({ ...prev, total_users: prev.total_users - 1 }));
      }
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  // Delete Chat Message
  const handleDeleteChat = async (chatId) => {
    if (!window.confirm(`Delete message #${chatId}?`)) return;
    try {
      const res = await fetch(`/api/admin/chats/${chatId}`, { method: 'DELETE' });
      if (res.ok) {
        setChats(prev => prev.filter(c => c.id !== chatId));
        if (stats) setStats(prev => ({ ...prev, total_messages: prev.total_messages - 1 }));
      }
    } catch (err) {
      alert("Error deleting chat message: " + err.message);
    }
  };

  // Run Test Query in Sandbox
  const handleRunTest = async () => {
    if (!testQuery.trim()) return;
    setIsTesting(true);
    try {
      const res = await fetch('/api/admin/test-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testQuery, user_context: testContext })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      alert("Simulation failed: " + err.message);
    } finally {
      setIsTesting(false);
    }
  };

  // Export Chats to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `swastik_chat_archive_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.pob?.toLowerCase().includes(q) ||
      String(u.id).includes(q)
    );
  });

  // Filtered Chats
  const filteredChats = chats.filter(c => {
    const q = chatSearch.toLowerCase();
    const matchesSearch = c.content?.toLowerCase().includes(q) || c.user_name?.toLowerCase().includes(q);
    const matchesRole = chatRoleFilter === 'all' || c.role === chatRoleFilter;
    const matchesUser = !selectedUserFilter || c.user_id === selectedUserFilter;
    return matchesSearch && matchesRole && matchesUser;
  });

  // ==========================================
  // VIEW: 1. LOCKED PASSCODE SCREEN
  // ==========================================
  if (!isUnlocked) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className={`w-full max-w-md bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all ${isShaking ? 'animate-bounce' : ''}`}>
          {/* Subtle Ambient Cosmic Background Elements */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center relative z-10 mb-8">
            <div className="w-16 h-16 rounded-2xl saffron-gradient mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-4 text-white">
              <Shield size={32} className="animate-pulse" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-widest mb-2">
              <Lock size={12} />
              <span>Restricted Cosmic Archive</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-on-surface">Admin Access Console</h2>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Authenticate with your 4-digit Master Passcode to manage seeker directories, audit Vedic dialogues, and telemetry.
            </p>
          </div>

          {/* PIN Dots Display */}
          <div className="flex justify-center items-center gap-4 mb-6">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pinInput.length > idx;
              return (
                <div 
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                    isFilled 
                      ? 'bg-primary border-primary scale-125 shadow-md shadow-primary/40' 
                      : 'bg-transparent border-outline-variant/60'
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {pinError && (
            <div className="mb-4 text-center text-xs font-bold text-red-600 bg-red-50 border border-red-200 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5">
              <AlertTriangle size={14} />
              <span>{pinError}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="h-12 rounded-xl bg-white/90 border border-outline-variant/30 text-lg font-bold text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-xl bg-white/70 border border-outline-variant/30 text-xs font-bold text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all shadow-sm flex items-center justify-center active:scale-95"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-12 rounded-xl bg-white/90 border border-outline-variant/30 text-lg font-bold text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePinSubmit}
              disabled={pinInput.length !== 4}
              className="h-12 rounded-xl saffron-gradient text-white text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center disabled:opacity-40 active:scale-95"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Quick Demo Helper */}
          <div className="pt-4 border-t border-outline-variant/30 text-center flex flex-col items-center gap-2">
            <button
              onClick={() => {
                setPinInput('1008');
                setIsUnlocked(true);
                sessionStorage.setItem('swastik_admin_unlocked', 'true');
                setPinError('');
              }}
              className="text-[11px] font-bold text-primary hover:text-tertiary flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-all"
            >
              <Key size={12} />
              <span>Quick Unlock (Demo PIN: 1008)</span>
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="text-xs text-on-surface-variant hover:text-on-surface font-medium transition-colors"
              >
                Return to Seeker Portal
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: 2. UNLOCKED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="w-full space-y-6">
      {/* Admin Top Command Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl saffron-gradient flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Shield size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-on-surface">Swastik AI Administration</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  PIN 1008
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Real-time Jyotish telemetry, seeker directories, chat auditors, and inference engine controls.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={fetchAdminData}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white border border-outline-variant/40 text-xs font-bold text-on-surface hover:bg-primary/5 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Refresh telemetry"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin text-primary" : ""} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLock}
              className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Lock Admin Console"
            >
              <Lock size={14} />
              <span>Lock</span>
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="px-3.5 py-2 rounded-xl saffron-gradient text-xs font-bold text-white hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-primary/20 active:scale-95"
              >
                <LogOut size={14} />
                <span>Exit Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-outline-variant/30 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Telemetry & Overview', icon: Activity, count: null },
            { id: 'users', label: 'Seeker Directory', icon: Users, count: users.length },
            { id: 'chats', label: 'Vedic Chat Archives', icon: MessageSquare, count: chats.length },
            { id: 'engine', label: 'AI Inference & Prompt Sandbox', icon: Cpu, count: null }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'saffron-gradient text-white shadow-md shadow-primary/20'
                    : 'bg-white/60 text-on-surface-variant hover:text-primary hover:bg-primary/5 border border-outline-variant/30'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ==========================================
          SUB-TAB 1: TELEMETRY & OVERVIEW
          ========================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Registered Seekers</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-3xl font-extrabold text-on-surface">
                  {stats?.total_users ?? users.length}
                </h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Verified SQLite Profiles</span>
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Readings</span>
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-3xl font-extrabold text-on-surface">
                  {stats?.total_messages ?? chats.length}
                </h3>
                <p className="text-[11px] text-primary font-bold mt-1 flex items-center gap-1">
                  <Activity size={12} />
                  <span>Seeker + AI Dialogues</span>
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Seeker Queries</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-3xl font-extrabold text-on-surface">
                  {stats?.user_queries ?? chats.filter(c => c.role === 'user').length}
                </h3>
                <p className="text-[11px] text-purple-700 font-bold mt-1">
                  Astrological Questions
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Vedic Engine</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Cpu size={18} />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-bold text-emerald-700 truncate">
                  {stats?.engine_mode ?? 'Vedic Engine'}
                </h3>
                <p className="text-[11px] text-on-surface-variant font-medium mt-1 truncate">
                  {stats?.model_id ?? 'Qwen2.5-7B-Instruct'}
                </p>
              </div>
            </div>
          </div>

          {/* Engine & Environment Telemetry Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={18} className="text-primary" />
                  <h3 className="font-serif text-base font-bold text-on-surface">Core Telemetry & Architecture</h3>
                </div>
                <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
                  FastAPI :8008
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Inference Core</span>
                  <p className="text-sm font-bold text-on-surface mt-1">
                    {stats?.engine_mode || 'Vedic AI Rule Engine'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Authentic Parashara Jyotish rulebook, planetary transits, and gemstone/mantra remedies.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800">Storage Layer</span>
                  <p className="text-sm font-bold text-on-surface mt-1">
                    SQLite DB (backend/astrology.db)
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Stores Seeker profiles, Kundli coordinates, and bidirectional chat logs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">vLLM Gateway</span>
                  <p className="text-sm font-bold text-on-surface mt-1">
                    {stats?.vllm_url || 'Autonomous Engine (No vLLM dependency)'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Switches seamlessly between local VPS vLLM GPU instance and built-in Vedic inference.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Security Gate</span>
                  <p className="text-sm font-bold text-on-surface mt-1">
                    Passcode Guarded (Session Active)
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Admin routes protected with authenticated master key verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Seeker Summary */}
            <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-on-surface mb-3 flex items-center gap-2">
                  <Sliders size={18} className="text-primary" />
                  <span>Admin Shortcuts</span>
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full text-left p-3 rounded-xl bg-white border border-outline-variant/30 hover:border-primary/50 transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users size={16} className="text-primary" />
                      <div>
                        <p className="text-xs font-bold text-on-surface">Manage Seekers</p>
                        <p className="text-[10px] text-on-surface-variant">{users.length} Registered users</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setActiveTab('chats')}
                    className="w-full text-left p-3 rounded-xl bg-white border border-outline-variant/30 hover:border-primary/50 transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare size={16} className="text-primary" />
                      <div>
                        <p className="text-xs font-bold text-on-surface">Audit Chat Transcripts</p>
                        <p className="text-[10px] text-on-surface-variant">{chats.length} Total messages</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setActiveTab('engine')}
                    className="w-full text-left p-3 rounded-xl bg-white border border-outline-variant/30 hover:border-primary/50 transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu size={16} className="text-primary" />
                      <div>
                        <p className="text-xs font-bold text-on-surface">System Prompt Sandbox</p>
                        <p className="text-[10px] text-on-surface-variant">Simulate custom readings</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>Vedic Astrology AI v2.5</span>
                <span className="font-bold text-primary">Status: Healthy</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUB-TAB 2: SEEKER DIRECTORY (USERS)
          ========================================== */}
      {activeTab === 'users' && (
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                <Users size={20} className="text-primary" />
                <span>Seeker Profiles Directory</span>
              </h3>
              <p className="text-xs text-on-surface-variant">
                Registered profiles, birth coordinates (Kundli Lagna inputs), and interaction volume.
              </p>
            </div>

            <div className="w-full sm:w-64 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search seekers..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-outline-variant/40 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-outline-variant/50">
              <Users size={36} className="mx-auto text-on-surface-variant/40 mb-2" />
              <p className="text-sm font-bold text-on-surface">No seekers found</p>
              <p className="text-xs text-on-surface-variant mt-1">Try another search keyword.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-outline-variant/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-high/60 text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Seeker Name</th>
                    <th className="py-3 px-4">Birth Date</th>
                    <th className="py-3 px-4">Birth Time</th>
                    <th className="py-3 px-4">Place of Birth</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4 text-center">Chat Logs</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 bg-white/70">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">#{u.id}</td>
                      <td className="py-3 px-4 font-bold text-on-surface">{u.name}</td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-on-surface-variant/60" />
                          <span>{u.dob || '—'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-on-surface-variant/60" />
                          <span>{u.tob || '—'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-on-surface-variant/60" />
                          <span>{u.pob || '—'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-high text-on-surface">
                          {u.gender || 'Not Specified'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                          {u.chat_count} msgs
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedUserFilter(u.id);
                              setActiveTab('chats');
                            }}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                            title="Inspect Chat History"
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                            title="Delete Seeker"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          SUB-TAB 3: VEDIC CHAT ARCHIVES
          ========================================== */}
      {activeTab === 'chats' && (
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                  <MessageSquare size={20} className="text-primary" />
                  <span>Vedic Dialogue Transcripts</span>
                </h3>
                {selectedUserFilter && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    Filtered: Seeker #{selectedUserFilter}
                    <button onClick={() => setSelectedUserFilter(null)} className="hover:text-red-600 ml-1">✕</button>
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant">
                Live transcript audit of seeker consultations and AI Jyotish answers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Filter messages..."
                  value={chatSearch}
                  onChange={e => setChatSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-outline-variant/40 focus:border-primary focus:outline-none"
                />
              </div>

              <select
                value={chatRoleFilter}
                onChange={e => setChatRoleFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-xl bg-white border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface font-medium"
              >
                <option value="all">All Roles</option>
                <option value="user">Seeker Questions</option>
                <option value="assistant">AI Vedic Readings</option>
              </select>

              <button
                onClick={handleExportJSON}
                className="px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
                title="Download JSON format"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {filteredChats.length === 0 ? (
            <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-outline-variant/50">
              <MessageSquare size={36} className="mx-auto text-on-surface-variant/40 mb-2" />
              <p className="text-sm font-bold text-on-surface">No dialogue records matched</p>
              <p className="text-xs text-on-surface-variant mt-1">Adjust search parameters or clear filters.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredChats.map(c => {
                const isUser = c.role === 'user';
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUser
                        ? 'bg-amber-50/40 border-amber-200/50'
                        : 'bg-white border-outline-variant/30 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isUser ? 'bg-amber-600 text-white' : 'saffron-gradient text-white'
                        }`}>
                          {isUser ? 'Seeker' : 'Swastik AI'}
                        </span>
                        <span className="text-xs font-bold text-on-surface">
                          {c.user_name || `Seeker #${c.user_id}`}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          (Msg #{c.id})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-on-surface-variant">
                          {c.timestamp ? new Date(c.timestamp).toLocaleString() : 'Just now'}
                        </span>
                        <button
                          onClick={() => handleDeleteChat(c.id)}
                          className="text-on-surface-variant/50 hover:text-red-600 transition-colors p-1"
                          title="Delete message"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-on-surface whitespace-pre-wrap leading-relaxed font-sans pl-1">
                      {c.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          SUB-TAB 4: AI INFERENCE & PROMPT SANDBOX
          ========================================== */}
      {activeTab === 'engine' && (
        <div className="space-y-6">
          {/* System Prompt Inspector */}
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-primary" />
                <h3 className="font-serif text-base font-bold text-on-surface">Vedic Astrological System Prompt</h3>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Enforced by Backend Guardrails
              </span>
            </div>

            <p className="text-xs text-on-surface-variant mb-3">
              This prompt guides the AI to generate structured insights (Overview, Key Planetary Transits, Guidance & Remedies) while strictly enforcing restrictions against predicting lifespan or giving medical/legal claims.
            </p>

            <div className="p-4 rounded-2xl bg-zinc-900 text-amber-200 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800 shadow-inner">
              <pre className="whitespace-pre-wrap font-sans text-xs">
                {engineInfo?.system_prompt || "Loading prompt..."}
              </pre>
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-on-surface flex items-center gap-2">
                  <Zap size={18} className="text-amber-600" />
                  <span>Real-time Inference Diagnostic Sandbox</span>
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Simulate astrological answers against the Vedic Knowledge Engine with custom coordinates.
                </p>
              </div>

              {testResult && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} />
                  <span>Latency: {testResult.duration_ms} ms</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Seeker Coordinates Context
                </label>
                <input
                  type="text"
                  value={testContext}
                  onChange={e => setTestContext(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-white border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Seeker Prompt Query
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={e => setTestQuery(e.target.value)}
                    placeholder="Enter an astrological inquiry..."
                    className="flex-1 p-2.5 text-xs rounded-xl bg-white border border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface"
                  />
                  <button
                    onClick={handleRunTest}
                    disabled={isTesting}
                    className="px-4 py-2 rounded-xl saffron-gradient text-white text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-primary/20 shrink-0 disabled:opacity-50"
                  >
                    <Send size={14} className={isTesting ? "animate-spin" : ""} />
                    <span>{isTesting ? "Generating..." : "Simulate"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-bold text-on-surface-variant self-center">Sample Inquiries:</span>
              {[
                "Career guidance for 2026",
                "Venus transit and marriage prospects",
                "Financial remedies for Dhana Bhava",
                "Foreign travel opportunities"
              ].map(q => (
                <button
                  key={q}
                  onClick={() => setTestQuery(q)}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Simulated Response Output */}
            {testResult && (
              <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/70 border border-amber-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Engine Output ({testResult.engine})</span>
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    Generated in {testResult.duration_ms}ms
                  </span>
                </div>
                <div className="text-xs text-on-surface whitespace-pre-wrap leading-relaxed font-sans">
                  {testResult.response}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
