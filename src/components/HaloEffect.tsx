import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { twilight } from "@/lib/design-tokens";

const HaloEffect = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: clientX, y: clientY });
        if (!visible) setVisible(true);
      });
    };

    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchend", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onLeave);
    };
  }, [visible]);

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      animate={{
        x: pos.x - 80,
        y: pos.y - 80,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        x: { type: "spring", stiffness: 150, damping: 20, mass: 0.5 },
        y: { type: "spring", stiffness: 150, damping: 20, mass: 0.5 },
        opacity: { duration: 0.3 },
      }}
      style={{
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 50%,
          ${twilight.orb.colorPurple} 0%,
          ${twilight.orb.colorBlue} 40%,
          transparent 70%
        )`,
        filter: 'blur(20px)',
      }}
    />
  );
};

export default HaloEffect;
