"use client";
import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Briefcase, FolderOpen, FileText, Mail, Terminal,
  Trash2, Search, Wifi, Battery, X, Minus, Maximize2,
  Github, Linkedin, ExternalLink, Download, Send, ChevronRight,
  Code, Database, Globe, Zap, Monitor, Volume2, Bell, Settings,
  Award, Star, Layers, Server, CheckCircle, MapPin,
  Power, RefreshCw, FolderOpen as Folder
} from "lucide-react";

import { FolderRegular, MailRegular, DeleteRegular } from "@fluentui/react-icons";

import { 
  FcManager, FcBriefcase, FcOpenedFolder, FcDocument, 
  FcSms, FcCommandLine, FcFullTrash, FcSettings
} from "react-icons/fc";

/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO DATA
═══════════════════════════════════════════════════════════════ */
const PROFILE = {
  name: "Alex Chen",
  title: "Full Stack Developer & SaaS Founder",
  bio: "I build high-performance web applications and scalable SaaS products. Former engineer at Stripe and Vercel. Currently building the future of developer analytics infrastructure.",
  location: "San Francisco, CA",
  email: "alex@alexchen.dev",
  github: "github.com/alexchen",
  linkedin: "linkedin.com/in/alexchen",
};

const SKILLS = [
  { name: "React / Next.js", level: 98, cat: "Frontend" },
  { name: "TypeScript", level: 95, cat: "Frontend" },
  { name: "Node.js", level: 92, cat: "Backend" },
  { name: "PostgreSQL", level: 88, cat: "Database" },
  { name: "Python", level: 85, cat: "Backend" },
  { name: "AWS / Cloud", level: 82, cat: "DevOps" },
  { name: "Go", level: 78, cat: "Backend" },
  { name: "Docker / K8s", level: 76, cat: "DevOps" },
];

const TECH = ["React","Next.js","TypeScript","Node.js","Python","Go","PostgreSQL","Redis","Docker","AWS","Terraform","Figma"];

const EXPERIENCE = [
  {
    role: "Founder & CTO", company: "Zenith Analytics", period: "2022 — Present",
    desc: "Building next-gen analytics infrastructure serving 500+ enterprise companies. Leading 12 engineers across SF and Berlin.",
    wins: ["$4.2M seed round raised","500+ enterprise customers","99.99% uptime SLA","40ms p99 query latency"],
    tech: ["Next.js","Go","ClickHouse","K8s"], color: "#0078d7",
  },
  {
    role: "Senior Software Engineer", company: "Stripe", period: "2020 — 2022",
    desc: "Core infrastructure team. Built distributed payment systems handling millions of daily transactions.",
    wins: ["Reduced API latency by 40%","Led 5-person feature team","Zero-downtime 200TB migration"],
    tech: ["Ruby","Go","MySQL","Redis"], color: "#635bff",
  },
  {
    role: "Software Engineer", company: "Vercel", period: "2018 — 2020",
    desc: "Edge runtime and deployment infrastructure. Scaled from 50K to 1M+ daily deployments.",
    wins: ["10x deployment speed","Edge functions architect","Core OSS contributor"],
    tech: ["Node.js","Rust","PostgreSQL","AWS"], color: "#e2e8f0",
  },
  {
    role: "Junior Developer", company: "TechFlow Inc.", period: "2017 — 2018",
    desc: "Full stack development for enterprise SaaS clients. React dashboards and REST APIs.",
    wins: ["10 client projects shipped","Internal dev tooling suite"],
    tech: ["React","Django","PostgreSQL"], color: "#00d4aa",
  },
];

const PROJECTS = [
  {
    id: "zenith", name: "Zenith Analytics", tagline: "Real-time analytics for modern data teams",
    desc: "Sub-100ms queries on billion-row datasets. Live dashboards, SQL editor, AI-powered anomaly detection. Used by 500+ engineering teams.",
    tech: ["Next.js","Go","ClickHouse","K8s"], status: "Production", stars: 2400, color: "#0078d7", type: "SaaS",
  },
  {
    id: "openchain", name: "OpenChain SDK", tagline: "TypeScript SDK for blockchain developers",
    desc: "Type-safe EVM contract interactions, auto gas estimation, built-in retry logic. 12K+ weekly npm downloads.",
    tech: ["TypeScript","Ethereum","Node.js","Viem"], status: "Open Source", stars: 3800, color: "#00d4aa", type: "OSS",
  },
  {
    id: "nova", name: "Nova Design System", tagline: "Production-ready React components",
    desc: "80+ accessible components, dark/light themes, full WCAG 2.1 AA support and Storybook documentation.",
    tech: ["React","TypeScript","Storybook","Tailwind"], status: "Internal", stars: 890, color: "#a855f7", type: "Library",
  },
  {
    id: "taskflow", name: "TaskFlow CLI", tagline: "Terminal-first project management",
    desc: "Syncs Linear, GitHub Issues, and Jira. Fuzzy search, vim-style keybindings, AI task summarization.",
    tech: ["Go","SQLite","Linear API","TUI"], status: "Open Source", stars: 1200, color: "#f59e0b", type: "CLI",
  },
];

const TRASH = [
  { name: "my_social_life.exe",     date: "2020-03-15",   icon: "😅", msg: "File not found. Last seen before joining startup." },
  { name: "work_life_balance.pdf",  date: "2019-11-01",   icon: "🧘", msg: "Corrupted. Multiple recovery attempts failed." },
  { name: "imposter_syndrome.png",  date: "Recurring",    icon: "🫣", msg: "Keeps reappearing no matter how many times deleted." },
  { name: "stack_overflow_tabs.html",date: "Daily",       icon: "🔖", msg: "847 open tabs. Warning: system memory critical." },
  { name: "perfect_code.zip",       date: "Never",        icon: "🦄", msg: "Legendary artifact. No confirmed sightings." },
  { name: "sleep_schedule.json",    date: "2017-09-03",   icon: "😴", msg: "Last modified before the first all-nighter." },
  { name: "debugging_sanity.exe",   date: "Every Tuesday",icon: "🐛", msg: "Segmentation fault: core dumped." },
];

/* ═══════════════════════════════════════════════════════════════
   APPS REGISTRY
═══════════════════════════════════════════════════════════════ */
const APPS = [
  { id: "about",      title: "About Me",    icon: FcManager,      initX: 20, initY: 20,  w: 700, h: 560 },
  { id: "experience", title: "Experience",  icon: FcBriefcase,    initX: 20, initY: 120, w: 780, h: 640 },
  { id: "projects",   title: "Projects",    icon: FcOpenedFolder, initX: 20, initY: 220, w: 860, h: 660 },
  { id: "cv",         title: "Resume / CV", icon: FcDocument,     initX: 20, initY: 320, w: 760, h: 700 },
  { id: "contact",    title: "Contact",     icon: FcSms,          initX: 20, initY: 420, w: 600, h: 520 },
  { id: "terminal",   title: "Terminal",    icon: FcCommandLine,  initX: 20, initY: 520, w: 720, h: 480 },
  { id: "settings",   title: "Settings",    icon: FcSettings,     initX: 20, initY: 620, w: 600, h: 500 },
  { id: "recycle",    title: "Recycle Bin", icon: FcFullTrash,    initX: null, initY: null, w: 640, h: 430 }, // Calculated dynamically
];

