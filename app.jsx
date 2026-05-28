// app.jsx — Main SafeTrace AI app: screen routing + Anthropic AI integration

const SYSTEM_DOCUMENT = `You are SafeTrace AI, an incident documentation assistant. The user is describing a difficult experience involving harassment, assault, intimidation, or another distressing event. Your job is to take their raw, potentially disorganized account and produce a structured incident analysis. Respond ONLY in valid JSON with exactly these keys: title (string — a short professional title for this incident), timeline (array of objects with keys: date, time, event — reconstruct chronological events from the account, use reasonable inferred dates/times if not specified, format dates as "Month Day" and times as "HH:MM AM/PM"), evidence (array of objects with keys: type, description, status — identify all evidence mentioned or implied, status should be "Uploaded" or "Recommended"), policy_flags (array of objects with keys: violation_type, description, severity — identify potential policy violations like harassment, intimidation, coercion, retaliation, bullying, discrimination, consent violations — severity must be "high" or "medium" or "low"), report_summary (string — a professional 3-4 paragraph incident report summary written in third person formal language suitable for institutional submission), wellness_assessment (object with keys: emotional_state as a string, risk_level as "low" or "moderate" or "high", recommended_actions as an array of strings). Be thorough, professional, and empathetic in your analysis. Do not include any text outside the JSON object.`;

const SYSTEM_SAFECONNECT = `You are SafeConnect, the emotional support guide within SafeTrace AI. You are NOT a therapist or counselor. Your role: 1) Listen with genuine warmth and validation. 2) Help the user feel heard and understood. 3) Gently ask one follow-up question to help them process. 4) If you detect signs of crisis (self-harm mentions, hopelessness, acute danger), immediately prioritize safety — say something like "I want to make sure you're safe. Would you like me to connect you with a crisis counselor right now?". 5) Periodically remind them you can connect them with a real professional. Keep responses to 2-3 sentences. Be warm, human, concise. Never diagnose, never give clinical advice, never say "as an AI". Speak like a caring, wise friend.`;

// ─── AI call helpers ───
async function generateReport(text) {
  const prompt = `${SYSTEM_DOCUMENT}\n\nUSER ACCOUNT:\n"""\n${text}\n"""\n\nReturn ONLY the JSON object.`;
  const resp = await window.claude.complete(prompt);
  // Extract JSON (handle ```json fences just in case)
  let s = String(resp).trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) s = fence[1];
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start >= 0 && end > start) s = s.slice(start, end + 1);
  return JSON.parse(s);
}

async function chatReply(history) {
  // Pass conversation history directly - the API handles the system prompt separately
  const reply = await window.claude.complete({ messages: history });
  return String(reply).trim();
}

// ─── Fallback report (if AI unavailable, won't be shown unless API errors) ───
const FALLBACK_REPORT = {
  title: 'Incident Report — Pending Review',
  timeline: [{ date: 'May 26', time: '10:00 AM', event: 'Incident described; details to be reconstructed.' }],
  evidence: [{ type: 'Account', description: 'First-person account from the reporter.', status: 'Uploaded' }],
  policy_flags: [{ violation_type: 'Pending Review', description: 'AI reconstruction unavailable.', severity: 'medium' }],
  report_summary: 'A report could not be reconstructed at this time. Please try again or contact your case advocate directly.',
  wellness_assessment: { emotional_state: 'Distressed', risk_level: 'moderate', recommended_actions: ['Reach out to a trusted contact', 'Try again in a moment'] },
};

