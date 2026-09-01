import React from 'react';

export interface PlatformInfo {
  id: string;
  name: string;
  badgeLabel: string;
}

export function detectPlatformFromUrl(url: string): PlatformInfo {
  const u = (url || '').trim().toLowerCase();
  if (!u) {
    return { id: 'website', name: 'Website', badgeLabel: 'Website' };
  }

  // Phone / Call Detection
  if (
    u.startsWith('tel:') ||
    u.startsWith('phone:') ||
    (u.startsWith('+') && u.length >= 7) ||
    (/^[0-9\s\-()+]{7,15}$/.test(u.replace(/[^0-9+]/g, '')) && !u.includes('.') && !u.includes('/'))
  ) {
    return { id: 'phone', name: 'Phone Call', badgeLabel: 'Call' };
  }

  // WhatsApp
  if (
    u.includes('wa.me') ||
    u.includes('whatsapp.com') ||
    u.includes('api.whatsapp.com') ||
    u.startsWith('whatsapp:')
  ) {
    return { id: 'whatsapp', name: 'WhatsApp', badgeLabel: 'WhatsApp' };
  }

  // Google Maps / Location
  if (
    u.includes('maps.google') ||
    u.includes('goo.gl/maps') ||
    u.includes('maps.app.goo.gl') ||
    u.includes('google.com/maps') ||
    u.startsWith('geo:') ||
    u.includes('waze.com') ||
    u.includes('map')
  ) {
    return { id: 'maps', name: 'Google Maps / Location', badgeLabel: 'Map' };
  }

  if (u.includes('instagram.com') || u.includes('instagr.am') || u.includes('ig.me')) {
    return { id: 'instagram', name: 'Instagram', badgeLabel: 'Instagram' };
  }
  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    return { id: 'youtube', name: 'YouTube', badgeLabel: 'YouTube' };
  }
  if (u.includes('twitter.com') || u.includes('x.com') || u.includes('t.co')) {
    return { id: 'twitter', name: 'X / Twitter', badgeLabel: 'X / Twitter' };
  }
  if (u.includes('facebook.com') || u.includes('fb.com') || u.includes('fb.me')) {
    return { id: 'facebook', name: 'Facebook', badgeLabel: 'Facebook' };
  }
  if (u.includes('tiktok.com')) {
    return { id: 'tiktok', name: 'TikTok', badgeLabel: 'TikTok' };
  }
  if (u.includes('t.me') || u.includes('telegram.me') || u.includes('telegram.org')) {
    return { id: 'telegram', name: 'Telegram', badgeLabel: 'Telegram' };
  }
  if (u.includes('spotify.com') || u.includes('open.spotify')) {
    return { id: 'spotify', name: 'Spotify', badgeLabel: 'Spotify' };
  }
  if (u.includes('pinterest.com') || u.includes('pin.it')) {
    return { id: 'pinterest', name: 'Pinterest', badgeLabel: 'Pinterest' };
  }
  if (u.includes('snapchat.com')) {
    return { id: 'snapchat', name: 'Snapchat', badgeLabel: 'Snapchat' };
  }
  if (u.includes('discord.gg') || u.includes('discord.com')) {
    return { id: 'discord', name: 'Discord', badgeLabel: 'Discord' };
  }
  if (u.includes('github.com')) {
    return { id: 'github', name: 'GitHub', badgeLabel: 'GitHub' };
  }
  if (u.includes('linkedin.com')) {
    return { id: 'linkedin', name: 'LinkedIn', badgeLabel: 'LinkedIn' };
  }
  if (
    u.includes('amazon.com') ||
    u.includes('amzn.to') ||
    u.includes('etsy.com') ||
    u.includes('shopify.com') ||
    u.includes('store') ||
    u.includes('shop')
  ) {
    return { id: 'shop', name: 'Store / Shop', badgeLabel: 'Store' };
  }
  if (u.includes('mailto:') || (u.includes('@') && !u.includes('/'))) {
    return { id: 'email', name: 'Email', badgeLabel: 'Email' };
  }

  return { id: 'website', name: 'Website', badgeLabel: 'Website' };
}

