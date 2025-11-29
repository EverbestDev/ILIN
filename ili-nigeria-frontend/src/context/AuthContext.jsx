import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, auth, signOut, setPersistence, browserLocalPersistence } from "../utility/firebase";
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
  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://ilin-backend.onrender.com";

  const fetchUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setAuthState({ ...initialUserState, isLoading: false });
      return;
    }

    try {
      const idTokenResult = await firebaseUser.getIdTokenResult();
      const role = idTokenResult.claims.role || "client";
      console.info('Fetched ID token claims:', idTokenResult.claims);
      try {
        console.info('User providerData:', firebaseUser.providerData);
      } catch (e) {
        console.info('Failed to log providerData', e);
      }
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      let profileData = {
        name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "User",
        email: firebaseUser.email,
        role,
      };

      if (response.ok) {
        const data = await response.json();
        profileData = {
          name: data.user.name || profileData.name,
          email: data.user.email || profileData.email,
          role: data.user.role || role,
        };
      }

      setAuthState({
        isLoggedIn: true,
        isLoading: false,
        user: firebaseUser,
        profile: profileData,
      });
    } catch (error) {
      console.error("Error fetching user profile/claims:", error);
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
          role: (await firebaseUser.getIdTokenResult()).claims.role || "client",
        },
      });
    }
  };

  useEffect(() => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    // Set a default auth persistence so sign-in methods behave consistently
    try {
      setPersistence(auth, browserLocalPersistence).catch((e) => {
        // Fail silently; login flows will set persistence explicitly
        console.debug("Failed to set default auth persistence:", e);
      });
    } catch (e) {
      console.debug("Persistence setup error:", e);
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.info('onAuthStateChanged: user signed in', { uid: firebaseUser.uid, email: firebaseUser.email, providerData: firebaseUser.providerData });
        } catch (e) {
          console.info('onAuthStateChanged: failed to log user details', e);
        }
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
