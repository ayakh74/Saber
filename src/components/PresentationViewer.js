"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, RotateCcw, Zap, Shield, Cpu, Network, Clock, AlertTriangle, CheckCircle, XCircle, ArrowDown, GitBranch, Layers, Hash, Lock, Users, Activity, BarChart2, Code2, Database, Globe, Box, Shuffle, Award, BookOpen, Target, Settings, Key, Workflow } from "lucide-react";
import MeshBackground from "./ui/MeshBackground";


/* ==============================
   SECTION METADATA
============================== */
const SECTIONS = [
  { name: "Intro", slides: [0, 1, 2], color: "#9B5DE5" },
  { name: "Problem", slides: [3, 4, 5, 6, 7, 8], color: "#E5293D" },
  { name: "SABER", slides: [9, 10, 11, 12, 13, 14, 15], color: "#9B5DE5" },
  { name: "Protocol", slides: [16, 17, 18, 19, 20, 21, 22, 23, 24], color: "#FF6B9D" },
  { name: "Ethereum", slides: [25, 26, 27], color: "#9B5DE5" },
  { name: "SaberLedger", slides: [28, 29, 30], color: "#E5293D" },
  { name: "Evaluation", slides: [31, 32, 33, 34, 35, 36, 37, 38, 39], color: "#9B5DE5" },
  { name: "Future", slides: [40, 41, 42, 43, 44, 45, 46], color: "#FF6B9D" },
];

/* ==============================
   SLIDE ANIMATIONS
============================== */
const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.97, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.97, filter: "blur(4px)" }),
};
const slideTransition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] };

/* ==============================
   PARTICLE FIELD
============================== */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.1,
      c: Math.random() > 0.5 ? "155,93,229" : "229,41,61",
    }));
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2 }} />;
}

