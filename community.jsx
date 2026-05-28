// community.jsx — SafeCircle as its own tab: swipe card stack + Anonymous Messages

const COMMUNITY_POSTS = [
  {
    id: 1, user: 'Survivor_7392', color: C.tidewater, icon: 'leaf',
    time: '2h ago', category: 'Stories',
    content: "I finally submitted my report today. It took me three weeks but SafeTrace made it so much easier. Sending strength to everyone here.",
    hearts: 24, comments: [
      { user: 'Healing_4281', color: C.lavenderDeep, icon: 'wave', time: '1h', content: "Proud of you. The first step is the hardest one." },
      { user: 'Steady_2018', color: C.sageDeep, icon: 'sun', time: '32m', content: "This is huge. Take care of yourself tonight." },
      { user: 'Quiet_2210', color: C.tidewater, icon: 'leaf', time: '10m', content: "Sending strength right back. You're not alone." },
    ],
  },
  {
    id: 2, user: 'Quiet_Voice_5510', color: C.lavenderDeep, icon: 'wave',
    time: '5h ago', category: 'Advice',
    content: "Has anyone navigated the Title IX process at a large university? I could use some advice on what to expect — feeling very in the dark right now.",
    hearts: 12, comments: [
      { user: 'Mentor_Hope', color: C.sageDeep, icon: 'sun', time: '3h', content: "Reach out via Peer Mentors — I went through it last year. Happy to walk you through it step by step." },
    ],
  },
  {
    id: 3, user: 'Healing_4281', color: C.lavenderDeep, icon: 'wave',
    time: '1d ago', category: 'Support',
    content: "Day 45 of therapy. Some days are harder than others but I'm learning that healing isn't linear. You all inspire me.",
    hearts: 38, comments: [],
  },
  {
    id: 4, user: 'Compass_2841', color: C.twilight, icon: 'moon',
    time: '2d ago', category: 'Resources',
    content: "Sharing a free trauma-informed legal aid clinic that helped me draft my statement — they take pro-bono referrals across the country. DM me for the link.",
    hearts: 19, comments: [
      { user: 'Quiet_Voice_5510', color: C.lavenderDeep, icon: 'wave', time: '1d', content: "Thank you — I'll reach out." },
    ],
  },
  {
    id: 5, user: 'Anchor_9920', color: C.sageDeep, icon: 'sun',
    time: '3d ago', category: 'Stories',
    content: "Six months ago I couldn't say what happened out loud. Today I told my best friend everything. Small wins are still wins.",
    hearts: 47, comments: [
      { user: 'Steady_2018', color: C.sageDeep, icon: 'sun', time: '2d', content: "This made my whole evening. Cheering for you." },
    ],
  },
];

const COMMUNITY_FILTERS = ['All', 'Stories', 'Advice', 'Support', 'Resources'];

const CATEGORY_COLORS = {
  'Stories':   C.tidewater,
  'Advice':    C.lavenderDeep,
  'Support':   C.sageDeep,
  'Resources': C.twilight,
};

const SAMPLE_MESSAGES = [
  { id: 1, user: 'Mentor_Hope', color: C.sageDeep, icon: 'sun', last: "Take your time — there's no rush.", time: '12m' },
  { id: 2, user: 'Healing_4281', color: C.lavenderDeep, icon: 'wave', last: 'Saw your post. Sending support 💚', time: '2h' },
  { id: 3, user: 'Compass_2841', color: C.twilight, icon: 'moon', last: "Here's the clinic info I mentioned…", time: '1d' },
];

