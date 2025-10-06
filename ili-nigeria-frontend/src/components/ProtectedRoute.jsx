// src/components/ProtectedRoute.jsx
import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import LoadingSpinner from "./LoadingSpinner";

// This component will be displayed while the user session is loading or if they are being redirected.
const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
    <LoadingSpinner />
    <h2 className="mt-4 text-xl font-semibold text-gray-700">
      Checking credentials...
    </h2>
    <p className="mt-2 text-sm text-gray-500">
      Please wait while we verify your session.
    </p>
  </div>
);

// HOC provided by Auth0 that handles the redirect to login if not authenticated
const ProtectedRoute = ({ component, ...args }) => {
  // The component passed to us (e.g., <Dashboard />)
  const Component = withAuthenticationRequired(component, {
    // Show our custom loading screen during the redirect process
    onRedirecting: () => <Loading />,
    // Optional: Ensure that after login, the user is returned to the page they requested
    loginOptions: {
      appState: {
        returnTo: window.location.pathname,
      },
    },
  });

  return <Component {...args} />;
};

export default ProtectedRoute;
