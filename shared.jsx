// shared.jsx — Shared UI components: TabBar, Toast, Modal, theme colors

// ───── Brand colors (from brand-tokens.css) ─────
const C = {
  midnight: '#0B1733',
  twilight: '#16384A',
  tidewater: '#2B7A8C',
  aurora: '#7FB7C2',
  lavender: '#B7A8DC',
  lavenderDeep: '#6E5FA1',
  sage: '#94B79E',
  sageDeep: '#4F7659',
  coral: '#E08A7A',
  coralDeep: '#B85A4A',
  amber: '#D4A24A',
  ink: '#0A1428',
  graphite: '#2E3849',
  slate: '#5B6577',
  fog: '#B8BFCB',
  mist: '#E3E2DC',
  paper: '#F5EFE4',
  paper2: '#FBF7EE',
  cream: '#EFE7D5',
  border: '#E5DDC8',
  borderSoft: '#EDE5D2',
};

// ───── Typography ─────
const T = {
  display: '"Bricolage Grotesque", "Söhne", system-ui, sans-serif',
  text: '"Geist", "Inter Tight", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

// ───── Card ─────
const Card = ({ children, style = {}, leftBorder, tint, onClick }) => (
  <div
    onClick={onClick}
    className={onClick ? 'tap-scale' : ''}
    style={{
      background: tint || '#FFFFFF',
      borderRadius: 16,
      boxShadow: '0 1px 0 rgba(11,23,51,0.04), 0 2px 16px rgba(11,23,51,0.08)',
      padding: 16,
      borderLeft: leftBorder ? `4px solid ${leftBorder}` : undefined,
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    }}
  >{children}</div>
);

// ───── Button ─────
const Button = ({ children, variant = 'primary', onClick, icon: IconComp, disabled, style = {}, fullWidth = true, color }) => {
  const variants = {
    primary: {
      bg: color ? color : `linear-gradient(135deg, ${C.tidewater} 0%, ${C.twilight} 100%)`,
      fg: '#fff', border: 'transparent',
      shadow: `0 4px 14px ${C.tidewater}55`,
    },
    sage: {
      bg: `linear-gradient(135deg, ${C.sageDeep} 0%, #3d5e47 100%)`,
      fg: '#fff', border: 'transparent',
      shadow: `0 4px 14px ${C.sageDeep}55`,
    },
    coral: {
      bg: `linear-gradient(135deg, ${C.coral} 0%, ${C.coralDeep} 100%)`,
      fg: '#fff', border: 'transparent',
      shadow: `0 4px 14px ${C.coral}66`,
    },
    lavender: {
      bg: `linear-gradient(135deg, ${C.lavenderDeep} 0%, #574a82 100%)`,
      fg: '#fff', border: 'transparent',
      shadow: `0 4px 14px ${C.lavenderDeep}55`,
    },
    deep: {
      bg: `linear-gradient(135deg, ${C.twilight} 0%, ${C.midnight} 100%)`,
      fg: '#fff', border: 'transparent',
      shadow: `0 4px 14px ${C.twilight}66`,
    },
    secondary:{ bg: '#fff', fg: C.tidewater, border: C.tidewater, shadow: '0 1px 4px rgba(11,23,51,0.06)' },
    outline: { bg: 'transparent', fg: C.tidewater, border: C.tidewater, shadow: 'none' },
    text:    { bg: 'transparent', fg: C.tidewater, border: 'transparent', shadow: 'none' },
    danger:  { bg: 'transparent', fg: C.coralDeep, border: 'transparent', shadow: 'none' },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tap-scale"
      style={{
        width: fullWidth ? '100%' : 'auto',
        background: disabled ? '#D5D0C2' : v.bg,
        color: disabled ? '#8a8676' : v.fg,
        border: `1.5px solid ${disabled ? '#D5D0C2' : v.border}`,
        borderRadius: 12,
        padding: '14px 22px',
        fontFamily: T.text,
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : v.shadow,
        transition: 'background 0.2s ease, transform 0.12s ease, box-shadow 0.2s ease',
        ...style,
      }}
    >
      {IconComp && <IconComp size={18} />}
      {children}
    </button>
  );
};

// ───── Pill / Badge ─────
const Pill = ({ children, color = C.tidewater, bg, style = {} }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: bg || `${color}1F`,
    color: color,
    fontFamily: T.text, fontSize: 11, fontWeight: 600,
    padding: '4px 10px', borderRadius: 999,
    letterSpacing: '0.02em', textTransform: 'uppercase',
    ...style,
  }}>{children}</span>
);

