import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopScroll from "./components/TopScroll";
import DefaultLayout from "./layouts/DefaultLayout";
import AdminLayout from "./layouts/AdminLayout";

// Client Pages
import Hero from "./components/Hero";
import About from "./components/About";
import LanguagesSupport from "./components/LanguagesSupport";
import IndustryExpertise from "./components/IndustryExpertise";
import WhyChooseILI from "./components/WhyChooseILI";
import ProcessWalkthrough from "./components/ProcessWalkthrough";
import PricingPackages from "./components/PricingPackages";
import SuccessStories from "./components/SuccessStories";
import MeetOurTeam from "./components/MeetOurTeam";
import TechnologyTools from "./components/TechnologyTools";
import ContactGetStarted from "./components/ContactGetStarted";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LanguagesPage from "./pages/LangauagesPage";
import ServicesPage from "./pages/ServicesPage";
import QuotePage from "./pages/QuotePage";
import Login from "./pages/Login";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AdminQuotes from "./pages/Admin/Quotes";
import Subscribers from "./pages/Admin/Subscribers";
import Contacts from "./pages/Admin/Contacts";
import Schedules from "./pages/Admin/Schedules";
import Analytics from "./pages/Admin/Analytics";
import Settings from "./pages/Admin/Settings";

function App() {
  return (
    <Router>
      <TopScroll />
      <Routes>
        {/* Client Pages */}
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Hero />
              <About />
              <LanguagesSupport />
              <IndustryExpertise />
              <WhyChooseILI />
              <ProcessWalkthrough />
              <PricingPackages />
              <SuccessStories />
              <MeetOurTeam />
              <TechnologyTools />
              <ContactGetStarted />
            </DefaultLayout>
          }
        />

        <Route
          path="/about"
          element={
            <DefaultLayout>
              <AboutPage />
            </DefaultLayout>
          }
        />

        <Route
          path="/services"
          element={
            <DefaultLayout>
              <ServicesPage />
            </DefaultLayout>
          }
        />

        <Route
          path="/languages"
          element={
            <DefaultLayout>
              <LanguagesPage />
            </DefaultLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <DefaultLayout>
              <ContactPage />
            </DefaultLayout>
          }
        />

        <Route
          path="/quote"
          element={
            <DefaultLayout>
              <QuotePage />
            </DefaultLayout>
          }
        />

        <Route
          path="/login"
          element={
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          }
        />

        {/* Admin Pages */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/quotes"
          element={
            <AdminLayout>
              <AdminQuotes />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/subscribers"
          element={
            <AdminLayout>
              <Subscribers />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/contacts"
          element={
            <AdminLayout>
              <Contacts />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/schedules"
          element={
            <AdminLayout>
              <Schedules />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
