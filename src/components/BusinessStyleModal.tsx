import React, { useState, useEffect } from 'react';
import { X, Check, Type, Palette, Sparkles, RotateCcw } from 'lucide-react';
import { BusinessTitleStyle } from '../types';

export interface BusinessStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  initialStyle?: BusinessTitleStyle;
  onApply: (style: BusinessTitleStyle) => void;
}

export const DEFAULT_BUSINESS_STYLE: BusinessTitleStyle = {
  colorType: 'solid',
  solidColor: '#0f172a',
  gradient: 'linear-gradient(90deg, #ec4899 0%, #f59e0b 100%)',
  fontFamily: "'Outfit', sans-serif",
  fontStyle: 'normal',
  fontWeight: 'extrabold',
  letterSpacing: 'tracking-widest',
  textTransform: 'uppercase',
  fontSize: 'text-3xl',
};

const FONT_OPTIONS = [
  // Cursive & Script
  { name: 'Dancing Script', label: 'Cursive Signature', font: "'Dancing Script', cursive", category: 'Cursive' },
  { name: 'Great Vibes', label: 'Luxury Calligraphy', font: "'Great Vibes', cursive", category: 'Cursive' },
  { name: 'Pacifico', label: 'Playful Brush Script', font: "'Pacifico', cursive", category: 'Cursive' },
  { name: 'Caveat', label: 'Handwritten Chic', font: "'Caveat', cursive", category: 'Cursive' },
  // Serif & Editorial
  { name: 'Playfair Display', label: 'Editorial Luxury Serif', font: "'Playfair Display', serif", category: 'Serif' },
  { name: 'Cinzel', label: 'Royal Classic Serif', font: "'Cinzel', serif", category: 'Serif' },
  { name: 'Cormorant Garamond', label: 'Fine Aesthetic Serif', font: "'Cormorant Garamond', serif", category: 'Serif' },
  // Modern Sans
  { name: 'Outfit', label: 'Modern Studio Sans', font: "'Outfit', sans-serif", category: 'Sans' },
  { name: 'Montserrat', label: 'Geometric Bold Sans', font: "'Montserrat', sans-serif", category: 'Sans' },
  { name: 'Plus Jakarta Sans', label: 'Clean Contemporary', font: "'Plus Jakarta Sans', sans-serif", category: 'Sans' },
];

