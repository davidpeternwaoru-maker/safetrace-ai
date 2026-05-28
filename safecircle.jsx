// safecircle.jsx — Anonymous Community feed + post cards + compose modal

const POST_CATEGORIES = {
  'My Journey':     { color: C.tidewater, key: 'journey' },
  'Advice':         { color: C.lavenderDeep, key: 'advice' },
  'Advice Needed':  { color: C.lavenderDeep, key: 'advice' },
  'Support':        { color: C.sageDeep, key: 'support' },
  'Support Others': { color: C.sageDeep, key: 'support' },
  'Resources':      { color: C.twilight, key: 'resources' },
  'Resource Sharing': { color: C.twilight, key: 'resources' },
};

const SAMPLE_POSTS = [
  {
    id: 1, user: 'Survivor_7392', color: C.tidewater, icon: 'leaf', time: '2 hours ago',
    category: 'My Journey',
    content: "I finally submitted my report today. It took me three weeks but SafeTrace made it so much easier. Sending strength to everyone here.",
    hearts: 12, replies: [
      { user: 'Healing_4281', color: C.lavenderDeep, icon: 'wave', time: '1h', content: "Proud of you. The first step is the hardest one." },
      { user: 'Steady_2018', color: C.sageDeep, icon: 'sun', time: '32m', content: "This is huge. Take care of yourself tonight." },
    ],
  },
  {
    id: 2, user: 'Quiet_Voice_5510', color: C.lavenderDeep, icon: 'wave', time: '5 hours ago',
    category: 'Advice',
    content: "Has anyone navigated the Title IX process at a large university? I could use some advice on what to expect — feeling very in the dark.",
    hearts: 8, replies: [
      { user: 'Mentor_Hope', color: C.sageDeep, icon: 'sun', time: '3h', content: "Reach out via Peer Mentors — I went through it last year and can walk you through it." },
    ],
  },
  {
    id: 3, user: 'Healing_4281', color: C.lavenderDeep, icon: 'wave', time: '1 day ago',
    category: 'Support',
    content: "Day 45 of therapy. Some days are harder than others but I'm learning that healing isn't linear. You all inspire me.",
    hearts: 27, replies: [],
  },
  {
    id: 4, user: 'Compass_2841', color: C.twilight, icon: 'moon', time: '2 days ago',
    category: 'Resources',
    content: "Sharing a free trauma-informed legal aid clinic that helped me draft my statement — they take pro-bono referrals. DM me for the link.",
    hearts: 19, replies: [],
  },
];

const CATEGORY_TAGS = ['My Journey', 'Advice Needed', 'Support Others', 'Resource Sharing'];

// ───── Anonymous avatar (with optional gradient) ─────
const AnonAvatar = ({ color, icon, size = 36, gradient = false }) => {
  const glyphs = {
    leaf: <path d="M 6 18 Q 6 8 18 6 Q 18 18 6 18 Z M 6 18 L 14 10" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>,
    wave: <path d="M 4 12 Q 8 8, 12 12 T 20 12 M 4 16 Q 8 12, 12 16 T 20 16" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>,
    sun: <g><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M 12 4 L 12 6 M 12 18 L 12 20 M 4 12 L 6 12 M 18 12 L 20 12 M 6.5 6.5 L 7.5 7.5 M 16.5 16.5 L 17.5 17.5 M 6.5 17.5 L 7.5 16.5 M 16.5 7.5 L 17.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></g>,
    moon: <path d="M 18 14 A 7 7 0 1 1 10 6 A 5 5 0 0 0 18 14 Z" stroke="currentColor" strokeWidth="1.8" fill="none"/>,
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: gradient
        ? `linear-gradient(135deg, ${color}, ${color}88)`
        : `${color}22`,
      color: gradient ? '#fff' : color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: gradient ? `0 4px 10px ${color}44` : undefined,
    }}>
      <svg width={size - 16} height={size - 16} viewBox="0 0 24 24" fill="none">
        {glyphs[icon] || glyphs.leaf}
      </svg>
    </div>
  );
};

