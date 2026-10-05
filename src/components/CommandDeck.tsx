"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Database,
  Cpu,
  Activity,
  AlertTriangle,
  LogOut,
  Zap,
} from "lucide-react";
import { audioSynth } from "@/lib/audio";

interface Props {
  onLogout: () => void;
}

export default function CommandDeck({ onLogout }: Props) {
  const [sessionTime, setSessionTime] = useState(900); // 15 minutes
  const [showKillswitch, setShowKillswitch] = useState(false);
  const [killswitchInput, setKillswitchInput] = useState("");
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => Math.max(0, prev - 1));
      setCpuUsage(40 + Math.random() * 20);
      setRamUsage(60 + Math.random() * 15);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleKillswitch = () => {
    if (killswitchInput === "KILLSWITCH") {
      audioSynth.accessDenied();
      setTimeout(() => {
        alert("Emergency protocol activated. All systems shutting down...");
        onLogout();
      }, 1000);
    }
  };

  const microservices = [
    { name: "API Gateway", status: "OK", icon: Shield },
    { name: "Database Cluster", status: "SYNC", icon: Database },
    { name: "Firewall Engine", status: "ACTIVE", icon: Shield },
    { name: "Auth Service", status: "OK", icon: Shield },
    { name: "Cache Layer", status: "OK", icon: Cpu },
    { name: "Load Balancer", status: "OK", icon: Activity },
    { name: "Queue Manager", status: "OK", icon: Zap },
    { name: "Monitoring", status: "OK", icon: Activity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="bg-[#0E111A] border border-[var(--accent-emerald)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              AEGIS COMMAND DECK
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1">
              Commander Root // Clearance Level 5 (Omni-Access)
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 font-mono">SESSION TIMER</div>
            <div className="text-3xl font-bold text-[var(--accent-cyan)]">
              {formatTime(sessionTime)}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowKillswitch(true);
              audioSynth.keystrokeClick();
            }}
            className="flex-1 py-2 bg-[var(--alert-crimson)] text-white font-bold rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <AlertTriangle size={18} />
            EMERGENCY KILLSWITCH
          </button>
          <button
            onClick={() => {
              audioSynth.keystrokeClick();
              onLogout();
            }}
            className="flex-1 py-2 bg-[#1F293D] text-white font-bold rounded hover:bg-[#2a3548] transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            REVOKE SESSION / LOGOUT
          </button>
        </div>
      </div>

      {/* Microservices Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {microservices.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0E111A] border border-[#1F293D] rounded p-3"
          >
            <service.icon
              size={20}
              className="text-[var(--accent-emerald)] mb-2"
            />
            <div className="text-xs text-gray-400">{service.name}</div>
            <div className="text-sm font-bold text-[var(--accent-emerald)]">
              {service.status}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Gauges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0E111A] border border-[#1F293D] rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400 font-mono">CPU USAGE</span>
            <span className="text-white font-bold">{cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-black rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--accent-emerald)]"
              animate={{ width: `${cpuUsage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="bg-[#0E111A] border border-[#1F293D] rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400 font-mono">RAM USAGE</span>
            <span className="text-white font-bold">{ramUsage.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-black rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--accent-cyan)]"
              animate={{ width: `${ramUsage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Killswitch Modal */}
      {showKillswitch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowKillswitch(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-[#0E111A] border-2 border-[var(--alert-crimson)] rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[var(--alert-crimson)] mb-4">
              ⚠️ EMERGENCY KILLSWITCH PROTOCOL
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              This will immediately terminate all active sessions and shut down
              critical systems. Type <strong>KILLSWITCH</strong> to confirm.
            </p>
            <input
              type="text"
              value={killswitchInput}
              onChange={(e) => setKillswitchInput(e.target.value)}
              placeholder="Type KILLSWITCH..."
              className="w-full bg-black border border-[#1F293D] rounded px-4 py-3 text-white font-mono mb-4 focus:outline-none focus:border-[var(--alert-crimson)]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowKillswitch(false)}
                className="flex-1 py-2 bg-[#1F293D] text-white rounded hover:bg-[#2a3548] transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleKillswitch}
                disabled={killswitchInput !== "KILLSWITCH"}
                className="flex-1 py-2 bg-[var(--alert-crimson)] text-white font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ACTIVATE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
