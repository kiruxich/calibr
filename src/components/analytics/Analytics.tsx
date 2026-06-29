"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "calibr-cookie-consent";

/**
 * Loads Yandex.Metrika only after the user accepts cookies.
 * - Counter ID comes from NEXT_PUBLIC_YM_ID (no env → analytics disabled).
 * - Reacts to the "calibr-consent" event dispatched by CookieBanner, so it
 *   starts tracking immediately on accept without a page reload.
 */
export function Analytics() {
  const ymId = process.env.NEXT_PUBLIC_YM_ID;
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        if (localStorage.getItem(CONSENT_KEY) === "accepted") setAccepted(true);
      } catch {
        /* ignore */
      }
    };
    check();

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "accepted") setAccepted(true);
    };
    window.addEventListener("calibr-consent", onConsent);
    return () => window.removeEventListener("calibr-consent", onConsent);
  }, []);

  if (!ymId || !accepted) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${ymId}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${ymId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
