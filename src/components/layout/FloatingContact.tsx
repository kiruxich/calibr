"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send, X, Phone } from "lucide-react";
import { SITE } from "@/lib/data/site";

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {open && (
        <div className="flex flex-col items-end gap-3">
          <a
            href={SITE.maxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface)] py-2.5 pl-4 pr-2.5 text-sm font-medium text-white shadow-lg transition hover:border-[#2787F5]"
          >
            MAX
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2787F5] to-[#7B5BFF] text-white">
              <MessageCircle className="h-5 w-5" />
            </span>
          </a>
          <a
            href={`https://t.me/${SITE.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface)] py-2.5 pl-4 pr-2.5 text-sm font-medium text-white shadow-lg transition hover:border-[#2AABEE]"
          >
            Telegram
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2AABEE] text-white">
              <Send className="h-4 w-4" />
            </span>
          </a>
          <a
            href={`tel:${SITE.phones[0].value}`}
            className="flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface)] py-2.5 pl-4 pr-2.5 text-sm font-medium text-white shadow-lg transition hover:border-[var(--accent)]"
          >
            Позвонить
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
              <Phone className="h-4 w-4" />
            </span>
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Закрыть контакты" : "Связаться с нами"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-xl transition hover:bg-[var(--accent-hover)]"
        style={{ boxShadow: "0 0 30px var(--accent-glow)" }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
