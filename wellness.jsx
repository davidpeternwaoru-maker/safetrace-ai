// wellness.jsx — Scroll layout: Mood, AI Chat (card → overlay), Professionals, Mentors

const moods = [
  { id: 'great', emoji: '😊', label: 'Great', color: C.sageDeep, bg: 'rgba(148,183,158,0.25)', msg: "That's wonderful. Keep this close — we've recorded it for you." },
  { id: 'good',  emoji: '🙂', label: 'Good',  color: C.tidewater, bg: 'rgba(127,183,194,0.25)', msg: "Glad to hear it. We're here if anything shifts." },
  { id: 'okay',  emoji: '😐', label: 'Okay',  color: C.amber, bg: 'rgba(212,162,74,0.22)', msg: "Some days are just like that. We'll check in tomorrow." },
  { id: 'low',   emoji: '😔', label: 'Low',   color: C.lavenderDeep, bg: 'rgba(183,168,220,0.32)', msg: "Thank you for telling us. Would it help to talk to SafeConnect?" },
  { id: 'crisis',emoji: '😢', label: 'Crisis',color: C.coralDeep, bg: 'rgba(224,138,122,0.28)', msg: '' },
];

const therapists = [
  { name: 'Dr. Amara Okafor', spec: 'Trauma-Informed Therapy', sub: 'PTSD · anxiety · crisis recovery', rating: '4.9', tone: 'lavender', available: true },
  { name: 'Dr. Michael Chen', spec: 'Cognitive Behavioural Therapy', sub: 'Harassment recovery · workplace trauma', rating: '4.8', tone: 'tidewater', available: false },
  { name: 'Dr. Reni Adesanya', spec: 'Group Trauma Therapy', sub: 'Survivor circles · institutional response', rating: '4.9', tone: 'lavender', available: true },
];

const weekHistory = [
  { d: 'May 15', m: 'okay' },  { d: 'May 16', m: 'low' },   { d: 'May 17', m: 'low' },
  { d: 'May 18', m: 'okay' },  { d: 'May 19', m: 'good' },  { d: 'May 20', m: 'good' },
  { d: 'May 21', m: 'okay' },  { d: 'May 22', m: 'low' },   { d: 'May 23', m: null },
  { d: 'May 24', m: 'okay' },  { d: 'May 25', m: 'good' },  { d: 'May 26', m: 'good' },
  { d: 'May 27', m: 'great' }, { d: 'May 28', m: null },
];

const STARTERS = [
  "I need to talk about what happened",
  "I'm feeling overwhelmed today",
  "Help me process my emotions",
];

