import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  QrCode,
  Lock,
  X,
  Store,
} from 'lucide-react';

interface StoreSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  storeName: string;
  pin: string;
  onViewLive: () => void;
}

export const StoreSuccessModal: React.FC<StoreSuccessModalProps> = ({
  isOpen,
  onClose,
  subdomain,
  storeName,
  pin,
  onViewLive,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showQrExpanded, setShowQrExpanded] = useState(false);

  if (!isOpen) return null;

  const liveSubdomainUrl = `https://${subdomain}.ytmxcd.ai.studio`;
  const trialStoreUrl = `${window.location.origin}${window.location.pathname}?store=${encodeURIComponent(
    subdomain
  )}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    trialStoreUrl
  )}&margin=8`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(liveSubdomainUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyPin = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(pin);
      }
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out ${storeName || 'my store'} on our official link: ${liveSubdomainUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName || 'My Store',
          text: `Visit ${storeName} at ${liveSubdomainUrl}`,
          url: trialStoreUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white max-w-md w-full rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Your Store is Now Live!
              </h2>
              <p className="text-[11px] text-slate-500">{storeName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live URL Pill Box */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Official Subdomain URL
            </span>
            <span>Live on ytmxcd.ai.studio</span>
          </div>

          <div className="bg-black/50 border border-white/10 p-2.5 rounded-lg flex items-center justify-between gap-2 overflow-hidden">
            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-300 truncate">
              {liveSubdomainUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-bold rounded-md flex items-center gap-1 shrink-0 cursor-pointer transition-all"
            >
              {copiedLink ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 6-Digit PIN Alert Banner (Crucial!) */}
        <div className="bg-amber-50 border-2 border-amber-300/80 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-900">
            <Lock size={16} className="text-amber-600 shrink-0" />
            <span className="text-xs font-bold">Your Secret 6-Digit PIN:</span>
          </div>

          <div className="flex items-center justify-between bg-white border border-amber-200 p-2 rounded-lg">
            <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-widest text-slate-900 px-2">
              {pin || '••••••'}
            </span>
            <button
              type="button"
              onClick={handleCopyPin}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-bold rounded-md flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
            >
              {copiedPin ? (
                <>
                  <Check size={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy PIN</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-amber-800 leading-snug">
            ⚠️ <strong>Save this PIN safely.</strong> You will need your subdomain and this 6-digit PIN to edit your store later.
          </p>
        </div>

        {/* QR Code & Share Options */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <img
            src={qrCodeUrl}
            alt="Store QR"
            className="w-16 h-16 bg-white rounded-lg border border-slate-200 p-1 shrink-0 cursor-pointer"
            onClick={() => setShowQrExpanded(!showQrExpanded)}
            title="Click to expand QR"
          />
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 block">
              Scan & Share Store
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handleNativeShare}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Share2 size={12} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onViewLive}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <ExternalLink size={15} />
            <span>Open Live Store</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
