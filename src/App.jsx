import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import ServicesOverview from "./components/ServicesOverview";
import LanguagesSupport from "./components/LanguagesSupport";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Nav />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <ServicesOverview />
                <LanguagesSupport />
                {/* <Contact /> */}
              </>
            }
          />

          <Route
            path="/about"
            element={
              <div className="max-w-4xl px-6 pt-24 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-center">
                  About ILI-Nigeria
                </h1>
                <p className="text-lg text-gray-600">
                  About page content coming soon...
                </p>
              </div>
            }
          />

          <Route
            path="/services"
            element={
              <div className="max-w-4xl px-6 pt-24 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-center">
                  Our Services
                </h1>
                <p className="text-lg text-gray-600">
                  Services content coming soon...
                </p>
              </div>
            }
          />

          <Route
            path="/languages"
            element={
              <div className="max-w-4xl px-6 pt-24 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-center">
                  Languages We Support
                </h1>
                <p className="text-lg text-gray-600">
                  Languages content coming soon...
                </p>
              </div>
            }
          />

          <Route
            path="/contact"
            element={
              <div className="max-w-4xl px-6 pt-24 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-center">
                  Contact Us
                </h1>
                <p className="text-lg text-gray-600">
                  Contact form coming soon...
                </p>
              </div>
            }
          />

          <Route
            path="/quote"
            element={
              <div className="max-w-4xl px-6 pt-24 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-center">
                  Get a Quote
                </h1>
                <p className="text-lg text-gray-600">
                  Quote form coming soon...
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
