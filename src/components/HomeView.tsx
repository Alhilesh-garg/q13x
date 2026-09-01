import React from 'react';
import {
  Sparkles,
  Palette,
  PhoneCall,
  Globe,
  Share2,
  Image,
  ArrowRight,
  ShieldCheck,
  Eye,
  Store,
  Lock,
  CloudUpload,
  CheckCircle2,
} from 'lucide-react';
import { AppData } from '../types';

interface HomeViewProps {
  appData: AppData;
  onNavigateToCreate: () => void;
  onNavigateToEdit: () => void;
  onNavigateToPreview: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  appData,
  onNavigateToCreate,
  onNavigateToEdit,
  onNavigateToPreview,
}) => {
  const currentSubdomain = appData.subdomain || 'yourbrand';
  const baseDomain = appData.baseDomain || 'q13x-three.vercel.app';
  const fullLiveUrl = appData.subdomain
    ? `https://${appData.subdomain}.${baseDomain}`
    : `https://[your-store].${baseDomain}`;

  return (
    <div className="w-full bg-slate-50/60 min-h-full flex-1 pb-16 animate-in fade-in duration-150">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 pt-8 pb-10 sm:py-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold shadow-2xs">
            <Sparkles size={13} className="text-emerald-500 animate-pulse" />
            <span>PIN-Protected Digital Storefront & Link-in-Bio Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Design, Host & Publish Your Store
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 mt-1">
              With 6-Digit PIN Security & ImgBB Cloud
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Create an instant visual storefront with WhatsApp ordering, direct phone calling, Google Maps, and continuous product lookbooks on your unique <span className="font-semibold text-slate-800">.{baseDomain}</span> address. No registration needed — manage your store with your private 6-digit PIN.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              id="homeStartCreateBtn"
              onClick={onNavigateToCreate}
              className="px-5 py-2.5 bg-slate-900 hover:bg-black active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Store size={16} />
              <span>Create New Store</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              id="homeStartEditBtn"
              onClick={onNavigateToEdit}
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 active:scale-95 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Lock size={15} />
              <span>Unlock & Edit Store</span>
            </button>

            <button
              type="button"
              id="homeViewLivePreviewBtn"
              onClick={onNavigateToPreview}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 active:scale-95 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Eye size={16} />
              <span>Preview Current Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Store Quick Status Banner */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Live Subdomain URL
              </span>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-white tracking-wide break-all">
              {fullLiveUrl}
            </div>
            <p className="text-[11px] text-slate-300">
              Live database sync via backend at <span className="font-mono text-emerald-400">wxc1.onrender.com</span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onNavigateToCreate}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles size={13} />
              <span>Start Building</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToPreview}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/20"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Why use this Storefront Builder?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Fastest way to turn social media visitors into customers with zero complex logins.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Feature 1 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Lock size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Private 6-Digit PIN Security</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No account creation or password resets. Set a 6-digit PIN when creating your store. Only you can unlock and edit your store anytime.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CloudUpload size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Free ImgBB Cloud Hosting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Images are automatically compressed in browser and uploaded to high-speed ImgBB cloud storage, keeping your store blazing fast.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <PhoneCall size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. One-Touch Direct Contact Hub</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              1-link-per-platform rule for WhatsApp orders, phone calls, Google Maps location directions, Instagram, and YouTube.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Globe size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Live Subdomain & Instant QR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your store is published on <span className="font-semibold">{currentSubdomain}.{baseDomain}</span> with scannable QR codes ready for Instagram bio and WhatsApp status.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Guide */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Store size={18} className="text-indigo-600" />
            <span>How It Works in 3 Steps</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-bold text-slate-900">Fill Details & Photos</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Enter shop name, bio, links, and drop catalog photos which upload directly to ImgBB.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-xs font-bold text-slate-900">Set Subdomain & PIN</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Pick an available subdomain and choose your private 6-digit PIN for future editing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-bold text-slate-900">Go Live & Share</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Your store goes live instantly with copyable links, WhatsApp share, and QR code!
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onNavigateToCreate}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Start Building Your Store Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
