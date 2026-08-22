const fs = require("fs");
const path = require("path");

// --- CONFIGURATION ---
const GITHUB_USER = "cybr23";
const GITHUB_REPO = "Naruto-Kai-Stremio-Addon";

const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main`;
const INFO_HASH = "671b08e4ff6d2b2630cd5dd4b894f79e01c5f2ff";
const NYAA_URL = `https://nyaa.si/?q=${INFO_HASH}`;
const OUT_DIR = __dirname;
const SERIES_NAME = "Naruto Kai Ultimate Subbed Edition";
const RELEASE_DATE = "2018-08-04T21:30:00.000Z";

const ARTWORK = {
  poster: `${BASE_URL}/assets/poster.jpg`,
  background: `${BASE_URL}/assets/background.jpg`,
  logo: `${BASE_URL}/assets/logo.png`,
  thumbnail: `${BASE_URL}/assets/thumbnail.jpg`
};

const DESCRIPTION = `NARUTO KAI: ULTIMATE SUBBED EDITION

A fan project dedicated to removing filler, padding, and executive recaps from the anime. Each episode roughly corresponds to one manga volume (1–72). 

Includes re-translated Japanese dub subtitles, restored canonical scenes, Omake extras, The Last: Naruto the Movie, and Itachi Shinden.

Nyaa Torrent: ${NYAA_URL}

--------------------------------------------------
Note on Complete Canon:
To watch 100% of canonical Naruto prior to Boruto, watch these outside this torrent:
• The Day Naruto Became Hokage (OVA)
• Naruto Shippuden Episodes 484–500 (Blank Period Novels: Sasuke Shinden, Shikamaru Hiden, and Konoha Hiden)`;

