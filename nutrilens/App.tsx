
import React, { useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCcw, Info, ArrowLeft, User, Sparkles, LayoutGrid, Save, X } from 'lucide-react';
import CameraCapture from './components/CameraCapture';
import FoodInsights from './components/FoodInsights';
import { analyzeFoodImage } from './services/geminiService';
import { AnalysisState, UserProfile } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutrilens_profile');
    return saved ? JSON.parse(saved) : { name: '', gender: '', age: '', occupation: '', conditions: '' };
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
    capturedImage: null,
  });

  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleCapture = useCallback(async (base64Image: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, capturedImage: base64Image }));
    setIsCameraActive(false);

    try {
      const analysis = await analyzeFoodImage(base64Image, profile);
      setState(prev => ({ ...prev, isLoading: false, result: analysis }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Analysis failed. Try a brighter angle!' 
      }));
    }
  }, [profile]);

  const resetApp = () => {
    setState({ isLoading: false, result: null, error: null, capturedImage: null });
    setIsCameraActive(false);
  };

  const startCamera = () => {
    setIsCameraActive(true);
    setState(prev => ({ ...prev, error: null, result: null }));
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nutrilens_profile', JSON.stringify(profile));
    setIsProfileOpen(false);
  };

  // Check if profile is complete
  const isProfileSetup = profile.name && profile.age;

  return (
    <div className="h-screen-dynamic flex flex-col overflow-hidden bg-mesh">
      {/* Premium Glass Navbar */}
      <header className="flex-none glass-panel safe-top z-50">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Camera className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white leading-none">NutriLens</h1>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Personal AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {state.result && (
              <button onClick={startCamera} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl transition-all active:scale-90 border border-white/10">
                <RefreshCcw className="w-4 h-4 text-white" />
              </button>
            )}
            {/* FIXED: This button now opens the profile settings */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              className={`w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl transition-all active:scale-90 border border-white/10 ${!isProfileSetup ? 'text-amber-400 animate-pulse' : 'text-white'}`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative custom-scroll">
        <div className="max-w-md mx-auto px-6 py-6 pb-32">
          
          {state.error && (
            <div className="mb-6 p-4 glass-card border-red-500/20 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Info className="text-red-400 w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold text-red-100/80">{state.error}</p>
            </div>
          )}

          {!isProfileSetup && !isProfileOpen && (
             <div className="mb-10 p-8 glass-panel rounded-[3rem] border-amber-500/20 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                    <User className="text-amber-400 w-6 h-6" />
                  </div>
                  <h3 className="font-black text-white text-xl">Personalize Your Lens</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">To get accurate nutrition based on your age, body type, and health, please complete your profile.</p>
                <button onClick={() => setIsProfileOpen(true)} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20">Set Up Profile</button>
             </div>
          )}

          {/* Landing Experience */}
          {!isCameraActive && !state.result && !state.isLoading && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="relative group rounded-[3.5rem] overflow-hidden shadow-2xl aspect-[4/5] border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale-[0.2] brightness-75"
                  alt="Healthy Food"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-12 left-10 right-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] mb-4">
                    <Sparkles className="w-3 h-3" />
                    Neural Network Ready
                  </div>
                  <h2 className="text-5xl font-black leading-[0.9] text-white tracking-tighter mb-4">
                    Visualize<br/>Vitality.
                  </h2>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[260px]">
                    Hi {profile.name || 'there'}! Scan your meal to see if it fits your health goals.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FeatureCard emoji="🧬" title="Personal Fit" sub="Body-Match AI" delay="stagger-1" />
                <FeatureCard emoji="⚡" title="Condition Sync" sub="Filtered Advice" delay="stagger-2" />
              </div>
            </div>
          )}

          {isCameraActive && (
            <div className="animate-in fade-in zoom-in-95 duration-700 h-full">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setIsCameraActive(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white active:scale-90 transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Lens Active</span>
                  <span className="text-sm font-bold text-white">Scanning for {profile.name || 'You'}</span>
                </div>
              </div>
              <CameraCapture onCapture={handleCapture} />
            </div>
          )}

          {state.isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-12 animate-in fade-in zoom-in-95">
              <div className="relative">
                <div className="w-48 h-48 border-[1px] border-emerald-500/20 rounded-full animate-ping absolute scale-150 opacity-20"></div>
                <div className="w-48 h-48 border-[1px] border-emerald-500/40 rounded-full animate-pulse absolute scale-110 opacity-30"></div>
                
                <div className="w-48 h-48 border-[4px] border-white/5 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 w-48 h-48 border-[4px] border-emerald-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-bounce">🥗</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tighter">Personalizing Results</h3>
                <p className="text-slate-400 text-xs font-medium px-12 leading-relaxed">
                  Adjusting nutritional requirements for your age ({profile.age}) and health profile...
                </p>
              </div>
            </div>
          )}

          {state.result && state.capturedImage && (
            <FoodInsights 
              analysis={state.result} 
              image={state.capturedImage} 
              onRescan={startCamera}
              profile={profile}
            />
          )}
        </div>
      </main>

      {/* User Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-md glass-panel rounded-[3.5rem] p-10 border-white/10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto custom-scroll">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-white tracking-tighter">Your Health Profile</h2>
              <button onClick={() => setIsProfileOpen(false)} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/40">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={saveProfile} className="space-y-6">
              <ProfileField label="Full Name" value={profile.name} onChange={(v) => setProfile(p => ({...p, name: v}))} placeholder="Alex Doe" />
              <div className="grid grid-cols-2 gap-4">
                <ProfileField label="Age" value={profile.age} onChange={(v) => setProfile(p => ({...p, age: v}))} placeholder="25" type="number" />
                <ProfileField label="Gender" value={profile.gender} onChange={(v) => setProfile(p => ({...p, gender: v}))} placeholder="Non-binary" />
              </div>
              <ProfileField label="Occupation" value={profile.occupation} onChange={(v) => setProfile(p => ({...p, occupation: v}))} placeholder="Software Engineer" />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Health Conditions</label>
                <textarea 
                  value={profile.conditions}
                  onChange={(e) => setProfile(p => ({...p, conditions: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-white placeholder-white/20 focus:border-emerald-500/50 focus:ring-0 transition-all text-sm h-32 resize-none"
                  placeholder="e.g., Hypertension, Peanut Allergy, Vegan, High Activity Level..."
                />
              </div>
              
              <button type="submit" className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
                <Save className="w-5 h-5" /> Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {!isCameraActive && !state.isLoading && !state.result && (
        <div className="flex-none p-6 pb-12 safe-bottom">
          <button 
            onClick={startCamera}
            className="w-full h-20 bg-emerald-500 text-white rounded-[2.5rem] font-black text-xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 active:scale-[0.96] transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-3">
              <Camera className="w-6 h-6" />
              Begin AI Scan
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

const ProfileField: React.FC<{ label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white placeholder-white/20 focus:border-emerald-500/50 focus:ring-0 transition-all text-sm"
      placeholder={placeholder}
    />
  </div>
);

const FeatureCard: React.FC<{ emoji: string, title: string, sub: string, delay: string }> = ({ emoji, title, sub, delay }) => (
  <div className={`glass-card p-6 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 ${delay}`}>
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-5 border border-white/10">
      <span className="text-2xl">{emoji}</span>
    </div>
    <h3 className="font-black text-white text-xs tracking-wide uppercase">{title}</h3>
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{sub}</p>
  </div>
);

export default App;
