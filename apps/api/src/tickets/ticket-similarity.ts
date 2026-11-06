export function calculateTicketSimilarity(
  textA: string,
  textB: string,
): number {
  // Convert text to lowercase and extract individual words.
  const wordsA = new Set(
    textA.toLowerCase().match(/\b[a-z0-9]+\b/g) ?? [],
  );

  const wordsB = new Set(
    textB.toLowerCase().match(/\b[a-z0-9]+\b/g) ?? [],
  );

  // Empty text cannot provide meaningful similarity.
  if (wordsA.size === 0 || wordsB.size === 0) {
    return 0;
  }

  // Count words that appear in both sets.
  const intersection = [...wordsA].filter((word) =>
    wordsB.has(word),
  ).length;

  // Count all unique words across both sets.
  const union = new Set([...wordsA, ...wordsB]).size;

  // Jaccard similarity: common words / total unique words.
  return intersection / union;
}