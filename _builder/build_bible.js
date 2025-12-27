import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Chapter, Verse } from "../proto-generated/bible_pb.js";

// ------------------------------------------------------
// 1. Utility: Resolve dirname in ESM
// ------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------
// 2. Configure your input/output
// ------------------------------------------------------
const VERSION = "WEB"; // change to KJV, ASV, etc.
const INPUT_DIR = path.join(__dirname, "../bible-usfm");
const OUTPUT_DIR = path.join(__dirname, `../output/${VERSION}`);

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ------------------------------------------------------
// 3. Regex patterns for USFM
// ------------------------------------------------------
const BOOK_ID_MAP = {
  "GEN": 1,
  "EXO": 2,
  "LEV": 3,
  // ... fill out all 66
};
                                       
// USFM markers
const RE_BOOK = /^\\id\s+([A-Z0-9]+)/m;
const RE_CHAPTER = /^\\c\s+([0-9]+)/gm;
const RE_VERSE = /\\v\s+([0-9]+)\s+([^\\]+)/g;

// ------------------------------------------------------
// 4. Process each file
// ------------------------------------------------------
function processUsfmFile(filename) {
  const text = fs.readFileSync(filename, "utf8");

  // 4.1 Determine book ID
  const bookIdMatch = RE_BOOK.exec(text);
  if (!bookIdMatch) return;
  const usfmBookId = bookIdMatch[1];
  const book_id = BOOK_ID_MAP[usfmBookId];
  if (!book_id) {
    console.log("Skipping unknown book:", usfmBookId);
    return;
  }

  console.log(`Processing ${usfmBookId} -> Book ${book_id}`);

  // 4.2 Chapter parsing
  let chapterMatch;
  while ((chapterMatch = RE_CHAPTER.exec(text)) !== null) {
    const chapterNumber = parseInt(chapterMatch[1]);

    // Find where this chapter starts and where the next begins
    const chapterStartIndex = chapterMatch.index;
    const nextChapterMatch = RE_CHAPTER.exec(text);
    const chapterEndIndex = nextChapterMatch ? nextChapterMatch.index : text.length;

    const chapterBlock = text.slice(chapterStartIndex, chapterEndIndex);

    // 4.3 Extract verses from this block
    const verses = [];
    let verseMatch;

    while ((verseMatch = RE_VERSE.exec(chapterBlock)) !== null) {
      verses.push(
        Verse.create({
          number: parseInt(verseMatch[1]),
          text: verseMatch[2].trim()
        })
      );
    }

    const chapterObj = Chapter.create({
      book_id,
      chapter_number: chapterNumber,
      title: `Chapter ${chapterNumber}`,
      verse_count: verses.length,
      verses
    });

    // 4.4 Serialize to protobuf
    const bytes = Chapter.encode(chapterObj).finish();

    // Output folder: /output/VERSION/<book_id>/
    const bookDir = path.join(OUTPUT_DIR, String(book_id).padStart(2, "0"));
    fs.mkdirSync(bookDir, { recursive: true });

    const outFile = path.join(bookDir, `${chapterNumber}.pb`);
    fs.writeFileSync(outFile, bytes);

    console.log(`  - Wrote chapter ${chapterNumber} (${verses.length} verses)`);
  }
}

// ------------------------------------------------------
// 5. Run the script
// ------------------------------------------------------
for (const file of fs.readdirSync(INPUT_DIR)) {
  if (file.endsWith(".usfm") || file.endsWith(".txt")) {
    processUsfmFile(path.join(INPUT_DIR, file));
  }
}

console.log("DONE!");