// profile.jsx — Profile, Settings, SafeVault, Trusted Contacts

const ProfileScreen = ({ toast }) => {
  const [toggles, setToggles] = React.useState({
    encryption: true,    // locked
    location: true,
    anonymous: false,
    reminders: true,
  });
  const [visibility, setVisibility] = React.useState('anonymous');
  const [destroyModal, setDestroyModal] = React.useState(false);
  const [destroyText, setDestroyText] = React.useState('');
  const [logoutModal, setLogoutModal] = React.useState(false);
  const [apiKeyModal, setApiKeyModal] = React.useState(false);
  const [apiKeyInput, setApiKeyInput] = React.useState(localStorage.getItem('ANTHROPIC_API_KEY') || '');

  const flip = (k) => setToggles(s => ({ ...s, [k]: !s[k] }));

  return (
    <div className="phone-scroll" style={{
      position: 'absolute', inset: 0, background: C.paper,
      paddingTop: 56, paddingBottom: 110, overflowY: 'auto',
      animation: 'fade-in 0.25s ease-out',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.tidewater}, ${C.twilight})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: T.display, fontSize: 30, fontWeight: 500,
          letterSpacing: '-0.025em',
          boxShadow: `0 12px 28px ${C.tidewater}55`,
          marginBottom: 12,
        }}>ST</div>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 500, color: C.midnight, letterSpacing: '-0.025em' }}>SafeTrace User</div>
        <div style={{ fontFamily: T.mono, fontSize: 12, color: C.slate, marginTop: 2, letterSpacing: '0.04em' }}>user@safetrace.ai</div>
        <button onClick={() => toast('Edit profile — coming up', 'info')} style={{
          marginTop: 10, padding: '6px 14px',
          background: 'rgba(43,122,140,0.10)', borderRadius: 999,
          fontFamily: T.text, fontSize: 12, fontWeight: 600, color: C.tidewater,
        }}>Edit Profile</button>
      </div>

      {/* SafeVault card */}
      <div style={{ padding: '8px 20px 0' }}>
        <Card style={{
          padding: 18,
          background: `linear-gradient(135deg, ${C.twilight} 0%, ${C.midnight} 100%)`,
          color: '#fff',
          borderLeft: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'rgba(127,183,194,0.18)', color: C.aurora,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><ILock size={16} /></div>
            <div>
              <div style={{ fontFamily: T.display, fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', color: '#fff' }}>SafeVault</div>
              <div style={{ fontFamily: T.text, fontSize: 11.5, color: 'rgba(127,183,194,0.8)', marginTop: 1 }}>Your encrypted evidence storage</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            <DarkPill>2 Reports</DarkPill>
            <DarkPill>5 Files</DarkPill>
            <DarkPill>AES-256</DarkPill>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => toast('Vault opened', 'info')} className="tap-scale" style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: C.aurora, color: C.midnight,
              fontFamily: T.text, fontSize: 13, fontWeight: 600,
            }}>Open Vault</button>
            <button onClick={() => toast('Export queued', 'info')} className="tap-scale" style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: 'rgba(255,255,255,0.10)', color: '#fff',
              border: '1px solid rgba(127,183,194,0.25)',
              fontFamily: T.text, fontSize: 13, fontWeight: 500,
            }}>Export All</button>
          </div>
          <button onClick={() => setDestroyModal(true)} style={{
            marginTop: 10, padding: '8px',
            color: C.coral, fontFamily: T.text, fontSize: 12, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%',
          }}><ITrash size={13} /> Emergency Destroy</button>
        </Card>
      </div>

      {/* Privacy & Security */}
      <SectionHeader title="Privacy & Security" />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ToggleRow icon={IShield} color={C.sageDeep}
          label="End-to-End Encryption"
          desc="Always active · cannot be disabled"
          locked />
        <ToggleRow icon={IMapPin} color={C.tidewater}
          label="Location Services"
          desc="Required for SafePulse"
          on={toggles.location} onToggle={() => flip('location')} />
        <ToggleRow icon={toggles.anonymous ? IEyeOff : IEye} color={C.lavenderDeep}
          label="Anonymous Mode"
          desc="Hide your identity from all reports"
          on={toggles.anonymous} onToggle={() => flip('anonymous')} />
        <ToggleRow icon={IBell} color={C.amber}
          label="Wellness Reminders"
          desc="Daily check-in notifications"
          on={toggles.reminders} onToggle={() => flip('reminders')} />
      </div>

      {/* AI Settings */}
      <SectionHeader title="AI Settings" />
      <div style={{ padding: '0 20px' }}>
        <Card style={{ padding: 16, background: `linear-gradient(135deg, rgba(183,168,220,0.12), #fff)`, borderLeft: `4px solid ${C.lavenderDeep}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: `linear-gradient(135deg, ${C.lavenderDeep}, ${C.lavender})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: `0 4px 12px ${C.lavenderDeep}44`,
            }}><IMessageCircle size={16} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight }}>Claude AI API Key</div>
              <div style={{ fontFamily: T.text, fontSize: 12, color: C.slate, marginTop: 1 }}>Required for SafeConnect & document analysis</div>
            </div>
          </div>
          <div style={{ fontFamily: T.text, fontSize: 13, color: C.graphite, lineHeight: 1.5, marginBottom: 12, textWrap: 'pretty' }}>
            Enter your Anthropic Claude API key to enable intelligent AI features.
          </div>
          <button onClick={() => setApiKeyModal(true)} className="tap-scale" style={{
            width: '100%', padding: '10px', borderRadius: 10,
            background: C.lavenderDeep, color: '#fff',
            fontFamily: T.text, fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <ISettings size={14} /> {localStorage.getItem('ANTHROPIC_API_KEY') ? 'Update API Key' : 'Set API Key'}
          </button>
          {localStorage.getItem('ANTHROPIC_API_KEY') && (
            <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 8, background: `linear-gradient(135deg, ${C.sage}22, ${C.sageDeep}11)`, fontFamily: T.text, fontSize: 12, color: C.sageDeep, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ICheck size={14} /> API key configured · SafeConnect AI ready
            </div>
          )}
        </Card>
      </div>

      {/* Responder Profile */}
      <SectionHeader title="Responder Profile" />
      <div style={{ padding: '0 20px' }}>
        <Card leftBorder={C.coral} style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <IShield size={16} color={C.coralDeep} />
            <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight, flex: 1 }}>SafePulse Responder</div>
            <Pill color={C.sageDeep}>VERIFIED ✓</Pill>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <Pill color={C.tidewater}>12 Responses</Pill>
            <Pill color={C.amber}>4.9 ★</Pill>
            <Pill color={C.slate}>6 mo active</Pill>
          </div>

          {/* Radius slider */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontFamily: T.text, fontSize: 12, fontWeight: 600, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Response Radius</div>
              <div style={{ fontFamily: T.mono, fontSize: 12, color: C.tidewater, fontWeight: 600 }}>1.0 km</div>
            </div>
            <input type="range" min="0.5" max="5" step="0.5" defaultValue="1"
              style={{ width: '100%', accentColor: C.tidewater }} />
          </div>

          {/* Availability */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: T.text, fontSize: 12, fontWeight: 600, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Availability</div>
            <AvailabilityGrid />
          </div>

          {/* Training */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontFamily: T.text, fontSize: 12, fontWeight: 600, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Training</div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: C.sageDeep, fontWeight: 600 }}>3 / 4</div>
            </div>
            <div style={{ height: 6, background: C.border, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: '75%', height: '100%', background: `linear-gradient(90deg, ${C.sage}, ${C.sageDeep})` }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { l: 'Trauma-Informed Approach', d: true },
                { l: 'De-escalation Basics', d: true },
                { l: 'Emergency Protocols', d: true },
                { l: 'Self-Care for Responders', d: false },
              ].map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 0',
                  fontFamily: T.text, fontSize: 12.5,
                  color: m.d ? C.sageDeep : C.midnight,
                }}>
                  {m.d ? <ICheckCircle size={13} color={C.sageDeep} /> : <div style={{ width: 13, height: 13, borderRadius: 999, border: `1.5px solid ${C.fog}` }} />}
                  <div style={{ flex: 1, fontWeight: m.d ? 500 : 600 }}>{m.l}</div>
                  {!m.d && <button onClick={() => toast('Starting module…', 'info')} style={{
                    color: C.tidewater, fontFamily: T.text, fontSize: 11.5, fontWeight: 600,
                  }}>Start</button>}
                </div>
              ))}
            </div>
          </div>

          {/* Badge */}
          <div style={{
            marginTop: 14, padding: 14, borderRadius: 14,
            background: `linear-gradient(135deg, ${C.coralDeep} 0%, ${C.twilight} 90%)`,
            color: '#fff', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><IShield size={22} /></div>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 9.5, color: C.aurora, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Responder badge</div>
                <div style={{ fontFamily: T.display, fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' }}>Verified · Tier II</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Community Safety Map */}
      <SectionHeader title="Community Safety Map" />
      <div style={{ padding: '0 20px' }}>
        <Card leftBorder={C.tidewater} style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <IMapPin size={16} color={C.tidewater} />
            <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight }}>Anonymised safety insights</div>
          </div>
          <div style={{ fontFamily: T.text, fontSize: 12.5, color: C.graphite, lineHeight: 1.5, marginBottom: 12, textWrap: 'pretty' }}>
            Crowd-sourced from this area. No individual incident is identifiable.
          </div>

          {/* Map */}
          <SafetyMap />

          {/* Legend */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            marginTop: 10, padding: '8px 10px',
            background: C.paper2, borderRadius: 10,
          }}>
            <LegendDot color={C.sage} label="Safer" />
            <LegendDot color={C.amber} label="Moderate" />
            <LegendDot color={C.coral} label="Elevated" />
          </div>

          {/* Time filters */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {['Past Week', 'Past Month', 'Past 6 Months'].map((p, i) => (
              <button key={p} onClick={() => toast(`Filter: ${p}`, 'info')} className="tap-scale" style={{
                flex: 1, padding: '7px',
                borderRadius: 999,
                background: i === 1 ? `${C.tidewater}1A` : '#fff',
                color: i === 1 ? C.tidewater : C.graphite,
                border: `1px solid ${i === 1 ? C.tidewater : C.border}`,
                fontFamily: T.text, fontSize: 11.5, fontWeight: i === 1 ? 600 : 500,
              }}>{p}</button>
            ))}
          </div>

          <button onClick={() => toast('Anonymous flag form opened', 'info')} className="tap-scale" style={{
            marginTop: 12, width: '100%', padding: '10px',
            background: 'rgba(43,122,140,0.10)',
            color: C.tidewater, borderRadius: 12,
            fontFamily: T.text, fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><IAlertTriangle size={14} /> Report an Unsafe Area</button>
        </Card>
      </div>

      {/* Visibility */}
      <SectionHeader title="Default Visibility" />
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {[
            { id: 'anonymous', label: 'Anonymous', icon: IEyeOff, desc: 'Reports submit with no identifying info. Only you can re-link them.' },
            { id: 'trusted', label: 'Trusted Only', icon: IUsers, desc: 'Only your trusted contacts can see new submissions.' },
            { id: 'institutional', label: 'Institutional', icon: IShield, desc: 'Linked to your verified institutional record.' },
          ].map(v => {
            const I = v.icon;
            const active = visibility === v.id;
            return (
              <button key={v.id} onClick={() => setVisibility(v.id)} className="tap-scale" style={{
                flex: 1, padding: '10px 8px', borderRadius: 12,
                background: active ? 'rgba(43,122,140,0.10)' : '#fff',
                border: `1.5px solid ${active ? C.tidewater : C.borderSoft}`,
                color: active ? C.tidewater : C.graphite,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                fontFamily: T.text, fontSize: 11.5, fontWeight: active ? 600 : 500,
              }}>
                <I size={16} />
                {v.label}
              </button>
            );
          })}
        </div>
        <div style={{
          fontFamily: T.text, fontSize: 12, color: C.slate,
          padding: '8px 12px', background: '#fff', borderRadius: 10,
          border: `1px solid ${C.borderSoft}`, lineHeight: 1.5, textWrap: 'pretty',
        }}>
          {[
            { id: 'anonymous', desc: 'Reports submit with no identifying info. Only you can re-link them.' },
            { id: 'trusted', desc: 'Only your trusted contacts can see new submissions.' },
            { id: 'institutional', desc: 'Linked to your verified institutional record.' },
          ].find(v => v.id === visibility).desc}
        </div>
      </div>

      {/* Trusted Contacts */}
      <SectionHeader title="Trusted Contacts" action="+ Add" onAction={() => toast('Add contact wizard', 'info')} />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ContactCard initials="SM" name="Sarah M." rel="Best Friend" perms={[{ l: 'SafePulse', c: C.coral }, { l: 'Reports', c: C.tidewater }, { l: 'Emergency', c: C.sageDeep }]} onClick={() => toast('Edit Sarah M.', 'info')} />
        <ContactCard initials="JK" name="Dr. James K." rel="Campus Counsellor" perms={[{ l: 'Reports', c: C.tidewater }, { l: 'Wellness', c: C.lavenderDeep }]} onClick={() => toast('Edit Dr. James K.', 'info')} />
        <ContactCard initials="CS" name="Campus Security" rel="Institutional" perms={[{ l: 'SafePulse', c: C.coral }, { l: 'Emergency', c: C.sageDeep }]} onClick={() => toast('Edit Campus Security', 'info')} />
      </div>

      {/* Reports */}
      <SectionHeader title="My Reports" action="See All" onAction={() => toast('Reports list', 'info')} />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ReportRow title="Workplace harassment · Incident #042" date="May 21, 2026" status="Draft" color={C.amber} />
        <ReportRow title="Anonymous report · Off-campus" date="Apr 30, 2026" status="Submitted" color={C.tidewater} />
      </div>

      {/* App links */}
      <SectionHeader title="App" />
      <div style={{ padding: '0 20px', background: '#fff', margin: '0 20px', borderRadius: 16, overflow: 'hidden' }}>
        {[
          { l: 'About SafeTrace' }, { l: 'Privacy Policy' }, { l: 'Terms of Service' }, { l: 'Help & Support' },
        ].map((it, i) => (
          <button key={i} onClick={() => toast(it.l, 'info')} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '14px 4px',
            borderBottom: i < 3 ? `1px solid ${C.borderSoft}` : 'none',
            fontFamily: T.text, fontSize: 14, color: C.midnight, fontWeight: 500,
          }}>
            {it.l}
            <IChevronRight size={16} color={C.fog} />
          </button>
        ))}
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <button onClick={() => setLogoutModal(true)} style={{
          width: '100%', padding: '14px',
          background: '#fff', borderRadius: 16,
          fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.coralDeep,
        }}>Log Out</button>
      </div>

      {/* Version */}
      <div style={{
        textAlign: 'center', fontFamily: T.mono, fontSize: 10, color: C.slate,
        letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 24,
      }}>SafeTrace AI · v1.0.0</div>

      {/* Destroy modal */}
      <Modal open={destroyModal} onClose={() => { setDestroyModal(false); setDestroyText(''); }} danger>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <IAlertTriangle size={22} color={C.coralDeep} />
          <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight }}>Permanent Data Destruction</div>
        </div>
        <div style={{ fontFamily: T.text, fontSize: 13, color: C.graphite, lineHeight: 1.55, marginBottom: 14, textWrap: 'pretty' }}>
          This irreversibly deletes <strong>all</strong> reports, evidence, wellness records, and account information. This cannot be undone.
        </div>
        <div style={{ fontFamily: T.text, fontSize: 12, color: C.slate, marginBottom: 8 }}>Type <strong style={{ color: C.coralDeep, fontFamily: T.mono }}>DELETE</strong> to confirm:</div>
        <input
          value={destroyText} onChange={(e) => setDestroyText(e.target.value)}
          style={{
            width: '100%', padding: 12, borderRadius: 10,
            border: `1.5px solid ${C.border}`, marginBottom: 14,
            fontFamily: T.mono, fontSize: 14, outline: 'none',
            background: C.paper2,
          }}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => { setDestroyModal(false); setDestroyText(''); }}>Cancel</Button>
          <Button variant="coral" disabled={destroyText !== 'DELETE'} onClick={() => { setDestroyModal(false); setDestroyText(''); toast('Destruction scheduled · 30s window to undo', 'error'); }}>Destroy</Button>
        </div>
      </Modal>

      <Modal open={logoutModal} onClose={() => setLogoutModal(false)}>
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, marginBottom: 8 }}>Log out?</div>
        <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 18 }}>
          Your encrypted data stays safe in SafeVault. You'll need your passphrase to log back in.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setLogoutModal(false)}>Stay</Button>
          <Button onClick={() => { setLogoutModal(false); toast('Logged out (demo)', 'info'); }}>Log out</Button>
        </div>
      </Modal>

      <Modal open={apiKeyModal} onClose={() => { setApiKeyModal(false); setApiKeyInput(localStorage.getItem('ANTHROPIC_API_KEY') || ''); }}>
        <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 500, color: C.midnight, marginBottom: 8 }}>Claude API Key</div>
        <div style={{ fontFamily: T.text, fontSize: 13.5, color: C.graphite, lineHeight: 1.5, marginBottom: 14 }}>
          Get your key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener" style={{ color: C.lavenderDeep, textDecoration: 'underline', fontWeight: 600 }}>console.anthropic.com</a>
        </div>
        <input type="password" placeholder="sk-ant-..." value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} style={{
          width: '100%', padding: '10px 12px', borderRadius: 10,
          border: `1px solid ${C.border}`, fontFamily: T.mono, fontSize: 12,
          marginBottom: 12, boxSizing: 'border-box',
        }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => { setApiKeyModal(false); setApiKeyInput(localStorage.getItem('ANTHROPIC_API_KEY') || ''); }}>Cancel</Button>
          <Button onClick={() => {
            if (apiKeyInput.trim()) {
              localStorage.setItem('ANTHROPIC_API_KEY', apiKeyInput.trim());
              setApiKeyModal(false);
              setApiKeyInput('');
              toast('API key saved successfully!', 'success');
            } else {
              localStorage.removeItem('ANTHROPIC_API_KEY');
              setApiKeyModal(false);
              setApiKeyInput('');
              toast('API key removed', 'info');
            }
          }}>Save Key</Button>
        </div>
      </Modal>
    </div>
  );
};

