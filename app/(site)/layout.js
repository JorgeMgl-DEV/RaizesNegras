import Footer from "@/src/components/footer/footer";
import Navbar from "@/src/components/top-section/Navbar/Navbar";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
