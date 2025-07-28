// app/(auth)/layout.tsx or app/(public)/layout.tsx
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white">{children}</main>
      <Footer />
    </>
  );
}
