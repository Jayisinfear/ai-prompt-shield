/**
 * AI Prompt Shield — Risk Analyser Engine v2.0
 * Core brain that scores prompts against 15 attack pattern categories
 * with 300+ matchers. Includes normalization, compound detection,
 * multi-pass analysis, and suspicious length/entropy checks.
 */

import { ATTACK_PATTERNS } from '../patterns/attackPatterns.js';

/**
 * Normalize prompt text for analysis.
 * Strips tricks while preserving content for pattern matching.
 */
function normalize(text) {
  let n = text;
  // Collapse excessive whitespace (but preserve newlines for delimiter detection)
  n = n.replace(/[ \t]+/g, ' ');
  // Remove zero-width characters for normalized matching
  n = n.replace(/[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u034F]/g, '');
  // Normalize unicode quotes to ASCII
  n = n.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  n = n.replace(/[\u201C\u201D\u201E\u201F]/g, '"');
  // Normalize dashes
  n = n.replace(/[\u2013\u2014\u2015]/g, '-');
  return n.trim();
}

/**
 * Reconstruct spaced-out / scattered text.
 * E.g., "I g n o r e   a l l" → "Ignore all"
 */
function reconstructScattered(text) {
  // Detect single-char-per-line pattern
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length === 1);
  if (lines.length >= 5) {
    return lines.join('');
  }
  // Detect S  P  A  C  E  D pattern
  const spaced = text.match(/(?:^|\s)([a-zA-Z])\s{2,}(?=[a-zA-Z])/g);
  if (spaced && spaced.length >= 4) {
    return text.replace(/\s{2,}/g, '');
  }
  return null;
}

/**
 * Calculate Shannon entropy of a string.
 * High entropy may indicate encoded/obfuscated content.
 */
function calculateEntropy(text) {
  if (!text || text.length === 0) return 0;
  const freq = {};
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }
  let entropy = 0;
  const len = text.length;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/**
 * Check a single attack pattern category against the prompt text.
 * Returns { found, matchedKeywords[] }
 */
function checkPattern(text, pattern) {
  const matchedKeywords = [];
  const seenMatches = new Set();

  for (const matcher of pattern.matchers) {
    const regex = matcher instanceof RegExp ? matcher : new RegExp(matcher, 'i');
    const match = regex.exec(text);
    if (match) {
      const matchStr = match[0].trim().substring(0, 80);
      if (!seenMatches.has(matchStr.toLowerCase())) {
        seenMatches.add(matchStr.toLowerCase());
        matchedKeywords.push(matchStr);
      }
    }
  }

  return {
    found: matchedKeywords.length > 0,
    matchedKeywords,
    matchCount: matchedKeywords.length,
  };
}

/**
 * Determine risk level string from score.
 */
function getRiskLevel(score) {
  if (score <= 20) return 'Low';
  if (score <= 50) return 'Medium';
  if (score <= 80) return 'High';
  return 'Critical';
}

/**
 * Heuristic checks for suspicious prompt characteristics.
 * Returns additional score and details.
 */
