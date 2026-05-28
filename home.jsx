// home.jsx — Home Dashboard

const HomeScreen = ({ onTab, onOpenReports, onDismissTip, showTip, toast, notifications = 2, nearbyAlert, onRespondToAlert }) => {
  const [pullY, setPullY] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const pullStart = React.useRef(null);
  const scrollRef = React.useRef(null);

  const onTouchStart = (e) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      pullStart.current = e.touches[0].clientY;
    }
  };
  const onTouchMove = (e) => {
    if (pullStart.current == null) return;
    const dy = e.touches[0].clientY - pullStart.current;
    if (dy > 0) setPullY(Math.min(80, dy * 0.55));
  };
  const onTouchEnd = () => {
    if (pullStart.current != null && pullY > 50) {
      setRefreshing(true);
      setPullY(50);
      setTimeout(() => {
        setRefreshing(false);
        setPullY(0);
        toast('Refreshed', 'success');
      }, 1200);
    } else {
      setPullY(0);
    }
    pullStart.current = null;
  };

  return (
    <div
      ref={scrollRef}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      className="phone-scroll"
      style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(120% 50% at 50% 0%, rgba(127,183,194,0.12) 0%, transparent 50%), ${C.paper}`,
        paddingTop: 56, paddingBottom: 110,
        overflowY: 'auto',
        animation: 'fade-in 0.25s ease-out',
      }}>
      {/* Pull-to-refresh indicator */}
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0,
        height: pullY, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: pullY / 50,
        transition: pullStart.current == null ? 'all 0.3s ease' : undefined,
        pointerEvents: 'none', zIndex: 1,
      }}>
        <div style={{
          animation: refreshing ? 'spin-slow 0.8s linear infinite' : undefined,
        }}>
          <STMark size={28} color={C.tidewater} />
        </div>
      </div>

      <div style={{
        transform: `translateY(${pullY}px)`,
        transition: pullStart.current == null ? 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
      }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 20px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <STMark size={30} gradient />
          <div style={{
            fontFamily: T.display, fontSize: 22, fontWeight: 500,
            letterSpacing: '-0.025em', color: C.midnight,
          }}>Safe<span style={{ color: C.tidewater, fontStyle: 'italic', fontWeight: 400 }}>Trace</span></div>
        </div>
        <button onClick={() => toast('No new alerts — your network is steady.', 'info')} style={{
          width: 40, height: 40, borderRadius: 999, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <IBell size={18} color={C.graphite} />
          {notifications > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 18, height: 18, borderRadius: 999,
              background: C.coral, color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff',
            }}>{notifications}</span>
          )}
        </button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '4px 20px 18px' }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.2em', color: C.tidewater, textTransform: 'uppercase', marginBottom: 6 }}>
          Tuesday · May 26
        </div>
        <div style={{ fontFamily: T.display, fontSize: 26, fontWeight: 500, letterSpacing: '-0.025em', color: C.midnight, lineHeight: 1.1 }}>
          Good afternoon.<br/>
          <span style={{ color: C.slate, fontStyle: 'italic', fontWeight: 400 }}>You are safe here.</span>
        </div>
      </div>

      {/* Safety status card */}
      <div style={{ padding: '0 20px' }}>
        <Card
          leftBorder={C.sageDeep}
          tint="linear-gradient(135deg, rgba(148,183,158,0.16) 0%, rgba(251,247,238,1) 80%)"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 10, height: 10, borderRadius: 999,
              background: C.sageDeep,
              animation: 'pulse-dot 1.6s ease-in-out infinite',
            }} />
            <div style={{ fontFamily: T.text, fontSize: 15, fontWeight: 600, color: C.midnight }}>
              Safety Status · <span style={{ color: C.sageDeep }}>Active</span>
            </div>
          </div>
          <div style={{ fontFamily: T.text, fontSize: 13, color: C.graphite, marginTop: 6, lineHeight: 1.45 }}>
            SafePulse Ready · 3 Trusted Contacts · Encrypted
          </div>
        </Card>
      </div>

      {/* Nearby alert card (only if active) */}
      {nearbyAlert && (
        <div style={{ padding: '10px 20px 0' }}>
          <Card
            leftBorder={C.coral}
            tint={`linear-gradient(135deg, ${C.coral}1F 0%, ${C.paper2} 80%)`}
            style={{ padding: 14, animation: 'fade-in-down 0.4s ease-out' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <IAlertTriangle size={16} color={C.coralDeep} />
              <div style={{ fontFamily: T.text, fontSize: 14.5, fontWeight: 700, color: C.coralDeep }}>Nearby Alert Active</div>
            </div>
            <div style={{ fontFamily: T.text, fontSize: 13, color: C.graphite, lineHeight: 1.45 }}>
              Someone within 1km triggered SafePulse {nearbyAlert.minutesAgo} min ago.
            </div>
            <div style={{ fontFamily: T.text, fontSize: 12, color: C.sageDeep, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: 999, background: C.sageDeep, animation: 'pulse-dot 1.4s infinite' }} />
              {nearbyAlert.responders} responders heading to help
            </div>
            <button onClick={onRespondToAlert} className="tap-scale" style={{
              marginTop: 10, width: '100%', padding: '9px',
              background: C.coral, color: '#fff',
              fontFamily: T.text, fontSize: 13, fontWeight: 700,
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <IShield size={14} /> Respond
            </button>
          </Card>
        </div>
      )}

      {/* Quick actions */}
      <SectionHeader title="Quick actions" />
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        padding: '0 20px',
      }}>
        <div className="stagger-item"><QuickAction icon={IMic} label="New Report" caption="Speak or type" color={C.tidewater} onClick={() => onTab('document')} /></div>
        <div className="stagger-item"><QuickAction icon={IRadio} label="Emergency SOS" caption="Alert network" color={C.coral} onClick={() => onTab('safepulse')} /></div>
        <div className="stagger-item"><QuickAction icon={IPhone} label="Talk to Someone" caption="SafeConnect" color={C.lavenderDeep} onClick={() => onTab('wellness')} /></div>
        <div className="stagger-item"><QuickAction icon={IFileText} label="My Reports" caption="2 documents" color={C.twilight} onClick={onOpenReports} /></div>
      </div>

      {/* Recent Activity */}
      <SectionHeader title="Recent activity" action="See All" onAction={onOpenReports} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }}>
        <div className="stagger-item">
        <ActivityRow
          color={C.tidewater}
          icon={IFileText}
          title="Incident Report · Draft"
          subtitle="Last edited 2 hours ago"
          onClick={() => onTab('document')}
        />
        </div>
        <div className="stagger-item">
        <ActivityRow
          color={C.lavenderDeep}
          icon={IHeart}
          title="Wellness Check-in"
          subtitle="Completed yesterday · Feeling: Okay"
          onClick={() => onTab('wellness')}
        />
        </div>
        <div className="stagger-item">
        <ActivityRow
          color={C.sageDeep}
          icon={IShield}
          title="SafePulse Test"
          subtitle="System verified · 3 days ago"
          onClick={() => onTab('safepulse')}
        />
        </div>
      </div>

      {/* Tip card */}
      {showTip && (
        <div style={{ padding: '24px 20px 8px' }}>
          <div style={{
            background: 'rgba(183,168,220,0.18)',
            borderLeft: `4px solid ${C.lavenderDeep}`,
            borderRadius: 16,
            padding: '14px 16px',
            position: 'relative',
            paddingRight: 36,
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ fontFamily: T.text, fontSize: 13, lineHeight: 1.5, color: C.graphite, textWrap: 'pretty' }}>
                <strong style={{ color: C.lavenderDeep }}>Tip · </strong>
                Hold the SOS button for 3 seconds to activate SafePulse. Your location and timestamp are recorded automatically.
              </div>
            </div>
            <button onClick={onDismissTip} style={{
              position: 'absolute', top: 10, right: 10,
              width: 24, height: 24, borderRadius: 999,
              background: 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.lavenderDeep,
            }}><IX size={13} /></button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

const QuickAction = ({ icon: I, label, caption, color, onClick }) => (
  <button onClick={onClick} className="tap-scale" style={{
    background: '#fff', borderRadius: 16,
    padding: '18px 16px',
    boxShadow: '0 1px 0 rgba(11,23,51,0.04), 0 2px 12px rgba(11,23,51,0.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    gap: 10, textAlign: 'left',
    transition: 'transform 0.12s ease',
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 999,
      background: `${color}1F`,
      color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}><I size={20} /></div>
    <div>
      <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight, letterSpacing: '-0.005em' }}>{label}</div>
      <div style={{ fontFamily: T.text, fontSize: 11.5, color: C.slate, marginTop: 2 }}>{caption}</div>
    </div>
  </button>
);

const ActivityRow = ({ color, icon: I, title, subtitle, onClick }) => (
  <Card leftBorder={color} onClick={onClick} style={{ padding: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: `${color}18`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}><I size={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.text, fontSize: 14.5, fontWeight: 600, color: C.midnight }}>{title}</div>
        <div style={{ fontFamily: T.text, fontSize: 12.5, color: C.slate, marginTop: 2 }}>{subtitle}</div>
      </div>
      <IChevronRight size={18} color={C.fog} />
    </div>
  </Card>
);

Object.assign(window, { HomeScreen });
