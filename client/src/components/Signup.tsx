import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignup() {
    setError("");

    const name = (document.getElementById("signup-name") as HTMLInputElement)
      .value;
    const email = (document.getElementById("signup-email") as HTMLInputElement)
      .value;
    const password = (
      document.getElementById("signup-pass") as HTMLInputElement
    ).value;

    try {
      await axios.post("http://localhost:3000/api/signup", {
        name: name,
        email: email,
        password: password,
      });
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Signup failed");
      } else {
        setError("Network error. Please try again.");
      }
    }
  }

  return (
    <div className="w-90 mt-40 md:mt-45 border border-gray-500 rounded-md p-5 pt-8 md:pt-10 pb-8 md:pb-10">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-5 md:mb-6 text-gray-300">
        Signup
      </h2>
      <div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2 ">
            Name
          </label>
          <input
            autoComplete="off"
            id="signup-name"
            type="text"
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-xs text-gray-300 outline-none"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2 ">
            Email
          </label>
          <input
            autoComplete="off"
            id="signup-email"
            type="email"
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-xs text-gray-300 outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            autoComplete="off"
            id="signup-pass"
            type="password"
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-xs text-gray-300 outline-none"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="text-red-400 rounded-md text-xs mb-2 pl-3">
            {error}
          </div>
        )}

        <button
          onClick={handleSignup}
          className="w-full mt-4 bg-linear-to-b from-blue-400 to-blue-600 text-gray-100 text-xs py-3 rounded-md hover:cursor-pointer hover:opacity-90 transition duration-200"
        >
          Signup
        </button>
      </div>
    </div>
  );
}