const ToggleRow = ({ icon: I, color, label, desc, on, onToggle, locked }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 14px', background: '#fff', borderRadius: 14,
    boxShadow: '0 1px 3px rgba(11,23,51,0.04)',
  }}>
    <div style={{
      width: 34, height: 34, borderRadius: 10,
      background: `${color}1A`, color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}><I size={16} /></div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: C.midnight }}>{label}</div>
      <div style={{ fontFamily: T.text, fontSize: 11.5, color: C.slate, marginTop: 1 }}>{desc}</div>
    </div>
    {locked ? (
      <div style={{
        width: 44, height: 26, borderRadius: 999,
        background: C.sageDeep, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        fontFamily: T.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
      }}><ILock size={10} /></div>
    ) : (
      <div className={`toggle ${on ? 'on' : ''}`} onClick={onToggle} />
    )}
  </div>
);

const ContactCard = ({ initials, name, rel, perms, onClick }) => (
  <Card style={{ padding: 14 }} onClick={onClick}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 999,
        background: `linear-gradient(135deg, ${C.tidewater}, ${C.twilight})`,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.text, fontSize: 13, fontWeight: 600,
      }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight }}>{name}</div>
        <div style={{ fontFamily: T.text, fontSize: 11.5, color: C.slate, marginTop: 1 }}>{rel}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {perms.map((p, i) => <Pill key={i} color={p.c}>{p.l}</Pill>)}
        </div>
      </div>
      <IChevronRight size={16} color={C.fog} />
    </div>
  </Card>
);

