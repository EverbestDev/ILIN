import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, auth, signOut } from "../utility/firebase";
import { useNavigate } from "react-router-dom";

const initialUserState = {
  isLoggedIn: false,
  isLoading: true,
  user: null,
  profile: {
    name: "Guest",
    email: null,
    role: "guest",
  },
};

const AuthContext = createContext(initialUserState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialUserState);
  const navigate = useNavigate();

  // Fixed: This will use the env variable if available, otherwise localhost
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setAuthState({ ...initialUserState, isLoading: false });
      return;
    }

    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // Added this for CORS with credentials
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch user profile.");
      }

      const data = await response.json();
      const { role, name, email } = data.user;

      setAuthState({
        isLoggedIn: true,
        isLoading: false,
        user: firebaseUser,
        profile: {
          name: name,
          email: email,
          role: role,
        },
      });
    } catch (error) {
      console.error("Error fetching user profile/claims:", error);
      // Don't logout on profile fetch error - user is still authenticated
      setAuthState({
        isLoggedIn: true,
        isLoading: false,
        user: firebaseUser,
        profile: {
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "User",
          email: firebaseUser.email,
          role: "client", // Default role
        },
      });
    }
  };

  useEffect(() => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setAuthState({ ...initialUserState, isLoading: false });
        if (
          window.location.pathname.includes("/admin") ||
          window.location.pathname.includes("/client")
        ) {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthState({ ...initialUserState, isLoading: false });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
