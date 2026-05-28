// report.jsx — Sub-state D: Generated Report View

const DocReport = ({ report, onEdit, onClose, toast }) => {
  const [tab, setTab] = React.useState('timeline');
  const [rating, setRating] = React.useState(0);
  const [savedToVault, setSavedToVault] = React.useState(false);
  const [exportModal, setExportModal] = React.useState(null);

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: IClock },
    { id: 'evidence', label: 'Evidence', icon: IFileText },
    { id: 'policy', label: 'Policy', icon: IShield },
    { id: 'full', label: 'Full Report', icon: IFileText },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, background: C.paper,
      paddingTop: 56, display: 'flex', flexDirection: 'column',
      animation: 'fade-in 0.3s ease-out',
    }}>
      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 6px' }}>
        <button onClick={onClose} style={{
          width: 38, height: 38, borderRadius: 999, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.graphite, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}><IArrowLeft size={18} /></button>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.2em', color: C.slate, textTransform: 'uppercase' }}>Report · Draft</div>
        <button onClick={onEdit} style={{
          width: 38, height: 38, borderRadius: 999, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.graphite, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}><ISettings size={16} /></button>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {/* Header card */}
        <div style={{ padding: '14px 20px 0' }}>
          <Card style={{ padding: 18, borderTop: `4px solid ${C.twilight}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Pill color={C.amber} bg="rgba(212,162,74,0.18)">Draft</Pill>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: C.slate, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Generated · {new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>
            <h2 style={{
              fontFamily: T.display, fontSize: 22, fontWeight: 500,
              color: C.midnight, letterSpacing: '-0.025em', lineHeight: 1.15,
              textWrap: 'balance',
            }}>{report.title}</h2>

            <div style={{
              marginTop: 16, paddingTop: 14,
              borderTop: `1px dashed ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: T.text, fontSize: 12.5, color: C.slate }}>How accurate is this?</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)} className="star-btn">
                    <IStar size={20} strokeWidth={1.6} style={{
                      color: n <= rating ? C.amber : C.fog,
                      fill: n <= rating ? C.amber : 'none',
                    }} />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="chip-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '18px 20px 14px' }}>
          {tabs.map(t => {
            const I = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="tap-scale" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 999,
                background: active ? C.tidewater : '#fff',
                color: active ? '#fff' : C.graphite,
                border: `1px solid ${active ? C.tidewater : C.border}`,
                fontFamily: T.text, fontSize: 13, fontWeight: 600,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                <I size={13} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ padding: '0 20px' }}>
          {tab === 'timeline' && <TimelineTab events={report.timeline} flags={report.policy_flags} />}
          {tab === 'evidence' && <EvidenceTab items={report.evidence} />}
          {tab === 'policy' && <PolicyTab flags={report.policy_flags} wellness={report.wellness_assessment} />}
          {tab === 'full' && <FullReportTab summary={report.report_summary} onExport={setExportModal} />}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', gap: 10, padding: '12px 20px 24px',
        background: 'rgba(245,239,228,0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${C.borderSoft}`,
        zIndex: 40,
      }}>
        <Button variant="secondary" onClick={onEdit}>Edit Report</Button>
        <Button variant="sage" icon={ILock} onClick={() => setSavedToVault(true)}>Save to Vault</Button>
      </div>

      {/* SafeVault success */}
      {savedToVault && (
        <div onClick={() => { setSavedToVault(false); onClose(); }} style={{
          position: 'absolute', inset: 0, zIndex: 95,
          background: 'rgba(11,23,51,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'backdrop-in 0.2s ease-out',
        }}>
          <div style={{
            background: '#fff', borderRadius: 22, padding: 30,
            textAlign: 'center', maxWidth: 280,
            animation: 'modal-in 0.25s ease-out',
          }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: `${C.sage}33`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14, position: 'relative',
            }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <path d="M 24 6 L 38 12 L 38 24 Q 38 36 24 42 Q 10 36 10 24 L 10 12 Z"
                  fill="none" stroke={C.sageDeep} strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M 16 24 L 22 30 L 32 18" stroke={C.sageDeep} strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round" fill="none"
                  strokeDasharray="40" strokeDashoffset="40"
                  style={{ animation: 'draw-check 0.5s ease-out 0.2s forwards' }}/>
              </svg>
            </div>
            <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 500, color: C.midnight, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Encrypted and saved.
            </div>
            <div style={{ fontFamily: T.text, fontSize: 14, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
              Your report is now in SafeVault. AES-256 encrypted, only readable by you.
            </div>
            <Button variant="sage" onClick={() => { setSavedToVault(false); onClose(); }}>Done</Button>
          </div>
        </div>
      )}

      {/* Export modals */}
      <Modal open={exportModal === 'pdf'} onClose={() => setExportModal(null)}>
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, marginBottom: 8 }}>Export as PDF?</div>
        <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
          A redacted PDF will be generated. You'll be asked to choose which evidence to include.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setExportModal(null)}>Cancel</Button>
          <Button variant="deep" onClick={() => { setExportModal(null); toast('PDF ready in SafeVault', 'success'); }}>Export</Button>
        </div>
      </Modal>
      <Modal open={exportModal === 'share'} onClose={() => setExportModal(null)}>
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, marginBottom: 8 }}>Share with an advocate?</div>
        <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
          A view-only secure link will be sent to your selected advocate. They cannot download or forward.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setExportModal(null)}>Cancel</Button>
          <Button onClick={() => { setExportModal(null); toast('Link sent · expires in 72h', 'success'); }}>Share</Button>
        </div>
      </Modal>
      <Modal open={exportModal === 'submit'} onClose={() => setExportModal(null)} danger>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <IAlertTriangle size={20} color={C.coralDeep} />
          <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight }}>Confirm submission</div>
        </div>
        <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
          You'll be asked to verify your identity. Once submitted, this report becomes part of an official institutional record.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setExportModal(null)}>Wait</Button>
          <Button variant="coral" onClick={() => { setExportModal(null); toast('Identity verification queued', 'info'); }}>Continue</Button>
        </div>
      </Modal>
    </div>
  );
};