const PRESET_GRADIENTS = [
  { name: 'Rose & Amber Gold', value: 'linear-gradient(90deg, #ec4899 0%, #f59e0b 100%)' },
  { name: 'Sunset Glow', value: 'linear-gradient(90deg, #f43f5e 0%, #fb923c 50%, #eab308 100%)' },
  { name: 'Ocean Teal & Cyan', value: 'linear-gradient(90deg, #0d9488 0%, #06b6d4 50%, #3b82f6 100%)' },
  { name: 'Neon Orchid & Violet', value: 'linear-gradient(90deg, #d946ef 0%, #8b5cf6 50%, #06b6d4 100%)' },
  { name: 'Berry Wine & Plum', value: 'linear-gradient(90deg, #831843 0%, #9d174d 50%, #7c3aed 100%)' },
  { name: 'Royal Gold & Bronze', value: 'linear-gradient(90deg, #b45309 0%, #d97706 50%, #f59e0b 100%)' },
  { name: 'Obsidian Velvet Dark', value: 'linear-gradient(90deg, #0f172a 0%, #334155 50%, #1e293b 100%)' },
  { name: 'Emerald & Lime', value: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #84cc16 100%)' },
];

const PRESET_SOLIDS = [
  { name: 'Midnight Charcoal', value: '#0f172a' },
  { name: 'Crimson Rose', value: '#e11d48' },
  { name: 'Luxury Amber Gold', value: '#d97706' },
  { name: 'Deep Sea Teal', value: '#0f766e' },
  { name: 'Royal Indigo', value: '#4338ca' },
  { name: 'Velvet Purple', value: '#7e22ce' },
  { name: 'Emerald Green', value: '#047857' },
  { name: 'Hot Pink', value: '#db2777' },
  { name: 'Vibrant Coral', value: '#ea580c' },
  { name: 'Warm Mocha Bronze', value: '#78350f' },
  { name: 'Muted Slate', value: '#475569' },
  { name: 'Electric Blue', value: '#2563eb' },
];

export const BusinessStyleModal: React.FC<BusinessStyleModalProps> = ({
  isOpen,
  onClose,
  businessName,
  initialStyle,
  onApply,
}) => {
  const [style, setStyle] = useState<BusinessTitleStyle>(initialStyle || DEFAULT_BUSINESS_STYLE);
  // 3 distinct tabs: 'color' (solid), 'gradient', 'text' (font & style)
  const [activeTab, setActiveTab] = useState<'color' | 'gradient' | 'text'>('color');
  const [customColor1, setCustomColor1] = useState<string>('#ec4899');
  const [customColor2, setCustomColor2] = useState<string>('#f59e0b');

  // ONLY sync when modal opens initially, NEVER reset activeTab while user is testing styles/fonts!
  useEffect(() => {
    if (isOpen) {
      const current = initialStyle || DEFAULT_BUSINESS_STYLE;
      setStyle(current);
      // Keep current active tab if user was already in modal, or default based on color type on first open
      setActiveTab((prev) => {
        if (prev === 'text') return 'text';
        return current.colorType === 'gradient' ? 'gradient' : 'color';
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = businessName && businessName.trim() ? businessName : 'BUSINESS NAME';

  // Build computed CSS for live preview
  const previewStyle: React.CSSProperties = {
    fontFamily: style.fontFamily,
    fontStyle: style.fontStyle,
    fontWeight:
      style.fontWeight === 'extrabold'
        ? 800
        : style.fontWeight === 'bold'
        ? 700
        : style.fontWeight === 'semibold'
        ? 600
        : 400,
    textTransform: style.textTransform,
    display: 'inline-block',
    ...(style.colorType === 'gradient'
      ? {
          backgroundImage: style.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }
      : {
          color: style.solidColor,
        }),
  };

  const getLetterSpacingClass = (ls: string) => {
    switch (ls) {
      case 'tracking-tight':
        return 'tracking-tighter';
      case 'tracking-normal':
        return 'tracking-normal';
      case 'tracking-wide':
        return 'tracking-wide';
      case 'tracking-widest':
        return 'tracking-widest';
      default:
        return 'tracking-normal';
    }
  };

  const handleApply = () => {
    onApply(style);
    onClose();
  };

  const updateAndApply = (newPartial: Partial<BusinessTitleStyle>) => {
    const updated = { ...style, ...newPartial };
    setStyle(updated);
    // Instant live sync without resetting the tab
    onApply(updated);
  };

  const handleResetToDefault = () => {
    setStyle(DEFAULT_BUSINESS_STYLE);
    onApply(DEFAULT_BUSINESS_STYLE);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP HEADER WITH APPLY BUTTON AT TOP */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-2xs shrink-0">
              <Palette size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Business Style & Color
              </h3>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Choose Color, Gradient, or Font style
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prominent Apply Button at Top */}
            <button
              type="button"
              id="topApplyBusinessStyleBtn"
              onClick={handleApply}
              className="px-3 sm:px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Check size={13} className="sm:w-[14px] sm:h-[14px]" />
              <span>Apply</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Reset to default"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. FIXED / STICKY BUSINESS NAME PREVIEW (DOES NOT SCROLL) */}
        <div className="p-2.5 sm:p-3.5 bg-slate-100/70 border-b border-slate-200 shrink-0 text-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Live Preview (Fixed)
          </span>
          <div className="bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-slate-200 shadow-2xs min-h-[48px] sm:min-h-[60px] flex items-center justify-center overflow-x-auto">
            <div
              className={`text-lg sm:text-2xl md:text-3xl ${getLetterSpacingClass(
                style.letterSpacing
              )} transition-all duration-150 leading-tight`}
              style={previewStyle}
            >
              {displayName}
            </div>
          </div>
        </div>

        {/* 3. THREE DISTINCT BUTTONS: COLOR, GRADIENT, TEXT (FIXED NAVIGATION) */}
        <div className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {/* Button 1: Color */}
            <button
              type="button"
              id="tabColorBtn"
              onClick={() => {
                setActiveTab('color');
                if (style.colorType !== 'solid') {
                  updateAndApply({ colorType: 'solid' });
                }
              }}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'color'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Palette size={13} className={activeTab === 'color' ? 'text-pink-400' : 'text-slate-500'} />
              <span>Color</span>
            </button>

            {/* Button 2: Gradient */}
            <button
              type="button"
              id="tabGradientBtn"
              onClick={() => {
                setActiveTab('gradient');
                if (style.colorType !== 'gradient') {
                  updateAndApply({ colorType: 'gradient' });
                }
              }}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'gradient'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles size={13} className={activeTab === 'gradient' ? 'text-amber-400' : 'text-slate-500'} />
              <span>Gradient</span>
            </button>

            {/* Button 3: Text / Font */}
            <button
              type="button"
              id="tabTextBtn"
              onClick={() => setActiveTab('text')}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'text'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Type size={13} className={activeTab === 'text' ? 'text-blue-400' : 'text-slate-500'} />
              <span>Text / Font</span>
            </button>
          </div>
        </div>

        {/* 4. SCROLLABLE CONTROLS BODY (ONLY THIS PART SCROLLS) */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-4 overscroll-contain">
          {/* TAB 1: SOLID COLOR CONTROLS */}
          {activeTab === 'color' && (
            <div className="space-y-3 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Custom Solid Color</span>
                <span className="text-[11px] text-slate-500">Pick or type HEX</span>
              </div>

              {/* Custom Color Native Input */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200">
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={style.solidColor}
                    onChange={(e) =>
                      updateAndApply({
                        colorType: 'solid',
                        solidColor: e.target.value,
                      })
                    }
                    className="w-9 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                </div>
                <input
                  type="text"
                  value={style.solidColor}
                  onChange={(e) =>
                    updateAndApply({
                      colorType: 'solid',
                      solidColor: e.target.value,
                    })
                  }
                  placeholder="#0f172a"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-white text-slate-800 focus:border-slate-900 outline-none"
                />
              </div>

              {/* Preset Solid Swatches */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Popular Solid Colors (Click to apply):
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {PRESET_SOLIDS.map((p, idx) => {
                    const isSelected =
                      style.colorType === 'solid' &&
                      style.solidColor.toLowerCase() === p.value.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          updateAndApply({
                            colorType: 'solid',
                            solidColor: p.value,
                          })
                        }
                        className={`p-1.5 sm:p-2 rounded-xl border flex flex-col items-center gap-1 sm:gap-1.5 transition-all cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className="w-full h-5 sm:h-6 rounded-lg shadow-2xs ring-1 ring-black/5"
                          style={{ backgroundColor: p.value }}
                        />
                        <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                          {p.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRADIENT CONTROLS */}
          {activeTab === 'gradient' && (
            <div className="space-y-3.5 animate-in fade-in duration-100">
              <span className="text-xs font-bold text-slate-800 block">
                Radiant Multi-Color Gradients (Click to apply):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_GRADIENTS.map((g, idx) => {
                  const isSelected =
                    style.colorType === 'gradient' && style.gradient === g.value;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        updateAndApply({
                          colorType: 'gradient',
                          gradient: g.value,
                        })
                      }
                      className={`p-2 sm:p-2.5 rounded-xl border text-left flex items-center gap-2.5 sm:gap-3 transition-all cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'border-pink-500 ring-2 ring-pink-400/30 bg-pink-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shadow-2xs shrink-0 ring-1 ring-black/10"
                        style={{ background: g.value }}
                      />
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {g.name}
                        </span>
                        <span className="text-[10px] text-slate-400">Multi-tone</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Dual Gradient Mixer */}
              <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Create Custom 2-Color Gradient:
                </span>
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-600">From:</span>
                    <input
                      type="color"
                      value={customColor1}
                      onChange={(e) => {
                        setCustomColor1(e.target.value);
                        const grad = `linear-gradient(90deg, ${e.target.value} 0%, ${customColor2} 100%)`;
                        updateAndApply({ colorType: 'gradient', gradient: grad });
                      }}
                      className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-600">To:</span>
                    <input
                      type="color"
                      value={customColor2}
                      onChange={(e) => {
                        setCustomColor2(e.target.value);
                        const grad = `linear-gradient(90deg, ${customColor1} 0%, ${e.target.value} 100%)`;
                        updateAndApply({ colorType: 'gradient', gradient: grad });
                      }}
                      className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
                    />
                  </div>
                  <div
                    className="w-full sm:flex-1 h-6 sm:h-7 rounded-md border border-slate-200 shadow-2xs"
                    style={{
                      background: `linear-gradient(90deg, ${customColor1} 0%, ${customColor2} 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEXT & FONT CONTROLS */}
          {activeTab === 'text' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* Font Family (Cursive, Serif, Sans) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 block">
                    Choose Font Family:
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    Live Testing Active
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FONT_OPTIONS.map((f, idx) => {
                    const isSelected = style.fontFamily === f.font;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => updateAndApply({ fontFamily: f.font })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-98 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-400/30 shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {f.category}
                          </span>
                          {isSelected && <Check size={13} className="text-blue-600" />}
                        </div>
                        <span
                          style={{ fontFamily: f.font }}
                          className="text-base sm:text-lg font-semibold text-slate-900 truncate"
                        >
                          {displayName}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-sans mt-0.5">
                          {f.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Style Adjustments */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">
                  Font Style & Letter Adjustments:
                </span>

                {/* Italic & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Italic Slant */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Font Slant (Italic)
                    </label>
                    <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateAndApply({ fontStyle: 'normal' })}
                        className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                          style.fontStyle === 'normal'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAndApply({ fontStyle: 'italic' })}
                        className={`flex-1 py-1 text-xs font-semibold italic rounded-md transition-all cursor-pointer ${
                          style.fontStyle === 'italic'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Italic <i>(Slanted)</i>
                      </button>
                    </div>
                  </div>

                  {/* Font Weight */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Font Weight (Thickness)
                    </label>
                    <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateAndApply({ fontWeight: 'normal' })}
                        className={`flex-1 py-1 text-xs rounded-md transition-all cursor-pointer ${
                          style.fontWeight === 'normal'
                            ? 'bg-slate-900 text-white font-normal'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Regular
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAndApply({ fontWeight: 'bold' })}
                        className={`flex-1 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          style.fontWeight === 'bold'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Bold
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAndApply({ fontWeight: 'extrabold' })}
                        className={`flex-1 py-1 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
                          style.fontWeight === 'extrabold'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Heavy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Letter Spacing & Letter Casing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Spacing */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Letter Spacing
                    </label>
                    <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 text-center">
                      <button
                        type="button"
                        onClick={() => updateAndApply({ letterSpacing: 'tracking-normal' })}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          style.letterSpacing === 'tracking-normal'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAndApply({ letterSpacing: 'tracking-wide' })}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          style.letterSpacing === 'tracking-wide'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Wide
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAndApply({ letterSpacing: 'tracking-widest' })}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          style.letterSpacing === 'tracking-widest'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Spaced
                      </button>
                    </div>
                  </div>

                  {/* Text Transform / Casing */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Letter Casing
                    </label>
                    <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 text-center">
                      <button
                        type="button"
                        onClick={() => updateAndApply({ textTransform: 'uppercase' })}
                        className={`flex-1 py-1 text-[11px] font-semibold uppercase rounded-md transition-all cursor-pointer ${
                          style.textTransform === 'uppercase'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        UPPER
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAndApply({ textTransform: 'capitalize' })}
                        className={`flex-1 py-1 text-[11px] font-semibold capitalize rounded-md transition-all cursor-pointer ${
                          style.textTransform === 'capitalize'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Title
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAndApply({ textTransform: 'none' })}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          style.textTransform === 'none'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        As Typed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. MODAL FOOTER */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            id="bottomApplyBusinessStyleBtn"
            onClick={handleApply}
            className="px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-md flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
          >
            <Check size={15} />
            <span>Apply Style</span>
          </button>
        </div>
      </div>
    </div>
  );
};
