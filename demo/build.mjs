import { copyFileSync, mkdirSync } from 'node:fs';

// Sites requires a supported output directory; local preview serves demo/ directly.
const output = new URL('../dist/', import.meta.url);
mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'model.mjs', 'app.mjs']) {
  copyFileSync(new URL(file, import.meta.url), new URL(file, output));
}
console.log('Copied demo assets to dist/ for private hosting.');
