import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleShorten = async () => {
    setError("");
    setShortUrl("");
    setCopied(false);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/shortenurl",
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShortUrl(response.data.shortUrl);
        setError("");
      } else {
        setError(response.data.message || "Failed to shorten URL");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to shorten URL");
      } else {
        setError("Network error. Please try again.");
      }
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleReset = () => {
    setUrl("");
    setShortUrl("");
    setError("");
    setCopied(false);
  };

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      try {
        await axios.post("http://localhost:3000/api/logout");
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUrl("");
        setShortUrl("");
        setError("");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="mt-45 md:mt-45 px-4 md:px-0">
      <div className="flex justify-between items-center pr-0 md:pr-4">
        <button className="text-2xl md:text-4xl hover:cursor-pointer text-gray-300 font-semibold">
          <span className="bg-linear-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
            Short
          </span>
          Url
        </button>
        <button
          onClick={handleAuthAction}
          className="bg-linear-to-b from-blue-400 to-blue-600 hover:cursor-pointer text-white hover:opacity-90 transition duration-200 w-14 md:w-16 p-2 rounded-sm text-xs"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>

      <div className="mt-8 md:mt-15 border border-gray-500  rounded-md p-3 md:p-4 pb-6 md:pb-8">
        <p className="text-lg md:text-xl font-semibold text-gray-400">
          Paste the URL here
        </p>
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-0">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-300 text-xs p-3 w-full md:w-105 outline-none mt-4 rounded-xs"
            placeholder="Enter the link here"
            disabled={loading}
          />
          <button
            onClick={handleShorten}
            disabled={loading}
            className="hover:cursor-pointer bg-linear-to-b from-blue-400 to-blue-600 text-white text-xs p-3 md:mt-4 md:ml-5 rounded-sm hover:opacity-90 transition duration-200 disabled:opacity-50 w-full md:w-auto"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        {error && <p className="mt-3 pl-3 text-red-400 text-xs md:text-sm">{error}</p>}
        {shortUrl && (
          <div className="mt-4">
            <p className="text-sm md:text-m font-semibold text-gray-400 mb-1">Your shortened URL:</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-300 text-xs hover:underline break-all p-2 w-full sm:w-auto rounded"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="p-2 bg-gray-300 text-black text-xs rounded transition duration-200 w-full sm:w-auto hover:cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div>
              <button 
                onClick={handleReset}
                className="hover:cursor-pointer mt-2 p-2 bg-linear-to-b from-blue-400 to-blue-600 text-white text-xs rounded hover:bg-gray-950 transition duration-200 w-full sm:w-auto">
                Shorten another URL
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 md:mt-10 text-xs md:text-sm text-gray-400">
        <p className="text-lg md:text-xl font-semibold mb-1">
          Simple and fast URL shortener!
        </p>
        <p className="">
          Url-shortener allows to shorten long links from Instagram, Facebook,
          YouTube, Twitter, Linked In, WhatsApp, TikTok, blogs and any domain
          name. Just paste the long URL and click the Shorten URL button. Copy
          the shortened URL and share it on sites, chat and emails.
        </p>
      </div>

      <footer className="mt-8 md:mt-10 text-xs text-gray-400 pb-4">
        <p>© 2025 Aditya Patil</p>
      </footer>
    </div>
  );
}