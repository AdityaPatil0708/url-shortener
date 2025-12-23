import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
    

  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="w-90 mt-45 border border-gray-500 rounded-md p-5 pt-10 pb-10">
      <h2 className="text-xl font-semibold text-center mb-8 text-gray-300">Welcome to <span className="bg-linear-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">ShortURL!</span></h2>
      <div></div>
      <div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-gray-300 text-xs outline-none"
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
            className="w-full px-3 py-3 border border-gray-500 rounded-md text-gray-300 text-xs outline-none"
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        {error && (
          <div className=" text-red-400 rounded-md text-xs">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-4 bg-linear-to-b from-blue-400 to-blue-600 text-gray-100 text-xs py-3 rounded-md hover:cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-300">
        Don't have an account?{" "}
        <a
          onClick={() => navigate("/signup")}
          className="underline hover:cursor-pointer font-semibold text-gray-200"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