const CommunityScreen = ({ toast }) => {
  const [filter, setFilter] = React.useState('All');
  const [composeOpen, setComposeOpen] = React.useState(false);

  return (
    <div className="phone-scroll" style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(120% 50% at 50% 0%, rgba(127,183,194,0.10) 0%, transparent 50%), ${C.paper}`,
      paddingTop: 56, paddingBottom: 110,
      overflowY: 'auto',
      animation: 'fade-in 0.25s ease-out',
    }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        padding: '12px 20px 8px',
        background: 'linear-gradient(180deg, rgba(245,239,228,1) 0%, rgba(245,239,228,0.92) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11,
            background: `linear-gradient(135deg, ${C.tidewater}, ${C.twilight})`,
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${C.tidewater}44`,
          }}><IUsers size={16} strokeWidth={2.2} /></div>
          <div>
            <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 500, letterSpacing: '-0.025em', color: C.midnight, lineHeight: 1 }}>SafeCircle</div>
            <div style={{ fontFamily: T.text, fontSize: 11, color: C.slate, marginTop: 2 }}>Anonymous · moderated · safe</div>
          </div>
        </div>

        {/* Filter pills */}
        <div className="chip-scroll" style={{
          display: 'flex', gap: 6, overflowX: 'auto', marginTop: 12,
          paddingBottom: 2,
        }}>
          {COMMUNITY_FILTERS.map(f => {
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)} className="tap-scale" style={{
                padding: '7px 14px', borderRadius: 999,
                background: active ? `linear-gradient(135deg, ${C.tidewater}, ${C.twilight})` : '#fff',
                color: active ? '#fff' : C.graphite,
                border: `1px solid ${active ? 'transparent' : C.border}`,
                fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
                flexShrink: 0, whiteSpace: 'nowrap',
                boxShadow: active ? `0 3px 10px ${C.tidewater}33` : undefined,
                transition: 'all 0.2s ease',
              }}>{f}</button>
            );
          })}
        </div>
      </div>

      {/* Card stack */}
      <div style={{ padding: '20px 20px 12px' }}>
        <CardStack filter={filter} toast={toast} />
      </div>

      {/* Share button */}
      <div style={{ padding: '0 20px 24px' }}>
        <Button icon={IPlus} onClick={() => setComposeOpen(true)}>Share Your Story</Button>
      </div>

      {/* Anonymous Messages */}
      <SectionHeader title="Anonymous Messages" />
      <div style={{ padding: '0 20px' }}>
        <Card style={{ padding: 8 }}>
          <div style={{ padding: '6px 10px 8px', fontFamily: T.text, fontSize: 11.5, color: C.slate }}>
            Chat with peers — identities stay protected on both sides.
          </div>
          {SAMPLE_MESSAGES.map((m, i) => (
            <button key={m.id}
              onClick={() => toast('Anonymous chat — coming soon', 'info')}
              className="tap-scale"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 10px', width: '100%',
                borderRadius: 12,
                borderTop: i > 0 ? `1px solid ${C.borderSoft}` : 'none',
                background: 'transparent', textAlign: 'left',
              }}>
              <AnonAvatar color={m.color} icon={m.icon} size={40} gradient />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontFamily: T.text, fontSize: 13.5, fontWeight: 600, color: C.midnight, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.user}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: C.slate }}>{m.time}</div>
                </div>
                <div style={{ fontFamily: T.text, fontSize: 12, color: C.slate, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textWrap: 'pretty' }}>{m.last}</div>
              </div>
              <IChevronRight size={14} color={C.fog} />
            </button>
          ))}
        </Card>
      </div>

      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onPost={() => { setComposeOpen(false); toast('Posted anonymously', 'success'); }}
      />
    </div>
  );
};

