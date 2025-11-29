import React from "react";
import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import Login from "../pages/Default/Login";

// Mock firebase utility module
vi.mock("../../utility/firebase", async () => {
  const actual = await vi.importActual("../../utility/firebase");
  return {
    ...actual,
    signInWithPopup: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    fetchSignInMethodsForEmail: vi.fn(),
    linkWithCredential: vi.fn(),
    GoogleAuthProvider: actual.GoogleAuthProvider,
    FacebookAuthProvider: actual.FacebookAuthProvider,
    auth: actual.auth,
    setPersistence: vi.fn(),
    browserLocalPersistence: actual.browserLocalPersistence,
    browserSessionPersistence: actual.browserSessionPersistence,
  };
});

import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "../../utility/firebase";
import {
  signInWithEmailAndPassword,
  linkWithCredential,
} from "../../utility/firebase";

describe("Login - account exists flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows provider banner when account exists with google as provider", async () => {
    // make signInWithPopup reject with account-exists error
    const error = {
      code: "auth/account-exists-with-different-credential",
      email: "test@example.com",
      message: "An account already exists with the given email",
    };

    signInWithPopup.mockRejectedValueOnce(error);
    fetchSignInMethodsForEmail.mockResolvedValueOnce(["google.com"]);

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </I18nextProvider>
    );

    // Click the Facebook button
    const facebookBtn = screen
      .getAllByRole("button")
      .find((b) => b.querySelector("svg")); // heuristic
    // Instead, we find the button by aria label or text; fall back to simple query
    // But for the test we will find by title 'Sign in with Google' not available
    // Instead, find all buttons and click the second (which should be facebook)
    const fbButton = screen.getByRole("button", {
      name: /Sign in with Facebook/i,
    });

    // fire click (use userEvent)
    await userEvent.click(fbButton);

    // Wait for banner
    await waitFor(() => {
      expect(fetchSignInMethodsForEmail).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com"
      );
    });

    // The banner should show the provider
    expect(
      screen.getByText(/Sign in with Google to link|Sign in with Google/i)
    ).toBeInTheDocument();
  });

  it("prompts for email when provider error has no email", async () => {
    const error = {
      code: "auth/account-exists-with-different-credential",
      message: "Provider returned collision, but no email provided",
    };

    signInWithPopup.mockRejectedValueOnce(error);

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </I18nextProvider>
    );

    const fbButton = screen.getByRole("button", {
      name: /Sign in with Facebook/i,
    });
    await userEvent.click(fbButton);

    // Wait for the modal that asks for email
    await waitFor(() => {
      expect(
        screen.getByText(/Enter the email to check which sign-in methods/i)
      ).toBeInTheDocument();
    });
  });

  it("resolves and links when password is provided", async () => {
    const error = {
      code: "auth/account-exists-with-different-credential",
      email: "testpass@example.com",
      message: "Provider collision",
    };

    signInWithPopup.mockRejectedValueOnce(error);
    fetchSignInMethodsForEmail.mockResolvedValueOnce(["password"]);
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { getIdToken: async () => "token" },
    });
    linkWithCredential.mockResolvedValueOnce(true);

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </I18nextProvider>
    );

    const fbButton = screen.getByRole("button", {
      name: /Sign in with Facebook/i,
    });
    await userEvent.click(fbButton);

    // Wait for password modal to show
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Password|••••••/i)
      ).toBeInTheDocument();
    });

    // Enter password & click resolve
    const pwdInput = screen.getByPlaceholderText(/Password|••••••/i);
    await userEvent.type(pwdInput, "correcthorsebatterystaple");
    const resolveBtn = screen.getByRole("button", { name: /Sign In/i });
    await userEvent.click(resolveBtn);

    // Expect signInWithEmailAndPassword and linkWithCredential calls
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "testpass@example.com",
        "correcthorsebatterystaple"
      );
      expect(linkWithCredential).toHaveBeenCalled();
    });
  });
});
