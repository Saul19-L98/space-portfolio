"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface Props {
  side: "left" | "right";
  closeHref: string;
  closeLabel?: string;
  testId: string;
  labelledBy: string;
  children: React.ReactNode;
}

/** Slide-in panel over the canvas. Content is server-rendered; only the shell animates. */
export function PanelShell({ side, closeHref, closeLabel = "Close", testId, labelledBy, children }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const h = ref.current?.querySelector<HTMLElement>("[data-panel-focus]");
    h?.focus({ preventScroll: true });
  }, []);
  const offset = side === "left" ? -32 : 32;
  return (
    <motion.aside
      ref={ref}
      className={`panel panel-${side}`}
      data-testid={testId}
      aria-labelledby={labelledBy}
      initial={reduce ? false : { opacity: 0, x: offset, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="panel-bar">
        <Link href={closeHref} className="hud-btn" data-testid="panel-close" scroll={false}>
          ← {closeLabel}
        </Link>
      </div>
      <div className="panel-body">{children}</div>
    </motion.aside>
  );
}
