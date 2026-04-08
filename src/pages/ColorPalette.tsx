const ColorPalette = () => {
  return (
    <div className="min-h-svh p-8 space-y-10">
      {/* ── Fonts ── */}
      <section className="space-y-2">
        <h2 className="font-display text-2xl font-bold">font-display — Noto Serif</h2>
        <p className="font-body text-base">font-body — Inter (default body text)</p>
        <p className="font-mono text-base">font-mono — Space Mono 1234567890</p>
      </section>

      {/* ── Core Palette ── */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Core Palette</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-40 h-24 rounded-lg bg-bg-primary border border-border flex items-center justify-center text-text-primary text-sm">bg-primary</div>
          <div className="w-40 h-24 rounded-lg bg-bg-secondary border border-border flex items-center justify-center text-text-primary text-sm">bg-secondary</div>
          <div className="w-40 h-24 rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-text-primary text-sm">bg-elevated</div>
        </div>
      </section>

      {/* ── Borders ── */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Borders</h2>
        <div className="flex gap-4">
          <div className="w-40 h-24 rounded-lg bg-bg-secondary border-2 border-border flex items-center justify-center text-text-secondary text-sm">border</div>
          <div className="w-40 h-24 rounded-lg bg-bg-secondary border-2 border-border-focus flex items-center justify-center text-text-secondary text-sm">border-focus</div>
        </div>
      </section>

      {/* ── Text Colors ── */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Text Colors</h2>
        <p className="text-text-primary text-lg">text-primary — Headings, primary content</p>
        <p className="text-text-secondary text-lg">text-secondary — Labels, descriptions</p>
        <p className="text-text-muted text-lg">text-muted — Disabled, placeholders</p>
      </section>

      {/* ── Semantic / Feedback ── */}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Semantic / Feedback</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-40 h-24 rounded-lg bg-win/20 border border-win flex items-center justify-center text-win text-sm font-mono font-bold">win</div>
          <div className="w-40 h-24 rounded-lg bg-win-glow border border-win flex items-center justify-center text-win text-sm font-mono font-bold">win-glow</div>
          <div className="w-40 h-24 rounded-lg bg-loss/20 border border-loss flex items-center justify-center text-loss text-sm font-mono font-bold">loss</div>
          <div className="w-40 h-24 rounded-lg bg-loss-glow border border-loss flex items-center justify-center text-loss text-sm font-mono font-bold">loss-glow</div>
          <div className="w-40 h-24 rounded-lg bg-accent/20 border border-accent flex items-center justify-center text-accent text-sm font-mono font-bold">accent</div>
          <div className="w-40 h-24 rounded-lg bg-accent-hover/20 border border-accent-hover flex items-center justify-center text-accent-hover text-sm font-mono font-bold">accent-hover</div>
          <div className="w-40 h-24 rounded-lg bg-neutral/20 border border-neutral flex items-center justify-center text-neutral text-sm font-mono font-bold">neutral</div>
        </div>
      </section>
    </div>
  );
};

export default ColorPalette;
