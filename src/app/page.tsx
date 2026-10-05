"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import CanvasBackground from "@/components/CanvasBackground";
import SecurityHUD from "@/components/SecurityHUD";
import RootKeyphraseMode from "@/components/RootKeyphraseMode";
import BiometricScannerMode from "@/components/BiometricScannerMode";
import QuantumTOTPMode from "@/components/QuantumTOTPMode";
import AuditTerminal from "@/components/AuditTerminal";
import CommandDeck from "@/components/CommandDeck";
import { AUDIT_LOGS_INITIAL, formatTimestamp } from "@/lib/utils";
import { audioSynth } from "@/lib/audio";

type AuthMode = "root" | "biometric" | "totp";

export default function HomePage() {
  const [authMode, setAuthMode] = useState<AuthMode>("root");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>(AUDIT_LOGS_INITIAL);

  // Load mute state on mount
  useEffect(() => {
    const muted = audioSynth.getMuteState();
    setIsMuted(muted);
  }, []);

  // Lockout timer
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const interval = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          addLog("SEC_AUDIT: Tarpit lockout expired. Authentication portal reset.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const addLog = (message: string) => {
    const log = `[${formatTimestamp()}] ${message}`;
    setAuditLogs((prev) => [...prev, log]);
  };

  const handleModeSwitch = (mode: AuthMode) => {
    if (lockoutTime > 0) return;
    setAuthMode(mode);
    audioSynth.keystrokeClick();
    addLog(`AUTH_ENGINE: Switched to ${mode.toUpperCase()} authentication mode.`);
  };

  const handleAuthenticate = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      setLockoutTime(0);
      addLog("AUTH_ENGINE: Root credentials verified. Access granted.");
      addLog("SYS_INIT: Initializing Command Deck interface...");
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLockoutTime(20);
        addLog(
          "SEC_AUDIT: Brute-force attempt detected. Entering cryptographic tarpit mode."
        );
      } else {
        addLog(
          `AUTH_ENGINE: Authentication failed. Attempt ${newAttempts}/3.`
        );
      }
    }
  };

  const handleLogout = () => {
    audioSynth.keystrokeClick();
    setIsAuthenticated(false);
    setFailedAttempts(0);
    setLockoutTime(0);
    setAuthMode("root");
    setAuditLogs(AUDIT_LOGS_INITIAL);
    addLog("AUTH_ENGINE: Session revoked. Portal reset.");
  };

  const toggleMute = () => {
    const muted = audioSynth.toggleMute();
    setIsMuted(muted);
    addLog(`AUDIO_CONTROL: Sound ${muted ? "muted" : "unmuted"}.`);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--bg-obsidian)]">
      {/* Canvas Background */}
      <CanvasBackground />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Bar */}
        <div className="bg-[#0E111A] bg-opacity-80 backdrop-blur border-b border-[#1F293D] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              AEGIS-VAULT // SOVEREIGN ADMIN GATEWAY
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Zero-Trust Sovereign Perimeter. Access Granted Only to the
              Architects.
            </p>
          </div>
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-[#1a1f2e] rounded transition-colors"
          >
            {isMuted ? (
              <VolumeX className="text-[var(--accent-emerald)]" size={20} />
            ) : (
              <Volume2 className="text-[var(--accent-emerald)]" size={20} />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {isAuthenticated ? (
              <CommandDeck onLogout={handleLogout} />
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left: Security HUD */}
                <div>
                  <h3 className="text-xs text-gray-400 font-mono mb-3 uppercase tracking-wider">
                    Perimeter Status
                  </h3>
                  <SecurityHUD
                    failedAttempts={failedAttempts}
                    lockoutTime={lockoutTime}
                  />
                </div>

                {/* Center: Auth Card */}
                <div className="md:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#0E111A] border border-[#1F293D] rounded-lg p-6 backdrop-blur"
                  >
                    {/* Mode Switcher Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-[#1F293D] pb-4">
                      {(
                        [
                          { id: "root", label: "Root Keyphrase" },
                          { id: "biometric", label: "Biometric Scanner" },
                          { id: "totp", label: "Quantum TOTP" },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => handleModeSwitch(tab.id)}
                          disabled={lockoutTime > 0}
                          className={`px-3 py-2 text-xs font-mono rounded transition-colors ${
                            authMode === tab.id
                              ? "bg-[var(--accent-emerald)] text-black font-bold"
                              : "text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Auth Content */}
                    {lockoutTime > 0 ? (
                      <div className="text-center py-12">
                        <div className="text-[var(--alert-crimson)] text-lg font-bold mb-2">
                          🚨 PORTAL LOCKED
                        </div>
                        <div className="text-gray-400 mb-4">
                          Cryptographic tarpit active for {lockoutTime}s
                        </div>
                        <div className="text-4xl font-bold text-[var(--alert-crimson)]">
                          {lockoutTime}
                        </div>
                      </div>
                    ) : (
                      <>
                        {authMode === "root" && (
                          <RootKeyphraseMode
                            onAuthenticate={handleAuthenticate}
                          />
                        )}
                        {authMode === "biometric" && (
                          <BiometricScannerMode
                            onAuthenticate={handleAuthenticate}
                          />
                        )}
                        {authMode === "totp" && (
                          <QuantumTOTPMode
                            onAuthenticate={handleAuthenticate}
                          />
                        )}
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Terminal */}
      <AuditTerminal logs={auditLogs} />
    </div>
  );
}
