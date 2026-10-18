import React from 'react';

interface SvgArchitecturalThumbProps {
  styleType: 'contemporary' | 'highrise' | 'eco_luxury' | 'skyline' | 'podium' | 'minimalist';
  projectName: string;
  location: string;
  stage: 'Under Construction' | 'Ready to Move';
  className?: string;
}

export const SvgArchitecturalThumb: React.FC<SvgArchitecturalThumbProps> = ({
  styleType,
  projectName,
  location,
  stage,
  className = 'w-full h-48',
}) => {
  // Deterministic SVG architectural elevations tailored to Pune luxury projects
  return (
    <div className={`relative overflow-hidden rounded-t-xl select-none ${className}`}>
      {styleType === 'contemporary' && (
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sky-contemp" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B192C" />
              <stop offset="50%" stopColor="#1E3E62" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="facade-metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="glass-tint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#sky-contemp)" />
          {/* Distant Hills (Baner Foothills) */}
          <path d="M0,240 Q150,180 300,220 T600,200 L600,320 L0,320 Z" fill="#334155" opacity="0.3" />
          <path d="M0,260 Q180,210 380,245 T600,230 L600,320 L0,320 Z" fill="#1E293B" opacity="0.4" />

          {/* Tower Superstructure */}
          <rect x="180" y="40" width="240" height="260" rx="4" fill="url(#facade-metal)" />
          {/* Cantilevered Glass Balconies */}
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i}>
              <rect x="160" y={60 + i * 22} width="110" height="14" rx="2" fill="url(#glass-tint)" />
              <rect x="290" y={60 + i * 22} width="150" height="14" rx="2" fill="url(#glass-tint)" />
              {/* Balcony railings */}
              <line x1="160" y1={60 + i * 22} x2="270" y2={60 + i * 22} stroke="#CBD5E1" strokeWidth="1" />
              <line x1="290" y1={60 + i * 22} x2="440" y2={60 + i * 22} stroke="#CBD5E1" strokeWidth="1" />
            </g>
          ))}
          {/* Warm Penthouse Light */}
          <rect x="190" y="48" width="220" height="8" fill="#FDE047" opacity="0.7" />
          {/* Podium Green Terrace */}
          <rect x="120" y="270" width="360" height="50" rx="3" fill="#065F46" />
          <circle cx="150" cy="265" r="14" fill="#047857" />
          <circle cx="180" cy="268" r="10" fill="#10B981" />
          <circle cx="420" cy="265" r="16" fill="#047857" />
          <circle cx="450" cy="268" r="11" fill="#10B981" />
          {/* Ground Accent */}
          <rect x="0" y="300" width="600" height="20" fill="#0F172A" />
        </svg>
      )}

      {styleType === 'highrise' && (
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sky-highrise" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="highrise-lum" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#sky-highrise)" />
          {/* Left Tower */}
          <rect x="120" y="50" width="160" height="270" fill="url(#highrise-lum)" stroke="#3B82F6" strokeWidth="1" />
          {/* Right Tower */}
          <rect x="320" y="25" width="160" height="295" fill="url(#highrise-lum)" stroke="#3B82F6" strokeWidth="1" />
          {/* Skybridge Connecting at floor 16 */}
          <rect x="270" y="140" width="60" height="18" fill="#1D4ED8" opacity="0.9" rx="2" />
          <line x1="270" y1="149" x2="330" y2="149" stroke="#93C5FD" strokeWidth="2" />
          {/* Architectural Window Grid */}
          {Array.from({ length: 11 }).map((_, row) => (
            <g key={row}>
              <rect x="135" y={65 + row * 20} width="60" height="10" fill="#93C5FD" opacity={row % 2 === 0 ? 0.8 : 0.4} />
              <rect x="205" y={65 + row * 20} width="60" height="10" fill="#93C5FD" opacity={row % 3 === 0 ? 0.9 : 0.5} />
              <rect x="335" y={40 + row * 22} width="60" height="12" fill="#60A5FA" opacity={row % 2 === 0 ? 0.9 : 0.4} />
              <rect x="405" y={40 + row * 22} width="60" height="12" fill="#60A5FA" opacity={row % 3 === 0 ? 0.7 : 0.3} />
            </g>
          ))}
          {/* Ground boulevard */}
          <rect x="0" y="295" width="600" height="25" fill="#020617" />
          <line x1="0" y1="307" x2="600" y2="307" stroke="#38BDF8" strokeDasharray="12 8" strokeWidth="2" opacity="0.5" />
        </svg>
      )}

      {styleType === 'podium' && (
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sky-podium" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="70%" stopColor="#475569" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#sky-podium)" />
          {/* Central Residential Block */}
          <rect x="150" y="70" width="300" height="180" rx="4" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
          {/* Symmetrical Wings */}
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i}>
              <rect x="165" y={85 + i * 22} width="120" height="14" fill="#CBD5E1" opacity="0.9" rx="2" />
              <rect x="315" y={85 + i * 22} width="120" height="14" fill="#CBD5E1" opacity="0.9" rx="2" />
            </g>
          ))}
          {/* Elevated Podium Garden */}
          <rect x="90" y="240" width="420" height="55" fill="#064E3B" rx="6" />
          <circle cx="130" cy="235" r="18" fill="#10B981" />
          <circle cx="170" cy="238" r="14" fill="#059669" />
          <circle cx="430" cy="235" r="18" fill="#10B981" />
          <circle cx="470" cy="238" r="14" fill="#059669" />
          {/* Swimming Pool Surface */}
          <rect x="230" y="248" width="140" height="16" fill="#06B6D4" rx="4" />
          <rect x="0" y="295" width="600" height="25" fill="#0F172A" />
        </svg>
      )}

      {styleType === 'skyline' && (
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sky-skyline" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#030712" />
              <stop offset="60%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>
            <linearGradient id="facade-mirror" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#sky-skyline)" />
          {/* Tower 1 */}
          <polygon points="120,300 120,40 220,15 220,300" fill="url(#facade-mirror)" stroke="#818CF8" strokeWidth="1" />
          {/* Tower 2 (Taller) */}
          <polygon points="250,300 250,15 360,35 360,300" fill="url(#facade-mirror)" stroke="#38BDF8" strokeWidth="1" />
          {/* Tower 3 */}
          <polygon points="390,300 390,55 480,30 480,300" fill="url(#facade-mirror)" stroke="#818CF8" strokeWidth="1" />
          {/* Floor grid horizontal stripes */}
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i}>
              <line x1="120" y1={50 + i * 17} x2="220" y2={45 + i * 17} stroke="#E0E7FF" strokeWidth="0.8" opacity="0.6" />
              <line x1="250" y1={30 + i * 18} x2="360" y2={45 + i * 18} stroke="#CFFAFE" strokeWidth="0.8" opacity="0.7" />
              <line x1="390" y1={60 + i * 16} x2="480" y2={50 + i * 16} stroke="#E0E7FF" strokeWidth="0.8" opacity="0.6" />
            </g>
          ))}
          <rect x="0" y="295" width="600" height="25" fill="#030712" />
        </svg>
      )}

      {styleType === 'eco_luxury' && (
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sky-eco" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="70%" stopColor="#065F46" />
              <stop offset="100%" stopColor="#D1FAE5" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#sky-eco)" />
          {/* Heritage Rain Trees in Background */}
          <circle cx="100" cy="180" r="90" fill="#047857" opacity="0.7" />
          <circle cx="500" cy="180" r="100" fill="#047857" opacity="0.7" />
          {/* Low-Rise Boutique Pavilion */}
          <rect x="160" y="90" width="280" height="190" rx="4" fill="#1F2937" stroke="#10B981" strokeWidth="1.5" />
          {/* Wood louvres & vertical greens */}
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i}>
              <rect x="180" y={105 + i * 28} width="240" height="18" fill="#92400E" opacity="0.7" rx="2" />
              {/* Hanging planter gardens */}
              <circle cx="190" cy={125 + i * 28} r="5" fill="#34D399" />
              <circle cx="210" cy={124 + i * 28} r="6" fill="#10B981" />
              <circle cx="390" cy={125 + i * 28} r="6" fill="#34D399" />
              <circle cx="410" cy={124 + i * 28} r="5" fill="#10B981" />
            </g>
          ))}
          <rect x="0" y="280" width="600" height="40" fill="#064E3B" />
        </svg>
      )}

      {styleType === 'minimalist' && (
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sky-min" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#18181B" />
              <stop offset="60%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#52525B" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#sky-min)" />
          {/* Monolithic block */}
          <rect x="170" y="45" width="260" height="250" fill="#09090B" stroke="#A1A1AA" strokeWidth="1" />
          {/* Minimalist recessed balconies */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x="190" y={60 + i * 28} width="105" height="18" fill="#F4F4F5" opacity="0.9" />
              <rect x="315" y={60 + i * 28} width="95" height="18" fill="#F4F4F5" opacity="0.9" />
            </g>
          ))}
          <rect x="0" y="295" width="600" height="25" fill="#09090B" />
        </svg>
      )}

      {/* Floating Blueprint Monospace Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40">
          ARCH-CAD 3D • {location.toUpperCase()}
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/70 text-slate-300 border border-slate-700">
          {stage === 'Ready to Move' ? 'OC RECEIVED' : 'SUPERSTRUCTURE 75%'}
        </span>
      </div>

      <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/80 bg-slate-900/80 px-2 py-0.5 rounded border border-white/20">
        CANONICAL ELEVATION #{projectName.replace(/\s+/g, '').slice(0, 8).toUpperCase()}
      </div>
    </div>
  );
};
