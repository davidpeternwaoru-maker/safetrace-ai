// splash.jsx — Splash screen + Onboarding

const SplashScreen = ({ onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      onClick={onDone}
      style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #16384A 0%, #0B1733 80%, #060d20 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#fff', overflow: 'hidden',
        animation: 'fade-in 0.4s ease-out',
      }}
    >
      {/* Logo + pulse rings */}
      <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Pulse rings */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid #7FB7C2',
          animation: 'pulse-ring 2s ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid #7FB7C2',
          animation: 'pulse-ring 2s ease-out 0.7s infinite',
        }} />
        {/* Logo mark */}
        <div style={{
          width: 120, height: 120,
          background: 'rgba(127,183,194,0.06)',
          border: '1px solid rgba(127,183,194,0.18)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'splash-logo-in 0.8s ease-out',
        }}>
          <STMark size={78} color="#7FB7C2" />
        </div>
      </div>

      {/* Wordmark */}
      <div style={{
        marginTop: 32, fontFamily: T.display, fontSize: 40, fontWeight: 500,
        letterSpacing: '-0.035em', color: '#fff',
        opacity: 0, animation: 'fade-in 0.6s ease-out 0.9s forwards',
      }}>
        Safe<span style={{ color: '#7FB7C2', fontStyle: 'italic', fontWeight: 400 }}>Trace</span>
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 14, fontFamily: T.text, fontSize: 14, color: '#8ABBC7',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        opacity: 0, animation: 'fade-in 0.6s ease-out 1.5s forwards',
      }}>
        Clarity · Support · Protection
      </div>

      {/* Bottom encrypted badge */}
      <div style={{
        position: 'absolute', bottom: 56, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        opacity: 0, animation: 'fade-in 0.6s ease-out 2s forwards',
      }}>
        <div style={{
          fontFamily: T.mono, fontSize: 10, letterSpacing: '0.22em',
          color: 'rgba(127,183,194,0.6)', textTransform: 'uppercase',
        }}>Powered by AI</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: T.mono, fontSize: 10, letterSpacing: '0.2em',
          color: 'rgba(127,183,194,0.45)', textTransform: 'uppercase',
        }}>
          <ILock size={11} />
          End-to-End Encrypted
        </div>
      </div>
    </div>
  );
};