// ─── Tinder-style swipe card stack ───
const CardStack = ({ filter, toast }) => {
  const filtered = React.useMemo(() => (
    filter === 'All' ? COMMUNITY_POSTS : COMMUNITY_POSTS.filter(p => p.category === filter)
  ), [filter]);

  const [idx, setIdx] = React.useState(0);
  const [dragX, setDragX] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [flying, setFlying] = React.useState(null); // 'left' | 'right' | null
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const lockedAxis = React.useRef(null);
  const velocity = React.useRef(0);
  const lastX = React.useRef(0);
  const lastT = React.useRef(0);

  // Reset when filter changes
  React.useEffect(() => { setIdx(0); setDragX(0); setFlying(null); }, [filter]);

  if (filtered.length === 0) {
    return (
      <div style={{
        padding: '40px 20px', textAlign: 'center',
        fontFamily: T.text, fontSize: 13.5, color: C.slate, lineHeight: 1.5,
        background: '#fff', borderRadius: 20,
        border: `1px solid ${C.borderSoft}`,
      }}>
        No posts in <strong style={{ color: C.midnight }}>{filter}</strong> yet.<br/>
        Be the first to share.
      </div>
    );
  }

  // Loop infinitely
  const safeIdx = idx % filtered.length;
  const current = filtered[safeIdx];
  const next = filtered[(safeIdx + 1) % filtered.length];

  const handleStart = (e) => {
    if (flying) return;
    const t = e.touches ? e.touches[0] : e;
    startX.current = t.clientX;
    startY.current = t.clientY;
    lastX.current = t.clientX;
    lastT.current = Date.now();
    velocity.current = 0;
    lockedAxis.current = null;
    setDragging(true);
  };
  const handleMove = (e) => {
    if (!dragging) return;
    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    if (!lockedAxis.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      } else return;
    }
    if (lockedAxis.current === 'y') return;
    const now = Date.now();
    velocity.current = (t.clientX - lastX.current) / Math.max(1, now - lastT.current);
    lastX.current = t.clientX;
    lastT.current = now;
    setDragX(dx);
  };
  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = 90;
    const vel = velocity.current;
    if (dragX > threshold || vel > 0.45) {
      setFlying('right');
      setTimeout(() => { setIdx(i => i + 1); setDragX(0); setFlying(null); }, 280);
      toast('Saved · sending support', 'success');
    } else if (dragX < -threshold || vel < -0.45) {
      setFlying('left');
      setTimeout(() => { setIdx(i => i + 1); setDragX(0); setFlying(null); }, 280);
    } else {
      setDragX(0);
    }
  };

  const rotation = (dragX / 16);
  const flyDistance = flying === 'right' ? 500 : flying === 'left' ? -500 : 0;

  return (
    <div
      style={{ position: 'relative', height: 420, width: '100%', perspective: 1000 }}
      onMouseDown={handleStart}
      onMouseMove={dragging ? handleMove : undefined}
      onMouseUp={handleEnd}
      onMouseLeave={dragging ? handleEnd : undefined}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* Card behind */}
      {next && (
        <PostSwipeCard
          post={next}
          style={{
            transform: `translateY(${dragging ? Math.max(0, 12 - Math.abs(dragX) * 0.05) : 12}px) scale(${dragging ? Math.min(1, 0.94 + Math.abs(dragX) * 0.0006) : 0.94})`,
            opacity: 0.7,
            zIndex: 0,
            pointerEvents: 'none',
          }}
          interactive={false}
        />
      )}

      {/* Current card */}
      <PostSwipeCard
        post={current}
        toast={toast}
        style={{
          transform: flying
            ? `translateX(${flyDistance}px) rotate(${flying === 'right' ? 20 : -20}deg)`
            : `translateX(${dragX}px) rotate(${rotation}deg)`,
          transition: dragging ? 'none' : 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: flying ? 0 : 1,
          zIndex: 1,
        }}
        likeOpacity={Math.max(0, Math.min(1, dragX / 100))}
        passOpacity={Math.max(0, Math.min(1, -dragX / 100))}
        interactive
      />

      {/* Swipe hint */}
      <div style={{
        position: 'absolute', bottom: -32, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: T.mono, fontSize: 10, color: C.slate,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>
        <IChevronLeft size={12} /> Swipe <IChevronRight size={12} />
      </div>
    </div>
  );
};