// ───── Feed (used inside Wellness Community tab) ─────
const SafeCircleFeed = ({ toast, filter = 'All' }) => {
  const [posts, setPosts] = React.useState(SAMPLE_POSTS);
  const [expanded, setExpanded] = React.useState({});
  const [supported, setSupported] = React.useState({});
  const [replyText, setReplyText] = React.useState({});

  const filtered = filter === 'All'
    ? posts
    : posts.filter(p => POST_CATEGORIES[p.category]?.key === POST_CATEGORIES[filter]?.key);

  const toggleExpand = (id) => setExpanded(s => ({ ...s, [id]: !s[id] }));
  const toggleSupport = (id) => {
    setSupported(s => ({ ...s, [id]: !s[id] }));
    if (!supported[id]) toast('You sent support 💚', 'success');
  };
  const submitReply = (postId) => {
    const txt = (replyText[postId] || '').trim();
    if (!txt) return;
    setPosts(ps => ps.map(p => p.id === postId ? {
      ...p,
      replies: [...p.replies, {
        user: 'You · Anonymous', color: C.tidewater, icon: 'leaf', time: 'just now', content: txt,
      }],
    } : p));
    setReplyText(s => ({ ...s, [postId]: '' }));
    toast('Reply posted anonymously', 'success');
  };

  if (filtered.length === 0) {
    return (
      <div style={{
        padding: 40, textAlign: 'center',
        fontFamily: T.text, fontSize: 13, color: C.slate, lineHeight: 1.5,
        animation: 'fade-in 0.3s ease-out',
      }}>
        No posts in <strong>{filter}</strong> yet. Be the first.
      </div>
    );
  }

  return (
    <>
      {filtered.map((p) => (
        <div key={p.id} className="stagger-item">
          <PostCard
            post={p}
            expanded={!!expanded[p.id]} onExpand={() => toggleExpand(p.id)}
            supported={!!supported[p.id]} onSupport={() => toggleSupport(p.id)}
            replyText={replyText[p.id] || ''}
            onReplyChange={(v) => setReplyText(s => ({ ...s, [p.id]: v }))}
            onSubmitReply={() => submitReply(p.id)}
          />
        </div>
      ))}
    </>
  );
};

