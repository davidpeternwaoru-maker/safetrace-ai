// document.jsx — AI-Powered Incident Documentation

const evidenceTypes = [
  { id: 'screenshot', label: 'Screenshot', icon: ICamera },
  { id: 'photo',      label: 'Photo',      icon: IImage },
  { id: 'voice',      label: 'Voice Note', icon: IMic },
  { id: 'messages',   label: 'Messages',   icon: IMessageCircle },
  { id: 'email',      label: 'Email',      icon: IFileText },
  { id: 'receipt',    label: 'Receipt',    icon: IFileText },
  { id: 'other',      label: 'Other',      icon: IPlus },
];

const sampleFilenames = {
  screenshot: ['screen_2026-05-21_22-14.png', 'screen_2026-05-19_14-02.png'],
  photo: ['IMG_4421.jpg', 'IMG_4498.jpg'],
  voice: ['voice_memo_05-22.m4a', 'voice_memo_05-24.m4a'],
  messages: ['imessage_thread_J.txt', 'sms_thread_5-20.txt'],
  email: ['email_chain.eml'],
  receipt: ['receipt_taxi_5-22.pdf'],
  other: ['attachment.bin'],
};

// ─── File-picker helpers ───
const ACCEPT_FOR = {
  screenshot: 'image/*',
  photo:      'image/*',
  voice:      'audio/*',
  messages:   'image/*,.pdf,.doc,.docx,.txt',
  email:      'image/*,.pdf,.doc,.docx,.txt,.eml',
  receipt:    'image/*,.pdf',
  other:      'image/*,.pdf,.doc,.docx,.txt',
};

const pickFiles = (typeId, useCamera = false) => new Promise((resolve) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = ACCEPT_FOR[typeId] || '*/*';
  input.multiple = true;
  if (useCamera) input.capture = 'environment';
  input.onchange = (e) => resolve(Array.from(e.target.files || []));
  input.click();
  // Cancel detection (best-effort): if no change in 60s, resolve empty
  setTimeout(() => resolve([]), 60000);
});

const truncateName = (n) => n.length > 20 ? n.slice(0, 18) + '…' : n;

const evidenceIconFor = (typeId) => {
  switch (typeId) {
    case 'screenshot':
    case 'photo':    return IImage;
    case 'voice':    return IMic;
    case 'messages': return IMessageCircle;
    default:         return IFileText;
  }
};

