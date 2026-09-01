export interface BusinessTitleStyle {
  colorType: 'solid' | 'gradient';
  solidColor: string;
  gradient: string;
  fontFamily: string;
  fontStyle: 'normal' | 'italic';
  fontWeight: 'normal' | 'semibold' | 'bold' | 'extrabold';
  letterSpacing: 'tracking-tight' | 'tracking-normal' | 'tracking-wide' | 'tracking-widest';
  textTransform: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
  fontSize: 'text-2xl' | 'text-3xl' | 'text-4xl' | 'text-5xl';
}

export interface AppData {
  title: string;
  tagline: string;
  titleStyle?: BusinessTitleStyle;
  socials: string[]; // List of URLs entered by user
  images: string[];
  subdomain?: string;
  baseDomain?: string;
}