/* ==============================
   INLINE SIMULATOR
============================== */
function TxSimulator({ mode = "parallel" }) {
  const [running, setRunning] = useState(false);
  const [txStates, setTxStates] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  const TRANSACTIONS = [
    { id: "TX-A1", label: "Safaa→Jawan", duration: 2, track: 0, color: "amethyst" },
    { id: "TX-B7", label: "CryptoKitties", duration: 8, track: mode === "parallel" ? 1 : 0, color: "crimson" },
    { id: "TX-C3", label: "Aya→Noor", duration: 2, track: mode === "parallel" ? 2 : 0, color: "amethyst" },
    { id: "TX-D9", label: "DEX Swap", duration: 3, track: mode === "parallel" ? 3 : 0, color: "rose" },
  ];

  const startSim = useCallback(() => {
    setRunning(true); setElapsed(0);
    const states = {}; TRANSACTIONS.forEach(tx => { states[tx.id] = "pending"; });
    setTxStates({ ...states });

    if (mode === "parallel") {
      TRANSACTIONS.forEach((tx, i) => {
        setTimeout(() => setTxStates(s => ({ ...s, [tx.id]: "running" })), i * 100);
        setTimeout(() => setTxStates(s => ({ ...s, [tx.id]: "done" })), tx.duration * 600 + i * 100);
      });
    } else {
      let cumDelay = 0;
      TRANSACTIONS.forEach((tx) => {
        const start = cumDelay;
        setTimeout(() => setTxStates(s => ({ ...s, [tx.id]: "running" })), start * 600);
        setTimeout(() => setTxStates(s => ({ ...s, [tx.id]: "done" })), (start + tx.duration) * 600);
        cumDelay += tx.duration;
      });
    }

    const totalDuration = mode === "parallel"
      ? Math.max(...TRANSACTIONS.map(t => t.duration)) * 600 + 300
      : TRANSACTIONS.reduce((a, t) => a + t.duration, 0) * 600 + 300;

    let t = 0; const tick = setInterval(() => { t += 50; setElapsed(t); }, 50);
    setTimeout(() => { clearInterval(tick); setRunning(false); }, totalDuration + 200);
    timerRef.current = setTimeout(() => clearInterval(tick), totalDuration + 300);
  }, [mode]);

  const reset = () => { setRunning(false); setTxStates({}); setElapsed(0); clearTimeout(timerRef.current); };
  const tracks = mode === "parallel" ? 4 : 1;
  const trackLabels = mode === "parallel" ? ["Core 1", "Core 2", "Core 3", "Core 4"] : ["Processor"];

  return (
    <div className="sim-container" style={{ width: "100%" }}>
      <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Activity size={14} style={{ color: running ? "#4ade80" : "var(--muted)" }} />
          <span className="t-caption c-muted">{mode === "parallel" ? "Parallel" : "Sequential"}</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {elapsed > 0 && <span className="t-caption" style={{ color: "var(--amethyst-bright)" }}>{(elapsed / 1000).toFixed(1)}s</span>}
          <button onClick={reset} className="btn btn-ghost" style={{ padding: "0.3rem 0.8rem", fontSize: "0.7rem" }}><RotateCcw size={12} /> Reset</button>
          <button onClick={startSim} disabled={running} className="btn btn-primary" style={{ padding: "0.3rem 0.8rem", fontSize: "0.7rem" }}><Play size={12} /> Run</button>
        </div>
      </div>
      {Array.from({ length: tracks }).map((_, ti) => {
        const trackTxs = TRANSACTIONS.filter(t => t.track === ti);
        return (
          <div key={ti} className="sim-track">
            <span className="t-caption c-muted" style={{ minWidth: "64px", fontSize: "0.65rem" }}>{trackLabels[ti]}</span>
            <div style={{ flex: 1, display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {trackTxs.map(tx => {
                const s = txStates[tx.id];
                const cls = s === "running" ? "tx-running" : s === "done" ? "tx-done" : "tx-pending";
                return (
                  <motion.span key={tx.id} className={`tx-chip ${cls}`}
                    animate={s === "running" ? { boxShadow: ["0 0 8px var(--amethyst-glow)", "0 0 20px var(--amethyst-glow)", "0 0 8px var(--amethyst-glow)"] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}>
                    {s === "done" ? <CheckCircle size={10} /> : s === "running" ? <Activity size={10} /> : <Clock size={10} />}
                    {tx.label}
                  </motion.span>
                );
              })}
              {trackTxs.length === 0 && <span className="t-caption c-muted" style={{ fontSize: "0.7rem" }}>— idle —</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ==============================
   LIVELOCK SIMULATOR
============================== */
function LivelockDemo() {
  const [phase, setPhase] = useState(0); 
  const phases = ["Idle", "Acquiring Locks", "Conflict Detected", "Aborted!", "SABER: No Coordination"];

  return (
    <div className="sim-container" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
        <span className="badge badge-a">Adversarial Livelock Demo</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-ghost" style={{ fontSize: "0.7rem", padding: "0.3rem 0.7rem" }} onClick={() => setPhase(Math.max(0, phase - 1))}><ChevronLeft size={12} /></button>
          <span className="t-caption c-muted" style={{ lineHeight: "2" }}>{phase + 1}/5</span>
          <button className="btn btn-primary" style={{ fontSize: "0.7rem", padding: "0.3rem 0.7rem" }} onClick={() => setPhase(Math.min(4, phase + 1))}><ChevronRight size={12} /></button>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <motion.span key={phase} className="badge badge-a" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{phases[phase]}</motion.span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center" }}>
        <motion.div className="glass-amethyst" style={{ padding: "1rem", textAlign: "center", borderRadius: "var(--r-md)" }} animate={phase === 3 ? { opacity: 0.4, scale: 0.95 } : { opacity: 1, scale: 1 }}>
          <div className="c-amethyst" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Safaa</div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <motion.span className="badge" style={{ background: phase >= 1 ? "rgba(155,93,229,0.3)" : "rgba(255,255,255,0.05)", color: phase >= 1 ? "#C084FC" : "var(--muted)" }}><Lock size={10} /> o1</motion.span>
            <span className="badge badge-neutral">o2 wants</span>
          </div>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {["o1", "o2"].map((obj, i) => (
            <motion.div key={obj} className="glass" style={{ padding: "0.5rem 0.8rem", textAlign: "center", borderRadius: "var(--r-sm)", border: phase === 2 ? "1px solid #E5293D" : "1px solid var(--glass-border)" }} animate={phase === 2 ? { boxShadow: "0 0 12px rgba(229,41,61,0.4)" } : {}}>
              <span className="t-caption c-muted">{obj}</span>
              {phase >= 1 && <div style={{ fontSize: "0.6rem", color: i === 0 ? "var(--amethyst-bright)" : "var(--crimson-bright)", marginTop: "0.2rem" }}>{i === 0 ? "locked by Safaa" : "locked by Jawan"}</div>}
            </motion.div>
          ))}
        </div>
        <motion.div className="glass-crimson" style={{ padding: "1rem", textAlign: "center", borderRadius: "var(--r-md)" }} animate={phase === 3 ? { opacity: 0.4, scale: 0.95 } : { opacity: 1, scale: 1 }}>
          <div className="c-crimson" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Jawan</div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <span className="badge badge-neutral">o1 wants</span>
            <motion.span className="badge" style={{ background: phase >= 1 ? "rgba(229,41,61,0.3)" : "rgba(255,255,255,0.05)", color: phase >= 1 ? "#FF4D63" : "var(--muted)" }}><Lock size={10} /> o2</motion.span>
          </div>
        </motion.div>
      </div>
      {phase === 3 && (
        <motion.div className="callout callout-danger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1rem" }}>
          <XCircle size={16} /> <span className="t-body">Both aborted. Deadlock exploited as DoS.</span>
        </motion.div>
      )}
      {phase === 4 && (
        <motion.div className="callout callout-success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1rem" }}>
          <CheckCircle size={16} /> <span className="t-body">SABER handles locks centrally. Livelock-free.</span>
        </motion.div>
      )}
    </div>
  );
}

/* ==============================
   SABER WORKFLOW DIAGRAM
============================== */
function SaberWorkflow() {
  const [activeStep, setActiveStep] = useState(-1);
  const steps = [
    { id: "1", label: "Client submits TX", node: "Client", color: "var(--silver)" },
    { id: "2", label: "CNs validate + order + LOCK", node: "CN", color: "var(--amethyst-bright)" },
    { id: "3", label: "Assign to EN Group", node: "CN → EN", color: "var(--rose)" },
    { id: "4", label: "ENs execute in parallel", node: "EN", color: "var(--crimson-bright)" },
    { id: "5", label: "ENs return majority vote", node: "EN → CN", color: "var(--rose)" },
    { id: "6", label: "CNs unlock + write", node: "CN", color: "var(--amethyst-bright)" },
  ];

  return (
    <div className="sim-container" style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <span className="badge badge-a">Interactive: SABER Workflow</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {steps.map((step, i) => (
          <motion.div key={step.id} onClick={() => setActiveStep(i === activeStep ? -1 : i)}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.7rem 1rem", borderRadius: "var(--r-sm)", cursor: "pointer",
              background: activeStep === i ? "rgba(155,93,229,0.12)" : "rgba(255,255,255,0.02)",
              border: activeStep === i ? "1px solid rgba(155,93,229,0.35)" : "1px solid rgba(255,255,255,0.04)"
            }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: step.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#000", flexShrink: 0 }}>
              {step.id}
            </div>
            <div style={{ flex: 1 }}>
              <span className="t-body" style={{ fontSize: "0.85rem" }}>{step.label}</span>
            </div>
            {activeStep === i && <CheckCircle size={14} style={{ color: "var(--amethyst-bright)" }} />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ==============================
   BENCHMARK CHART
============================== */
function BenchmarkChart() {
  const data = [
    { label: "Baseline\n(Seq)", tps: 1, color: "var(--crimson)" },
    { label: "2 Groups", tps: 1.8, color: "var(--rose)" },
    { label: "4 Groups", tps: 3.5, color: "#a78bfa" },
    { label: "8 Groups", tps: 6.2, color: "var(--amethyst)" },
    { label: "16 Groups", tps: 9.1, color: "var(--amethyst-bright)" },
    { label: "32 Groups", tps: 11.4, color: "#e879f9" },
  ];
  const max = Math.max(...data.map(d => d.tps));

  return (
    <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.3)", borderRadius: "var(--r-lg)", border: "1px solid var(--glass-border)" }}>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <span className="badge badge-a"><BarChart2 size={12} /> Scaling</span>
      </div>
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-end", height: "160px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--silver)", fontFamily: "monospace" }}>{d.tps}x</span>
            <motion.div initial={{ height: 0 }} animate={{ height: `${(d.tps / max) * 130}px` }} transition={{ delay: i * 0.1, duration: 0.8 }}
              style={{ width: "100%", background: d.color, borderRadius: "4px 4px 0 0", boxShadow: `0 0 16px ${d.color}60`, minHeight: "4px" }} />
            <span style={{ fontSize: "0.6rem", color: "var(--muted)", textAlign: "center", lineHeight: "1.2", whiteSpace: "pre-line" }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==============================
   ALL SLIDES CONTENT
============================== */
function getSlides() {
  return [
    // 0: TITLE
    <div key="0" className="slide-wrapper" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img src="/saber_hero.png" style={{ objectFit: "cover", width: "100%", height: "100%", opacity: 0.18 }} alt="" />
      </div>
      <div style={{ position: "relative", zIndex: 5, maxWidth: "900px" }}>
        <span className="badge badge-a" style={{ marginBottom: "2rem" }}>Blockchain Seminar 2026</span>
        <h1 className="t-display c-grad" style={{ marginBottom: "1.5rem" }}>SABER</h1>
        <p className="t-hero" style={{ marginBottom: "1rem", fontWeight: 300 }}>Parallel & Asynchronous<br />Smart Contract Execution</p>
        <p className="t-subtitle c-muted" style={{ marginBottom: "3rem" }}>Liu, Li, Cheng, Asokan, Song · arXiv:2306.05007</p>
        <div className="glass" style={{ display: "inline-block", padding: "0.8rem 2rem", borderRadius: "var(--r-pill)" }}>
          <span className="t-body c-silver">Presented by </span><strong className="c-amethyst">Aya khalila</strong>
        </div>
      </div>
    </div>,

    // 1: AGENDA
    <div key="1" className="slide-wrapper">
      <span className="badge badge-neutral" style={{ width: "max-content", marginBottom: "1rem" }}>Roadmap</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>What We Will Cover</h2>
      <div className="grid-2" style={{ flex: 1 }}>
        {[
          { num: "01", title: "Scalability Crisis", desc: "Why blockchains choke" },
          { num: "02", title: "SABER Paradigm", desc: "Separating consensus & execution" },
          { num: "03", title: "Protocol Deep Dive", desc: "CNs, ENs, majority voting" },
          { num: "04", title: "Saber for Ethereum", desc: "Zero hard forks" },
          { num: "05", title: "SaberLedger", desc: "Permissionless blockchain" },
          { num: "06", title: "Benchmark Results", desc: "3,467 nodes worldwide" },
          { num: "07", title: "Live Simulations", desc: "Interactive demos" },
          { num: "08", title: "Future Directions", desc: "Scalability frontier" },
        ].map((item, i) => (
          <div key={i} className="glass" style={{ padding: "1rem 1.2rem", display: "flex", gap: "1rem" }}>
            <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--amethyst)", fontWeight: 700 }}>{item.num}</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>{item.title}</div>
              <div className="t-caption c-muted">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // 2: BASICS
    <div key="2" className="slide-wrapper">
      <span className="badge badge-neutral" style={{ width: "max-content", marginBottom: "1rem" }}>Background</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Blockchains & Smart Contracts</h2>
      <div className="grid-2" style={{ flex: 1, alignItems: "center" }}>
        <div className="flex-col" style={{ gap: "1rem" }}>
          <div className="glass" style={{ padding: "1.2rem", display: "flex", gap: "1rem" }}>
            <Database size={18} style={{ color: "var(--amethyst-bright)" }} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--amethyst-bright)" }}>Decentralized Ledger</div>
              <p className="t-body c-muted">Append-only log replicated across all nodes.</p>
            </div>
          </div>
          <div className="glass" style={{ padding: "1.2rem", display: "flex", gap: "1rem" }}>
            <Code2 size={18} style={{ color: "var(--crimson-bright)" }} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--crimson-bright)" }}>Smart Contracts</div>
              <p className="t-body c-muted">Programs stored on-chain that execute autonomously.</p>
            </div>
          </div>
          <div className="glass" style={{ padding: "1.2rem", display: "flex", gap: "1rem" }}>
            <Shield size={18} style={{ color: "var(--rose)" }} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--rose)" }}>Byzantine Fault Tolerance</div>
              <p className="t-body c-muted">Consensus achieved even if up to f nodes are malicious.</p>
            </div>
          </div>
        </div>
        <div className="img-container">
          <img src="/bft_nodes.png" style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="BFT Nodes" />
        </div>
      </div>
    </div>,

    // 3: CRISIS
    <div key="3" className="slide-wrapper" style={{ justifyContent: "center", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0 }}><img src="/cryptokitties_chaos.png" style={{ objectFit: "cover", width: "100%", height: "100%", opacity: 0.12 }} alt="" /></div>
      <div style={{ position: "relative", zIndex: 5, maxWidth: "800px", margin: "0 auto" }}>
        <span className="badge badge-c" style={{ marginBottom: "2rem" }}><AlertTriangle size={12} /> The Crisis</span>
        <h2 className="t-hero" style={{ marginBottom: "1.5rem" }}>December 2017.<br /><span className="c-crimson">CryptoKitties</span><br />broke Ethereum.</h2>
        <p className="t-subtitle c-muted" style={{ marginBottom: "3rem" }}>A single DApp with a complex genetic algorithm flooded the network. Simple ETH transfers were unconfirmable.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div className="glass-crimson stat-box"><div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--crimson-bright)" }}>15</div><div>Ethereum TPS</div></div>
          <div className="glass-crimson stat-box"><div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--crimson-bright)" }}>1hr+</div><div>Confirm time</div></div>
        </div>
      </div>
    </div>,

    // 4: ROOT CAUSE (Blocking)
    <div key="4" className="slide-wrapper">
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><AlertTriangle size={12} /> Root Cause</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>The Blocking Problem</h2>
      <div className="callout callout-danger" style={{ marginBottom: "1.5rem" }}>
        <AlertTriangle size={16} />
        <div>
          <div style={{ fontWeight: 700 }}>Sequential Execution is Flawed</div>
          <p className="t-body">Execution is tightly coupled with consensus. A complex transaction holds the processor, starving simple payments.</p>
        </div>
      </div>
      <div className="flex-col" style={{ gap: "0.5rem" }}>
        <div className="t-caption c-muted">Traditional Queue</div>
        <div className="glass" style={{ padding: "0.8rem", border: "1px solid rgba(255,255,255,0.1)" }}><span className="badge badge-neutral">simple</span> Safaa → Jawan</div>
        <div className="glass-crimson" style={{ padding: "0.8rem", border: "1px solid rgba(229,41,61,0.4)" }}><span className="badge badge-c">complex</span> CryptoKitties Breed <span className="c-crimson" style={{ float: "right" }}>[BLOCKING]</span></div>
        <div className="glass" style={{ padding: "0.8rem", opacity: 0.5 }}><span className="badge badge-neutral">simple</span> DEX Swap <span className="c-muted" style={{ float: "right" }}>[waiting]</span></div>
      </div>
    </div>,

    // 5: ROOT CAUSE (Formula)
    <div key="5" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><AlertTriangle size={12} /> Root Cause</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Classifying Complexity</h2>
      <div className="grid-2" style={{ alignItems: "center" }}>
        <div className="formula-box" style={{ borderRadius: "var(--r-md)" }}>
          <div className="t-caption c-muted" style={{ marginBottom: "0.5rem" }}>Treat as simple TX if:</div>
          <div style={{ fontSize: "1.5rem" }}>t₁ &gt; (k/m) · t₂</div>
          <div className="t-caption c-muted" style={{ marginTop: "1rem", fontSize: "0.8rem", lineHeight: 1.5 }}>
            t₁ = consensus latency<br />
            t₂ = execution time<br />
            k = batch size<br />
            m = parallel groups
          </div>
        </div>
        <div className="img-container">
          <img src="/blockchain_congestion.png" style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="Congestion" />
        </div>
      </div>
    </div>,

    // 6: PRIOR ART (Sharding issues)
    <div key="6" className="slide-wrapper">
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><XCircle size={12} /> Prior Art</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Existing Solutions Fall Short</h2>
      <div className="flex-col" style={{ gap: "1rem" }}>
        <div className="callout callout-warning">
          <AlertTriangle size={16} />
          <div>
            <div style={{ fontWeight: 700 }}>Two-Phase Locking</div>
            <p>Cross-shard transactions must lock data in Phase 1 before accessing in Phase 2. Every step requires BFT consensus.</p>
          </div>
        </div>
        <div className="callout callout-warning">
          <AlertTriangle size={16} />
          <div>
            <div style={{ fontWeight: 700 }}>Massive Group Sizes</div>
            <p>Traditional sharding requires 600+ nodes per group to achieve failure probability &lt;10⁻⁶. This limits parallelism.</p>
          </div>
        </div>
      </div>
    </div>,

    // 7: PRIOR ART (Livelock)
    <div key="7" className="slide-wrapper">
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><XCircle size={12} /> Prior Art</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>The Livelock Problem</h2>
      <p className="t-subtitle c-muted" style={{ marginBottom: "2rem" }}>Adversaries can exploit lock competition as a free DoS attack.</p>
      <LivelockDemo />
    </div>,

    // 8: DESIGN GOALS
    <div key="8" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Target size={12} /> Design Goals</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>What SABER Must Achieve</h2>
      <div className="flex-col" style={{ gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass" style={{ padding: "1.5rem", display: "flex", gap: "1rem" }}>
          <Users size={24} style={{ color: "var(--amethyst)" }} />
          <div><div style={{ fontWeight: 700, color: "var(--amethyst)" }}>Minimized Group Size</div><p className="t-body c-muted">Reduce from 600 to 70 nodes.</p></div>
        </div>
        <div className="glass" style={{ padding: "1.5rem", display: "flex", gap: "1rem" }}>
          <GitBranch size={24} style={{ color: "var(--rose)" }} />
          <div><div style={{ fontWeight: 700, color: "var(--rose)" }}>Zero EN Coordination</div><p className="t-body c-muted">Groups execute completely independently.</p></div>
        </div>
        <div className="glass" style={{ padding: "1.5rem", display: "flex", gap: "1rem" }}>
          <Shield size={24} style={{ color: "var(--crimson)" }} />
          <div><div style={{ fontWeight: 700, color: "var(--crimson)" }}>No Adversarial Livelocks</div><p className="t-body c-muted">DoS attacks must be structurally impossible.</p></div>
        </div>
      </div>
    </div>,

    // 9: SABER OVERVIEW
    <div key="9" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Zap size={12} /> SABER</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Execution ≠ Consensus</h2>
      <div className="grid-2" style={{ alignItems: "center" }}>
        <div className="img-container">
          <img src="/saber_architecture.png" style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="Architecture" />
        </div>
        <div className="flex-col" style={{ gap: "1rem" }}>
          <div className="glass-amethyst" style={{ padding: "1.5rem" }}>
            <div style={{ fontWeight: 700, color: "var(--amethyst-bright)" }}>Consensus Nodes (CNs)</div>
            <p className="t-body c-muted">Handle ordering, state locking, result collection. Run BFT.</p>
          </div>
          <div className="glass-crimson" style={{ padding: "1.5rem" }}>
            <div style={{ fontWeight: 700, color: "var(--crimson-bright)" }}>Execution Nodes (ENs)</div>
            <p className="t-body c-muted">m independent groups. Execute complex TXs autonomously.</p>
          </div>
        </div>
      </div>
    </div>,

    // 10: SIMPLE VS COMPLEX
    <div key="10" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><GitBranch size={12} /> Routing</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Simple vs Complex Transactions</h2>
      <div className="grid-2">
        <div className="glass-amethyst" style={{ padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "var(--amethyst-bright)", fontSize: "1.2rem", marginBottom: "1rem" }}>Simple Transactions</div>
          <ul style={{ paddingLeft: "1.5rem", color: "var(--silver)", lineHeight: 1.8 }}>
            <li>Crypto payments</li>
            <li>NFT transfers</li>
            <li>Simple reads/writes</li>
          </ul>
          <div className="t-mono c-amethyst" style={{ marginTop: "1rem", fontSize: "0.8rem" }}>CN: Validate → Order → Execute</div>
        </div>
        <div className="glass-crimson" style={{ padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "var(--crimson-bright)", fontSize: "1.2rem", marginBottom: "1rem" }}>Complex Transactions</div>
          <ul style={{ paddingLeft: "1.5rem", color: "var(--silver)", lineHeight: 1.8 }}>
            <li>Genetic algorithms</li>
            <li>On-chain ML inference</li>
            <li>Complex DeFi strategies</li>
          </ul>
          <div className="t-mono c-crimson" style={{ marginTop: "1rem", fontSize: "0.8rem" }}>EN: Assign → Execute → Vote</div>
        </div>
      </div>
    </div>,

    // 11: LIVE SIM
    <div key="11" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Play size={12} /> Live Simulation</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Sequential vs Parallel</h2>
      <div className="grid-2">
        <div className="flex-col" style={{ gap: "0.5rem" }}>
          <div style={{ fontWeight: 700, color: "var(--crimson-bright)" }}>Sequential EVM</div>
          <TxSimulator mode="sequential" />
        </div>
        <div className="flex-col" style={{ gap: "0.5rem" }}>
          <div style={{ fontWeight: 700, color: "var(--amethyst-bright)" }}>Parallel SABER</div>
          <TxSimulator mode="parallel" />
        </div>
      </div>
    </div>,

    // 12: CONSENSUS NODES
    <div key="12" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Network size={12} /> Protocol</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>CNs: The Orchestrators</h2>
      <div className="grid-2" style={{ alignItems: "center" }}>
        <div className="flex-col" style={{ gap: "1rem" }}>
          <div className="glass" style={{ padding: "1rem" }}><div style={{ fontWeight: 700, color: "var(--amethyst-bright)" }}>TX Ordering</div><p className="t-body c-muted">Assign sequence numbers, route to groups.</p></div>
          <div className="glass" style={{ padding: "1rem" }}><div style={{ fontWeight: 700, color: "var(--rose)" }}>State Locking</div><p className="t-body c-muted">Lock state centrally to prevent livelocks.</p></div>
          <div className="glass" style={{ padding: "1rem" }}><div style={{ fontWeight: 700, color: "var(--amethyst-bright)" }}>Result Collection</div><p className="t-body c-muted">Verify multisigs and write to ledger.</p></div>
        </div>
        <SaberWorkflow />
      </div>
    </div>,

    // 13: EXEC NODES INDEPENDENCE
    <div key="13" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem", alignSelf: "center" }}><Cpu size={12} /> Protocol</span>
      <h2 className="t-title" style={{ marginBottom: "2rem", textAlign: "center" }}>ENs: The Workers</h2>
      <div className="callout callout-info" style={{ maxWidth: "800px", margin: "0 auto 2rem" }}>
        <Hash size={24} />
        <div>
          <div style={{ fontWeight: 700 }}>Independence Guarantee</div>
          <p>Because CNs use BFT consensus to assign sequence numbers, the same number is never assigned to two TXs. ENs execute without consulting anyone else.</p>
        </div>
      </div>
      <div className="img-container" style={{ flex: 1, minHeight: 0, width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        <img src="/parallel_processing.png" style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="Parallel" />
      </div>
    </div>,

    // 14: DISPUTE RESOLUTION
    <div key="14" className="slide-wrapper">
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><Cpu size={12} /> Protocol</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Resolving Disputes</h2>
      <div className="grid-2">
        <div className="flex-col" style={{ gap: "0.8rem" }}>
          <div className="glass" style={{ padding: "1rem" }}><div style={{ fontWeight: 700 }}>zk-SNARKs</div><div className="c-crimson text-sm">Proof generation too slow</div></div>
          <div className="glass" style={{ padding: "1rem" }}><div style={{ fontWeight: 700 }}>Trusted Enclaves (SGX)</div><div className="c-crimson text-sm">Hardware vendor lock-in</div></div>
          <div className="glass" style={{ padding: "1rem" }}><div style={{ fontWeight: 700 }}>Interactive (TrueBit)</div><div className="c-crimson text-sm">O(log n) rounds per dispute</div></div>
          <div className="glass-amethyst" style={{ padding: "1rem" }}><div style={{ fontWeight: 700, color: "var(--amethyst-bright)" }}>Majority Voting ✓</div><div className="c-silver text-sm">Chosen by SABER. Simple, reliable.</div></div>
        </div>
        <div className="glass" style={{ padding: "2rem", alignSelf: "center", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--amethyst-bright)" }}>70</div>
          <div style={{ fontWeight: 700, marginBottom: "1rem" }}>Nodes Per Group</div>
          <p className="t-body c-muted">Sufficient to achieve &lt;10⁻⁶ failure probability using majority voting.</p>
        </div>
      </div>
    </div>,

    // 15: LIVELOCK PREVENTION
    <div key="15" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Shield size={12} /> Security</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Livelock-Free by Design</h2>
      <div className="grid-2">
        <div className="glass-crimson" style={{ padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "var(--crimson-bright)", marginBottom: "1rem" }}>The Attack (Old Sharding)</div>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--silver)", lineHeight: 1.8 }}>
            <li>Safaa & Jawan acquire first locks</li>
            <li>Both try to get second lock</li>
            <li>Deadlock → Abort</li>
            <li>Safaa pays NO fee. DoS is free.</li>
          </ul>
        </div>
        <div className="glass-amethyst" style={{ padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "var(--amethyst-bright)", marginBottom: "1rem" }}>The Fix (SABER)</div>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--silver)", lineHeight: 1.8 }}>
            <li>CNs order both TXs first via BFT</li>
            <li>First TX gets all locks</li>
            <li>Second TX waits cleanly</li>
            <li>Zero aborts. DoS is impossible.</li>
          </ul>
        </div>
      </div>
    </div>,

    // 16: ASYNC EXECUTION
    <div key="16" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Activity size={12} /> Async</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Asynchronous Execution</h2>
      <div className="glass" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <div className="t-caption c-muted" style={{ marginBottom: "0.5rem" }}>Synchronous (Traditional)</div>
        <div style={{ height: "40px", background: "var(--crimson-soft)", display: "flex", alignItems: "center", paddingLeft: "1rem", color: "var(--crimson-bright)", border: "1px solid var(--crimson-glow)" }}>
          Simple TX → WAIT FOR COMPLEX TX → Simple TX
        </div>
        <div className="t-caption c-muted" style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Asynchronous (SABER)</div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ flex: 1, height: "40px", background: "var(--amethyst-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--amethyst-bright)", border: "1px solid var(--amethyst-glow)" }}>Simple TXs flowing non-stop</div>
          <div style={{ flex: 1.5, height: "40px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--silver)", border: "1px dashed var(--glass-border)" }}>Complex TX executing in background</div>
        </div>
      </div>
      <p className="t-body c-muted">CNs keep processing simple payments. ENs return complex results when finished.</p>
    </div>,

    // 17: RANDOMNESS
    <div key="17" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Shuffle size={12} /> Randomness</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Unbiasable Group Assignment</h2>
      <div className="grid-2">
        <div className="glass" style={{ padding: "1.5rem" }}>
          <Globe size={24} style={{ color: "var(--amethyst-bright)", marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Distributed Generation</div>
          <p className="t-body c-muted">Every epoch, ENs run off-chain protocol to generate unbiased random number `r`.</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <Shield size={24} style={{ color: "var(--crimson-bright)", marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Sybil Resistant</div>
          <p className="t-body c-muted">ENs deposit ETH. Assignment uses `r` and node keys so attackers cannot pick their group.</p>
        </div>
      </div>
    </div>,

    // 18: SHUFFLE CODE
    <div key="18" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Code2 size={12} /> Algorithm</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "2rem" }}>The Shuffle Function</h2>
      <div className="code-block" style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.1rem" }}>
        <div style={{ color: "var(--muted)", marginBottom: "1rem" }}>// SABER Shuffle function</div>
        <div><span className="c-rose">function</span> <span className="c-amethyst">Shuffle</span>(r) {"{"}</div>
        <div style={{ paddingLeft: "1.5rem" }}>  verify r; empty groups;</div>
        <div style={{ paddingLeft: "1.5rem" }}>  <span className="c-rose">for each</span> EN <span className="c-rose">in</span> ENs {"{"}</div>
        <div style={{ paddingLeft: "3rem" }}>    i ← <span className="c-amethyst">H</span>(r, EN) <span className="c-rose">mod</span> m;</div>
        <div style={{ paddingLeft: "3rem" }}>    <span className="c-amethyst">add</span> EN <span className="c-rose">to</span> groups[i];</div>
        <div style={{ paddingLeft: "1.5rem" }}>  {"}"}</div>
        <div>{"}"}</div>
      </div>
    </div>,

    // 19: NOTATION
    <div key="19" className="slide-wrapper">
      <span className="badge badge-neutral" style={{ width: "max-content", marginBottom: "1rem" }}><BookOpen size={12} /> Reference</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Notation & Symbols</h2>
      <div className="grid-2">
        <table className="comp-table">
          <tbody>
            <tr><td className="t-mono c-amethyst">CN</td><td>Consensus Node</td></tr>
            <tr><td className="t-mono c-amethyst">EN</td><td>Execution Node</td></tr>
            <tr><td className="t-mono c-amethyst">TX</td><td>Transaction</td></tr>
            <tr><td className="t-mono c-amethyst">m</td><td># execution groups</td></tr>
          </tbody>
        </table>
        <table className="comp-table">
          <tbody>
            <tr><td className="t-mono c-crimson">n′</td><td>Nodes per group</td></tr>
            <tr><td className="t-mono c-crimson">sn</td><td>Sequence number</td></tr>
            <tr><td className="t-mono c-crimson">σ</td><td>Signature</td></tr>
            <tr><td className="t-mono c-crimson">Aggre()</td><td>Sig aggregation</td></tr>
          </tbody>
        </table>
      </div>
    </div>,

    // 20: PROTOCOL FLOW 1
    <div key="20" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Workflow size={12} /> Protocol</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>End-to-End Flow (Part 1)</h2>
      <div className="flex-col" style={{ gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass" style={{ padding: "1.2rem" }}><span className="t-mono c-silver mr-4">2.1</span> Client submits complex TX to CNs.</div>
        <div className="glass-amethyst" style={{ padding: "1.2rem" }}><span className="t-mono c-amethyst mr-4">2.2</span> CNs validate and order via BFT.</div>
        <div className="glass-amethyst" style={{ padding: "1.2rem" }}><span className="t-mono c-amethyst mr-4">2.3</span> CNs lock all state objects for this TX.</div>
        <div className="glass" style={{ padding: "1.2rem" }}><span className="t-mono c-rose mr-4">2.4</span> CNs assign ⟨TX, sn⟩ to EN group and move on.</div>
      </div>
    </div>,

    // 21: PROTOCOL FLOW 2
    <div key="21" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Workflow size={12} /> Protocol</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>End-to-End Flow (Part 2)</h2>
      <div className="flex-col" style={{ gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass-crimson" style={{ padding: "1.2rem" }}><span className="t-mono c-crimson mr-4">2.5</span> EN group executes independently, takes majority vote.</div>
        <div className="glass" style={{ padding: "1.2rem" }}><span className="t-mono c-rose mr-4">2.6</span> ENs return ⟨TX, res, sn⟩ with multisig to CNs.</div>
        <div className="glass-amethyst" style={{ padding: "1.2rem" }}><span className="t-mono c-amethyst mr-4">2.7</span> CNs verify multisig, unlock states, write to ledger.</div>
      </div>
    </div>,

    // 22: VALIDITY
    <div key="22" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Shield size={12} /> Security</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Validity Checking by CNs</h2>
      <div className="callout callout-warning" style={{ marginBottom: "2rem" }}>
        <AlertTriangle size={16} />
        <div>
          <div style={{ fontWeight: 700 }}>The Spam Vector</div>
          <p>Without CN checking, an attacker could flood ENs with invalid TXs, delaying legit ones.</p>
        </div>
      </div>
      <div className="glass-amethyst" style={{ padding: "1.5rem" }}>
        <div style={{ fontWeight: 700, color: "var(--amethyst-bright)", marginBottom: "0.5rem" }}>SABER's Defense</div>
        <p className="t-body c-white">CNs reject invalid TXs immediately during consensus. Rejection takes O(1) rounds, and attacker still pays gas.</p>
      </div>
    </div>,

    // 23: MULTISIG
    <div key="23" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Key size={12} /> Cryptography</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Multisignatures</h2>
      <div className="glass" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <p className="t-body c-silver" style={{ marginBottom: "1.5rem", fontSize: "1.1rem", textAlign: "center" }}>How ENs prove correctness without O(n) verification cost.</p>
        <ol style={{ color: "var(--white)", paddingLeft: "2rem", lineHeight: 2, fontSize: "1.1rem" }}>
          <li>Multiple ENs sign result message M</li>
          <li>Signatures aggregated: Aggre(σ₁,...,σₙ) → σ̃</li>
          <li>CNs verify single multisig in O(1) time</li>
          <li>Gas cost is constant regardless of smart contract complexity!</li>
        </ol>
      </div>
    </div>,

    // 24: MULTISIG CODE
    <div key="24" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Code2 size={12} /> Code</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Submission Verification</h2>
      <div className="code-block" style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1rem" }}>
        <div style={{ color: "var(--muted)", marginBottom: "1rem" }}>// ExecutionManager.sol</div>
        <div><span className="c-rose">function</span> <span className="c-amethyst">Submit</span>(i, sid, M, eσ) {"{"}</div>
        <div style={{ paddingLeft: "1.5rem" }}>  <span className="c-rose">require</span>(multisig_verify(i, M, eσ));</div>
        <div style={{ paddingLeft: "1.5rem" }}>  <span className="c-rose">require</span>(tasks[i][sid] != null);</div>
        <div style={{ paddingLeft: "1.5rem" }}>  <span className="c-muted">// Update state based on M</span></div>
        <div style={{ paddingLeft: "1.5rem" }}>  execute(M.code, M.input);</div>
        <div>{"}"}</div>
      </div>
    </div>,

    // 25: ETHEREUM
    <div key="25" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Globe size={12} /> Ethereum</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Zero Hard Forks</h2>
      <div className="grid-2">
        <div className="glass" style={{ padding: "1.5rem" }}>
          <Database size={24} style={{ color: "var(--amethyst-bright)", marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700 }}>CNs = Existing Miners</div>
          <p className="t-body c-muted">All Ethereum miners collectively form the consensus layer natively.</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <Cpu size={24} style={{ color: "var(--crimson-bright)", marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700 }}>ENs = Opt-in Miners</div>
          <p className="t-body c-muted">Miners register as ENs by calling contract and depositing stake.</p>
        </div>
      </div>
    </div>,

    // 26: EXEC MANAGER 1
    <div key="26" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Settings size={12} /> Smart Contract</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Execution Manager</h2>
      <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass-amethyst" style={{ padding: "1.5rem" }}>
          <div className="t-mono c-amethyst" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Register()</div>
          <p className="c-silver">Nodes deposit ETH. Added to list based on stake size.</p>
        </div>
        <div className="glass-amethyst" style={{ padding: "1.5rem" }}>
          <div className="t-mono c-amethyst" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Shuffle(r)</div>
          <p className="c-silver">Called every epoch to reassign ENs to groups dynamically.</p>
        </div>
      </div>
    </div>,

    // 27: EXEC MANAGER 2
    <div key="27" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Settings size={12} /> Smart Contract</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Execution Manager</h2>
      <div className="glass-crimson" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <div className="t-mono c-crimson" style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>Submit(i, sid, M, σ̃)</div>
        <ul style={{ paddingLeft: "1.5rem", color: "var(--silver)", lineHeight: 2 }}>
          <li>ENs execute off-chain</li>
          <li>Sign result with private key</li>
          <li>Aggregate signatures into multisig</li>
          <li>Submit on-chain (constant gas cost)</li>
        </ul>
      </div>
    </div>,

    // 28: SABERLEDGER INTRO
    <div key="28" className="slide-wrapper" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0 }}><img src="/saber_hero.png" style={{ objectFit: "cover", width: "100%", height: "100%", opacity: 0.1 }} alt="" /></div>
      <div style={{ position: "relative", zIndex: 5, maxWidth: "800px" }}>
        <span className="badge badge-c" style={{ marginBottom: "2rem" }}><Layers size={12} /> New Chain</span>
        <h1 className="t-hero c-grad" style={{ marginBottom: "1.5rem" }}>SaberLedger</h1>
        <p className="t-subtitle c-muted">A purpose-built public blockchain. Consensus, execution, AND storage are separated and independently scalable.</p>
      </div>
    </div>,

    // 29: SABERLEDGER ARCH
    <div key="29" className="slide-wrapper">
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><Layers size={12} /> SaberLedger</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Full Architecture</h2>
      <div className="grid-3">
        <div className="glass" style={{ padding: "1.5rem" }}>
          <Network size={24} style={{ color: "var(--amethyst)", marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700 }}>Consensus Layer</div>
          <p className="t-caption c-muted mt-2">BFT Rotating Committee</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <Cpu size={24} style={{ color: "var(--crimson)", marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700 }}>Execution Layer</div>
          <p className="t-caption c-muted mt-2">m independent groups</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <Database size={24} style={{ color: "var(--rose)", marginBottom: "1rem" }} />
          <div style={{ fontWeight: 700 }}>Storage Layer</div>
          <p className="t-caption c-muted mt-2">Distributed IPFS style</p>
        </div>
      </div>
    </div>,

    // 30: STATE SHARDING
    <div key="30" className="slide-wrapper">
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><Database size={12} /> Sharding</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>State Sharding</h2>
      <div className="grid-2">
        <div className="glass-amethyst" style={{ padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "var(--amethyst-bright)", marginBottom: "1rem" }}>The Storage Fix</div>
          <p className="c-silver mb-2">Full state is hundreds of GBs. Not all ENs can store it.</p>
          <p className="c-silver">Nodes store shards. ENs request needed objects over P2P network (content-addressed).</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, marginBottom: "1rem" }}>Ledger Blocks</div>
          <p className="c-silver mb-2"><b>Transaction Block (B):</b> Written instantly at consensus.</p>
          <p className="c-silver"><b>Result Block (R):</b> Written later when ENs finish.</p>
        </div>
      </div>
    </div>,

    // 31: BENCHMARK CHART
    <div key="31" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><BarChart2 size={12} /> Evaluation</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Benchmark Results</h2>
      <BenchmarkChart />
    </div>,

    // 32: BENCHMARK OBSERVATIONS
    <div key="32" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><BarChart2 size={12} /> Evaluation</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Key Observations</h2>
      <div className="flex-col" style={{ gap: "1rem" }}>
        <div className="glass" style={{ padding: "1.2rem", display: "flex", gap: "1rem", alignItems: "center" }}><CheckCircle size={20} color="#4ade80" /> <span className="t-body">Throughput scales linearly with `m` groups.</span></div>
        <div className="glass" style={{ padding: "1.2rem", display: "flex", gap: "1rem", alignItems: "center" }}><CheckCircle size={20} color="#4ade80" /> <span className="t-body">Simple payments experience ZERO latency increase.</span></div>
        <div className="glass" style={{ padding: "1.2rem", display: "flex", gap: "1rem", alignItems: "center" }}><CheckCircle size={20} color="#4ade80" /> <span className="t-body">No livelocks observed under any load.</span></div>
        <div className="glass" style={{ padding: "1.2rem", display: "flex", gap: "1rem", alignItems: "center" }}><AlertTriangle size={20} color="#fbbf24" /> <span className="t-body">WAN latency limits max parallelism across continents.</span></div>
      </div>
    </div>,

    // 33: COMPARISON
    <div key="33" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><BarChart2 size={12} /> Comparison</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>SABER vs Sharding</h2>
      <table className="comp-table">
        <thead><tr><th>Property</th><th>Sharding</th><th className="c-amethyst">SABER</th></tr></thead>
        <tbody>
          <tr><td>Async Execution</td><td>No</td><td className="c-amethyst font-bold">Yes</td></tr>
          <tr><td>Group Size</td><td>600+ nodes</td><td className="c-amethyst font-bold">70 nodes</td></tr>
          <tr><td>Coordination</td><td>High</td><td className="c-amethyst font-bold">None</td></tr>
          <tr><td>Livelock Prevent</td><td>Partial</td><td className="c-amethyst font-bold">Guaranteed</td></tr>
        </tbody>
      </table>
    </div>,

    // 34: CRYPTOKITTIES
    <div key="34" className="slide-wrapper">
      <span className="badge badge-c" style={{ width: "max-content", marginBottom: "1rem" }}><Box size={12} /> Case Study</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Solving CryptoKitties</h2>
      <div className="grid-2" style={{ alignItems: "center" }}>
        <div className="img-container">
          <img src="/cryptokitties_chaos.png" style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="Cats" />
        </div>
        <div className="glass-amethyst" style={{ padding: "2rem" }}>
          <Zap size={24} className="c-amethyst mb-4" />
          <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1rem" }}>With SABER</div>
          <p className="c-silver">Genetic breeding becomes a complex TX assigned to an EN group. ETH transfers stay on the fast-path. Zero congestion.</p>
        </div>
      </div>
    </div>,

    // 35: SECURITY GUARANTEES
    <div key="35" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Shield size={12} /> Security</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Guaranteed Properties</h2>
      <div className="grid-2">
        <div className="glass" style={{ borderLeft: "4px solid #4ade80", padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: "0.5rem" }}>Livelock Freedom</div>
          <p className="c-muted">Centralized lock management via BFT.</p>
        </div>
        <div className="glass" style={{ borderLeft: "4px solid #4ade80", padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: "0.5rem" }}>Result Correctness</div>
          <p className="c-muted">Majority voting (2f′+1) prevents bad results.</p>
        </div>
        <div className="glass" style={{ borderLeft: "4px solid #4ade80", padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: "0.5rem" }}>Ordering</div>
          <p className="c-muted">Tamper-proof BFT sequence assignment.</p>
        </div>
      </div>
    </div>,

    // 36: SECURITY ASSUMPTIONS
    <div key="36" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Shield size={12} /> Security</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Assumptions & Limits</h2>
      <div className="grid-2">
        <div className="glass" style={{ borderLeft: "4px solid #fbbf24", padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "0.5rem" }}>25% Bound</div>
          <p className="c-muted">At most 25% of all nodes can be malicious.</p>
        </div>
        <div className="glass" style={{ borderLeft: "4px solid #fbbf24", padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "0.5rem" }}>Synchrony</div>
          <p className="c-muted">Messages arrive within known bound Δ.</p>
        </div>
        <div className="glass" style={{ borderLeft: "4px solid #fbbf24", padding: "1.5rem" }}>
          <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "0.5rem" }}>Honest Devs</div>
          <p className="c-muted">Devs must classify simple/complex properly (efficiency issue, not safety).</p>
        </div>
      </div>
    </div>,

    // 37: DEPLOYMENT
    <div key="37" className="slide-wrapper" style={{ justifyContent: "center", textAlign: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "2rem" }}><Globe size={12} /> Deployment</span>
      <h2 className="t-hero" style={{ marginBottom: "2rem" }}><span className="c-grad">3,467 nodes.</span><br />5 continents.</h2>
      <p className="t-subtitle c-muted" style={{ maxWidth: "700px", margin: "0 auto" }}>Demonstrates SABER holds up across realistic wide-area network latencies.</p>
    </div>,

    // 38: RELATED WORK
    <div key="38" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-neutral" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><BookOpen size={12} /> Related</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Foundational Work</h2>
      <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div className="badge badge-a mb-2">Foundation</div>
          <div style={{ fontWeight: 700 }}>Yin et al. [SOSP 2003]</div>
          <p className="c-muted mt-2">"Separating Agreement from Execution".</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div className="badge badge-a mb-2">Building Block</div>
          <div style={{ fontWeight: 700 }}>PBFT & ByzCoin</div>
          <p className="c-muted mt-2">Consensus algorithms and multisignature aggregation used by SABER.</p>
        </div>
      </div>
    </div>,

    // 39: RELATED WORK ALTS
    <div key="39" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-neutral" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><BookOpen size={12} /> Related</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Alternative Approaches</h2>
      <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div className="badge badge-c mb-2">Sharding</div>
          <div style={{ fontWeight: 700 }}>RapidChain & OmniLedger</div>
          <p className="c-muted mt-2">Highlights the livelock problem SABER solves.</p>
        </div>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <div className="badge badge-c mb-2">Verification</div>
          <div style={{ fontWeight: 700 }}>TrueBit</div>
          <p className="c-muted mt-2">Interactive verification alternative to majority voting.</p>
        </div>
      </div>
    </div>,

    // 40: FUTURE TECH
    <div key="40" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Target size={12} /> Future</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Future Tech Integration</h2>
      <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass" style={{ padding: "1.5rem" }}><Cpu size={24} className="c-amethyst mb-2" /><div className="font-bold">Hardware Acceleration</div><p className="c-muted mt-2">GPU/ASIC EN clusters.</p></div>
        <div className="glass" style={{ padding: "1.5rem" }}><Shield size={24} className="c-crimson mb-2" /><div className="font-bold">TEE Execution</div><p className="c-muted mt-2">SGX enclaves could reduce group size to f′+1.</p></div>
      </div>
    </div>,

    // 41: FUTURE ECOSYSTEM
    <div key="41" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Target size={12} /> Future</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Ecosystem Scaling</h2>
      <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass" style={{ padding: "1.5rem" }}><Layers size={24} className="c-amethyst mb-2" /><div className="font-bold">L2 Rollups</div><p className="c-muted mt-2">ENs serve as ZK prover clusters.</p></div>
        <div className="glass" style={{ padding: "1.5rem" }}><Code2 size={24} className="c-rose mb-2" /><div className="font-bold">Auto-Classification</div><p className="c-muted mt-2">ML to auto-detect simple vs complex TXs.</p></div>
      </div>
    </div>,

    // 42: INDUSTRY 1
    <div key="42" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Globe size={12} /> Industry</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Parallelism in the Wild</h2>
      <div className="grid-2">
        <div className="glass" style={{ padding: "2rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--rose)", marginBottom: "0.5rem" }}>Solana</div>
          <span className="badge badge-neutral mb-4">Sealevel</span>
          <p className="c-silver mb-4">TXs declare accessed accounts. Non-overlapping run on different cores.</p>
          <div className="t-mono c-rose">65k+ TPS</div>
        </div>
        <div className="glass" style={{ padding: "2rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--amethyst-bright)", marginBottom: "0.5rem" }}>Aptos</div>
          <span className="badge badge-neutral mb-4">Block-STM</span>
          <p className="c-silver mb-4">Optimistic concurrency. Execute all, detect conflicts, re-run.</p>
          <div className="t-mono c-amethyst">150k+ TPS</div>
        </div>
      </div>
    </div>,

    // 43: INDUSTRY 2
    <div key="43" className="slide-wrapper">
      <span className="badge badge-a" style={{ width: "max-content", marginBottom: "1rem" }}><Globe size={12} /> Industry</span>
      <h2 className="t-title" style={{ marginBottom: "2rem" }}>Parallelism in the Wild</h2>
      <div className="grid-2">
        <div className="glass" style={{ padding: "2rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--crimson-bright)", marginBottom: "0.5rem" }}>Sui</div>
          <span className="badge badge-neutral mb-4">Object Model</span>
          <p className="c-silver mb-4">Owned objects bypass consensus entirely. Inherently parallel.</p>
          <div className="t-mono c-crimson">120k+ TPS</div>
        </div>
        <div className="glass-amethyst" style={{ padding: "2rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--amethyst-bright)", marginBottom: "0.5rem" }}>SABER</div>
          <span className="badge badge-a mb-4">Execution Separation</span>
          <p className="c-silver mb-4">Zero EN coordination. Retrofit to Ethereum (no hard forks).</p>
          <div className="t-mono c-amethyst">11.4× Baseline</div>
        </div>
      </div>
    </div>,

    // 44: KEY TAKEAWAYS
    <div key="44" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Award size={12} /> Summary</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Key Takeaways</h2>
      <div className="flex-col" style={{ gap: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass" style={{ padding: "1.5rem" }}><div className="c-amethyst font-bold mb-2">1. Execution ≠ Consensus</div><span className="c-silver">Separating them enables extreme parallelism.</span></div>
        <div className="glass" style={{ padding: "1.5rem" }}><div className="c-rose font-bold mb-2">2. Small Groups Work</div><span className="c-silver">70 nodes is enough for safety with majority voting.</span></div>
        <div className="glass" style={{ padding: "1.5rem" }}><div className="c-crimson font-bold mb-2">3. Centralized Locks Stop Livelocks</div><span className="c-silver">Architectural fix, not just economic penalties.</span></div>
      </div>
    </div>,

    // 45: DISCUSSION
    <div key="45" className="slide-wrapper" style={{ justifyContent: "center" }}>
      <span className="badge badge-a" style={{ width: "max-content", alignSelf: "center", marginBottom: "1rem" }}><Activity size={12} /> Discussion</span>
      <h2 className="t-title" style={{ textAlign: "center", marginBottom: "3rem" }}>Critical Questions</h2>
      <div className="flex-col" style={{ gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
        <div className="glass p-4 border-l-4" style={{ borderLeftColor: "var(--amethyst)" }}><p>Are CNs a single point of failure managing all locks?</p></div>
        <div className="glass p-4 border-l-4" style={{ borderLeftColor: "var(--crimson)" }}><p>Is developer opt-in realistic for Ethereum deployment?</p></div>
        <div className="glass p-4 border-l-4" style={{ borderLeftColor: "var(--rose)" }}><p>How does SABER handle MEV (Maximal Extractable Value) attacks?</p></div>
      </div>
    </div>,

    // 46: CONCLUSION
    <div key="46" className="slide-wrapper" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0 }}><img src="/saber_hero.png" style={{ objectFit: "cover", width: "100%", height: "100%", opacity: 0.15 }} alt="" /></div>
      <div style={{ position: "relative", zIndex: 5, maxWidth: "800px" }}>

        <h1 className="t-hero c-grad" style={{ marginBottom: "1.5rem" }}>Thank You</h1>
        <div className="glass" style={{ display: "inline-block", padding: "1rem 2rem", marginTop: "2rem" }}>
          <span className="t-body c-muted">Presented by </span><strong className="c-amethyst text-lg">Aya khalila</strong>
        </div>
      </div>
    </div>,
  ];
}

/* ==============================
   PRESENTATION VIEWER
============================== */
export default function PresentationViewer() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const slides = getSlides();
  const total = slides.length;

  const goNext = useCallback(() => {
    if (currentSlide < total - 1) { setDirection(1); setCurrentSlide(s => s + 1); }
  }, [currentSlide, total]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) { setDirection(-1); setCurrentSlide(s => s - 1); }
  }, [currentSlide]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.code === "Space") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const currentSection = SECTIONS.findIndex(s => s.slides.includes(currentSlide));
  const progress = ((currentSlide + 1) / total) * 100;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "var(--bg-void)" }}>
      <MeshBackground />
      <ParticleField />
      <div className="bg-grain" />

      {/* Slides */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={currentSlide} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition} style={{ position: "absolute", inset: 0 }}>
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section indicator */}
      <div id="section-bar">
        {SECTIONS.map((sec, i) => (
          <div key={i} className={`section-dot ${i === currentSection ? "active" : ""}`} style={{ background: i === currentSection ? sec.color : undefined }} onClick={() => { setDirection(i > currentSection ? 1 : -1); setCurrentSlide(sec.slides[0]); }} title={sec.name} />
        ))}
      </div>

      {/* Navigation */}
      <div id="nav-controls">
        <button className="btn btn-ghost" onClick={goPrev} disabled={currentSlide === 0} style={{ padding: "0.5rem 0.9rem", borderRadius: "var(--r-pill)" }}><ChevronLeft size={18} /></button>
        <div id="slide-counter">{String(currentSlide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
        <button className="btn btn-primary" onClick={goNext} disabled={currentSlide === total - 1} style={{ padding: "0.5rem 0.9rem", borderRadius: "var(--r-pill)" }}><ChevronRight size={18} /></button>
      </div>

      <div id="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
