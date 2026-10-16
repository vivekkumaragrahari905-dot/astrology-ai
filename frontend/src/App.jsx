import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Lock, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Send, 
  X, 
  Compass, 
  Heart, 
  Briefcase, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Shield,
  Award, 
  CheckCircle,
  HelpCircle,
  LogIn,
  LogOut,
  Users,
  Sun,
  BookOpen,
  Zap,
  Calculator,
  ChevronRight,
  Plus
} from 'lucide-react';
import AdminPanel from './AdminPanel';

// Custom Swastik SVG Icon component
const SwastikIcon = ({ className = "w-5 h-5", size = 20 }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Center cross */}
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="4" y1="12" x2="20" y2="12" />
    {/* Clockwise hooks */}
    <path d="M 12 4 L 18 4" />
    <path d="M 20 12 L 20 18" />
    <path d="M 12 20 L 6 20" />
    <path d="M 4 12 L 4 6" />
    {/* Quadrant dots */}
    <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

// Custom Book Cover Component for Reports Storefront
const ReportCover = ({ title, type, icon }) => {
  let gradient = "from-[#a33900] to-[#cc4900]"; // default saffron
  if (type === 'wealth') gradient = "from-[#1b4332] to-[#40916c]"; // green
  if (type === 'love') gradient = "from-[#5a189a] to-[#9d4edd]"; // purple
  if (type === 'general') gradient = "from-[#03045e] to-[#0077b6]"; // dark blue
  
  return (
    <div className={`w-full aspect-[3/4] bg-gradient-to-br ${gradient} p-4 rounded-2xl flex flex-col justify-between border-2 border-amber-300/30 relative shadow-inner overflow-hidden select-none`}>
      <div className="absolute inset-0 opacity-[0.06] flex items-center justify-center pointer-events-none">
        <span className="material-symbols-outlined text-[100px]">grid_view</span>
      </div>
      <div className="flex justify-between items-start relative z-10">
        <span className="text-[9px] font-bold text-amber-300/90 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded">Swastik AI</span>
        <span className="material-symbols-outlined text-amber-200 text-sm">{icon || 'auto_awesome'}</span>
      </div>
      <div className="my-auto text-center relative z-10 flex flex-col items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-amber-200 mb-2 border border-white/10">
          <span className="material-symbols-outlined text-base">{icon || 'auto_awesome'}</span>
        </div>
        <h4 className="font-serif text-xs font-bold text-white leading-tight px-1">{title}</h4>
      </div>
      <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-1.5 text-[8px] text-amber-200/60 font-bold uppercase tracking-wider">
        <span>Vedic Analysis</span>
        <span>2026-27</span>
      </div>
    </div>
  );
};

// 12 Zodiac signs details
const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', sanskrit: 'Mesha', dates: 'Mar 21 - Apr 19', element: 'Fire', planet: 'Mars', symbol: '♈', desc: 'A day full of creative energy. Take bold initiatives.', scores: { love: 85, career: 90, health: 75 } },
  { id: 'taurus', name: 'Taurus', sanskrit: 'Vrishabha', dates: 'Apr 20 - May 20', element: 'Earth', planet: 'Venus', symbol: '♉', desc: 'Focus on financial contracts and long term plans.', scores: { love: 90, career: 80, health: 85 } },
  { id: 'gemini', name: 'Gemini', sanskrit: 'Mithuna', dates: 'May 21 - Jun 20', element: 'Air', planet: 'Mercury', symbol: '♊', desc: 'Communication yields great results. Connect with peers.', scores: { love: 75, career: 85, health: 90 } },
  { id: 'cancer', name: 'Cancer', sanskrit: 'Karka', dates: 'Jun 21 - Jul 22', element: 'Water', planet: 'Moon', symbol: '♋', desc: 'Focus on emotional well-being and home stability today.', scores: { love: 80, career: 70, health: 95 } },
  { id: 'leo', name: 'Leo', sanskrit: 'Simha', dates: 'Jul 23 - Aug 22', element: 'Fire', planet: 'Sun', symbol: '♌', desc: 'High energy day. Radiate confidence in meetings.', scores: { love: 95, career: 90, health: 80 } },
  { id: 'virgo', name: 'Virgo', sanskrit: 'Kanya', dates: 'Aug 23 - Sep 22', element: 'Earth', planet: 'Mercury', symbol: '♍', desc: 'Attention to detail helps you resolve pending chores.', scores: { love: 70, career: 95, health: 85 } },
  { id: 'libra', name: 'Libra', sanskrit: 'Tula', dates: 'Sep 23 - Oct 22', element: 'Air', planet: 'Venus', symbol: '♎', desc: 'Financial gains are predicted from old assets.', scores: { love: 88, career: 85, health: 90 } },
  { id: 'scorpio', name: 'Scorpio', sanskrit: 'Vrishchika', dates: 'Oct 23 - Nov 21', element: 'Water', planet: 'Mars/Pluto', symbol: '♏', desc: 'Intense day. Meditation brings deep focus and clarity.', scores: { love: 90, career: 75, health: 80 } },
  { id: 'sagittarius', name: 'Sagittarius', sanskrit: 'Dhanu', dates: 'Nov 22 - Dec 21', element: 'Fire', planet: 'Jupiter', symbol: '♐', desc: 'Exploration and learning keep you motivated today.', scores: { love: 80, career: 88, health: 90 } },
  { id: 'capricorn', name: 'Capricorn', sanskrit: 'Makara', dates: 'Dec 22 - Jan 19', element: 'Earth', planet: 'Saturn', symbol: '♑', desc: 'Discipline yields productivity. Avoid delays in work.', scores: { love: 75, career: 90, health: 85 } },
  { id: 'aquarius', name: 'Aquarius', sanskrit: 'Kumbha', dates: 'Jan 20 - Feb 18', element: 'Air', planet: 'Saturn/Uranus', symbol: '♒', desc: 'Innovative ideas flow. Collaborate with communities.', scores: { love: 85, career: 80, health: 88 } },
  { id: 'pisces', name: 'Pisces', sanskrit: 'Meena', dates: 'Feb 19 - Mar 20', element: 'Water', planet: 'Jupiter/Neptune', symbol: '♓', desc: 'Trust your intuition. Avoid rush decisions.', scores: { love: 95, career: 75, health: 80 } }
];