const ReportRow = ({ title, date, status, color }) => (
  <Card style={{ padding: 14 }} onClick={() => {}}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}1A`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><IFileText size={16} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: C.midnight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: C.slate, marginTop: 2 }}>{date}</div>
      </div>
      <Pill color={color}>{status}</Pill>
    </div>
  </Card>
);

const DarkPill = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: 999,
    background: 'rgba(127,183,194,0.14)',
    border: '1px solid rgba(127,183,194,0.22)',
    fontFamily: T.mono, fontSize: 10, letterSpacing: '0.08em',
    color: C.aurora, textTransform: 'uppercase',
  }}>{children}</span>
);

// ─── Availability grid ───
const AvailabilityGrid = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const slots = ['Morn', 'Aft', 'Eve', 'Night'];
  // Default availability pattern
  const init = days.map((_, di) => slots.map((_, si) => (di < 5 ? (si === 1 || si === 2) : si === 2)));
  const [grid, setGrid] = React.useState(init);
  const toggle = (d, s) => setGrid(g => g.map((row, i) => i === d ? row.map((c, j) => j === s ? !c : c) : row));
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '38px repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        <div />
        {days.map((d, i) => (
          <div key={i} style={{ fontFamily: T.mono, fontSize: 10, color: C.slate, textAlign: 'center', textTransform: 'uppercase' }}>{d}</div>
        ))}
      </div>
      {slots.map((s, si) => (
        <div key={si} style={{ display: 'grid', gridTemplateColumns: '38px repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          <div style={{ fontFamily: T.mono, fontSize: 9.5, color: C.slate, display: 'flex', alignItems: 'center' }}>{s.toUpperCase()}</div>
          {days.map((_, di) => (
            <button key={di} onClick={() => toggle(di, si)} style={{
              aspectRatio: '1 / 1', borderRadius: 6,
              background: grid[di][si] ? C.tidewater : C.paper2,
              border: `1px solid ${grid[di][si] ? C.tidewater : C.border}`,
              transition: 'background 0.15s ease',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── Safety heat map ───
const SafetyMap = () => (
  <div style={{
    position: 'relative', borderRadius: 12, overflow: 'hidden',
    aspectRatio: '1.6 / 1',
    background: '#EFE7D5',
  }}>
    {/* Grid lines */}
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 160 100" preserveAspectRatio="none">
      <defs>
        <pattern id="profgrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(11,23,51,0.06)" strokeWidth="0.4"/>
        </pattern>
      </defs>
      <rect width="160" height="100" fill="url(#profgrid)"/>
      {/* Roads */}
      <path d="M 0 50 L 160 50" stroke="rgba(11,23,51,0.12)" strokeWidth="1.6"/>
      <path d="M 80 0 L 80 100" stroke="rgba(11,23,51,0.12)" strokeWidth="1.6"/>
      <path d="M 0 20 L 160 20" stroke="rgba(11,23,51,0.08)" strokeWidth="1"/>
      <path d="M 0 80 L 160 80" stroke="rgba(11,23,51,0.08)" strokeWidth="1"/>
      <path d="M 40 0 L 40 100" stroke="rgba(11,23,51,0.08)" strokeWidth="1"/>
      <path d="M 120 0 L 120 100" stroke="rgba(11,23,51,0.08)" strokeWidth="1"/>
    </svg>

    {/* Heat zones */}
    <Heat x={20} y={25} size={70} color={C.sage} />
    <Heat x={55} y={70} size={55} color={C.sage} />
    <Heat x={95} y={32} size={60} color={C.amber} />
    <Heat x={130} y={72} size={45} color={C.coral} />

    {/* You marker */}
    <div style={{
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: 999,
        background: C.tidewater, border: '2.5px solid #fff',
        boxShadow: `0 0 12px ${C.tidewater}`,
      }} />
      <div style={{
        marginTop: 3, fontFamily: T.mono, fontSize: 8.5, color: '#fff',
        background: 'rgba(11,23,51,0.7)', padding: '1px 5px', borderRadius: 4,
        letterSpacing: '0.05em',
      }}>YOU</div>
    </div>
  </div>
);

const Heat = ({ x, y, size, color }) => (
  <div style={{
    position: 'absolute',
    left: `${x / 1.6}%`, top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    width: size, height: size, borderRadius: '50%',
    background: `radial-gradient(circle, ${color}88 0%, ${color}33 50%, transparent 80%)`,
    mixBlendMode: 'multiply',
  }} />
);

const LegendDot = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    <div style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
    <span style={{ fontFamily: T.text, fontSize: 11.5, color: C.graphite }}>{label}</span>
  </div>
);

Object.assign(window, { ProfileScreen });