// ───── Tab bar ─────
const TabBar = ({ active, onTab, onSOS, alertBadge }) => {
  const allTabs = [
    { id: 'home',      label: 'Home',      icon: IHome },
    { id: 'document',  label: 'Docs',      icon: IMic },
    { id: 'safepulse', label: 'SOS',       icon: IRadio, center: true },
    { id: 'wellness',  label: 'Wellness',  icon: IHeart },
    { id: 'community', label: 'Community', icon: IUsers },
    { id: 'profile',   label: 'Profile',   icon: IUser },
  ];
  
  const renderTab = (t, isActive) => {
    const I = t.icon;
    
    if (t.center) {
      return (
        <button
          key={t.id}
          onClick={onSOS}
          className="tap-scale tab-sos"
          style={{
            flex: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, padding: 0, position: 'relative',
            minWidth: 0, marginTop: -20,
            width: 54, height: 54, borderRadius: 999,
            background: `radial-gradient(circle at 30% 25%, #f0a392 0%, ${C.coral} 65%, ${C.coralDeep} 100%)`,
            color: '#fff',
            boxShadow: `0 6px 20px ${C.coral}88, 0 0 0 4px rgba(255,255,255,1), 0 0 24px ${C.coral}55`,
            border: 'none', cursor: 'pointer',
            zIndex: 50,
          }}
        >
          <I size={22} strokeWidth={2.4} />
          {alertBadge && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              minWidth: 20, height: 20, borderRadius: 999,
              background: '#fff', color: C.coralDeep,
              fontFamily: T.text, fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${C.coral}`,
              padding: '0 5px',
              animation: 'pulse-dot 1.6s ease-in-out infinite',
            }}>{alertBadge}</span>
          )}
        </button>
      );
    }
    
    return (
      <button
        key={t.id} onClick={() => onTab(t.id)}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 3, padding: '6px 8px', flex: 1, position: 'relative',
          color: isActive ? C.tidewater : C.slate,
          transition: 'color 0.2s ease',
          minWidth: 0, background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: T.text,
        }}
      >
        {isActive && (
          <div style={{
            position: 'absolute', top: 2, left: '50%',
            transform: 'translateX(-50%)',
            width: 28, height: 28, borderRadius: '50%',
            background: `radial-gradient(circle, ${C.tidewater}33 0%, transparent 70%)`,
            pointerEvents: 'none',
            animation: 'fade-in 0.25s ease',
          }} />
        )}
        <I size={20} strokeWidth={isActive ? 2.4 : 2} style={{ position: 'relative', zIndex: 1 }} />
        <span style={{
          fontSize: 9, fontWeight: isActive ? 600 : 500,
          letterSpacing: '0.01em', position: 'relative', zIndex: 1,
          whiteSpace: 'nowrap',
        }}>{t.label}</span>
      </button>
    );
  };

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, paddingTop: 8,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderTop: `1px solid ${C.borderSoft}`,
      boxShadow: '0 -2px 12px rgba(11,23,51,0.04)',
      zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', position: 'relative', height: 64 }}>
        {allTabs.map(t => renderTab(t, active === t.id))}
      </div>
    </div>
  );
};

// ───── Header ─────
const Header = ({ title, right, left, subtitle, style = {} }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 20px 14px', ...style,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {left}
      <div>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, color: C.midnight, letterSpacing: '-0.02em' }}>{title}</div>
        {subtitle && <div style={{ fontFamily: T.text, fontSize: 12, color: C.slate, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
    {right}
  </div>
);

// ───── Toast ─────
const Toast = ({ message, kind = 'success', onClose }) => {
  React.useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  const bg = kind === 'success' ? C.sageDeep : kind === 'error' ? C.coralDeep : C.twilight;
  return (
    <div style={{
      position: 'absolute', top: 56, left: 20, right: 20, zIndex: 100,
      background: bg, color: '#fff',
      borderRadius: 14, padding: '12px 16px',
      fontSize: 14, fontFamily: T.text, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      animation: 'fade-in-down 0.25s ease-out',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {kind === 'success' && <ICheckCircle size={18} />}
      {kind === 'error' && <IAlertTriangle size={18} />}
      <div style={{ flex: 1 }}>{message}</div>
    </div>
  );
};

// ───── Modal ─────
const Modal = ({ open, onClose, children, danger }) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 90,
        background: 'rgba(11,20,40,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'backdrop-in 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 18,
          width: '100%', maxWidth: 320,
          padding: 22,
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          animation: 'modal-in 0.22s ease-out',
          borderTop: danger ? `4px solid ${C.coral}` : undefined,
        }}
      >{children}</div>
    </div>
  );
};

// ───── Section header ─────
const SectionHeader = ({ title, action, onAction }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    margin: '24px 20px 12px',
  }}>
    <div style={{ fontFamily: T.display, fontSize: 17, fontWeight: 600, color: C.midnight, letterSpacing: '-0.01em' }}>{title}</div>
    {action && (
      <button onClick={onAction} style={{ fontFamily: T.text, fontSize: 13, fontWeight: 600, color: C.tidewater }}>{action}</button>
    )}
  </div>
);

Object.assign(window, { C, T, Card, Button, Pill, TabBar, Header, Toast, Modal, SectionHeader });
