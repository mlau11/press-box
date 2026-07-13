import { useRef, useState, useEffect, type ReactNode } from "react";
import Navbar from "./Navbar";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar scrolled={scrolled} />
      <main ref={mainRef} className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