// ─── Sub-state A: Start screen ───
const DocStartScreen = ({ onStart, onText, onUpload }) => (
  <div className="phone-scroll" style={{
    position: 'absolute', inset: 0, background: C.paper,
    paddingTop: 56, paddingBottom: 110, overflowY: 'auto',
    animation: 'fade-in 0.25s ease-out',
  }}>
    <Header title="Document an Incident" subtitle="Private · End-to-End Encrypted" />

    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 32px 8px', textAlign: 'center',
    }}>
      {/* Pulsing mic */}
      <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <div style={{
          position: 'absolute', inset: 16, borderRadius: '50%',
          background: `${C.tidewater}10`,
          animation: 'pulse-ring-slow 2.4s ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 30, borderRadius: '50%',
          background: `${C.tidewater}20`,
          animation: 'pulse-ring-slow 2.4s ease-out 1.2s infinite',
        }} />
        <div style={{
          width: 116, height: 116, borderRadius: '50%',
          background: `linear-gradient(160deg, ${C.tidewater} 0%, ${C.twilight} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          boxShadow: `0 12px 32px ${C.tidewater}55`,
        }}>
          <IMic size={48} strokeWidth={2} />
        </div>
      </div>

      <h2 style={{
        fontFamily: T.display, fontSize: 24, fontWeight: 500,
        color: C.midnight, letterSpacing: '-0.025em', marginBottom: 10,
      }}>Tell your story.</h2>
      <p style={{
        fontFamily: T.text, fontSize: 14.5, color: C.graphite,
        lineHeight: 1.55, maxWidth: 300, textWrap: 'pretty', marginBottom: 28,
      }}>
        Speak naturally, type, or upload evidence.
        There's no wrong way to start.
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button icon={IMic} onClick={onStart}>Start Speaking</Button>
        <Button icon={IFileText} variant="secondary" onClick={onText}>Type Instead</Button>
        <Button icon={IUpload} variant="text" onClick={onUpload}>Upload Evidence</Button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginTop: 28,
        fontFamily: T.text, fontSize: 12, color: C.slate,
      }}>
        <ILock size={12} />
        End-to-end encrypted. Only you control access.
      </div>
    </div>
  </div>
);

// ─── Sub-state B: Active session ───
const DocSession = ({ initialText, onCancel, onProcess, toast }) => {
  const [text, setText] = React.useState(initialText && initialText !== 'TYPE' ? initialText : '');
  const [evidence, setEvidence] = React.useState([]);
  const [seconds, setSeconds] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const taRef = React.useRef(null);
  const recogRef = React.useRef(null);
  const finalRef = React.useRef(initialText && initialText !== 'TYPE' ? initialText : '');

  React.useEffect(() => {
    const i = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  React.useEffect(() => {
    if (taRef.current && initialText === 'TYPE') taRef.current.focus();
    // Auto-start speech recognition if invoked via "Start Speaking"
    if (initialText === 'SPEAK') {
      setTimeout(() => startRecording(), 200);
    }
    return () => {
      if (recogRef.current) {
        try { recogRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast('Speech not supported on this browser. Please type instead.', 'info');
      if (taRef.current) taRef.current.focus();
      return;
    }
    try {
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) final += res[0].transcript + ' ';
          else interim += res[0].transcript;
        }
        if (final) {
          finalRef.current = (finalRef.current + ' ' + final).trim() + ' ';
          setText(finalRef.current + interim);
        } else {
          setText(finalRef.current + interim);
        }
      };
      recognition.onerror = (e) => {
        console.error('Speech error:', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          toast('Could not access microphone. Please type instead.', 'error');
        } else if (e.error !== 'aborted' && e.error !== 'no-speech') {
          toast(`Speech error: ${e.error}`, 'error');
        }
        setRecording(false);
      };
      recognition.onend = () => {
        // If still in recording mode, restart (handles browser auto-stop)
        if (recogRef.current && recording) {
          try { recognition.start(); } catch(e) {}
        } else {
          setRecording(false);
        }
      };

      recogRef.current = recognition;
      recognition.start();
      setRecording(true);
    } catch (e) {
      console.error(e);
      toast('Could not start recording. Please type instead.', 'error');
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (recogRef.current) {
      try { recogRef.current.stop(); } catch(e) {}
      recogRef.current = null;
    }
    setRecording(false);
    // Commit any trailing interim text into final
    finalRef.current = text;
    toast('Recording stopped', 'success');
  };

  const onTextChange = (v) => {
    setText(v);
    finalRef.current = v;
  };

  const addEvidence = async (type, useCamera = false) => {
    const files = await pickFiles(type.id, useCamera);
    if (!files.length) return;
    const items = files.map(f => ({
      id: Date.now() + Math.random(),
      type: type.id,
      label: type.label,
      icon: evidenceIconFor(type.id),
      filename: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      preview: f.type && f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }));
    setEvidence(e => [...e, ...items]);
    toast(`${files.length} file${files.length > 1 ? 's' : ''} attached`, 'success');
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div style={{
      position: 'absolute', inset: 0, background: C.paper,
      paddingTop: 56, display: 'flex', flexDirection: 'column',
      animation: 'fade-in 0.25s ease-out',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: 999,
            background: recording ? C.coral : C.slate,
            animation: recording ? 'record-blink 1.1s ease-in-out infinite' : undefined,
          }} />
          <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight }}>
            {recording ? 'Recording…' : 'Session'}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 13, color: C.slate }}>{mm}:{ss}</div>
        </div>
        <button onClick={() => setConfirmCancel(true)} style={{
          width: 34, height: 34, borderRadius: 999, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.graphite, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}><IX size={16} /></button>
      </div>

      {/* Scrollable area */}
      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 12px' }}>
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Describe what happened in your own words. Include details you remember — times, places, people, what was said or done. Don't worry about order, our AI will organise everything…"
          style={{
            width: '100%', minHeight: 200, padding: 16,
            background: '#fff', borderRadius: 16,
            border: `1.5px solid ${recording ? C.coral : C.border}`,
            fontFamily: T.text, fontSize: 15, lineHeight: 1.55,
            color: C.ink, resize: 'vertical', outline: 'none',
            transition: 'border-color 0.2s ease',
            boxShadow: recording ? `0 0 0 4px ${C.coral}1A` : undefined,
          }}
          onFocus={(e) => { if (!recording) e.target.style.borderColor = C.tidewater; }}
          onBlur={(e) => { if (!recording) e.target.style.borderColor = C.border; }}
        />

        {/* Recording controls */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
        }}>
          {!recording ? (
            <button onClick={startRecording} className="tap-scale" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 999,
              background: `linear-gradient(135deg, ${C.tidewater}, ${C.twilight})`,
              color: '#fff', fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
              boxShadow: `0 3px 10px ${C.tidewater}44`,
            }}>
              <IMic size={13} /> Start Speaking
            </button>
          ) : (
            <button onClick={stopRecording} className="tap-scale" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 999,
              background: `linear-gradient(135deg, ${C.coral}, ${C.coralDeep})`,
              color: '#fff', fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
              boxShadow: `0 3px 10px ${C.coral}55`,
              animation: 'pulse-soft 2s ease-in-out infinite',
            }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: '#fff' }} /> Stop Recording
            </button>
          )}
          <div style={{
            fontFamily: T.mono, fontSize: 10, color: C.slate,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {text.trim().split(/\s+/).filter(Boolean).length} words · autosaving
          </div>
        </div>

        {/* Evidence chips */}
        <div style={{
          fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
          color: C.slate, textTransform: 'uppercase', letterSpacing: '0.12em',
          marginTop: 22, marginBottom: 10,
        }}>Attach Evidence</div>

        <div className="chip-scroll" style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
          margin: '0 -20px', padding: '0 20px 4px',
        }}>
          {/* Take photo (camera) */}
          <button onClick={() => addEvidence({ id: 'photo', label: 'Photo' }, true)} className="tap-scale" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 999,
            background: `linear-gradient(135deg, ${C.tidewater}1F, ${C.tidewater}10)`,
            border: `1px solid ${C.tidewater}33`,
            fontFamily: T.text, fontSize: 13, fontWeight: 600, color: C.tidewater,
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            <ICamera size={14} /> Take Photo
          </button>
          {evidenceTypes.map(t => {
            const I = t.icon;
            return (
              <button key={t.id} onClick={() => addEvidence(t)} className="tap-scale" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 999,
                background: '#fff', border: `1px solid ${C.border}`,
                fontFamily: T.text, fontSize: 13, fontWeight: 500, color: C.graphite,
                flexShrink: 0, whiteSpace: 'nowrap',
              }}>
                <I size={14} color={C.tidewater} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Attached evidence list */}
        {evidence.length > 0 && (
          <>
            <div style={{
              fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
              color: C.slate, textTransform: 'uppercase', letterSpacing: '0.12em',
              marginTop: 18, marginBottom: 8,
            }}>Attached · {evidence.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {evidence.map(e => {
                const I = e.icon || IFileText;
                return (
                  <div key={e.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', background: '#fff',
                    border: `1px solid ${C.borderSoft}`, borderRadius: 12,
                    animation: 'msg-in 0.25s ease',
                  }}>
                    {e.preview ? (
                      <div style={{
                        width: 40, height: 40, borderRadius: 9,
                        backgroundImage: `url(${e.preview})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        border: `1px solid ${C.borderSoft}`, flexShrink: 0,
                      }} />
                    ) : (
                      <div style={{
                        width: 40, height: 40, borderRadius: 9,
                        background: `${C.tidewater}1A`, color: C.tidewater,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}><I size={16} /></div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.text, fontSize: 13, fontWeight: 600, color: C.midnight }}>
                        {truncateName(e.filename)}
                      </div>
                      <div style={{ fontFamily: T.mono, fontSize: 10.5, color: C.slate, marginTop: 1, display: 'flex', gap: 6 }}>
                        <span>{e.label}</span>
                        <span>·</span>
                        <span>{e.size}</span>
                        <span>·</span>
                        <span>{e.timestamp}</span>
                      </div>
                    </div>
                    <button onClick={() => {
                      if (e.preview) URL.revokeObjectURL(e.preview);
                      setEvidence(ev => ev.filter(x => x.id !== e.id));
                    }} style={{
                      width: 28, height: 28, borderRadius: 999,
                      background: C.paper2, color: C.slate,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><IX size={14} /></button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 20px 16px',
        background: 'rgba(245,239,228,0.95)',
        borderTop: `1px solid ${C.borderSoft}`,
      }}>
        <Button variant="secondary" onClick={() => toast('Draft saved to SafeVault', 'success')}>Save Draft</Button>
        <Button icon={IActivity} disabled={!text.trim()} onClick={() => {
          if (recogRef.current) { try { recogRef.current.stop(); } catch(e) {} }
          onProcess(text, evidence);
        }}>Process with AI</Button>
      </div>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, letterSpacing: '-0.02em', marginBottom: 8 }}>Discard this session?</div>
        <div style={{ fontFamily: T.text, fontSize: 14, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
          Your progress will be lost. This cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setConfirmCancel(false)}>Keep</Button>
          <Button variant="coral" onClick={() => {
            if (recogRef.current) { try { recogRef.current.stop(); } catch(e) {} }
            setConfirmCancel(false); onCancel();
          }}>Discard</Button>
        </div>
      </Modal>
    </div>
  );
};

