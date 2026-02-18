
import React from 'react';
import { ExternalLink, ShoppingCart, Leaf, PlayCircle, Flame, Zap, Droplet, Plus, Info, Scale, Sparkles, AlertTriangle, Microscope, HeartPulse, Play, CheckCircle2, UserCircle } from 'lucide-react';
import { FoodAnalysis, UserProfile } from '../types';

interface FoodInsightsProps {
  analysis: FoodAnalysis;
  image: string;
  onRescan: () => void;
  profile: UserProfile;
}

const FoodInsights: React.FC<FoodInsightsProps> = ({ analysis, image, onRescan, profile }) => {
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(analysis.youtubeSearchQuery)}`;
  
  // Color code based on compatibility
  const scoreColor = analysis.compatibilityScore > 80 ? 'text-emerald-400' : analysis.compatibilityScore > 50 ? 'text-amber-400' : 'text-rose-400';
  const scoreBg = analysis.compatibilityScore > 80 ? 'bg-emerald-500/10' : analysis.compatibilityScore > 50 ? 'bg-amber-500/10' : 'bg-rose-500/10';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* Visual Hero */}
      <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[4px] border-white/5 group">
        <img src={image} className="w-full h-[32rem] object-cover transition-transform duration-[2s] group-hover:scale-110" alt={analysis.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        <button 
          onClick={onRescan}
          className="absolute top-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-xl"
        >
          <Plus className="w-7 h-7 rotate-45" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {analysis.dietaryTags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest rounded-full border border-white/20">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-emerald-500 text-[10px] font-black text-white uppercase tracking-[0.2em] rounded-full shadow-lg">Personalized Scan</span>
            <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full text-white/70 text-[10px] font-bold uppercase tracking-widest">
              <Scale className="w-3 h-3" />
              {analysis.portionEstimate}
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tighter mb-4 italic">{analysis.name}</h2>
          <p className="text-white/60 text-sm font-medium leading-relaxed opacity-90 line-clamp-2 italic">"{analysis.description}"</p>
        </div>
      </div>

      {/* NEW: Personalized compatibility section */}
      <section className="glass-panel rounded-[3.5rem] p-8 sm:p-10 border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${scoreBg} flex items-center justify-center border border-white/10`}>
               <UserCircle className={`w-7 h-7 ${scoreColor}`} />
            </div>
            <div>
              <h3 className="font-black text-white text-2xl tracking-tight">Personal Verdict</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">AI Recommendation for {profile.name || 'You'}</p>
            </div>
          </div>
          <div className="text-right">
             <div className={`text-3xl font-black ${scoreColor} tracking-tighter`}>{analysis.compatibilityScore}%</div>
             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Fit Score</div>
          </div>
        </div>

        <div className="space-y-6">
           <p className="text-slate-300 text-sm font-medium leading-relaxed border-l-2 border-emerald-500/30 pl-6 italic">
              "{analysis.personalizedVerdict}"
           </p>

           <div className="grid grid-cols-1 gap-3">
              {analysis.personalizedSuggestions.map((suggestion, i) => (
                <div key={i} className="flex gap-4 items-start p-4 glass-card rounded-2xl border-white/5">
                   <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${scoreColor}`} />
                   <p className="text-[13px] font-bold text-white/80">{suggestion}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Actionable Health Insight Card */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[3rem] p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
            <HeartPulse className="text-white w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Vital Health Tip</h3>
            <p className="text-white text-lg font-extrabold leading-tight tracking-tight">{analysis.healthTip}</p>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </section>

      {/* Allergens Warning (Conditionally Shown) */}
      {analysis.allergens && analysis.allergens.length > 0 && (
        <section className="bg-amber-500/10 border border-amber-500/30 rounded-[3rem] p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-amber-500 w-6 h-6" />
          </div>
          <div>
            <h4 className="text-amber-200 text-[10px] font-black uppercase tracking-widest mb-1">Allergen Alert</h4>
            <p className="text-amber-100 text-sm font-bold">Contains: {analysis.allergens.join(', ')}</p>
          </div>
        </section>
      )}

      {/* Macro Stats Grid */}
      <div className="grid grid-cols-2 gap-5">
        <MetricBox 
          icon={<Flame className="w-5 h-5" />} 
          label="Energy" 
          value={analysis.nutrients.calories} 
          gradient="from-orange-500 to-rose-500"
          delay="stagger-1"
        />
        <MetricBox 
          icon={<Zap className="w-5 h-5" />} 
          label="Muscle" 
          value={analysis.nutrients.protein} 
          gradient="from-blue-500 to-indigo-500"
          delay="stagger-2"
        />
        <MetricBox 
          icon={<Droplet className="w-5 h-5" />} 
          label="Fuel" 
          value={analysis.nutrients.carbs} 
          gradient="from-purple-500 to-fuchsia-500"
          delay="stagger-3"
        />
        <MetricBox 
          icon={<Leaf className="w-5 h-5" />} 
          label="Fiber" 
          value={analysis.nutrients.fiber} 
          gradient="from-emerald-400 to-teal-500"
          delay="stagger-4"
        />
      </div>

      {/* Micro Nutrients Explorer */}
      <section className="glass-panel rounded-[3.5rem] p-10 relative overflow-hidden">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Microscope className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h3 className="font-black text-white text-2xl tracking-tight leading-none">Micro-Nutrients</h3>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-2">Vitamins & Minerals</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {analysis.microNutrients.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 glass-card rounded-2xl border border-white/5">
              <span className="text-slate-300 font-bold text-sm">{item}</span>
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Culinary Master (Tutorial Block) */}
      <a 
        href={youtubeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative block bg-slate-950 rounded-[3.5rem] p-1.5 shadow-2xl overflow-hidden active:scale-[0.98] transition-all border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/20 to-transparent opacity-50" />
        
        <div className="relative z-10 bg-white/5 backdrop-blur-3xl rounded-[3.2rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 border border-white/5">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-red-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF0000] to-[#CC0000] rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500 border border-white/20">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
              <div className="absolute -inset-2 border-2 border-red-500/30 rounded-[3rem] animate-ping" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full text-[9px] font-black text-red-400 uppercase tracking-[0.3em] mb-3 border border-red-500/20">
              <PlayCircle className="w-3 h-3" />
              Featured Masterclass
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tighter mb-2">
              Learn the Secret <br className="hidden sm:block" /> Recipe
            </h3>
            <p className="text-slate-400 text-[13px] font-medium leading-relaxed max-w-xs mx-auto sm:mx-0">
              Watch step-by-step how to prepare {analysis.name} with chef-grade precision.
            </p>
          </div>

          <div className="hidden sm:flex w-16 h-16 glass-panel rounded-full items-center justify-center group-hover:bg-white/10 transition-colors">
            <ExternalLink className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      </a>

      <div className="h-20" />
    </div>
  );
};

const MetricBox: React.FC<{ icon: React.ReactNode, label: string, value: string, gradient: string, delay: string }> = ({ icon, label, value, gradient, delay }) => (
  <div className={`p-7 rounded-[3rem] glass-card animate-in fade-in slide-in-from-bottom-4 ${delay} group active:scale-95 transition-all`}>
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-6 text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-white leading-none tracking-tighter">{value.split(' ')[0]}</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{value.split(' ')[1] || 'Unit'}</span>
      </div>
    </div>
  </div>
);

export default FoodInsights;