// ─── Single post card (used in stack) ───
const PostSwipeCard = ({ post, style = {}, interactive, likeOpacity = 0, passOpacity = 0, toast }) => {
  const [liked, setLiked] = React.useState(false);
  const [supported, setSupported] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);
  const catColor = CATEGORY_COLORS[post.category] || C.slate;

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: '#fff', borderRadius: 22,
        border: `1px solid ${C.borderSoft}`,
        boxShadow: '0 8px 32px rgba(11,23,51,0.10), 0 2px 8px rgba(11,23,51,0.06)',
        borderTop: `4px solid ${catColor}`,
        padding: 20, display: 'flex', flexDirection: 'column',
        userSelect: 'none', cursor: interactive ? 'grab' : 'default',
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <AnonAvatar color={post.color} icon={post.icon} size={44} gradient />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.text, fontSize: 14, fontWeight: 600, color: C.midnight }}>{post.user}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, color: C.slate }}>{post.time}</div>
            <div style={{ width: 3, height: 3, borderRadius: 999, background: C.fog }} />
            <Pill color={catColor}>{post.category}</Pill>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        fontFamily: T.text, fontSize: 16, color: C.ink,
        lineHeight: 1.55, textWrap: 'pretty',
        display: 'flex', alignItems: 'center',
        padding: '8px 0',
      }}>{post.content}</div>

      {/* Interaction row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        paddingTop: 12, borderTop: `1px dashed ${C.border}`,
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); if (!liked) toast?.('Liked', 'success'); }}
          className="tap-scale"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '7px 10px', borderRadius: 10,
            color: liked ? C.coralDeep : C.slate,
            background: liked ? `${C.coral}1A` : 'transparent',
            fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
            transition: 'all 0.2s ease',
          }}>
          <IHeart size={15} style={{ fill: liked ? C.coral : 'none' }} /> {post.hearts + (liked ? 1 : 0)}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowReplies(v => !v); }}
          className="tap-scale"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '7px 10px', borderRadius: 10,
            color: showReplies ? C.tidewater : C.slate,
            fontFamily: T.text, fontSize: 12.5, fontWeight: 600,
          }}>
          <IMessageCircle size={15} /> {post.comments.length}
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={(e) => { e.stopPropagation(); setSupported(s => !s); if (!supported) toast?.('You sent support 💚', 'success'); }}
          className="tap-scale"
          style={{
            padding: '7px 14px', borderRadius: 999,
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

      {/* Expanded replies */}
      {showReplies && post.comments.length > 0 && (
        <div style={{
          marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.borderSoft}`,
          display: 'flex', flexDirection: 'column', gap: 8,
          maxHeight: 140, overflowY: 'auto',
          animation: 'msg-in 0.25s ease',
        }}>
          {post.comments.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <AnonAvatar color={c.color} icon={c.icon} size={24} gradient />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <div style={{ fontFamily: T.text, fontSize: 11.5, fontWeight: 600, color: C.midnight }}>{c.user}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 9.5, color: C.slate }}>{c.time}</div>
                </div>
                <div style={{ fontFamily: T.text, fontSize: 12.5, color: C.graphite, lineHeight: 1.45, marginTop: 2, textWrap: 'pretty' }}>{c.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showReplies && post.comments.length === 0 && (
        <div style={{
          marginTop: 10, fontFamily: T.text, fontSize: 11.5, color: C.slate,
          fontStyle: 'italic', textAlign: 'center',
        }}>No replies yet.</div>
      )}

      {/* Like/Pass overlays */}
      {interactive && likeOpacity > 0 && (
        <div style={{
          position: 'absolute', top: 24, right: 24,
          padding: '6px 14px', borderRadius: 8,
          border: `3px solid ${C.sageDeep}`, color: C.sageDeep,
          fontFamily: T.display, fontSize: 16, fontWeight: 700,
          letterSpacing: '0.1em', transform: 'rotate(12deg)',
          opacity: likeOpacity, pointerEvents: 'none',
        }}>SUPPORT</div>
      )}
      {interactive && passOpacity > 0 && (
        <div style={{
          position: 'absolute', top: 24, left: 24,
          padding: '6px 14px', borderRadius: 8,
          border: `3px solid ${C.slate}`, color: C.slate,
          fontFamily: T.display, fontSize: 16, fontWeight: 700,
          letterSpacing: '0.1em', transform: 'rotate(-12deg)',
          opacity: passOpacity, pointerEvents: 'none',
        }}>SKIP</div>
      )}
    </div>
  );
};

Object.assign(window, { CommunityScreen });
