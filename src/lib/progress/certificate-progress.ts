const PROGRESS_KEY = "cybersense.certificate.progress";
const CERTIFICATE_PROGRESS_EVENT = "cybersense:certificate-progress";

export type CertificateProgressState = {
  issued: Record<string, string>;
  updatedAt: string;
};

const defaultProgressState: CertificateProgressState = {
  issued: {},
  updatedAt: new Date().toISOString(),
};

let cachedProgress = defaultProgressState;
let cachedSerialized = JSON.stringify(defaultProgressState);

function isBrowser() {
  return typeof window !== "undefined";
}

function certificateKey(certificateType: string, subjectKey?: string | null) {
  return `${certificateType}:${subjectKey ?? "default"}`;
}

export function hasCertificateIssued(
  certificateType: string,
  subjectKey?: string | null,
) {
  return Boolean(loadCertificateProgress().issued[certificateKey(certificateType, subjectKey)]);
}

export function loadCertificateProgress(): CertificateProgressState {
  if (!isBrowser()) {
    return defaultProgressState;
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      cachedProgress = defaultProgressState;
      cachedSerialized = JSON.stringify(defaultProgressState);
      return defaultProgressState;
    }

    if (raw === cachedSerialized) {
      return cachedProgress;
    }

    const parsed = JSON.parse(raw) as Partial<CertificateProgressState>;
    cachedProgress = {
      issued: parsed.issued ?? {},
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
    cachedSerialized = raw;
    return cachedProgress;
  } catch {
    cachedProgress = defaultProgressState;
    cachedSerialized = JSON.stringify(defaultProgressState);
    return defaultProgressState;
  }
}

export function saveCertificateProgress(progress: CertificateProgressState) {
  if (!isBrowser()) {
    return;
  }

  cachedProgress = progress;
  cachedSerialized = JSON.stringify(progress);
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(CERTIFICATE_PROGRESS_EVENT));
}

export function recordCertificateProgress(input: {
  certificateType: "quiz" | "milestone" | "training";
  subjectKey?: string | null;
}) {
  const previousProgress = loadCertificateProgress();
  const nextProgress: CertificateProgressState = {
    ...previousProgress,
    issued: {
      ...previousProgress.issued,
      [certificateKey(input.certificateType, input.subjectKey)]: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };

  saveCertificateProgress(nextProgress);
  return nextProgress;
}

export function subscribeCertificateProgress(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(CERTIFICATE_PROGRESS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CERTIFICATE_PROGRESS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
