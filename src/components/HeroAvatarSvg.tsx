import type { HeroId } from '../types/hifz';

interface HeroAvatarSvgProps {
  heroId: HeroId;
  className?: string;
}

export function HeroAvatarSvg({ heroId, className = 'w-12 h-12' }: HeroAvatarSvgProps) {
  switch (heroId) {
    case 'iron-hafiz':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#dc2626" stroke="#0f172a" strokeWidth="3.5" />
          <path
            d="M18 16 L46 16 L50 32 L42 50 L22 50 L14 32 Z"
            fill="#facc15"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          <rect x="20" y="25" width="10" height="5" rx="2" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <rect x="34" y="25" width="10" height="5" rx="2" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          <circle cx="32" cy="40" r="5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
        </svg>
      );
    case 'captain-noor':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#dc2626" stroke="#0f172a" strokeWidth="3.5" />
          <circle cx="32" cy="32" r="23" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="16" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="10" fill="#2563eb" stroke="#0f172a" strokeWidth="2.5" />
          <polygon
            points="32,23 34.4,29 41,29.5 36,33.8 37.5,40.2 32,36.8 26.5,40.2 28,33.8 23,29.5 29.6,29"
            fill="#facc15"
            stroke="#0f172a"
            strokeWidth="1.2"
          />
        </svg>
      );
    case 'spidey-reciter':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#e11d48" stroke="#0f172a" strokeWidth="3.5" />
          <path d="M32 2 V62 M2 32 H62 M11 11 L53 53 M53 11 L11 53" stroke="#0f172a" strokeWidth="1.8" opacity="0.5" />
          <path d="M13 24 Q22 20 29 31 Q20 38 13 24 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <path d="M51 24 Q42 20 35 31 Q44 38 51 24 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
        </svg>
      );
    case 'wakanda-guardian':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#6d28d9" stroke="#0f172a" strokeWidth="3.5" />
          <polygon points="18,16 25,24 17,28" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <polygon points="46,16 39,24 47,28" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <path d="M20 24 L32 18 L44 24 L42 46 L32 52 L22 46 Z" fill="#1e1b4b" stroke="#facc15" strokeWidth="2.5" />
          <rect x="22" y="30" width="8" height="4" rx="1.5" fill="#e9d5ff" />
          <rect x="34" y="30" width="8" height="4" rx="1.5" fill="#e9d5ff" />
          <path d="M24 41 L32 45 L40 41" stroke="#facc15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'thunder-qari':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#0284c7" stroke="#0f172a" strokeWidth="3.5" />
          <polygon
            points="35,10 19,34 31,34 27,54 45,28 33,28"
            fill="#facc15"
            stroke="#0f172a"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
