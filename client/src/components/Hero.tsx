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
        <button className="text-3xl hover:cursor-pointer text-black font-semibold">
          ShortURL.
        </button>
        <button onClick={() => navigate("/login")} className="hover:bg-gray-950 hover:text-white transition duration-200 w-20 p-1 text-black border border-gray-500 rounded-sm text-sm">Login</button>
      </div>
      <div className="mt-10 text-sm text-gray-500">
        <p className="text-xl font-semibold mb-1">
          Simple and fast URL shortener!
        </p>
        <p>
          Url-shortener allows to shorten long links from Instagram, Facebook,
          YouTube, Twitter, Linked In, WhatsApp, TikTok, blogs and any domain
          name. Just paste the long URL and click the Shorten URL button. Copy
          the shortened URL and share it on sites, chat and emails.
        </p>
      </div>
      <div className="mt-10">
        <p className="text-xl font-semibold">Paste the URL here</p>
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-100 text-xs p-3 w-114 outline-none mt-2 mr-2 rounded-xs"
            placeholder="Enter the link here"
            disabled={loading}
          />
          <span>
            <button
              onClick={handleShorten}
              disabled={loading}
              className="hover:cursor-pointer text-black text-sm border border-gray-400 p-2 rounded-sm hover:bg-gray-950 hover:text-white transition duration-200 disabled:opacity-50"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </span>
        </div>

        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        {shortUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Your shortened URL:</p>
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
      <footer className="mt-10 text-sm text-gray-500">
        <p>© 2025 urlshortener.com</p>
      </footer>
    </div>
  );
}