// Media mapping categorized by seasons
// Season 1: Main Manga Canon (Volumes 1–72)
// Season 2: Post-Series Extras / Movies / Shinden
const MEDIA_LIST = [
  // Season 1 - Manga Canon (Episodes 1–26)
  { id: "1", season: 1, title: "Episode 01 - Naruto Uzumaki! (Ch. 1–7)", fileIdx: 2, overview: "Adapts Volume 1. Naruto steals the Scroll of Sealing, learns Shadow Clones, and forms Team 7 with Sasuke and Sakura under Kakashi." },
  { id: "2", season: 1, title: "Episode 02 - The Worst Client (Ch. 8–16)", fileIdx: 3, overview: "Adapts Volume 2. Team 7 takes a C-rank mission to escort bridge-builder Tazuna to the Land of Waves and faces Zabuza Momochi." },
  { id: "3", season: 1, title: "Episode 03 - For My Dream! (Ch. 17–27)", fileIdx: 4, overview: "Adapts Volume 3. The climax of the Land of Waves arc; Haku and Zabuza make their final stand on the Great Naruto Bridge." },
  { id: "4", season: 1, title: "Episode 04 - The Hero's Bridge! (Ch. 28–36)", fileIdx: 5, overview: "Adapts Volume 4. The Chunin Exams begin in Konoha. Team 7 passes the written portion and enters the Forest of Death." },
  { id: "5", season: 1, title: "Episode 05 - The Challengers! (Ch. 37–45)", fileIdx: 6, overview: "Adapts Volume 5. Orochimaru attacks Team 7 in the Forest of Death and brands Sasuke with the Cursed Seal of Heaven." },
  { id: "6", season: 1, title: "Episode 06 - Predator (Ch. 46–54)", fileIdx: 7, overview: "Adapts Volume 6. Preliminary rounds of the Chunin Exams commence in the Third Exam arena." },
  { id: "7", season: 1, title: "Episode 07 - The Right Path! (Ch. 55–63)", fileIdx: 8, overview: "Adapts Volume 7. The preliminaries continue with intense matchups, including Sakura vs. Ino and Rock Lee vs. Gaara." },
  { id: "8", season: 1, title: "Episode 08 - Life-or-Death Battles! (Ch. 64–72)", fileIdx: 9, overview: "Adapts Volume 8. Preliminaries conclude. Jiraiya takes Naruto under his wing to teach him the Summoning Jutsu." },
  { id: "9", season: 1, title: "Episode 09 - Neji vs Hinata (Ch. 73–81)", fileIdx: 10, overview: "Adapts Volume 9. Naruto clashes with Neji Hyuga in the main finals of the Chunin Exams." },
  { id: "10", season: 1, title: "Episode 10 - A Splendid Ninja! (Ch. 82–90)", fileIdx: 11, overview: "Adapts Volume 10. Sasuke battles Gaara, triggering the surprise invasion of Konoha by Sound and Sand shinobi." },
  { id: "11", season: 1, title: "Episode 11 - Seeking Apprenticeship! (Ch. 91–99)", fileIdx: 12, overview: "Adapts Volume 11. Third Hokage Hiruzen Sarutobi fights Orochimaru using the Reaper Death Seal." },
  { id: "12", season: 1, title: "Episode 12 - The Great Flight! (Ch. 100–108)", fileIdx: 13, overview: "Adapts Volume 12. Naruto summons Gamabunta to duel Gaara transformed into the One-Tail Shukaku." },
  { id: "13", season: 1, title: "Episode 13 - The Chunin Exams, Concluded! (Ch. 109–117)", fileIdx: 14, overview: "Adapts Volume 13. The Konoha Crush arc concludes with the funeral of the Third Hokage." },
  { id: "14", season: 1, title: "Episode 14 - Hokage vs Hokage! (Ch. 118–126)", fileIdx: 15, overview: "Adapts Volume 14. Itachi Uchiha and Kisame Hoshigaki arrive in Konoha hunting the Nine-Tails." },
  { id: "15", season: 1, title: "Episode 15 - Naruto's Ninja Handbook! (Ch. 127–135)", fileIdx: 16, overview: "Adapts Volume 15. Naruto and Jiraiya search for Tsunade; Jiraiya begins training Naruto in the Rasengan." },
  { id: "16", season: 1, title: "Episode 16 - Eulogy (Ch. 136–144)", fileIdx: 17, overview: "Adapts Volume 16. The Legendary Sanin battle: Jiraiya and Tsunade face Orochimaru and Kabuto." },
  { id: "17", season: 1, title: "Episode 17 - Itachi's Power! (Ch. 145–153)", fileIdx: 18, overview: "Adapts Volume 17. Tsunade accepts the title of Fifth Hokage and returns to heal Konoha." },
  { id: "18", season: 1, title: "Episode 18 - Tsunade's Decision! (Ch. 154–162)", fileIdx: 19, overview: "Adapts Volume 18. Sasuke grows bitter over Naruto's rapid growth and challenges him on the hospital roof." },
  { id: "19", season: 1, title: "Episode 19 - The Successor (Ch. 163–171)", fileIdx: 20, overview: "Adapts Volume 19. The Sound Four arrive in Konoha to entice Sasuke to join Orochimaru." },
  { id: "20", season: 1, title: "Episode 20 - Naruto vs Sasuke! (Ch. 172–180)", fileIdx: 21, overview: "Adapts Volume 20. The Sasuke Retrieval Squad is formed under newly promoted Chunin Shikamaru Nara." },
  { id: "21", season: 1, title: "Episode 21 - Pursuit (Ch. 181–189)", fileIdx: 22, overview: "Adapts Volume 21. Choji fights Jirobo and Neji fights Kidomaru in life-or-death 1v1 battles." },
  { id: "22", season: 1, title: "Episode 22 - Comrades (Ch. 190–198)", fileIdx: 23, overview: "Adapts Volume 22. Kiba fights Sakon/Ukon while Shikamaru strategizes against Tayuya." },
  { id: "23", season: 1, title: "Episode 23 - Predicament (Ch. 199–207)", fileIdx: 24, overview: "Adapts Volume 23. Rock Lee and the Sand Siblings (Gaara, Kankuro, Temari) reinforce the retrieval team against Kimimaro." },
  { id: "24", season: 1, title: "Episode 24 - Unorthodox (Ch. 208–217)", fileIdx: 25, overview: "Adapts Volume 24. Naruto confronts Sasuke at the Valley of the End." },
  { id: "25", season: 1, title: "Episode 25 - Itachi And Sasuke, Brothers (Ch. 218–228)", fileIdx: 26, overview: "Adapts Volume 25. Flashback to the Uchiha Clan Massacre and the night Sasuke lost his family." },
  { id: "26", season: 1, title: "Episode 26 - Awakening (Ch. 229–235)", fileIdx: 27, overview: "Adapts Volume 26. One-Tailed Naruto vs. Curse Mark Stage 2 Sasuke at the Valley of the End. Part 1 Climax." },

  // Season 1 - Episode 27 Split Parts
  { id: "27a", season: 1, title: "Episode 27 A - Day of Departure! (Ch. 236–238)", fileIdx: 28, overview: "Adapts Volume 27 (Part 1). The aftermath of the Valley of the End fight. Naruto leaves Konoha with Jiraiya for 2.5 years of training." },
  { id: "27b", season: 1, title: "Episode 27 B - Kakashi Chronicles (Ch. 239–244)", fileIdx: 29, overview: "Adapts Volume 27 (Part 2). Kakashi Gaiden: Young Kakashi, Obito Uchiha, and Rin Nohara on their tragic mission at Kannabi Bridge." },

  // Season 1 - Shippuden / Part 2 (Episodes 28–72)
  { id: "28", season: 1, title: "Episode 28 - Naruto's Homecoming! (Ch. 245–253)", fileIdx: 30, overview: "Adapts Volume 28. Naruto returns to Konoha. Akatsuki's Deidara and Sasori attack the Sunagakure to capture Kazekage Gaara." },
  { id: "29", season: 1, title: "Episode 29 - Kakashi vs Itachi! (Ch. 254–262)", fileIdx: 31, overview: "Adapts Volume 29. Team Kakashi and Team Guy head to the Sand Village to rescue Gaara." },
  { id: "30", season: 1, title: "Episode 30 - Puppet Masters (Ch. 263–271)", fileIdx: 32, overview: "Adapts Volume 30. Chiyo and Sakura fight Sasori while Naruto and Kakashi pursue Deidara." },
  { id: "31", season: 1, title: "Episode 31 - Entrusted Feelings! (Ch. 272–281)", fileIdx: 33, overview: "Adapts Volume 31. Kazekage Rescue climax; Chiyo uses her life force jutsu to revive Gaara." },
  { id: "32", season: 1, title: "Episode 32 - The Road to Sasuke! (Ch. 282–290)", fileIdx: 34, overview: "Adapts Volume 32. Sai and Captain Yamato join Team 7 for a mission to intercept Orochimaru's spy at Tenchi Bridge." },
  { id: "33", season: 1, title: "Episode 33 - Top-Secret Mission! (Ch. 291–299)", fileIdx: 35, overview: "Adapts Volume 33. Four-Tailed Naruto goes berserk against Orochimaru at Tenchi Bridge." },
  { id: "34", season: 1, title: "Episode 34 - The Reunion! (Ch. 300–309)", fileIdx: 36, overview: "Adapts Volume 34. Team 7 infiltrates Orochimaru's hideout and reunites with Sasuke after 3 years." },
  { id: "35", season: 1, title: "Episode 35 - The New Duo! (Ch. 310–319)", fileIdx: 37, overview: "Adapts Volume 35. Naruto begins Wind-style nature transformation training. Akatsuki members Hidan and Kakuzu invade the Land of Fire." },
  { id: "36", season: 1, title: "Episode 36 - Team 10 (Ch. 320–329)", fileIdx: 38, overview: "Adapts Volume 36. Team 10 battles Hidan and Kakuzu; Asuma Sarutobi makes the ultimate sacrifice." },
  { id: "37", season: 1, title: "Episode 37 - Shikamaru's Battle! (Ch. 330–339)", fileIdx: 39, overview: "Adapts Volume 37. Shikamaru executes his master plan against Hidan while Naruto unveils the Wind Style: Rasenshuriken." },
  { id: "38", season: 1, title: "Episode 38 - The Fruits of Training! (Ch. 340–349)", fileIdx: 40, overview: "Adapts Volume 38. Sasuke turns against Orochimaru and forms Team Hebi to hunt Itachi." },
  { id: "39", season: 1, title: "Episode 39 - On the Move (Ch. 350–359)", fileIdx: 41, overview: "Adapts Volume 39. Deidara fights Sasuke in an explosive battle of art and Sharingan." },
  { id: "40", season: 1, title: "Episode 40 - The Ultimate Art! (Ch. 360–369)", fileIdx: 42, overview: "Adapts Volume 40. Jiraiya infiltrates the Hidden Rain Village to uncover the identity of Akatsuki leader Pain." },
  { id: "41", season: 1, title: "Episode 41 - Jiraiya's Choice! (Ch. 370–379)", fileIdx: 43, overview: "Adapts Volume 41. Jiraiya enters Sage Mode against Pain's Six Paths and leaves his final encoded message." },
  { id: "42", season: 1, title: "Episode 42 - The Secret of the Mangekyo! (Ch. 380–389)", fileIdx: 44, overview: "Adapts Volume 42. Sasuke vs. Itachi Uchiha; the truth behind the Mangekyo Sharingan is revealed." },
  { id: "43", season: 1, title: "Episode 43 - The One Who Knows the Truth (Ch. 390–399)", fileIdx: 45, overview: "Adapts Volume 43. Tobi reveals the dark secret of the Uchiha Massacre to Sasuke, prompting him to form Team Taka." },
  { id: "44", season: 1, title: "Episode 44 - Inheriting Sage Jutsu! (Ch. 400–408)", fileIdx: 46, overview: "Adapts Volume 44. Naruto travels to Mount Myoboku to learn Toad Sage Mode while Sasuke attacks Killer Bee." },
  { id: "45", season: 1, title: "Episode 45 - Leaf Battlefield (Ch. 409–417)", fileIdx: 47, overview: "Adapts Volume 45. Pain invades Konoha, devastating the village in search of the Nine-Tails." },
  { id: "46", season: 1, title: "Episode 46 - Naruto Returns! (Ch. 418–427)", fileIdx: 48, overview: "Adapts Volume 46. Sage Mode Naruto arrives to defend Konoha against Pain." },
  { id: "47", season: 1, title: "Episode 47 - The Broken Seal! (Ch. 428–437)", fileIdx: 49, overview: "Adapts Volume 47. Hinata defends Naruto; Naruto loses control and enters Eight-Tails form." },
  { id: "48", season: 1, title: "Episode 48 - The Cheering Village! (Ch. 438–447)", fileIdx: 50, overview: "Adapts Volume 48. Naruto meets Minato Namikaze inside his inner mind and confronts Nagato." },
  { id: "49", season: 1, title: "Episode 49 - The Five Kage Summit Commences! (Ch. 448–457)", fileIdx: 51, overview: "Adapts Volume 49. The Five Kage assemble in the Land of Iron; Danzo Shimura acts as interim Sixth Hokage." },
  { id: "50", season: 1, title: "Episode 50 - Water Prison Death Match (Ch. 458–467)", fileIdx: 52, overview: "Adapts Volume 50. Sasuke crashes the Five Kage Summit; Tobi declares the Fourth Shinobi World War." },
  { id: "51", season: 1, title: "Episode 51 - Sasuke vs Danzo! (Ch. 468–477)", fileIdx: 53, overview: "Adapts Volume 51. Sasuke battles Danzo Shimura and exacts vengeance for Itachi." },
  { id: "52", season: 1, title: "Episode 52 - Team 7, Together Again! (Ch. 478–487)", fileIdx: 54, overview: "Adapts Volume 52. Naruto, Sakura, and Kakashi confront Sasuke before he receives Itachi's eyes." },
  { id: "53", season: 1, title: "Episode 53 - Naruto's Birth (Ch. 488–497)", fileIdx: 55, overview: "Adapts Volume 53. Naruto travels to the Falls of Truth on Turtle Island to master the Nine-Tails with Killer Bee." },
  { id: "54", season: 1, title: "Episode 54 - Bridge To Peace (Ch. 498–507)", fileIdx: 56, overview: "Adapts Volume 54. Naruto meets Kushina Uzumaki and unlocks Nine-Tails Chakra Mode. Kisame fights Guy." },
  { id: "55", season: 1, title: "Episode 55 - The Great War Begins (Ch. 508–516)", fileIdx: 57, overview: "Adapts Volume 55. Konan fights Tobi in the Hidden Rain. The Allied Shinobi Forces mobilize for war." },
  { id: "56", season: 1, title: "Episode 56 - Team Asuma's Reunion! (Ch. 517–525)", fileIdx: 58, overview: "Adapts Volume 58. Reanimated shinobi take the battlefield; Team 10 faces their former master Asuma." },
  { id: "57", season: 1, title: "Episode 57 - Naruto Heads to the Battlefield! (Ch. 526–534)", fileIdx: 59, overview: "Adapts Volume 57. Naruto breaks through the barrier to join the war effort." },
  { id: "58", season: 1, title: "Episode 58 - Naruto vs Itachi! (Ch. 535–544)", fileIdx: 60, overview: "Adapts Volume 58. Reanimated Itachi and Nagato fight Naruto and Bee; Itachi breaks Kabuto's control with Shisui's eye." },
  { id: "59", season: 1, title: "Episode 59 - The Five Kage, Assembled! (Ch. 545–554)", fileIdx: 61, overview: "Adapts Volume 59. The real Madara Uchiha is reanimated on the battlefield against the Five Kage." },
  { id: "60", season: 1, title: "Episode 60 - Kurama! (Ch. 555–564)", fileIdx: 62, overview: "Adapts Volume 60. Naruto connects with Kurama and unlocks Tailed Beast Mode to fight the reanimated Jinchuriki." },
  { id: "61", season: 1, title: "Episode 61 - Brothers, United! (Ch. 565–574)", fileIdx: 63, overview: "Adapts Volume 61. Itachi and Sasuke team up to battle Kabuto and release the Reanimation Jutsu." },
  { id: "62", season: 1, title: "Episode 62 - The Crack (Ch. 575–584)", fileIdx: 64, overview: "Adapts Volume 62. Naruto, Bee, Kakashi, and Guy unmask Tobi, revealing Obito Uchiha." },
  { id: "63", season: 1, title: "Episode 63 - World of Dreams (Ch. 585–594)", fileIdx: 65, overview: "Adapts Volume 63. The Ten-Tails is revived on the battlefield." },
  { id: "64", season: 1, title: "Episode 64 - Ten Tails (Ch. 595–607)", fileIdx: 66, overview: "Adapts Volume 64. Neji Hyuga sacrifices his life to protect Naruto and Hinata." },
  { id: "65", season: 1, title: "Episode 65 - Hashirama and Madara (Ch. 608–617)", fileIdx: 67, overview: "Adapts Volume 65. Orochimaru reanimates the Four Hokage so Sasuke can learn the true history of Konoha." },
  { id: "66", season: 1, title: "Episode 66 - A New Three-Way Deadlock! (Ch. 618–627)", fileIdx: 68, overview: "Adapts Volume 66. The Hokage join the war; Team 7 reunites on the front lines." },
  { id: "67", season: 1, title: "Episode 67 - Breakthrough (Ch. 628–637)", fileIdx: 69, overview: "Adapts Volume 67. Obito becomes the Ten-Tails Jinchuriki." },
  { id: "68", season: 1, title: "Episode 68 - Naruto's Path (Ch. 638–647)", fileIdx: 70, overview: "Adapts Volume 68. The Shinobi Alliance pulls the Tailed Beasts out of Obito." },
  { id: "69", season: 1, title: "Episode 69 - The Start of a Crimson Spring (Ch. 648–657)", fileIdx: 71, overview: "Adapts Volume 69. Madara fully revives; Might Guy opens the Eighth Gate of Death." },
  { id: "70", season: 1, title: "Episode 70 - Naruto and the Sage of Six Paths (Ch. 658–667)", fileIdx: 72, overview: "Adapts Volume 70. Hagoromo Otsutsuki bestows Six Paths powers upon Naruto and Sasuke." },
  { id: "71", season: 1, title: "Episode 71 - I Love You (Ch. 668–679)", fileIdx: 73, overview: "Adapts Volume 71. Kaguya Otsutsuki emerges as the final threat." },
  { id: "72", season: 1, title: "Episode 72 - Naruto Uzumaki! (Ch. 680–700)", fileIdx: 74, overview: "Adapts Volume 72. Team 7 seals Kaguya; Naruto and Sasuke settle their fate at the Valley of the End. Epilogue included." },

  // Season 2 - Post-Series Extras / Movies / Shinden
  { id: "shinden_1", season: 2, title: "Shinden 1 - Itachi Shinden Part 1: Bright Light", fileIdx: 0, overview: "Light novel adaptation of Itachi Uchiha's childhood, entrance into ANBU, and relationship with Shisui." },
  { id: "shinden_2", season: 2, title: "Shinden 2 - Itachi Shinden Part 2: Dark Night", fileIdx: 1, overview: "Light novel adaptation detailing the tragic events leading directly to the Uchiha Clan Massacre." },
  { id: "movie_the_last", season: 2, title: "Movie - The Last: Naruto the Movie (2014)", fileIdx: 75, overview: "Canonical post-war film set 2 years after Chapter 699. Naruto and Team 7 travel to the moon to stop Toneri Otsutsuki." },
  { id: "omake", season: 2, title: "Extra - Kakashi Sensei's Real Face! (Omake)", fileIdx: 76, overview: "Special comedy short where Team 7 attempts to unmask Kakashi Hatake." },
  { id: "scroll_of_wind", season: 2, title: "Extra - Scroll of Wind: The True Face (Special)", fileIdx: 78, overview: "Official manga side-story adaptation celebrating the Naruto exhibition." }
];

