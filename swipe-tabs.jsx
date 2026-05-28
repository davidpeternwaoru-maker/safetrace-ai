// swipe-tabs.jsx — Horizontal swipeable tab container with sliding indicator

const SwipeTabs = ({ tabs, activeIdx, onTabChange, headerStyle = {} }) => {
  const [dragX, setDragX] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const lastX = React.useRef(0);
  const lastT = React.useRef(0);
  const velocity = React.useRef(0);
  const lockedAxis = React.useRef(null); // 'x' | 'y' | null
  const trackRef = React.useRef(null);
  const tabsRef = React.useRef(null);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });
  const [paneWidth, setPaneWidth] = React.useState(0);

  // Measure indicator position when tab changes
  React.useEffect(() => {
    if (!tabsRef.current) return;
    const btn = tabsRef.current.querySelector(`[data-tab-idx="${activeIdx}"]`);
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const parentRect = tabsRef.current.getBoundingClientRect();
      setIndicator({ left: rect.left - parentRect.left, width: rect.width });
    }
  }, [activeIdx, tabs.length]);

  React.useEffect(() => {
    if (trackRef.current?.parentElement) {
      setPaneWidth(trackRef.current.parentElement.offsetWidth);
    }
  }, []);

  const handleStart = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    lastX.current = touch.clientX;
    lastT.current = Date.now();
    velocity.current = 0;
    lockedAxis.current = null;
    setDragging(true);
    setDragX(0);
  };
  const handleMove = (e) => {
    if (!dragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    // Axis lock: first significant movement decides
    if (!lockedAxis.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      } else return;
    }
    if (lockedAxis.current === 'y') return;

    // Track velocity (px / ms)
    const now = Date.now();
    const dt = Math.max(1, now - lastT.current);
    velocity.current = (touch.clientX - lastX.current) / dt;
    lastX.current = touch.clientX;
    lastT.current = now;

    let bounded = dx;
    if (activeIdx === 0 && bounded > 0) bounded = bounded * 0.3;
    if (activeIdx === tabs.length - 1 && bounded < 0) bounded = bounded * 0.3;
    setDragX(bounded);
  };
  const handleEnd = () => {
    if (!dragging) return;
    const positionalThreshold = paneWidth * 0.22;
    const velocityThreshold = 0.45; // px/ms ≈ flick

    let target = activeIdx;
    // Position-based snap
    if (dragX < -positionalThreshold && activeIdx < tabs.length - 1) target = activeIdx + 1;
    else if (dragX > positionalThreshold && activeIdx > 0) target = activeIdx - 1;
    // Velocity flick — overrides if strong enough
    if (velocity.current < -velocityThreshold && activeIdx < tabs.length - 1) target = activeIdx + 1;
    else if (velocity.current > velocityThreshold && activeIdx > 0) target = activeIdx - 1;

    if (target !== activeIdx) onTabChange(target);
    setDragX(0);
    setDragging(false);
  };

  const translateX = -activeIdx * paneWidth + dragX;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Tab pill header */}
      <div style={{
        padding: '10px 20px 8px',
        background: 'rgba(245,239,228,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 5,
        ...headerStyle,
      }}>
        <div ref={tabsRef} className="tabpill-track">
          <div className="tabpill-indicator" style={{
            left: indicator.left, width: indicator.width,
          }} />
          {tabs.map((t, i) => (
            <button
              key={t.id}
              data-tab-idx={i}
              onClick={() => onTabChange(i)}
              className={`tabpill-btn ${i === activeIdx ? 'active' : ''}`}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Swipe track */}
      <div
        onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
        onMouseDown={handleStart} onMouseMove={dragging ? handleMove : undefined}
        onMouseUp={handleEnd} onMouseLeave={dragging ? handleEnd : undefined}
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
      >
        <div
          ref={trackRef}
          className="swipe-track"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: dragging ? 'none' : undefined,
            width: `${tabs.length * 100}%`,
          }}
        >
          {tabs.map((t, i) => (
            <div key={t.id} className="swipe-pane phone-scroll" style={{
              width: paneWidth || '100%',
            }}>
              {Math.abs(i - activeIdx) <= 1 ? t.render() : <div />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { SwipeTabs });
