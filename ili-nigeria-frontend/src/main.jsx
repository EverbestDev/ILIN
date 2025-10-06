import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// NEW: Import Auth0Provider
import { Auth0Provider } from "@auth0/auth0-react";

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import "./index.css";
import App from "./App.jsx";

// Load Auth0 details from environment variables (assuming VITE/modern bundler setup)
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;



createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* NEW: Wrap the App component in Auth0Provider. 
        It configures the entire app for authentication. 
    */}
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      // Redirect the user back to the origin URL after login
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience, // MUST be set to get an Access Token for your Express API
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