interface BrandIconProps {
  url: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ url, size = 'md', className = '' }) => {
  const platform = detectPlatformFromUrl(url);

  const sizeDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10',
  }[size];

  const iconGlyphSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    lg: 'w-5.5 h-5.5',
  }[size];

  switch (platform.id) {
    case 'phone':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
      );

    case 'maps':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-gradient-to-tr from-[#EA4335] via-[#FBBC05] to-[#34A853] p-[2px] flex items-center justify-center shrink-0 shadow-xs transition-transform ${className}`}
          title={platform.name}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#EA4335]">
            <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>
      );

    case 'whatsapp':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.301-.15-1.776-.875-2.05-1-.274-.125-.474-.15-.674.15-.2.3-.774 1-.949 1.2-.175.2-.35.225-.65.075-.3-.15-1.266-.467-2.411-1.488-.891-.795-1.493-1.778-1.668-2.078-.175-.3-.019-.462.131-.611.136-.134.301-.35.451-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.674-1.625-.924-2.225-.244-.585-.492-.506-.674-.515-.174-.01-.374-.01-.574-.01-.2 0-.525.075-.8.375-.274.3-1.049 1.025-1.049 2.5 0 1.475 1.074 2.9 1.224 3.1.15.2 2.114 3.23 5.122 4.53 3.008 1.3 3.008.867 3.558.817.55-.05 1.776-.725 2.026-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35zm-5.467 7.618h-.008a10.02 10.02 0 0 1-5.112-1.402l-.367-.218-3.799.996 1.014-3.704-.239-.38A9.97 9.97 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm0-22C5.383 0 0 5.383 0 12c0 2.115.548 4.184 1.59 6.002L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.617 0 12-5.383 12-12S18.617 0 12 0z" />
          </svg>
        </div>
      );

    case 'instagram':
      return (
        <div
          className={`${sizeDimensions} rounded-full flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          style={{
            background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
          }}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      );

    case 'youtube':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );

    case 'twitter':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-black border border-white/20 flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );

    case 'facebook':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      );

    case 'tiktok':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-black border border-white/20 flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        </div>
      );

    case 'telegram':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#229ED9] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
          </svg>
        </div>
      );

    case 'spotify':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#1ED760] flex items-center justify-center text-black shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.305c-.218.358-.68.47-1.038.252-2.846-1.74-6.428-2.133-10.648-1.17-.406.094-.813-.16-.906-.566-.093-.406.16-.813.566-.906 4.622-1.055 8.577-.61 11.774 1.348.358.218.47.68.252 1.042zm1.467-3.26c-.274.444-.855.586-1.3.312-3.257-2.002-8.223-2.584-12.076-1.413-.497.15-1.026-.134-1.176-.63-.15-.497.134-1.026.63-1.177 4.41-1.338 9.886-.688 13.61 1.608.444.274.586.855.312 1.3zm.126-3.41c-3.906-2.318-10.34-2.532-14.073-1.398-.598.182-1.23-.16-1.412-.758-.182-.598.16-1.23.758-1.412 4.29-1.302 11.39-1.048 15.86 1.606.538.318.713 1.018.395 1.556-.318.538-1.018.713-1.556.395l.028.011z" />
          </svg>
        </div>
      );

    case 'pinterest':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#E60023] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
        </div>
      );

    case 'snapchat':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#FFFC00] flex items-center justify-center text-black shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.164.814c-4.148 0-6.402 3.037-6.402 5.617 0 1.25.488 2.5 1.025 3.281.18.26.137.498-.06.74-.297.363-.787.973-1.018 1.264-.287.363-.615.305-.838.164-.672-.424-1.547-.84-2.275-.84-.576 0-1.029.352-.988.84.053.645.719 1.186 1.488 1.549.91.43 1.875.529 2.502.586.27.025.412.164.387.42-.09.914-.54 2.658-.916 3.635-.187.488-.545.697-.979.623-.539-.092-1.49-.314-2.193-.07-.449.156-.633.645-.338 1.074.529.773 1.957 1.441 3.238 1.594.393.047.604.225.754.58.463 1.096 1.428 1.83 2.928 2.01.275.033.479.16.549.426.152.576.494 1.17 1.082 1.488.584.316 1.344.209 2.053-.242.449-.287.896-.287 1.346 0 .709.451 1.469.559 2.053.242.588-.318.93-.912 1.082-1.488.07-.266.273-.393.549-.426 1.5-.18 2.465-.914 2.928-2.01.15-.355.361-.533.754-.58 1.281-.152 2.709-.82 3.238-1.594.295-.428.111-.918-.338-1.074-.703-.244-1.654-.021-2.193.07-.434.074-.791-.135-.979-.623-.375-.977-.826-2.721-.916-3.635-.025-.256.117-.395.387-.42.627-.057 1.592-.156 2.502-.586.77-.363 1.436-.904 1.488-1.549.041-.488-.412-.84-.988-.84-.729 0-1.604.416-2.275.84-.223.141-.551.199-.838-.164-.23-.291-.721-.901-1.018-1.264-.197-.242-.24-.48-.06-.74.537-.781 1.025-2.031 1.025-3.281 0-2.58-2.254-5.617-6.402-5.617z" />
          </svg>
        </div>
      );

    case 'discord':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#5865F2] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </div>
      );

    case 'github':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#24292e] border border-white/20 flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>
      );

    case 'linkedin':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-[#0A66C2] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </div>
      );

    case 'shop':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
      );

    case 'email':
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-gradient-to-tr from-[#E11D48] to-[#F43F5E] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`${sizeDimensions} rounded-full bg-gradient-to-tr from-[#2563EB] via-[#0284C7] to-[#06B6D4] flex items-center justify-center text-white shadow-xs shrink-0 transition-transform ${className}`}
          title={platform.name}
        >
          <svg className={iconGlyphSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
      );
  }
};
