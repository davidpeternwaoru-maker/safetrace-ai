// safepulse.jsx — Emergency Safety Network: Ready / Active / Community Responder

const SafePulseScreen = ({
  toast,
  nearbyAlert,                // { distance, minutesAgo, responders } | null
  onClearNearbyAlert,         // called when user dismisses or responds
  initialMode,                // 'ready' | 'responding' | 'active'
  onModeChange,               // optional callback when mode changes
}) => {
  const [state, setState] = React.useState(initialMode || 'ready'); // ready | holding | active | responding
  const [holdProgress, setHoldProgress] = React.useState(0);
  const [activeTimer, setActiveTimer] = React.useState(0);
  const [showHistory, setShowHistory] = React.useState(false);
  const [cancelConfirm, setCancelConfirm] = React.useState(false);
  const [safeConfirm, setSafeConfirm] = React.useState(false);
  const [trainingOpen, setTrainingOpen] = React.useState(false);

  // Responder settings
  const [responderOn, setResponderOn] = React.useState(true);
  const [radius, setRadius] = React.useState(1.0); // km

  // Responder mode state (sub-state C)
  const [respDistance, setRespDistance] = React.useState(400);
  const [arrived, setArrived] = React.useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = React.useState(false);

  const holdRef = React.useRef(null);
  const activeIntRef = React.useRef(null);

  // Switch state when initialMode prop arrives
  React.useEffect(() => {
    if (initialMode && initialMode !== state) setState(initialMode);
  }, [initialMode]);

  React.useEffect(() => { if (onModeChange) onModeChange(state); }, [state]);

  // Active timer
  React.useEffect(() => {
    if (state !== 'active' && state !== 'responding') return;
    activeIntRef.current = setInterval(() => {
      setActiveTimer(t => t + 1);
      if (state === 'responding' && !arrived) setRespDistance(d => Math.max(20, d - 14));
    }, 1000);
    return () => clearInterval(activeIntRef.current);
  }, [state, arrived]);

  const startHold = () => {
    if (state === 'active' || state === 'responding') return;
    setState('holding');
    setHoldProgress(0);
    const start = Date.now();
    holdRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 3000;
      if (elapsed >= 1) {
        clearInterval(holdRef.current);
        setHoldProgress(1);
        setState('active');
        setActiveTimer(0);
      } else {
        setHoldProgress(elapsed);
      }
    }, 30);
  };
  const releaseHold = () => {
    if (state !== 'holding') return;
    clearInterval(holdRef.current);
    setHoldProgress(0);
    setState('ready');
    toast('Hold for 3 seconds to activate', 'info');
  };

  const cancelAlert = () => {
    setCancelConfirm(false);
    setState('ready');
    setActiveTimer(0);
    toast('Alert cancelled · Responders notified', 'info');
  };
  const confirmSafe = () => {
    setSafeConfirm(false);
    setState('ready');
    setActiveTimer(0);
    toast("Alert ended. Glad you're safe. 💚", 'success');
  };

  const respondToAlert = () => {
    setState('responding');
    setRespDistance(nearbyAlert?.distance ?? 400);
    setActiveTimer(0);
    setArrived(false);
    if (onClearNearbyAlert) onClearNearbyAlert();
  };

  const endResponse = () => {
    setState('ready');
    setActiveTimer(0);
    setArrived(false);
    toast('Response ended · thank you', 'success');
  };

  const mm = String(Math.floor(activeTimer / 60)).padStart(2, '0');
  const ss = String(activeTimer % 60).padStart(2, '0');

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(180deg, ${C.midnight} 0%, #14224a 100%)`,
      animation: state === 'active' ? 'screen-pulse 3.5s ease-in-out infinite' : undefined,
      paddingBottom: state === 'responding' ? 80 : 110,
      paddingTop: 56,
      overflowY: 'auto', color: '#fff',
    }} className="phone-scroll">

      {state === 'active' && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: C.coral, color: '#fff',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: T.text, fontSize: 13, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          animation: 'fade-in-down 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 9, height: 9, borderRadius: 999, background: '#fff', animation: 'pulse-dot 1s ease-in-out infinite' }} />
            Alert Active
          </div>
          <div style={{ fontFamily: T.mono, letterSpacing: '0.08em' }}>{mm}:{ss}</div>
        </div>
      )}

      {state === 'responding' && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: C.tidewater, color: '#fff',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: T.text, fontSize: 13, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          animation: 'fade-in-down 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IShield size={14} /> Responding to an Alert
          </div>
          <div style={{ fontFamily: T.mono, letterSpacing: '0.08em' }}>{mm}:{ss}</div>
        </div>
      )}

      {/* RESPONDING MODE */}
      {state === 'responding' && (
        <ResponderMode
          alert={nearbyAlert}
          distance={respDistance}
          arrived={arrived}
          guidelinesOpen={guidelinesOpen}
          onToggleGuidelines={() => setGuidelinesOpen(o => !o)}
          onArrived={() => { setArrived(true); toast("Person notified you've arrived. Approach with care.", 'success'); }}
          onCantRespond={() => { endResponse(); }}
          onEmergencyCall={() => toast('Calling 911…', 'info')}
          onEnd={endResponse}
          toast={toast}
          timerSec={activeTimer}
        />
      )}

      {/* READY + HOLDING + ACTIVE share the same overall shell, varying middle */}
      {state !== 'responding' && (
        <>
          {/* Header */}
          <div style={{ padding: '14px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IRadio size={22} color={C.aurora} />
                <div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 500, letterSpacing: '-0.025em' }}>SafePulse</div>
              </div>
              <div style={{ fontFamily: T.text, fontSize: 13, color: '#8ABBC7', marginTop: 4 }}>
                {state === 'active' ? 'Active monitoring · location streaming' : 'Your real-time safety network'}
              </div>
            </div>
          </div>

          {/* Nearby alert banner (only in ready/holding) */}
          {(state === 'ready' || state === 'holding') && nearbyAlert && (
            <div style={{ padding: '6px 20px 0' }}>
              <NearbyAlertBanner
                alert={nearbyAlert}
                onRespond={respondToAlert}
                onView={() => toast('Alert details collapsed view', 'info')}
              />
            </div>
          )}

          {/* SOS Button area */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '18px 20px 20px',
          }}>
            {state !== 'active' ? (
              <SOSButton
                holdProgress={holdProgress}
                holding={state === 'holding'}
                onStart={startHold}
                onRelease={releaseHold}
              />
            ) : (
              <ActiveSonar />
            )}

            {state === 'ready' && (
              <div style={{ fontFamily: T.text, fontSize: 13.5, color: '#8ABBC7', marginTop: 22, textAlign: 'center' }}>
                Press and hold for <strong style={{ color: '#fff' }}>3 seconds</strong>
              </div>
            )}
            {state === 'holding' && (
              <div style={{ fontFamily: T.text, fontSize: 14, color: C.aurora, marginTop: 22, fontWeight: 600, animation: 'fade-in 0.2s ease' }}>
                Hold steady · {Math.max(1, Math.ceil((1 - holdProgress) * 3))}…
              </div>
            )}
            {state === 'active' && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <div style={{ fontFamily: T.display, fontSize: 26, fontWeight: 500, letterSpacing: '-0.025em', marginBottom: 6 }}>
                  Help is on the way.
                </div>
                <div style={{ fontFamily: T.text, fontSize: 14, color: '#8ABBC7' }}>
                  Alert sent to your safety network
                </div>
              </div>
            )}

            {state !== 'active' && (
              <div style={{
                display: 'flex', gap: 20, marginTop: 28,
                fontFamily: T.text, fontSize: 11.5, color: '#8ABBC7',
              }}>
                <StatusChip icon={IUsers} label="3 nearby" color="#8ABBC7" />
                <StatusChip icon={IShield} label="Security linked" color="#8ABBC7" />
                <StatusChip icon={IMapPin} label="GPS active" color={C.sage} />
              </div>
            )}
          </div>

          {/* ACTIVE mode body */}
          {state === 'active' && (
            <div style={{ padding: '4px 20px 0' }}>
              <DarkCard>
                <DarkCardTitle>Responders</DarkCardTitle>
                <Responder name="Sarah M." status="Responding · 2 min away · 400m" dot={{ color: C.sage, pulse: true }} />
                <Responder name="Campus Security" status="Notified · Dispatching" dot={{ color: C.amber, pulse: false }} />
                <Responder name="Dr. James K." status="Acknowledged" dot={{ color: C.sage, check: true }} />
                <Responder name="Community Responder" status="Responding · 5 min away" badge="Verified" dot={{ color: C.sage, pulse: true }} />
              </DarkCard>

              <div style={{ height: 12 }} />

              <MiniMap />

              <div style={{ height: 10 }} />

              <DarkCard>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(127,183,194,0.15)', color: C.aurora,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><IMapPin size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: '#fff' }}>University Main Campus · Building C</div>
                    <div style={{ fontFamily: T.text, fontSize: 12, color: '#8ABBC7', marginTop: 2 }}>Live · coordinates logged · streaming to responders only</div>
                  </div>
                </div>
              </DarkCard>

              <div style={{ height: 10 }} />

              <div style={{
                background: 'rgba(127,183,194,0.08)',
                border: '1px solid rgba(127,183,194,0.18)',
                borderRadius: 12, padding: '10px 12px',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <IActivity size={16} color={C.aurora} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontFamily: T.text, fontSize: 11.5, color: '#8ABBC7', lineHeight: 1.5 }}>
                  Recording: location path, timestamps, duration, and responder activity. This data will be automatically added to your incident report.
                </div>
              </div>

              {/* Bottom buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Button variant="outline" onClick={() => setCancelConfirm(true)} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', padding: '12px' }}>Cancel</Button>
                <Button variant="coral" icon={IPhone} onClick={() => toast('Connecting to 911…', 'info')} style={{ padding: '12px' }}>Call 911</Button>
              </div>
              <div style={{ marginTop: 8 }}>
                <Button variant="sage" icon={ICheckCircle} onClick={() => setSafeConfirm(true)}>I'm Safe</Button>
              </div>
            </div>
          )}

          {/* READY / HOLDING mode body */}
          {(state === 'ready' || state === 'holding') && (
            <div style={{ padding: '12px 20px 0' }}>
              {/* Safety Network */}
              <DarkCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <DarkCardTitle style={{ margin: 0 }}>Your Safety Network</DarkCardTitle>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: '#8ABBC7', letterSpacing: '0.15em', textTransform: 'uppercase' }}>3 linked</div>
                </div>
                <Contact name="Sarah M." rel="Best Friend" badge={{ label: 'Active', color: C.sage }} sub="Can receive alerts ✓" />
                <Contact name="Dr. James K." rel="Campus Counsellor" badge={{ label: 'Active', color: C.sage }} sub="Can receive alerts ✓" />
                <Contact name="Campus Security" rel="Institutional" badge={{ label: 'Linked', color: C.aurora }} />
                <button onClick={() => toast('Add Contact wizard', 'info')} style={{
                  marginTop: 12, width: '100%', padding: '10px',
                  border: '1.5px dashed rgba(127,183,194,0.5)',
                  borderRadius: 12, color: '#8ABBC7',
                  fontFamily: T.text, fontSize: 13, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}><IPlus size={14} /> Add Contact</button>
              </DarkCard>

              {/* Community Responder settings */}
              <div style={{ height: 10 }} />
              <DarkCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IShield size={16} color={C.aurora} />
                    <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: '#fff' }}>Community Responder</div>
                  </div>
                  <DarkToggle on={responderOn} onToggle={() => setResponderOn(o => !o)} />
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: T.text, fontSize: 11.5, marginTop: 6,
                  color: responderOn ? C.sage : '#8ABBC7',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: 999, background: responderOn ? C.sage : C.fog, animation: responderOn ? 'pulse-dot 1.6s infinite' : undefined }} />
                  Status: {responderOn ? 'Active' : 'Inactive'}
                </div>

                {responderOn && (
                  <>
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <div style={{ fontFamily: T.text, fontSize: 12, color: '#8ABBC7' }}>Responder Radius</div>
                        <div style={{ fontFamily: T.mono, fontSize: 11.5, color: C.aurora }}>
                          {radius < 1 ? `${Math.round(radius * 1000)}m` : `${radius.toFixed(1)} km`}
                        </div>
                      </div>
                      <input
                        type="range" min="0.5" max="5" step="0.5"
                        value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: C.aurora }}
                      />
                    </div>

                    <div style={{
                      marginTop: 12, fontFamily: T.text, fontSize: 11.5,
                      color: '#8ABBC7', lineHeight: 1.5, textWrap: 'pretty',
                    }}>
                      You'll receive anonymous alerts from SafeTrace users within this radius who need help. Their identity is protected.
                    </div>

                    <button onClick={() => setTrainingOpen(true)} className="tap-scale" style={{
                      marginTop: 10, width: '100%', padding: '8px 10px',
                      background: 'rgba(127,183,194,0.10)',
                      border: '1px solid rgba(127,183,194,0.22)',
                      borderRadius: 10, color: C.aurora,
                      fontFamily: T.text, fontSize: 12.5, fontWeight: 500,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span>Responder Training · 3 of 4 complete</span>
                      <IChevronRight size={14} />
                    </button>
                  </>
                )}
              </DarkCard>

              {/* Quick actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <Button variant="outline" onClick={() => toast('System verified ✓', 'success')} style={{ borderColor: 'rgba(127,183,194,0.5)', color: '#8ABBC7' }}>Test Alert</Button>
                <Button variant="outline" onClick={() => setShowHistory(true)} style={{ borderColor: 'rgba(127,183,194,0.5)', color: '#8ABBC7' }}>Alert History</Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      <Modal open={showHistory} onClose={() => setShowHistory(false)}>
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, marginBottom: 12 }}>Alert History</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { d: 'May 22', t: '11:48 PM', label: 'SafePulse Test', state: 'Verified', color: C.sageDeep },
            { d: 'May 15', t: '02:14 AM', label: 'Hold — released', state: 'Cancelled', color: C.slate },
            { d: 'Apr 30', t: '10:02 PM', label: 'SafePulse Test', state: 'Verified', color: C.sageDeep },
          ].map((a, i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 12,
              border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            }}>
              <div>
                <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: C.midnight }}>{a.label}</div>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: C.slate, marginTop: 2 }}>{a.d} · {a.t}</div>
              </div>
              <Pill color={a.color}>{a.state}</Pill>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={() => setShowHistory(false)}>Close</Button>
      </Modal>

      <Modal open={cancelConfirm} onClose={() => setCancelConfirm(false)}>
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, marginBottom: 8 }}>Cancel the alert?</div>
        <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
          All responders will be notified that you are safe. Your location stops streaming immediately.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setCancelConfirm(false)}>Keep Active</Button>
          <Button variant="coral" onClick={cancelAlert}>Cancel Alert</Button>
        </div>
      </Modal>

      <Modal open={safeConfirm} onClose={() => setSafeConfirm(false)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <ICheckCircle size={22} color={C.sageDeep} />
          <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight }}>You're safe?</div>
        </div>
        <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
          All responders will be notified that you're okay and the alert will end.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setSafeConfirm(false)}>Wait</Button>
          <Button variant="sage" onClick={confirmSafe}>Yes, I'm safe</Button>
        </div>
      </Modal>

      <TrainingModal open={trainingOpen} onClose={() => setTrainingOpen(false)} toast={toast} />
    </div>
  );
};

// ─── Nearby alert banner ───
const NearbyAlertBanner = ({ alert, onRespond, onView }) => (
  <div style={{
    position: 'relative', overflow: 'hidden',
    background: `linear-gradient(135deg, ${C.coral} 0%, ${C.coralDeep} 100%)`,
    color: '#fff', borderRadius: 16, padding: 14,
    animation: 'fade-in-down 0.4s ease-out',
  }}>
    {/* Pulse overlay */}
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 16,
      boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.18)`,
      animation: 'pulse-soft 2.4s ease-in-out infinite', pointerEvents: 'none',
    }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <IAlertTriangle size={18} />
      <div style={{ fontFamily: T.text, fontSize: 15, fontWeight: 700 }}>Someone nearby needs help</div>
    </div>
    <div style={{ fontFamily: T.text, fontSize: 12.5, opacity: 0.92 }}>
      {alert.distance}m away · Triggered {alert.minutesAgo} min ago · {alert.responders} responding
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
      <button onClick={onRespond} className="tap-scale" style={{
        flex: 1, padding: '8px 12px', borderRadius: 10,
        background: '#fff', color: C.coralDeep,
        fontFamily: T.text, fontSize: 13, fontWeight: 700,
      }}>Respond</button>
      <button onClick={onView} className="tap-scale" style={{
        flex: 1, padding: '8px 12px', borderRadius: 10,
        background: 'rgba(255,255,255,0.18)',
        border: '1px solid rgba(255,255,255,0.4)', color: '#fff',
        fontFamily: T.text, fontSize: 13, fontWeight: 600,
      }}>View Details</button>
    </div>
  </div>
);

// ─── Community Responder Mode (Sub-state C) ───
const ResponderMode = ({ alert, distance, arrived, onArrived, onCantRespond, onEmergencyCall, onEnd, guidelinesOpen, onToggleGuidelines, toast, timerSec }) => {
  const time = new Date();
  const fmt = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const updateTimes = React.useMemo(() => [0, 1, 2, 3].map(min => {
    const d = new Date(); d.setMinutes(d.getMinutes() - 3 + min); return fmt(d);
  }), []);

  return (
    <div style={{ padding: '14px 20px 0', animation: 'fade-in 0.3s ease-out' }}>
      {/* Alert details */}
      <DarkCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <IAlertTriangle size={18} color={C.coral} />
          <div style={{ fontFamily: T.display, fontSize: 18, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em' }}>Someone nearby needs help</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          <DetailRow icon={IMapPin} label="Distance" value={`~${alert?.distance ?? 400}m away`} />
          <DetailRow icon={IClock} label="Triggered" value={`${alert?.minutesAgo ?? 3} min ago`} />
          <DetailRow icon={IRadio} label="Type" value="Emergency SOS" />
          <DetailRow icon={ILock} label="Identity" value="Protected" />
        </div>
        <div style={{
          marginTop: 12, padding: '8px 10px', borderRadius: 10,
          background: 'rgba(127,183,194,0.10)',
          fontFamily: T.text, fontSize: 11.5, color: '#8ABBC7', lineHeight: 1.45, textWrap: 'pretty',
        }}>
          Identity protected — you will see their location only, not their identity.
        </div>
      </DarkCard>

      <div style={{ height: 10 }} />

      {/* Navigation map */}
      <ResponderMap distance={distance} arrived={arrived} />

      <div style={{ height: 10 }} />

      {/* Actions */}
      <DarkCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="sage" icon={ICheck} disabled={arrived} onClick={onArrived}>
            {arrived ? "You've arrived" : "I've Arrived"}
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" icon={IX} onClick={onCantRespond} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>Can't Respond</Button>
            <Button variant="outline" icon={IPhone} onClick={() => toast('Calling Campus Security…', 'info')} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>Security</Button>
          </div>
        </div>
      </DarkCard>

      <div style={{ height: 10 }} />

      {/* Guidelines collapsible */}
      <DarkCard>
        <button onClick={onToggleGuidelines} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IShield size={16} color={C.aurora} />
            <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600 }}>Trauma-Informed Response Guidelines</div>
          </div>
          <IChevronRight size={16} style={{ transform: guidelinesOpen ? 'rotate(90deg)' : undefined, transition: 'transform 0.2s ease' }} />
        </button>
        {guidelinesOpen && (
          <ul style={{
            margin: '12px 0 0', paddingLeft: 18,
            fontFamily: T.text, fontSize: 12, color: '#8ABBC7', lineHeight: 1.6,
            animation: 'fade-in 0.2s ease',
          }}>
            <li>Approach calmly. Identify yourself as a SafeTrace community responder.</li>
            <li>"Are you okay? I'm here to help." Let them lead the conversation.</li>
            <li>Do not touch without permission.</li>
            <li>If there's immediate physical danger, call emergency services.</li>
            <li>Stay with them until they feel safe or professional help arrives.</li>
            <li>You can document what you observed afterward in your own account.</li>
          </ul>
        )}
      </DarkCard>

      <div style={{ height: 10 }} />

      {/* Status updates */}
      <DarkCard>
        <DarkCardTitle>Live Updates</DarkCardTitle>
        <UpdateRow time={updateTimes[0]} text="Alert triggered" />
        <UpdateRow time={updateTimes[1]} text="You responded to the alert" />
        <UpdateRow time={updateTimes[2]} text="Campus Security notified" />
        <UpdateRow time={updateTimes[3]} text="Sarah M. is also responding" />
        <UpdateRow time={fmt(time)} text={arrived ? "You marked: arrived on scene" : `You are ${distance}m away`} live />
      </DarkCard>

      <div style={{ height: 10 }} />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" onClick={onEnd} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>End Response</Button>
        <Button variant="coral" icon={IPhone} onClick={onEmergencyCall}>Emergency Call</Button>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: I, label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 10px', borderRadius: 10,
    background: 'rgba(127,183,194,0.08)',
    border: '1px solid rgba(127,183,194,0.18)',
  }}>
    <I size={14} color={C.aurora} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: T.mono, fontSize: 9, color: '#8ABBC7', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ fontFamily: T.text, fontSize: 12.5, color: '#fff', fontWeight: 500 }}>{value}</div>
    </div>
  </div>
);

const UpdateRow = ({ time, text, live }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '6px 0', borderTop: '1px dashed rgba(127,183,194,0.14)',
  }}>
    <div style={{ fontFamily: T.mono, fontSize: 10.5, color: live ? C.aurora : '#8ABBC7', minWidth: 52 }}>{time}</div>
    <div style={{ fontFamily: T.text, fontSize: 12, color: '#fff', lineHeight: 1.45, flex: 1 }}>{text}</div>
    {live && <div style={{ width: 7, height: 7, borderRadius: 999, background: C.sage, animation: 'pulse-dot 1.4s infinite' }} />}
  </div>
);

// ─── Mini live map (active mode) ───
const MiniMap = () => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => { const i = setInterval(() => setT(x => x + 0.02), 200); return () => clearInterval(i); }, []);
  const f = Math.min(1, t);
  const dot = (cx0, cy0, cx1, cy1) => ({ x: cx0 + (cx1 - cx0) * f, y: cy0 + (cy1 - cy0) * f });
  const sarah = dot(28, 30, 50, 50);
  const responder = dot(80, 22, 50, 50);
  const sec = dot(78, 88, 50, 50);

  return (
    <DarkCard style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <DarkCardTitle style={{ margin: 0 }}>Live Tracking</DarkCardTitle>
        <div style={{ fontFamily: T.mono, fontSize: 9.5, color: C.sage, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: C.sage, animation: 'pulse-dot 1.2s infinite' }} /> Active
        </div>
      </div>
      <div style={{
        position: 'relative', borderRadius: 14, overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, #1a3950 0%, #0c1e34 80%)',
        aspectRatio: '1.6 / 1',
        border: '1px solid rgba(127,183,194,0.15)',
      }}>
        {/* Grid */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 100 60" preserveAspectRatio="none">
          <defs>
            <pattern id="mapgrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(127,183,194,0.1)" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="60" fill="url(#mapgrid)"/>
          {/* approach paths */}
          <path d="M 28 18 Q 38 24 50 30" stroke={C.sage} strokeWidth="0.5" strokeDasharray="1 1" fill="none" opacity="0.6"/>
          <path d="M 80 13 Q 65 20 50 30" stroke={C.sage} strokeWidth="0.5" strokeDasharray="1 1" fill="none" opacity="0.6"/>
          <path d="M 78 53 Q 65 42 50 30" stroke={C.amber} strokeWidth="0.5" strokeDasharray="1 1" fill="none" opacity="0.6"/>
        </svg>

        {/* User */}
        <MapDot x={50} y={50} color={C.aurora} label="You" pulse big />
        <MapDot x={sarah.x} y={sarah.y} color={C.sage} label="Sarah · 400m" />
        <MapDot x={responder.x} y={responder.y} color={C.sage} label="Responder · 280m" />
        <MapDot x={sec.x} y={sec.y} color={C.amber} label="Security · 510m" />
      </div>
    </DarkCard>
  );
};

const MapDot = ({ x, y, color, label, pulse, big }) => (
  <div style={{
    position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transition: 'left 1.2s linear, top 1.2s linear',
  }}>
    {pulse && (
      <div style={{
        position: 'absolute', width: 28, height: 28, borderRadius: '50%',
        border: `1px solid ${color}`, animation: 'sonar-ping 2.4s ease-out infinite',
      }} />
    )}
    <div style={{
      width: big ? 14 : 10, height: big ? 14 : 10, borderRadius: 999,
      background: color, border: '2px solid rgba(255,255,255,0.9)',
      boxShadow: `0 0 12px ${color}`,
    }} />
    <div style={{
      marginTop: 4, fontFamily: T.mono, fontSize: 8.5, color: '#fff',
      background: 'rgba(11,23,51,0.7)', padding: '2px 5px', borderRadius: 4,
      whiteSpace: 'nowrap', letterSpacing: '0.04em',
    }}>{label}</div>
  </div>
);

// ─── Responder Map (Sub-state C) ───
const ResponderMap = ({ distance, arrived }) => (
  <DarkCard style={{ padding: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <DarkCardTitle style={{ margin: 0 }}>Navigation</DarkCardTitle>
      <div style={{ fontFamily: T.mono, fontSize: 9.5, color: C.aurora, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        ETA · {Math.max(1, Math.round(distance / 80))} min
      </div>
    </div>
    <div style={{
      position: 'relative', borderRadius: 14, overflow: 'hidden',
      background: 'radial-gradient(circle at 25% 75%, #1a3950 0%, #0c1e34 80%)',
      aspectRatio: '1.5 / 1',
      border: '1px solid rgba(127,183,194,0.15)',
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 100 60" preserveAspectRatio="none">
        <defs>
          <pattern id="mapgrid2" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(127,183,194,0.1)" strokeWidth="0.3"/>
          </pattern>
        </defs>
        <rect width="100" height="60" fill="url(#mapgrid2)"/>
        <path d="M 18 50 Q 35 30 60 22" stroke={C.aurora} strokeWidth="0.7" strokeDasharray="2 1" fill="none"/>
      </svg>

      {/* Fuzzy radius around victim */}
      <div style={{
        position: 'absolute', left: '60%', top: '36%', transform: 'translate(-50%, -50%)',
        width: 70, height: 70, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.coral}44 0%, transparent 70%)`,
      }} />
      {/* Victim dot */}
      <MapDot x={60} y={36} color={C.coral} label="Help needed" pulse big />
      {/* You */}
      <MapDot x={18} y={84} color={C.aurora} label={arrived ? "You · arrived" : `You · ${distance}m`} />
      {/* Arrow */}
      <div style={{
        position: 'absolute', top: 8, right: 10,
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(127,183,194,0.18)',
        border: '1px solid rgba(127,183,194,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.aurora,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(45deg)' }}>
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
      </div>
    </div>
    <div style={{
      marginTop: 10, fontFamily: T.text, fontSize: 11.5, color: '#8ABBC7',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span>Walking · estimated arrival</span>
      <span style={{ color: '#fff', fontFamily: T.mono, fontWeight: 500 }}>{arrived ? 'On scene' : `${distance}m`}</span>
    </div>
  </DarkCard>
);

// ─── Training modal ───
const TrainingModal = ({ open, onClose, toast }) => {
  if (!open) return null;
  const modules = [
    { title: 'Trauma-Informed Approach', done: true },
    { title: 'De-escalation Basics', done: true },
    { title: 'Emergency Protocols', done: true },
    { title: 'Self-Care for Responders', done: false },
  ];
  const completed = modules.filter(m => m.done).length;
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <IShield size={20} color={C.tidewater} />
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, letterSpacing: '-0.02em' }}>Responder Training</div>
      </div>
      <div style={{ fontFamily: T.text, fontSize: 12.5, color: C.graphite, lineHeight: 1.5, marginBottom: 14, textWrap: 'pretty' }}>
        Complete trauma-informed response training to become a verified responder.
      </div>
      {/* Progress bar */}
      <div style={{
        height: 6, background: C.border, borderRadius: 99, overflow: 'hidden',
        marginBottom: 12,
      }}>
        <div style={{
          width: `${(completed / modules.length) * 100}%`, height: '100%',
          background: `linear-gradient(90deg, ${C.tidewater}, ${C.aurora})`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 11, color: C.slate, letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>
        {completed} of {modules.length} complete
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {modules.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 10,
            background: m.done ? `${C.sage}1A` : C.paper2,
            border: `1px solid ${m.done ? `${C.sage}33` : C.border}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 999,
              background: m.done ? C.sageDeep : '#fff',
              color: m.done ? '#fff' : C.slate,
              border: m.done ? 'none' : `1.5px solid ${C.fog}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontFamily: T.mono, fontSize: 11, fontWeight: 600,
            }}>{m.done ? <ICheck size={12} strokeWidth={3} /> : i + 1}</div>
            <div style={{ flex: 1, fontFamily: T.text, fontSize: 13, fontWeight: 500, color: m.done ? C.sageDeep : C.midnight }}>{m.title}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button onClick={() => { onClose(); toast('Starting Module 4…', 'info'); }}>Start Module 4</Button>
      </div>
    </Modal>
  );
};

