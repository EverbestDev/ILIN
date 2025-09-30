import Nav from "../components/Nav";
import Footer from "../components/Footer";

const DefaultLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
