import { getRandomLiterature, GENRES } from './literature_engine.mjs';

async function runTests() {
  console.log('--- TEST 1: Genres Catalog ---');
  console.log(`Loaded ${GENRES.length} genre categories.`);

  console.log('\n--- TEST 2: Fetch Random 20-min Literature (Surprise Me) ---');
  const t0 = Date.now();
  const sample = await getRandomLiterature({ genre: 'all', targetMinutes: 20 });
  const duration = ((Date.now() - t0) / 1000).toFixed(2);

  console.log(`Book Title: "${sample.book.title}"`);
  console.log(`Author: ${sample.book.author}`);
  console.log(`Genre: ${sample.book.genre} | Era: ${sample.book.era}`);
  console.log(`Section: ${sample.readingSession.sectionTitle}`);
  console.log(`Word Count: ${sample.readingSession.wordCount} words`);
  console.log(`Est. Reading Time: ${sample.readingSession.estimatedMinutes} minutes`);
  console.log(`Paragraphs: ${sample.readingSession.paragraphs.length}`);
  console.log(`First Paragraph Snippet: "${sample.readingSession.paragraphs[0]?.slice(0, 140)}..."`);
  console.log(`Formats Available:`, Object.keys(sample.book.formats || {}));
  console.log(`Fetch + Extraction Time: ${duration}s`);

  if (sample.readingSession.wordCount < 1500) {
    throw new Error(`Word count too low: ${sample.readingSession.wordCount}`);
  }

  console.log('\n--- TEST 3: Fetch Specific Genre (Philosophy) ---');
  const philSample = await getRandomLiterature({ genre: 'philosophy', targetMinutes: 15 });
  console.log(`Philosophy Book: "${philSample.book.title}" by ${philSample.book.author}`);
  console.log(`Word count: ${philSample.readingSession.wordCount} (${philSample.readingSession.estimatedMinutes} min)`);

  console.log('\n✅ All tests passed successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
