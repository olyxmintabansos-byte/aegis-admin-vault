"use client";

import { useState, useRef, useEffect } from "react";
import { Fingerprint, Scan } from "lucide-react";
import { generateBiometricToken } from "@/lib/utils";
import { audioSynth } from "@/lib/audio";

interface Props {
  onAuthenticate: (success: boolean) => void;
}

export default function BiometricScannerMode({ onAuthenticate }: Props) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [token, setToken] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;

    const animate = () => {
      ctx.fillStyle = "#0E111A";
      ctx.fillRect(0, 0, 300, 300);

      const centerX = 150;
      const centerY = 150;

      // Grid circles
      [50, 100, 130].forEach((radius) => {
        ctx.strokeStyle = "rgba(0, 245, 160, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshair
      ctx.strokeStyle = "rgba(0, 245, 160, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 140, centerY);
      ctx.lineTo(centerX + 140, centerY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 140);
      ctx.lineTo(centerX, centerY + 140);
      ctx.stroke();

      // Radar sweep
      if (scanning) {
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          130
        );
        gradient.addColorStop(0, "rgba(0, 245, 160, 0.6)");
        gradient.addColorStop(1, "rgba(0, 245, 160, 0)");

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 130, 0, Math.PI / 3);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();

        angle += 0.08;
      }

      // Progress ring
      if (progress > 0) {
        ctx.strokeStyle = "var(--accent-emerald)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          145,
          -Math.PI / 2,
          -Math.PI / 2 + (progress / 100) * Math.PI * 2
        );
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [scanning, progress]);

  const handleScanStart = () => {
    if (scanning) return;

    audioSynth.radarHum();
    setScanning(true);
    setProgress(0);
    setToken("");

    scanIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(scanIntervalRef.current);
          setScanning(false);
          const generatedToken = generateBiometricToken();
          setToken(generatedToken);
          audioSynth.biometricScan();
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  const handleAuthenticate = () => {
    if (!token) return;
    audioSynth.accessGranted();
    setTimeout(() => onAuthenticate(true), 500);
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-sm text-gray-400 font-mono mb-4">
          BIOMETRIC CYBER-SCANNER
        </h3>

        {/* Radar Canvas */}
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="border border-[#1F293D] rounded-lg"
          />
          {!scanning && progress === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Fingerprint
                size={80}
                className="text-[var(--accent-emerald)] opacity-30"
              />
            </div>
          )}
        </div>

        {/* Progress Text */}
        <div className="mt-3 font-mono text-sm">
          {scanning && (
            <span className="text-[var(--accent-cyan)]">
              Scanning... {progress}%
            </span>
          )}
          {!scanning && progress === 100 && (
            <span className="text-[var(--accent-emerald)]">
              ✓ Scan Complete
            </span>
          )}
          {!scanning && progress === 0 && (
            <span className="text-gray-500">Ready to scan</span>
          )}
        </div>
      </div>

      {/* Biometric Token */}
      {token && (
        <div className="bg-[#0E111A] border border-[#1F293D] rounded p-3">
          <div className="text-xs text-gray-400 font-mono mb-1">
            CRYPTOGRAPHIC PROOF TOKEN
          </div>
          <div className="text-xs text-[var(--accent-emerald)] font-mono break-all">
            {token}
          </div>
        </div>
      )}

      {/* Scan Button */}
      <button
        type="button"
        onClick={handleScanStart}
        disabled={scanning}
        className="w-full py-3 bg-[var(--accent-cyan)] text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Scan size={18} />
        {scanning ? "SCANNING..." : "INITIATE BIOMETRIC SCAN"}
      </button>

      {/* Authenticate Button */}
      {token && (
        <button
          type="button"
          onClick={handleAuthenticate}
          className="w-full py-3 bg-[var(--accent-emerald)] text-black font-bold rounded hover:opacity-90 transition-opacity"
        >
          AUTHENTICATE WITH BIOMETRIC
        </button>
      )}
    </div>
  );
}
