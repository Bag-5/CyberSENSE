"use client";

import { motion, useReducedMotion } from "framer-motion";

const cardOffsets = [
  "left-2 top-4 sm:left-8 sm:top-6",
  "right-0 top-24 sm:right-6 sm:top-24",
  "left-0 bottom-28 sm:left-4 sm:bottom-32",
  "right-6 bottom-4 sm:right-10 sm:bottom-8",
];

const zDepths = [20, 50, 80, 35];

const alerts = [
  {
    title: "Fake phishing alert",
    body: "Your account will be suspended in 2 minutes. Click here to verify now.",
    tone: "from-cyan-400/20 to-blue-500/10 border-cyan-300/30",
  },
  {
    title: "Suspicious login detected",
    body: "Unusual sign-in from Accra at 3:42 AM. Is this you?",
    tone: "from-fuchsia-400/20 to-purple-500/10 border-fuchsia-300/30",
  },
  {
    title: "Fake MoMo scam message",
    body: "You won 20,000 GHS. Send your PIN to claim the prize.",
    tone: "from-emerald-400/18 to-cyan-500/8 border-emerald-300/25",
  },
  {
    title: "Malware detected popup",
    body: "Your device is infected. Install this urgent cleaner immediately.",
    tone: "from-rose-400/18 to-orange-500/8 border-rose-300/25",
  },
];

export function FloatingAlertCards() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto h-[28rem] w-full max-w-[36rem]">
      {alerts.map((alert, index) => {
        return (
          <motion.article
            key={alert.title}
            className={`absolute w-[15rem] rounded-3xl border bg-slate-950/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:w-[17rem] ${cardOffsets[index]} ${alert.tone}`}
            style={{ z: zDepths[index] }}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 5.5 + index,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                  Alert {index + 1}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-white">
                  {alert.title}
                </h3>
              </div>
              <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{alert.body}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
