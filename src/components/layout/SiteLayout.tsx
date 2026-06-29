import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { A11yProvider } from "@/components/a11y/A11yProvider";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <A11yProvider>
      <div className="bg-fx" aria-hidden>
        <div className="bg-fx__blob bg-fx__blob--gold" />
        <div className="bg-fx__blob bg-fx__blob--blue" />
        <div className="bg-fx__blob bg-fx__blob--center" />
      </div>
      <Header />
      <main className="flex-1 pt-0">{children}</main>
      <Footer />
      <FloatingContact />
      <div className="bg-grain" aria-hidden />
    </A11yProvider>
  );
}