const WellnessScreen = ({ toast, chatRef }) => {
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <>
      <div className="phone-scroll" style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(120% 40% at 50% 0%, rgba(183,168,220,0.12) 0%, transparent 50%), ${C.paper}`,
        paddingTop: 56, paddingBottom: 110,
        overflowY: 'auto',
        animation: 'fade-in 0.25s ease-out',
      }}>
        {/* Sticky header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 5,
          padding: '12px 20px 10px',
          background: 'linear-gradient(180deg, rgba(245,239,228,1) 0%, rgba(245,239,228,0.92) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 11,
              background: `linear-gradient(135deg, ${C.lavenderDeep}, ${C.lavender})`,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${C.lavenderDeep}44`,
            }}><IHeart size={16} strokeWidth={2.2} /></div>
            <div>
              <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 500, letterSpacing: '-0.025em', color: C.midnight, lineHeight: 1 }}>Your Wellness</div>
              <div style={{ fontFamily: T.text, fontSize: 11, color: C.slate, marginTop: 2 }}>You're doing more than you think.</div>
            </div>
          </div>
        </div>

        {/* Section A — Mood Check-in */}
        <div className="stagger-item" style={{ padding: '18px 20px 0' }}>
          <MoodCheckInCard toast={toast} />
        </div>

        {/* Section B — AI Chat card */}
        <div className="stagger-item" style={{ padding: '14px 20px 0' }}>
          <AIChatCard onOpen={() => setChatOpen(true)} />
        </div>

        {/* Section C — Professionals */}
        <SectionHeader title="Connect with a Professional" />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="stagger-item"><CrisisHelplineCard onCall={() => toast('Calling 988…', 'info')} /></div>
          {therapists.map((t, i) => (
            <div key={i} className="stagger-item">
              <TherapistCard {...t} onBook={() => toast(`Booking with ${t.name}`, 'success')} />
            </div>
          ))}
        </div>

        {/* Section D — Peer Mentors */}
        <SectionHeader title="Peer Mentors" />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { name: 'Mentor_Hope', tenure: '2 years supporting others', speciality: 'Campus reporting process', color: C.sageDeep, icon: 'sun', rating: '4.9' },
            { name: 'Mentor_Strength', tenure: '1 year supporting others', speciality: 'Workplace harassment recovery', color: C.lavenderDeep, icon: 'wave', rating: '4.8' },
            { name: 'Mentor_Steady', tenure: '3 years supporting others', speciality: 'Court & legal navigation', color: C.tidewater, icon: 'moon', rating: '5.0' },
          ].map((m, i) => (
            <div key={i} className="stagger-item">
              <MentorCard {...m} onConnect={() => toast(`Connection request sent to ${m.name}`, 'success')} />
            </div>
          ))}
          <button
            onClick={() => toast('Mentor application opened', 'info')}
            style={{
              marginTop: 4, padding: '12px',
              color: C.tidewater, fontFamily: T.text, fontSize: 13.5, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >Become a Mentor →</button>
        </div>
      </div>

      {/* Full-screen chat overlay */}
      {chatOpen && (
        <ChatOverlay
          onClose={() => setChatOpen(false)}
          chatRef={chatRef}
          toast={toast}
        />
      )}
    </>
  );
};

