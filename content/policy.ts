/**
 * Public-content policy. Clients are anonymized and metrics are kept, so a
 * blocklist of real client, colleague, hostname and banned-technology terms is
 * enforced over every rendered string by tests/unit/content-policy.test.ts.
 *
 * The terms themselves are stored as FNV-1a hashes of their lowercase form, so
 * this repository never spells out the list it protects. Matching is whole-word
 * over 1..3-word phrases (accents and punctuation inside a term are kept).
 */

export const FORBIDDEN_HASHES: ReadonlySet<string> = new Set([
  "0022ac1c",
  "00db5e9a",
  "01d70e74",
  "037830aa",
  "03a25ff4",
  "04fcfe97",
  "055eb51f",
  "081fb565",
  "0d33c4e1",
  "0e5c3326",
  "0e8164da",
  "0fcbfa94",
  "115483c6",
  "11fc0461",
  "1224517a",
  "176b6f18",
  "1afa8e7e",
  "1c7bd236",
  "1d717979",
  "1db2f384",
  "22fa8c79",
  "2471807e",
  "3881e460",
  "418c136b",
  "4339ac32",
  "44d496aa",
  "4594fdc9",
  "4baf730d",
  "4d0abca1",
  "4de2022d",
  "4f2901ae",
  "4f5379c6",
  "50deed63",
  "51cc4142",
  "5c11311d",
  "62a2626b",
  "62bbde7f",
  "65447f78",
  "65861f06",
  "66f37eb4",
  "6aeb783d",
  "6c7ac5d9",
  "7128b160",
  "712de5d5",
  "74afb95d",
  "74bdce82",
  "75c68611",
  "7b7aea9d",
  "7f9313e7",
  "830fd737",
  "8e9b45e3",
  "8ffe7f99",
  "91ac25b0",
  "91fe08e7",
  "96331f89",
  "9a8a4c57",
  "9c736b22",
  "9d484822",
  "9ebbd01e",
  "9ee5257a",
  "a053d492",
  "a0834096",
  "a1ad84db",
  "a5b25326",
  "a83f7e16",
  "a87b4f93",
  "adb48c23",
  "b2fa08eb",
  "b43dbc04",
  "b4f3b7a1",
  "b6c7e819",
  "bd70dc4c",
  "bf0c1f84",
  "c47ea827",
  "c7cee7a7",
  "cadb52a4",
  "ccafa580",
  "cdeda258",
  "ce31a050",
  "d2f043d4",
  "d6970934",
  "d81f859a",
  "d82c32c3",
  "dbe6a28d",
  "dce01eb2",
  "e1c11552",
  "e6fb8b9e",
  "ea2fc27d",
  "ea8b11df",
  "ed2d1609",
  "efcc8f05",
  "f04e4d7f",
  "fadc1dcc",
  "fcf0f2bd",
]);

export const MAX_PHRASE_WORDS = 3;

/** Patterns for identifiers that must never leak. */
export const FORBIDDEN_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: "aws account id", regex: /\b\d{12}\b/ },
  { name: "ipv4 address", regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/ },
  { name: "aws arn", regex: /arn:aws:/i },
  { name: "ec2 instance id", regex: /\bi-[0-9a-f]{17}\b/ },
  { name: "cognito pool id", regex: /\bus-east-1_[A-Za-z0-9]{9}\b/ },
];

/** FNV-1a 32-bit, hex. Mirrors lib/prng.ts hashString; duplicated to keep this module dependency-free. */
export function termHash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** Splits text into word tokens, keeping letters, digits, dots, hyphens, underscores and accents. */
function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}._-]+/u)
    .map((t) => t.replace(/^[._-]+|[._-]+$/g, ""))
    .filter(Boolean);
}

/** Returns the offending phrase or pattern name found in `text`, or null. */
export function findViolation(text: string): string | null {
  const words = tokens(text);
  for (let i = 0; i < words.length; i++) {
    let phrase = "";
    for (let n = 0; n < MAX_PHRASE_WORDS && i + n < words.length; n++) {
      phrase = n === 0 ? words[i] : `${phrase} ${words[i + n]}`;
      if (FORBIDDEN_HASHES.has(termHash(phrase))) return phrase;
      // Also try the token with trailing punctuation variants stripped (e.g. "tdw.group").
    }
  }
  for (const { name, regex } of FORBIDDEN_PATTERNS) {
    if (regex.test(text)) return name;
  }
  return null;
}
