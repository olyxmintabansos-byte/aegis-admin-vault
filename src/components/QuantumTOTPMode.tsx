"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { audioSynth } from "@/lib/audio";

interface Props {
  onAuthenticate: (success: boolean) => void;
}

export default function QuantumTOTPMode({ onAuthenticate }: Props) {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [validPin] = useState("123456"); // Demo PIN

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePinInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    audioSynth.keystrokeClick();
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-advance to next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleNumpadClick = (digit: string) => {
    const emptyIndex = pin.findIndex((p) => p === "");
    if (emptyIndex !== -1) {
      handlePinInput(emptyIndex, digit);
    }
  };

  const handleSubmit = () => {
    const enteredPin = pin.join("");
    if (enteredPin === validPin) {
      audioSynth.accessGranted();
      setTimeout(() => onAuthenticate(true), 500);
    } else {
      audioSynth.accessDenied();
      setPin(["", "", "", "", "", ""]);
      onAuthenticate(false);
    }
  };

  const isComplete = pin.every((p) => p !== "");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-sm text-gray-400 font-mono mb-4">
          QUANTUM TOTP 2FA AUTHENTICATION
        </h3>

        {/* Time Countdown Ring */}
        <div className="relative inline-block mb-6">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#1F293D"
              strokeWidth="2"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="var(--accent-cyan)"
              strokeWidth="3"
              strokeDasharray={`${(timeLeft / 30) * 376.99} 376.99`}
              strokeLinecap="round"
              style={{ transformOrigin: "70px 70px", transform: "rotate(-90deg)" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Clock className="text-[var(--accent-cyan)]" size={24} />
              <div className="text-lg font-bold text-[var(--accent-cyan)] mt-1">
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Slot PIN Input */}
      <div className="flex justify-center gap-3">
        {pin.map((digit, i) => (
          <input
            key={i}
            id={`pin-${i}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 bg-[#0E111A] border-2 border-[#1F293D] rounded text-center text-white font-mono text-xl font-bold focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
          />
        ))}
      </div>

      {/* Tactile Cyber Numpad */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleNumpadClick(String(digit))}
            disabled={pin.every((p) => p !== "")}
            className="py-3 bg-[#0E111A] border border-[#1F293D] rounded text-white font-bold hover:border-[var(--accent-emerald)] hover:text-[var(--accent-emerald)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleNumpadClick("0")}
          disabled={pin.every((p) => p !== "")}
          className="col-span-3 py-3 bg-[#0E111A] border border-[#1F293D] rounded text-white font-bold hover:border-[var(--accent-emerald)] hover:text-[var(--accent-emerald)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          0
        </button>
      </div>

      {/* Clear & Submit */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPin(["", "", "", "", "", ""])}
          className="py-2.5 bg-[#0E111A] border border-[var(--alert-crimson)] text-[var(--alert-crimson)] rounded font-mono text-sm hover:bg-[#1a1f2e] transition-colors"
        >
          CLEAR
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isComplete}
          className="py-2.5 bg-[var(--accent-emerald)] text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          VERIFY PIN
        </button>
      </div>
    </div>
  );
}
