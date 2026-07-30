// Dev.to Auto Post Script
// Run via: DEVTO_API_KEY=xxx node scripts/social/post-devto.mjs

async function postToDevto(apiKey, article) {
  const resp = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ article })
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error("Dev.to API error: " + resp.status);
  return data;
}

const article = {
  title: "730 Audiobooks Ranked by Value - What Your Audible Credit Is Actually Worth",
  body_markdown: [
    "Do you stare at your Audible credit wondering if a book is actually worth it?",
    "",
    "One credit costs $14.95 but can buy a 5-hour novella OR a 126-hour epic.",
    "I built [GetCreditWorth](https://getcreditworth.com) to solve this with data.",
    "",
    "## The Math",
    "Value Score = (Hours x Rating) / Price",
    "",
    "Top pick: The Decline and Fall of the Roman Empire - 126 hours, 4.5 stars, $20.34. Score: 28.0.",
    "",
    "## Features",
    "- 730 audiobooks across 87 categories",
    "- Credit calculator to compare cash vs credits",
    "- Full bilingual support (EN/ZH)",
    "- Open source on GitHub",
    "",
    "Free to use: https://getcreditworth.com",
    "GitHub: https://github.com/863683348/getcreditworth"
  ].join("\n"),
  published: true,
  tags: ["webdev", "nextjs", "seo", "typescript"],
  canonical_url: "https://getcreditworth.com/blog/audible-credit-value"
};

const apiKey = process.env.DEVTO_API_KEY;
if (!apiKey) { console.error("Need DEVTO_API_KEY"); process.exit(1); }

try {
  const result = await postToDevto(apiKey, article);
  console.log("Published: https://dev.to" + result.path);
} catch(e) {
  console.error("Failed:", e.message);
  process.exit(1);
}
