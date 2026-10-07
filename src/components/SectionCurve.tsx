type WaveProps = {
  className?: string;
  fill?: string;
};

export const concernBlobs: Record<string, string> = {
  a: "M0.50,0.045 C0.26,0.01 0.08,0.14 0.055,0.36 C0.03,0.58 0.09,0.74 0.16,0.86 C0.26,0.98 0.40,0.995 0.54,0.98 C0.74,0.96 0.93,0.84 0.96,0.62 C0.99,0.40 0.90,0.16 0.70,0.06 C0.62,0.03 0.56,0.04 0.50,0.045 Z",
  b: "M0.48,0.03 C0.22,0.02 0.06,0.18 0.04,0.40 C0.02,0.62 0.10,0.80 0.20,0.90 C0.32,0.995 0.48,0.99 0.62,0.97 C0.82,0.94 0.97,0.78 0.975,0.56 C0.98,0.32 0.86,0.10 0.66,0.04 C0.58,0.02 0.52,0.02 0.48,0.03 Z",
  c: "M0.52,0.05 C0.28,0.00 0.07,0.12 0.045,0.34 C0.02,0.56 0.07,0.76 0.15,0.88 C0.26,0.99 0.44,1 0.58,0.975 C0.78,0.94 0.95,0.80 0.97,0.58 C0.99,0.36 0.88,0.12 0.68,0.045 C0.60,0.02 0.56,0.035 0.52,0.05 Z",
  d: "M0.46,0.04 C0.20,0.03 0.05,0.20 0.04,0.42 C0.03,0.64 0.12,0.82 0.22,0.91 C0.34,0.995 0.50,0.985 0.64,0.96 C0.84,0.92 0.98,0.76 0.97,0.54 C0.96,0.30 0.84,0.08 0.64,0.035 C0.56,0.015 0.50,0.025 0.46,0.04 Z",
  e: "M0.54,0.035 C0.30,0.00 0.09,0.15 0.05,0.38 C0.02,0.60 0.08,0.78 0.17,0.89 C0.28,0.99 0.46,0.995 0.60,0.97 C0.80,0.94 0.96,0.80 0.975,0.58 C0.99,0.36 0.88,0.11 0.68,0.04 C0.60,0.015 0.56,0.02 0.54,0.035 Z",
};

export function CurveDefs() {
  return (
    <svg className="curve-defs" width="0" height="0" aria-hidden="true">
      <defs>
        {Object.entries(concernBlobs).map(([id, d]) => (
          <clipPath id={`medad-blob-${id}`} key={id} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}

export function WaveTop({ className = "wave-top", fill = "#f7e3de" }: WaveProps) {
  return (
    <svg className={className} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill={fill}
        d="M0,78 C160,86 280,36 460,28 C640,20 760,52 940,34 C1100,18 1260,46 1440,24 L1440,120 L0,120 Z"
      />
    </svg>
  );
}

export function WaveBottom({ className = "wave-bottom", fill = "#f7e3de" }: WaveProps) {
  return (
    <svg className={className} viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill={fill}
        d="M0,0 H1440 V34 C1260,28 1120,78 940,92 C760,106 600,82 430,66 C250,48 120,24 0,40 Z"
      />
    </svg>
  );
}

export function ArchPhoto({ src, shape }: { src: string; shape: string }) {
  const d = concernBlobs[shape] ?? concernBlobs.a;
  return (
    <span className="arch">
      <svg className="arch-plate" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#fff" d={d} />
      </svg>
      <img src={src} alt="" style={{ clipPath: `url(#medad-blob-${shape})` }} />
    </span>
  );
}

export function LeafMark() {
  return (
    <svg className="leaf" viewBox="0 0 24 34" aria-hidden="true">
      <path fill="#d7a394" d="M12,1.2 C16.2,8 20,14.2 20,21.2 C20,27.6 16.4,32.4 12,32.4 C7.6,32.4 4,27.6 4,21.2 C4,14.2 7.8,8 12,1.2 Z" />
      <path d="M12,9.5 V26" fill="none" stroke="#fff7f4" strokeWidth="1.2" />
    </svg>
  );
}
