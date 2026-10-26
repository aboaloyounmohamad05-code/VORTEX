import { motion, useReducedMotion } from "framer-motion";

export function Reveal({ children, delay = 0, y = 28, className = "", once = true }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MaskLines({ lines, className = "", lineClassName = "", as: Tag = "span" }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={reduce ? false : { y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tag>{line}</Tag>
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] ${className}`}>
      {children}
    </p>
  );
}