// ─── Main App ───
const App = () => {
  // Screen flow
  const [phase, setPhase] = React.useState('splash'); // splash | onboarding | main
  const [tab, setTab] = React.useState('home');

  // Sub-states
  const [docState, setDocState] = React.useState('start'); // start | session | processing | report
  const [docInitial, setDocInitial] = React.useState('');
  const [docText, setDocText] = React.useState('');
  const [docReport, setDocReportData] = React.useState(null);
  const [docError, setDocError] = React.useState(null);

  const [chatRef] = React.useState({ send: null });
  // sendChatMessage exposed via ref so TalkTab can call it
  chatRef.send = async (history) => chatReply(history);

  const [showTip, setShowTip] = React.useState(true);
  const [toastState, setToastState] = React.useState({ message: '', kind: 'success' });

  // Nearby community alert (simulated)
  const [nearbyAlert, setNearbyAlert] = React.useState({ distance: 400, minutesAgo: 2, responders: 3 });
  const [safePulseMode, setSafePulseMode] = React.useState('ready'); // ready | responding | active

  const toast = (message, kind = 'success') => setToastState({ message, kind });

  const respondToNearby = () => {
    setSafePulseMode('responding');
    setTab('safepulse');
    setNearbyAlert(null); // cleared once user starts responding
  };

  // ── Document flow handlers ──
  const startDoc = () => { setDocInitial('SPEAK'); setDocState('session'); };
  const startTypingDoc = () => { setDocInitial('TYPE'); setDocState('session'); };
  const processDoc = async (text, evidence) => {
    setDocText(text);
    setDocError(null);
    setDocState('processing');
    try {
      const report = await generateReport(text);
      // Merge user-attached evidence into the AI-evidence list (mark as Uploaded)
      if (evidence?.length) {
        const userEv = evidence.map(e => ({ type: e.label, description: e.filename, status: 'Uploaded' }));
        report.evidence = [...userEv, ...(report.evidence || [])];
      }
      setDocReportData(report);
      setDocState('report');
    } catch (e) {
      console.error('Report generation failed:', e);
      setDocError('The AI didn\'t respond in the expected format. Please try again — your draft is preserved.');
    }
  };
  const retryProcess = () => { setDocError(null); processDoc(docText, []); };
  const cancelProcess = () => { setDocError(null); setDocState('session'); };
  const finishReport = () => { setDocState('start'); setDocReportData(null); setDocText(''); };

  // ── Chat handler ──
  const sendChatMessage = async (history) => {
    return await chatReply(history);
  };

  // ── Tab change resets the doc flow if leaving ──
  const switchTab = (t) => {
    if (t !== 'document') setDocState('start');
    if (t !== 'safepulse') setSafePulseMode('ready');
    setTab(t);
  };

  // ── Phase transitions ──
  if (phase === 'splash') {
    return (
      <DeviceWrap>
        <SplashScreen onDone={() => setPhase('onboarding')} />
      </DeviceWrap>
    );
  }
  if (phase === 'onboarding') {
    return (
      <DeviceWrap>
        <OnboardingScreen onDone={() => setPhase('main')} />
      </DeviceWrap>
    );
  }

  return (
    <DeviceWrap dark={tab === 'safepulse'}>
      {/* Screens */}
      {tab === 'home' && (
        <HomeScreen
          onTab={switchTab}
          onOpenReports={() => switchTab('profile')}
          onDismissTip={() => setShowTip(false)}
          showTip={showTip}
          toast={toast}
          nearbyAlert={nearbyAlert}
          onRespondToAlert={respondToNearby}
        />
      )}

      {tab === 'document' && docState === 'start' && (
        <DocStartScreen onStart={startDoc} onText={startTypingDoc} onUpload={startDoc} />
      )}
      {tab === 'document' && docState === 'session' && (
        <DocSession
          initialText={docInitial}
          onCancel={() => setDocState('start')}
          onProcess={processDoc}
          toast={toast}
        />
      )}
      {tab === 'document' && docState === 'processing' && (
        <DocProcessing error={docError} onRetry={retryProcess} onCancel={cancelProcess} />
      )}
      {tab === 'document' && docState === 'report' && docReport && (
        <DocReport
          report={docReport}
          onEdit={() => setDocState('session')}
          onClose={finishReport}
          toast={toast}
        />
      )}

      {tab === 'safepulse' && (
        <SafePulseScreen
          toast={toast}
          nearbyAlert={nearbyAlert}
          onClearNearbyAlert={() => setNearbyAlert(null)}
          initialMode={safePulseMode}
          onModeChange={setSafePulseMode}
        />
      )}

      {tab === 'wellness' && (
        <WellnessScreen toast={toast} chatRef={chatRef} />
      )}

      {tab === 'community' && (
        <CommunityScreen toast={toast} />
      )}

      {tab === 'profile' && (
        <ProfileScreen toast={toast} />
      )}

      {/* Tab bar — hidden during full-screen sub-states */}
      {!(tab === 'document' && (docState === 'session' || docState === 'processing' || docState === 'report')) && (
        <TabBar
          active={tab} onTab={switchTab}
          onSOS={() => switchTab('safepulse')}
          alertBadge={nearbyAlert ? '!' : null}
        />
      )}

      <Toast
        message={toastState.message}
        kind={toastState.kind}
        onClose={() => setToastState({ message: '', kind: toastState.kind })}
      />
    </DeviceWrap>
  );
};

// ─── Device wrapper (iPhone-shaped frame) ───
const DeviceWrap = ({ children, dark = false }) => {
  const [scale, setScale] = React.useState(1);
  const w = 390, h = 844;

  React.useEffect(() => {
    const fit = () => {
      const padY = 80, padX = 80;
      const sx = (window.innerWidth - padX) / w;
      const sy = (window.innerHeight - padY) / h;
      setScale(Math.min(1, Math.min(sx, sy)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{
      transform: `scale(${scale})`, transformOrigin: 'center center',
      width: w, height: h, position: 'relative',
    }}>
      <div style={{
        width: w, height: h, borderRadius: 50, overflow: 'hidden',
        background: dark ? C.midnight : C.paper,
        position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 12px #0b0f15, 0 0 0 14px #1a1d24',
      }}>
        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 30px 0',
          color: dark ? '#fff' : C.midnight,
        }}>
          <div style={{ fontFamily: '-apple-system, system-ui', fontWeight: 600, fontSize: 15 }}>9:41</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="0.6"/><rect x="4.5" y="4" width="3" height="6" rx="0.6"/><rect x="9" y="2" width="3" height="8" rx="0.6"/><rect x="13.5" y="0" width="3" height="10" rx="0.6"/></svg>
            <svg width="15" height="11" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 3.2c2.3 0 4.4 0.9 5.9 2.4l1.1-1.1c-1.8-1.8-4.3-3-7-3s-5.2 1.2-7 3l1.1 1.1c1.5-1.5 3.6-2.4 5.9-2.4z"/><path d="M8.5 6.8c1.4 0 2.6 0.5 3.5 1.4l1.1-1.1c-1.3-1.2-2.9-2-4.6-2s-3.3 0.8-4.6 2l1.1 1.1c0.9-0.9 2.1-1.4 3.5-1.4z"/><circle cx="8.5" cy="10.5" r="1.3"/></svg>
            <svg width="24" height="11" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor"/><path d="M24 4.5V8.5c0.7-0.3 1.3-1.1 1.3-2s-0.6-1.7-1.3-2z" fill="currentColor" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 34, borderRadius: 22, background: '#000', zIndex: 51,
        }} />

        {/* Screen content */}
        {children}

        {/* Home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: 0, right: 0, zIndex: 60,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            width: 134, height: 5, borderRadius: 100,
            background: dark ? 'rgba(255,255,255,0.6)' : 'rgba(11,23,51,0.32)',
          }} />
        </div>
      </div>
    </div>
  );
};

// ─── Mount ───
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
