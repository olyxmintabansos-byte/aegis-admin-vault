"use client";

import { useState, useEffect } from "react";
import { Shield, Wifi, Lock, MapPin } from "lucide-react";
import { getDefconStatus, getGeoLocation } from "@/lib/utils";

interface Props {
  failedAttempts: number;
  lockoutTime?: number;
}

export default function SecurityHUD({ failedAttempts, lockoutTime }: Props) {
  const [ping, setPing] = useState(15);
  const defcon = getDefconStatus(failedAttempts);
  const geo = getGeoLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(12 + Math.random() * 6); // 12-18ms jitter
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
      {/* DEFCON Status */}
      <div className="col-span-2 bg-[#0E111A] border border-[#1F293D] rounded p-3 flex items-center gap-3">
        <Shield className={defcon.color} size={20} />
        <div className="flex-1">
          <div className="text-gray-400">THREAT CONDITION</div>
          <div className={`font-bold ${defcon.color}`}>{defcon.text}</div>
        </div>
      </div>

      {/* Latency */}
      <div className="bg-[#0E111A] border border-[#1F293D] rounded p-3">
        <div className="flex items-center gap-2 mb-1">
          <Wifi size={16} className="text-[var(--accent-emerald)]" />
          <span className="text-gray-400">LATENCY</span>
        </div>
        <div className="text-white font-bold">{ping.toFixed(1)}ms</div>
      </div>

      {/* Encryption */}
      <div className="bg-[#0E111A] border border-[#1F293D] rounded p-3">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={16} className="text-[var(--accent-cyan)]" />
          <span className="text-gray-400">PROTOCOL</span>
        </div>
        <div className="text-white font-bold">TLS 1.3</div>
      </div>

      {/* Geolocation */}
      <div className="col-span-2 bg-[#0E111A] border border-[#1F293D] rounded p-3">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={16} className="text-[var(--accent-emerald)]" />
          <span className="text-gray-400">ENCLAVE NODE</span>
        </div>
        <div className="text-white">{geo}</div>
      </div>

      {/* Lockout Timer */}
      {lockoutTime && lockoutTime > 0 && (
        <div className="col-span-2 bg-[var(--alert-crimson)] bg-opacity-10 border border-[var(--alert-crimson)] rounded p-3 text-center">
          <div className="text-[var(--alert-crimson)] font-bold text-lg">
            🚨 CRYPTOGRAPHIC TARPIT LOCKOUT
          </div>
          <div className="text-white text-2xl font-bold mt-1">
            {lockoutTime}s
          </div>
        </div>
      )}

      {/* Failed Attempts Indicator */}
      {failedAttempts > 0 && !lockoutTime && (
        <div className="col-span-2 bg-yellow-900 bg-opacity-10 border border-yellow-600 rounded p-2 text-center">
          <span className="text-yellow-500">
            ⚠️ Failed Attempts: {failedAttempts}/3
          </span>
        </div>
      )}
    </div>
  );
}