const UserAvatar = ({ user, className = '' }) => {
  if (!user) return <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 1" }}>person</span>;
  
  const isMale = user.gender?.toLowerCase() === 'male';
  let age = 30;
  if (user.dob) {
    const birthYear = new Date(user.dob).getFullYear();
    age = new Date().getFullYear() - birthYear;
  }
  
  let iconName = 'face';
  if (age < 18) {
    iconName = isMale ? 'boy' : 'girl';
  } else if (age > 55) {
    iconName = isMale ? 'elderly' : 'elderly_woman';
  } else {
    iconName = isMale ? 'man' : 'woman'; 
  }

  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 1" }}>
      {iconName}
    </span>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'kundli' | 'chat' | 'reports' | 'panchang'
  const [selectedZodiac, setSelectedZodiac] = useState(ZODIAC_SIGNS[4]); // default Leo
  
  // User Profile
  const [user, setUser] = useState(null);
  
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authPhone, setAuthPhone] = useState('');
  const [authOTP, setAuthOTP] = useState('');
  const [authStep, setAuthStep] = useState(1);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  const [karmaPoints, setKarmaPoints] = useState(120);
  
  // Feedback Modal State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  
  // Kundli Sub-state
  const [kundliChartType, setKundliChartType] = useState('D1'); // 'D1' | 'D9' | 'Moon'
  const [isUpdatingBirthDetails, setIsUpdatingBirthDetails] = useState(false);
  const [birthForm, setBirthForm] = useState({ ...user });

  // Form Fields for Free Horoscope
  const [formName, setFormName] = useState('Krishna');
  const [formGender, setFormGender] = useState('Male');
  const [formDay, setFormDay] = useState(11);
  const [formMonth, setFormMonth] = useState(8);
  const [formYear, setFormYear] = useState(1995);
  const [formHour, setFormHour] = useState(12);
  const [formMinute, setFormMinute] = useState(15);
  const [formSecond, setFormSecond] = useState(0);
  const [formPob, setFormPob] = useState('Bangalore, India');

  // Synchronize form states with user object
  useEffect(() => {
    if (user) {
      setFormName(user.name || '');
      setFormGender(user.gender || 'Male');
      setFormPob(user.pob || '');
      if (user.dob) {
        const [year, month, day] = user.dob.split('-').map(Number);
        if (year) setFormYear(year);
        if (month) setFormMonth(month);
        if (day) setFormDay(day);
      }
      if (user.tob) {
        const [hour, minute, second] = user.tob.split(':').map(Number);
        if (hour !== undefined) setFormHour(hour);
        if (minute !== undefined) setFormMinute(minute);
        if (second !== undefined) setFormSecond(second || 0);
      }
    }
  }, [user]);

  // Daily Ritual State
  const [ritualState, setRitualState] = useState('idle'); // 'idle' | 'pouring' | 'success'
  const [ritualMsg, setRitualMsg] = useState('');
  
  const [showCalendar, setShowCalendar] = useState(false);

  // Premium Reports Catalog Storefront
  const [selectedReport, setSelectedReport] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState('form'); // 'form' | 'processing' | 'success'
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  // AI Chat Messages state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! 🙏 I am Swastik, your Vedic AI guide. I can offer you career, relationship, and spiritual insights based on your birth coordinates.\n\nHow can the stars guide you today? (Note: I do not make predictions about lifespan, medical diagnostics, or legal matters.)",
      timestamp: '09:12 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, botTyping]);

  // Auth Modal handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      if (authStep === 1) {
        setAuthStep(2);
      } else {
        setUser({
          id: 1,
          name: user ? user.name : 'Harshal',
          phone: authPhone || '+91 99999 88888',
          dob: '1995-11-08',
          tob: '12:15',
          pob: 'Mumbai, India',
          gender: 'Male'
        });
        setShowAuthModal(false);
        setAuthStep(1);
        setAuthPhone('');
        setAuthOTP('');
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      setUser({
        id: 1,
        name: 'Harshal',
        phone: '+91 98200 11223',
        dob: '1995-11-08',
        tob: '12:15',
        pob: 'Mumbai, India',
        gender: 'Male'
      });
      setShowAuthModal(false);
    }, 1200);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  // Birth Details update handler
  const handleUpdateBirthDetails = (e) => {
    e.preventDefault();
    setUser({ ...birthForm });
    setIsUpdatingBirthDetails(false);
  };

  const handleGetHoroscope = (e) => {
    e.preventDefault();
    // Simulate getting horoscope and moving to kundli tab
    setActiveTab('kundli');
  };

  // Surya Arghya Ritual activation
  const triggerDailyRitual = () => {
    setRitualState('pouring');
    const chants = [
      '"Om Ghrini Suryaya Namah..."',
      '"Om Hrim Hrum Suryaya Namah..."',
      '"Om Mitraya Namah..."',
      'Solar transits aligning...'
    ];
    
    let index = 0;
    setRitualMsg(chants[0]);
    const chantInterval = setInterval(() => {
      index++;
      if (index < chants.length) {
        setRitualMsg(chants[index]);
      }
    }, 700);

    setTimeout(() => {
      clearInterval(chantInterval);
      setRitualState('success');
      setKarmaPoints(prev => prev + 50);
    }, 3000);
  };

  // Refusal & Safety Aligned Chat Logic
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setBotTyping(true);

    try {
      // Call Vercel backend API endpoint
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id || 1, message: userText })
      });
      
      if (!res.ok) {
        throw new Error('API Error');
      }
      
      const data = await res.json();
      
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error("Chat API error:", err);
      // Fallback
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "🙏 I am having trouble connecting to the cosmic servers right now. Please check your connection and try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setBotTyping(false);
    }
  };

  // Suggestion chip quick triggers
  const handleSuggestionTrigger = (text) => {
    setChatInput(text);
    setTimeout(() => {
      // Simulate input field fill
    }, 50);
  };

  // Checkout modal flow
  const handleStartCheckout = (report) => {
    setSelectedReport(report);
    setCheckoutState('form');
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setCheckoutState('processing');
    setTimeout(() => {
      setCheckoutState('success');
    }, 2000);
  };

  // Render Lagna Chart SVG depending on D1/D9/Moon Selection
  const renderInteractiveChart = () => {
    let housesText = [];
    if (kundliChartType === 'D1') {
      housesText = [
        { id: 1, x: 200, y: 160, label: 'ASC', planets: 'Mo Ju' },
        { id: 2, x: 100, y: 100, label: 'Su', planets: 'Su' },
        { id: 3, x: 70, y: 150, label: '3rd', planets: 'Me' },
        { id: 4, x: 100, y: 200, label: '4th', planets: '' },
        { id: 5, x: 100, y: 300, label: '5th', planets: 'Ma' },
        { id: 6, x: 150, y: 330, label: '6th', planets: 'Ra' },
        { id: 7, x: 200, y: 330, label: '7th', planets: 'Sa' },
        { id: 8, x: 250, y: 330, label: '8th', planets: '' },
        { id: 9, x: 300, y: 300, label: '9th', planets: 'Ve' },
        { id: 10, x: 330, y: 200, label: '10th', planets: '' },
        { id: 11, x: 300, y: 100, label: '11th', planets: 'Me Ra' },
        { id: 12, x: 250, y: 70, label: '12th', planets: 'Ke' }
      ];
    } else if (kundliChartType === 'D9') {
      housesText = [
        { id: 1, x: 200, y: 160, label: 'ASC', planets: 'Ve' },
        { id: 2, x: 100, y: 100, label: '2nd', planets: '' },
        { id: 3, x: 70, y: 150, label: '3rd', planets: 'Ma' },
        { id: 4, x: 100, y: 200, label: '4th', planets: 'Su Ju' },
        { id: 5, x: 100, y: 300, label: '5th', planets: '' },
        { id: 6, x: 150, y: 330, label: '6th', planets: 'Ke' },
        { id: 7, x: 200, y: 330, label: '7th', planets: 'Mo' },
        { id: 8, x: 250, y: 330, label: '8th', planets: 'Sa' },
        { id: 9, x: 300, y: 300, label: '9th', planets: '' },
        { id: 10, x: 330, y: 200, label: '10th', planets: 'Ra' },
        { id: 11, x: 300, y: 100, label: '11th', planets: 'Ju' },
        { id: 12, x: 250, y: 70, label: '12th', planets: 'Me' }
      ];
    } else {
      // Moon Chart (Chandra Kundli)
      housesText = [
        { id: 1, x: 200, y: 160, label: 'ASC', planets: 'Mo' },
        { id: 2, x: 100, y: 100, label: '2nd', planets: 'Ju' },
        { id: 3, x: 70, y: 150, label: '3rd', planets: '' },
        { id: 4, x: 100, y: 200, label: '4th', planets: 'Sa' },
        { id: 5, x: 100, y: 300, label: '5th', planets: 'Su Ve' },
        { id: 6, x: 150, y: 330, label: '6th', planets: 'Me' },
        { id: 7, x: 200, y: 330, label: '7th', planets: 'Ke' },
        { id: 8, x: 250, y: 330, label: '8th', planets: '' },
        { id: 9, x: 300, y: 300, label: '9th', planets: 'Ma' },
        { id: 10, x: 330, y: 200, label: '10th', planets: '' },
        { id: 11, x: 300, y: 100, label: '11th', planets: 'Ra' },
        { id: 12, x: 250, y: 70, label: '12th', planets: '' }
      ];
    }

    return (
      <div className="kundli-grid w-full rounded-xl border border-primary/20 p-2 overflow-hidden shadow-inner max-w-[400px] mx-auto">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Outer Boundary */}
          <rect className="chart-line" height="380" width="380" x="10" y="10" />
          {/* Diagonals */}
          <line className="chart-line" x1="10" x2="390" y1="10" y2="390" />
          <line className="chart-line" x1="10" x2="390" y1="390" y2="10" />
          {/* Inner Diamond */}
          <line className="chart-line" x1="200" x2="10" y1="10" y2="200" />
          <line className="chart-line" x1="10" x2="200" y1="200" y2="390" />
          <line className="chart-line" x1="200" x2="390" y1="390" y2="200" />
          <line className="chart-line" x1="390" x2="200" y1="200" y2="10" />
          
          {/* Render labels and planets dynamically */}
          {housesText.map((house) => (
            <g key={house.id}>
              {/* House label */}
              <text className="planet-node text-[9px] opacity-70" textAnchor="middle" x={house.x} y={house.y}>{house.label}</text>
              {/* Planet text */}
              {house.planets && (
                <text className="planet-node text-xs font-extrabold fill-primary" textAnchor="middle" x={house.x} y={house.y + 16}>{house.planets}</text>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  };

  if (!user && showAuthModal) {
    return (
      <div className="bg-saffron-canvas min-h-screen flex flex-col items-center justify-center font-body-md text-on-surface p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-multiply"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-outline-variant/30 shadow-2xl max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-8">
            <SwastikIcon className="logo-icon text-primary mb-3" size={48} />
            <h1 className="font-headline-lg text-2xl font-extrabold text-primary">Swastik AI</h1>
            <p className="text-xs text-cosmic-dust mt-1 text-center uppercase tracking-widest font-bold">Premium Vedic Guidance</p>
          </div>

          <p className="text-xs font-semibold text-on-surface-variant mb-6 text-center leading-relaxed">
            {authStep === 1 
              ? 'Sign in or create an account to access personalized cosmic insights based on your exact birth coordinates.'
              : 'Enter the 4-digit verification code sent to your phone.'}
          </p>

          {authStep === 1 ? (
            <div className="space-y-4">
              <button className="w-full bg-white border border-outline-variant/40 hover:bg-saffron-canvas/30 py-3 rounded-full text-sm font-bold text-on-surface flex items-center justify-center gap-2 shadow-sm smooth-transition active:scale-95" onClick={handleGoogleLogin}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-6.16-4.53z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-outline-variant/20"></div>
                <span className="flex-shrink mx-4 text-[11px] text-cosmic-dust font-bold uppercase tracking-wider">Or Use Phone</span>
                <div className="flex-grow border-t border-outline-variant/20"></div>
              </div>
              
              <form className="space-y-4" onSubmit={handleAuthSubmit}>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant">Phone Number (10 digits)</label>
                  <input 
                    type="tel" 
                    className="w-full bg-saffron-canvas/10 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 smooth-transition" 
                    required 
                    maxLength="10"
                    pattern="\d{10}"
                    placeholder="9876543210"
                    value={authPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAuthPhone(val);
                    }}
                  />
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-full text-sm font-bold shadow-md smooth-transition active:scale-95 mt-2" disabled={isAuthLoading}>
                  {isAuthLoading ? 'Sending OTP...' : 'Send Verification Code'}
                </button>
              </form>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleAuthSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant text-center block">4-Digit Verification Code</label>
                <input 
                  type="text" 
                  className="w-full bg-saffron-canvas/10 border border-outline-variant/30 rounded-2xl px-4 py-4 text-xl text-center tracking-[0.75em] font-extrabold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 smooth-transition" 
                  required 
                  maxLength="4"
                  pattern="\d{4}"
                  placeholder="1234"
                  value={authOTP}
                  onChange={(e) => setAuthOTP(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" className="flex-1 py-3 border border-outline-variant/30 text-sm font-bold rounded-full hover:bg-saffron-canvas/20 transition-colors" onClick={() => setAuthStep(1)}>Back</button>
                <button type="submit" className="flex-[2] bg-primary hover:bg-primary-container text-white py-3 rounded-full text-sm font-bold shadow-md smooth-transition active:scale-95" disabled={isAuthLoading}>
                  {isAuthLoading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf8f2] min-h-screen flex flex-col font-body-md relative overflow-x-hidden text-on-surface">
      
      {/* Top Header Navigation Bar (Full Desktop Responsiveness) */}
      <header className="bg-saffron-canvas/95 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center h-16">
          
          {/* Logo Brand / User Info */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <SwastikIcon className="logo-icon text-primary animate-pulse" size={24} />
            <div className="flex flex-col">
              <span className="font-label-caps text-[8px] uppercase tracking-widest text-primary font-bold">Vedic Portal</span>
              <h1 className="font-headline-lg-mobile text-base text-primary font-extrabold leading-none">
                Swastik AI
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'kundli', label: 'Kundli', icon: 'auto_awesome' },
              { id: 'chat', label: 'AI Chat', icon: 'chat' },
              { id: 'reports', label: 'Reports', icon: 'description' },
              { id: 'panchang', label: 'Panchang', icon: 'wb_sunny' },
              { id: 'admin', label: 'Admin', icon: 'shield' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Header Right Badges */}
          <div className="flex items-center gap-2.5">
            
            {/* Admin Console Access Button */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`border text-[10px] font-bold rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm smooth-transition active:scale-95 ${
                activeTab === 'admin'
                  ? 'bg-amber-600 border-amber-600 text-white shadow-md'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-800 hover:bg-amber-500/20'
              }`}
              title="Open Admin Console"
            >
              <Shield size={12} className={activeTab === 'admin' ? 'text-white' : 'text-amber-700'} />
              <span>Admin Panel</span>
            </button>

            {/* Karma points badge */}
            <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm smooth-transition hover:bg-primary/20 cursor-pointer" onClick={() => setActiveTab('panchang')}>
              <Sun size={12} className="fill-current animate-spin" style={{ animationDuration: '15s' }} />
              <span>{karmaPoints} PTS</span>
            </div>

            {/* Profile Avatar / Auth button */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-white border border-outline-variant/30 rounded-full pl-1.5 pr-1 py-1 shadow-sm">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-primary text-white flex items-center justify-center select-none">
                  <UserAvatar user={user} className="text-[14px]" />
                </div>
                <span className="text-xs font-bold text-on-surface-variant hidden sm:inline">{user.name}</span>
                <button className="text-on-surface-variant hover:text-error transition-colors p-0.5 rounded-full" onClick={handleSignOut} title="Sign Out">
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <button className="bg-primary hover:bg-primary-container text-white text-[10px] font-bold px-3 py-2 rounded-full flex items-center gap-1.5 shadow-sm smooth-transition active:scale-95" onClick={() => { setAuthStep(1); setShowAuthModal(true); }}>
                <LogIn size={11} />
                Sign In
              </button>
            )}
            
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left/Main Column */}
          <div className={`space-y-6 ${activeTab === 'chat' || activeTab === 'admin' ? 'lg:col-span-12 xl:col-span-12' : 'lg:col-span-8 xl:col-span-9'}`}>

            {/* ADMIN PANEL TAB */}
            {activeTab === 'admin' && (
              <AdminPanel onExit={() => setActiveTab('dashboard')} />
            )}

            {/* 1. PERSONALIZED DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Welcome & Cosmic Alignment */}
                <section>
                  <div className="glass-card rounded-3xl p-6 relative overflow-hidden ai-glow border border-outline-variant/20">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        <span className="font-label-caps text-xs text-secondary font-bold tracking-wider uppercase">Cosmic Alignment</span>
                      </div>
                      <p className="font-headline-lg-mobile text-[22px] md:text-[28px] text-on-surface font-extrabold leading-tight mb-2">
                        Jupiter enters your 10th house today.
                      </p>
                      <p className="font-body-sm text-sm text-on-surface-variant max-w-xl">
                        Expect a surge in professional clarity, {user ? user.name : 'seeker'}. A perfect day for new beginnings in your career. Balance your transits with daily solar offerings.
                      </p>
                    </div>
                    
                    {/* Abstract Mandala Background Shape */}
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 opacity-[0.04] pointer-events-none select-none text-[180px] text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[150px]">star_half</span>
                    </div>
                  </div>
                </section>

                {/* Free Horoscope by Date of Birth Form (Matching reference page) */}
                <section id="focus-form" className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden transition-all duration-300">
                  <div className="absolute -top-10 -left-10 w-36 h-36 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-lg">edit_note</span>
                      </div>
                      <div>
                        <h2 className="font-headline-lg text-lg text-primary font-bold">Free Horoscope by Date of Birth</h2>
                        <p className="text-xs text-cosmic-dust">Please Enter Your Birth Details</p>
                      </div>
                    </div>
                    
                    <hr className="border-outline-variant/10 my-3" />

                    <form onSubmit={handleGetHoroscope} className="space-y-4">
                      {/* Name and Gender Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                            <User size={13} className="text-primary" />
                            <span>Full Name</span>
                          </label>
                          <input 
                            type="text" 
                            className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-cosmic-dust font-medium"
                            required 
                            placeholder="Please Enter Full Name" 
                            value={formName} 
                            onChange={(e) => setFormName(e.target.value)} 
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-primary">wc</span>
                            <span>Gender</span>
                          </label>
                          <select 
                            className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 font-medium"
                            value={formGender} 
                            onChange={(e) => setFormGender(e.target.value)}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Date of Birth Grid */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <Calendar size={13} className="text-primary" />
                          <span>Date of birth</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Day */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Day</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formDay} 
                              onChange={(e) => setFormDay(Number(e.target.value))}
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                          </div>
                          {/* Month */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Month</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formMonth} 
                              onChange={(e) => setFormMonth(Number(e.target.value))}
                            >
                              {[
                                { val: 1, name: 'Jan (1)' },
                                { val: 2, name: 'Feb (2)' },
                                { val: 3, name: 'Mar (3)' },
                                { val: 4, name: 'Apr (4)' },
                                { val: 5, name: 'May (5)' },
                                { val: 6, name: 'Jun (6)' },
                                { val: 7, name: 'Jul (7)' },
                                { val: 8, name: 'Aug (8)' },
                                { val: 9, name: 'Sep (9)' },
                                { val: 10, name: 'Oct (10)' },
                                { val: 11, name: 'Nov (11)' },
                                { val: 12, name: 'Dec (12)' }
                              ].map(m => (
                                <option key={m.val} value={m.val}>{m.name}</option>
                              ))}
                            </select>
                          </div>
                          {/* Year */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Year</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formYear} 
                              onChange={(e) => setFormYear(Number(e.target.value))}
                            >
                              {Array.from({ length: 87 }, (_, i) => 2026 - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Time of Birth Grid */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <Clock size={13} className="text-primary" />
                          <span>Time of birth</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Hour */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Hour</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formHour} 
                              onChange={(e) => setFormHour(Number(e.target.value))}
                            >
                              {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                <option key={hour} value={hour}>{String(hour).padStart(2, '0')}</option>
                              ))}
                            </select>
                          </div>
                          {/* Minute */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Minute</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formMinute} 
                              onChange={(e) => setFormMinute(Number(e.target.value))}
                            >
                              {Array.from({ length: 60 }, (_, i) => i).map(min => (
                                <option key={min} value={min}>{String(min).padStart(2, '0')}</option>
                              ))}
                            </select>
                          </div>
                          {/* Second */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Second</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formSecond} 
                              onChange={(e) => setFormSecond(Number(e.target.value))}
                            >
                              {Array.from({ length: 60 }, (_, i) => i).map(sec => (
                                <option key={sec} value={sec}>{String(sec).padStart(2, '0')}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Place of Birth */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <MapPin size={13} className="text-primary" />
                          <span>Place of Birth</span>
                        </label>
                        <input 
                          type="text" 
                          className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-cosmic-dust font-medium"
                          required 
                          placeholder="e.g. Bangalore, India" 
                          value={formPob} 
                          onChange={(e) => setFormPob(e.target.value)} 
                        />
                      </div>

                      {/* Submit Button */}
                      <button 
                        type="submit" 
                        className="w-full mt-4 saffron-gradient text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-primary/20 smooth-transition active:scale-98 flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={14} />
                        <span>Get Free Horoscope & Cast Kundli</span>
                      </button>
                    </form>
                  </div>
                </section>

                {/* Daily Horoscope Horizontal Selector */}
                <section id="focus-horoscope" className="space-y-3">
                  <div className="flex justify-between items-end">
                    <h2 className="font-headline-lg-mobile text-lg text-primary font-bold">Daily Horoscope</h2>
                    <span className="text-xs text-cosmic-dust italic">Select sign to read today's alignment</span>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 scroll-smooth">
                    {ZODIAC_SIGNS.map((sign) => (
                      <div 
                        key={sign.id} 
                        className={`flex-shrink-0 w-40 glass-card p-4 rounded-2xl smooth-transition cursor-pointer border ${selectedZodiac.id === sign.id ? 'border-primary bg-primary-fixed/30 ring-1 ring-primary/40' : 'border-outline-variant/30 hover:border-primary/40'}`}
                        onClick={() => setSelectedZodiac(sign)}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm ${selectedZodiac.id === sign.id ? 'bg-primary text-white' : 'bg-white text-on-surface-variant'}`}>
                          <span className="text-2xl font-bold">{sign.symbol}</span>
                        </div>
                        <h3 className="font-label-caps text-xs font-bold tracking-wider text-on-surface uppercase mb-0.5">{sign.name}</h3>
                        <span className="text-[10px] text-cosmic-dust block uppercase tracking-wider mb-1">{sign.sanskrit}</span>
                        <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-2 leading-snug">{sign.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Detailed predictions for selected sign */}
                  <div className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm mt-3 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/20 pb-3 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-primary flex items-center gap-2">
                          <span className="text-lg">{selectedZodiac.symbol}</span>
                          <span>{selectedZodiac.name} ({selectedZodiac.sanskrit}) Today's Vitals</span>
                        </h3>
                        <p className="text-xs text-cosmic-dust mt-0.5">Ruling Planet: <strong>{selectedZodiac.planet}</strong> | Element: <strong>{selectedZodiac.element}</strong></p>
                      </div>
                      <div className="bg-divine-purple-light text-secondary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Heart size={12} className="fill-current" />
                        <span>Highly Compatible with Aquarius</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Meters */}
                      <div className="flex items-center gap-3 bg-saffron-canvas/50 p-3 rounded-2xl border border-outline-variant/20">
                        <div className="p-2 rounded-full bg-red-100 text-red-500"><Heart size={16} fill="currentColor" /></div>
                        <div className="flex-1">
                          <div className="text-[11px] text-cosmic-dust font-bold uppercase tracking-wider">Love & Alliance</div>
                          <div className="font-bold text-sm text-on-surface">{selectedZodiac.scores.love}%</div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-red-500 h-full rounded-full" style={{ width: `${selectedZodiac.scores.love}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-saffron-canvas/50 p-3 rounded-2xl border border-outline-variant/20">
                        <div className="p-2 rounded-full bg-amber-100 text-amber-500"><Briefcase size={16} fill="currentColor" /></div>
                        <div className="flex-1">
                          <div className="text-[11px] text-cosmic-dust font-bold uppercase tracking-wider">Career & Wealth</div>
                          <div className="font-bold text-sm text-on-surface">{selectedZodiac.scores.career}%</div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${selectedZodiac.scores.career}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-saffron-canvas/50 p-3 rounded-2xl border border-outline-variant/20">
                        <div className="p-2 rounded-full bg-emerald-100 text-emerald-500"><Activity size={16} /></div>
                        <div className="flex-1">
                          <div className="text-[11px] text-cosmic-dust font-bold uppercase tracking-wider">Health & Energy</div>
                          <div className="font-bold text-sm text-on-surface">{selectedZodiac.scores.health}%</div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedZodiac.scores.health}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-primary/5 rounded-2xl text-xs text-on-surface-variant italic leading-relaxed border-l-2 border-primary/40">
                      "Today, solar aspects support structural growth. Direct conversations about agreements before 01:04 PM will yield favorable results."
                    </div>
                  </div>
                </section>

                {/* Quick Actions Bento Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    className="saffron-gradient p-6 rounded-3xl text-left flex flex-col justify-between h-44 shadow-lg active:scale-98 smooth-transition border border-primary/20"
                    onClick={() => { setActiveTab('chat'); handleSuggestionTrigger("What does my career say this week?"); }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-3xl">psychology_alt</span>
                    </div>
                    <div>
                      <h3 className="text-white font-headline-lg-mobile text-[18px] font-bold leading-tight">Ask Swastik AI</h3>
                      <p className="text-primary-fixed text-xs mt-0.5 opacity-80">Instant guidelines & remedies</p>
                    </div>
                  </button>
                  
                  <button 
                    className="bg-divine-purple-light p-6 rounded-3xl text-left flex flex-col justify-between h-44 border border-secondary/10 active:scale-98 smooth-transition"
                    onClick={() => { setActiveTab('kundli'); }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-3xl">grid_view</span>
                    </div>
                    <div>
                      <h3 className="text-secondary font-headline-lg-mobile text-[18px] font-bold leading-tight">Generate Kundli</h3>
                      <p className="text-on-secondary-container/60 text-xs mt-0.5">Planetary placement & Dasha cycles</p>
                    </div>
                  </button>
                </section>

                {/* Shubh Muhurtas & Caution Periods */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Auspicious Timings Muhurtas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">Shubh Muhurta</h3>
                      <span className="bg-divine-purple-light text-secondary text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">In Progress</span>
                    </div>
                    <div className="shubh-gradient p-5 rounded-2xl text-white shadow-md relative overflow-hidden h-40 flex flex-col justify-between">
                      <div className="absolute -right-4 -top-4 opacity-10 text-[100px] select-none pointer-events-none">
                        <span className="material-symbols-outlined text-[90px]">brightness_high</span>
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-xs">stars</span>
                          <p className="font-label-caps text-[9px] opacity-80 uppercase tracking-wider">ABHIJIT MUHURTA</p>
                        </div>
                        <p className="font-headline-lg-mobile text-xl font-bold mb-1">12:12 PM – 01:04 PM</p>
                        <p className="text-[11px] opacity-90 italic leading-relaxed">Highly favorable for starting new projects, signing contracts, or conducting spiritual rituals.</p>
                      </div>
                    </div>
                  </div>

                  {/* Caution Periods Rahu Kaal */}
                  <div className="space-y-3">
                    <h3 className="font-label-caps text-xs text-error font-bold uppercase tracking-wider">Caution (Inauspicious)</h3>
                    <div className="bg-white border-l-4 border-error p-4 rounded-r-xl shadow-sm space-y-4 border border-outline-variant/30 h-40 flex flex-col justify-center">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">warning</span>
                          </div>
                          <div>
                            <p className="font-label-caps text-[9px] text-cosmic-dust font-bold">RAHU KAAL</p>
                            <p className="font-bold text-xs text-on-surface">07:42 AM – 09:20 AM</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-error/70 font-semibold">Avoid starting tasks</span>
                      </div>
                      <div className="h-px bg-outline-variant/20"></div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-error/10 text-error rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">timer_off</span>
                          </div>
                          <div>
                            <p className="font-label-caps text-[9px] text-cosmic-dust font-bold">GULIKA KAAL</p>
                            <p className="font-bold text-xs text-on-surface">02:15 PM – 03:52 PM</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-cosmic-dust font-semibold">Caution period</span>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* 2. IN-DEPTH KUNDLI ANALYSIS TAB */}
            {activeTab === 'kundli' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Header info */}
                <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-outline-variant/20 pb-4">
                  <div>
                    <span className="text-secondary font-label-caps text-xs tracking-widest font-bold uppercase">Kundli Analysis</span>
                    <h2 className="font-headline-xl text-[24px] md:text-[32px] text-on-surface font-extrabold mt-1">Namaste, {user ? user.name : 'Seeker'}</h2>
                    {user ? (
                      <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                        Born {new Date(user.dob).toLocaleDateString()} • {user.tob} • {user.pob}
                      </p>
                    ) : (
                      <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Please update birth details to cast your birth chart.</p>
                    )}
                  </div>
                  <button 
                    className="bg-primary/10 border border-primary/30 text-primary text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 smooth-transition shadow-sm"
                    onClick={() => {
                      setIsUpdatingBirthDetails(!isUpdatingBirthDetails);
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>{isUpdatingBirthDetails ? 'Close Form' : 'Update Details'}</span>
                  </button>
                </section>

                {/* Birth Details Input Form Drawer */}
                {(!user || isUpdatingBirthDetails) && (
                  <section className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <h3 className="font-headline-lg-mobile text-base text-primary font-bold mb-4">Birth Details Coordinates Intake</h3>
                    <form onSubmit={handleGetHoroscope} className="space-y-4">
                      {/* Name and Gender Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                            <User size={13} className="text-primary" />
                            <span>Full Name</span>
                          </label>
                          <input 
                            type="text" 
                            className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary font-medium"
                            required 
                            placeholder="Please Enter Full Name" 
                            value={formName} 
                            onChange={(e) => setFormName(e.target.value)} 
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-primary">wc</span>
                            <span>Gender</span>
                          </label>
                          <select 
                            className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary font-medium"
                            value={formGender} 
                            onChange={(e) => setFormGender(e.target.value)}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Date of Birth Grid */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <Calendar size={13} className="text-primary" />
                          <span>Date of birth</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Day */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Day</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formDay} 
                              onChange={(e) => setFormDay(Number(e.target.value))}
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                          </div>
                          {/* Month */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Month</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formMonth} 
                              onChange={(e) => setFormMonth(Number(e.target.value))}
                            >
                              {[
                                { val: 1, name: 'Jan (1)' },
                                { val: 2, name: 'Feb (2)' },
                                { val: 3, name: 'Mar (3)' },
                                { val: 4, name: 'Apr (4)' },
                                { val: 5, name: 'May (5)' },
                                { val: 6, name: 'Jun (6)' },
                                { val: 7, name: 'Jul (7)' },
                                { val: 8, name: 'Aug (8)' },
                                { val: 9, name: 'Sep (9)' },
                                { val: 10, name: 'Oct (10)' },
                                { val: 11, name: 'Nov (11)' },
                                { val: 12, name: 'Dec (12)' }
                              ].map(m => (
                                <option key={m.val} value={m.val}>{m.name}</option>
                              ))}
                            </select>
                          </div>
                          {/* Year */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Year</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formYear} 
                              onChange={(e) => setFormYear(Number(e.target.value))}
                            >
                              {Array.from({ length: 87 }, (_, i) => 2026 - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Time of Birth Grid */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <Clock size={13} className="text-primary" />
                          <span>Time of birth</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Hour */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Hour</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formHour} 
                              onChange={(e) => setFormHour(Number(e.target.value))}
                            >
                              {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                <option key={hour} value={hour}>{String(hour).padStart(2, '0')}</option>
                              ))}
                            </select>
                          </div>
                          {/* Minute */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Minute</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formMinute} 
                              onChange={(e) => setFormMinute(Number(e.target.value))}
                            >
                              {Array.from({ length: 60 }, (_, i) => i).map(min => (
                                <option key={min} value={min}>{String(min).padStart(2, '0')}</option>
                              ))}
                            </select>
                          </div>
                          {/* Second */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-cosmic-dust font-bold block uppercase tracking-wider">Second</span>
                            <select 
                              className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary font-medium"
                              value={formSecond} 
                              onChange={(e) => setFormSecond(Number(e.target.value))}
                            >
                              {Array.from({ length: 60 }, (_, i) => i).map(sec => (
                                <option key={sec} value={sec}>{String(sec).padStart(2, '0')}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Place of Birth */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <MapPin size={13} className="text-primary" />
                          <span>Place of Birth</span>
                        </label>
                        <input 
                          type="text" 
                          className="w-full bg-saffron-canvas/20 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary font-medium"
                          required 
                          placeholder="e.g. Mumbai, India" 
                          value={formPob} 
                          onChange={(e) => setFormPob(e.target.value)} 
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" className="px-4 py-2 border border-outline-variant/30 text-xs font-bold rounded-full" onClick={() => setIsUpdatingBirthDetails(false)}>Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-container text-white px-5 py-2 text-xs font-bold rounded-full shadow-sm active:scale-95 smooth-transition">Update Coordinates</button>
                      </div>
                    </form>
                  </section>
                )}

                {/* Kundli Layout: Side-by-Side Chart and Planetary Placements */}
                <div id="focus-chart" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart Card */}
                  <div className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-lg-mobile text-lg text-primary font-bold">Astrological Kundli Chart</h3>
                      <p className="text-xs text-cosmic-dust mt-0.5 mb-4">North Indian Diamond Grid Coordinate mapping</p>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      {renderInteractiveChart()}
                    </div>

                    {/* Chart Selector Badges */}
                    <div className="mt-6 flex justify-center gap-2 overflow-x-auto pb-2 timeline-scroll">
                      {['D1', 'D9', 'Moon'].map(chart => (
                        <button 
                          key={chart}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold smooth-transition ${kundliChartType === chart ? 'bg-primary text-white shadow-sm' : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant'}`}
                          onClick={() => setKundliChartType(chart)}
                        >
                          {chart === 'D1' ? 'D1 (Lagna)' : chart === 'D9' ? 'Navamsha (D9)' : 'Moon Chart'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Planetary Positions Table */}
                  <div className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-lg-mobile text-lg text-on-surface font-bold">Planetary Placements</h3>
                      <p className="text-xs text-cosmic-dust mt-0.5 mb-4">Planets position & status inside houses</p>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-outline-variant/20 text-cosmic-dust font-bold uppercase tracking-wider">
                            <th className="py-2.5">Planet</th>
                            <th className="py-2.5">Zodiac</th>
                            <th className="py-2.5">Degree & Nakshatra</th>
                            <th className="py-2.5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 text-on-surface font-semibold">
                          <tr>
                            <td className="py-3 flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-sm">sunny</span>
                              <span>Sun</span>
                            </td>
                            <td className="py-3">Cancer</td>
                            <td className="py-3">24° 12' Punarvasu</td>
                            <td className="py-3 text-right"><span className="text-primary font-bold">Exalted</span></td>
                          </tr>
                          <tr>
                            <td className="py-3 flex items-center gap-2">
                              <span className="material-symbols-outlined text-secondary text-sm">brightness_3</span>
                              <span>Moon</span>
                            </td>
                            <td className="py-3">Aquarius</td>
                            <td className="py-3">02° 45' Dhanishta</td>
                            <td className="py-3 text-right"><span className="text-secondary font-bold">Favorable</span></td>
                          </tr>
                          <tr>
                            <td className="py-3 flex items-center gap-2">
                              <span className="material-symbols-outlined text-tertiary text-sm">shield</span>
                              <span>Mars</span>
                            </td>
                            <td className="py-3">Libra</td>
                            <td className="py-3">15° 09' Swati</td>
                            <td className="py-3 text-right"><span className="text-red-500 font-bold">Debilitated</span></td>
                          </tr>
                          <tr>
                            <td className="py-3 flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                              <span>Mercury</span>
                            </td>
                            <td className="py-3">Virgo</td>
                            <td className="py-3">12° 05' Hasta</td>
                            <td className="py-3 text-right">Direct</td>
                          </tr>
                          <tr>
                            <td className="py-3 flex items-center gap-2">
                              <span className="material-symbols-outlined text-amber-500 text-sm">award</span>
                              <span>Jupiter</span>
                            </td>
                            <td className="py-3">Scorpio</td>
                            <td className="py-3">18° 30' Anuradha</td>
                            <td className="py-3 text-right">Direct</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Vedic Vitals & Dosha Audit Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* House Analysis Summary */}
                  <div className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-lg-mobile text-lg text-primary font-bold mb-4">Vedic Vitals Analysis</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="glass-insight p-4 rounded-2xl flex flex-col items-center text-center border border-outline-variant/10">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-2.5 text-white shadow-sm">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                        </div>
                        <h4 className="font-label-caps text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">Ascendant (Lagna)</h4>
                        <p className="font-bold text-sm text-on-surface">Leo (Simha)</p>
                        <p className="text-[10px] text-on-surface-variant mt-1.5 leading-normal">
                          Charismatic, natural leader, creative. Ruled by Sun.
                        </p>
                      </div>
                      <div className="glass-insight p-4 rounded-2xl flex flex-col items-center text-center border border-outline-variant/10">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mb-2.5 text-white shadow-sm">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
                        </div>
                        <h4 className="font-label-caps text-[10px] text-secondary font-bold uppercase tracking-wider mb-0.5">Moon Sign (Chandra)</h4>
                        <p className="font-bold text-sm text-on-surface">Aquarius (Kumbha)</p>
                        <p className="text-[10px] text-on-surface-variant mt-1.5 leading-normal">
                          Humanitarian, innovative, detached. Ruled by Saturn.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vedic Dosha Audit */}
                  <div id="focus-matchmaking" className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm space-y-3">
                    <h3 className="font-headline-lg-mobile text-lg text-primary font-bold">Vedic Dosha Audit</h3>
                    <div className="space-y-2.5">
                      {[
                        { name: 'Manglik Dosha', status: 'Absent', color: 'bg-emerald-100 text-emerald-800', icon: 'check_circle', iconColor: 'text-emerald-500', desc: 'Mars is placed in a non-conflict house.' },
                        { name: 'Sade Sati', status: 'Active (Peak)', color: 'bg-amber-100 text-amber-800', icon: 'warning', iconColor: 'text-amber-500', desc: 'Saturn is transiting your natal Moon.' },
                        { name: 'Kaalsarpa Dosha', status: 'Absent', color: 'bg-emerald-100 text-emerald-800', icon: 'check_circle', iconColor: 'text-emerald-500', desc: 'Planets are not hemmed between Rahu and Ketu.' }
                      ].map((d, i) => (
                        <div key={i} className="p-3 rounded-xl border border-outline-variant/20 bg-saffron-canvas/10 flex items-start gap-3">
                          <span className={`material-symbols-outlined ${d.iconColor} text-base mt-0.5`}>{d.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-on-surface">{d.name}</span>
                              <span className={`${d.color} text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase`}>{d.status}</span>
                            </div>
                            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">{d.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dasha timeline */}
                <section className="bg-inverse-surface text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] transform translate-x-8 -translate-y-8 select-none text-[120px]">
                    <span className="material-symbols-outlined text-[100px]">auto_awesome</span>
                  </div>
                  <h3 className="font-headline-lg-mobile text-lg font-bold mb-6 flex items-center gap-2">
                    <span>Current Dasha Cycle</span>
                    <span className="bg-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                  </h3>
                  <div className="relative pl-6 border-l-2 border-primary-container/30 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-inverse-surface"></div>
                      <p className="font-label-caps text-[10px] text-primary-fixed uppercase tracking-wider mb-1">Mahadasha (Until 2032)</p>
                      <h4 className="font-headline-lg text-lg font-bold text-white">Jupiter (Guru)</h4>
                      <p className="text-xs text-surface-variant mt-1">A period of expansion, wisdom, and spiritual growth.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-secondary-container border-4 border-inverse-surface"></div>
                      <p className="font-label-caps text-[10px] text-secondary-fixed-dim uppercase tracking-wider mb-1">Antardasha (Current)</p>
                      <h4 className="font-headline-lg text-base font-bold text-secondary-fixed">Mercury (Budh)</h4>
                      <p className="text-xs text-surface-variant mt-1">Focus on communication, business, and analytical tasks.</p>
                    </div>
                  </div>
                  
                  {/* PDF button */}
                  <button 
                    className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-label-md text-xs font-bold shadow-lg active:scale-98 smooth-transition flex items-center justify-center gap-1.5"
                    onClick={() => handleStartCheckout({ title: 'Personalized Vedic Kundli', price: '₹499', desc: '145+ page comprehensive birth-chart and transits report.' })}
                  >
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                    <span>Generate Full PDF Report (145+ Pages)</span>
                  </button>
                </section>

              </div>
            )}

            {/* 3. SWASTIK AI CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-120px)] border border-outline-variant/30 rounded-3xl bg-white overflow-hidden shadow-sm animate-in fade-in duration-300 relative">
                
                {/* Background ambient element */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-multiply"></div>
                
                {/* Chat header */}
                <div className="bg-gradient-to-r from-saffron-canvas to-white border-b border-outline-variant/20 px-6 py-4 flex items-center justify-between relative z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-inner border border-primary/20">
                      <SwastikIcon size={18} className="text-white" />
                    </div>
                    <div>
                      <h1 className="font-serif text-lg font-bold text-primary leading-none tracking-wide">Swastik AI Oracle</h1>
                      <span className="text-[10px] text-tertiary flex items-center gap-1.5 mt-1 font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        Cosmic Link Active
                      </span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-saffron-canvas/50 transition-colors">
                    <span className="material-symbols-outlined text-sm">history</span>
                  </button>
                </div>

                {/* Chat Messages Canvas */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gradient-to-b from-saffron-canvas/5 to-saffron-canvas/20 relative z-10 custom-scrollbar">
                  
                  {/* Reading Session Divider */}
                  <div className="flex items-center justify-center gap-3 my-4">
                    <div className="h-px bg-outline-variant/20 flex-1 max-w-[100px]"></div>
                    <span className="text-[9px] font-bold text-cosmic-dust uppercase tracking-widest px-2 py-0.5 rounded-full border border-outline-variant/10 bg-white shadow-sm">
                      Consultation Started
                    </span>
                    <div className="h-px bg-outline-variant/20 flex-1 max-w-[100px]"></div>
                  </div>

                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="w-full flex flex-col items-center">
                      {msg.sender === 'user' ? (
                        <div className="w-full max-w-4xl bg-white border border-secondary/20 rounded-2xl p-4 flex gap-4 shadow-sm relative overflow-hidden transform transition-all hover:shadow-md">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary/50"></div>
                          <div className="w-8 h-8 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center flex-shrink-0 shadow-inner">
                            <UserAvatar user={user} className="text-[18px]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Your Inquiry</span>
                              <span className="text-[9px] text-cosmic-dust font-medium">{msg.timestamp}</span>
                            </div>
                            <p className="text-sm font-medium text-on-surface leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full max-w-4xl bg-gradient-to-br from-[#1a1412] to-[#2c1d18] rounded-3xl p-5 md:p-6 mt-4 shadow-xl text-white relative overflow-hidden border border-amber-500/20">
                          <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10 pointer-events-none rotate-12">
                            <span className="material-symbols-outlined text-[150px] text-amber-200">auto_awesome</span>
                          </div>
                          <div className="flex gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
                              <SwastikIcon size={18} className="text-amber-300" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                                <span className="text-[10px] font-bold text-amber-300/90 uppercase tracking-widest flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[14px]">stars</span>
                                  Divine Insight
                                </span>
                                <span className="text-[9px] text-white/40 font-medium">{msg.timestamp}</span>
                              </div>
                              <p className="text-sm leading-[1.8] font-serif text-white/95" style={{ whiteSpace: 'pre-wrap' }}>
                                {msg.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {botTyping && (
                    <div className="w-full flex justify-center">
                       <div className="w-full max-w-4xl bg-gradient-to-br from-[#1a1412] to-[#2c1d18] rounded-3xl p-6 mt-4 shadow-xl text-white relative overflow-hidden border border-amber-500/20">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                              <SwastikIcon size={18} className="text-amber-300" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-amber-300/90 uppercase tracking-widest">Consulting the Stars</span>
                              <div className="flex gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Oracle Input Area */}
                <div className="bg-white border-t border-outline-variant/20 relative z-10 pb-4 md:pb-6">
                  {/* Suggestion Chips */}
                  <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                    {["Career Trajectory?", "Marriage Prospects?", "Financial Outlook?"].map((suggestion, i) => (
                      <button 
                        key={i}
                        className="flex-shrink-0 bg-white border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-full hover:bg-primary/5 hover:border-primary/40 transition-colors shadow-sm" 
                        onClick={() => handleSuggestionTrigger(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 md:px-6">
                    <div className="flex items-center gap-3 bg-surface-variant/20 border border-outline-variant/40 p-1.5 rounded-2xl shadow-inner focus-within:border-primary/50 focus-within:bg-white transition-colors">
                      <button className="w-10 h-10 rounded-xl bg-white border border-outline-variant/30 flex items-center justify-center text-primary shadow-sm hover:bg-saffron-canvas/50">
                        <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                      </button>
                      <input 
                        type="text" 
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/50 px-2 font-medium"
                        placeholder="Seek guidance from the oracle..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                      />
                      <button 
                        className="bg-gradient-to-r from-primary to-primary-container text-white w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        onClick={handleChatSend}
                        disabled={!chatInput.trim() || botTyping}
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 4. PANCHANG & MUHURTA TAB */}
            {activeTab === 'panchang' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Header info */}
                <section className="flex justify-between items-end border-b border-outline-variant/20 pb-4 relative">
                  <div>
                    <p className="font-label-caps text-xs text-tertiary font-bold uppercase tracking-wider mb-1">Today's Alignment</p>
                    <h2 className="font-headline-lg-mobile text-[24px] md:text-[32px] text-on-surface font-extrabold leading-none">Monday, 24 July</h2>
                    <div className="flex items-center gap-1 mt-1 text-cosmic-dust">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span className="text-xs">Mumbai, India</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      className={`w-10 h-10 border border-outline-variant/30 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm ${showCalendar ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                    </button>
                    
                    {showCalendar && (
                      <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-outline-variant/30 p-4 z-50 w-64 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-3">
                          <button className="text-cosmic-dust hover:text-primary"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                          <span className="text-xs font-bold text-on-surface uppercase tracking-widest">July 2026</span>
                          <button className="text-cosmic-dust hover:text-primary"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['S','M','T','W','T','F','S'].map((d,i) => <span key={i} className="text-[9px] font-bold text-cosmic-dust">{d}</span>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                            <button 
                              key={day} 
                              className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-full ${day === 24 ? 'bg-primary text-white shadow-md' : 'text-on-surface hover:bg-saffron-canvas/50'}`}
                              onClick={() => setShowCalendar(false)}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Daily Ritual Card */}
                <section id="focus-ritual" tabIndex="0" className="glass-card rounded-3xl p-5 border border-outline-variant/20 shadow-sm relative overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]">
                  <h3 className="font-headline-lg-mobile text-lg text-primary font-bold mb-1">Daily Surya Arghya Karma</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-lg mb-4">
                    Perform water offering to the Sun. Purify your current planetary transits and earn <strong className="gold-text">+50 Karma Points</strong>.
                  </p>

                  {ritualState === 'idle' ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <button 
                        className="w-24 h-24 rounded-full saffron-gradient text-white flex flex-col items-center justify-center shadow-lg hover:shadow-primary/30 smooth-transition active:scale-90 border-4 border-white/20 select-none cursor-pointer"
                        onClick={triggerDailyRitual}
                      >
                        <Sun size={28} className="animate-pulse" />
                        <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">OFFER WATER</span>
                      </button>
                      <p className="text-[11px] text-cosmic-dust mt-3">Click solar seal to start water pouring chant</p>
                    </div>
                  ) : ritualState === 'pouring' ? (
                    <div className="flex flex-col items-center justify-center py-4 relative h-[160px]">
                      <button className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center shadow-md border-2 border-white/20 select-none animate-bounce">
                        <Sun size={22} />
                      </button>
                      {/* Water pour animation */}
                      <div className="water-pour-stream mt-2"></div>
                      <div className="water-ripple"></div>
                      <div className="pulse-glow-text mt-3 text-secondary font-semibold italic text-xs">
                        {ritualMsg}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                        <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                      </div>
                      <h4 className="text-sm font-bold text-emerald-600">Surya Arghya Completed!</h4>
                      <p className="text-xs text-on-surface-variant mt-1.5 max-w-[250px]">
                        You have balanced solar elements and earned <strong className="text-primary">+50 Karma Points</strong>.
                      </p>
                      <button className="mt-4 px-4 py-1.5 border border-outline-variant/30 hover:bg-saffron-canvas/30 text-xs font-bold rounded-full smooth-transition active:scale-95" onClick={() => setRitualState('idle')}>Perform Again</button>
                    </div>
                  )}
                </section>

                {/* Daily Panchang Limbs Grid */}
                <section id="focus-limbs" className="space-y-3">
                  <h3 className="font-label-caps text-xs text-cosmic-dust font-bold tracking-wider mb-2 flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span> 
                    <span>THE FIVE LIMBS</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tithi */}
                    <div tabIndex="0" className="glass-card p-4 rounded-xl flex flex-col gap-2 border border-outline-variant/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>clear_night</span>
                        <span className="font-label-caps text-[9px] text-cosmic-dust font-bold">TITHI</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-on-surface">Shukla Sasthi</p>
                        <p className="text-[10px] text-cosmic-dust mt-0.5">Ends 10:24 PM</p>
                      </div>
                    </div>
                    {/* Nakshatra */}
                    <div tabIndex="0" className="glass-card p-4 rounded-xl flex flex-col gap-2 border border-outline-variant/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                        <span className="font-label-caps text-[9px] text-cosmic-dust font-bold">NAKSHATRA</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-on-surface">Chitra</p>
                        <p className="text-[10px] text-cosmic-dust mt-0.5">Full Day</p>
                      </div>
                    </div>
                    {/* Yoga */}
                    <div tabIndex="0" className="glass-card p-4 rounded-xl flex flex-col gap-2 border border-outline-variant/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>mediation</span>
                        <span className="font-label-caps text-[9px] text-cosmic-dust font-bold">YOGA</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-on-surface">Shiva</p>
                        <p className="text-[10px] text-cosmic-dust mt-0.5">Ends 04:12 PM</p>
                      </div>
                    </div>
                    {/* Karana */}
                    <div tabIndex="0" className="glass-card p-4 rounded-xl flex flex-col gap-2 border border-outline-variant/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>interests</span>
                        <span className="font-label-caps text-[9px] text-cosmic-dust font-bold">KARANA</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-on-surface">Taitila</p>
                        <p className="text-[10px] text-cosmic-dust mt-0.5">Ends 11:05 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Vara Weekday */}
                  <div tabIndex="0" className="glass-card p-4 rounded-xl flex items-center justify-between border border-outline-variant/20 mt-3 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-divine-purple-light rounded-full flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-lg">calendar_view_day</span>
                      </div>
                      <div>
                        <span className="font-label-caps text-[9px] text-cosmic-dust font-bold">VARA (WEEKDAY)</span>
                        <p className="font-bold text-xs text-on-surface">Somawara (Monday)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded">Auspicious</span>
                  </div>
                </section>

                {/* Sun & Moon Timings */}
                <section id="focus-sun-cycle" tabIndex="0" className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]">
                  <div className="bg-primary/5 p-4 flex justify-between items-center border-b border-outline-variant/20">
                    <h3 className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">Sun & Moon Cycle</h3>
                    <span className="material-symbols-outlined text-primary opacity-50 text-base">wb_sunny</span>
                  </div>
                  <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-base">sunny</span>
                      <div>
                        <p className="font-label-caps text-[9px] text-cosmic-dust font-bold">SUNRISE</p>
                        <p className="font-bold text-xs text-on-surface">06:04 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-tertiary text-base">wb_twilight</span>
                      <div>
                        <p className="font-label-caps text-[9px] text-cosmic-dust font-bold">SUNSET</p>
                        <p className="font-bold text-xs text-on-surface">07:12 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary text-base">brightness_3</span>
                      <div>
                        <p className="font-label-caps text-[9px] text-cosmic-dust font-bold">MOONRISE</p>
                        <p className="font-bold text-xs text-on-surface">11:42 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-cosmic-dust text-base">nights_stay</span>
                      <div>
                        <p className="font-label-caps text-[9px] text-cosmic-dust font-bold">MOONSET</p>
                        <p className="font-bold text-xs text-on-surface">12:15 AM</p>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* 5. PREMIUM REPORTS CATALOG TAB */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Header info */}
                <section className="border-b border-outline-variant/20 pb-4">
                  <span className="text-secondary font-label-caps text-xs tracking-widest font-bold uppercase">Storefront</span>
                  <h2 className="font-headline-xl text-[24px] md:text-[32px] text-primary font-extrabold mt-1">Premium Reports</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">Vedic-calculations augmented with AI precision casting.</p>
                </section>

                {/* Featured Report Card */}
                <section className="mb-6">
                  <div className="relative overflow-hidden rounded-3xl bg-white border border-outline-variant/40 p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                    
                    {/* Glow BG */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-fixed/20 opacity-40 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 w-full md:w-1/2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-divine-purple-light text-secondary font-label-caps text-[10px] font-extrabold mb-3">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span>FEATURED ANALYSIS</span>
                      </div>
                      
                      <h2 className="font-headline-xl text-[26px] md:text-[32px] text-primary font-bold mb-3 leading-tight">Personalized Vedic Kundli</h2>
                      <p className="text-xs text-on-surface-variant mb-5 leading-relaxed">
                        Unveil the blueprint of your destiny with our flagship analysis. A comprehensive 145+ page digital report covering career transits, relationships, health, and remedies tailored to your birth house.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-6 text-xs font-semibold text-primary">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">description</span>
                          <span>145+ Pages</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          <span>AI + Vedic Precision</span>
                        </div>
                      </div>
                      
                      <button 
                        className="saffron-gradient-btn saffron-gradient text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-1.5 active:scale-95 smooth-transition shadow-md"
                        onClick={() => handleStartCheckout({ title: 'Personalized Vedic Kundli', price: '₹499', desc: '145+ page comprehensive birth-chart and transits report.' })}
                      >
                        <span>Get Report</span>
                        <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                      </button>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center">
                      <div className="relative group cursor-pointer" onClick={() => handleStartCheckout({ title: 'Personalized Vedic Kundli', price: '₹499', desc: '145+ page comprehensive birth-chart and transits report.' })}>
                        <div className="absolute inset-0 bg-secondary-container/20 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                        <div className="w-52 md:w-60 shadow-lg border border-outline-variant/30 rounded-xl overflow-hidden smooth-transition group-hover:scale-105">
                          <ReportCover title="Personalized Vedic Kundli" type="saffron" icon="menu_book" />
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Catalog Grid (Enhanced for Desktop) */}
                <section className="space-y-4">
                  <h3 className="font-headline-lg text-base text-on-surface font-bold">Explore More Insights</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* 1. 365 Cover */}
                    <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col justify-between hover:shadow-md smooth-transition group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-saffron-canvas/10 border-b border-outline-variant/20 flex items-center justify-center">
                        <ReportCover title="365-Day Horoscope" type="general" icon="calendar_today" />
                        <span className="absolute top-2.5 right-2.5 bg-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider z-20">POPULAR</span>
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="font-headline-lg text-sm text-primary font-bold mb-1.5">365-Day Horoscope</h4>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">Complete daily roadmap for the year ahead with precise transits.</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-outline-variant/10">
                          <span className="font-bold text-sm text-on-surface">₹499</span>
                          <button 
                            className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white smooth-transition"
                            onClick={() => handleStartCheckout({ title: '365-Day Horoscope', price: '₹499', desc: 'Precise day-by-day transit roadmap for 1 year.' })}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2. Matchmaking */}
                    <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col justify-between hover:shadow-md smooth-transition group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-saffron-canvas/10 border-b border-outline-variant/20 flex items-center justify-center">
                        <ReportCover title="Kundli Matching" type="love" icon="favorite" />
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="font-headline-lg text-sm text-primary font-bold mb-1.5">Kundli Matching</h4>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">Detailed 36-point Guna Milan checklist for a happy union.</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-outline-variant/10">
                          <span className="font-bold text-sm text-on-surface">₹399</span>
                          <button 
                            className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white smooth-transition"
                            onClick={() => handleStartCheckout({ title: 'Kundli Matching', price: '₹399', desc: 'Detailed 36-point Ashta Koota matchmaking parameters.' })}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 3. Wealth cover */}
                    <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col justify-between hover:shadow-md smooth-transition group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-saffron-canvas/10 border-b border-outline-variant/20 flex items-center justify-center">
                        <ReportCover title="Dhan Dhanya Report" type="wealth" icon="account_balance_wallet" />
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="font-headline-lg text-sm text-primary font-bold mb-1.5">Dhan Dhanya Report</h4>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">Financial prosperity analysis focusing on career and investments.</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-outline-variant/10">
                          <span className="font-bold text-sm text-on-surface">₹599</span>
                          <button 
                            className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white smooth-transition"
                            onClick={() => handleStartCheckout({ title: 'Dhan Dhanya Wealth Report', price: '₹599', desc: 'Financial prosperity analysis focusing on wealth houses.' })}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Why choose premium banner */}
                <section className="bg-primary text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-primary/20">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-inner">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="font-headline-lg text-base font-bold mb-1.5">AI-Powered Precision</h3>
                    <p className="text-xs opacity-90 leading-relaxed">
                      Our reports combine centuries-old Vedic algorithms with state-of-the-art AI processing to provide accuracy levels previously impossible. Every insight is verified against 50,000+ Permutations.
                    </p>
                  </div>
                </section>

              </div>
            )}

          </div>

          {/* Right Column: Persistent Sidebar (Desktop only) */}
          <aside className={`hidden lg:block space-y-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-2 ${activeTab === 'chat' || activeTab === 'admin' ? '!hidden' : 'lg:col-span-4 xl:col-span-3'}`}>
            
            {/* FREE SERVICES vertical menu (Astro Devam layout inspiration) */}
            <div className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
              <h3 className="text-sm font-bold text-primary font-headline-lg-mobile mb-4 pb-2 border-b border-outline-variant/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                <span>FREE SERVICES</span>
              </h3>
              <ul className="space-y-1.5">
                {[
                  { name: 'Free Horoscope by DOB', tab: 'dashboard', action: 'focus-form', icon: 'edit_note' },
                  { name: 'Daily Horoscope Vitals', tab: 'dashboard', action: 'focus-horoscope', icon: 'stars' },
                  { name: 'Interactive Lagna Chart', tab: 'kundli', action: 'focus-chart', icon: 'grid_view' },
                  { name: 'Kundli Match Making', tab: 'reports', action: 'focus-matchmaking', icon: 'favorite' },
                  { name: 'Vedic Panchang limbs', tab: 'panchang', action: 'focus-limbs', icon: 'sunny' },
                  { name: 'Sunrise & Sunset Timing', tab: 'panchang', action: 'focus-sun-cycle', icon: 'wb_twilight' },
                  { name: 'Shubh Muhurta timing', tab: 'dashboard', action: 'focus-muhurtas', icon: 'schedule' },
                  { name: 'Surya Arghya Daily Ritual', tab: 'panchang', action: 'focus-ritual', icon: 'waves' },
                  { name: 'Consult AI Guru Chat', tab: 'chat', action: null, icon: 'chat' }
                ].map((service, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => {
                        setActiveTab(service.tab);
                        if (service.action) {
                          setTimeout(() => {
                            const element = document.getElementById(service.action);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              element.classList.add('ring-2', 'ring-primary/40', 'ring-offset-2');
                              setTimeout(() => element.classList.remove('ring-2', 'ring-primary/40', 'ring-offset-2'), 2000);
                            }
                          }, 150);
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-between group border border-transparent hover:border-primary/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[15px] text-cosmic-dust group-hover:text-primary transition-colors">{service.icon}</span>
                        <span>{service.name}</span>
                      </div>
                      <span className="material-symbols-outlined text-xs text-cosmic-dust group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Planetary Transits summary */}
            <div className="bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider pb-2 border-b border-outline-variant/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">rocket_launch</span>
                <span>Live Transits</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">wb_sunny</span>
                    <div>
                      <p className="font-bold text-on-surface">Sun (Surya)</p>
                      <p className="text-[10px] text-on-surface-variant">In Cancer</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-primary bg-primary-fixed px-2 py-0.5 rounded uppercase">Exalted</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm">brightness_3</span>
                    <div>
                      <p className="font-bold text-on-surface">Moon (Chandra)</p>
                      <p className="text-[10px] text-on-surface-variant">In Aquarius</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-secondary bg-secondary-fixed px-2 py-0.5 rounded uppercase">Favorable</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-sm">shield</span>
                    <div>
                      <p className="font-bold text-on-surface">Mars (Mangal)</p>
                      <p className="text-[10px] text-on-surface-variant">In Libra</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">Debilitated</span>
                </div>
              </div>
            </div>

            {/* Daily Guru Insight */}
            <div 
              className="bg-inverse-surface rounded-3xl p-5 text-white relative overflow-hidden shadow-md border border-white/5 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
              onClick={() => {
                setRating(0);
                setFeedbackText('');
                setRatingSubmitted(false);
                setShowRatingModal(true);
              }}
            >
              <div className="relative z-10 flex flex-col gap-3">
                <div className="bg-primary px-2.5 py-0.5 rounded self-start text-[8px] font-extrabold tracking-widest uppercase text-white">
                  Guru's Insight
                </div>
                <p className="text-xs leading-relaxed font-semibold italic text-primary-fixed">
                  "The next 48 hours are highly auspicious for signing long-term contracts. Align your actions with Abhijit Muhurta timings."
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full border border-white/20 overflow-hidden bg-primary flex items-center justify-center font-bold text-[10px]">
                    S
                  </div>
                  <span className="text-[10px] text-surface-variant">Vedic Guide, Swastik AI</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[50px] rounded-full"></div>
            </div>

          </aside>

        </div>
      </main>

      {/* Feedback/Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-outline-variant/10 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-primary">Rate Guru's Insight</h3>
                <p className="text-[10px] text-cosmic-dust mt-0.5">Help us improve Swastik AI</p>
              </div>
              <button className="text-on-surface-variant hover:text-black transition-colors" onClick={() => setShowRatingModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            {ratingSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                </div>
                <h4 className="text-sm font-bold text-emerald-600">Thank You!</h4>
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  Your feedback helps us align our cosmic insights better.
                </p>
                <button 
                  className="mt-5 w-full bg-primary hover:bg-primary-container text-white py-2 rounded-full text-xs font-bold shadow-md smooth-transition active:scale-95"
                  onClick={() => setShowRatingModal(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRatingSubmitted(true); }} className="space-y-4">
                <div className="flex flex-col items-center justify-center py-2">
                  <p className="text-xs font-bold text-on-surface mb-2">How accurate was this reading?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className={`transition-transform hover:scale-110 focus:outline-none`}
                      >
                        <span 
                          className="material-symbols-outlined text-3xl" 
                          style={{ 
                            color: rating >= star ? '#F59E0B' : '#E5E7EB',
                            fontVariationSettings: rating >= star ? "'FILL' 1" : "'FILL' 0"
                          }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant">Write a comment (Optional)</label>
                  <textarea 
                    className="w-full bg-saffron-canvas/10 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none" 
                    rows="3" 
                    placeholder="Tell us about your experience..." 
                    value={feedbackText} 
                    onChange={(e) => setFeedbackText(e.target.value)}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={rating === 0}
                  className={`w-full py-2.5 rounded-full text-xs font-bold shadow-md smooth-transition active:scale-95 ${rating > 0 ? 'bg-primary hover:bg-primary-container text-white' : 'bg-outline-variant/20 text-on-surface-variant cursor-not-allowed'}`}
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Checkout Payment Flow Modal */}
      {checkoutModalOpen && selectedReport && (
        <div className="modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start border-b border-outline-variant/10 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-primary">Vedic Gateway Checkout</h3>
                <p className="text-[10px] text-cosmic-dust mt-0.5">Secure payment for {selectedReport.title}</p>
              </div>
              <button className="text-on-surface-variant hover:text-black transition-colors" onClick={() => setCheckoutModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {checkoutState === 'form' ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                <div className="bg-saffron-canvas/40 p-3 rounded-xl border border-outline-variant/20 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>{selectedReport.title}</span>
                    <span className="text-primary">{selectedReport.price}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1">{selectedReport.desc}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant">Cardholder Name</label>
                  <input type="text" className="w-full bg-saffron-canvas/10 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none" required placeholder="Krishna Prasad" value={cardDetails.name} onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant">Card Number</label>
                  <input type="text" className="w-full bg-saffron-canvas/10 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none" required placeholder="4111 2222 3333 4444" maxLength="19" value={cardDetails.number} onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant">Expiry Date</label>
                    <input type="text" className="w-full bg-saffron-canvas/10 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none" required placeholder="MM/YY" maxLength="5" value={cardDetails.expiry} onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant">CVV</label>
                    <input type="password" className="w-full bg-saffron-canvas/10 border border-outline-variant/30 rounded-xl px-3 py-2 text-xs focus:outline-none" required placeholder="***" maxLength="3" value={cardDetails.cvv} onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))} />
                  </div>
                </div>

                <button type="submit" className="w-full mt-4 bg-primary hover:bg-primary-container text-white py-2.5 rounded-full text-xs font-bold shadow-md smooth-transition active:scale-95">
                  Pay {selectedReport.price} & Cast Report
                </button>
              </form>
            ) : checkoutState === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="celestial-loader">
                  <div className="orbit-ring outer"><div className="planet-dot p1"></div></div>
                  <div className="orbit-ring inner"><div className="planet-dot p2"></div></div>
                  <div className="loader-center"><Compass size={32} className="logo-icon text-primary animate-spin" /></div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-primary">Casting Vedic Report Elements...</p>
                  <p className="text-[9px] text-cosmic-dust mt-1">Generating 145+ page charts customized to birth location.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                </div>
                <h4 className="text-sm font-bold text-emerald-600">Payment Successful!</h4>
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  Your report has been successfully cast and is ready for download.
                </p>
                <a 
                  href="data:text/plain;charset=utf-8,Simulated%20145%20Pages%20Vedic%20Astrology%20Report%20Content" 
                  download={`${selectedReport.title.replace(/\s+/g, '_')}_Report.pdf`}
                  className="mt-5 w-full bg-primary hover:bg-primary-container text-white py-2 rounded-full text-xs font-bold shadow-md smooth-transition active:scale-95 block text-center"
                  onClick={() => setCheckoutModalOpen(false)}
                >
                  Download PDF Report
                </a>
              </div>
            )}

          </div>
        </div>
      )}


      {/* Bottom Mobile Navigation Bar (Visible on mobile only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white border-t border-outline-variant/30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-2xl">
        
        {/* Dashboard Tab link */}
        <a 
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 scale-90 ${activeTab === 'dashboard' ? 'bg-secondary-fixed dark:bg-secondary-container text-on-secondary-fixed dark:text-on-secondary-container rounded-full' : 'text-on-surface-variant'}`}
          href="#dashboard"
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "" }}>dashboard</span>
          <span className="font-label-caps text-[9px] font-bold tracking-wider mt-0.5">Dashboard</span>
        </a>

        {/* Kundli Tab link */}
        <a 
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 scale-90 ${activeTab === 'kundli' ? 'bg-secondary-fixed dark:bg-secondary-container text-on-secondary-fixed dark:text-on-secondary-container rounded-full' : 'text-on-surface-variant'}`}
          href="#kundli"
          onClick={(e) => { e.preventDefault(); setActiveTab('kundli'); }}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'kundli' ? "'FILL' 1" : "" }}>auto_awesome</span>
          <span className="font-label-caps text-[9px] font-bold tracking-wider mt-0.5">Kundli</span>
        </a>

        {/* Chat Tab link */}
        <a 
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 scale-90 ${activeTab === 'chat' ? 'bg-secondary-fixed dark:bg-secondary-container text-on-secondary-fixed dark:text-on-secondary-container rounded-full' : 'text-on-surface-variant'}`}
          href="#chat"
          onClick={(e) => { e.preventDefault(); setActiveTab('chat'); }}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'chat' ? "'FILL' 1" : "" }}>chat</span>
          <span className="font-label-caps text-[9px] font-bold tracking-wider mt-0.5">Chat</span>
        </a>

        {/* Reports Tab link */}
        <a 
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 scale-90 ${activeTab === 'reports' ? 'bg-secondary-fixed dark:bg-secondary-container text-on-secondary-fixed dark:text-on-secondary-container rounded-full' : 'text-on-surface-variant'}`}
          href="#reports"
          onClick={(e) => { e.preventDefault(); setActiveTab('reports'); }}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'reports' ? "'FILL' 1" : "" }}>description</span>
          <span className="font-label-caps text-[9px] font-bold tracking-wider mt-0.5">Reports</span>
        </a>

        {/* Panchang Tab link */}
        <a 
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 scale-90 ${activeTab === 'panchang' ? 'bg-secondary-fixed dark:bg-secondary-container text-on-secondary-fixed dark:text-on-secondary-container rounded-full' : 'text-on-surface-variant'}`}
          href="#panchang"
          onClick={(e) => { e.preventDefault(); setActiveTab('panchang'); }}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'panchang' ? "'FILL' 1" : "" }}>wb_sunny</span>
          <span className="font-label-caps text-[9px] font-bold tracking-wider mt-0.5">Panchang</span>
        </a>

        {/* Admin Tab link */}
        <a 
          className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 scale-90 ${activeTab === 'admin' ? 'bg-amber-600 text-white rounded-full' : 'text-on-surface-variant'}`}
          href="#admin"
          onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === 'admin' ? "'FILL' 1" : "" }}>shield</span>
          <span className="font-label-caps text-[9px] font-bold tracking-wider mt-0.5">Admin</span>
        </a>

      </nav>

    </div>
  );
}

export default App;
