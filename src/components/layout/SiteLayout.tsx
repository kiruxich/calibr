import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { A11yProvider } from "@/components/a11y/A11yProvider";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <A11yProvider>
      <Header />
      <main className="flex-1 pt-0">{children}</main>
      <Footer />
    </A11yProvider>
  );
}
