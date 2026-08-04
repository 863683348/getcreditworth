
const T = {
  epic: (b) => "At " + Math.round(b.runtimeHours) + " hours with " + b.starRating.toFixed(1) + " stars from " + b.reviewCount.toLocaleString() + " reviews, \"" + b.title + "\" by " + b.author + " delivers exceptional credit value. This " + (b.categories[0] || "audiobook") + " costs $" + b.costPerHour.toFixed(2) + "/hour. Narrated by " + (b.narrator || "a professional narrator") + ". Value Score: " + b.valueScore.toFixed(1) + ".",

  top: (b) => b.starRating.toFixed(1) + " stars from " + b.reviewCount.toLocaleString() + " reviewers make \"" + b.title + "\" one of the highest-rated audiobooks. " + b.author + " delivers " + Math.round(b.runtimeHours) + " hours at $" + b.costPerHour.toFixed(2) + "/hour. Priced at $" + b.price.toFixed(2) + ". Value Score: " + b.valueScore.toFixed(1) + ".",

  value: (b) => "\"" + b.title + "\" by " + b.author + " scores " + b.valueScore.toFixed(1) + " on our Value Score system. This " + Math.round(b.runtimeHours) + "-hour " + (b.categories[0] || "audiobook") + " costs $" + b.costPerHour.toFixed(2) + "/hour. " + b.starRating.toFixed(1) + " stars. " + (b.price > 14.95 ? "Using a credit saves you money." : "Consider buying directly."),

  short: (b) => Math.round(b.runtimeHours) + " hours: \"" + b.title + "\" by " + b.author + " is a shorter " + (b.categories[0] || "audiobook") + ". Rated " + b.starRating.toFixed(1) + "/5. Cost: $" + b.costPerHour.toFixed(2) + "/hour. " + (b.price > 14.95 ? "A credit works well here." : "Buy directly for $" + b.price.toFixed(2) + "."),

  genre: (b) => "Best " + (b.categories[0] || "audiobook") + " for your Audible credit? \"" + b.title + "\" by " + b.author + " runs " + Math.round(b.runtimeHours) + " hours at $" + b.costPerHour.toFixed(2) + "/hour. Rated " + b.starRating.toFixed(1) + "/5. " + (b.price > 14.95 ? "Save with a credit." : "Buy for $" + b.price.toFixed(2) + ".")
};

function generateDescription(book) {
  if (!book) return "";
  var h = book.runtimeHours || 0;
  var r = book.starRating || 0;
  var rv = book.reviewCount || 0;
  if (h >= 30 && r >= 4.5 && rv > 5000) return T.epic(book);
  if (r >= 4.7 && rv > 1000) return T.top(book);
  if (h >= 20) return T.value(book);
  if (h <= 8) return T.short(book);
  return T.genre(book);
}

function batchGenerate(books) {
  var count = 0;
  for (var i = 0; i < books.length; i++) {
    var b = books[i];
    if (!b.description || b.description.length < 20) {
      b.description = generateDescription(b);
      count++;
    }
  }
  return count;
}

module.exports = { generateDescription, batchGenerate };
