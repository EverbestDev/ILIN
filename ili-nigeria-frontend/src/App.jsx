import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TopScroll from "./components/TopScroll";
import CookieConsent from "./components/CookieConsent";
import OfflineDetector from "./components/OfflineDetector";
import DefaultLayout from "./layouts/DefaultLayout";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import AuthLayout from "./layouts/AuthLayout";
import { useState, useEffect } from "react";

// Default Pages
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
import AboutPage from "./pages/Default/AboutPage";
import ContactPage from "./pages/Default/ContactPage";
import LanguagesPage from "./pages/Default/LangauagesPage";
import ServicesPage from "./pages/Default/ServicesPage";
import QuotePage from "./pages/Default/QuotePage";
import VerifySubscription from "./pages/Default/VerifySubscription";
import Login from "./pages/Default/Login";
import Privacy from "./pages/Default/Privacy";
import Terms from "./pages/Default/Terms";
import NotFound from "./pages/Default/NotFound";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AdminQuotes from "./pages/Admin/Quotes";
import Subscribers from "./pages/Admin/Subscribers";
import Contacts from "./pages/Admin/Contacts";
import AdminContacts from "./pages/Admin/AdminContacts";
import Schedules from "./pages/Admin/Schedules";
import Analytics from "./pages/Admin/Analytics";
import Settings from "./pages/Admin/Settings";

// Client Pages
import ClientDashboard from "./pages/Client/Dashboard";
import ClientOrders from "./pages/Client/Orders";
import ClientOrderDetails from "./pages/Client/OrderDetails";
import ClientMessages from "./pages/Client/Messages";
import ClientSettings from "./pages/Client/Settings";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error("Error caught by boundary:", error, errorInfo);
      setHasError(true);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Something went wrong.
        </h1>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AuthProvider>
          <OfflineDetector>
            <ErrorBoundary>
              <TopScroll />
              <Routes>
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
                  path="/verify-subscribe"
                  element={
                    <DefaultLayout>
                      <VerifySubscription />
                    </DefaultLayout>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <DefaultLayout>
                      <Privacy />
                    </DefaultLayout>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <DefaultLayout>
                      <Terms />
                    </DefaultLayout>
                  }
                />
                <Route
                  path="/request-quote"
                  element={
                    <DefaultLayout>
                      <QuotePage />
                    </DefaultLayout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/client/dashboard"
                  element={
                    <ClientLayout>
                      <ClientDashboard />
                    </ClientLayout>
                  }
                />
                <Route
                  path="/client/orders"
                  element={
                    <ClientLayout>
                      <ClientOrders />
                    </ClientLayout>
                  }
                />
                <Route
                  path="/client/orders/:orderId"
                  element={
                    <ClientLayout>
                      <ClientOrderDetails />
                    </ClientLayout>
                  }
                />
                <Route
                  path="/client/messages"
                  element={
                    <ClientLayout>
                      <ClientMessages />
                    </ClientLayout>
                  }
                />
                <Route
                  path="/client/settings"
                  element={
                    <ClientLayout>
                      <ClientSettings />
                    </ClientLayout>
                  }
                />
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
                  path="/admin/public-contacts"
                  element={
                    <AdminLayout>
                      <AdminContacts />
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
                
                {/* 404 Catch-All Route - Must be LAST */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Cookie Consent - Shows on all pages */}
              <CookieConsent />
            </ErrorBoundary>
          </OfflineDetector>
        </AuthProvider>
      </Router>
    </I18nextProvider>
  );
}

export default App;