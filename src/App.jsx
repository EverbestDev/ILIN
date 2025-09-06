import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-white'>
        <Nav />

        <Routes>
          <Route
            path='/'
            element={
              <>
                <Hero />
                <About />
                {/* <Services /> */}
                {/* <Languages /> */}
                {/* <Contact /> */}
                {/* <Quote /> */}
              </>
            }
          />

          <Route
            path='/about'
            element={
              <div className='pt-20 text-2xl text-center font-open-sans'>
                About Page
              </div>
            }
          />
          <Route
            path='/services'
            element={
              <div className='pt-20 text-2xl text-center font-open-sans'>
                Services Page
              </div>
            }
          />
          <Route
            path='/languages'
            element={
              <div className='pt-20 text-2xl text-center font-open-sans'>
                Languages Page
              </div>
            }
          />
          <Route
            path='/contact'
            element={
              <div className='pt-20 text-2xl text-center font-lato'>
                Contact Page
              </div>
            }
          />
          <Route
            path='/quote'
            element={
              <div className='pt-20 text-2xl text-center font-lato'>
                Quote Request Page
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
