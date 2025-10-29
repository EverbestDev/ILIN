import { useRTL } from "../hooks/useRTL";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const DefaultLayout = ({ children }) => {
  const dir = useRTL();
  return (
    <div dir={dir} className="min-h-screen bg-white">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
