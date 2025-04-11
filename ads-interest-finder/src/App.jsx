
import React, { useState } from "react";
import { Download, Clipboard } from "lucide-react";

export default function AdsInterestFinder() {
  const [keyword, setKeyword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!keyword || !apiKey) return alert("Enter keyword and API key");
    setLoading(true);
    try {
      const prompt = `Give me a list of 20 well-researched and result-oriented Facebook ad interests for the niche: ${keyword}. The interests should be hidden gems, not basic suggestions. Present them in a simple bullet list.`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const text = data.choices[0].message.content;
      const interests = text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => line.replace(/^\d+\.|[-*]/, "").trim());
      setResults(interests);
    } catch (err) {
      alert("Something went wrong. Check your API key and try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    const text = results.join(", ");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDownload = () => {
    const csv = results.map((r) => `"${r}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${keyword}_interests.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-sky-800 mb-4">Ads Interest Finder</h1>

      <input
        type="text"
        placeholder="Enter niche/keyword (e.g., Yoga)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border border-sky-400 rounded p-2 w-full max-w-md mb-2"
      />

      <input
        type="password"
        placeholder="Enter OpenAI API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="border border-sky-400 rounded p-2 w-full max-w-md mb-4"
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
      >
        {loading ? "Finding..." : "Find Interests"}
      </button>

      {results.length > 0 && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-sky-700">Results:</h2>
          <ul className="list-disc pl-6 space-y-1">
            {results.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-sky-200 hover:bg-sky-300 text-sky-800 px-3 py-1 rounded"
            >
              <Clipboard size={16} /> Copy All
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-sky-200 hover:bg-sky-300 text-sky-800 px-3 py-1 rounded"
            >
              <Download size={16} /> Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