function heuristicChecks(rawText, normalizedText) {
  let bonusScore = 0;
  const bonusDetails = [];

  // 1. Suspiciously high entropy (possible encoded content)
  const entropy = calculateEntropy(normalizedText);
  if (entropy > 5.5 && normalizedText.length > 50) {
    bonusScore += 5;
    bonusDetails.push({
      id: 'high_entropy',
      name: 'High Entropy Content',
      description: 'String entropy suggests encoded or obfuscated content',
      weight: 5,
      matchedKeywords: [`entropy: ${entropy.toFixed(2)}`],
    });
  }

  // 2. Scattered/spaced text reconstruction
  const reconstructed = reconstructScattered(rawText);
  if (reconstructed) {
    // Re-check the reconstructed text against override patterns
    const overrideCheck = /ignore|disregard|forget|bypass|override|system|prompt|instruction/i;
    if (overrideCheck.test(reconstructed)) {
      bonusScore += 15;
      bonusDetails.push({
        id: 'scattered_text',
        name: 'Scattered Text Attack',
        description: 'Detected hidden message in spaced-out or line-scattered text',
        weight: 15,
        matchedKeywords: [reconstructed.substring(0, 60)],
      });
    }
  }

  // 3. Excessive prompt length (context flooding)
  if (normalizedText.length > 3000) {
    bonusScore += 3;
    bonusDetails.push({
      id: 'context_flooding',
      name: 'Context Flooding',
      description: 'Unusually long prompt may attempt to push system instructions out of context window',
      weight: 3,
      matchedKeywords: [`${normalizedText.length} characters`],
    });
  }

  // 4. Mixed script detection (beyond what regex catches)
  const hasLatin = /[a-zA-Z]/.test(normalizedText);
  const hasCyrillic = /[\u0400-\u04FF]/.test(normalizedText);
  const hasCJK = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(normalizedText);
  const hasArabic = /[\u0600-\u06FF]/.test(normalizedText);
  const scriptCount = [hasLatin, hasCyrillic, hasCJK, hasArabic].filter(Boolean).length;
  if (scriptCount >= 3) {
    bonusScore += 8;
    bonusDetails.push({
      id: 'multi_script',
      name: 'Multi-Script Mixing',
      description: 'Prompt mixes 3+ writing systems, possible obfuscation attempt',
      weight: 8,
      matchedKeywords: ['Multiple scripts detected'],
    });
  }

  return { bonusScore, bonusDetails };
}

/**
 * Main analysis function.
 * @param {string} promptText - The user's prompt to analyze
 * @returns {object} Analysis result
 */
export function analysePrompt(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return {
      score: 0,
      attackType: 'Clean',
      detectedPatterns: [],
      riskLevel: 'Low',
      details: [],
    };
  }

  const normalized = normalize(promptText);
  const rawText = promptText;

  let score = 0;
  const detectedPatterns = [];
  const details = [];
  let highestWeight = 0;
  let attackType = 'Clean';

  // ── Pass 1: Pattern Matching ──
  for (const pattern of ATTACK_PATTERNS) {
    // Check against both normalized AND raw text
    const normalizedResult = checkPattern(normalized, pattern);
    const rawResult = checkPattern(rawText, pattern);

    // Merge unique matches
    const allMatchesSet = new Set([
      ...normalizedResult.matchedKeywords.map(k => k.toLowerCase()),
    ]);
    rawResult.matchedKeywords.forEach(k => allMatchesSet.add(k.toLowerCase()));

    const allMatches = [...new Set([
      ...normalizedResult.matchedKeywords,
      ...rawResult.matchedKeywords,
    ])];

    if (allMatches.length > 0) {
      // Scale weight by number of matches (diminishing returns)
      const matchBonus = Math.min((allMatchesSet.size - 1) * 3, 15);
      const patternScore = pattern.weight + matchBonus;
      score += patternScore;

      detectedPatterns.push(pattern.name);
      details.push({
        id: pattern.id,
        name: pattern.name,
        description: pattern.description,
        weight: patternScore,
        matchedKeywords: allMatches.slice(0, 5), // Limit displayed matches
      });

      if (pattern.weight > highestWeight) {
        highestWeight = pattern.weight;
        attackType = pattern.name;
      }
    }
  }

  // ── Pass 2: Heuristic Checks ──
  const { bonusScore, bonusDetails } = heuristicChecks(rawText, normalized);
  score += bonusScore;
  bonusDetails.forEach(d => {
    details.push(d);
    detectedPatterns.push(d.name);
  });

  // ── Pass 3: Compound Attack Bonuses ──
  if (detectedPatterns.length >= 5) {
    score += 25; // Severe compound attack
  } else if (detectedPatterns.length >= 3) {
    score += 15;
  } else if (detectedPatterns.length >= 2) {
    score += 8;
  }

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    score,
    attackType,
    detectedPatterns,
    riskLevel: getRiskLevel(score),
    details,
    patternCount: detectedPatterns.length,
    timestamp: Date.now(),
  };
}

export default analysePrompt;
