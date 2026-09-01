import React, { useState, useEffect } from 'react';
import {
  Globe,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  QrCode,
  ExternalLink,
  Sparkles,
  Smartphone,
  Eye,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { AppData } from '../types';

interface DomainViewProps {
  appData: AppData;
  onUpdateSubdomain: (subdomain: string, baseDomain: string) => void;
  onNavigateToPreview: () => void;
  onShowToast: (msg: string) => void;
}

export const DomainView: React.FC<DomainViewProps> = ({
  appData,
  onUpdateSubdomain,
  onNavigateToPreview,
  onShowToast,
}) => {
  const [subdomainInput, setSubdomainInput] = useState<string>(
    appData.subdomain ||
      appData.title.toLowerCase().replace(/[^a-z0-9]/g, '') ||
      'mystore'
  );
  const [baseDomainInput, setBaseDomainInput] = useState<string>(
    appData.baseDomain || 'q13x-three.vercel.app'
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Clean and sanitize subdomain format
  const sanitizeSubdomain = (val: string) => {
    return val
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeSubdomain(e.target.value);
    setSubdomainInput(sanitized);
    setIsSaved(false);
  };

  const currentSubdomain = subdomainInput.trim() || 'mystore';
  const currentBaseDomain = baseDomainInput.trim() || 'q13x-three.vercel.app';
  const fullLiveUrl = `https://${currentSubdomain}.${currentBaseDomain}`;

  const handleSaveSubdomain = () => {
    if (!subdomainInput.trim()) {
      onShowToast('⚠️ Please enter a valid subdomain name');
      return;
    }
    onUpdateSubdomain(currentSubdomain, currentBaseDomain);
    setIsSaved(true);
    onShowToast(`✓ Subdomain claimed: ${fullLiveUrl}`);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullLiveUrl);
      } else {
        const temp = document.createElement('textarea');
        temp.value = fullLiveUrl;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      setIsCopied(true);
      onShowToast('✓ Link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      onShowToast('✓ Link copied: ' + fullLiveUrl);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out ${appData.title || 'my store'} on our official link: ${fullLiveUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: appData.title || 'My Store',
          text: `Visit ${appData.title} at ${fullLiveUrl}`,
          url: fullLiveUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  // Simple clean QR code visual generator via reliable QR SVG standard api
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    fullLiveUrl
  )}&margin=10`;

  return (
    <div className="w-full bg-slate-50/50 min-h-full flex-1 p-4 sm:p-6 pb-20 animate-in fade-in duration-150">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header Title */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs font-bold">
                <Globe size={20} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Custom Subdomain & Link Sharing
                </h1>
                <p className="text-xs text-slate-500">
                  Publish your store on a personalized live web address
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Ready
            </span>
          </div>
        </div>

        {/* Subdomain Input Configuration Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <label
              htmlFor="subdomainInput"
              className="text-xs font-bold text-slate-900 block mb-1"
            >
              Choose Your Subdomain Name
            </label>
            <p className="text-[11px] text-slate-500 mb-2.5">
              Use lowercase letters, numbers, and hyphens (e.g.{' '}
              <span className="font-semibold text-slate-700">mybrand</span>,{' '}
              <span className="font-semibold text-slate-700">glow-studio</span>)
            </p>

            {/* Subdomain + Base Domain Combined Input */}
            <div className="flex items-center rounded-xl border-2 border-indigo-200 focus-within:border-indigo-600 bg-white overflow-hidden shadow-xs transition-all">
              <span className="px-3 py-2.5 bg-slate-100/90 text-slate-500 text-xs sm:text-sm font-mono select-none border-r border-slate-200 font-semibold">
                https://
              </span>
              <input
                id="subdomainInput"
                type="text"
                value={subdomainInput}
                onChange={handleSubdomainChange}
                placeholder="yourbrand"
                className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-bold text-indigo-950 font-mono outline-none bg-transparent"
              />
              <span className="px-3 py-2.5 bg-indigo-50/80 text-indigo-700 text-xs sm:text-sm font-mono font-bold select-none border-l border-indigo-100">
                .{currentBaseDomain}
              </span>
            </div>
          </div>

          {/* Claim / Update Button */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              <span className="text-slate-600 font-medium">
                {isSaved ? 'Subdomain claimed & active' : 'Changes pending save'}
              </span>
            </div>

            <button
              type="button"
              id="saveSubdomainBtn"
              onClick={handleSaveSubdomain}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>{isSaved ? 'Subdomain Saved' : 'Claim & Save Subdomain'}</span>
            </button>
          </div>
        </div>

        {/* Live Published Link Box & Quick Share Hub */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              Your Live Store Link
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
              Ready to Share
            </span>
          </div>

          {/* Prominent URL Display Box */}
          <div className="bg-black/40 border border-white/15 p-3 sm:p-3.5 rounded-xl flex items-center justify-between gap-2 overflow-hidden">
            <span className="font-mono text-xs sm:text-sm text-emerald-300 font-bold truncate">
              {fullLiveUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
              title="Copy Link"
            >
              {isCopied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* 1-Click Sharing Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {/* WhatsApp Share */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-2.5 bg-emerald-600/90 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </button>

            {/* QR Code */}
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="p-2.5 bg-white/15 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <QrCode size={18} />
              <span>View QR Code</span>
            </button>

            {/* Mobile Native Share */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="p-2.5 bg-white/15 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Share2 size={18} />
              <span>Share Sheet</span>
            </button>

            {/* Open Preview */}
            <button
              type="button"
              onClick={onNavigateToPreview}
              className="p-2.5 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <Eye size={18} className="text-indigo-600" />
              <span>View Store</span>
            </button>
          </div>
        </div>

        {/* Scannable QR Code Inline Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-5">
          <div className="w-36 h-36 bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src={qrCodeUrl}
              alt="Store QR Code"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
              <QrCode size={16} className="text-indigo-600" />
              <span>Scan to Open on Mobile Device</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customers can scan this QR code with their phone camera to instantly view your product catalog, contact you on WhatsApp, and place orders.
            </p>
            <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Link</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToPreview}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Test Live View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Popup Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Store QR Code
              </span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="w-48 h-48 mx-auto bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center justify-center shadow-inner">
              <img
                src={qrCodeUrl}
                alt="Store QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-indigo-900 block truncate">
                {fullLiveUrl}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Scan with any phone camera to visit store
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
