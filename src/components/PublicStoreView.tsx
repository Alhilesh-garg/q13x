import React, { useEffect, useState } from 'react';
import { fetchPublicStore, PublicStoreData, DEFAULT_API_BASE } from '../services/api';
import { BrandIcon, detectPlatformFromUrl } from './BrandIcon';
import { Globe, Edit3, Plus, ArrowLeft, Loader2, AlertCircle, Copy, Share2 } from 'lucide-react';
import { AppData, BusinessTitleStyle } from '../types';
import { DEFAULT_BUSINESS_STYLE } from './BusinessStyleModal';

interface PublicStoreViewProps {
  subdomain?: string;
  storeData?: AppData | PublicStoreData | null;
  onOpenEditWithSubdomain?: (subdomain: string) => void;
  onBackToBuilder?: () => void;
}

function getFormattedLinkHref(rawUrl: string): { href: string; isPhone: boolean } {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return { href: '#', isPhone: false };
  const lower = trimmed.toLowerCase();

  if (lower.startsWith('tel:')) {
    return { href: trimmed, isPhone: true };
  }
  if (lower.startsWith('phone:')) {
    return { href: `tel:${trimmed.slice(6).trim()}`, isPhone: true };
  }
  const digitsAndPlus = trimmed.replace(/[^0-9+]/g, '');
  if (
    (trimmed.startsWith('+') && trimmed.length >= 7) ||
    (/^[0-9\s\-()+]{7,15}$/.test(trimmed) && !trimmed.includes('.') && !trimmed.includes('/'))
  ) {
    return { href: `tel:${digitsAndPlus}`, isPhone: true };
  }

  if (lower.startsWith('wa.me') || lower.startsWith('api.whatsapp.com')) {
    return { href: `https://${trimmed}`, isPhone: false };
  }

  if (!lower.startsWith('http://') && !lower.startsWith('https://') && !lower.startsWith('mailto:')) {
    return { href: `https://${trimmed}`, isPhone: false };
  }

  return { href: trimmed, isPhone: false };
}