// ─── SOS button ───
const SOSButton = ({ holdProgress, holding, onStart, onRelease }) => {
  const r = 78;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - holdProgress);
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!holding && (
        <>
          <div style={{
            position: 'absolute', inset: 16, borderRadius: '50%',
            background: 'rgba(224,138,122,0.18)',
            animation: 'pulse-ring-slow 3s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 16, borderRadius: '50%',
            background: 'rgba(224,138,122,0.12)',
            animation: 'pulse-ring-slow 3s ease-out 1.5s infinite',
          }} />
        </>
      )}
      {holding && (
        <svg width="200" height="200" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
          <circle cx="100" cy="100" r={r} fill="none" stroke="#fff" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}/>
        </svg>
      )}
      <button
        onMouseDown={onStart} onMouseUp={onRelease} onMouseLeave={onRelease}
        onTouchStart={onStart} onTouchEnd={onRelease}
        className={!holding ? 'sos-ambient' : ''}
        style={{
          width: 144, height: 144, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 25%, #f0a392 0%, ${C.coral} 60%, ${C.coralDeep} 100%)`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.display, fontSize: 32, fontWeight: 600,
          letterSpacing: '0.04em',
          boxShadow: holding
            ? `0 0 60px ${C.coral}, inset 0 4px 12px rgba(0,0,0,0.2)`
            : undefined,
          transform: holding ? 'scale(0.97)' : 'scale(1)',
          transition: 'transform 0.15s ease, box-shadow 0.3s ease',
          userSelect: 'none',
        }}
      >
        {holding ? Math.max(1, Math.ceil((1 - holdProgress) * 3)) : 'SOS'}
      </button>
    </div>
  );
};