// Ensure output directories exist
fs.mkdirSync(path.join(OUT_DIR, "catalog", "series"), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, "meta", "series"), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, "stream", "series"), { recursive: true });

// 1. Manifest
const manifest = {
  id: "org.narutokai.stremio.static",
  version: "1.1",
  name: SERIES_NAME,
  description: DESCRIPTION,
  resources: ["catalog", "meta", "stream"],
  types: ["series"],
  catalogs: [
    {
      type: "series",
      id: "narutokai_catalog",
      name: SERIES_NAME
    }
  ]
};
fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

// 2. Catalog
const catalog = {
  metas: [
    {
      id: "naruto_kai",
      type: "series",
      name: SERIES_NAME,
      poster: ARTWORK.poster,
      background: ARTWORK.background,
      logo: ARTWORK.logo,
      description: DESCRIPTION
    }
  ]
};
fs.writeFileSync(path.join(OUT_DIR, "catalog", "series", "narutokai_catalog.json"), JSON.stringify(catalog, null, 2));

// 3. Meta (Videos list with season counters)
let season1EpisodeCounter = 0;
let season2EpisodeCounter = 0;

const episodes = MEDIA_LIST.map((item) => {
  let epNumber = 0;
  if (item.season === 1) {
    season1EpisodeCounter += 1;
    epNumber = season1EpisodeCounter;
  } else {
    season2EpisodeCounter += 1;
    epNumber = season2EpisodeCounter;
  }

  return {
    id: `naruto_kai:${item.id}`,
    title: item.title,
    season: item.season,
    episode: epNumber,
    overview: item.overview,
    thumbnail: ARTWORK.thumbnail,
    released: RELEASE_DATE
  };
});

const meta = {
  meta: {
    id: "naruto_kai",
    type: "series",
    name: SERIES_NAME,
    poster: ARTWORK.poster,
    background: ARTWORK.background,
    logo: ARTWORK.logo,
    description: DESCRIPTION,
    videos: episodes
  }
};
fs.writeFileSync(path.join(OUT_DIR, "meta", "series", "naruto_kai.json"), JSON.stringify(meta, null, 2));

// 4. Streams mapping
MEDIA_LIST.forEach((item) => {
  const stream = {
    streams: [
      {
        title: `${SERIES_NAME} - ${item.title} [1080p Torrent]`,
        infoHash: INFO_HASH,
        fileIdx: item.fileIdx
      }
    ]
  };
  fs.writeFileSync(path.join(OUT_DIR, "stream", "series", `naruto_kai:${item.id}.json`), JSON.stringify(stream, null, 2));
});

console.log("Static addon v1.1 files successfully built with updated release dates!");
