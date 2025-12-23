import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
    navigate("/login");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div className="w-90 mt-45 border border-gray-500 rounded-md p-5 pt-10 pb-10">
      <h2 className="text-xl font-semibold text-center mb-6 text-gray-300">Signup</h2>
      <div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2 ">
            Name
          </label>
          <input
            type="email"
            value={name }
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-xs text-gray-300 outline-none"
            placeholder="Enter your name"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2 ">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-xs text-gray-300 outline-none"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-xs text-gray-300 outline-none"
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-400 rounded-md text-xs">
            {error}
          </div>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-4 bg-linear-to-b from-blue-400 to-blue-600 text-gray-100 text-xs py-3 rounded-md hover:cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>

    </div>
  );
}