const ActiveSonar = () => (
  <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {[0, 0.6, 1.2].map((d, i) => (
      <div key={i} style={{
        position: 'absolute', width: 60, height: 60, borderRadius: '50%',
        border: `2px solid ${C.aurora}`,
        animation: `sonar-ping 2.4s ease-out ${d}s infinite`,
      }} />
    ))}
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      background: `radial-gradient(circle, ${C.aurora} 0%, ${C.tidewater} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', boxShadow: `0 0 30px ${C.aurora}`,
    }}>
      <IMapPin size={24} />
    </div>
  </div>
);

const DarkCard = ({ children, style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(127,183,194,0.18)',
    borderRadius: 16, padding: 16,
    backdropFilter: 'blur(20px)',
    ...style,
  }}>{children}</div>
);

const DarkCardTitle = ({ children, style = {} }) => (
  <div style={{
    fontFamily: T.text, fontSize: 14, fontWeight: 600, color: '#fff',
    marginBottom: 12, letterSpacing: '-0.005em', ...style,
  }}>{children}</div>
);

const StatusChip = ({ icon: I, label, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <I size={13} color={color} /> {label}
  </div>
);

const DarkToggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{
    width: 40, height: 22, borderRadius: 999,
    background: on ? C.aurora : 'rgba(127,183,194,0.18)',
    position: 'relative', cursor: 'pointer',
    transition: 'background 0.2s ease',
  }}>
    <div style={{
      position: 'absolute', top: 2, left: on ? 20 : 2,
      width: 18, height: 18, borderRadius: '50%',
      background: '#fff',
      transition: 'left 0.2s ease',
    }} />
  </div>
);

const Contact = ({ name, rel, badge, sub }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid rgba(127,183,194,0.10)',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 999,
      background: 'linear-gradient(135deg, rgba(127,183,194,0.3), rgba(127,183,194,0.1))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.text, fontSize: 12, fontWeight: 600, color: '#fff',
      flexShrink: 0,
    }}>{name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{name}</div>
      <div style={{ fontFamily: T.text, fontSize: 11, color: '#8ABBC7' }}>{rel}{sub ? ` · ${sub}` : ''}</div>
    </div>
    <Pill color={badge.color} bg={`${badge.color}22`}>{badge.label}</Pill>
  </div>
);

const Responder = ({ name, status, dot, badge }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid rgba(127,183,194,0.08)',
  }}>
    <div style={{ position: 'relative', width: 12, height: 12, flexShrink: 0 }}>
      {dot.check ? (
        <ICheckCircle size={14} color={C.sage} />
      ) : (
        <div style={{
          width: 10, height: 10, borderRadius: 999, background: dot.color,
          animation: dot.pulse ? 'pulse-dot 1.2s ease-in-out infinite' : undefined,
        }} />
      )}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{name}</div>
        {badge && <Pill color={C.sage} bg="rgba(148,183,158,0.22)">{badge}</Pill>}
      </div>
      <div style={{ fontFamily: T.text, fontSize: 11.5, color: '#8ABBC7' }}>{status}</div>
    </div>
  </div>
);

Object.assign(window, { SafePulseScreen });
