import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
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

      const response = await fetch("http://localhost:3000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setShortUrl(data.shortUrl);
        setError("");
      } else {
        setError(data.message || "Failed to shorten URL");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
  return (
    <div className="mt-45">
      <div className="flex justify-between items-center pr-4">
        <button className="text-4xl hover:cursor-pointer text-gray-300 font-semibold">
          <span className="bg-linear-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">Short</span>Url
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-linear-to-b from-blue-400 to-blue-600 hover:cursor-pointer text-white transition duration-200 w-16 p-2 rounded-sm text-xs"
        >
          Login
        </button>
      </div>


      <div className="mt-15 border border-gray-500 rounded-md p-4 pb-8">
        <p className="text-xl font-semibold text-gray-400">
          Paste the URL here
        </p>
        <div className="">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-300 text-xs  p-3 w-105 outline-none mt-4 rounded-xs"
            placeholder="Enter the link here"
            disabled={loading}
          />
          <span>
            <button
              onClick={handleShorten}
              disabled={loading}
              className="hover:cursor-pointer bg-linear-to-b from-blue-400 to-blue-600 text-white text-xs p-3 mt-2 ml-5 rounded-sm transition duration-200 disabled:opacity-50"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </span>
        </div>

        {error && <p className="mt-3 pl-3 text-red-400 text-sm">{error}</p>}
        {shortUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-300 mb-1">Your shortened URL:</p>
            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-950 transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 text-sm text-gray-400">
        <p className="text-xl font-semibold mb-1">Simple and fast URL shortener!</p>
        <p className="">
          Url-shortener allows to shorten long links from Instagram, Facebook,
          YouTube, Twitter, Linked In, WhatsApp, TikTok, blogs and any domain
          name. Just paste the long URL and click the Shorten URL button. Copy
          the shortened URL and share it on sites, chat and emails.
        </p>
      </div>

      <footer className="mt-10 text-xs text-gray-400">
        <p>© 2025 Aditya Patil</p>
      </footer>
    </div>
  );
}
