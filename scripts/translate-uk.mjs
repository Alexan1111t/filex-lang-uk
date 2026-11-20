import fs from 'node:fs/promises';

const path = new URL('../translations/uk.json', import.meta.url);
const sourcePath = new URL('../catalogue/filex-catalogue-en.json', import.meta.url);
const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
const existing = JSON.parse(await fs.readFile(path, 'utf8'));

const protect = (value) => {
  const saved = [];
  const keep = (match) => {
    const token = `ZXQKEEP${saved.length.toString().padStart(4, '0')}QXZ`;
    saved.push(match);
    return token;
  };
  let text = value
    .replace(/\bfilex(?:-watch)?\b/gi, keep)
    .replace(/\{[^{}]*\}/g, keep)
    .replace(/`[^`]*`/g, keep)
    .replace(/https?:\/\/[^\s)]+/g, keep)
    .replace(/<[^>]+>/g, keep)
    .replace(/\\\|/g, keep)
    .replace(/\|/g, keep);
  return { text, saved };
};

const restore = (value, saved) => {
  let out = value;
  saved.forEach((original, index) => {
    const token = `ZXQKEEP${index.toString().padStart(4, '0')}QXZ`;
    out = out.split(token).join(original);
  });
  return out;
};

const translate = async (text) => {
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=' + encodeURIComponent(text);
  for (let attempt = 0; attempt < 6; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (response.ok) {
      const body = await response.json();
      return body[0].map((part) => part[0]).join('');
    }
    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
  }
  throw new Error('Translation request failed');
};

const entries = Object.entries(source).filter(([key]) => !existing[key]);
let cursor = 0;
while (cursor < entries.length) {
  const batch = [];
  let size = 0;
  while (cursor < entries.length) {
    const [key, english] = entries[cursor];
    const protectedValue = protect(english);
    const marker = `ZXQITEM${batch.length.toString().padStart(4, '0')}QXZ`;
    const addition = protectedValue.text.length + marker.length + 4;
    if (batch.length && size + addition > 3200) break;
    batch.push({ key, english, marker, ...protectedValue });
    size += addition;
    cursor++;
  }

  const joined = batch.map((item) => `${item.marker}\n${item.text}`).join('\n');
  const translated = await translate(joined);
  for (let i = 0; i < batch.length; i++) {
    const item = batch[i];
    const nextMarker = batch[i + 1]?.marker;
    const start = translated.indexOf(item.marker);
    const end = nextMarker ? translated.indexOf(nextMarker) : translated.length;
    if (start < 0 || end < 0) throw new Error(`Marker lost near ${item.key}`);
    let value = translated.slice(start + item.marker.length, end).trim();
    value = restore(value, item.saved);
    existing[item.key] = value;
  }

  await fs.writeFile(path, JSON.stringify(existing, null, 2) + '\n');
  process.stdout.write(`\rTranslated ${cursor}/${entries.length}`);
  await new Promise((resolve) => setTimeout(resolve, 120));
}

process.stdout.write('\nDone\n');
