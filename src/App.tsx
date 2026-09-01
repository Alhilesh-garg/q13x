import React, { useState, useEffect, useRef } from 'react';
import { AppData, BusinessTitleStyle } from './types';
import { BrandIcon, detectPlatformFromUrl } from './components/BrandIcon';
import { BusinessStyleModal, DEFAULT_BUSINESS_STYLE } from './components/BusinessStyleModal';
import { HomeView } from './components/HomeView';
import { PublicStoreView } from './components/PublicStoreView';
import { StoreSuccessModal } from './components/StoreSuccessModal';
import {
  DEFAULT_API_BASE,
  ImageUploadItem,
  uploadImageToBackend,
  checkSubdomainAvailable,
  createStoreOnBackend,
  unlockStoreForEdit,
  updateStoreOnBackend,
} from './services/api';
import {
  UploadCloud,
  Trash2,
  Plus,
  Edit3,
  Eye,
  Palette,
  Check,
  CheckCircle2,
  Sparkles,
  Home,
  Globe,
  Share2,
  Copy,
  ArrowRight,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  Loader2,
  RefreshCw,
  Store,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STORAGE_KEY = 'store_draft_state';

const INITIAL_DEFAULT_DATA: AppData = {
  title: '',
  tagline: '',
  titleStyle: DEFAULT_BUSINESS_STYLE,
  socials: [],
  images: [],
  subdomain: '',
  baseDomain: 'q13x-three.vercel.app',
};

export default function App() {
  // Check if URL opened with ?store=subdomain
  const [initialStoreQuery] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('store');
    } catch {
      return null;
    }
  });

  const [mode, setMode] = useState<'home' | 'create' | 'edit' | 'preview' | 'public_store'>(
    initialStoreQuery ? 'public_store' : 'create'
  );
  const [publicViewSubdomain, setPublicViewSubdomain] = useState<string>(
    initialStoreQuery || ''
  );

  const [apiBase, setApiBase] = useState<string>(DEFAULT_API_BASE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Success Modal State
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    subdomain: string;
    storeName: string;
    pin: string;
  }>({
    isOpen: false,
    subdomain: '',
    storeName: '',
    pin: '',
  });

  // Current Store Draft / Builder State
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear any old mock/dummy template data
        if (parsed.title === 'LUMINA STUDIO' || parsed.subdomain === 'luminastudio') {
          localStorage.removeItem(STORAGE_KEY);
          return INITIAL_DEFAULT_DATA;
        }
        return {
          title: parsed.title || '',
          tagline: parsed.tagline || '',
          titleStyle: parsed.titleStyle || DEFAULT_BUSINESS_STYLE,
          socials: Array.isArray(parsed.socials) ? parsed.socials : [],
          images: Array.isArray(parsed.images) ? parsed.images : [],
          subdomain: parsed.subdomain || '',
          baseDomain: 'q13x-three.vercel.app',
        };
      }
    } catch (e) {
      console.error('Failed to parse userData:', e);
    }
    return INITIAL_DEFAULT_DATA;
  });

  // Business Name Style Modal state
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  // CREATE TAB: Image Upload State with ImgBB integration
  const [uploadItems, setUploadItems] = useState<ImageUploadItem[]>(() =>
    (appData.images || []).map((imgUrl, idx) => ({
      id: `init_${idx}`,
      previewUrl: imgUrl,
      status: 'done',
      url: imgUrl,
    }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CREATE TAB: Subdomain validation state
  const [createSubdomain, setCreateSubdomain] = useState<string>(
    appData.subdomain || ''
  );
  const [subdomainStatus, setSubdomainStatus] = useState<{
    checking: boolean;
    available: boolean;
    message: string;
  }>({
    checking: false,
    available: false,
    message: '',
  });

  // CREATE TAB: 6-Digit PIN State
  const [createPin, setCreatePin] = useState<string>('');
  const [createPinConfirm, setCreatePinConfirm] = useState<string>('');
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [showInBuilderPreview, setShowInBuilderPreview] = useState(false);

  // EDIT TAB: Unlock State
  const [editSubdomainInput, setEditSubdomainInput] = useState<string>('');
  const [editPinInput, setEditPinInput] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isEditUnlocked, setIsEditUnlocked] = useState(false);
  const [unlockedSubdomain, setUnlockedSubdomain] = useState<string>('');
  const [unlockedPin, setUnlockedPin] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editUploadItems, setEditUploadItems] = useState<ImageUploadItem[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [appData]);

  // Keep uploadItems and appData.images in sync
  useEffect(() => {
    const doneUrls = uploadItems.filter((item) => item.status === 'done' && item.url).map((item) => item.url!);
    if (JSON.stringify(doneUrls) !== JSON.stringify(appData.images)) {
      setAppData((prev) => ({ ...prev, images: doneUrls }));
    }
  }, [uploadItems]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Subdomain Sanitizer
  const sanitizeSubdomain = (val: string) => {
    return val
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  };

  // Subdomain Debounced Availability Check for Create Mode
  useEffect(() => {
    const cleanSub = createSubdomain.trim().toLowerCase();
    if (!cleanSub) {
      setSubdomainStatus({ checking: false, available: false, message: '' });
      return;
    }
    if (cleanSub.length < 3) {
      setSubdomainStatus({ checking: false, available: false, message: 'Too short (min 3 chars)' });
      return;
    }

    setSubdomainStatus({ checking: true, available: false, message: 'Checking...' });
    const timer = setTimeout(async () => {
      try {
        const res = await checkSubdomainAvailable(cleanSub, apiBase);
        if (res.available) {
          setSubdomainStatus({ checking: false, available: true, message: 'Available ✓' });
        } else {
          setSubdomainStatus({ checking: false, available: false, message: res.error || 'Taken' });
        }
      } catch (err: any) {
        setSubdomainStatus({ checking: false, available: false, message: 'Could not connect to server' });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [createSubdomain, apiBase]);

  // Handlers for AppData
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleTaglineChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setAppData((prev) => ({ ...prev, tagline: e.target.value }));
  };

  const handleApplyTitleStyle = (newStyle: BusinessTitleStyle) => {
    setAppData((prev) => ({ ...prev, titleStyle: newStyle }));
    showNotification('✓ Business style applied!');
  };

  // 1-Link-Per-Platform Social Management
  const existingPlatformIds = appData.socials.map((url) => detectPlatformFromUrl(url).id);

  const handleAddSocial = (defaultUrl: string = '', platformName?: string) => {
    const targetPlatform = detectPlatformFromUrl(defaultUrl);
    if (targetPlatform.id !== 'website' && existingPlatformIds.includes(targetPlatform.id)) {
      showNotification(`⚠️ ${targetPlatform.name} is already added! (1 per platform rule)`);
      return;
    }

    setAppData((prev) => ({
      ...prev,
      socials: [...prev.socials, defaultUrl],
    }));
    if (defaultUrl) {
      showNotification(`✓ ${targetPlatform.name} link added`);
    }
  };

  const handleUpdateSocial = (index: number, value: string) => {
    setAppData((prev) => {
      const updated = [...prev.socials];
      updated[index] = value;
      return { ...prev, socials: updated };
    });
  };

  const handleRemoveSocial = (index: number) => {
    setAppData((prev) => {
      const updated = [...prev.socials];
      updated.splice(index, 1);
      return { ...prev, socials: updated };
    });
  };

  // Image Upload Pipeline: Instant Browser Compression + ImgBB Upload
  const uploadFilesToImgBB = async (files: File[], isEditMode = false) => {
    const newItems: ImageUploadItem[] = files.map((file) => ({
      id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      previewUrl: URL.createObjectURL(file),
      status: 'uploading',
    }));

    if (isEditMode) {
      setEditUploadItems((prev) => [...prev, ...newItems]);
    } else {
      setUploadItems((prev) => [...prev, ...newItems]);
    }

    // Process parallel uploads
    files.forEach(async (file, idx) => {
      const item = newItems[idx];
      try {
        const uploadedUrl = await uploadImageToBackend(file, apiBase);
        const updateFn = (items: ImageUploadItem[]) =>
          items.map((it) =>
            it.id === item.id ? { ...it, status: 'done' as const, url: uploadedUrl } : it
          );

        if (isEditMode) {
          setEditUploadItems(updateFn);
        } else {
          setUploadItems(updateFn);
        }
        showNotification('✓ Image uploaded to ImgBB');
      } catch (err: any) {
        const updateFn = (items: ImageUploadItem[]) =>
          items.map((it) =>
            it.id === item.id ? { ...it, status: 'error' as const, error: err.message } : it
          );
        if (isEditMode) {
          setEditUploadItems(updateFn);
        } else {
          setUploadItems(updateFn);
        }
        showNotification(`✕ Upload failed: ${err.message}`);
      }
    });
  };

  const handleCreateImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFilesToImgBB(Array.from(e.target.files), false);
      e.target.value = '';
    }
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFilesToImgBB(Array.from(e.target.files), true);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number, isEditMode = false) => {
    if (isEditMode) {
      setEditUploadItems((prev) => {
        const next = [...prev];
        next.splice(index, 1);
        return next;
      });
    } else {
      setUploadItems((prev) => {
        const next = [...prev];
        next.splice(index, 1);
        return next;
      });
    }
  };

  // CREATE STORE SUBMIT
  const isCreatePinValid = /^\d{6}$/.test(createPin.trim());
  const isPinMatched = isCreatePinValid && createPin.trim() === createPinConfirm.trim();
  const hasPendingUploads = uploadItems.some((i) => i.status === 'uploading');
  const isCreateReady =
    appData.title.trim().length > 0 &&
    subdomainStatus.available &&
    isPinMatched &&
    !hasPendingUploads &&
    !isSubmittingCreate;

  const handleCreateStore = async () => {
    if (!isCreateReady) return;
    setIsSubmittingCreate(true);
    const finalSubdomain = createSubdomain.trim().toLowerCase();
    const finalPin = createPin.trim();
    const finalImages = uploadItems.filter((i) => i.status === 'done' && i.url).map((i) => i.url!);

    try {
      const payload = {
        subdomain: finalSubdomain,
        title: appData.title.trim(),
        tagline: appData.tagline.trim(),
        socials: appData.socials.filter((s) => s.trim().length > 0),
        images: finalImages,
        editPassword: finalPin,
      };

      await createStoreOnBackend(payload, apiBase);
      setAppData((prev) => ({ ...prev, subdomain: finalSubdomain, images: finalImages }));

      // Trigger Success Modal
      setSuccessModalData({
        isOpen: true,
        subdomain: finalSubdomain,
        storeName: appData.title.trim(),
        pin: finalPin,
      });

      showNotification('✓ Store published successfully on q13x-three.vercel.app!');
    } catch (err: any) {
      showNotification(`✕ Failed: ${err.message || 'Could not create store'}`);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // EDIT STORE: UNLOCK
  const handleUnlockStore = async () => {
    const sub = editSubdomainInput.trim().toLowerCase();
    const pin = editPinInput.trim();
    if (!sub || !/^\d{6}$/.test(pin)) {
      setUnlockError('Please enter your subdomain and 6-digit PIN.');
      return;
    }

    setIsUnlocking(true);
    setUnlockError(null);
    try {
      const res = await unlockStoreForEdit(sub, pin, apiBase);
      const store = res.store;

      setAppData({
        title: store.title || '',
        tagline: store.tagline || '',
        titleStyle: appData.titleStyle || DEFAULT_BUSINESS_STYLE,
        socials: store.socials || [],
        images: store.images || [],
        subdomain: sub,
        baseDomain: 'q13x-three.vercel.app',
      });

      setEditUploadItems(
        (store.images || []).map((imgUrl, idx) => ({
          id: `edit_init_${idx}`,
          previewUrl: imgUrl,
          status: 'done',
          url: imgUrl,
        }))
      );

      setUnlockedSubdomain(sub);
      setUnlockedPin(pin);
      setIsEditUnlocked(true);
      showNotification('✓ Store unlocked! You can now edit and save changes.');
    } catch (err: any) {
      setUnlockError(err.message || 'Invalid Subdomain or 6-digit PIN.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // EDIT STORE: SAVE CHANGES
  const handleSaveEditChanges = async () => {
    if (!isEditUnlocked || isSavingEdit) return;
    const hasEditPending = editUploadItems.some((i) => i.status === 'uploading');
    if (hasEditPending) {
      showNotification('⚠️ Please wait for images to finish uploading first.');
      return;
    }

    setIsSavingEdit(true);
    const finalImages = editUploadItems
      .filter((i) => i.status === 'done' && i.url)
      .map((i) => i.url!);

    try {
      const payload = {
        subdomain: unlockedSubdomain,
        editPassword: unlockedPin,
        title: appData.title.trim(),
        tagline: appData.tagline.trim(),
        socials: appData.socials.filter((s) => s.trim().length > 0),
        images: finalImages,
      };

      await updateStoreOnBackend(payload, apiBase);
      setAppData((prev) => ({ ...prev, images: finalImages }));
      showNotification('✓ Store changes saved successfully in Database!');

      setSuccessModalData({
        isOpen: true,
        subdomain: unlockedSubdomain,
        storeName: appData.title.trim(),
        pin: unlockedPin,
      });
    } catch (err: any) {
      showNotification(`✕ Save failed: ${err.message || 'Error updating store'}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Current Style
  const currentStyle = appData.titleStyle || DEFAULT_BUSINESS_STYLE;

  // Title CSS
  const computedTitleStyle: React.CSSProperties = {
    fontFamily: currentStyle.fontFamily || "'Outfit', sans-serif",
    fontStyle: currentStyle.fontStyle || 'normal',
    fontWeight:
      currentStyle.fontWeight === 'extrabold'
        ? 800
        : currentStyle.fontWeight === 'bold'
        ? 700
        : currentStyle.fontWeight === 'semibold'
        ? 600
        : 400,
    textTransform: currentStyle.textTransform || 'none',
    display: 'inline-block',
    ...(currentStyle.colorType === 'gradient' && currentStyle.gradient
      ? {
          backgroundImage: currentStyle.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }
      : {
          color: currentStyle.solidColor || '#0f172a',
        }),
  };

  // Quick Platforms Catalog
  const QUICK_PLATFORMS = [
    { id: 'whatsapp', url: 'https://wa.me/', name: 'WhatsApp' },
    { id: 'phone', url: 'tel:+', name: 'Phone' },
    { id: 'maps', url: 'https://maps.google.com/?q=', name: 'Google Map' },
    { id: 'instagram', url: 'https://instagram.com/', name: 'Instagram' },
    { id: 'youtube', url: 'https://youtube.com/@', name: 'YouTube' },
    { id: 'twitter', url: 'https://x.com/', name: 'X / Twitter' },
    { id: 'facebook', url: 'https://facebook.com/', name: 'Facebook' },
    { id: 'telegram', url: 'https://t.me/', name: 'Telegram' },
    { id: 'website', url: 'https://', name: 'Website' },
  ];

  // If in Standalone Public Storefront mode (?store=subdomain)
  if (mode === 'public_store') {
    return (
      <PublicStoreView
        subdomain={publicViewSubdomain}
        onOpenEditWithSubdomain={(sub) => {
          setEditSubdomainInput(sub);
          setMode('edit');
        }}
        onBackToBuilder={() => setMode('create')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-4 py-2 flex justify-between items-center shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('home')}
            className="font-extrabold text-xs sm:text-sm tracking-wider uppercase text-slate-900 flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden xs:inline">STORE BUILDER</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold">
              q13x-three.vercel.app
            </span>
          </button>
        </div>

        {/* 4 Main View Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {/* Home Tab */}
            <button
              id="homeModeTabBtn"
              type="button"
              onClick={() => setMode('home')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 sm:gap-1.5 ${
                mode === 'home'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home size={13} />
              <span className="hidden sm:inline">Home</span>
            </button>

            {/* Create Tab */}
            <button
              id="createModeTabBtn"
              type="button"
              onClick={() => setMode('create')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 sm:gap-1.5 ${
                mode === 'create'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Plus size={13} />
              <span>Create Store</span>
            </button>

            {/* Edit Tab (PIN Protected) */}
            <button
              id="editModeTabBtn"
              type="button"
              onClick={() => setMode('edit')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 sm:gap-1.5 ${
                mode === 'edit'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Lock size={13} className={isEditUnlocked ? 'text-emerald-600' : ''} />
              <span>{isEditUnlocked ? 'Editing Store' : 'Edit Store'}</span>
            </button>

            {/* Preview Tab */}
            <button
              id="previewModeTabBtn"
              type="button"
              onClick={() => setMode('preview')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 sm:gap-1.5 ${
                mode === 'preview'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </header>

      {/* TAB 1: HOME VIEW */}
      {mode === 'home' && (
        <HomeView
          appData={appData}
          onNavigateToCreate={() => setMode('create')}
          onNavigateToEdit={() => setMode('edit')}
          onNavigateToPreview={() => setMode('preview')}
        />
      )}

      {/* TAB 2: CREATE STORE BUILDER (With ImgBB Upload & 6-Digit PIN) */}
      {mode === 'create' && (
        <div className="container max-w-xl mx-auto my-5 px-4 w-full flex-1 animate-in fade-in duration-100 space-y-5 pb-20">
          {/* Card 1: Business Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Store size={16} className="text-indigo-600" />
                <span>Business & Profile Details</span>
              </h2>
              <span className="text-[11px] text-slate-400">Step 1</span>
            </div>

            {/* Business Name with Style Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="c-title" className="text-xs font-bold text-slate-800">
                  Business / Shop Name
                </label>
                <button
                  type="button"
                  id="openBusinessStyleBtn"
                  onClick={() => setIsStyleModalOpen(true)}
                  className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 active:scale-95 border border-pink-200 rounded-lg text-xs font-bold text-pink-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Customize fonts, colors, and cursive styling"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                    style={{
                      background:
                        currentStyle.colorType === 'gradient'
                          ? currentStyle.gradient
                          : currentStyle.solidColor,
                    }}
                  />
                  <span>Customize Style & Color</span>
                  <Palette size={13} className="text-pink-600" />
                </button>
              </div>

              <input
                id="c-title"
                type="text"
                placeholder="e.g. Meera's Kitchen / LUMINA STUDIO"
                value={appData.title}
                onChange={handleTitleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            {/* Tagline / Bio Description */}
            <div>
              <label htmlFor="c-tagline" className="text-xs font-bold text-slate-800 block mb-1.5">
                Bio / Tagline Description
              </label>
              <textarea
                id="c-tagline"
                placeholder="What do you do, in one or two lines (e.g. Handcrafted bespoke luxury apparel & lookbooks)"
                value={appData.tagline}
                onChange={handleTaglineChange}
                rows={2}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white text-slate-700 focus:border-slate-900 outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Card 2: Links (1-Per-Platform Rule) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Contact & Social Links ({appData.socials.length})
                </h2>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  Rule: 1 link per platform (WhatsApp, Phone, Google Maps, etc.)
                </p>
              </div>
              <span className="text-[11px] text-slate-400">Step 2</span>
            </div>

            {/* Quick Add Platform Icons */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Quick Add Link (Click icon):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {QUICK_PLATFORMS.map((item, idx) => {
                  const isAlreadyAdded =
                    item.id !== 'website' && existingPlatformIds.includes(item.id);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSocial(item.url, item.name)}
                      className={`relative transition-transform cursor-pointer focus:outline-none shrink-0 ${
                        isAlreadyAdded
                          ? 'opacity-40 hover:opacity-75'
                          : 'hover:scale-115 active:scale-95'
                      }`}
                      title={
                        isAlreadyAdded
                          ? `${item.name} is already added (1 only)`
                          : `Add ${item.name}`
                      }
                    >
                      <BrandIcon url={item.url} size="md" />
                      {isAlreadyAdded && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Links List */}
            <div className="space-y-2 pt-1">
              {appData.socials.map((url, index) => {
                const detected = detectPlatformFromUrl(url);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="shrink-0 flex items-center justify-center"
                      title={url.trim() ? detected.name : 'Link'}
                    >
                      <BrandIcon url={url} size="md" />
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. +919876543210, https://wa.me/..., maps.google.com, instagram.com"
                      value={url}
                      onChange={(e) => handleUpdateSocial(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white text-slate-900 font-mono outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(index)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors shrink-0"
                      title="Delete link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleAddSocial('')}
              className="w-full py-2 bg-slate-900 hover:bg-black active:scale-98 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
            >
              <Plus size={14} />
              <span>Add Another Link</span>
            </button>
          </div>

          {/* Card 3: Images with ImgBB Instant Upload */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Gallery Photos ({uploadItems.filter((i) => i.status === 'done').length})
                </h2>
                <p className="text-[10px] text-slate-500">
                  Auto-compressed in browser & hosted on ImgBB Cloud
                </p>
              </div>
              <span className="text-[11px] text-slate-400">Step 3</span>
            </div>

            {/* Drag and Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  uploadFilesToImgBB(Array.from(e.dataTransfer.files), false);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-slate-500 bg-slate-50/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <UploadCloud size={24} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Click to browse photos or drop them here
                </span>
                <span className="text-[11px] text-slate-500">
                  JPEG, PNG, WebP — uploads in parallel instantly
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleCreateImageSelect}
                className="hidden"
              />
            </div>

            {/* Images Grid with Status Badges */}
            {uploadItems.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {uploadItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 bg-slate-100 shadow-2xs"
                  >
                    <img
                      src={item.previewUrl}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Status Badge */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[10px] font-semibold py-1 px-1 text-center truncate">
                      {item.status === 'uploading' ? (
                        <span className="text-amber-300 flex items-center justify-center gap-1">
                          <Loader2 size={10} className="animate-spin" /> Uploading...
                        </span>
                      ) : item.status === 'done' ? (
                        <span className="text-emerald-400">Uploaded ✓</span>
                      ) : (
                        <span className="text-red-400">Failed ✕</span>
                      )}
                    </div>

                    {/* Delete Image */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx, false);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 4: Subdomain & 6-Digit PIN Security (Final Step) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Lock size={16} className="text-amber-600" />
                <span>Subdomain & 6-Digit PIN Security</span>
              </h2>
              <span className="text-[11px] text-slate-400">Step 4</span>
            </div>

            {/* Subdomain Input with Live Server Availability Check */}
            <div>
              <label htmlFor="c-subdomain" className="text-xs font-bold text-slate-800 block mb-1">
                Choose Subdomain Name
              </label>
              <div className="flex items-center rounded-xl border-2 border-slate-300 focus-within:border-indigo-600 bg-white overflow-hidden shadow-2xs transition-all">
                <span className="px-3 py-2.5 bg-slate-100 text-slate-500 text-xs sm:text-sm font-mono select-none border-r border-slate-200 font-semibold">
                  https://
                </span>
                <input
                  id="c-subdomain"
                  type="text"
                  placeholder="e.g. meeraskitchen"
                  value={createSubdomain}
                  onChange={(e) => setCreateSubdomain(sanitizeSubdomain(e.target.value))}
                  className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 font-mono outline-none bg-transparent"
                />
                <span className="px-3 py-2.5 bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-mono font-bold select-none border-l border-indigo-100">
                  .q13x-three.vercel.app
                </span>
              </div>

              {/* Subdomain Status */}
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-slate-500 text-[11px]">
                  Live URL: https://{createSubdomain || 'yourbrand'}.q13x-three.vercel.app
                </span>
                <span
                  className={`font-bold text-[11px] ${
                    subdomainStatus.available
                      ? 'text-emerald-600'
                      : subdomainStatus.checking
                      ? 'text-slate-500'
                      : 'text-red-600'
                  }`}
                >
                  {subdomainStatus.checking ? 'Checking server...' : subdomainStatus.message}
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 6-Digit PIN */}
            <div>
              <div className="space-y-1">
                <label htmlFor="c-pin" className="text-xs font-bold text-slate-900 block">
                  Choose a Secret 6-Digit PIN
                </label>
                <p className="text-[11px] text-slate-500">
                  This PIN is the <strong>only way</strong> to unlock and edit your store later. No password recovery exists.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    6-Digit PIN
                  </span>
                  <input
                    id="c-pin"
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={createPin}
                    onChange={(e) => setCreatePin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center font-mono text-lg font-bold tracking-widest bg-white text-slate-900 focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Confirm PIN
                  </span>
                  <input
                    id="c-pin-confirm"
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={createPinConfirm}
                    onChange={(e) => setCreatePinConfirm(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center font-mono text-lg font-bold tracking-widest bg-white text-slate-900 focus:border-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* PIN Status Message */}
              <div className="text-right text-[11px] font-bold mt-1">
                {createPin.length > 0 && !isCreatePinValid && (
                  <span className="text-red-500">PIN must be exactly 6 digits</span>
                )}
                {isCreatePinValid && createPinConfirm.length > 0 && !isPinMatched && (
                  <span className="text-red-500">PINs do not match ✕</span>
                )}
                {isPinMatched && (
                  <span className="text-emerald-600">PIN confirmed & match ✓</span>
                )}
              </div>
            </div>

            {/* In-Builder Live Preview Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInBuilderPreview(!showInBuilderPreview)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye size={13} />
                <span>{showInBuilderPreview ? 'Hide In-Builder Preview' : 'Show In-Builder Preview'}</span>
                {showInBuilderPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showInBuilderPreview && (
                <div className="mt-3 p-3 bg-slate-900/5 rounded-xl border border-slate-200">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md max-w-sm mx-auto">
                    {/* Wavy Nav */}
                    <div className="bg-white border-b border-slate-100 pt-2 pb-1 px-3 flex justify-center gap-2">
                      {appData.socials.map((s, idx) => (
                        <BrandIcon key={idx} url={s} size="sm" />
                      ))}
                    </div>
                    {/* Header */}
                    <div className="p-3 text-center">
                      <h3 style={computedTitleStyle} className="text-lg font-bold">
                        {appData.title || 'BUSINESS NAME'}
                      </h3>
                      {appData.tagline && (
                        <p className="text-[11px] text-slate-500 mt-1">{appData.tagline}</p>
                      )}
                    </div>
                    {/* Images */}
                    <div className="flex flex-col">
                      {uploadItems
                        .filter((i) => i.status === 'done')
                        .map((i, idx) => (
                          <img
                            key={idx}
                            src={i.previewUrl}
                            alt=""
                            className="w-full h-auto block"
                          />
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Create Store Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                id="c-submit"
                disabled={!isCreateReady}
                onClick={handleCreateStore}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  isCreateReady
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmittingCreate ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing Store to Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Create Store & Go Live ({createSubdomain}.q13x-three.vercel.app)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EDIT STORE MODE (6-Digit PIN Protected) */}
      {mode === 'edit' && (
        <div className="container max-w-xl mx-auto my-5 px-4 w-full flex-1 animate-in fade-in duration-100 space-y-5 pb-20">
          {/* STEP A: IF NOT UNLOCKED -> SHOW UNLOCK FORM */}
          {!isEditUnlocked ? (
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs font-bold">
                  <Lock size={24} />
                </div>
                <h1 className="text-lg font-bold text-slate-900">
                  Unlock Your Store to Edit
                </h1>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Enter your store subdomain and the 6-digit PIN you set when creating the store.
                </p>
              </div>

              {unlockError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle size={15} className="shrink-0 text-red-500" />
                  <span>{unlockError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="e-subdomain" className="text-xs font-bold text-slate-800 block mb-1">
                    Store Subdomain
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-indigo-600 bg-white overflow-hidden">
                    <span className="px-3 py-2.5 bg-slate-100 text-slate-500 text-xs font-mono select-none border-r border-slate-200 font-semibold">
                      https://
                    </span>
                    <input
                      id="e-subdomain"
                      type="text"
                      placeholder="meeraskitchen"
                      value={editSubdomainInput}
                      onChange={(e) => setEditSubdomainInput(sanitizeSubdomain(e.target.value))}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 font-mono outline-none"
                    />
                    <span className="px-3 py-2 bg-indigo-50 text-indigo-700 text-xs font-mono font-bold select-none border-l border-indigo-100">
                      .q13x-three.vercel.app
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="e-pin" className="text-xs font-bold text-slate-800 block mb-1">
                    6-Digit PIN
                  </label>
                  <input
                    id="e-pin"
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={editPinInput}
                    onChange={(e) => setEditPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-center font-mono text-xl font-bold tracking-widest bg-white text-slate-900 focus:border-slate-900 outline-none"
                  />
                </div>

                <button
                  type="button"
                  id="e-unlock"
                  disabled={isUnlocking}
                  onClick={handleUnlockStore}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isUnlocking ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying PIN with Server...</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={16} />
                      <span>Unlock Store for Editing</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('create')}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Don't have a store yet? Create a new one →
                </button>
              </div>
            </div>
          ) : (
            /* STEP B: UNLOCKED EDITOR */
            <div className="space-y-5">
              {/* Unlocked Status Top Pill */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Unlock size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      Unlocked: @{unlockedSubdomain}
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      https://{unlockedSubdomain}.q13x-three.vercel.app
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditUnlocked(false);
                    setEditPinInput('');
                    showNotification('Store locked.');
                  }}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Lock Store
                </button>
              </div>

              {/* Edit Details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Edit Business Details
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsStyleModalOpen(true)}
                    className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg text-xs font-bold text-pink-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Style & Font</span>
                    <Palette size={13} />
                  </button>
                </div>

                <div>
                  <label htmlFor="e-title" className="text-xs font-bold text-slate-800 block mb-1">
                    Business Name
                  </label>
                  <input
                    id="e-title"
                    type="text"
                    value={appData.title}
                    onChange={handleTitleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold bg-white text-slate-900 focus:border-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="e-tagline" className="text-xs font-bold text-slate-800 block mb-1">
                    Bio / Tagline
                  </label>
                  <textarea
                    id="e-tagline"
                    rows={2}
                    value={appData.tagline}
                    onChange={handleTaglineChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white text-slate-700 focus:border-slate-900 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Edit Links */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Contact & Social Links ({appData.socials.length})
                  </h2>
                  <span className="text-[10px] text-emerald-600 font-semibold">1 per platform</span>
                </div>

                <div className="space-y-2">
                  {appData.socials.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BrandIcon url={url} size="md" />
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleUpdateSocial(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono outline-none focus:border-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(index)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddSocial('')}
                  className="w-full py-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus size={14} /> Add Another Link
                </button>
              </div>

              {/* Edit Photos */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Gallery Photos ({editUploadItems.filter((i) => i.status === 'done').length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add More Photos
                  </button>
                </div>

                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImageSelect}
                  className="hidden"
                />

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {editUploadItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 bg-slate-100 shadow-2xs"
                    >
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[10px] py-1 px-1 text-center truncate">
                        {item.status === 'uploading' ? (
                          <span className="text-amber-300">Uploading...</span>
                        ) : item.status === 'done' ? (
                          <span className="text-emerald-400">Uploaded ✓</span>
                        ) : (
                          <span className="text-red-400">Failed</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx, true)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  id="e-save"
                  disabled={isSavingEdit}
                  onClick={handleSaveEditChanges}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Changes to Server...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Save Changes to Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PREVIEW MODE */}
      {mode === 'preview' && (
        <div id="previewContainer" className="w-full bg-white flex-1 animate-in fade-in duration-150">
          {/* Top Live Share Pill */}
          <div className="bg-slate-900 text-white px-3 py-1.5 sm:py-2 text-center text-xs flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
              <Globe size={13} />
              https://{appData.subdomain || 'yourstore'}.q13x-three.vercel.app
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://${appData.subdomain || 'yourstore'}.q13x-three.vercel.app`
                  );
                  showNotification('✓ Store link copied to clipboard!');
                }}
                className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Copy size={11} /> Copy Link
              </button>
              <button
                type="button"
                onClick={() => {
                  if (appData.subdomain) {
                    setPublicViewSubdomain(appData.subdomain);
                    setMode('public_store');
                  } else {
                    showNotification('⚠️ Please enter a subdomain and create your store first.');
                  }
                }}
                className="px-2 py-0.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ExternalLink size={11} /> Standalone View
              </button>
            </div>
          </div>

          {/* 1. Pure White Wavy Header Nav */}
          {appData.socials.length > 0 && (
            <div className="w-full bg-white relative z-10 border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <nav className="pt-2.5 pb-1 sm:pt-3 sm:pb-1.5 px-4 flex flex-row flex-nowrap items-center justify-center gap-3 sm:gap-4 overflow-x-auto whitespace-nowrap custom-scrollbar">
                {appData.socials.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-150 hover:scale-115 shrink-0 group focus:outline-none"
                  >
                    <BrandIcon
                      url={url}
                      size="md"
                      className="shadow-[0_2px_6px_rgba(0,0,0,0.08)] ring-1 ring-slate-100"
                    />
                  </a>
                ))}
              </nav>

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

          {/* 2. Business Title & Tagline */}
          <div className="text-center pt-4 sm:pt-6 pb-4 px-4 max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl leading-tight" style={computedTitleStyle}>
              {appData.title || 'BUSINESS NAME'}
            </h1>
            {appData.tagline && (
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed font-normal">
                {appData.tagline}
              </p>
            )}
          </div>

          {/* 3. Full-Bleed Continuous Edge-to-Edge Images */}
          <div className="flex flex-col w-full">
            {appData.images.length === 0 ? (
              <p className="text-slate-400 italic text-center py-12 px-4 w-full text-xs sm:text-sm">
                No images in gallery.
              </p>
            ) : (
              appData.images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-auto block m-0 p-0 border-none rounded-none shadow-none"
                  loading="lazy"
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Business Name Style Modal */}
      <BusinessStyleModal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        businessName={appData.title}
        initialStyle={currentStyle}
        onApply={handleApplyTitleStyle}
      />

      {/* Success Modal with Live URL, 6-Digit PIN & QR Code */}
      <StoreSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData((prev) => ({ ...prev, isOpen: false }))}
        subdomain={successModalData.subdomain}
        storeName={successModalData.storeName}
        pin={successModalData.pin}
        onViewLive={() => {
          setSuccessModalData((prev) => ({ ...prev, isOpen: false }));
          setPublicViewSubdomain(successModalData.subdomain);
          setMode('public_store');
        }}
      />
    </div>
  );
}
