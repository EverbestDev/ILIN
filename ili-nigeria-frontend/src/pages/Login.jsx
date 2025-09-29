import react from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/admin/quotes");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-2 text-4xl font-bold text-green-800">Login Page</h1>
      <p className="mb-8 text-gray-600 animate animate-pulse">
        still working on it...
      </p>
      <form className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-green-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-green-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-bold text-green-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full px-3 py-2 mb-3 leading-tight text-green-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
          <a
            className="inline-block text-sm font-bold text-yellow-500 align-baseline hover:text-yellow-800"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}