// ─── Sub-state C: AI Processing ───
const DocProcessing = ({ error, onRetry, onCancel }) => {
  const messages = [
    'Analysing your account…',
    'Reconstructing timeline…',
    'Organising evidence…',
    'Identifying policy relevance…',
    'Generating your report…',
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (error) return;
    const i = setInterval(() => setIdx(x => (x + 1) % messages.length), 2000);
    return () => clearInterval(i);
  }, [error]);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'linear-gradient(180deg, #16384A 0%, #0B1733 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#fff', animation: 'fade-in 0.3s ease-out',
    }}>
      {!error ? (
        <>
          <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `1.5px solid ${C.aurora}`,
                animation: `pulse-ring 2.4s ease-out ${i * 0.8}s infinite`,
              }} />
            ))}
            <div style={{ animation: 'logo-breathe 2s ease-in-out infinite' }}>
              <STMark size={110} color={C.aurora} />
            </div>
          </div>
          <div style={{
            marginTop: 36, fontFamily: T.display, fontSize: 18,
            fontWeight: 400, letterSpacing: '-0.01em', color: C.aurora,
            opacity: 0.95, height: 26,
          }}>
            <span key={idx} style={{ animation: 'fade-in 0.4s ease-out' }}>{messages[idx]}</span>
          </div>
          <div style={{
            marginTop: 56, fontFamily: T.mono, fontSize: 10,
            letterSpacing: '0.22em', color: 'rgba(127,183,194,0.55)',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <ILock size={11} /> Processed locally · zero retention
          </div>
        </>
      ) : (
        <div style={{ maxWidth: 280, textAlign: 'center', padding: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            background: `${C.coral}33`, color: C.coral,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}><IAlertTriangle size={28} /></div>
          <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Couldn't reach the AI</div>
          <div style={{ fontFamily: T.text, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 22 }}>
            {error}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={onCancel}>Back</Button>
            <Button onClick={onRetry}>Try again</Button>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { DocStartScreen, DocSession, DocProcessing });