// ─── Timeline tab ───
const TimelineTab = ({ events = [], flags = [] }) => {
  // Map events to flag severity by event keywords (simple heuristic)
  const eventFlag = (event) => {
    const text = (event.event || '').toLowerCase();
    const f = flags.find(f => text.includes((f.violation_type || '').toLowerCase().split(' ')[0]));
    return f?.severity;
  };
  return (
    <div style={{ position: 'relative', paddingLeft: 8 }}>
      <div style={{
        position: 'absolute', left: 76, top: 8, bottom: 8,
        width: 2, background: C.border,
      }} />
      {events.map((e, i) => {
        const sev = eventFlag(e);
        const borderColor = sev === 'high' ? C.coral : sev === 'medium' ? C.amber : C.border;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, position: 'relative' }}>
            <div style={{ width: 56, textAlign: 'right', flexShrink: 0, paddingTop: 12 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10.5, fontWeight: 600, color: C.twilight, letterSpacing: '0.05em' }}>{e.date}</div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: C.slate, marginTop: 2 }}>{e.time}</div>
            </div>
            <div style={{
              width: 12, height: 12, borderRadius: 999,
              background: sev === 'high' ? C.coral : sev === 'medium' ? C.amber : C.tidewater,
              marginTop: 16, flexShrink: 0,
              border: '3px solid #FBF7EE',
              boxShadow: '0 0 0 1px rgba(11,23,51,0.1)',
            }} />
            <div style={{
              flex: 1, background: '#fff', borderRadius: 14,
              padding: '12px 14px', borderLeft: `3px solid ${borderColor}`,
              boxShadow: '0 1px 6px rgba(11,23,51,0.04)',
            }}>
              <div style={{ fontFamily: T.text, fontSize: 14, color: C.midnight, lineHeight: 1.5, textWrap: 'pretty' }}>{e.event}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Evidence tab ───
const EvidenceTab = ({ items = [] }) => {
  const iconFor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('photo') || t.includes('image')) return IImage;
    if (t.includes('voice') || t.includes('audio')) return IMic;
    if (t.includes('mess') || t.includes('text')) return IMessageCircle;
    if (t.includes('screen')) return ICamera;
    return IFileText;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, i) => {
        const I = iconFor(it.type);
        const uploaded = (it.status || '').toLowerCase() === 'uploaded';
        return (
          <Card key={i} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: uploaded ? `${C.sageDeep}1A` : `${C.tidewater}1A`,
                color: uploaded ? C.sageDeep : C.tidewater,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><I size={18} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontFamily: T.text, fontSize: 13, fontWeight: 600, color: C.midnight }}>{it.type}</div>
                  <Pill color={uploaded ? C.sageDeep : C.tidewater}>{it.status}</Pill>
                </div>
                <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.45, textWrap: 'pretty' }}>{it.description}</div>
                {!uploaded && (
                  <div style={{
                    marginTop: 8, padding: '6px 10px',
                    background: `${C.tidewater}10`, borderRadius: 8,
                    fontFamily: T.text, fontSize: 11.5, color: C.tidewater, fontWeight: 500,
                  }}>+ Consider uploading this to strengthen your report</div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// ─── Policy tab ───
const PolicyTab = ({ flags = [], wellness }) => {
  const sevColor = { high: C.coral, medium: C.amber, low: C.tidewater };
  return (
    <>
      <div style={{
        padding: '12px 14px', borderRadius: 12,
        background: 'rgba(224,138,122,0.10)',
        borderLeft: `3px solid ${C.coral}`,
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <IInfo size={16} color={C.coralDeep} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontFamily: T.text, fontSize: 12.5, color: C.coralDeep, lineHeight: 1.5, textWrap: 'pretty' }}>
            These are AI-identified flags for your review. They are <strong>not legal determinations</strong>.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {flags.map((f, i) => {
          const sev = (f.severity || 'low').toLowerCase();
          return (
            <Card key={i} leftBorder={sevColor[sev]} style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Pill color={sevColor[sev]}>{sev.toUpperCase()}</Pill>
                <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight, textWrap: 'pretty' }}>{f.violation_type}</div>
              </div>
              <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, textWrap: 'pretty' }}>{f.description}</div>
            </Card>
          );
        })}
      </div>

      {wellness && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: T.text, fontSize: 12.5, fontWeight: 600, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Wellness assessment</div>
          <Card leftBorder={C.lavenderDeep} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Pill color={C.lavenderDeep}>{(wellness.risk_level || '').toUpperCase()} RISK</Pill>
            </div>
            <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 10, textWrap: 'pretty' }}>{wellness.emotional_state}</div>
            <div style={{ fontFamily: T.text, fontSize: 12, fontWeight: 600, color: C.lavenderDeep, marginBottom: 6 }}>Recommended next steps</div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {(wellness.recommended_actions || []).map((a, i) => (
                <li key={i} style={{ fontFamily: T.text, fontSize: 13, color: C.graphite, lineHeight: 1.5, marginBottom: 4 }}>{a}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
};

// ─── Full report tab ───
const FullReportTab = ({ summary, onExport }) => (
  <div>
    <Card style={{ padding: 18 }}>
      {(summary || '').split(/\n\n+/).map((para, i) => (
        <p key={i} style={{
          fontFamily: T.text, fontSize: 14.5, color: C.ink, lineHeight: 1.65,
          marginBottom: 12, textWrap: 'pretty',
        }}>{para}</p>
      ))}
    </Card>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
      <Button variant="deep" icon={IFileText} onClick={() => onExport('pdf')}>Export as PDF</Button>
      <Button variant="secondary" icon={IUsers} onClick={() => onExport('share')}>Share with Advocate</Button>
      <Button variant="outline" icon={IBuilding} onClick={() => onExport('submit')}>Submit to Institution</Button>
      <div style={{ fontFamily: T.text, fontSize: 11.5, color: C.slate, textAlign: 'center', lineHeight: 1.45 }}>
        Institutional submission requires identity verification.
      </div>
    </div>
  </div>
);

Object.assign(window, { DocReport });