// ───── Post card ─────
const PostCard = ({ post, expanded, onExpand, supported, onSupport, replyText, onReplyChange, onSubmitReply }) => {
  const cat = POST_CATEGORIES[post.category] || { color: C.slate };
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      padding: 16, paddingLeft: 16,
      boxShadow: '0 2px 16px rgba(11,23,51,0.06)',
      borderLeft: `3px solid ${cat.color}`,
      animation: 'fade-in 0.3s ease-out',
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <AnonAvatar color={post.color} icon={post.icon} size={36} gradient />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: C.midnight }}>{post.user}</div>
          <div style={{ fontFamily: T.text, fontSize: 11, color: C.slate, marginTop: 1 }}>{post.time}</div>
        </div>
        {post.category && (
          <Pill color={cat.color}>{post.category}</Pill>
        )}
      </div>
      <div style={{
        fontFamily: T.text, fontSize: 14, color: C.ink, lineHeight: 1.55,
        textWrap: 'pretty', marginBottom: 14,
      }}>{post.content}</div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        paddingTop: 10, borderTop: `1px dashed ${C.border}`,
      }}>
        <button className="tap-scale" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 10px', color: C.coralDeep, borderRadius: 8,
          fontFamily: T.text, fontSize: 12, fontWeight: 500,
        }}>
          <IHeart size={14} /> {post.hearts}
        </button>
        <button onClick={onExpand} className="tap-scale" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 10px', color: expanded ? C.tidewater : C.slate, borderRadius: 8,
          fontFamily: T.text, fontSize: 12, fontWeight: 500,
        }}>
          <IMessageCircle size={14} /> {post.replies.length}
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={onSupport} className="tap-scale" style={{
          padding: '6px 14px', borderRadius: 999,
          background: supported
            ? `linear-gradient(135deg, ${C.sageDeep}, ${C.sage})`
            : `${C.sage}22`,
          color: supported ? '#fff' : C.sageDeep,
          fontFamily: T.text, fontSize: 11.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
          transition: 'all 0.25s ease',
          boxShadow: supported ? `0 3px 10px ${C.sageDeep}44` : undefined,
        }}>
          {supported ? <><ICheck size={11} strokeWidth={3} /> Supported</> : 'Support'}
        </button>
      </div>

      {/* Replies — slide-down */}
      <div style={{
        maxHeight: expanded ? 600 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.borderSoft}`,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {post.replies.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, animation: 'msg-in 0.3s ease' }}>
              <AnonAvatar color={r.color} icon={r.icon} size={28} gradient />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontFamily: T.text, fontSize: 12.5, fontWeight: 600, color: C.midnight }}>{r.user}</div>
                  <div style={{ fontFamily: T.text, fontSize: 10, color: C.slate }}>{r.time}</div>
                </div>
                <div style={{ fontFamily: T.text, fontSize: 13, color: C.graphite, lineHeight: 1.5, marginTop: 3, textWrap: 'pretty' }}>{r.content}</div>
              </div>
            </div>
          ))}
          {post.replies.length === 0 && (
            <div style={{ fontFamily: T.text, fontSize: 12, color: C.slate, fontStyle: 'italic' }}>No replies yet — be the first.</div>
          )}

          {/* Reply input */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 6px 6px 12px', borderRadius: 999,
            background: C.paper, border: `1px solid ${C.border}`,
            marginTop: 6,
          }}>
            <input
              value={replyText}
              onChange={(e) => onReplyChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmitReply()}
              placeholder="Reply anonymously…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: T.text, fontSize: 12.5, color: C.ink, minWidth: 0,
              }}
            />
            <button onClick={onSubmitReply} disabled={!replyText.trim()} style={{
              width: 28, height: 28, borderRadius: 999,
              background: replyText.trim() ? C.tidewater : C.fog,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><ISend size={11} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ───── Compose modal ─────
const ComposeModal = ({ open, onClose, onPost }) => {
  const [text, setText] = React.useState('');
  const [cat, setCat] = React.useState('My Journey');

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 95,
      background: 'rgba(11,23,51,0.55)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'backdrop-in 0.2s ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '20px 22px 32px',
        animation: 'slide-up 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: C.fog, margin: '0 auto 18px' }} />

        {/* Lavender header */}
        <div style={{
          marginLeft: -22, marginRight: -22, marginTop: -18, marginBottom: 18,
          padding: '14px 22px',
          background: `linear-gradient(135deg, ${C.lavender}33, ${C.lavenderDeep}1F)`,
        }}>
          <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 500, color: C.midnight, letterSpacing: '-0.025em', marginBottom: 4 }}>
            Share with the Community
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.text, fontSize: 12, color: C.lavenderDeep, fontWeight: 500 }}>
            <ILock size={12} /> Your identity is completely anonymous
          </div>
        </div>

        <textarea
          value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience, ask for advice, or offer support…"
          autoFocus
          style={{
            width: '100%', minHeight: 130, padding: 14,
            background: C.paper2, borderRadius: 14,
            border: `1.5px solid ${C.border}`,
            fontFamily: T.text, fontSize: 14, lineHeight: 1.5,
            color: C.ink, resize: 'none', outline: 'none',
            marginBottom: 16,
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = C.lavenderDeep}
          onBlur={(e) => e.target.style.borderColor = C.border}
        />

        <div style={{ fontFamily: T.text, fontSize: 11, fontWeight: 600, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          Category
        </div>
        <div className="chip-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 18, paddingBottom: 2 }}>
          {CATEGORY_TAGS.map(c => (
            <button key={c} onClick={() => setCat(c)} className="tap-scale" style={{
              padding: '7px 14px', borderRadius: 999,
              background: cat === c ? `linear-gradient(135deg, ${C.lavenderDeep}, ${C.lavender})` : '#fff',
              color: cat === c ? '#fff' : C.graphite,
              border: `1px solid ${cat === c ? C.lavenderDeep : C.border}`,
              fontFamily: T.text, fontSize: 12.5, fontWeight: 500,
              flexShrink: 0, whiteSpace: 'nowrap',
              boxShadow: cat === c ? `0 3px 10px ${C.lavenderDeep}33` : undefined,
            }}>{c}</button>
          ))}
        </div>

        <Button
          variant="lavender"
          icon={ILock}
          disabled={!text.trim()}
          onClick={() => onPost(text.trim(), cat)}
        >Post Anonymously</Button>
      </div>
    </div>
  );
};

Object.assign(window, { SafeCircleFeed, AnonAvatar, PostCard, ComposeModal, POST_CATEGORIES });