// ─── Section A: Mood check-in ───
const MoodCheckInCard = ({ toast }) => {
  const [selected, setSelected] = React.useState(null);
  const [crisisOpen, setCrisisOpen] = React.useState(false);

  const pickMood = (m) => {
    setSelected(m);
    if (m.id === 'crisis') setCrisisOpen(true);
    else toast(`Check-in recorded · ${m.label}`, 'success');
  };

  return (
    <>
      <Card style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: T.text, fontSize: 16, fontWeight: 600, color: C.midnight, letterSpacing: '-0.005em' }}>
            How are you feeling?
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: C.slate, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Today</div>
        </div>

        {/* 5 mood buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          {moods.map(m => {
            const sel = selected?.id === m.id;
            const dim = selected && !sel;
            return (
              <button
                key={m.id} onClick={() => pickMood(m)}
                className={`mood-btn ${sel ? 'selected' : ''}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  flex: 1, padding: 4,
                  opacity: dim ? 0.4 : 1,
                  transition: 'opacity 0.3s ease',
                }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: m.bg,
                  border: sel ? `2.5px solid ${m.color}` : `2px solid transparent`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, position: 'relative',
                  boxShadow: sel ? `0 0 24px ${m.color}55, 0 4px 16px rgba(11,23,51,0.10)` : undefined,
                  transition: 'box-shadow 0.3s ease',
                }}>
                  {m.emoji}
                  {sel && (
                    <div style={{
                      position: 'absolute', bottom: -3, right: -3,
                      width: 20, height: 20, borderRadius: 999,
                      background: m.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2.5px solid #fff',
                      animation: 'msg-in 0.3s ease-out',
                      boxShadow: `0 2px 6px ${m.color}66`,
                    }}><ICheck size={11} strokeWidth={3.5} /></div>
                  )}
                </div>
                <div style={{ fontFamily: T.text, fontSize: 10.5, fontWeight: sel ? 700 : 500, color: sel ? m.color : C.slate }}>{m.label}</div>
              </button>
            );
          })}
        </div>

        {/* Confirmation message */}
        {selected && selected.id !== 'crisis' && (
          <div style={{
            padding: '12px 14px', marginTop: 14,
            background: selected.bg, borderRadius: 12,
            fontFamily: T.text, fontSize: 13.5, color: selected.color,
            lineHeight: 1.5, fontWeight: 500, textWrap: 'pretty',
            animation: 'msg-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            borderLeft: `3px solid ${selected.color}`,
          }}>{selected.msg}</div>
        )}

        {/* 14-day chart */}
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px dashed ${C.border}` }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <div style={{ fontFamily: T.text, fontSize: 12, fontWeight: 600, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Past 14 days</div>
            <div style={{ fontFamily: T.text, fontSize: 11, color: C.sageDeep, fontWeight: 600 }}>↗ trending up</div>
          </div>
          <MoodHistoryChart history={weekHistory} moods={moods} />
        </div>
      </Card>

      {crisisOpen && <CrisisModal onClose={() => setCrisisOpen(false)} toast={toast} />}
    </>
  );
};

// ─── Section B: AI Chat card ───
const AIChatCard = ({ onOpen }) => (
  <Card style={{
    padding: 18,
    background: `linear-gradient(135deg, rgba(183,168,220,0.20) 0%, #fff 70%)`,
    borderLeft: `4px solid ${C.lavenderDeep}`,
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: -20, right: -20,
      width: 90, height: 90, borderRadius: '50%',
      background: `radial-gradient(circle, ${C.lavender}33 0%, transparent 70%)`,
    }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11,
        background: `linear-gradient(135deg, ${C.lavenderDeep}, ${C.lavender})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        boxShadow: `0 4px 12px ${C.lavenderDeep}55`,
      }}><IMessageCircle size={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.text, fontSize: 15, fontWeight: 600, color: C.midnight, letterSpacing: '-0.005em' }}>Talk to SafeConnect AI</div>
        <div style={{ fontFamily: T.text, fontSize: 12, color: C.slate, marginTop: 1 }}>Supportive guide, not a therapist</div>
      </div>
    </div>
    <div style={{
      fontFamily: T.text, fontSize: 13.5, color: C.graphite,
      lineHeight: 1.5, marginBottom: 14, textWrap: 'pretty', position: 'relative',
    }}>
      A warm, steady voice that listens. Available whenever — no appointment, no judgement.
    </div>
    <Button variant="lavender" icon={IMessageCircle} onClick={onOpen}>Open Chat</Button>
  </Card>
);

// ─── Section C: Crisis helpline + therapists ───
const CrisisHelplineCard = ({ onCall }) => (
  <Card style={{
    padding: 16,
    background: `linear-gradient(135deg, ${C.coral} 0%, ${C.coralDeep} 100%)`,
    color: '#fff', borderLeft: 'none', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: -30, right: -30,
      width: 100, height: 100, borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
    }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(20px)',
      }}><IPhone size={20} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.text, fontSize: 15, fontWeight: 700 }}>Crisis Support Line</div>
        <div style={{ fontFamily: T.text, fontSize: 12, opacity: 0.9, marginTop: 1 }}>Immediate · 24/7 · free</div>
      </div>
    </div>
    <button onClick={onCall} className="tap-scale" style={{
      width: '100%', padding: '11px',
      background: '#fff', color: C.coralDeep,
      borderRadius: 12,
      fontFamily: T.text, fontSize: 14, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    }}><IPhone size={15} /> Call Now</button>
  </Card>
);

const TherapistCard = ({ name, spec, sub, rating, tone, available, onBook }) => {
  const accent = tone === 'lavender' ? C.lavenderDeep : C.tidewater;
  return (
    <Card style={{ padding: 16, position: 'relative' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: T.display, fontSize: 17, fontWeight: 500,
            boxShadow: `0 4px 12px ${accent}44`,
          }}>{name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}</div>
          {available && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 15, height: 15, borderRadius: 999,
              background: C.sageDeep, border: '2.5px solid #fff',
              boxShadow: `0 0 8px ${C.sage}`,
            }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight, flex: 1, textWrap: 'pretty' }}>{name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: T.mono, fontSize: 11, color: C.amber, fontWeight: 600 }}>
              <IStar size={11} style={{ fill: C.amber, color: C.amber }}/> {rating}
            </div>
          </div>
          <div style={{ fontFamily: T.text, fontSize: 12, color: accent, fontWeight: 600, marginTop: 2 }}>{spec}</div>
          <div style={{ fontFamily: T.text, fontSize: 11.5, color: C.slate, marginTop: 2, lineHeight: 1.45 }}>{sub}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 999, background: available ? C.sageDeep : C.fog }} />
            <div style={{ fontFamily: T.text, fontSize: 11, color: available ? C.sageDeep : C.slate, fontWeight: 500 }}>
              {available ? 'Available now' : 'Next slot Mon 2pm'}
            </div>
          </div>
        </div>
      </div>
      <button onClick={onBook} className="tap-scale" style={{
        marginTop: 12, width: '100%', padding: '9px 12px', borderRadius: 11,
        background: `linear-gradient(135deg, ${accent}1F, ${accent}10)`,
        color: accent, border: `1px solid ${accent}22`,
        fontFamily: T.text, fontSize: 13, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <ICalendar size={13} /> Book Session
      </button>
    </Card>
  );
};

// ─── Section D: Peer mentor ───
const MentorCard = ({ name, tenure, speciality, color, icon, rating, onConnect }) => (
  <Card style={{ padding: 14 }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <AnonAvatar color={color} icon={icon} size={44} gradient />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: C.midnight, flex: 1 }}>{name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: T.mono, fontSize: 11, color: C.amber }}>
            <IStar size={10} style={{ fill: C.amber, color: C.amber }}/> {rating}
          </div>
        </div>
        <div style={{ fontFamily: T.text, fontSize: 11.5, color: C.slate, marginTop: 1 }}>{tenure}</div>
        <div style={{ fontFamily: T.text, fontSize: 11.5, color: color, fontWeight: 600, marginTop: 3, textWrap: 'pretty' }}>{speciality}</div>
      </div>
      <button onClick={onConnect} className="tap-scale" style={{
        padding: '7px 14px', borderRadius: 10,
        background: `linear-gradient(135deg, ${color}1F, ${color}10)`,
        color: color, border: `1px solid ${color}22`,
        fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
        flexShrink: 0,
      }}>Connect</button>
    </div>
  </Card>
);

// ─── 14-day mood trend chart ───
const MoodHistoryChart = ({ history, moods }) => {
  const levelMap = { great: 4, good: 3, okay: 2, low: 1, crisis: 0 };
  const colorMap = {};
  moods.forEach(m => { colorMap[m.id] = m.color; });

  const W = 280, H = 70, PAD = 8;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;

  const pts = history.map((h, i) => {
    const x = PAD + (i / (history.length - 1)) * innerW;
    if (h.m == null) return { x, y: null, m: null };
    const lvl = levelMap[h.m] ?? 2;
    const y = PAD + innerH - (lvl / 4) * innerH;
    return { x, y, m: h.m };
  });

  const valid = pts.filter(p => p.y != null);
  let pathD = '';
  valid.forEach((p, i) => {
    if (i === 0) pathD += `M ${p.x} ${p.y} `;
    else {
      const prev = valid[i - 1];
      const cx = (prev.x + p.x) / 2;
      pathD += `Q ${cx} ${prev.y}, ${cx} ${(prev.y + p.y) / 2} T ${p.x} ${p.y} `;
    }
  });

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="moodCurve" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={C.lavenderDeep} />
          <stop offset="50%" stopColor={C.tidewater} />
          <stop offset="100%" stopColor={C.sageDeep} />
        </linearGradient>
        <linearGradient id="moodFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={C.tidewater} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.tidewater} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3, 4].map(i => (
        <line key={i}
          x1={PAD} x2={W - PAD}
          y1={PAD + innerH - (i / 4) * innerH}
          y2={PAD + innerH - (i / 4) * innerH}
          stroke={C.borderSoft} strokeWidth="0.5" strokeDasharray="2 3" />
      ))}

      {valid.length > 1 && (
        <path d={`${pathD} L ${valid[valid.length - 1].x} ${H - PAD} L ${valid[0].x} ${H - PAD} Z`} fill="url(#moodFill)" />
      )}
      {valid.length > 1 && (
        <path d={pathD} fill="none" stroke="url(#moodCurve)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {pts.map((p, i) => {
        if (p.y == null) return null;
        const color = colorMap[p.m] || C.slate;
        return <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke={color} strokeWidth="2"
          style={{ animation: `fade-in 0.35s ease-out ${i * 0.04}s both` }} />;
      })}
      {pts.map((p, i) => {
        if (i % 3 !== 0 && i !== pts.length - 1) return null;
        return <text key={i} x={p.x} y={H + 12} textAnchor="middle"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, fill: C.slate, letterSpacing: '0.02em' }}>
          {history[i].d.replace('May ', '')}
        </text>;
      })}
    </svg>
  );
};

// ─── Crisis modal ───
const CrisisModal = ({ onClose, toast }) => (
  <div onClick={onClose} style={{
    position: 'absolute', inset: 0, zIndex: 90,
    background: 'rgba(11,23,51,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 22, animation: 'backdrop-in 0.2s ease-out',
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{
      background: '#fff', borderRadius: 20, padding: 22,
      width: '100%', maxWidth: 320,
      borderTop: `4px solid ${C.coral}`,
      animation: 'modal-in 0.25s ease-out',
      boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <IHeart size={20} color={C.coralDeep} />
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 500, color: C.midnight, letterSpacing: '-0.025em' }}>We're here for you.</div>
      </div>
      <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.55, marginBottom: 18, textWrap: 'pretty' }}>
        Whatever this moment feels like, you don't have to carry it alone. Pick one — none are wrong.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="coral" icon={IPhone} onClick={() => { onClose(); toast('Connecting to crisis helpline…', 'info'); }}>Call Crisis Helpline</Button>
        <Button variant="lavender" icon={IMessageCircle} onClick={() => { onClose(); toast('Opening SafeConnect chat', 'info'); }}>Talk to AI</Button>
        <Button variant="secondary" icon={IRadio} onClick={() => { onClose(); toast('Trusted contacts alerted', 'success'); }}>Alert Contact</Button>
        <Button variant="text" onClick={onClose}>Not right now</Button>
      </div>
    </div>
  </div>
);

// ─── Full-screen chat overlay ───
const ChatOverlay = ({ onClose, chatRef, toast }) => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  const sendText = async (txt) => {
    if (sending || !txt.trim()) return;
    const userMsg = { role: 'user', content: txt.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setSending(true);
    try {
      const reply = await chatRef.send(next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error('Chat error:', e);
      let errorMsg = e.message || 'Connection error';
      if (errorMsg.includes('invalid_request')) {
        errorMsg = 'Check your API key in Settings';
      } else if (errorMsg.includes('Invalid API Key')) {
        errorMsg = 'Your API key is invalid. Please update it in Settings.';
      } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        errorMsg = 'API key rejected. Check console for details.';
      }
      setMessages([...next, { role: 'assistant', content: `I'm having trouble: ${errorMsg}` }]);
      toast('Error: ' + errorMsg, 'error');
    }
    setSending(false);
  };

  const empty = messages.length === 0;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: C.paper,
      paddingTop: 56,
      display: 'flex', flexDirection: 'column',
      animation: 'slide-up 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 16px 12px',
        background: `linear-gradient(135deg, rgba(183,168,220,0.20), rgba(245,239,228,0.4))`,
        borderBottom: `1px solid ${C.borderSoft}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onClose} className="tap-scale" style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.graphite,
            boxShadow: '0 1px 3px rgba(11,23,51,0.06)',
          }}><IArrowLeft size={17} /></button>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.lavenderDeep}, ${C.lavender})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: `0 4px 12px ${C.lavenderDeep}44`,
          }}><IMessageCircle size={18} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.text, fontSize: 14.5, fontWeight: 600, color: C.midnight }}>SafeConnect AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.text, fontSize: 11, color: C.slate, marginTop: 1 }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: C.sageDeep, animation: 'pulse-dot 1.6s infinite' }}/>
              Listening
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="phone-scroll" style={{
        flex: 1, overflowY: 'auto', padding: empty ? 0 : '14px 16px 8px',
      }}>
        {empty ? (
          <EmptyChatWelcome onStarter={(s) => sendText(s)} />
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 10, animation: 'msg-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user'
                    ? `linear-gradient(135deg, ${C.tidewater}, ${C.twilight})`
                    : '#fff',
                  color: m.role === 'user' ? '#fff' : C.ink,
                  fontFamily: T.text, fontSize: 14, lineHeight: 1.5,
                  boxShadow: m.role === 'user'
                    ? `0 4px 12px ${C.tidewater}40`
                    : '0 2px 12px rgba(11,23,51,0.06)',
                  textWrap: 'pretty',
                  border: m.role === 'assistant' ? `1px solid ${C.borderSoft}` : undefined,
                }}>{m.content}</div>
              </div>
            ))}
            {sending && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10, animation: 'fade-in 0.2s ease' }}>
                <div style={{
                  padding: '14px 18px', borderRadius: '18px 18px 18px 4px',
                  background: '#fff', border: `1px solid ${C.borderSoft}`,
                  display: 'flex', gap: 5,
                  boxShadow: '0 2px 8px rgba(11,23,51,0.04)',
                }}>
                  {[0, 0.18, 0.36].map(d => (
                    <div key={d} style={{
                      width: 7, height: 7, borderRadius: 999, background: C.lavenderDeep,
                      animation: `pulse-dot 1.1s ease-in-out ${d}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px 26px',
        background: 'rgba(255,255,255,0.96)',
        borderTop: `1px solid ${C.borderSoft}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 7px 7px 14px', borderRadius: 999,
          background: C.paper, border: `1px solid ${C.border}`,
        }}>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendText(input)}
            placeholder="Tell me what's on your mind…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: T.text, fontSize: 14, color: C.ink, minWidth: 0,
            }}
          />
          {input.trim() && (
            <button onClick={() => sendText(input)} disabled={sending} className="tap-scale" style={{
              width: 36, height: 36, borderRadius: 999,
              background: `linear-gradient(135deg, ${C.tidewater}, ${C.twilight})`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 3px 10px ${C.tidewater}55`,
              transition: 'all 0.2s ease',
              animation: 'msg-in 0.2s ease',
            }}><ISend size={14} /></button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyChatWelcome = ({ onStarter }) => (
  <div style={{
    padding: '32px 28px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', textAlign: 'center', minHeight: '100%', justifyContent: 'center',
    animation: 'fade-in 0.4s ease-out',
  }}>
    <div style={{
      width: 88, height: 88, borderRadius: '50%',
      background: `radial-gradient(circle, rgba(183,168,220,0.5) 0%, rgba(183,168,220,0.1) 70%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 18,
      animation: 'logo-breathe 3s ease-in-out infinite',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.lavenderDeep}, ${C.lavender})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        boxShadow: `0 8px 20px ${C.lavenderDeep}55`,
      }}><IHeart size={26} strokeWidth={2.2} /></div>
    </div>
    <div style={{
      fontFamily: T.display, fontSize: 22, fontWeight: 500, color: C.midnight,
      letterSpacing: '-0.025em', marginBottom: 8, textWrap: 'balance',
    }}>I'm here when you're ready.</div>
    <div style={{
      fontFamily: T.text, fontSize: 14, color: C.graphite,
      lineHeight: 1.55, marginBottom: 24, maxWidth: 280, textWrap: 'pretty',
    }}>
      Whatever you're feeling is valid. Tap a starter below, or write your own.
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {STARTERS.map((s, i) => (
        <button key={i} onClick={() => onStarter(s)} className="tap-scale stagger-item" style={{
          padding: '12px 16px', borderRadius: 14,
          background: '#fff', border: `1px solid ${C.borderSoft}`,
          fontFamily: T.text, fontSize: 13.5, color: C.midnight, fontWeight: 500,
          textAlign: 'left', lineHeight: 1.4,
          boxShadow: '0 2px 8px rgba(11,23,51,0.04)',
        }}>"{s}"</button>
      ))}
    </div>
  </div>
);

// Legacy alias
const SafeConnectChat = ChatOverlay;

Object.assign(window, { WellnessScreen, ChatOverlay, SafeConnectChat });