// ───── Onboarding ─────
const OnboardingScreen = ({ onDone }) => {
  const [slide, setSlide] = React.useState(0);
  const slides = [
    {
      title: 'Your Voice Matters',
      body: 'Simply speak about what happened. Our AI organises your experience into clear, structured documentation.',
      accent: C.tidewater,
      tint: 'rgba(43,122,140,0.10)',
      icon: (
        <svg viewBox="0 0 120 120" width="100" height="100" fill="none">
          <path d="M 22 28 Q 22 18 32 18 H 78 Q 88 18 88 28 V 64 Q 88 74 78 74 H 56 L 42 86 V 74 H 32 Q 22 74 22 64 Z"
            fill="rgba(43,122,140,0.16)" stroke={C.tidewater} strokeWidth="3" strokeLinejoin="round"/>
          <path d="M 55 30 L 70 30 L 75 38 L 75 56 L 70 64 L 55 64 L 50 56 L 50 38 Z"
            fill={C.tidewater} opacity="0.85"/>
          <circle cx="62.5" cy="47" r="3.5" fill="#fff"/>
          <path d="M 38 44 L 44 44 M 38 50 L 48 50" stroke={C.tidewater} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: 'Never Alone',
      body: 'Instant connection to therapists, counsellors, and trusted contacts when you need support most.',
      accent: C.lavenderDeep,
      tint: 'rgba(183,168,220,0.18)',
      icon: (
        <svg viewBox="0 0 120 120" width="100" height="100" fill="none">
          <circle cx="42" cy="42" r="14" fill={C.lavender} opacity="0.7"/>
          <circle cx="78" cy="42" r="14" fill={C.lavender} opacity="0.7"/>
          <circle cx="60" cy="78" r="16" fill={C.lavenderDeep}/>
          <path d="M 28 90 Q 28 70 42 70 H 78 Q 92 70 92 90"
            stroke={C.lavenderDeep} strokeWidth="3" fill="rgba(183,168,220,0.4)" strokeLinejoin="round"/>
          <path d="M 60 74 L 64 78 L 68 72 L 65 80 L 60 84 L 55 80 L 52 72 L 56 78 Z"
            fill="#fff"/>
          <path d="M 56 64 C 54 60, 50 60, 50 64 C 50 68, 56 72, 56 72 C 56 72, 62 68, 62 64 C 62 60, 58 60, 56 64 Z"
            fill={C.coral} transform="translate(4 -2)"/>
        </svg>
      ),
    },
    {
      title: 'Safety In Your Hands',
      body: 'One tap to alert your safety network. Real-time protection powered by people who care.',
      accent: C.sageDeep,
      tint: 'rgba(148,183,158,0.18)',
      icon: (
        <svg viewBox="0 0 120 120" width="100" height="100" fill="none">
          <path d="M 30 78 Q 30 70 38 70 L 50 70 L 50 50 Q 50 44 56 44 Q 62 44 62 50 L 62 70 L 78 70 Q 86 70 90 78 L 90 96 L 30 96 Z"
            fill="rgba(148,183,158,0.4)" stroke={C.sageDeep} strokeWidth="3" strokeLinejoin="round"/>
          <path d="M 60 12 L 76 20 L 76 36 Q 76 50 60 58 Q 44 50 44 36 L 44 20 Z"
            fill={C.sage} stroke={C.sageDeep} strokeWidth="3" strokeLinejoin="round"/>
          <path d="M 52 32 L 58 38 L 68 26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="34" r="32" stroke={C.sageDeep} strokeWidth="2" strokeDasharray="2 4" opacity="0.4"/>
        </svg>
      ),
    },
  ];

  const cur = slides[slide];
  const next = () => slide < 2 ? setSlide(slide + 1) : onDone();

  return (
    <div style={{
      position: 'absolute', inset: 0, background: C.paper,
      display: 'flex', flexDirection: 'column',
      animation: 'fade-in 0.3s ease-out',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '60px 24px 12px',
      }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.2em', color: C.slate, textTransform: 'uppercase' }}>
          {String(slide + 1).padStart(2, '0')} / 03
        </div>
        <button onClick={onDone} style={{ fontFamily: T.text, fontSize: 14, fontWeight: 500, color: C.slate }}>Skip</button>
      </div>

      {/* Content */}
      <div key={slide} style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center',
        animation: 'fade-in 0.35s ease-out',
      }}>
        <div style={{
          width: 196, height: 196, borderRadius: '50%',
          background: cur.tint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 44,
        }}>{cur.icon}</div>

        <h1 style={{
          fontFamily: T.display, fontSize: 32, fontWeight: 500,
          letterSpacing: '-0.025em', color: C.midnight,
          lineHeight: 1.05, marginBottom: 16,
        }}>{cur.title}</h1>

        <p style={{
          fontFamily: T.text, fontSize: 15, lineHeight: 1.55,
          color: C.graphite, maxWidth: 300, textWrap: 'pretty',
        }}>{cur.body}</p>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{
            width: i === slide ? 24 : 8, height: 8, borderRadius: 999,
            background: i === slide ? cur.accent : C.fog,
            transition: 'all 0.25s ease',
          }} />
        ))}
      </div>

      {/* Next button */}
      <div style={{ padding: '0 24px 44px' }}>
        <Button
          variant={slide === 2 ? 'sage' : 'primary'}
          onClick={next}
          color={slide < 2 ? cur.accent : undefined}
        >
          {slide === 2 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

Object.assign(window, { SplashScreen, OnboardingScreen });