export const PublicStoreView: React.FC<PublicStoreViewProps> = ({
  subdomain,
  storeData: initialStoreData,
  onOpenEditWithSubdomain,
  onBackToBuilder,
}) => {
  const [store, setStore] = useState<AppData | PublicStoreData | null>(initialStoreData || null);
  const [loading, setLoading] = useState<boolean>(!initialStoreData && Boolean(subdomain));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialStoreData) {
      setStore(initialStoreData);
      setLoading(false);
      return;
    }

    if (subdomain) {
      setLoading(true);
      setError(null);
      fetchPublicStore(subdomain, DEFAULT_API_BASE)
        .then((data) => {
          setStore(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Could not load store');
          setLoading(false);
        });
    }
  }, [subdomain, initialStoreData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
        <Loader2 size={32} className="animate-spin text-slate-800" />
        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          Loading storefront {subdomain ? `@${subdomain}` : ''}...
        </p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto font-bold">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Storefront Not Found</h2>
        <p className="text-xs text-slate-600">
          {error || 'This store does not exist or has not been created yet.'}
        </p>
        {onBackToBuilder && (
          <button
            type="button"
            onClick={onBackToBuilder}
            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Create a Store on q13x-three.vercel.app</span>
          </button>
        )}
      </div>
    );
  }

  const validSocialLinks = (store.socials || []).filter((url) => Boolean(url && url.trim()));
  const currentSubdomain = store.subdomain || subdomain || 'mystore';
  const liveUrl = `https://${currentSubdomain}.q13x-three.vercel.app`;

  const styleConfig: BusinessTitleStyle = (store as AppData).titleStyle || DEFAULT_BUSINESS_STYLE;

  const computedTitleStyle: React.CSSProperties = {
    fontFamily: styleConfig.fontFamily || "'Outfit', sans-serif",
    fontStyle: styleConfig.fontStyle || 'normal',
    fontWeight:
      styleConfig.fontWeight === 'extrabold'
        ? 800
        : styleConfig.fontWeight === 'bold'
        ? 700
        : styleConfig.fontWeight === 'semibold'
        ? 600
        : 400,
    textTransform: styleConfig.textTransform || 'none',
    display: 'inline-block',
    ...(styleConfig.colorType === 'gradient' && styleConfig.gradient
      ? {
          backgroundImage: styleConfig.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }
      : {
          color: styleConfig.solidColor || '#0f172a',
        }),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative">
      {/* Top Floating Control Bar (Optional / Subtle) */}
      <div className="bg-slate-900 text-white px-3 py-1.5 sm:py-2 text-xs flex items-center justify-between gap-2 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2 overflow-hidden">
          {onBackToBuilder && (
            <button
              type="button"
              onClick={onBackToBuilder}
              className="p-1 hover:bg-white/15 rounded text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Back to Studio Builder"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <span className="font-mono text-emerald-400 font-bold truncate">
            {liveUrl}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(liveUrl);
            }}
            className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Copy URL"
          >
            <Copy size={11} /> <span className="hidden sm:inline">Copy</span>
          </button>

          {onOpenEditWithSubdomain && (
            <button
              type="button"
              onClick={() => onOpenEditWithSubdomain(currentSubdomain)}
              className="px-2.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Edit3 size={11} /> <span>Edit Store</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Pure White Wavy Header Contact Bar */}
      {validSocialLinks.length > 0 && (
        <div className="w-full bg-white relative z-10 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <nav className="pt-2.5 pb-1 sm:pt-3 sm:pb-1.5 px-4 flex flex-row flex-nowrap items-center justify-center gap-3 sm:gap-4 overflow-x-auto whitespace-nowrap custom-scrollbar">
            {validSocialLinks.map((url, index) => {
              const detected = detectPlatformFromUrl(url);
              const { href, isPhone } = getFormattedLinkHref(url);
              return (
                <a
                  key={index}
                  href={href}
                  target={isPhone ? '_self' : '_blank'}
                  rel={isPhone ? undefined : 'noopener noreferrer'}
                  className="transition-all duration-150 hover:scale-115 shrink-0 group focus:outline-none"
                  title={detected.name}
                >
                  <BrandIcon
                    url={url}
                    size="md"
                    className="shadow-[0_2px_6px_rgba(0,0,0,0.08)] ring-1 ring-slate-100"
                  />
                </a>
              );
            })}
          </nav>

          {/* Pure White Wavy Bottom Cut */}
          <div className="w-full overflow-hidden leading-none relative">
            <svg
              viewBox="0 0 1440 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-3.5 sm:h-5 block"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C240,35 480,8 720,28 C960,48 1200,10 1440,22 L1440,45 L0,45 Z"
                fill="#ffffff"
              />
              <path
                d="M0,0 C240,35 480,8 720,28 C960,48 1200,10 1440,22"
                stroke="#f1f5f9"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>
      )}

      {/* 2. Business Header & Tagline */}
      <div className="text-center pt-4 sm:pt-6 pb-4 px-4 max-w-3xl mx-auto">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl leading-tight"
          style={computedTitleStyle}
        >
          {store.title || 'BUSINESS NAME'}
        </h1>

        {store.tagline && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed font-normal">
            {store.tagline}
          </p>
        )}
      </div>

      {/* 3. Full-Bleed Continuous Edge-to-Edge Image Gallery */}
      <div className="flex flex-col w-full flex-1">
        {(store.images || []).length === 0 ? (
          <p className="text-slate-400 italic text-center py-12 px-4 w-full text-xs sm:text-sm">
            No gallery images uploaded yet.
          </p>
        ) : (
          (store.images || []).map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Gallery item ${idx + 1}`}
              className="w-full h-auto block m-0 p-0 border-none rounded-none shadow-none"
              loading="lazy"
            />
          ))
        )}
      </div>

      {/* Footer Branding */}
      <footer className="py-6 text-center text-[11px] text-slate-400 bg-white border-t border-slate-100">
        <p>
          Powered by <span className="font-semibold text-slate-700">q13x-three.vercel.app</span> Storefronts
        </p>
      </footer>
    </div>
  );
};
