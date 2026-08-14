const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const GITHUB_USER = 'cybr23';
const GITHUB_REPO = 'Naruto-Kai-Stremio-Addon';

const BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@main`;
const INFO_HASH = '671b08e4ff6d2b2630cd5dd4b894f79e01c5f2ff';
const TOTAL_VOLUMES = 72;
const OUT_DIR = __dirname; // Output directly to repo root

const ARTWORK = {
  poster: `${BASE_URL}/poster.jpg`,
  background: `${BASE_URL}/background.jpg`,
  logo: `${BASE_URL}/logo.png`,
  thumbnail: `${BASE_URL}/thumbnail.jpg`
};

// Ensure output directories exist
fs.mkdirSync(path.join(OUT_DIR, 'catalog', 'series'), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, 'meta', 'series'), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, 'stream', 'series'), { recursive: true });

// 1. Manifest (Bumped version to 1.0.1 for cache invalidate)
const manifest = {
  id: 'org.narutokai.stremio.static',
  version: '1.0.1',
  name: 'Naruto Kai',
  description: 'Stream Naruto Kai (Volumes 1-72) directly via P2P torrent player.',
  resources: ['catalog', 'meta', 'stream'],
  types: ['series'],
  catalogs: [
    {
      type: 'series',
      id: 'narutokai_catalog',
      name: 'Naruto Kai'
    }
  ]
};
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

// 2. Catalog
const catalog = {
  metas: [
    {
      id: 'naruto_kai',
      type: 'series',
      name: 'Naruto Kai',
      poster: ARTWORK.poster,
      background: ARTWORK.background,
      logo: ARTWORK.logo,
      description: 'A fan-cut edit of Naruto stripped of filler, recaps and padding as 72 volumes.'
    }
  ]
};
fs.writeFileSync(path.join(OUT_DIR, 'catalog', 'series', 'narutokai_catalog.json'), JSON.stringify(catalog, null, 2));

// 3. Meta (Videos list with universal thumbnail & fixed release date)
const episodes = [];
for (let i = 1; i <= TOTAL_VOLUMES; i++) {
  episodes.push({
    id: `naruto_kai:${i}`,
    title: `Volume ${i}`,
    season: 1,
    episode: i,
    thumbnail: ARTWORK.thumbnail,
    released: '2002-10-03T00:00:00.000Z' // Hardcoded past date removes hourglass overlay
  });
}

const meta = {
  meta: {
    id: 'naruto_kai',
    type: 'series',
    name: 'Naruto Kai',
    poster: ARTWORK.poster,
    background: ARTWORK.background,
    logo: ARTWORK.logo,
    description: 'Naruto Kai complete collection (72 Volumes/Episodes).',
    videos: episodes
  }
};
fs.writeFileSync(path.join(OUT_DIR, 'meta', 'series', 'naruto_kai.json'), JSON.stringify(meta, null, 2));

// 4. Streams mapping for Volumes 1-72
for (let i = 1; i <= TOTAL_VOLUMES; i++) {
  const stream = {
    streams: [
      {
        title: `Naruto Kai - Volume ${i} [1080p Torrent]`,
        infoHash: INFO_HASH,
        fileIdx: i - 1
      }
    ]
  };
  fs.writeFileSync(path.join(OUT_DIR, 'stream', 'series', `naruto_kai:${i}.json`), JSON.stringify(stream, null, 2));
}

console.log('Static addon files generated successfully!');