/* ═══════════════════════════════════════════════════════════════
   WALLPAPERS
═══════════════════════════════════════════════════════════════ */
const WALLPAPERS = [
  { id: "default", name: "Dark OS (Default)", 
    val: "radial-gradient(ellipse 100% 80% at 10% -5%, rgba(0,120,215,0.24) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 92% 28%, rgba(90,0,190,0.16) 0%, transparent 50%), radial-gradient(ellipse 80% 55% at 50% 105%, rgba(0,70,175,0.2) 0%, transparent 48%), radial-gradient(ellipse 50% 45% at 75% 88%, rgba(0,160,110,0.08) 0%, transparent 40%), #060612" },
  { id: "abstract", name: "Fluid Abstract", 
    val: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat" },
  { id: "landscape", name: "Mountain Night", 
    val: "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1974&auto=format&fit=crop') center/cover no-repeat" },
  { id: "minimal", name: "Pure Black", 
    val: "#000000" },
];

/* ═══════════════════════════════════════════════════════════════
   WINDOW MANAGER REDUCER
═══════════════════════════════════════════════════════════════ */
const WM0 = { windows: [], nextZ: 100, activeId: null };

function wm(state, action) {
  switch (action.type) {
    case "OPEN": {
      const ex = state.windows.find(w => w.id === action.app.id);
      const nz = state.nextZ + 1;
      if (ex) return { ...state, nextZ: nz, activeId: action.app.id,
        windows: state.windows.map(w => w.id === action.app.id ? { ...w, minimized: false, z: nz } : w) };
      const n = state.windows.length;
      return { ...state, nextZ: nz, activeId: action.app.id,
        windows: [...state.windows, {
          id: action.app.id, title: action.app.title,
          x: Math.min(80 + n * 28, (typeof window !== "undefined" ? window.innerWidth : 1200) - action.app.w - 20),
          y: Math.min(60 + n * 22, (typeof window !== "undefined" ? window.innerHeight : 900) - action.app.h - 60),
          width: action.app.w, height: action.app.h,
          minimized: false, maximized: false, z: nz,
        }] };
    }
    case "CLOSE": return { ...state,
      activeId: state.windows.filter(w => w.id !== action.id && !w.minimized).at(-1)?.id ?? null,
      windows: state.windows.filter(w => w.id !== action.id) };
    case "MINIMIZE": return { ...state,
      activeId: state.windows.filter(w => w.id !== action.id && !w.minimized).at(-1)?.id ?? null,
      windows: state.windows.map(w => w.id === action.id ? { ...w, minimized: true } : w) };
    case "MAXIMIZE": return { ...state,
      windows: state.windows.map(w => w.id === action.id ? { ...w, maximized: !w.maximized } : w) };
    case "FOCUS": { const nz = state.nextZ + 1;
      return { ...state, nextZ: nz, activeId: action.id,
        windows: state.windows.map(w => w.id === action.id ? { ...w, z: nz, minimized: false } : w) }; }
    case "MOVE": return { ...state,
      windows: state.windows.map(w => w.id === action.id ? { ...w, x: action.x, y: action.y } : w) };
	case "RESIZE": return { ...state,
      windows: state.windows.map(w => w.id === action.id ? { ...w, width: action.w, height: action.h } : w) };
    default: return state;
  }
}

/* ═══════════════════════════════════════════════════════════════
   SHARED
═══════════════════════════════════════════════════════════════ */
const F = "'Segoe UI Variable','Segoe UI',system-ui,-apple-system,sans-serif";
const BLUE = "#0078d7";
const GS = { background:"rgba(16,16,30,0.93)", backdropFilter:"blur(32px) saturate(160%)" };
const SB = { scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.12) transparent" };

/* ═══════════════════════════════════════════════════════════════
   WINDOW CONTROL BUTTON
═══════════════════════════════════════════════════════════════ */
function WBtn({ onClick, danger, children }) {
  const [h, sh] = useState(false);
  return (
    <button onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ width: 46, height: 38, display:"flex", alignItems:"center", justifyContent:"center",
        background: h ? (danger ? "#e81123" : "rgba(255,255,255,0.1)") : "transparent",
        border:"none", color: h && danger ? "#fff" : "rgba(255,255,255,0.72)",
        cursor:"default", transition:"background 0.1s", outline:"none", flexShrink:0 }}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ABOUT APP
═══════════════════════════════════════════════════════════════ */
function AboutApp() {
  return (
    <div style={{ fontFamily:F, color:"#fff", height:"100%", overflow:"auto", padding:"28px 32px", ...SB }}>
      <div style={{ display:"flex", gap:22, marginBottom:26, alignItems:"flex-start" }}>
        <div style={{ width:86, height:86, borderRadius:43, flexShrink:0,
          background:"linear-gradient(135deg, #0078d7 0%, #00d4aa 100%)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:28, fontWeight:600, letterSpacing:-1,
          boxShadow:"0 8px 24px rgba(0,120,215,0.4)" }}>AC</div>
        <div style={{ flex:1 }}>
          <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:600, letterSpacing:-0.4 }}>{PROFILE.name}</h1>
          <p style={{ margin:"0 0 10px", fontSize:13, color:BLUE, fontWeight:500 }}>{PROFILE.title}</p>
          <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.65 }}>{PROFILE.bio}</p>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)", display:"flex", alignItems:"center", gap:4 }}>
            <MapPin size={11}/> {PROFILE.location}
          </span>
        </div>
      </div>

      <p style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", margin:"0 0 14px" }}>Skills</p>
      {SKILLS.map((s, i) => (
        <div key={s.name} style={{ marginBottom:11 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:13 }}>{s.name}</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{s.level}%</span>
          </div>
          <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${s.level}%` }}
              transition={{ duration:0.85, delay:i*0.06, ease:"easeOut" }}
              style={{ height:"100%", background:`linear-gradient(90deg, ${BLUE}, #00b4d8)`, borderRadius:2 }} />
          </div>
        </div>
      ))}

      <p style={{ fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", margin:"20px 0 12px" }}>Tech Stack</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {TECH.map(t => (
          <span key={t} style={{ padding:"4px 10px", fontSize:12, borderRadius:5,
            background:"rgba(0,120,215,0.1)", border:"1px solid rgba(0,120,215,0.22)",
            color:"rgba(255,255,255,0.8)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPERIENCE APP
═══════════════════════════════════════════════════════════════ */
function ExperienceApp() {
  return (
    <div style={{ fontFamily:F, color:"#fff", height:"100%", overflow:"auto", padding:"28px 32px", ...SB }}>
      <h2 style={{ fontSize:17, fontWeight:600, margin:"0 0 24px", letterSpacing:-0.3 }}>Work Experience</h2>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:11, top:12, bottom:8, width:1, background:"rgba(255,255,255,0.07)" }} />
        {EXPERIENCE.map((e, i) => (
          <motion.div key={e.company} initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:i*0.1, duration:0.38 }}
            style={{ display:"flex", gap:18, marginBottom:28 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, width:24 }}>
              <div style={{ width:12, height:12, borderRadius:6, background:e.color, marginTop:4,
                boxShadow:`0 0 10px ${e.color}88`, zIndex:1 }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:4 }}>
                <div>
                  <span style={{ fontSize:14, fontWeight:600 }}>{e.role}</span>
                  <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginLeft:7 }}>@ {e.company}</span>
                </div>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.32)", flexShrink:0, paddingTop:2 }}>{e.period}</span>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.58)", margin:"0 0 10px", lineHeight:1.62 }}>{e.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
                {e.wins.map(w => (
                  <span key={w} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5,
                    color:"rgba(255,255,255,0.72)", background:"rgba(255,255,255,0.05)",
                    padding:"3px 8px", borderRadius:4, border:"1px solid rgba(255,255,255,0.07)" }}>
                    <CheckCircle size={9} color="#00d4aa" />{w}
                  </span>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {e.tech.map(t => (
                  <span key={t} style={{ fontSize:11, color:"rgba(255,255,255,0.38)",
                    background:"rgba(0,0,0,0.3)", padding:"2px 7px", borderRadius:4,
                    border:"1px solid rgba(255,255,255,0.06)" }}>{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS APP
═══════════════════════════════════════════════════════════════ */
function ProjectsApp() {
  const [sel, setSel] = useState(null);
  const proj = sel ? PROJECTS.find(p => p.id === sel) : null;
  return (
    <div style={{ fontFamily:F, color:"#fff", height:"100%", overflow:"auto", padding:"24px 28px", ...SB }}>
      <AnimatePresence mode="wait">
        {!proj ? (
          <motion.div key="grid" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <h2 style={{ fontSize:17, fontWeight:600, margin:"0 0 18px" }}>Projects</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
              {PROJECTS.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.08 }} whileHover={{ y:-2 }} onClick={() => setSel(p.id)}
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                    borderRadius:10, padding:"18px 20px", cursor:"pointer", transition:"border-color 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = p.color+"44"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ width:38, height:38, borderRadius:9,
                      background:`${p.color}18`, border:`1px solid ${p.color}38`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Code size={17} color={p.color} />
                    </div>
                    <span style={{ fontSize:10.5, padding:"2px 8px", borderRadius:10,
                      background:`${p.color}1a`, color:p.color, border:`1px solid ${p.color}38` }}>{p.status}</span>
                  </div>
                  <h3 style={{ fontSize:14, fontWeight:600, margin:"0 0 4px" }}>{p.name}</h3>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.48)", margin:"0 0 10px", lineHeight:1.5 }}>{p.tagline}</p>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
                    {p.tech.slice(0,3).map(t => (
                      <span key={t} style={{ fontSize:10, padding:"2px 6px", borderRadius:4,
                        background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.42)" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.32)" }}>⭐ {p.stars.toLocaleString()}</span>
                    <span style={{ fontSize:11, color:BLUE }}>Open →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>
            <button onClick={() => setSel(null)}
              style={{ display:"flex", alignItems:"center", gap:6, marginBottom:20,
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                color:"rgba(255,255,255,0.7)", borderRadius:6, padding:"6px 14px",
                fontSize:12, cursor:"pointer", fontFamily:F }}>
              ← Back
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
              <div style={{ width:52, height:52, borderRadius:12, background:`${proj.color}18`,
                border:`1px solid ${proj.color}38`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Code size={24} color={proj.color} />
              </div>
              <div>
                <h2 style={{ margin:0, fontSize:20, fontWeight:600 }}>{proj.name}</h2>
                <p style={{ margin:"2px 0 0", fontSize:13, color:"rgba(255,255,255,0.48)" }}>{proj.tagline}</p>
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10, padding:"16px 20px", marginBottom:16 }}>
              <p style={{ margin:0, fontSize:14, lineHeight:1.7, color:"rgba(255,255,255,0.72)" }}>{proj.desc}</p>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:22 }}>
              {proj.tech.map(t => (
                <span key={t} style={{ fontSize:12.5, padding:"5px 12px", borderRadius:6,
                  background:`${proj.color}16`, border:`1px solid ${proj.color}30`, color:proj.color }}>{t}</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px",
                background:BLUE, border:"none", borderRadius:7, color:"#fff", fontSize:13,
                cursor:"pointer", fontFamily:F, boxShadow:`0 4px 14px ${BLUE}50` }}>
                <ExternalLink size={13}/> Live Demo
              </button>
              <button style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px",
                background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:7, color:"#fff", fontSize:13, cursor:"pointer", fontFamily:F }}>
                <Github size={13}/> Source Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CV APP
═══════════════════════════════════════════════════════════════ */
function CVApp() {
  return (
    <div style={{ height:"100%", overflow:"auto", background:"rgba(8,8,18,0.6)", ...SB }}>
      <div style={{ background:"rgba(248,248,250,0.97)", margin:"18px 18px 0", borderRadius:6,
        padding:"40px 48px", color:"#111", minHeight:860,
        boxShadow:"0 20px 60px rgba(0,0,0,0.6)", fontFamily:"Georgia, 'Times New Roman', serif" }}>
        {/* Header */}
        <div style={{ borderBottom:`2.5px solid ${BLUE}`, paddingBottom:16, marginBottom:22 }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:700, color:"#0d0d1a", fontFamily:F }}>Alex Chen</h1>
          <p style={{ margin:"4px 0 8px", fontSize:13.5, color:BLUE, fontFamily:F, fontWeight:500 }}>
            Full Stack Developer & SaaS Founder
          </p>
          <p style={{ margin:0, fontSize:12, color:"#555", fontFamily:F }}>
            alex@alexchen.dev · San Francisco, CA · github.com/alexchen · linkedin.com/in/alexchen
          </p>
        </div>
        {/* Summary */}
        <Section title="Summary">
          <p style={{ margin:0, fontSize:13, lineHeight:1.75, color:"#333" }}>
            Full Stack Developer and SaaS Founder with 7+ years of experience building high-performance web applications,
            distributed systems, and developer infrastructure. Founder of Zenith Analytics, previously at Stripe and Vercel.
          </p>
        </Section>
        {/* Experience */}
        <Section title="Experience">
          {EXPERIENCE.map(e => (
            <div key={e.company} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <strong style={{ fontSize:13, fontFamily:F }}>{e.role} — {e.company}</strong>
                <span style={{ fontSize:11.5, color:"#666", fontFamily:F }}>{e.period}</span>
              </div>
              <p style={{ margin:"4px 0", fontSize:12.5, color:"#444", lineHeight:1.65 }}>{e.desc}</p>
            </div>
          ))}
        </Section>
        {/* Skills */}
        <Section title="Technical Skills">
          <p style={{ margin:0, fontSize:13, color:"#333", lineHeight:1.9 }}>
            <strong style={{ fontFamily:F }}>Frontend:</strong> React, Next.js, TypeScript &nbsp;·&nbsp;
            <strong style={{ fontFamily:F }}>Backend:</strong> Node.js, Python, Go &nbsp;·&nbsp;
            <strong style={{ fontFamily:F }}>Database:</strong> PostgreSQL, Redis, ClickHouse &nbsp;·&nbsp;
            <strong style={{ fontFamily:F }}>DevOps:</strong> AWS, Docker, Kubernetes
          </p>
        </Section>
        {/* Education */}
        <Section title="Education">
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <strong style={{ fontSize:13, fontFamily:F }}>B.Sc. Computer Science — Stanford University</strong>
            <span style={{ fontSize:12, color:"#666", fontFamily:F }}>2013 — 2017</span>
          </div>
          <p style={{ margin:"4px 0 0", fontSize:12.5, color:"#555" }}>GPA: 3.9 · Dean's List · Thesis: Distributed Query Optimization</p>
        </Section>
      </div>
      <div style={{ padding:"12px 18px 18px", display:"flex", justifyContent:"center" }}>
        <button style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 24px",
          background:BLUE, border:"none", borderRadius:8, color:"#fff", fontSize:13.5,
          cursor:"pointer", fontFamily:F, boxShadow:`0 4px 16px ${BLUE}45` }}>
          <Download size={15}/> Download PDF Resume
        </button>
      </div>
    </div>
  );
}
function Section({ title, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <h2 style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.09em", color:BLUE,
        fontFamily:F, fontWeight:600, margin:"0 0 8px", paddingBottom:4,
        borderBottom:"1px solid #e2e8f0" }}>{title}</h2>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS APP (Upgraded with Personalization)
═══════════════════════════════════════════════════════════════ */
function SettingsApp({ bg, setBg }) {
  return (
    <div style={{ fontFamily:F, color:"#fff", height:"100%", overflow:"auto", padding:"28px 30px", ...SB }}>
      <h2 style={{ fontSize:22, fontWeight:600, margin:"0 0 20px" }}>Settings</h2>
      
      {/* System Info */}
      <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:20, marginBottom:16 }}>
        <h3 style={{ fontSize:15, margin:"0 0 12px", color:"#0098ff" }}>System Info</h3>
        <p style={{ margin:"4px 0", fontSize:13, color:"rgba(255,255,255,0.7)" }}><strong>OS:</strong> React Windows Portfolio v1.1</p>
        <p style={{ margin:"4px 0", fontSize:13, color:"rgba(255,255,255,0.7)" }}><strong>Status:</strong> All systems nominal.</p>
      </div>

      {/* Personalization (New!) */}
      <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:20 }}>
        <h3 style={{ fontSize:15, margin:"0 0 12px", color:"#0098ff" }}>Personalization</h3>
        <p style={{ margin:"0 0 12px", fontSize:13, color:"rgba(255,255,255,0.7)" }}>Select a desktop background:</p>
        
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {WALLPAPERS.map(wp => (
            <button 
              key={wp.id} 
              onClick={() => setBg(wp.val)}
              style={{ 
                height: 70, 
                background: wp.val, 
                borderRadius: 8, 
                border: bg === wp.val ? "2px solid #0098ff" : "2px solid rgba(255,255,255,0.1)",
                color: "#fff", 
                fontSize: 12, 
                fontWeight: 600,
                textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                cursor: "pointer",
                display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8,
                transition: "border 0.2s"
              }}>
              {wp.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT APP
═══════════════════════════════════════════════════════════════ */
function ContactApp() {
  const [form, sf] = useState({ name:"", email:"", msg:"" });
  const [sent, ss] = useState(false);
  return (
    <div style={{ fontFamily:F, color:"#fff", height:"100%", overflow:"auto", padding:"28px 30px", ...SB }}>
      <h2 style={{ fontSize:17, fontWeight:600, margin:"0 0 18px" }}>Get in Touch</h2>
      <div style={{ display:"flex", gap:9, marginBottom:22, flexWrap:"wrap" }}>
        {[
          { label:"Email",    icon:Mail,     val:PROFILE.email },
          { label:"GitHub",   icon:Github,   val:"alexchen" },
          { label:"LinkedIn", icon:Linkedin, val:"in/alexchen" },
        ].map(s => (
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 13px",
            background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)",
            borderRadius:9, cursor:"pointer", flex:1, minWidth:140,
            transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${BLUE}55`}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}>
            <s.icon size={15} color={BLUE}/>
            <div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.38)" }}>{s.label}</div>
              <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.85)" }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>
      {!sent ? (
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:20 }}>
          <p style={{ margin:"0 0 14px", fontSize:13, color:"rgba(255,255,255,0.45)" }}>Or send a direct message:</p>
          {[
            { k:"name",  lbl:"Name",    type:"input",    ph:"Your name" },
            { k:"email", lbl:"Email",   type:"input",    ph:"your@email.com" },
            { k:"msg",   lbl:"Message", type:"textarea", ph:"What's on your mind?" },
          ].map(f => (
            <div key={f.k} style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, color:"rgba(255,255,255,0.45)", display:"block", marginBottom:5 }}>{f.lbl}</label>
              {f.type === "input" ? (
                <input value={form[f.k]} onChange={e => sf(p => ({ ...p, [f.k]:e.target.value }))} placeholder={f.ph}
                  style={{ width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.1)", borderRadius:7, color:"#fff",
                    fontSize:13, fontFamily:F, outline:"none", boxSizing:"border-box" }}/>
              ) : (
                <textarea value={form[f.k]} onChange={e => sf(p => ({ ...p, [f.k]:e.target.value }))}
                  placeholder={f.ph} rows={4}
                  style={{ width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.1)", borderRadius:7, color:"#fff",
                    fontSize:13, fontFamily:F, outline:"none", resize:"vertical", boxSizing:"border-box" }}/>
              )}
            </div>
          ))}
          <button onClick={() => ss(true)}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 20px",
              background:BLUE, border:"none", borderRadius:7, color:"#fff", fontSize:13,
              cursor:"pointer", fontFamily:F, boxShadow:`0 4px 14px ${BLUE}45` }}>
            <Send size={13}/> Send Message
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          style={{ textAlign:"center", padding:"44px 20px" }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
            transition={{ type:"spring", stiffness:300, damping:20 }}
            style={{ width:64, height:64, borderRadius:32, background:"rgba(0,212,170,0.15)",
              border:"1px solid rgba(0,212,170,0.3)", display:"flex", alignItems:"center",
              justifyContent:"center", margin:"0 auto 16px" }}>
            <CheckCircle size={30} color="#00d4aa"/>
          </motion.div>
          <h3 style={{ fontSize:18, margin:"0 0 8px" }}>Message Sent!</h3>
          <p style={{ color:"rgba(255,255,255,0.48)", fontSize:13 }}>I'll get back to you within 24 hours.</p>
          <button onClick={() => ss(false)}
            style={{ marginTop:16, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
              color:"rgba(255,255,255,0.7)", borderRadius:7, padding:"8px 18px", fontSize:13,
              cursor:"pointer", fontFamily:F }}>Send Another</button>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TERMINAL APP
═══════════════════════════════════════════════════════════════ */
function TerminalApp() {
  const [hist, sh] = useState([
    { t:"sys", v:"Microsoft Windows [Version 10.0.22621]" },
    { t:"sys", v:"(c) Alex Chen Portfolio Corp. All rights reserved." },
    { t:"sys", v:"" },
    { t:"out", v:"Welcome to Alex Chen's Portfolio Terminal." },
    { t:"out", v:`Type "help" for available commands.` },
    { t:"out", v:"" },
  ]);
  const [inp, si] = useState("");
  const [ch, sc] = useState([]);
  const [ci, sci] = useState(-1);
  const bref = useRef(null);
  const iref = useRef(null);

  const CMDS = {
    help: () => [
      "Available commands:",
      "  about      — Who is Alex Chen",
      "  skills     — Technical skills overview",
      "  projects   — Active projects & OSS",
      "  experience — Work history timeline",
      "  contact    — Contact information",
      "  whoami     — Current user",
      "  date       — System date & time",
      "  clear      — Clear terminal",
      "",
    ],
    about: () => [
      `Name     : ${PROFILE.name}`,
      `Role     : ${PROFILE.title}`,
      `Location : ${PROFILE.location}`,
      `Email    : ${PROFILE.email}`,
      "",
      PROFILE.bio,
      "",
    ],
    whoami: () => ["alex-chen\\portfolio", ""],
    date: () => [new Date().toString(), ""],
    skills: () => [
      "Technical Skills:",
      ...SKILLS.map(s => `  ${(s.name + " ").padEnd(28, ".")} ${s.level}%`),
      "",
    ],
    projects: () => [
      "Projects:",
      ...PROJECTS.map(p => `  [${p.type.padEnd(8)}] ${p.name.padEnd(22)} ⭐ ${p.stars.toLocaleString()}`),
      "",
    ],
    experience: () => [
      "Work History:",
      ...EXPERIENCE.map(e => `  ${e.period}  |  ${e.role} @ ${e.company}`),
      "",
    ],
    contact: () => [
      "Contact Information:",
      `  Email    : ${PROFILE.email}`,
      `  GitHub   : ${PROFILE.github}`,
      `  LinkedIn : ${PROFILE.linkedin}`,
      "",
    ],
  };

  const run = useCallback((cmd) => {
    const tr = cmd.trim();
    if (!tr) { sh(p => [...p, { t:"inp", v:cmd }]); return; }
    sc(p => [cmd, ...p]); sci(-1);
    const [c] = tr.toLowerCase().split(" ");
    const input_line = { t:"inp", v:cmd };
    if (c === "clear") { sh([]); return; }
    const handler = CMDS[c];
    if (!handler) {
      sh(p => [...p, input_line, { t:"err", v:`'${c}' is not recognized as a command. Type 'help'.` }, { t:"out", v:"" }]);
    } else {
      sh(p => [...p, input_line, ...handler().map(v => ({ t:"out", v }))]);
    }
  }, []);

  useEffect(() => { bref.current?.scrollIntoView({ behavior:"smooth" }); }, [hist]);

  const onKey = (e) => {
    if (e.key === "Enter") { run(inp); si(""); }
    else if (e.key === "ArrowUp") { const ni = Math.min(ci+1, ch.length-1); sci(ni); si(ch[ni] ?? ""); }
    else if (e.key === "ArrowDown") { const ni = Math.max(ci-1,-1); sci(ni); si(ni===-1 ? "" : ch[ni] ?? ""); }
  };

  const cols = { sys:"rgba(255,255,255,0.38)", out:"#c8f0d0", inp:"#fff", err:"#ff6b6b" };

  return (
    <div onClick={() => iref.current?.focus()}
      style={{ height:"100%", background:"#0a0a10", fontFamily:"'Cascadia Code','Consolas','Courier New',monospace",
        fontSize:12.5, display:"flex", flexDirection:"column", cursor:"text" }}>
      <div style={{ flex:1, overflow:"auto", padding:"12px 16px",
        scrollbarWidth:"thin", scrollbarColor:"rgba(0,255,136,0.15) transparent" }}>
        {hist.map((h, i) => (
          <div key={i} style={{ marginBottom:1, lineHeight:1.56 }}>
            {h.t === "inp" && <span style={{ color:"#0098ff" }}>C:\Users\alex\portfolio&gt; </span>}
            <span style={{ color:cols[h.t] || "#c8f0d0" }}>{h.v}</span>
          </div>
        ))}
        <div ref={bref}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", padding:"7px 16px",
        borderTop:"1px solid rgba(0,255,136,0.08)", background:"rgba(0,0,0,0.5)" }}>
        <span style={{ color:"#0098ff", marginRight:4, flexShrink:0, whiteSpace:"nowrap" }}>
          C:\Users\alex\portfolio&gt;
        </span>
        <input ref={iref} value={inp} onChange={e => si(e.target.value)} onKeyDown={onKey}
          autoFocus spellCheck={false}
          style={{ flex:1, background:"transparent", border:"none", outline:"none",
            color:"#fff", fontFamily:"inherit", fontSize:"inherit" }}/>
        <span style={{ color:"#00ff88", animation:"blink 1s infinite" }}>█</span>
      </div>
      <style>{`@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RECYCLE BIN APP
═══════════════════════════════════════════════════════════════ */
function RecycleBinApp() {
  const [sel, ss] = useState(null);
  const [toast, st] = useState(false);

  const tryDelete = () => { st(true); setTimeout(() => st(false), 2200); };

  return (
    <div style={{ fontFamily:F, color:"#fff", height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Toolbar */}
      <div style={{ padding:"7px 14px", background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.06)",
        display:"flex", gap:7 }}>
        {["Restore", "Empty Recycle Bin"].map(t => (
          <button key={t} onClick={tryDelete}
            style={{ padding:"4px 13px", background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.09)", borderRadius:4, color:"rgba(255,255,255,0.72)",
              fontSize:12, cursor:"pointer", fontFamily:F }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* File list */}
        <div style={{ flex:1, overflow:"auto", ...SB }}>
          {/* Column headers */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 110px", padding:"5px 16px",
            borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(0,0,0,0.3)" }}>
            {["Name","Date Deleted"].map(h => (
              <span key={h} style={{ fontSize:11, color:"rgba(255,255,255,0.38)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</span>
            ))}
          </div>
          {TRASH.map((f, i) => (
            <div key={f.name} onClick={() => ss(i === sel ? null : i)}
              style={{ display:"grid", gridTemplateColumns:"1fr 110px", alignItems:"center",
                padding:"8px 16px", cursor:"default",
                background: sel === i ? "rgba(0,120,215,0.18)" : "transparent",
                borderBottom:"1px solid rgba(255,255,255,0.04)", transition:"background 0.1s" }}
              onMouseEnter={e => { if (sel !== i) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (sel !== i) e.currentTarget.style.background="transparent"; }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>{f.icon}</span>
                <span style={{ fontSize:13 }}>{f.name}</span>
              </div>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.38)" }}>{f.date}</span>
            </div>
          ))}
        </div>
        {/* Detail pane */}
        <AnimatePresence>
          {sel !== null && (
            <motion.div initial={{ width:0, opacity:0 }} animate={{ width:220, opacity:1 }} exit={{ width:0, opacity:0 }}
              style={{ borderLeft:"1px solid rgba(255,255,255,0.06)", overflow:"hidden",
                background:"rgba(255,255,255,0.02)", flexShrink:0 }}>
              <div style={{ padding:18, width:220 }}>
                <p style={{ fontSize:22, margin:"0 0 8px" }}>{TRASH[sel]?.icon}</p>
                <p style={{ margin:"0 0 6px", fontSize:13, fontWeight:500, wordBreak:"break-word" }}>{TRASH[sel]?.name}</p>
                <p style={{ margin:"0 0 16px", fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>
                  {TRASH[sel]?.msg}
                </p>
                <button onClick={tryDelete}
                  style={{ width:"100%", padding:"8px 0", background:"rgba(255,80,80,0.1)",
                    border:"1px solid rgba(255,80,80,0.25)", borderRadius:6, color:"#ff6464",
                    fontSize:12, cursor:"pointer", fontFamily:F }}>
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)",
              background:"rgba(30,30,50,0.95)", border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:8, padding:"10px 18px", fontSize:13, whiteSpace:"nowrap",
              boxShadow:"0 8px 24px rgba(0,0,0,0.6)" }}>
            ❌ Access Denied — These files are eternal.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP WINDOW CHROME (Now Resizable!)
═══════════════════════════════════════════════════════════════ */
function AppWindow({ win, isActive, dispatch, children }) {
  const ref = useRef(null);
  const drag = useRef(null);

  // 1. Existing Drag Logic (Moving the window)
  const startDrag = useCallback((e) => {
    if (win.maximized || e.button !== 0) return;
    e.preventDefault();
    const r = ref.current?.getBoundingClientRect();
    drag.current = { sx:e.clientX, sy:e.clientY, ox:r?.left ?? win.x, oy:r?.top ?? win.y };
    const move = ev => {
      if (!drag.current) return;
      const nx = Math.max(0, drag.current.ox + ev.clientX - drag.current.sx);
      const ny = Math.max(0, drag.current.oy + ev.clientY - drag.current.sy);
      if (ref.current) { ref.current.style.left = nx+"px"; ref.current.style.top = ny+"px"; }
      drag.current.lx = nx; drag.current.ly = ny;
    };
    const up = () => {
      if (drag.current?.lx !== undefined) dispatch({ type:"MOVE", id:win.id, x:drag.current.lx, y:drag.current.ly });
      drag.current = null;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, [win, dispatch]);

  // 2. NEW: Resize Logic
  const startResize = useCallback((e, dir) => {
    if (win.maximized || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation(); // Prevents the window from focusing/dragging while resizing

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.width;
    const startH = win.height;

    const move = (ev) => {
      // Calculate new dimensions (min width: 300px, min height: 200px)
      let newW = startW;
      let newH = startH;
      
      if (dir.includes('e')) newW = Math.max(300, startW + (ev.clientX - startX));
      if (dir.includes('s')) newH = Math.max(200, startH + (ev.clientY - startY));

      // Live update the DOM for smoothness
      if (ref.current) {
        if (dir.includes('e')) ref.current.style.width = newW + "px";
        if (dir.includes('s')) ref.current.style.height = newH + "px";
      }
      
      drag.current = { w: newW, h: newH };
    };

    const up = () => {
      // Save the final size to state
      if (drag.current?.w !== undefined) {
        dispatch({ type: "RESIZE", id: win.id, w: drag.current.w, h: drag.current.h });
      }
      drag.current = null;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, [win, dispatch]);

  const AppIconComp = APPS.find(a => a.id === win.id)?.icon ?? FileText;
  const ws = win.maximized
    ? { left:0, top:0, width:"100vw", height:"calc(100vh - 48px)", borderRadius:0 }
    : { left:win.x, top:win.y, width:win.width, height:win.height, borderRadius:10 };

  return (
    <AnimatePresence>
      {!win.minimized && (
        <motion.div ref={ref} key={win.id}
          initial={{ scale:0.88, opacity:0, y:18 }}
          animate={{ scale:1, opacity:1, y:0 }}
          exit={{ scale:0.88, opacity:0, y:18, transition:{ duration:0.16 } }}
          transition={{ type:"spring", stiffness:330, damping:28 }}
          onMouseDown={() => dispatch({ type:"FOCUS", id:win.id })}
          onContextMenu={e => e.stopPropagation()}
          style={{ position:"fixed", zIndex:win.z, display:"flex", flexDirection:"column",
            ...GS,
            border: isActive ? "1px solid rgba(0,120,215,0.38)" : "1px solid rgba(255,255,255,0.07)",
            boxShadow: isActive
              ? "0 28px 80px rgba(0,0,0,0.88), 0 0 0 1px rgba(0,120,215,0.1)"
              : "0 12px 42px rgba(0,0,0,0.72)",
            overflow:"hidden", transition:"border-color 0.18s, box-shadow 0.18s", ...ws }}>
            
          {/* Title bar */}
          <div onMouseDown={startDrag} onDoubleClick={() => dispatch({ type:"MAXIMIZE", id:win.id })}
            style={{ display:"flex", alignItems:"center", height:38, flexShrink:0,
              background: isActive ? "rgba(0,120,215,0.09)" : "rgba(10,10,22,0.85)",
              borderBottom:"1px solid rgba(255,255,255,0.05)",
              userSelect:"none", cursor:"default" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, paddingLeft:12, flex:1, minWidth:0 }}>
              <AppIconComp size={13} color={isActive ? BLUE : "rgba(255,255,255,0.38)"}/>
              <span style={{ fontSize:12.5, fontFamily:F,
                color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.52)",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {win.title}
              </span>
            </div>
            <div style={{ display:"flex", alignSelf:"stretch", zIndex: 20 }}>
              <WBtn onClick={() => dispatch({ type:"MINIMIZE", id:win.id })}><Minus size={11}/></WBtn>
              <WBtn onClick={() => dispatch({ type:"MAXIMIZE", id:win.id })}><Maximize2 size={10}/></WBtn>
              <WBtn onClick={() => dispatch({ type:"CLOSE", id:win.id })} danger><X size={12}/></WBtn>
            </div>
          </div>

          <div style={{ flex:1, overflow:"hidden", position:"relative" }}>{children}</div>

          {/* NEW: Invisible Resize Handles (Only active if not maximized) */}
          {!win.maximized && (
            <>
              {/* Right Edge */}
              <div onMouseDown={e => startResize(e, 'e')} style={{ position:"absolute", right:0, top:0, bottom:10, width:6, cursor:"ew-resize", zIndex:10 }} />
              {/* Bottom Edge */}
              <div onMouseDown={e => startResize(e, 's')} style={{ position:"absolute", left:0, bottom:0, right:10, height:6, cursor:"ns-resize", zIndex:10 }} />
              {/* Bottom Right Corner */}
              <div onMouseDown={e => startResize(e, 'se')} style={{ position:"absolute", right:0, bottom:0, width:14, height:14, cursor:"nwse-resize", zIndex:11 }} />
            </>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP ICON
═══════════════════════════════════════════════════════════════ */
function DesktopIcon({ app, onOpen }) {
  const [h, sh] = useState(false);
  const [clicks, sc] = useState(0);
  const timer = useRef(null);
  
  // State to hold the final coordinates
  const [coords, setCoords] = useState({ x: app.initX || 0, y: app.initY || 0 });

  useEffect(() => {
    // If initX/initY is null (like our Recycle Bin), calculate bottom right corner
    if (app.initX === null || app.initY === null) {
      const calculateBottomRight = () => {
        const iconWidth = 82; // Our icon wrapper width
        const iconHeight = 100; // Rough height including text
        const taskbarHeight = 48;
        const padding = 20;

        setCoords({
          x: window.innerWidth - iconWidth - padding,
          y: window.innerHeight - taskbarHeight - iconHeight - padding
        });
      };

      // Calculate initially
      calculateBottomRight();

      // Recalculate if the window is resized
      window.addEventListener('resize', calculateBottomRight);
      return () => window.removeEventListener('resize', calculateBottomRight);
    }
  }, [app.initX, app.initY]);

  const onClick = () => {
    sc(c => c + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => sc(0), 350);
  };

  useEffect(() => { if (clicks >= 2) { onOpen(app); sc(0); } }, [clicks, app, onOpen]);

  const Icon = app.icon;

  return (
    <motion.div 
      drag 
      dragMomentum={false} 
      onClick={onClick} 
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{ 
        position: "absolute", 
        top: coords.y,
        left: coords.x,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        padding: "9px 7px", borderRadius: 7, cursor: "default", width: 82,
        background: h ? "rgba(255,255,255,0.09)" : "transparent",
        border: h ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
        transition: "background 0.14s, border 0.14s", userSelect: "none", zIndex: 10 
      }}>
      
      <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", dropShadow: "0 4px 6px rgba(0,0,0,0.5)" }}>
         <Icon size={40} style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }} />
      </div>

      <span style={{ fontSize: 11, color: "#fff", textAlign: "center", lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.9)", maxWidth: 76, wordBreak: "break-word" }}>
        {app.title}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   START MENU
═══════════════════════════════════════════════════════════════ */
function StartMenu({ onClose, onOpen }) {
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
      transition={{ type:"spring", stiffness:340, damping:30 }}
      style={{ position:"fixed", bottom:54, left:0, width:340, zIndex:9992,
        ...GS, border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"12px 12px 0 0", overflow:"hidden",
        boxShadow:"0 -12px 44px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)", fontFamily:F }}>
      {/* User header */}
      <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:21, flexShrink:0,
            background:"linear-gradient(135deg, #0078d7, #00d4aa)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:600 }}>AC</div>
          <div>
            <div style={{ fontSize:14, fontWeight:500 }}>{PROFILE.name}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{PROFILE.title}</div>
          </div>
        </div>
      </div>
      {/* Pinned apps */}
      <div style={{ padding:"8px 10px 6px" }}>
        <p style={{ fontSize:10.5, letterSpacing:"0.1em", textTransform:"uppercase",
          color:"rgba(255,255,255,0.28)", margin:"4px 8px 8px" }}>Pinned</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
          {APPS.map(a => {
            const Icon = a.icon;
            return (
              <button key={a.id} onClick={() => { onOpen(a); onClose(); }}
                style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:7,
                  background:"transparent", border:"1px solid transparent", color:"#fff",
                  cursor:"pointer", fontFamily:F, fontSize:13, textAlign:"left", transition:"all 0.12s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="transparent"; }}>
                <div style={{ width:30, height:30, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                  background: a.id==="terminal" ? "#0c0c14" : a.id==="recycle" ? "#2a2a3c" : BLUE+"bb" }}>
                  <Icon size={15} color={a.id==="terminal" ? "#00ff88" : "#fff"}/>
                </div>
                <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <div style={{ padding:"10px 16px 14px", borderTop:"1px solid rgba(255,255,255,0.07)",
        display:"flex", justifyContent:"flex-end", gap:8 }}>
        
        {/* Settings Button */}
        <button 
          onClick={() => {
            onOpen(APPS.find(a => a.id === "settings")); // Opens the Settings app
            onClose(); // Closes the Start Menu
          }}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.09)",
            borderRadius:7, color:"rgba(255,255,255,0.7)", fontSize:12, cursor:"pointer", fontFamily:F }}>
          <Settings size={13}/> Settings
        </button>

        {/* Power / Restart Button */}
        <button 
          onClick={() => window.location.reload()} // Restarts the OS
          style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
            background:"rgba(255,70,70,0.1)", border:"1px solid rgba(255,70,70,0.2)",
            borderRadius:7, color:"#ff6464", fontSize:12, cursor:"pointer", fontFamily:F }}>
          <Power size={13}/> Restart
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TASKBAR
═══════════════════════════════════════════════════════════════ */
function Taskbar({ windows, activeId, dispatch, startOpen, setStartOpen }) {
  const [time, st] = useState(new Date());
  useEffect(() => { const t = setInterval(() => st(new Date()), 1000); return () => clearInterval(t); }, []);
  const fmt  = d => d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  const fmtD = d => d.toLocaleDateString([], { month:"short", day:"numeric" });

  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, height:48, zIndex:9999,
      background:"rgba(10,10,20,0.94)", backdropFilter:"blur(28px) saturate(160%)",
      borderTop:"1px solid rgba(255,255,255,0.06)",
      display:"flex", alignItems:"center", padding:"0 8px", gap:3, fontFamily:F }}>
      {/* Start button */}
      <button onClick={() => setStartOpen(p => !p)}
        style={{ width:46, height:40, display:"flex", alignItems:"center", justifyContent:"center",
          background: startOpen ? "rgba(0,120,215,0.22)" : "transparent",
          border: startOpen ? "1px solid rgba(0,120,215,0.4)" : "1px solid transparent",
          borderRadius:7, cursor:"pointer", transition:"all 0.14s", flexShrink:0 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:3 }}>
          {["#f25022","#7fba00","#00a4ef","#ffb900"].map((c, i) => (
            <div key={i} style={{ width:7, height:7, background:c, borderRadius:0.5 }}/>
          ))}
        </div>
      </button>

      {/* Search bar */}
      <div style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 12px",
        background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:6, cursor:"text", marginRight:6, flexShrink:0 }}>
        <Search size={13} color="rgba(255,255,255,0.45)"/>
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)" }}>Search</span>
      </div>

      {/* Open windows */}
      <div style={{ display:"flex", gap:3, flex:1, overflow:"hidden" }}>
        {windows.map(w => {
          const Icon = APPS.find(a => a.id === w.id)?.icon ?? FileText;
          const isActive = w.id === activeId && !w.minimized;
          const isOpen = !w.minimized;
          return (
            <motion.button key={w.id} layout
              onClick={() => {
                if (w.minimized) dispatch({ type:"FOCUS", id:w.id });
                else if (w.id === activeId) dispatch({ type:"MINIMIZE", id:w.id });
                else dispatch({ type:"FOCUS", id:w.id });
              }}
              title={w.title}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"0 10px",
                height:40, minWidth:36, maxWidth:148,
                background: isActive ? "rgba(0,120,215,0.18)" : isOpen ? "rgba(255,255,255,0.07)" : "transparent",
                border:`1px solid ${isActive ? "rgba(0,120,215,0.32)" : "rgba(255,255,255,0.07)"}`,
                borderRadius:6, cursor:"default", color: isActive ? "#fff" : "rgba(255,255,255,0.62)",
                fontSize:12, fontFamily:F, position:"relative", transition:"all 0.14s",
                outline:"none", flexShrink:0 }}>
              <Icon size={14} color={isActive ? BLUE : "rgba(255,255,255,0.55)"}/>
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:90 }}>
                {w.title}
              </span>
              {/* Active indicator */}
              <motion.div animate={{ width: isActive ? 18 : isOpen ? 5 : 0 }}
                style={{ position:"absolute", bottom:2, left:"50%", transform:"translateX(-50%)",
                  height:2, background:BLUE, borderRadius:1 }}/>
            </motion.button>
          );
        })}
      </div>

      {/* System tray */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 8px",
        borderLeft:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <Wifi size={14} color="rgba(255,255,255,0.52)"/>
        <Volume2 size={14} color="rgba(255,255,255,0.52)"/>
        <Bell size={14} color="rgba(255,255,255,0.52)"/>
      </div>

      {/* Clock */}
      <div style={{ paddingLeft:8, paddingRight:4, textAlign:"right", cursor:"pointer", flexShrink:0,
        borderLeft:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.88)", fontWeight:500, lineHeight:1.2 }}>{fmt(time)}</div>
        <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.42)", lineHeight:1.2 }}>{fmtD(time)}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP CONTAINER
═══════════════════════════════════════════════════════════════ */
function Desktop({ onOpen, bg, children }) {
  const [ctx, sctx] = useState(null);

  // Added functions to make the right click actually do something!
  const handleContextMenuClick = (action) => {
    sctx(null); // Close the menu
    if (action === "Refresh") window.location.reload();
    if (action === "New Folder") alert("Creating a new folder is not supported in this portfolio OS.");
    if (action === "Personalize") {
      // Actually open the new Settings app!
      onOpen(APPS.find(a => a.id === "settings"));
    }
  };

  const CTX_ITEMS = [
    { label:"Refresh",         icon:RefreshCw, action: "Refresh" },
    { sep:true },
    { label:"New Folder",      icon:Folder, action: "New Folder" },
    { sep:true },
    { label:"Display Settings",icon:Monitor, action: "Personalize" },
    { label:"Personalize",     icon:Settings, action: "Personalize" },
  ];

  return (
    <div onContextMenu={e => { e.preventDefault(); sctx({ x:e.clientX, y:e.clientY }); }}
      onClick={() => sctx(null)}
      style={{ width:"100vw", height:"calc(100vh - 48px)", position:"relative", overflow:"hidden",
        background: bg // THIS IS THE MAGIC LINE: It now uses your dynamic wallpaper state!
      }}>
      
      {/* Desktop icons container (Grid layout removed so dragging works freely!) */}
      <div style={{ position:"absolute", inset:0 }}>
        {APPS.map(app => <DesktopIcon key={app.id} app={app} onOpen={onOpen}/>)}
      </div>

      {/* Windows */}
      {children}

      {/* Context menu (Right Click) */}
      <AnimatePresence>
        {ctx && (
          <motion.div initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0, scale:0.94 }} transition={{ duration:0.1 }}
            onClick={e => e.stopPropagation()}
            style={{ position:"fixed", left:ctx.x, top:Math.min(ctx.y, window.innerHeight - 200),
              zIndex:9998, width:198, ...GS,
              border:"1px solid rgba(255,255,255,0.1)", borderRadius:9, overflow:"hidden",
              boxShadow:"0 16px 44px rgba(0,0,0,0.75)", fontFamily:F, padding:"4px 0" }}>
            {CTX_ITEMS.map((item, i) => item.sep
              ? <div key={i} style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"3px 0" }}/>
              : (
                <button key={item.label} onClick={() => handleContextMenuClick(item.action)}
                  style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
                    padding:"8px 14px", background:"transparent", border:"none",
                    color:"rgba(255,255,255,0.8)", fontSize:13, cursor:"default",
                    textAlign:"left", fontFamily:F, transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(0,120,215,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <item.icon size={14} color="rgba(255,255,255,0.48)"/> {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOOT SCREEN
═══════════════════════════════════════════════════════════════ */
function BootScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <motion.div key="boot" exit={{ opacity:0 }} transition={{ duration:0.55 }}
      style={{ position:"fixed", inset:0, background:"#000", zIndex:99999,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:36 }}>
      {/* Windows logo */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {["#f25022","#7fba00","#00a4ef","#ffb900"].map((c, i) => (
          <motion.div key={c}
            initial={{ opacity:0, scale:0.4, rotate:-15 }}
            animate={{ opacity:1, scale:1, rotate:0 }}
            transition={{ delay:i*0.1, type:"spring", stiffness:260, damping:18 }}
            style={{ width:38, height:38, background:c, borderRadius:2 }}/>
        ))}
      </div>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
        style={{ fontFamily:F, color:"rgba(255,255,255,0.55)", fontSize:13.5, letterSpacing:"0.05em", margin:0 }}>
        Loading portfolio...
      </motion.p>
      {/* Progress bar */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
        style={{ width:200, height:2, background:"rgba(255,255,255,0.1)", borderRadius:1, overflow:"hidden" }}>
        <motion.div initial={{ x:"-100%" }} animate={{ x:"100%" }}
          transition={{ repeat:Infinity, duration:1.1, ease:"easeInOut", delay:0.9 }}
          style={{ width:"60%", height:"100%", background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }}/>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
const APP_CONTENT = {
  about:      <AboutApp/>,
  experience: <ExperienceApp/>,
  projects:   <ProjectsApp/>,
  cv:         <CVApp/>,
  contact:    <ContactApp/>,
  terminal:   <TerminalApp/>,
  recycle:    <RecycleBinApp/>,
  // ADD THIS LINE:
  settings:   <SettingsApp/>, 
};

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [booted, sb] = useState(false);
  const [state, dispatch] = useReducer(wm, WM0);
  const [startOpen, sos] = useState(false);
  
  // NEW: Global background state
  const [bg, setBg] = useState(WALLPAPERS[0].val);

  const openApp = useCallback((app) => { dispatch({ type:"OPEN", app }); sos(false); }, []);

  // NEW: Render apps via function so we can pass props to Settings
  const renderAppContent = (id) => {
    switch (id) {
      case "about":      return <AboutApp />;
      case "experience": return <ExperienceApp />;
      case "projects":   return <ProjectsApp />;
      case "cv":         return <CVApp />;
      case "contact":    return <ContactApp />;
      case "terminal":   return <TerminalApp />;
      case "recycle":    return <RecycleBinApp />;
      case "settings":   return <SettingsApp bg={bg} setBg={setBg} />;
      default:           return null;
    }
  };

  return (
    <div style={{ fontFamily:F, width:"100vw", height:"100vh", overflow:"hidden", background:"#060612" }}>
      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
        input:focus, textarea:focus { border-color: rgba(0,120,215,0.5) !important; box-shadow: 0 0 0 2px rgba(0,120,215,0.1); }
      `}</style>

      <AnimatePresence>{!booted && <BootScreen onDone={() => sb(true)}/>}</AnimatePresence>

      {booted && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}>
          {/* NEW: Pass bg to Desktop */}
          <Desktop onOpen={openApp} bg={bg}>
            {state.windows.map(win => (
              <AppWindow key={win.id} win={win} isActive={state.activeId === win.id} dispatch={dispatch}>
                {renderAppContent(win.id)}
              </AppWindow>
            ))}
          </Desktop>
          
          <Taskbar 
            windows={state.windows} 
            activeId={state.activeId} 
            dispatch={dispatch} 
            startOpen={startOpen} 
            setStartOpen={sos} 
          />
          
          <AnimatePresence>
            {startOpen && <StartMenu onClose={() => sos(false)} onOpen={openApp} />}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}