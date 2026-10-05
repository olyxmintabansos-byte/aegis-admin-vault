// Entropy calculation untuk passphrase
export function calculateEntropy(password: string): {
  entropy: number;
  bits: number;
  score: number;
  resistance: string;
} {
  const charsets = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /[0-9]/,
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  };

  let poolSize = 0;
  if (charsets.lowercase.test(password)) poolSize += 26;
  if (charsets.uppercase.test(password)) poolSize += 26;
  if (charsets.numbers.test(password)) poolSize += 10;
  if (charsets.symbols.test(password)) poolSize += 32;

  const bits = Math.log2(Math.pow(poolSize, password.length));
  const score = Math.min(100, (bits / 128) * 100);

  let resistance = "Weak";
  if (bits >= 50) resistance = "Fair";
  if (bits >= 80) resistance = "Good";
  if (bits >= 120) resistance = "Strong";
  if (bits >= 160) resistance = "Military-Grade";

  return {
    entropy: bits,
    bits: Math.round(bits),
    score: Math.round(score),
    resistance,
  };
}

// Format timestamp untuk audit logs
export function formatTimestamp(): string {
  const now = new Date();
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  const sec = String(now.getSeconds()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  return `${hour}:${min}:${sec}.${ms}`;
}

// Generate SHA-256 mock token
export function generateBiometricToken(): string {
  const chars = "0123456789abcdef";
  let token = "SHA-256::";
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(Math.random() * 16)];
  }
  return token;
}

// Simulate geolocation
export function getGeoLocation(): string {
  const locations = [
    "AP-SOUTHEAST-3 [Jakarta Sovereign Enclave]",
    "AP-SOUTHEAST-2 [Singapore Node]",
    "AP-SOUTH-1 [Mumbai Fortress]",
  ];
  return locations[0]; // Fixed untuk demo
}

// Defcon status berdasarkan failed attempts
export function getDefconStatus(failedAttempts: number): {
  level: number;
  text: string;
  color: string;
} {
  if (failedAttempts >= 3) {
    return {
      level: 2,
      text: "DEFCON 2 // ELEVATED RISK",
      color: "text-red-500",
    };
  }
  return {
    level: 4,
    text: "DEFCON 4 // NOMINAL PROTOCOL",
    color: "text-green-500",
  };
}

// Constants
export const VAULT_CREDS = {
  identity: "root@aegis-sentinel.io",
  passphrase: "AegisRoot#2026!",
};

export const AUDIT_LOGS_INITIAL = [
  "[00:08:11.204] SYS_INIT: Enclave memory isolation verified (Ring-0)",
  "[00:08:12.431] NET_STATUS: Gateway connected via TLS 1.3 ChaCha20",
  "[00:08:14.992] SEC_AUDIT: Zero-trust perimeter active. 0 anomalies detected.",
  "[00:08:17.102] AUTH_ENGINE: Waiting for root credentials or biometric signature...",
];
