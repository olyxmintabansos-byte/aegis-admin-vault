"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { calculateEntropy, VAULT_CREDS } from "@/lib/utils";
import { audioSynth } from "@/lib/audio";

interface Props {
  onAuthenticate: (success: boolean) => void;
}

export default function RootKeyphraseMode({ onAuthenticate }: Props) {
  const [identity, setIdentity] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [showPass, setShowPass] = useState(false);

  const entropy = calculateEntropy(passphrase);

  const handleDemoAccess = () => {
    audioSynth.keystrokeClick();
    setIdentity(VAULT_CREDS.identity);
    setPassphrase(VAULT_CREDS.passphrase);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSynth.keystrokeClick();

    const valid =
      identity === VAULT_CREDS.identity &&
      passphrase === VAULT_CREDS.passphrase;

    if (valid) {
      audioSynth.accessGranted();
      setTimeout(() => onAuthenticate(true), 500);
    } else {
      audioSynth.accessDenied();
      onAuthenticate(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Identity Field */}
      <div>
        <label className="block text-sm text-gray-400 mb-2 font-mono">
          ROOT IDENTITY / API TOKEN
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            value={identity}
            onChange={(e) => {
              setIdentity(e.target.value);
              audioSynth.keystrokeClick();
            }}
            placeholder="root@aegis-sentinel.io"
            className="w-full bg-[#0E111A] border border-[#1F293D] rounded px-10 py-3 text-white font-mono text-sm focus:outline-none focus:border-[var(--accent-emerald)] transition-colors"
          />
        </div>
      </div>

      {/* Passphrase Field */}
      <div>
        <label className="block text-sm text-gray-400 mb-2 font-mono">
          MASTER CRYPTOGRAPHIC PASSPHRASE
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type={showPass ? "text" : "password"}
            value={passphrase}
            onChange={(e) => {
              setPassphrase(e.target.value);
              audioSynth.keystrokeClick();
            }}
            placeholder="Enter master passphrase..."
            className="w-full bg-[#0E111A] border border-[#1F293D] rounded px-10 py-3 text-white font-mono text-sm focus:outline-none focus:border-[var(--accent-emerald)] transition-colors"
          />
          <button
            type="button"
            onClick={() => {
              setShowPass(!showPass);
              audioSynth.keystrokeClick();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Entropy Meter */}
        {passphrase && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Entropy Score</span>
              <span
                className={
                  entropy.score >= 80
                    ? "text-[var(--accent-emerald)]"
                    : entropy.score >= 50
                    ? "text-yellow-500"
                    : "text-[var(--alert-crimson)]"
                }
              >
                {entropy.score}% / {entropy.bits} bits
              </span>
            </div>
            <div className="h-2 bg-[#0E111A] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${entropy.score}%`,
                  background:
                    entropy.score >= 80
                      ? "var(--accent-emerald)"
                      : entropy.score >= 50
                      ? "#eab308"
                      : "var(--alert-crimson)",
                }}
              />
            </div>
            <div className="text-xs text-gray-500 font-mono">
              Crack Resistance: <span className="text-white">{entropy.resistance}</span>
            </div>
          </div>
        )}
      </div>

      {/* Demo Access Button */}
      <button
        type="button"
        onClick={handleDemoAccess}
        className="w-full py-2.5 bg-[#0E111A] border border-[var(--accent-cyan)] text-[var(--accent-cyan)] rounded font-mono text-sm hover:bg-[#1a1f2e] transition-colors"
      >
        ⚡ 1-CLICK SOVEREIGN DEMO ACCESS
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={!identity || !passphrase}
        className="w-full py-3 bg-[var(--accent-emerald)] text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      >
        AUTHENTICATE ROOT ACCESS
      </button>
    </form>
  );
}
