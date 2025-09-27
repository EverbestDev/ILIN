import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
// import ServicesOverview from "./components/ServicesOverview";
import LanguagesSupport from "./components/LanguagesSupport";
import IndustryExpertise from "./components/IndustryExpertise";
import WhyChooseILI from "./components/WhyChooseILI";
import ProcessWalkthrough from "./components/ProcessWalkthrough";
import PricingPackages from "./components/PricingPackages";
import SuccessStories from "./components/SuccessStories";
import MeetOurTeam from "./components/MeetOurTeam";
import TechnologyTools from "./components/TechnologyTools";
import ContactGetStarted from "./components/ContactGetStarted";
import Footer from "./components/Footer";

// import scrolltotop
import TopScroll from "./components/TopScroll";

//Pages imports
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LanguagesPage from "./pages/LangauagesPage";
import ServicesPage from "./pages/ServicesPage";
import QuotePage from "./pages/QuotePage";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <TopScroll />
        <Nav />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                {/* <ServicesOverview /> */}
                <LanguagesSupport />
                <IndustryExpertise />
                <WhyChooseILI />
                <ProcessWalkthrough />
                <PricingPackages />
                <SuccessStories />
                <MeetOurTeam />
                <TechnologyTools />
                <ContactGetStarted />
              </>
            }
          />

          <Route path="/about" element={<AboutPage />} />

          <Route path="/services" element={<ServicesPage />} />

          <Route path="/languages" element={<LanguagesPage />} />

          <Route path="/contact" element={<ContactPage />} />

          <Route path="/quote" element={<QuotePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
