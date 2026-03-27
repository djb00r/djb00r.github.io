// Unicode letters and position utilities extracted from script.js

// Basic Latin sets
const upper = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
const lower = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)); // a-z
const digits = Array.from({ length: 10 }, (_, i) => String.fromCharCode(48 + i)); // 0-9

// Arabic‑Indic digits (٠‎‎١‎‎٢‎‎٣‎‎٤‎‎٥‎‎٦‎‎٧‎‎٨‎‎٩) appended to the numeric set
const arabicIndicDigits = codeRange(0x0660, 0x0669);

// Combined digits set: Western Arabic digits + Arabic‑Indic digits
const combinedDigits = [...digits, ...arabicIndicDigits];

// Roman numerals (single-character forms)
const romanNumerals = ['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ','Ⅼ','Ⅽ','Ⅾ','Ⅿ'];
/* Common special characters placed after digits and before accented letters.
 * Extended to include backslash, paragraph, section, currency symbols, letterlike symbols, and related symbols.
 */
const specialCharsBasic = Array.from("!@#$%^&*()_+-=[]{}|;:'\",.<>?/`~\\§¶ ");

function codeRange(start, end) {
  const arr = [];
  for (let cp = start; cp <= end; cp++) {
    arr.push(String.fromCharCode(cp));
  }
  return arr;
}

// Currency Symbols block
const currencySymbols = codeRange(0x20a0, 0x20cf);

// Letterlike Symbols block
const letterlikeSymbols = codeRange(0x2100, 0x214f);

// Combined special characters set (basic punctuation + currency + letterlike)
const specialChars = [...specialCharsBasic, ...currencySymbols, ...letterlikeSymbols];

 // Codepoint-based range helper for characters above the BMP (e.g. emoji)
function codeRangeCP(start, end) {
  const arr = [];
  for (let cp = start; cp <= end; cp++) {
    arr.push(String.fromCodePoint(cp));
  }
  return arr;
}

// Codepoint-based range helper that filters to letters using Unicode properties
function codeRangeCPFiltered(start, end) {
  const arr = [];
  for (let cp = start; cp <= end; cp++) {
    const ch = String.fromCodePoint(cp);
    if (isLetter(ch)) {
      arr.push(ch);
    }
  }
  return arr;
}

const isLetter = (ch) => /\p{L}/u.test(ch);

// Precomposed Latin letters with diacritics
const latin1 = codeRange(0x00c0, 0x00ff); // common accented letters
const latinExtA = codeRange(0x0100, 0x017f); // extended latin A
const latinExtB = codeRange(0x0180, 0x024f); // Latin Extended-B
const latinLetters = [...latin1, ...latinExtA].filter(isLetter);

// Combining marks (main block only to avoid unsupported glyphs)
const combiningMarksBasic = codeRange(0x0300, 0x036f); // Combining Diacritical Marks
// Removed extended combining marks that the font likely does not support, to avoid question-mark glyphs
const combiningMarks = [...combiningMarksBasic];

// Alphabet Extended 21.0 (100 letters) built from extra Unicode letter ranges
// Here we use Greek and Cyrillic letter blocks and then take the first 100 letter codepoints.
const greekLetters = codeRange(0x0370, 0x03ff).filter(isLetter);
const cyrillicLetters = codeRange(0x0400, 0x04ff).filter(isLetter);
const cyrillicSupplementLetters = codeRange(0x0500, 0x052f).filter(isLetter); // Cyrillic Supplement
const cyrillicExtendedA = codeRange(0x2de0, 0x2dff).filter(isLetter); // Cyrillic Extended-A
const cyrillicExtendedB = codeRange(0xa640, 0xa69f).filter(isLetter); // Cyrillic Extended-B (includes ꙮ U+A66E)
const cyrillicExtendedC = codeRangeCPFiltered(0x1c80, 0x1c8f); // Cyrillic Extended-C
const cyrillicExtendedD = codeRangeCPFiltered(0x1e030, 0x1e08f); // Cyrillic Extended-D
const phoneticExtensionsLetters = codeRange(0x1d00, 0x1d7f).filter(isLetter); // Phonetic Extensions
const latinExtAdditionalLetters = codeRange(0x1e00, 0x1eff).filter(isLetter); // Latin Extended Additional

// Mathematical Alphanumeric Symbols (fancy Latin/Greek letters and digits)
// Added as explicit list so ordering matches the user's specification.
const mathAlphanumericsRaw = `
𝐀 𝐁 𝐂 𝐃 𝐄 𝐅 𝐆 𝐇 𝐈 𝐉 𝐊 𝐋 𝐌 𝐍 𝐎 𝐏
𝐐 𝐑 𝐒 𝐓 𝐔 𝐕 𝐖 𝐗 𝐘 𝐙 𝐚 𝐛 𝐜 𝐝 𝐞 𝐟
𝐠 𝐡 𝐢 𝐣 𝐤 𝐥 𝐦 𝐧 𝐨 𝐩 𝐪 𝐫 𝐬 𝐭 𝐮 𝐯
𝐰 𝐱 𝐲 𝐳 𝐴 𝐵 𝐶 𝐷 𝐸 𝐹 𝐺 𝐻 𝐼 𝐽 𝐾 𝐿
𝑀 𝑁 𝑂 𝑃 𝑄 𝑅 𝑆 𝑇 𝑈 𝑉 𝑊 𝑋 𝑌 𝑍 𝑎 𝑏
𝑐 𝑑 𝑒 𝑓 𝑔 𝑖 𝑗 𝑘 𝑙 𝑚 𝑛 𝑜 𝑝 𝑞 𝑟
𝑠 𝑡 𝑢 𝑣 𝑤 𝑥 𝑦 𝑧 𝑨 𝑩 𝑪 𝑫 𝑬 𝑭 𝑮 𝑯
𝑰 𝑱 𝑲 𝑳 𝑴 𝑵 𝑶 𝑷 𝑸 𝑹 𝑺 𝑻 𝑼 𝑽 𝑾 𝑿
𝒀 𝒁 𝒂 𝒃 𝒄 𝒅 𝒆 𝒇 𝒈 𝒉 𝒊 𝒋 𝒌 𝒍 𝒎 𝒏
𝒐 𝒑 𝒒 𝒓 𝒔 𝒕 𝒖 𝒗 𝒘 𝒙 𝒚 𝒛 𝒜 𝒞 𝒟
𝒢 𝒥 𝒦 𝒩 𝒪 𝒫 𝒬 𝒮 𝒯
𝒰 𝒱 𝒲 𝒳 𝒴 𝒵 𝒶 𝒷 𝒸 𝒹 𝒻 𝒽 𝒾 𝒿
𝓀 𝓁 𝓂 𝓃 𝓅 𝓆 𝓇 𝓈 𝓉 𝓊 𝓋 𝓌 𝓍 𝓎 𝓏
𝓐 𝓑 𝓒 𝓓 𝓔 𝓕 𝓖 𝓗 𝓘 𝓙 𝓚 𝓛 𝓜 𝓝 𝓞 𝓟
𝓠 𝓡 𝓢 𝓣 𝓤 𝓥 𝓦 𝓧 𝓨 𝓩 𝓪 𝓫 𝓬 𝓭 𝓮 𝓯
𝓰 𝓱 𝓲 𝓳 𝓴 𝓵 𝓶 𝓷 𝓸 𝓹 𝓺 𝓻 𝓼 𝓽 𝓾 𝓿
𝔀 𝔁 𝔂 𝔃 𝔄 𝔅 𝔇 𝔈 𝔉 𝔊 𝔍 𝔎 𝔏
𝔐 𝔑 𝔒 𝔓 𝔔 𝔖 𝔗 𝔘 𝔙 𝔚 𝔛 𝔜 𝔞 𝔟
𝔠 𝔡 𝔢 𝔣 𝔤 𝔥 𝔦 𝔧 𝔨 𝔩 𝔪 𝔫 𝔬 𝔭 𝔮 𝔯
𝔰 𝔱 𝔲 𝔳 𝔴 𝔵 𝔶 𝔷 𝔸 𝔹 𝔻 𝔼 𝔽 𝔾
𝕀 𝕁 𝕂 𝕃 𝕄 𝕆 𝕊 𝕋 𝕌 𝕍 𝕎 𝕏
𝕐 𝕒 𝕓 𝕔 𝕕 𝕖 𝕗 𝕘 𝕙 𝕚 𝕛 𝕜 𝕝 𝕞 𝕟
𝕠 𝕡 𝕢 𝕣 𝕤 𝕥 𝕦 𝕧 𝕨 𝕩 𝕪 𝕫 𝕬 𝕭 𝕮 𝕯
𝕰 𝕱 𝕲 𝕳 𝕴 𝕵 𝕶 𝕷 𝕸 𝕹 𝕺 𝕻 𝕼 𝕽 𝕾 𝕿
𝖀 𝖁 𝖂 𝖃 𝖄 𝖅 𝖆 𝖇 𝖈 𝖉 𝖊 𝖋 𝖌 𝖍 𝖎 𝖏
𝖐 𝖑 𝖒 𝖓 𝖔 𝖕 𝖖 𝖗 𝖘 𝖙 𝖚 𝖛 𝖜 𝖝 𝖞 𝖟
𝖠 𝖡 𝖢 𝖣 𝖤 𝖥 𝖦 𝖧 𝖨 𝖩 𝖪 𝖫 𝖬 𝖭 𝖮 𝖯
𝖰 𝖱 𝖲 𝖳 𝖴 𝖵 𝖶 𝖷 𝖸 𝖹 𝖺 𝖻 𝖼 𝖽 𝖾 𝖿
𝗀 𝗁 𝗂 𝗃 𝗄 𝗅 𝗆 𝗇 𝗈 𝗉 𝗊 𝗋 𝗌 𝗍 𝗎 𝗏
𝗐 𝗑 𝗒 𝗓 𝗔 𝗕 𝗖 𝗗 𝗘 𝗙 𝗚 𝗛 𝗜 𝗝 𝗞 𝗟
𝗠 𝗡 𝗢 𝗣 𝗤 𝗥 𝗦 𝗧 𝗨 𝗩 𝗪 𝗫 𝗬 𝗭 𝗮 𝗯
𝗰 𝗱 𝗲 𝗳 𝗴 𝗵 𝗶 𝗷 𝗸 𝗹 𝗺 𝗻 𝗼 𝗽 𝗾 𝗿
𝘀 𝘁 𝘂 𝘃 𝘄 𝘅 𝘆 𝘇 𝘈 𝘉 𝘊 𝘋 𝘌 𝘍 𝘎 𝘏
𝘐 𝘑 𝘒 𝘓 𝘔 𝘕 𝘖 𝘗 𝘘 𝘙 𝘚 𝘛 𝘜 𝘝 𝘞 𝘟
𝘠 𝘡 𝘢 𝘣 𝘤 𝘥 𝘦 𝘧 𝘨 𝘩 𝘪 𝘫 𝘬 𝘭 𝘮 𝘯
𝘰 𝘱 𝘲 𝘳 𝘴 𝘵 𝘶 𝘷 𝘸 𝘹 𝘺 𝘻 𝘼 𝘽 𝘾 𝘿
𝙀 𝙁 𝙂 𝙃 𝙄 𝙅 𝙆 𝙇 𝙈 𝙉 𝙊 𝙋 𝙌 𝙍 𝙎 𝙏
𝙐 𝙑 𝙒 𝙓 𝙔 𝙕 𝙖 𝙗 𝙘 𝙙 𝙚 𝙛 𝙜 𝙝 𝙞 𝙟
𝙠 𝙡 𝙢 𝙣 𝙤 𝙥 𝙦 𝙧 𝙨 𝙩 𝙪 𝙫 𝙬 𝙭 𝙮 𝙯
𝙰 𝙱 𝙲 𝙳 𝙴 𝙵 𝙶 𝙷 𝙸 𝙹 𝙺 𝙻 𝙼 𝙽 𝙾 𝙿
𝚀 𝚁 𝚂 𝚃 𝚄 𝚅 𝚆 𝚇 𝚈 𝚉 𝚊 𝚋 𝚌 𝚍 𝚎 𝚏
𝚐 𝚑 𝚒 𝚓 𝚔 𝚕 𝚖 𝚗 𝚘 𝚙 𝚚 𝚛 𝚜 𝚝 𝚞 𝚟
𝚠 𝚡 𝚢 𝚣 𝚤 𝚥 𝚨 𝚩 𝚪 𝚫 𝚬 𝚭 𝚮 𝚯
𝚰 𝚱 𝚲 𝚳 𝚴 𝚵 𝚶 𝚷 𝚸 𝚹 𝚺 𝚻 𝚼 𝚽 𝚾 𝚿
𝛀 𝛁 𝛂 𝛃 𝛄 𝛅 𝛆 𝛇 𝛈 𝛉 𝛊 𝛋 𝛌 𝛍 𝛎 𝛏
𝛐 𝛑 𝛒 𝛓 𝛔 𝛕 𝛖 𝛗 𝛘 𝛙 𝛚 𝛛 𝛜 𝛝 𝛞 𝛟
𝛠 𝛡 𝛢 𝛣 𝛤 𝛥 𝛦 𝛧 𝛨 𝛩 𝛪 𝛫 𝛬 𝛭 𝛮 𝛯
𝛰 𝛱 𝛲 𝛳 𝛴 𝛵 𝛶 𝛷 𝛸 𝛹 𝛺 𝛻 𝛼 𝛽 𝛾 𝛿
𝜀 𝜁 𝜂 𝜃 𝜄 𝜅 𝜆 𝜇 𝜈 𝜉 𝜊 𝜋 𝜌 𝜍 𝜎 𝜏
𝜐 𝜑 𝜒 𝜓 𝜔 𝜕 𝜖 𝜗 𝜘 𝜙 𝜚 𝜛 𝜜 𝜝 𝜞 𝜟
𝜠 𝜡 𝜢 𝜣 𝜤 𝜥 𝜦 𝜧 𝜨 𝜩 𝜪 𝜫 𝜬 𝜭 𝜮 𝜯
𝜰 𝜱 𝜲 𝜳 𝜴 𝜵 𝜶 𝜷 𝜸 𝜹 𝜺 𝜻 𝜼 𝜽 𝜾 𝜿
𝝀 𝝁 𝝂 𝝃 𝝄 𝝅 𝝆 𝝇 𝝈 𝝉 𝝊 𝝋 𝝌 𝝍 𝝎 𝝏
𝝐 𝝑 𝝒 𝝓 𝝔 𝝕 𝝖 𝝗 𝝘 𝝙 𝝚 𝝛 𝝜 𝝝 𝝞 𝝟
𝝠 𝝡 𝝢 𝝣 𝝤 𝝥 𝝦 𝝧 𝝨 𝝩 𝝪 𝝫 𝝬 𝝭 𝝮 𝝯
𝝰 𝝱 𝝲 𝝳 𝝴 𝝵 𝝶 𝝷 𝝸 𝝹 𝝺 𝝻 𝝼 𝝽 𝝾 𝝿
𝞀 𝞁 𝞂 𝞃 𝞄 𝞅 𝞆 𝞇 𝞈 𝞉 𝞊 𝞋 𝞌 𝞍 𝞎 𝞏
𝞐 𝞑 𝞒 𝞓 𝞔 𝞕 𝞖 𝞗 𝞘 𝞙 𝞚 𝞛 𝞜 𝞝 𝞞 𝞟
𝞠 𝞡 𝞢 𝞣 𝞤 𝞥 𝞦 𝞧 𝞨 𝞩 𝞪 𝞫 𝞬 𝞭 𝞮 𝞯
𝞰 𝞱 𝞲 𝞳 𝞴 𝞵 𝞶 𝞷 𝞸 𝞹 𝞺 𝞻 𝞼 𝞽 𝞾 𝞿
𝟀 𝟁 𝟂 𝟃 𝟄 𝟅 𝟆 𝟇 𝟈 𝟉 𝟊 𝟋 𝟎 𝟏
𝟐 𝟑 𝟒 𝟓 𝟔 𝟕 𝟖 𝟗 𝟘 𝟙 𝟚 𝟛 𝟜 𝟝 𝟞 𝟟
𝟠 𝟡 𝟢 𝟣 𝟤 𝟥 𝟦 𝟧 𝟨 𝟩 𝟪 𝟫 𝟬 𝟭 𝟮 𝟯
𝟰 𝟱 𝟲 𝟳 𝟴 𝟵 𝟶 𝟷 𝟸 𝟹 𝟺 𝟻 𝟼 𝟽 𝟾 𝟿
`;
const mathAlphanumerics = mathAlphanumericsRaw
  .trim()
  .split(/\s+/);

// Emoji and symbol blocks (major ranges, including many emoji)
// These are not filtered by letter-ness; they are used as raw symbols.
const emojiAndSymbolBlocks = [
  // Miscellaneous Symbols
  ...codeRangeCP(0x2600, 0x26ff),
  // Dingbats
  ...codeRangeCP(0x2700, 0x27bf),
  // Miscellaneous Symbols and Pictographs
  ...codeRangeCP(0x1f300, 0x1f5ff),
  // Emoticons
  ...codeRangeCP(0x1f600, 0x1f64f),
  // Transport and Map Symbols
  ...codeRangeCP(0x1f680, 0x1f6ff),
  // Miscellaneous Symbols and Arrows / Supplemental blocks commonly used as emoji
  ...codeRangeCP(0x1f700, 0x1f77f),
  ...codeRangeCP(0x1f780, 0x1f7ff),
  ...codeRangeCP(0x1f800, 0x1f8ff),
  // Supplemental Symbols and Pictographs
  ...codeRangeCP(0x1f900, 0x1f9ff),
  // Symbols and Pictographs Extended-A
  ...codeRangeCP(0x1fa70, 0x1faff),
];

 // Game-related symbol blocks (Mahjong tiles, dominoes, playing cards, chess pieces)
const mahjongTiles = codeRangeCP(0x1f000, 0x1f02f);     // Mahjong tiles
const dominoTiles = codeRangeCP(0x1f030, 0x1f093);      // Domino tiles
const playingCards = codeRangeCP(0x1f0a0, 0x1f0ff);     // Playing cards
const chessPieces = [
  ...codeRange(0x2654, 0x265f),                         // White/black chess pieces
  ...codeRangeCP(0x1fa00, 0x1fa6f),                    // Chess Symbols block
];

﻿// Extra game-like emoji/symbols requested by user
const extraGameSymbolsRaw = `
󼈀 󼈁
󼈂 󼈃 󼈄 󼈅 󼈆 󼈇 󼈈 󼈉 󼈊 󼈋 󼈌 󼈍
󼈎 󼈏 󼈐 󼈑 󼈒 󼈓 󼈔 󼈕 󼈖 󼈗 󼈘 󼈙
󼈚 󼈛 󼈜 󼈝 󼈞 󼈟 󼈠 󼈡 󼈢 󼈣 󼈤 󼈥
󼈦 󼈧 󼈨 󼈩 󼈪 󼈫 󼈬 󼈭 󼈮 󼈯 󼈰 󼈱
󼈲 󼈳 󼈴 󼈵 󼈶 󼈷 󼈸 󼈹 󼈺 󼈻 󼈼 󼈽
󼈾 󼈿 󼉀 󼉁 󼉂 󼉃 󼉄 󼉅 󼉆 󼉇 󼉈 󼉉
󼉊 󼉋 󼉌 󼉍 󼉎 󼉏 󼉐 󼉑 󼉒 󼉓 󼉔 󼉕 󼉖 󼉗
󼉘 󼉙 󼉚 󼉛 󼉜 󼉝 󼉞 󼉟 󼉠 󼉡 󼉢 󼉣 󼉤 󼉥
󼉦 󼉧 󼉨 󼉩 󼉪 󼉫 󼉬 󼉭 󼉮 󼉯 󼉰 󼉱 󼉲 󼉳
󼉴 󼉵 󼉶 󼉷 󼉸 󼉹 󼉺 󼉻 󼉼 󼉽 󼉾 󼉿 󼊀 󼊁
󼊂 󼊃 󼊄 󼊅 󼊆 󼊇 󼊈 󼊉 󼊊 󼊋 󼊌 󼊍 󼊎 󼊏
󼊐 󼊑 󼊒 󼊓 󼊔 󼊕 󼊖 󼊗 󼊘 󼊙 󼊚 󼊛 󼊜 󼊝
󼊞 󼊟 󼊠 󼊡 󼊢 󼊣 󼊤 󼊥 󼊦 󼊧 󼊨 󼊩 󼊪 󼊫
󼊬 󼊭 󼊮 󼊯 󼊰 󼊱 󼊲 󼊳 󼊴 󼊵 󼊶 󼊷 󼊸 󼊹
󼊺 󼊻 󼊼 󼊽 󼊾 󼊿 󼋀 󼋁 󼋂 󼋃 󼋄 󼋅 󼋆 󼋇
󼋈 󼋉 󼋊 󼋋 󼋌 󼋍 󼋎 󼋏 󼋐 󼋑 󼋒 󼋓 󼋔 󼋕
`;
const extraGameSymbols = Array.from(extraGameSymbolsRaw).filter((ch) => !/\s/.test(ch));

// Additional game-like symbols requested (󼅰–󼆪 block)
const extraGameSymbols2Raw = `
󼅰 󼅱 󼅲 󼅳 󼅴 󼅵 󼅶 󼅷 󼅸 󼅹 󼅺 󼅻 󼅼 󼅽 󼅾 󼅿
󼆀 󼆁 󼆂 󼆃 󼆄 󼆅 󼆆 󼆇 󼆈 󼆉 󼆊 󼆋 󼆌 󼆍 󼆎 󼆏
󼆐 󼆍 󼆒 󼆓 󼆔 󼆕 󼆖 󼆗 󼆘 󼆙 󼆚 󼆛 󼆜 󼆝 󼆞 󼆟
󼆠 󼆡 󼆢 󼆣 󼆤 󼆥 󼆦 󼆧 󼆨 󼆩 󼆪
`;
const extraGameSymbols2 = Array.from(extraGameSymbols2Raw).filter((ch) => !/\s/.test(ch));

const gameSymbolBlocks = [
  ...mahjongTiles,
  ...dominoTiles,
  ...playingCards,
  ...chessPieces,
  ...extraGameSymbols,
  ...extraGameSymbols2,
];

// --- People + skin tone + couple/kiss/family emoji sequences ---

const ZWJ = '\u200d';
const HEART = '\u2764\ufe0f';      // ❤️
const KISS_MARK = '\ud83d\udc8b';  // 💋
const toneModifiers = [
  '\u{1F3FB}', // light skin tone
  '\u{1F3FC}', // medium-light skin tone
  '\u{1F3FD}', // medium skin tone
  '\u{1F3FE}', // medium-dark skin tone
  '\u{1F3FF}', // dark skin tone
];

// Base person emojis used for sequences
const PERSON = '\u{1F9D1}'; // 🧑
const MAN = '\u{1F468}';    // 👨
const WOMAN = '\u{1F469}';  // 👩
const GIRL = '\u{1F467}';   // 👧
const BOY = '\u{1F466}';    // 👦
const BABY = '\u{1F476}';   // 👶

function withTone(base, tone) {
  return base + tone;
}

// Single person + skin tone (all people-type bases)
const singlePeopleBases = [PERSON, MAN, WOMAN, GIRL, BOY, BABY];

const singlePeopleWithTones = singlePeopleBases.flatMap((base) =>
  toneModifiers.map((tone) => withTone(base, tone))
);

// Couple holding hands sequences (generic; we include same + mixed gender)
const coupleBases = [
  [PERSON, PERSON],
  [MAN, MAN],
  [WOMAN, WOMAN],
  [MAN, WOMAN],
  [WOMAN, MAN],
];

function generateCoupleHoldingHands(baseA, baseB) {
  const base = baseA + ZWJ + baseB; // generic couple (no explicit "holding hands" glyph)
  const combos = [];
  for (const toneA of toneModifiers) {
    for (const toneB of toneModifiers) {
      combos.push(withTone(baseA, toneA) + ZWJ + withTone(baseB, toneB));
    }
  }
  return combos;
}

const coupleHoldingHandsWithTones = coupleBases.flatMap(([a, b]) =>
  generateCoupleHoldingHands(a, b)
);

// Couple with heart sequences (love people emojis)
function generateCoupleHeart(baseA, baseB) {
  const combos = [];
  for (const toneA of toneModifiers) {
    for (const toneB of toneModifiers) {
      combos.push(
        withTone(baseA, toneA) + ZWJ + HEART + ZWJ + withTone(baseB, toneB)
      );
    }
  }
  return combos;
}

const coupleHeartSequences = coupleBases.flatMap(([a, b]) =>
  generateCoupleHeart(a, b)
);

// Kissing people sequences
function generateCoupleKiss(baseA, baseB) {
  const combos = [];
  for (const toneA of toneModifiers) {
    for (const toneB of toneModifiers) {
      combos.push(
        withTone(baseA, toneA) + ZWJ + KISS_MARK + ZWJ + withTone(baseB, toneB)
      );
    }
  }
  return combos;
}

const coupleKissSequences = coupleBases.flatMap(([a, b]) =>
  generateCoupleKiss(a, b)
);

 // Family emoji patterns: arrays of base person emojis that get tones
// These cover common family structures (2 parents + 1–2 children, 1 parent + 1–2 children, same‑gender parents, etc.)
// Extended to also include PERSON-based families so combinations like 👨🏼‍🧑‍👦🏽‍🧒 are possible.
const familyPatterns = [
  // Existing man+woman parent families
  [MAN, WOMAN, BOY],
  [MAN, WOMAN, GIRL],
  [MAN, WOMAN, GIRL, BOY],
  [MAN, WOMAN, BOY, BOY],
  [MAN, WOMAN, GIRL, GIRL],
  // Existing same-gender parent families
  [MAN, MAN, BOY],
  [MAN, MAN, GIRL],
  [MAN, MAN, GIRL, BOY],
  [MAN, MAN, BOY, BOY],
  [MAN, MAN, GIRL, GIRL],
  [WOMAN, WOMAN, BOY],
  [WOMAN, WOMAN, GIRL],
  [WOMAN, WOMAN, GIRL, BOY],
  [WOMAN, WOMAN, BOY, BOY],
  [WOMAN, WOMAN, GIRL, GIRL],
  // Existing single-parent families
  [WOMAN, BOY],
  [WOMAN, GIRL],
  [WOMAN, GIRL, BOY],
  [WOMAN, BOY, BOY],
  [WOMAN, GIRL, GIRL],
  [MAN, BOY],
  [MAN, GIRL],
  [MAN, GIRL, BOY],
  [MAN, BOY, BOY],
  [MAN, GIRL, GIRL],

  // New PERSON-based families (generic parent / mixed parents)
  [PERSON, BOY],
  [PERSON, GIRL],
  [PERSON, BABY],
  [PERSON, BOY, GIRL],
  [PERSON, BOY, BABY],
  [PERSON, GIRL, BABY],
  [PERSON, BOY, BOY],
  [PERSON, GIRL, GIRL],

  [PERSON, PERSON, BOY],
  [PERSON, PERSON, GIRL],
  [PERSON, PERSON, BABY],
  [PERSON, PERSON, BOY, GIRL],
  [PERSON, PERSON, BOY, BABY],
  [PERSON, PERSON, GIRL, BABY],
  [PERSON, PERSON, BOY, BOY],
  [PERSON, PERSON, GIRL, GIRL],

  // Mixed MAN/PERSON parent combos like 👨🏼‍🧑‍👦🏽‍🧒
  [MAN, PERSON, BOY],
  [MAN, PERSON, GIRL],
  [MAN, PERSON, BABY],
  [MAN, PERSON, BOY, GIRL],
  [MAN, PERSON, BOY, BABY],
  [MAN, PERSON, GIRL, BABY],
];

function generateFamilySequences(pattern) {
  const members = pattern.length;
  const sequences = [];

  // Recursive helper to assign tones to each member, allowing both default
  // (yellow) and toned variants so mixed-skin families like 👨‍👩🏼‍👧‍👦🏾 appear.
  function build(index, currentParts) {
    if (index === members) {
      // Join all members with ZWJ
      sequences.push(currentParts.join(ZWJ));
      return;
    }
    const base = pattern[index];
    // Each member can be default (no tone) or any of the tone-modified variants
    const variants = [base, ...toneModifiers.map((tone) => withTone(base, tone))];
    for (const variant of variants) {
      build(index + 1, [...currentParts, variant]);
    }
  }

  build(0, []);
  return sequences;
}

const familySkinToneSequences = familyPatterns.flatMap((p) =>
  generateFamilySequences(p)
);

// Neutral (yellow) family emoji sequences without skin tones
const familyBaseSequences = familyPatterns.map((pattern) =>
  pattern.join(ZWJ)
);

// Collect all people/skin tone related emoji sequences; these are multi‑codepoint strings
const peopleAndFamilyEmojiSequences = [
  ...singlePeopleWithTones,
  ...coupleHoldingHandsWithTones,
  ...coupleHeartSequences,
  ...coupleKissSequences,
  ...familySkinToneSequences,
  ...familyBaseSequences,
];

// Deduplicate in case any sequence overlaps existing ranges
const peopleAndFamilyEmojiSet = Array.from(
  new Set(peopleAndFamilyEmojiSequences)
);

// --- Flag emoji (country flags via regional indicators + subdivision flags like England) ---

// Generate all 26×26 regional-indicator flag sequences (covers all country flags and some unassigned combos)
const regionalIndicatorFlags = [];
for (let a = 0; a < 26; a++) {
  for (let b = 0; b < 26; b++) {
    const first = 0x1f1e6 + a;
    const second = 0x1f1e6 + b;
    regionalIndicatorFlags.push(String.fromCodePoint(first, second));
  }
}

// Helper to build subdivision flags using tag sequences (e.g. 'gbeng', 'gbsct', 'gbwls')
function subdivisionFlagFromTag(tag) {
  const BASE_FLAG = 0x1f3f4; // 🏴 black flag
  const TAG_A = 0xe0061; // tag 'a'
  const CANCEL_TAG = 0xe007f;
  const tagPoints = [...tag].map((ch) => TAG_A + (ch.charCodeAt(0) - 97)); // 'a'..'z'
  return String.fromCodePoint(BASE_FLAG, ...tagPoints, CANCEL_TAG);
}

// Known GB subdivision flags: England, Scotland, Wales
const subdivisionFlagTags = ['gbeng', 'gbsct', 'gbwls'];
const subdivisionFlags = subdivisionFlagTags.map(subdivisionFlagFromTag);

const allFlagEmojis = [...regionalIndicatorFlags, ...subdivisionFlags];

 // Japanese / Chinese character blocks (core ranges)
// Includes Hiragana, Katakana, CJK symbols & punctuation, and core CJK ideographs.
const cjkSymbolsPunctuation = codeRange(0x3000, 0x303f); // CJK Symbols and Punctuation
const hiragana = codeRange(0x3040, 0x309f); // Hiragana
const katakana = codeRange(0x30a0, 0x30ff); // Katakana
const katakanaPhoneticExtensions = codeRange(0x31f0, 0x31ff); // Katakana Phonetic Extensions
const cjkUnifiedIdeographsExtA = codeRange(0x3400, 0x4dbf); // CJK Unified Ideographs Extension A
const cjkUnifiedIdeographs = codeRange(0x4e00, 0x9fff); // CJK Unified Ideographs
const cjkCompatibilityIdeographs = codeRange(0xf900, 0xfaff); // CJK Compatibility Ideographs

// Korean (Hangul) blocks
const hangulJamo = codeRange(0x1100, 0x11ff); // Hangul Jamo
const hangulCompatibilityJamo = codeRange(0x3130, 0x318f); // Hangul Compatibility Jamo
const hangulJamoExtendedA = codeRange(0xa960, 0xa97f); // Hangul Jamo Extended-A
const hangulJamoExtendedB = codeRange(0xd7b0, 0xd7ff); // Hangul Jamo Extended-B
const hangulSyllables = codeRange(0xac00, 0xd7a3); // Hangul Syllables

// Thai and Sinhala (includes ඞ U+0D9E)
const thai = codeRange(0x0e00, 0x0e7f); // Thai
const sinhala = codeRange(0x0d80, 0x0dff); // Sinhala

 // Egyptian Hieroglyphs (full main block)
const egyptianHieroglyphs = codeRangeCP(0x13000, 0x1342f); // Egyptian Hieroglyphs

/* Braille Patterns block */
const braillePatterns = codeRange(0x2800, 0x28ff); // Braille Patterns

/* Georgian script (Asomtavruli & Nuskhuri & Mkhedruli ranges)
   - Asomtavruli/Nuskhuri historic ranges are U+10A0–U+10FF (Georgian)
   - Modern Mkhedruli letters are U+10D0–U+10FF (subset of above)
*/
const georgian = codeRange(0x10a0, 0x10ff); // Georgian (includes Mkhedruli)
const georgianMkhedruli = codeRange(0x10d0, 0x10ff); // Mkhedruli subset (modern)

/* Small word lists for Cyrillic and Georgian so you also see full words, not just single letters */
const cyrillicWords = [
  'Привет',
  'Алфавит',
  'Кириллица',
  'буква',
  'слово',
  'Москва',
  'Україна',
  'България',
  'Беларусь',
];

const georgianWords = [
  'გამარჯობა',   // hello
  'საქართველო',  // Georgia
  'თბილისი',     // Tbilisi
  'დედა',        // mother
  'მეგობარი',    // friend
];

/* Hindi (Devanagari) and Arabic blocks */
// Devanagari (used for Hindi and related languages)
const devanagari = codeRange(0x0900, 0x097f); // Devanagari

// Arabic main block and common extensions/presentation forms
const arabicMain = codeRange(0x0600, 0x06ff); // Arabic
const arabicExtA = codeRange(0x08a0, 0x08ff); // Arabic Extended-A
const arabicPresFormsA = codeRange(0xfb50, 0xfdff); // Arabic Presentation Forms-A
const arabicPresFormsB = codeRange(0xfe70, 0xfeff); // Arabic Presentation Forms-B

const alphabetExtended21 = [...greekLetters, ...cyrillicLetters].slice(0, 100);

// Custom extra symbol placed after Egyptian hieroglyphs
const extraEgyptianLikeSymbol = '';

// Extra emoji-like symbols requested by user, treated as part of emoji blocks
const extraEmojiSymbolsRaw = `
󼐣 󼐤 󼐥
󼐦 󼐧 󼐨 󼐩 󼐪 󼐫 󼐬 󼐭 󼐮 󼐯 󼐰
󼐱 󼐲 󼐳 󼐴 󼐵 󼐶 󼐷 󼐸 󼐹 󼐺 󼐻 󼐼
󼐽 󼐾 󼐿 󼑀 󼑁 󼑂 󼑃 󼑄 󼑅 󼑆 󼑇 󼑈
󼑉 󼑊 󼑋 󼑌 󼑍 󼑎 󼑏 󼑐 󼑑 󼑒
󼑓 󼑔 󼑕 󼑖 󼑗 󼑘 󼑙 󼑚 󼑛 󼑜 󼑝 󼑞
󼑟 󼑠 󼑡 󼑢 󼑣 󼑤 󼑥 󼑦 󼑧 󼑨 󼑩 󼑪 󼑫
󼑬 󼑭 󼑮 󼑯 󼑰 󼑱 󼑲 󼑳 󼑴 󼑵 󼑶 󼑷 󼑸 󼑹 󼑺 󼑻 󼑼 󼑽 󼑾 󼑿 󼒀 󼒁 󼒂
󼒃 󼒄 󼒅 󼒆 󼒇 󼒈 󼒉 󼒊 󼒋 󼒌 󼒍 󼒎
󼒏 󼒐 󼒑 󼒒 󼒓 󼒔 󼒕 󼒖 󼒗 󼒘 󼒙 󼒚
`;
const extraEmojiSymbols = Array.from(extraEmojiSymbolsRaw)
  .filter((ch) => !/\s/.test(ch) && ch !== extraEgyptianLikeSymbol);

// Additional user‑requested emoji-like symbols
const extraEmojiSymbolsExtraRaw = `
󼤀 󼤁 󼤂 󼤃 󼤄 󼤅 󼤆 󼤇 󼤈
󼤉 󼤊 󼤋 󼤌 󼤍 󼤎 󼤏 󼤐
󼤑 󼤒 󼤓 󼤔 󼤕 󼤖 󼤗 󼤘
󼤙 󼤚 󼤛 󼤜 󼤝 󼤞 󼤟
󼤠 󼤡 󼤢 󼤣 󼤤 󼤥 󼤦 󼤧
󼤨 󼤩 󼤪 󼤫 󼤬 󼤭 󼤮 󼤯
󼤰 󼤱 󼤲 󼤳 󼤴
󼤵 󼤶 󼤷 󼤸 󼤹
󼤺 󼤻 󼤼 󼤽 󼤾
󼤿 󼥀 󼥁 󼥂 󼥃
󼥄 󼥅 󼥆 󼥇 󼥈 󼥉 󼥊 󼥋 󼥌 󼥍 󼥎 󼥏
󼥐 󼥑 󼥒 󼥓 󼥔 󼥕 󼥖 󼥗 󼥘 󼥙
󼥚 󼥛 󼥜 󼥝 󼥞 󼥟 󼥠 󼥡 󼥢 󼥣
󼥤 󼥥 󼥦 󼥧 󼥨 󼥩 󼥪 󼥫 󼥬 󼥭
󼥮 󼥯 󼥰 󼥱 󼥲 󼥳 󼥴 󼥵 󼥶 󼥷
󼥸 󼥹 󼥹 󼥻 󼥼 󼥽 󼥾 󼥿
󼦀 󼦁 󼦂 󼦃 󼦄 󼦅 󼦆 󼦇 󼦈 󼦉
󼦊 󼦋 󼦌 󼦍 󼦏 󼦐 󼦑 󼦒 󼦔 󼦕
󼦖 󼦗 󼦘 󼦙 󼦚 󼦛 󼦜 󼦝 󼦞 󼦟
󼦠 󼦡 󼦢 󼦣 󼦤 󼦥 󼦦 󼦧 󼦨 󼦩
󼦪 󼦫 󼦬 󼦭 󼦮 󼦯 󼦰 󼦱 󼦲
󼦸 󼦹 󼦺 󼦻 󼦼 󼦽 󼦾 󼦿
󼧀 󼧁 󼧂 󼧃 󼧄 󼧅 󼧆 󼧇 󼧈 󼧉
󼧊 󼧋 󼧌 󼧍 󼧎 󼧏 󼧐 󼧑 󼧒 󼧓
󼧔 󼧕 󼧖 󼧗 󼧘 󼧙 󼧚 󼧛 󼧜 󼧝
󼧞 󼧟 󼧠 󼧡 󼧢 󼧣 󼧤 󼧥 󼧦 󼧧
󼧨 󼧩 󼧪 󼧫 󼧬 󼧭 󼧮 󼧯 󼧰 󼧱
󼧲 󼧳 󼧴 󼧵 󼧶 󼧷 󼧸 󼧹 󼧺 󼧻
󼧼 󼨀 󼨁 󼨂 󼨃 󼨄 󼨅 󼨆 󼨇 󼨈
󼨉 󼨊 󼨋 󼨌 󼨍 󼨎 󼨏 󼨐 󼨑 󼨒
󼨓 󼨔 󼨕 󼨖 󼨗 󼨘 󼨙 󼨚 󼨛 󼨜
󼨝 󼨞 󼨟 󼨠 󼨡 󼨢 󼨣 󼨤 󼨥 󼨦
󼨧 󼨨 󼨩 󼨪 󼨫 󼨬 󼨭 󼨮 󼨯 󼨰
󼨱 󼨲 󼨳 󼨴 󼨵 󼨶 󼨷 󼨸 󼨹 󼨺
󼨻 󼨼 󼨽 󼨾 󼨿 󼩀 󼩁 󼩂 󼩃 󼩄
󼩉 󼩉 󼩐 󼩑 󼩒 󼩓 󼩔 󼩕 󼩖 󼩗
󼩘 󼩙 󼩚 󼩛 󼩜 󼩝 󼩞 󼩟 󼩠 󼩡
󼩢 󼩣 󼩤 󼩥 󼩦 󼩧 󼩨 󼩩 󼩪 󼩫
󼩬 󼩭 󼩮 󼩯 󼩰 󼩱 󼩲 󼩳 󼩴 󼩵
󼩶 󼩷 󼩸 󼩹 󼩺 󼩻 󼩼 󼩽 󼩾 󼩿
󼪀 󼪁 󼪂 󼪃 󼪄 󼪅 󼪆 󼪇 󼪈 󼪉
󼪊 󼪊 󼪌 󼪍 󼪎 󼪏 󼪐 󼪑 󼪒 󼪓
󼪔 󼪕 󼪖 󼪗 󼪘 󼪙 󼪚 󼪛 󼪜 󼪝
󼪞 󼪥 󼪦 󼪧
󼫀 󼫁 󼫂
󼫒 󼫓 󼫔 󼫕 󼫖
󼫰 󼫱 󼫲 󼫳 󼫴 󼫵 󼫶 󼫷
󼫽 󼫾 󼫿
󼬀 󼬁 󼬂 󼬃 󼬄 󼬅 󼬆 󼬇 󼬈 󼬉
󼬊 󼬋 󼬌 󼬍 󼬎 󼬏 󼬐 󼬑 󼬒 󼬓
󼬔 󼬕 󼬖 󼬗 󼬘 󼬙 󼬚 󼬛 󼬜 󼬝
󼬞 󼬟 󼬠 󼬡 󼬢 󼬣 󼬤 󼬥 󼬦 󼬧
󼬨 󼬩 󼬪 󼬫 󼬬 󼬭 󼬮 󼬯
󼬰 󼬱 󼬲 󼬳 󼬴 󼬵 󼬶 󼬷 󼬸 󼬹
󼬺 󼬻 󼬼 󼬽 󼬾 󼬿 󼭀 󼭁 󼭂 󼭃
󼭄 󼭅 󼭆 󼭇 󼭈
󼭉 󼭊 󼭋 󼭌 󼭍 󼭎 󼭏 󼭐 󼭑 󼭒
󼭓 󼭔 󼭕 󼭖 󼭗 󼭘 󼭙 󼭚 󼭛 󼭜
󼭝 󼭞 󼭟 󼭠 󼭡 󼭢 󼭣 󼭤 󼭥
󼭦 󼭧 󼭨 󼭩 󼭪 󼭫
󼭰 󼭱 󼭲 󼭳 󼭴 󼭵 󼭶 󼭷 󼭸 󼭹
`;

const extraEmojiSymbolsExtra = Array.from(extraEmojiSymbolsExtraRaw).filter(
  (ch) => !/\s/.test(ch)
);

// Additional emoji-like symbols requested (treated as emojis)
const extraEmojiSymbolsExtra2Raw = `
󿀀 󿀁 󿀂 󿀃 󿀄 󿀅 󿁱 󿁲 󿁳 󿁴 󿁵 󿁶 󿁷 󿁸 󿁹 󿁺 󿁻 󿁼 󿁽 󿁾 󿁿 󿀆􀈀 􀈁 􀈂 􀈃 􀈄 􀈅 􀈆 􀈇 􀈈 􀈉 􀈊 􀈋 􀈌 􀈍 􀈎 􀈏
􀈐 􀈑 􀈒 􀈓 􀈔 􀈕 􀈖 􀈗 􀈘 􀈙 􀈚 􀈛 􀈜 􀈝 􀈞 􀈟
􀈠 􀈡 􀈢 􀈣 􀈤 􀈥 􀈦 􀈧 􀈨 􀈩 􀈪 􀈫 􀈬 􀈭 􀈮 􀈯
􀈰 􀈱 􀈲 􀈳 􀈴 􀈵 􀈑􀈾 􀈑􀈿
􀈑􀉀 􀈑􀉁 􀈑􀉂 􀈑􀉃 􀈑􀉄 􀈑􀉅 􀈑􀉆 􀈑􀉇 􀈑􀉈 􀈑􀉉 􀈑􀉊 􀈑􀉋 􀈑􀉌 􀈑􀉍 􀈑􀉎 􀈑􀉏
􀈑􀉐 􀈑􀉑 􀈑􀉒 􀈑􀉓 􀈑􀉔 􀈑􀉕 􀈑􀉖 􀈑􀉗 􀈑􀉘 􀈑􀉙 􀈑􀉚 􀈑􀉛 􀈑􀉜 􀈑􀉝 􀈑􀉞 􀈑􀉟
􀈑􀉠 􀈑􀉡 􀈑􀉢 􀈑􀉣 􀈑􀉤 􀈑􀉥 􀈑􀉦 􀈑􀉧 􀈑􀉨 􀈑􀉩 􀈑􀉪 􀈑􀉫 􀈑􀉬 􀈑􀉭 􀈑􀉮 􀈑􀉯

􀈑􀊐 􀈑􀊑 􀈑􀊒 􀈑􀊓 􀈑􀊔 􀈑􀊕 􀈑􀊖 􀈑􀊗 􀈑􀊘 􀈑􀊙 􀈑􀊚 􀈑􀊛 􀈑􀊜 􀈑􀊝 􀈑􀊞 􀈑􀊟
􀈑􀊠 􀈑􀊡 􀈑􀊢 􀈑􀊣 􀈑􀊤 􀈑􀊥 􀈑􀊦 􀈑􀊧 􀈑􀊨 􀈑􀊩 􀈑􀊪 􀈑􀊫 􀈑􀊬 􀈑􀊭 􀈑􀊮 􀈑􀊯
􀈑􀊰 􀈑􀊱 􀈑􀊲 􀈑􀊳 􀈑􀊴 􀈑􀊵 􀈑􀊶 􀈑􀊷 􀈑􀊸 􀈑􀊹 􀈑􀊺 􀈑􀊻 􀈑􀊼 􀈑􀊽 􀈑􀊾 􀈑􀊿
􀈑􀋀 􀈑􀋁 􀈑􀋂 􀈑􀋃 􀈑􀋄 􀈑􀋅 􀈑􀋆 􀈑􀋇 􀈑􀋈 􀈑􀋉 􀈑􀋊 􀈑􀋋 􀈑􀋌
􀈑􀋐 􀈑􀋑 􀈑􀋒 􀈑􀋓 􀈑􀋔 􀈑􀋕 􀈑􀋖 􀈑􀋗 􀈑􀋘 􀈑􀋙 􀈑􀋚 􀈑􀋛 􀈑􀋜 􀈑􀋝 􀈑􀋞 􀈑􀋟
􀈑􀋠 􀈑􀋡 􀈑􀋢 􀈑􀋣 􀈑􀋤 􀈑􀋥 􀈑􀋦 􀈑􀋧 􀈑􀋨 􀈑􀋩 􀈑􀋪 􀈑􀋫 􀈑􀋬 􀈑􀋭 􀈑􀋮 􀈑􀋯
􀈑􀋰 􀈑􀋱

􀈑􀌀 􀈑􀌁 􀈑􀌂 􀈑􀌃 􀈑􀌄 􀈑􀌅 􀈑􀌆 􀈑􀌇 􀈑􀌈 􀈑􀌉 􀈑􀌊 􀈑􀌋 􀈑􀌌 􀈑􀌍 􀈑􀌎 􀈑􀌏
􀈑􀌐 􀈑􀌑 􀈑􀌒 􀈑􀌓 􀈑􀌔 􀈑􀌕 􀈑􀌖 􀈑􀌗 􀈑􀌘 􀈑􀌙 􀈑􀌚 􀈑􀌛 􀈑􀌜 􀈑􀌝 􀈑􀌞 􀈑􀌟
􀈑􀌠 􀈑􀌡 􀈑􀌢 􀈑􀌣 􀈑􀌤 􀈑􀌥 􀈑􀌦 􀈑􀌧 􀈑􀌨 􀈑􀌩 􀈑􀌪 􀈑􀌫 􀈑􀌬 􀈑􀌭 􀈑􀌮 􀈑􀌯
􀈑􀌰 􀈑􀌱 􀈑􀌲 􀈑􀌳 􀈑􀌴

􀈑􀍀 􀈑􀍁 􀈑􀍂 􀈑􀍃 􀈑􀍄 􀈑􀍅 􀈑􀍆 􀈑􀍇 􀈑􀍈 􀈑􀍉 􀈑􀍊 􀈑􀍋 􀈑􀍌 􀈑􀍍
􀈑􀍔 􀈑􀍕 􀈑􀍖
􀈑􀍮 􀈑􀍯
􀈑􀍱 􀈑􀍲 􀈑􀍳 􀈑􀍴 􀈑􀍵

􀈑􀎖 􀈑􀎞
􀈑􀎠

􀈑􀏎 􀈑􀏏
􀈑􀏐 􀈑􀏑 􀈑􀏒 􀈑􀏓 􀈑􀏔 􀈑􀏕 􀈑􀏖 􀈑􀏗 􀈑􀏘 􀈑􀏙 􀈑􀏚 􀈑􀏛 􀈑􀏜 􀈑􀏝 􀈑􀏞

􀈑􀏰
􀈑􀏱
􀈑􀏲
􀈑􀏳
􀈑􀏴
􀈑􀏵
􀈑􀏶
􀈑􀏷
􀈑􀏸
􀈑􀏹
􀈑􀏺
􀈑􀏻
􀈑􀏼
􀈑􀏽
􀈑􀏾
􀈑􀏿

􀈑􀐀
􀈑􀐁
􀈑􀐂
􀈑􀐃
􀈑􀐄
􀈑􀐅
􀈑􀐆
􀈑􀐇
􀈑􀐈
􀈑􀐉
􀈑􀐊
􀈑􀐋
􀈑􀐌
􀈑􀐍
􀈑􀐎
􀈑􀐏

􀈑􀐐
􀈑􀐑
􀈑􀐒
􀈑􀐓
􀈑􀐔
􀈑􀐕
􀈑􀐖
􀈑􀐗
􀈑􀐘
􀈑􀐙
􀈑􀐚
􀈑􀐛
􀈑􀐜
􀈑􀐝
􀈑􀐞
􀈑􀐟

􀈑􀐠
􀈑􀐡
􀈑􀐢
􀈑􀐣
􀈑􀐤
􀈑􀐥
􀈑􀐦
􀈑􀐧
􀈑􀐨
􀈑􀐩
􀈑􀐪
􀈑􀐫
􀈑􀐬
􀈑􀐭
􀈑􀐮
􀈑􀐯

􀈑􀐰
􀈑􀐱
􀈑􀐲
􀈑􀐳
􀈑􀐴
􀈑􀐵
􀈑􀐶
􀈑􀐷
􀈑􀐸
􀈑􀐹
􀈑􀐺
􀈑􀐻
􀈑􀐼
􀈑􀐽
􀈑􀐾
􀈑􀐿

􀈑􀑀
􀈑􀑁
􀈑􀑂
􀈑􀑃
􀈑􀑄
􀈑􀑅
􀈑􀑆
􀈑􀑇
􀈑􀑈
􀈑􀑉
􀈑􀑊
􀈑􀑋
􀈑􀑌
􀈑􀑍
􀈑􀑎
􀈑􀑏

􀈑􀑐
􀈑􀑑
􀈑􀑒
􀈑􀑓
􀈑􀑔
􀈑􀑕

􀈑􀓞
􀈑􀓟
􀈑􀓠
􀈑􀓡
􀈑􀓢
􀈑􀓣
􀈑􀓤
􀈑􀓥
􀈑􀓦
􀈑􀓧
􀈑􀓨
􀈑􀓩
􀈑􀓪
􀈑􀓫
􀈑􀓬
􀈑􀓭
`;
const extraEmojiSymbolsExtra2 = Array.from(extraEmojiSymbolsExtra2Raw).filter(
  (ch) => !/\s/.test(ch)
);

 // Additional symbol-like characters requested by the user
const extraSymbolEmojisRaw = `
󿅐 󿅑 󿅒 󿅓 󿅔 󿅕 󿅖 󿅗 󿅘 󿅙 󿅚 󿅛 󿅜 󿅝 󿅞 󰦀 󰦁 󰦂 󰦃 󰦄 󰦅 󰦆 󰦇 󰦈 󰦉 󰦊 󰦋 󰦌 󰦍 󰦎 󰦑 󰦒 󰦓 󰦔 󰦕 󰦖 󰦗 󰦘 󰦙 󰦚 󰦛 󰦜 󰦝 󰦞 󰦠 󰦡 󰦢 󰦣 󰦤 󰦥 󰦦 󰦧 󰦨 󰥰 󰥱 󰥲 󰥳 󰥴 󰥵 󰥶 󰥷 󰥸 󰥹 󰥺 󰥻 󰥼 󰥽 󰥾 󰥬 󰥭 󰥮
`;
const extraSymbolEmojis = Array.from(extraSymbolEmojisRaw).filter(
  (ch) => !/\s/.test(ch)
);

// Extra smiley emojis requested
const extraSmileyEmojisRaw = `
󾍠 󾍣 󾍦 󾍧
`;
const extraSmileyEmojis = Array.from(extraSmileyEmojisRaw).filter(
  (ch) => !/\s/.test(ch)
);

// Extra icon-like emojis requested
const extraIconEmojisRaw = `
󿃠 󿃡 󿃢 󿃣 󿃤 󿃥 󿃦 󿃧 󿃨 󿃩 󿃪
`;
const extraIconEmojis = Array.from(extraIconEmojisRaw).filter(
  (ch) => !/\s/.test(ch)
);

 // Base (non skin‑tone) people/gesture emojis explicitly listed by the user
const extraBaseEmojisRaw = `
👋 🤚 🖐 ✋ 🖖 👌 🤌 🤏 ✌ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝ 🫵 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🫱 🫲 🤝 🫳 🫴 🫸 🫷 🙏 🫰 🫶 ✍ 💅 🤳 💪 🦵 🦶 👂 🦻 👃 👶 🧒 👦 👧 🧑 👱 👨 🧔 🧔‍♀️ 🧔‍♂️ 👨‍🦰 👨‍🦱 👨‍🦳 👨‍🦲 👩 👩‍🦰 🧑‍🦰 👩‍🦱 🧑‍🦱 👩‍🦳 🧑‍🦳 👩‍🦲 🧑‍🦲 👱‍♀️ 👱‍♂️ 🧓 👴 👵 🙍 🙍‍♂️ 🙍‍♀️ 🙎 🙎‍♂️ 🙎‍♀️ 🙅 🙅‍♂️ 🙅‍♀️ 🙆 🙆‍♂️ 🙆‍♀️ 💁 💁‍♂️ 💁‍♀️ 🙋 🙋‍♂️ 🙋‍♀️ 🧏 🧏‍♂️ 🧏‍♀️ 🙇 🙇‍♂️ 🙇‍♀️ 🤦 🤦‍♂️ 🤦‍♀️ 🤷 🤷‍♂️ 🤷‍♀️ 🧑‍⚕️ 👨‍⚕️ 👩‍⚕️ 🧑‍🎓 👨‍🎓 👩‍🎓 🧑‍🏫 👨‍🏫 👩‍🏫 🧑‍⚖️ 👨‍⚖️ 👩‍⚖️ 🧑‍🌾 👨‍🌾 👩‍🌾 🧑‍🍳 👨‍🍳 👩‍🍳 🧑‍🔧 👨‍🔧 👩‍🔧 🧑‍🏭 👨‍🏭 👩‍🏭 🧑‍💼 👨‍💼 👩‍💼 🧑‍🔬 👨‍🔬 👩‍🔬 🧑‍💻 👨‍💻 👩‍💻 🧑‍🎤 👨‍🎤 👩‍🎤 🧑‍🎨 👨‍🎨 👩‍🎨 🧑‍✈️ 👨‍✈️ 👩‍✈️ 🧑‍🚀 👨‍🚀 👩‍🚀 🧑‍🚒 👨‍🚒 👩‍🚒 👮 👮‍♂️ 👮‍♀️ 🕵 🕵‍♂️ 🕵‍♀️ 💂 💂‍♂️ 💂‍♀️ 🥷 👷 👷‍♂️ 👷‍♀️ 🫅 🤴 👸 👳 👳‍♂️ 👳‍♀️ 👲 🧕 🤵 🤵‍♂️ 🤵‍♀️ 👰 👰‍♂️ 👰‍♀️ 🫄 🫃 🤰 🧑‍🍼 👨‍🍼 👩‍🍼 🤱 👼 🎅 🤶 🧑‍🎄 🦸 🦸‍♂️ 🦸‍♀️ 🦹 🦹‍♂️ 🦹‍♀️ 🧙 🧙‍♂️ 🧙‍♀️ 🧚 🧚‍♂️ 🧚‍♀️ 🧛 🧛‍♂️ 🧛‍♀️ 🧜 🧜‍♂️ 🧜‍♀️ 🧝 🧝‍♂️ 🧝‍♀️ 💆 💆‍♂️ 💆‍♀️ 💇 💇‍♂️ 💇‍♀️ 🚶 🚶‍♂️ 🚶‍♀️ 🧍 🧍‍♂️ 🧍‍♀️ 🧎 🧎‍♂️ 🧎‍♀️ 🧑‍🦯 👨‍🦯 👩‍🦯 🧑‍🦼 👨‍🦼 👩‍🦼 🧑‍🦽 👨‍🦽 👩‍🦽 🏃 🏃‍♂️ 🏃‍♀️ 🚶‍➡️ 🚶‍♀️‍➡️ 🚶‍♂️‍➡️ 🧎‍➡️ 🧎‍♀️‍➡️ 🧎‍♂️‍➡️ 🧑‍🦯‍➡️ 👨‍🦯‍➡️ 👩‍🦯‍➡️ 🧑‍🦼‍➡️ 👨‍🦼‍➡️ 👩‍🦼‍➡️ 🧑‍🦽‍➡️ 👨‍🦽‍➡️ 👩‍🦽‍➡️ 🏃‍➡️ 🏃‍♀️‍➡️ 🏃‍♂️‍➡️ 💃 🕺 🕴 🧖 🧖‍♂️ 🧖‍♀️ 🧗 🧗‍♂️ 🧗‍♀️ 🏇 🏂 🏌 🏌‍♂️ 🏌‍♀️ 🏄 🏄‍♂️ 🏄‍♀️ 🚣 🚣‍♂️ 🚣‍♀️ 🏊 🏊‍♂️ 🏊‍♀️ ⛹ ⛹‍♂️ ⛹‍♀️ 🏋 🏋‍♂️ 🏋‍♀️ 🚴 🚴‍♂️ 🚴‍♀️ 🚵 🚵‍♂️ 🚵‍♀️ 🤸 🤸‍♂️ 🤸‍♀️ 🤽 🤽‍♂️ 🤽‍♀️ 🤾 🤾‍♂️ 🤾‍♀️ 🤹 🤹‍♂️ 🤹‍♀️ 🧘 🧘‍♂️ 🧘‍♀️ 🛀 🛌 💑 💏 👫 👭 👬 👪
`;

// Explicit skin‑tone emojis (all listed by the user), kept as full emoji sequences
const extraSkinToneEmojisRaw = `
👋🏻 🤚🏻 🖐🏻 ✋🏻 🖖🏻 👌🏻 🤌🏻 🤏🏻 ✌🏻 🤞🏻 🤟🏻 🤘🏻 🤙🏻 👈🏻 👉🏻 👆🏻 🖕🏻 👇🏻 ☝🏻 🫵🏻 👍🏻 👎🏻 ✊🏻 👊🏻 🤛🏻 🤜🏻 👏🏻 🙌🏻 👐🏻 🤲🏻 🫱🏻 🫲🏻 🤝🏻 🫳🏻 🫴🏻 🫸🏻 🫷🏻 🙏🏻 🫰🏻 🫶🏻 ✍🏻 💅🏻 🤳🏻 💪🏻 🦵🏻 🦶🏻 👂🏻 🦻🏻 👃🏻 👶🏻 🧒🏻 👦🏻 👧🏻 🧑🏻 👱🏻 👨🏻 🧔🏻 🧔🏻‍♀️ 🧔🏻‍♂️ 👨🏻‍🦰 👨🏻‍🦱 👨🏻‍🦳 👨🏻‍🦲 👩🏻 👩🏻‍🦰 🧑🏻‍🦰 👩🏻‍🦱 🧑🏻‍🦱 👩🏻‍🦳 🧑🏻‍🦳 👩🏻‍🦲 🧑🏻‍🦲 👱🏻‍♀️ 👱🏻‍♂️ 🧓🏻 👴🏻 👵🏻 🙍🏻 🙍🏻‍♂️ 🙍🏻‍♀️ 🙎🏻 🙎🏻‍♂️ 🙎🏻‍♀️ 🙅🏻 🙅🏻‍♂️ 🙅🏻‍♀️ 🙆🏻 🙆🏻‍♂️ 🙆🏻‍♀️ 💁🏻 💁🏻‍♂️ 💁🏻‍♀️ 🙋🏻 🙋🏻‍♂️ 🙋🏻‍♀️ 🧏🏻 🧏🏻‍♂️ 🧏🏻‍♀️ 🙇🏻 🙇🏻‍♂️ 🙇🏻‍♀️ 🤦🏻 🤦🏻‍♂️ 🤦🏻‍♀️ 🤷🏻 🤷🏻‍♂️ 🤷🏻‍♀️ 🧑🏻‍⚕️ 👨🏻‍⚕️ 👩🏻‍⚕️ 🧑🏻‍🎓 👨🏻‍🎓 👩🏻‍🎓 🧑🏻‍🏫 👨🏻‍🏫 👩🏻‍🏫 🧑🏻‍⚖️ 👨🏻‍⚖️ 👩🏻‍⚖️ 🧑🏻‍🌾 👨🏻‍🌾 👩🏻‍🌾 🧑🏻‍🍳 👨🏻‍🍳 👩🏻‍🍳 🧑🏻‍🔧 👨🏻‍🔧 👩🏻‍🔧 🧑🏻‍🏭 👨🏻‍🏭 👩🏻‍🏭 🧑🏻‍💼 👨🏻‍💼 👩🏻‍💼 🧑🏻‍🔬 👨🏻‍🔬 👩🏻‍🔬 🧑🏻‍💻 👨🏻‍💻 👩🏻‍💻 🧑🏻‍🎤 👨🏻‍🎤 👩🏻‍🎤 🧑🏻‍🎨 👨🏻‍🎨 👩🏻‍🎨 🧑🏻‍✈️ 👨🏻‍✈️ 👩🏻‍✈️ 🧑🏻‍🚀 👨🏻‍🚀 👩🏻‍🚀 🧑🏻‍🚒 👨🏻‍🚒 👩🏻‍🚒 👮🏻 👮🏻‍♂️ 👮🏻‍♀️ 🕵🏻 🕵🏻‍♂️ 🕵🏻‍♀️ 💂🏻 💂🏻‍♂️ 💂🏻‍♀️ 🥷🏻 👷🏻 👷🏻‍♂️ 👷🏻‍♀️ 🫅🏻 🤴🏻 👸🏻 👳🏻 👳🏻‍♂️ 👳🏻‍♀️ 👲🏻 🧕🏻 🤵🏻 🤵🏻‍♂️ 🤵🏻‍♀️ 👰🏻 👰🏻‍♂️ 👰🏻‍♀️ 🫄🏻 🫃🏻 🤰🏻 🧑🏻‍🍼 👨🏻‍🍼 👩🏻‍🍼 🤱🏻 👼🏻 🎅🏻 🤶🏻 🧑🏻‍🎄 🦸🏻 🦸🏻‍♂️ 🦸🏻‍♀️ 🦹🏻 🦹🏻‍♂️ 🦹🏻‍♀️ 🧙🏻 🧙🏻‍♂️ 🧙🏻‍♀️ 🧚🏻 🧚🏻‍♂️ 🧚🏻‍♀️ 🧛🏻 🧛🏻‍♂️ 🧛🏻‍♀️ 🧜🏻 🧜🏻‍♂️ 🧜🏻‍♀️ 🧝🏻 🧝🏻‍♂️ 🧝🏻‍♀️ 💆🏻 💆🏻‍♂️ 💆🏻‍♀️ 💇🏻 💇🏻‍♂️ 💇🏻‍♀️ 🚶🏻 🚶🏻‍♂️ 🚶🏻‍♀️ 🧍🏻 🧍🏻‍♂️ 🧍🏻‍♀️ 🧎🏻 🧎🏻‍♂️ 🧎🏻‍♀️ 🧑🏻‍🦯 👨🏻‍🦯 👩🏻‍🦯 🧑🏻‍🦼 👨🏻‍🦼 👩🏻‍🦼 🧑🏻‍🦽 👨🏻‍🦽 👩🏻‍🦽 🏃🏻 🏃🏻‍♂️ 🏃🏻‍♀️ 🚶🏻‍➡️ 🚶🏻‍♀️‍➡️ 🚶🏻‍♂️‍➡️ 🧎🏻‍➡️ 🧎🏻‍♀️‍➡️ 🧎🏻‍♂️‍➡️ 🧑🏻‍🦯‍➡️ 👨🏻‍🦯‍➡️ 👩🏻‍🦯‍➡️ 🧑🏻‍🦼‍➡️ 👨🏻‍🦼‍➡️ 👩🏻‍🦼‍➡️ 🧑🏻‍🦽‍➡️ 👨🏻‍🦽‍➡️ 👩🏻‍🦽‍➡️ 🏃🏻‍➡️ 🏃🏻‍♀️‍➡️ 🏃🏻‍♂️‍➡️ 💃🏻 🕺🏻 🕴🏻 🧖🏻 🧖🏻‍♂️ 🧖🏻‍♀️ 🧗🏻 🧗🏻‍♂️ 🧗🏻‍♀️ 🏇🏻 🏂🏻 🏌🏻 🏌🏻‍♂️ 🏌🏻‍♀️ 🏄🏻 🏄🏻‍♂️ 🏄🏻‍♀️ 🚣🏻 🚣🏻‍♂️ 🚣🏻‍♀️ 🏊🏻 🏊🏻‍♂️ 🏊🏻‍♀️ ⛹🏻 ⛹🏻‍♂️ ⛹🏻‍♀️ 🏋🏻 🏋🏻‍♂️ 🏋🏻‍♀️ 🚴🏻 🚴🏻‍♂️ 🚴🏻‍♀️ 🚵🏻 🚵🏻‍♂️ 🚵🏻‍♀️ 🤸🏻 🤸🏻‍♂️ 🤸🏻‍♀️ 🤽🏻 🤽🏻‍♂️ 🤽🏻‍♀️ 🤾🏻 🤾🏻‍♂️ 🤾🏻‍♀️ 🤹🏻 🤹🏻‍♂️ 🤹🏻‍♀️ 🧘🏻 🧘🏻‍♂️ 🧘🏻‍♀️ 🛀🏻 🛌🏻 💑🏻 💏🏻 👫🏻 👭🏻 👬🏻
👋🏼 🤚🏼 🖐🏼 ✋🏼 🖖🏼 👌🏼 🤌🏼 🤏🏼 ✌🏼 🤞🏼 🤟🏼 🤘🏼 🤙🏼 👈🏼 👉🏼 👆🏼 🖕🏼 👇🏼 ☝🏼 🫵🏼 👍🏼 👎🏼 ✊🏼 👊🏼 🤛🏼 🤜🏼 👏🏼 🙌🏼 👐🏼 🤲🏼 🫱🏼 🫲🏼 🤝🏼 🫳🏼 🫴🏼 🫸🏼 🫷🏼 🙏🏼 🫰🏼 🫶🏼 ✍🏼 💅🏼 🤳🏼 💪🏼 🦵🏼 🦶🏼 👂🏼 🦻🏼 👃🏼 👶🏼 🧒🏼 👦🏼 👧🏼 🧑🏼 👱🏼 👨🏼 🧔🏼 🧔🏼‍♀️ 🧔🏼‍♂️ 👨🏼‍🦰 👨🏼‍🦱 👨🏼‍🦳 👨🏼‍🦲 👩🏼 👩🏼‍🦰 🧑🏼‍🦰 👩🏼‍🦱 🧑🏼‍🦱 👩🏼‍🦳 🧑🏼‍🦳 👩🏼‍🦲 🧑🏼‍🦲 👱🏼‍♀️ 👱🏼‍♂️ 🧓🏼 👴🏼 👵🏼 🙍🏼 🙍🏼‍♂️ 🙍🏼‍♀️ 🙎🏼 🙎🏼‍♂️ 🙎🏼‍♀️ 🙅🏼 🙅🏼‍♂️ 🙅🏼‍♀️ 🙆🏼 🙆🏼‍♂️ 🙆🏼‍♀️ 💁🏼 💁🏼‍♂️ 💁🏼‍♀️ 🙋🏼 🙋🏼‍♂️ 🙋🏼‍♀️ 🧏🏼 🧏🏼‍♂️ 🧏🏼‍♀️ 🙇🏼 🙇🏼‍♂️ 🙇🏼‍♀️ 🤦🏼 🤦🏼‍♂️ 🤦🏼‍♀️ 🤷🏼 🤷🏼‍♂️ 🤷🏼‍♀️ 🧑🏼‍⚕️ 👨🏼‍⚕️ 👩🏼‍⚕️ 🧑🏼‍🎓 👨🏼‍🎓 👩🏼‍🎓 🧑🏼‍🏫 👨🏼‍🏫 👩🏼‍🏫 🧑🏼‍⚖️ 👨🏼‍⚖️ 👩🏼‍⚖️ 🧑🏼‍🌾 👨🏼‍🌾 👩🏼‍🌾 🧑🏼‍🍳 👨🏼‍🍳 👩🏼‍🍳 🧑🏼‍🔧 👨🏼‍🔧 👩🏼‍🔧 🧑🏼‍🏭 👨🏼‍🏭 👩🏼‍🏭 🧑🏼‍💼 👨🏼‍💼 👩🏼‍💼 🧑🏼‍🔬 👨🏼‍🔬 👩🏼‍🔬 🧑🏼‍💻 👨🏼‍💻 👩🏼‍💻 🧑🏼‍🎤 👨🏼‍🎤 👩🏼‍🎤 🧑🏼‍🎨 👨🏼‍🎨 👩🏼‍🎨 🧑🏼‍✈️ 👨🏼‍✈️ 👩🏼‍✈️ 🧑🏼‍🚀 👨🏼‍🚀 👩🏼‍🚀 🧑🏼‍🚒 👨🏼‍🚒 👩🏼‍🚒 👮🏼 👮🏼‍♂️ 👮🏼‍♀️ 🕵🏼 🕵🏼‍♂️ 🕵🏼‍♀️ 💂🏼 💂🏼‍♂️ 💂🏼‍♀️ 🥷🏼 👷🏼 👷🏼‍♂️ 👷🏼‍♀️ 🫅🏼 🤴🏼 👸🏼 👳🏼 👳🏼‍♂️ 👳🏼‍♀️ 👲🏼 🧕🏼 🤵🏼 🤵🏼‍♂️ 🤵🏼‍♀️ 👰🏼 👰🏼‍♂️ 👰🏼‍♀️ 🫄🏼 🫃🏼 🤰🏼 🧑🏼‍🍼 👨🏼‍🍼 👩🏼‍🍼 🤱🏼 👼🏼 🎅🏼 🤶🏼 🧑🏼‍🎄 🦸🏼 🦸🏼‍♂️ 🦸🏼‍♀️ 🦹🏼 🦹🏼‍♂️ 🦹🏼‍♀️ 🧙🏼 🧙🏼‍♂️ 🧙🏼‍♀️ 🧚🏼 🧚🏼‍♂️ 🧚🏼‍♀️ 🧛🏼 🧛🏼‍♂️ 🧛🏼‍♀️ 🧜🏼 🧜🏼‍♂️ 🧜🏼‍♀️ 🧝🏼 🧝🏼‍♂️ 🧝🏼‍♀️ 💆🏼 💆🏼‍♂️ 💆🏼‍♀️ 💇🏼 💇🏼‍♂️ 💇🏼‍♀️ 🚶🏼 🚶🏼‍♂️ 🚶🏼‍♀️ 🧍🏼 🧍🏼‍♂️ 🧍🏼‍♀️ 🧎🏼 🧎🏼‍♂️ 🧎🏼‍♀️ 🧑🏼‍🦯 👨🏼‍🦯 👩🏼‍🦯 🧑🏼‍🦼 👨🏼‍🦼 👩🏼‍🦼 🧑🏼‍🦽 👨🏼‍🦽 👩🏼‍🦽 🏃🏼 🏃🏼‍♂️ 🏃🏼‍♀️ 🚶🏼‍➡️ 🚶🏼‍♀️‍➡️ 🚶🏼‍♂️‍➡️ 🧎🏼‍➡️ 🧎🏼‍♀️‍➡️ 🧎🏼‍♂️‍➡️ 🧑🏼‍🦯‍➡️ 👨🏼‍🦯‍➡️ 👩🏼‍🦯‍➡️ 🧑🏼‍🦼‍➡️ 👨🏼‍🦼‍➡️ 👩🏼‍🦼‍➡️ 🧑🏼‍🦽‍➡️ 👨🏼‍🦽‍➡️ 👩🏼‍🦽‍➡️ 🏃🏼‍➡️ 🏃🏼‍♀️‍➡️ 🏃🏼‍♂️‍➡️ 💃🏼 🕺🏼 🕴🏼 🧖🏼 🧖🏼‍♂️ 🧖🏼‍♀️ 🧗🏼 🧗🏼‍♂️ 🧗🏼‍♀️ 🏇🏼 🏂🏼 🏌🏼 🏌🏼‍♂️ 🏌🏼‍♀️ 🏄🏼 🏄🏼‍♂️ 🏄🏼‍♀️ 🚣🏼 🚣🏼‍♂️ 🚣🏼‍♀️ 🏊🏼 🏊🏼‍♂️ 🏊🏼‍♀️ ⛹🏼 ⛹🏼‍♂️ ⛹🏼‍♀️ 🏋🏼 🏋🏼‍♂️ 🏋🏼‍♀️ 🚴🏼 🚴🏼‍♂️ 🚴🏼‍♀️ 🚵🏼 🚵🏼‍♂️ 🚵🏼‍♀️ 🤸🏼 🤸🏼‍♂️ 🤸🏼‍♀️ 🤽🏼 🤽🏼‍♂️ 🤽🏼‍♀️ 🤾🏼 🤾🏼‍♂️ 🤾🏼‍♀️ 🤹🏼 🤹🏼‍♂️ 🤹🏼‍♀️ 🧘🏼 🧘🏼‍♂️ 🧘🏼‍♀️ 🛀🏼 🛌🏼 💑🏼 💏🏼 👫🏼 👭🏼 👬🏼
👋🏽 🤚🏽 🖐🏽 ✋🏽 🖖🏽 👌🏽 🤌🏽 🤏🏽 ✌🏽 🤞🏽 🤟🏽 🤘🏽 🤙🏽 👈🏽 👉🏽 👆🏽 🖕🏽 👇🏽 ☝🏽 🫵🏽 👍🏽 👎🏽 ✊🏽 👊🏽 🤛🏽 🤜🏽 👏🏽 🙌🏽 👐🏽 🤲🏽 🫱🏽 🫲🏽 🤝🏽 🫳🏽 🫴🏽 🫸🏽 🫷🏽 🙏🏽 🫰🏽 🫶🏽 ✍🏽 💅🏽 🤳🏽 💪🏽 🦵🏽 🦶🏽 👂🏽 🦻🏽 👃🏽 👶🏽 🧒🏽 👦🏽 👧🏽 🧑🏽 👱🏽 👨🏽 🧔🏽 🧔🏽‍♀️ 🧔🏽‍♂️ 👨🏽‍🦰 👨🏽‍🦱 👨🏽‍🦳 👨🏽‍🦲 👩🏽 👩🏽‍🦰 🧑🏽‍🦰 👩🏽‍🦱 🧑🏽‍🦱 👩🏽‍🦳 🧑🏽‍🦳 👩🏽‍🦲 🧑🏽‍🦲 👱🏽‍♀️ 👱🏽‍♂️ 🧓🏽 👴🏽 👵🏽 🙍🏽 🙍🏽‍♂️ 🙍🏽‍♀️ 🙎🏽 🙎🏽‍♂️ 🙎🏽‍♀️ 🙅🏽 🙅🏽‍♂️ 🙅🏽‍♀️ 🙆🏽 🙆🏽‍♂️ 🙆🏽‍♀️ 💁🏽 💁🏽‍♂️ 💁🏽‍♀️ 🙋🏽 🙋🏽‍♂️ 🙋🏽‍♀️ 🧏🏽 🧏🏽‍♂️ 🧏🏽‍♀️ 🙇🏽 🙇🏽‍♂️ 🙇🏽‍♀️ 🤦🏽 🤦🏽‍♂️ 🤦🏽‍♀️ 🤷🏽 🤷🏽‍♂️ 🤷🏽‍♀️ 🧑🏽‍⚕️ 👨🏽‍⚕️ 👩🏽‍⚕️ 🧑🏽‍🎓 👨🏽‍🎓 👩🏽‍🎓 🧑🏽‍🏫 👨🏽‍🏫 👩🏽‍🏫 🧑🏽‍⚖️ 👨🏽‍⚖️ 👩🏽‍⚖️ 🧑🏽‍🌾 👨🏽‍🌾 👩🏽‍🌾 🧑🏽‍🍳 👨🏽‍🍳 👩🏽‍🍳 🧑🏽‍🔧 👨🏽‍🔧 👩🏽‍🔧 🧑🏽‍🏭 👨🏽‍🏭 👩🏽‍🏭 🧑🏽‍💼 👨🏽‍💼 👩🏽‍💼 🧑🏽‍🔬 👨🏽‍🔬 👩🏽‍🔬 🧑🏽‍💻 👨🏽‍💻 👩🏽‍💻 🧑🏽‍🎤 👨🏽‍🎤 👩🏽‍🎤 🧑🏽‍🎨 👨🏽‍🎨 👩🏽‍🎨 🧑🏽‍✈️ 👨🏽‍✈️ 👩🏽‍✈️ 🧑🏽‍🚀 👨🏽‍🚀 👩🏽‍🚀 🧑🏽‍🚒 👨🏽‍🚒 👩🏽‍🚒 👮🏽 👮🏽‍♂️ 👮🏽‍♀️ 🕵🏽 🕵🏽‍♂️ 🕵🏽‍♀️ 💂🏽 💂🏽‍♂️ 💂🏽‍♀️ 🥷🏽 👷🏽 👷🏽‍♂️ 👷🏽‍♀️ 🫅🏽 🤴🏽 👸🏽 👳🏽 👳🏽‍♂️ 👳🏽‍♀️ 👲🏽 🧕🏽 🤵🏽 🤵🏽‍♂️ 🤵🏽‍♀️ 👰🏽 👰🏽‍♂️ 👰🏽‍♀️ 🫄🏽 🫃🏽 🤰🏽 🧑🏽‍🍼 👨🏽‍🍼 👩🏽‍🍼 🤱🏽 👼🏽 🎅🏽 🤶🏽 🧑🏽‍🎄 🦸🏽 🦸🏽‍♂️ 🦸🏽‍♀️ 🦹🏽 🦹🏽‍♂️ 🦹🏽‍♀️ 🧙🏽 🧙🏽‍♂️ 🧙🏽‍♀️ 🧚🏽 🧚🏽‍♂️ 🧚🏽‍♀️ 🧛🏽 🧛🏽‍♂️ 🧛🏽‍♀️ 🧜🏽 🧜🏽‍♂️ 🧜🏽‍♀️ 🧝🏽 🧝🏽‍♂️ 🧝🏽‍♀️ 💆🏽 💆🏽‍♂️ 💆🏽‍♀️ 💇🏽 💇🏽‍♂️ 💇🏽‍♀️ 🚶🏽 🚶🏽‍♂️ 🚶🏽‍♀️ 🧍🏽 🧍🏽‍♂️ 🧍🏽‍♀️ 🧎🏽 🧎🏽‍♂️ 🧎🏽‍♀️ 🧑🏽‍🦯 👨🏽‍🦯 👩🏽‍🦯 🧑🏽‍🦼 👨🏽‍🦼 👩🏽‍🦼 🧑🏽‍🦽 👨🏽‍🦽 👩🏽‍🦽 🏃🏽 🏃🏽‍♂️ 🏃🏽‍♀️ 🚶🏽‍➡️ 🚶🏽‍♀️‍➡️ 🚶🏽‍♂️‍➡️ 🧎🏽‍➡️ 🧎🏽‍♀️‍➡️ 🧎🏽‍♂️‍➡️ 🧑🏽‍🦯‍➡️ 👨🏽‍🦯‍➡️ 👩🏽‍🦯‍➡️ 🧑🏽‍🦼‍➡️ 👨🏽‍🦼‍➡️ 👩🏽‍🦼‍➡️ 🧑🏽‍🦽‍➡️ 👨🏽‍🦽‍➡️ 👩🏽‍🦽‍➡️ 🏃🏽‍➡️ 🏃🏽‍♀️‍➡️ 🏃🏽‍♂️‍➡️ 💃🏽 🕺🏽 🕴🏽 🧖🏽 🧖🏽‍♂️ 🧖🏽‍♀️ 🧗🏽 🧗🏽‍♂️ 🧗🏽‍♀️ 🏇🏽 🏂🏽 🏌🏽 🏌🏽‍♂️ 🏌🏽‍♀️ 🏄🏽 🏄🏽‍♂️ 🏄🏽‍♀️ 🚣🏽 🚣🏽‍♂️ 🚣🏽‍♀️ 🏊🏽 🏊🏽‍♂️ 🏊🏽‍♀️ ⛹🏽 ⛹🏽‍♂️ ⛹🏽‍♀️ 🏋🏽 🏋🏽‍♂️ 🏋🏽‍♀️ 🚴🏽 🚴🏽‍♂️ 🚴🏽‍♀️ 🚵🏽 🚵🏽‍♂️ 🚵🏽‍♀️ 🤸🏽 🤸🏽‍♂️ 🤸🏽‍♀️ 🤽🏽 🤽🏽‍♂️ 🤽🏽‍♀️ 🤾🏽 🤾🏽‍♂️ 🤾🏽‍♀️ 🤹🏽 🤹🏽‍♂️ 🤹🏽‍♀️ 🧘🏽 🧘🏽‍♂️ 🧘🏽‍♀️ 🛀🏽 🛌🏽 💑🏽 💏🏽 👫🏽 👭🏽 👬🏽
👋🏾 🤚🏾 🖐🏾 ✋🏾 🖖🏾 👌🏾 🤌🏾 🤏🏾 ✌🏾 🤞🏾 🤟🏾 🤘🏾 🤙🏾 👈🏾 👉🏾 👆🏾 🖕🏾 👇🏾 ☝🏾 🫵🏾 👍🏾 👎🏾 ✊🏾 👊🏾 🤛🏾 🤜🏾 👏🏾 🙌🏾 👐🏾 🤲🏾 🫱🏾 🫲🏾 🤝🏾 🫳🏾 🫴🏾 🫸🏾 🫷🏾 🙏🏾 🫰🏾 🫶🏾 ✍🏾 💅🏾 🤳🏾 💪🏾 🦵🏾 🦶🏾 👂🏾 🦻🏾 👃🏾 👶🏾 🧒🏾 👦🏾 👧🏾 🧑🏾 👱🏾 👨🏾 🧔🏾 🧔🏾‍♀️ 🧔🏾‍♂️ 👨🏾‍🦰 👨🏾‍🦱 👨🏾‍🦳 👨🏾‍🦲 👩🏾 👩🏾‍🦰 🧑🏾‍🦰 👩🏾‍🦱 🧑🏾‍🦱 👩🏾‍🦳 🧑🏾‍🦳 👩🏾‍🦲 🧑🏾‍🦲 👱🏾‍♀️ 👱🏾‍♂️ 🧓🏾 👴🏾 👵🏾 🙍🏾 🙍🏾‍♂️ 🙍🏾‍♀️ 🙎🏾 🙎🏾‍♂️ 🙎🏾‍♀️ 🙅🏾 🙅🏾‍♂️ 🙅🏾‍♀️ 🙆🏾 🙆🏾‍♂️ 🙆🏾‍♀️ 💁🏾 💁🏾‍♂️ 💁🏾‍♀️ 🙋🏾 🙋🏾‍♂️ 🙋🏾‍♀️ 🧏🏾 🧏🏾‍♂️ 🧏🏾‍♀️ 🙇🏾 🙇🏾‍♂️ 🙇🏾‍♀️ 🤦🏾 🤦🏾‍♂️ 🤦🏾‍♀️ 🤷🏾 🤷🏾‍♂️ 🤷🏾‍♀️ 🧑🏾‍⚕️ 👨🏾‍⚕️ 👩🏾‍⚕️ 🧑🏾‍🎓 👨🏾‍🎓 👩🏾‍🎓 🧑🏾‍🏫 👨🏾‍🏫 👩🏾‍🏫 🧑🏾‍⚖️ 👨🏾‍⚖️ 👩🏾‍⚖️ 🧑🏾‍🌾 👨🏾‍🌾 👩🏾‍🌾 🧑🏾‍🍳 👨🏾‍🍳 👩🏾‍🍳 🧑🏾‍🔧 👨🏾‍🔧 👩🏾‍🔧 🧑🏾‍🏭 👨🏾‍🏭 👩🏾‍🏭 🧑🏾‍💼 👨🏾‍💼 👩🏾‍💼 🧑🏾‍🔬 👨🏾‍🔬 👩🏾‍🔬 🧑🏾‍💻 👨🏾‍💻 👩🏾‍💻 🧑🏾‍🎤 👨🏾‍🎤 👩🏾‍🎤 🧑🏾‍🎨 👨🏾‍🎨 👩🏾‍🎨 🧑🏾‍✈️ 👨🏾‍✈️ 👩🏾‍✈️ 🧑🏾‍🚀 👨🏾‍🚀 👩🏾‍🚀 🧑🏾‍🚒 👨🏾‍🚒 👩🏾‍🚒 👮🏾 👮🏾‍♂️ 👮🏾‍♀️ 🕵🏾 🕵🏾‍♂️ 🕵🏾‍♀️ 💂🏾 💂🏾‍♂️ 💂🏾‍♀️ 🥷🏾 👷🏾 👷🏾‍♂️ 👷🏾‍♀️ 🫅🏾 🤴🏾 👸🏾 👳🏾 👳🏾‍♂️ 👳🏾‍♀️ 👲🏾 🧕🏾 🤵🏾 🤵🏾‍♂️ 🤵🏾‍♀️ 👰🏾 👰🏾‍♂️ 👰🏾‍♀️ 🫄🏾 🫃🏾 🤰🏾 🧑🏾‍🍼 👨🏾‍🍼 👩🏾‍🍼 🤱🏾 👼🏾 🎅🏾 🤶🏾 🧑🏾‍🎄 🦸🏾 🦸🏾‍♂️ 🦸🏾‍♀️ 🦹🏾 🦹🏾‍♂️ 🦹🏾‍♀️ 🧙🏾 🧙🏾‍♂️ 🧙🏾‍♀️ 🧚🏾 🧚🏾‍♂️ 🧚🏾‍♀️ 🧛🏾 🧛🏾‍♂️ 🧛🏾‍♀️ 🧜🏾 🧜🏾‍♂️ 🧜🏾‍♀️ 🧝🏾 🧝🏾‍♂️ 🧝🏾‍♀️ 💆🏾 💆🏾‍♂️ 💆🏾‍♀️ 💇🏾 💇🏾‍♂️ 💇🏾‍♀️ 🚶🏾 🚶🏾‍♂️ 🚶🏾‍♀️ 🧍🏾 🧍🏾‍♂️ 🧍🏾‍♀️ 🧎🏾 🧎🏾‍♂️ 🧎🏾‍♀️ 🧑🏾‍🦯 👨🏾‍🦯 👩🏾‍🦯 🧑🏾‍🦼 👨🏾‍🦼 👩🏾‍🦼 🧑🏾‍🦽 👨🏾‍🦽 👩🏾‍🦽 🏃🏾 🏃🏾‍♂️ 🏃🏾‍♀️ 🚶🏾‍➡️ 🚶🏾‍♀️‍➡️ 🚶🏾‍♂️‍➡️ 🧎🏾‍➡️ 🧎🏾‍♀️‍➡️ 🧎🏾‍♂️‍➡️ 🧑🏾‍🦯‍➡️ 👨🏾‍🦯‍➡️ 👩🏾‍🦯‍➡️ 🧑🏾‍🦼‍➡️ 👨🏾‍🦼‍➡️ 👩🏾‍🦼‍➡️ 🧑🏾‍🦽‍➡️ 👨🏾‍🦽‍➡️ 👩🏾‍🦽‍➡️ 🏃🏾‍➡️ 🏃🏾‍♀️‍➡️ 🏃🏾‍♂️‍➡️ 💃🏾 🕺🏾 🕴🏾 🧖🏾 🧖🏾‍♂️ 🧖🏾‍♀️ 🧗🏾 🧗🏾‍♂️ 🧗🏾‍♀️ 🏇🏾 🏂🏾 🏌🏾 🏌🏾‍♂️ 🏌🏾‍♀️ 🏄🏾 🏄🏾‍♂️ 🏄🏾‍♀️ 🚣🏾 🚣🏾‍♂️ 🚣🏾‍♀️ 🏊🏾 🏊🏾‍♂️ 🏊🏾‍♀️ ⛹🏾 ⛹🏾‍♂️ ⛹🏾‍♀️ 🏋🏾 🏋🏾‍♂️ 🏋🏾‍♀️ 🚴🏾 🚴🏾‍♂️ 🚴🏾‍♀️ 🚵🏾 🚵🏾‍♂️ 🚵🏾‍♀️ 🤸🏾 🤸🏾‍♂️ 🤸🏾‍♀️ 🤽🏾 🤽🏾‍♂️ 🤽🏾‍♀️ 🤾🏾 🤾🏾‍♂️ 🤾🏾‍♀️ 🤹🏾 🤹🏾‍♂️ 🤹🏾‍♀️ 🧘🏾 🧘🏾‍♂️ 🧘🏾‍♀️ 🛀🏾 🛌🏾 💑🏾 💏🏾 👫🏾 👭🏾 👬🏾
👋🏿 🤚🏿 🖐🏿 ✋🏿 🖖🏿 👌🏿 🤌🏿 🤏🏿 ✌🏿 🤞🏿 🤟🏿 🤘🏿 🤙🏿 👈🏿 👉🏿 👆🏿 🖕🏿 👇🏿 ☝🏿 🫵🏿 👍🏿 👎🏿 ✊🏿 👊🏿 🤛🏿 🤜🏿 👏🏿 🙌🏿 👐🏿 🤲🏿 🫱🏿 🫲🏿 🤝🏿 🫳🏿 🫴🏿 🫸🏿 🫷🏿 🙏🏿 🫰🏿 🫶🏿 ✍🏿 💅🏿 🤳🏿 💪🏿 🦵🏿 🦶🏿 👂🏿 🦻🏿 👃🏿 👶🏿 🧒🏿 👦🏿 👧🏿 🧑🏿 👱🏿 👨🏿 🧔🏿 🧔🏿‍♀️ 🧔🏿‍♂️ 👨🏿‍🦰 👨🏿‍🦱 👨🏿‍🦳 👨🏿‍🦲 👩🏿 👩🏿‍🦰 🧑🏿‍🦰 👩🏿‍🦱 🧑🏿‍🦱 👩🏿‍🦳 🧑🏿‍🦳 👩🏿‍🦲 🧑🏿‍🦲 👱🏿‍♀️ 👱🏿‍♂️ 🧓🏿 👴🏿 👵🏿 🙍🏿 🙍🏿‍♂️ 🙍🏿‍♀️ 🙎🏿 🙎🏿‍♂️ 🙎🏿‍♀️ 🙅🏿 🙅🏿‍♂️ 🙅🏿‍♀️ 🙆🏿 🙆🏿‍♂️ 🙆🏿‍♀️ 💁🏿 💁🏿‍♂️ 💁🏿‍♀️ 🙋🏿 🙋🏿‍♂️ 🙋🏿‍♀️ 🧏🏿 🧏🏿‍♂️ 🧏🏿‍♀️ 🙇🏿 🙇🏿‍♂️ 🙇🏿‍♀️ 🤦🏿 🤦🏿‍♂️ 🤦🏿‍♀️ 🤷🏿 🤷🏿‍♂️ 🤷🏿‍♀️ 🧑🏿‍⚕️ 👨🏿‍⚕️ 👩🏿‍⚕️ 🧑🏿‍🎓 👨🏿‍🎓 👩🏿‍🎓 🧑🏿‍🏫 👨🏿‍🏫 👩🏿‍🏫 🧑🏿‍⚖️ 👨🏿‍⚖️ 👩🏿‍⚖️ 🧑🏿‍🌾 👨🏿‍🌾 👩🏿‍🌾 🧑🏿‍🍳 👨🏿‍🍳 👩🏿‍🍳 🧑🏿‍🔧 👨🏿‍🔧 👩🏿‍🔧 🧑🏿‍🏭 👨🏿‍🏭 👩🏿‍🏭 🧑🏿‍💼 👨🏿‍💼 👩🏿‍💼 🧑🏿‍🔬 👨🏿‍🔬 👩🏿‍🔬 🧑🏿‍💻 👨🏿‍💻 👩🏿‍💻 🧑🏿‍🎤 👨🏿‍🎤 👩🏿‍🎤 🧑🏿‍🎨 👨🏿‍🎨 👩🏿‍🎨 🧑🏿‍✈️ 👨🏿‍✈️ 👩🏿‍✈️ 🧑🏿‍🚀 👨🏿‍🚀 👩🏿‍🚀 🧑🏿‍🚒 👨🏿‍🚒 👩🏿‍🚒 👮🏿 👮🏿‍♂️ 👮🏿‍♀️ 🕵🏿 🕵🏿‍♂️ 🕵🏿‍♀️ 💂🏿 💂🏿‍♂️ 💂🏿‍♀️ 🥷🏿 👷🏿 👷🏿‍♂️ 👷🏿‍♀️ 🫅🏿 🤴🏿 👸🏿 👳🏿 👳🏿‍♂️ 👳🏿‍♀️ 👲🏿 🧕🏿 🤵🏿 🤵🏿‍♂️ 🤵🏿‍♀️ 👰🏿 👰🏿‍♂️ 👰🏿‍♀️ 🫄🏿 🫃🏿 🤰🏿 🧑🏿‍🍼 👨🏿‍🍼 👩🏿‍🍼 🤱🏿 👼🏿 🎅🏿 🤶🏿 🧑🏿‍🎄 🦸🏿 🦸🏿‍♂️ 🦸🏿‍♀️ 🦹🏿 🦹🏿‍♂️ 🦹🏿‍♀️ 🧙🏿 🧙🏿‍♂️ 🧙🏿‍♀️ 🧚🏿 🧚🏿‍♂️ 🧚🏿‍♀️ 🧛🏿 🧛🏿‍♂️ 🧛🏿‍♀️ 🧜🏿 🧜🏿‍♂️ 🧜🏿‍♀️ 🧝🏿 🧝🏿‍♂️ 🧝🏿‍♀️ 💆🏿 💆🏿‍♂️ 💆🏿‍♀️ 💇🏿 💇🏿‍♂️ 💇🏿‍♀️ 🚶🏿 🚶🏿‍♂️ 🚶🏿‍♀️ 🧍🏿 🧍🏿‍♂️ 🧍🏿‍♀️ 🧎🏿 🧎🏿‍♂️ 🧎🏿‍♀️ 🧑🏿‍🦯 👨🏿‍🦯 👩🏿‍🦯 🧑🏿‍🦼 👨🏿‍🦼 👩🏿‍🦼 🧑🏿‍🦽 👨🏿‍🦽 👩🏿‍🦽 🏃🏿 🏃🏿‍♂️ 🏃🏿‍♀️ 🚶🏿‍➡️ 🚶🏿‍♀️‍➡️ 🚶🏿‍♂️‍➡️ 🧎🏿‍➡️ 🧎🏿‍♀️‍➡️ 🧎🏿‍♂️‍➡️ 🧑🏿‍🦯‍➡️ 👨🏿‍🦯‍➡️ 👩🏿‍🦯‍➡️ 🧑🏿‍🦼‍➡️ 👨🏿‍🦼‍➡️ 👩🏿‍🦼‍➡️ 🧑🏿‍🦽‍➡️ 👨🏿‍🦽‍➡️ 👩🏿‍🦽‍➡️ 🏃🏿‍➡️ 🏃🏿‍♀️‍➡️ 🏃🏿‍♂️‍➡️ 💃🏿 🕺🏿 🕴🏿 🧖🏿 🧖🏿‍♂️ 🧖🏿‍♀️ 🧗🏿 🧗🏿‍♂️ 🧗🏿‍♀️ 🏇🏿 🏂🏿 🏌🏿 🏌🏿‍♂️ 🏌🏿‍♀️ 🏄🏿 🏄🏿‍♂️ 🏄🏿‍♀️ 🚣🏿 🚣🏿‍♂️ 🚣🏿‍♀️ 🏊🏿 🏊🏿‍♂️ 🏊🏿‍♀️ ⛹🏿 ⛹🏿‍♂️ ⛹🏿‍♀️ 🏋🏿 🏋🏿‍♂️ 🏋🏿‍♀️ 🚴🏿 🚴🏿‍♂️ 🚴🏿‍♀️ 🚵🏿 🚵🏿‍♂️ 🚵🏿‍♀️ 🤸🏿 🤸🏿‍♂️ 🤸🏿‍♀️ 🤽🏿 🤽🏿‍♂️ 🤽🏿‍♀️ 🤾🏿 🤾🏿‍♂️ 🤾🏿‍♀️ 🤹🏿 🤹🏿‍♂️ 🤹🏿‍♀️ 🧘🏿 🧘🏿‍♂️ 🧘🏿‍♀️ 🛀🏿 🛌🏿 💑🏿 💏🏿 👫🏿 👭🏿 👬🏿
`;
const extraBaseEmojis = extraBaseEmojisRaw
  .trim()
  .split(/\s+/)
  .filter((ch) => ch.length > 0);

const extraSkinToneEmojis = extraSkinToneEmojisRaw
  .trim()
  .split(/\s+/)
  .filter((ch) => ch.length > 0);

const letters = [];
const letterCategories = [];

// helper to push a range with a category tag
function pushRange(range, categoryKey) {
  for (const ch of range) {
    letters.push(ch);
    letterCategories.push(categoryKey);
  }
}

// Alphabet used for combinations: base letters + digits + precomposed + combining marks + Alphabet Extended 21.0
// Standard English + punctuation
pushRange(upper, 'standard');
pushRange(lower, 'standard');
pushRange(combinedDigits, 'standard');
pushRange(romanNumerals, 'standard');
pushRange(specialChars, 'standard');
pushRange(latinLetters, 'standard');
pushRange(latinExtB.filter(isLetter), 'standard');
pushRange(latinExtAdditionalLetters, 'standard');

// Math alphabet
pushRange(mathAlphanumerics, 'math');

// Combining marks and extended phonetic/Latin go into "other"
pushRange(combiningMarks, 'other');
pushRange(alphabetExtended21, 'other');
pushRange(cyrillicSupplementLetters, 'cyrillic');
pushRange(cyrillicExtendedA, 'cyrillic');
pushRange(cyrillicExtendedB, 'cyrillic');
pushRange(cyrillicExtendedC, 'cyrillic');
pushRange(cyrillicExtendedD, 'cyrillic');
pushRange(phoneticExtensionsLetters, 'other');
pushRange(latinExtAdditionalLetters, 'other');

// Emoji, pictographic symbols, and game-related emoji/symbols
pushRange(emojiAndSymbolBlocks, 'emoji');
pushRange(gameSymbolBlocks, 'emoji');
pushRange(extraEmojiSymbols, 'emoji');
pushRange(extraEmojiSymbolsExtra, 'emoji');
pushRange(extraEmojiSymbolsExtra2, 'private');
pushRange(extraSymbolEmojis, 'separateSymbols');
pushRange(extraSmileyEmojis, 'emoji');
pushRange(extraIconEmojis, 'separateSymbols');
pushRange(extraBaseEmojis, 'emoji');
pushRange(extraSkinToneEmojis, 'emoji');

// Explicit people + skin tone + couple/kiss/family emoji sequences
pushRange(peopleAndFamilyEmojiSet, 'family');

// All flag emojis (countries via regional indicators + GB subdivisions like England)
pushRange(allFlagEmojis, 'emoji');

// Japanese and Chinese characters
pushRange(cjkSymbolsPunctuation, 'japanese'); // shared punctuation, we tag as japanese for simplicity
pushRange(hiragana, 'japanese');
pushRange(katakana, 'japanese');
pushRange(katakanaPhoneticExtensions, 'japanese');
pushRange(cjkUnifiedIdeographsExtA, 'chinese');
pushRange(cjkUnifiedIdeographs, 'chinese');
pushRange(cjkCompatibilityIdeographs, 'chinese');

// Korean characters
pushRange(hangulJamo, 'korean');
pushRange(hangulCompatibilityJamo, 'korean');
pushRange(hangulJamoExtendedA, 'korean');
pushRange(hangulJamoExtendedB, 'korean');
pushRange(hangulSyllables, 'korean');

// Thai and Sinhala scripts (Sinhala includes ඞ)
pushRange(thai, 'other');
pushRange(sinhala, 'other');

// Egyptian hieroglyphs
pushRange(egyptianHieroglyphs, 'egyptian');

// Braille patterns
pushRange(braillePatterns, 'braille');

// Georgian script (placed after Braille as requested)
pushRange(georgian, 'other');
pushRange(georgianMkhedruli, 'other');

// Common Georgian and Cyrillic words (multi-letter samples)
pushRange(georgianWords, 'words');
pushRange(cyrillicWords, 'words');

// Hindi (Devanagari) and Arabic blocks (added after Braille)
pushRange(devanagari, 'hindi');
pushRange(arabicMain, 'arabic');
pushRange(arabicExtA, 'arabic');
pushRange(arabicPresFormsA, 'arabic');
pushRange(arabicPresFormsB, 'arabic');

 // Custom last symbols after Egyptian hieroglyphs, Braille, Hindi, Arabic
// Insert zero-width joiner and similar invisible/format characters just before 
const preEgyptianSymbols = [
  '\u200d', // ZERO WIDTH JOINER
  '\u200b', // ZERO WIDTH SPACE
  '\u2060', // WORD JOINER
];

pushRange(preEgyptianSymbols, 'other');
pushRange([extraEgyptianLikeSymbol], 'other');

 // build map from letter string to alphabet index (BigInt) for inverse lookup
const letterToIndex = new Map();
for (let i = 0; i < letters.length; i++) {
  letterToIndex.set(letters[i], BigInt(i));
}

// Extreme Extension mode: all valid, non-private-use Unicode scalar values
// from U+0000 to U+10FFFF, excluding:
//   - surrogate range U+D800–U+DFFF
//   - BMP Private Use Area U+E000–U+F8FF
//   - Supplementary Private Use Areas (planes 15–16): U+F0000–U+10FFFD
//   - control characters (C0 and C1 controls)
//   - noncharacters (U+FDD0–U+FDEF and any code point where the low 16 bits are FFFE or FFFF)
function isExtremeAllowedCodePoint(cp) {
  // exclude surrogate range
  if (cp >= 0xd800 && cp <= 0xdfff) return false;
  // BMP Private Use Area
  if (cp >= 0xe000 && cp <= 0xf8ff) return false;
  // Supplementary Private Use Areas (planes 15–16)
  if (cp >= 0xf0000 && cp <= 0x10fffd) return false;
  // control characters (C0 and C1)
  if (cp <= 0x001f || (cp >= 0x007f && cp <= 0x009f)) return false;
  // noncharacters U+FDD0–U+FDEF
  if (cp >= 0xfdd0 && cp <= 0xfdef) return false;
  // noncharacters of the form U+XXFFFE or U+XXFFFF
  if ((cp & 0xffff) === 0xfffe || (cp & 0xffff) === 0xffff) return false;
  // keep everything else
  return cp <= 0x10ffff;
}

const EXTREME_CODEPOINTS = [];
for (let cp = 0x0000; cp <= 0x10ffff; cp++) {
  if (isExtremeAllowedCodePoint(cp)) {
    EXTREME_CODEPOINTS.push(cp);
  }
}

const EXTREME_ALPHABET_SIZE = BigInt(EXTREME_CODEPOINTS.length);

const EXTREME_TOTAL_POSITIONS = BigInt(EXTREME_CODEPOINTS.length);

function getExtremeCharAtPosition(position) {
  // Build combinations over the Extreme alphabet, but keep the same
  // max position space as the normal extension by wrapping into
  // the Extreme combination space.
  let totalCombosExtreme = 0n;
  const size = EXTREME_ALPHABET_SIZE;
  for (let len = MIN_LEN; len <= MAX_LEN_FINITE; len++) {
    totalCombosExtreme += size ** len;
  }
  if (totalCombosExtreme === 0n) return '';
  const idx = position % totalCombosExtreme;
  return combinationFromIndexFiniteWithAlphabet(idx, EXTREME_CODEPOINTS);
}

 // Combination length range (finite space uses 1–5)
const MIN_LEN = 1n;
const MAX_LEN_FINITE = 5n;

const ALPHABET_SIZE = BigInt(letters.length);

 // Total number of combinations from length 1 to 5
let TOTAL_COMBINATIONS = 0n;
for (let len = MIN_LEN; len <= MAX_LEN_FINITE; len++) {
  TOTAL_COMBINATIONS += ALPHABET_SIZE ** len;
}

// Use the true total combination count as the finite position space
const TOTAL_POSITIONS = TOTAL_COMBINATIONS;

// 1e+33 as BigInt (1-based position) for epsilon
const EPSILON_POSITION = 10n ** 33n;

// Map a 0-based index into the space of all 1–5-length combinations onto a concrete string
function combinationFromIndexFinite(index) {
  // Determine length first (bounded to MAX_LEN_FINITE)
  let remaining = index;
  let length = MIN_LEN;

  for (let len = MIN_LEN; len <= MAX_LEN_FINITE; len++) {
    const countForLen = ALPHABET_SIZE ** len;
    if (remaining < countForLen) {
      length = len;
      break;
    }
    remaining -= countForLen;
  }

  // Now remaining is the index within all strings of this length
  let current = remaining;
  const chars = [];

  for (let i = 0n; i < length; i++) {
    const digit = current % ALPHABET_SIZE;
    current /= ALPHABET_SIZE;
    chars.push(letters[Number(digit)]);
  }

  // We built from least-significant "digit" first, so reverse
  chars.reverse();
  return chars.join('');
}

// Map a 0-based index into the space of all 1–5-length combinations
// for an arbitrary alphabet (used by Extreme mode).
function combinationFromIndexFiniteWithAlphabet(index, alphabet) {
  const alphabetSize = BigInt(alphabet.length);
  let remaining = index;
  let length = MIN_LEN;

  for (let len = MIN_LEN; len <= MAX_LEN_FINITE; len++) {
    const countForLen = alphabetSize ** len;
    if (remaining < countForLen) {
      length = len;
      break;
    }
    remaining -= countForLen;
  }

  let current = remaining;
  const chars = [];

  for (let i = 0n; i < length; i++) {
    const digit = current % alphabetSize;
    current /= alphabetSize;
    chars.push(String.fromCodePoint(alphabet[Number(digit)]));
  }

  chars.reverse();
  return chars.join('');
}

// Map a 0-based index into combinations of any length (unbounded) for infinite mode
function combinationFromIndexInfinite(index) {
  let remaining = index;
  let length = MIN_LEN;
  let accumulated = 0n;

  // Find the minimal length such that index falls into total combinations up to that length
  while (true) {
    const countForLen = ALPHABET_SIZE ** length;
    if (remaining < countForLen) {
      break;
    }
    remaining -= countForLen;
    length += 1n;
  }

  let current = remaining;
  const chars = [];

  for (let i = 0n; i < length; i++) {
    const digit = current % ALPHABET_SIZE;
    current /= ALPHABET_SIZE;
    chars.push(letters[Number(digit)]);
  }

  chars.reverse();
  return chars.join('');
}

// Split a word into alphabet "letters" (some entries are multi-codepoint emoji/sequences)
function splitWordIntoAlphabetLetters(word) {
  const parts = [];
  let i = 0;
  while (i < word.length) {
    let found = null;
    // try longest possible substring from this position
    for (let len = word.length - i; len >= 1; len--) {
      const slice = word.slice(i, i + len);
      if (letterToIndex.has(slice)) {
        found = slice;
        break;
      }
    }
    if (!found) {
      return null; // cannot tokenize into known alphabet letters
    }
    parts.push(found);
    i += found.length;
  }
  return parts;
}

// Get 0-based position index for a given word in the infinite combination ordering
function getPositionOfWord(word) {
  if (!word || word.length === 0) return null;

  const parts = splitWordIntoAlphabetLetters(word);
  if (!parts) return null;

  const length = BigInt(parts.length);
  if (length < MIN_LEN) return null;

  // sum of counts for all shorter lengths
  let index = 0n;
  for (let len = MIN_LEN; len < length; len++) {
    index += ALPHABET_SIZE ** len;
  }

  // value of this word as a base-ALPHABET_SIZE number
  let value = 0n;
  for (let i = 0; i < parts.length; i++) {
    const digit = letterToIndex.get(parts[i]);
    if (digit === undefined) return null;
    value = value * ALPHABET_SIZE + digit;
  }

  return index + value; // 0-based index
}

function getCharAtPosition(position, { infinite = false } = {}) {
  // Preserve special epsilon position
  if (position + 1n === EPSILON_POSITION) {
    return 'ε';
  }

  if (infinite) {
    // In infinite mode, grow length beyond 5 when needed
    return combinationFromIndexInfinite(position);
  }

  // Wrap into the finite combination space (1–5 letters)
  const idx = position % TOTAL_COMBINATIONS;
  return combinationFromIndexFinite(idx);
}

// Category lookup for a given generated word, based on the first alphabet unit
function getCategoryForWord(word) {
  if (!word) return 'other';
  const parts = splitWordIntoAlphabetLetters(word);
  if (!parts || parts.length === 0) return 'other';
  const first = parts[0];
  const idxBig = letterToIndex.get(first);
  if (idxBig === undefined) return 'other';
  const idx = Number(idxBig);
  const cat = letterCategories[idx];
  return cat || 'other';
}

// Precomputed counts of one-symbol units per script/category for UI info
const ONE_LETTER_COUNTS = {
  latin:
    upper.length +
    lower.length +
    digits.length +
    specialChars.length +
    latinLetters.length +
    latinExtB.filter(isLetter).length +
    latinExtAdditionalLetters.length +
    mathAlphanumerics.length,
  greek: greekLetters.length,
  cyrillic:
    cyrillicLetters.length +
    cyrillicSupplementLetters.length +
    cyrillicExtendedA.length +
    cyrillicExtendedB.length +
    cyrillicExtendedC.length +
    cyrillicExtendedD.length,
  phoneticLatinExtra: phoneticExtensionsLetters.length,
  cjk:
    cjkUnifiedIdeographsExtA.length +
    cjkUnifiedIdeographs.length +
    cjkCompatibilityIdeographs.length +
    cjkSymbolsPunctuation.length,
  japaneseKana:
    hiragana.length + katakana.length + katakanaPhoneticExtensions.length,
  hangul:
    hangulJamo.length +
    hangulCompatibilityJamo.length +
    hangulJamoExtendedA.length +
    hangulJamoExtendedB.length +
    hangulSyllables.length,
  thai: thai.length,
  sinhala: sinhala.length,
  egyptian: egyptianHieroglyphs.length,
  braille: braillePatterns.length,
  georgian: georgianMkhedruli.length,
  hindi: devanagari.length,
  arabic:
    arabicMain.length +
    arabicExtA.length +
    arabicPresFormsA.length +
    arabicPresFormsB.length,
  emoji:
    emojiAndSymbolBlocks.length +
    gameSymbolBlocks.length +
    extraEmojiSymbols.length +
    extraEmojiSymbolsExtra.length +
    extraEmojiSymbolsExtra2.length +
    extraSymbolEmojis.length +
    extraBaseEmojis.length +
    extraSkinToneEmojis.length,
  peopleFamilyEmoji: peopleAndFamilyEmojiSet.length,
  flags: allFlagEmojis.length,
};

ONE_LETTER_COUNTS.total =
  ONE_LETTER_COUNTS.latin +
  ONE_LETTER_COUNTS.greek +
  ONE_LETTER_COUNTS.cyrillic +
  ONE_LETTER_COUNTS.phoneticLatinExtra +
  ONE_LETTER_COUNTS.cjk +
  ONE_LETTER_COUNTS.japaneseKana +
  ONE_LETTER_COUNTS.hangul +
  ONE_LETTER_COUNTS.thai +
  ONE_LETTER_COUNTS.sinhala +
  ONE_LETTER_COUNTS.egyptian +
  ONE_LETTER_COUNTS.braille +
  ONE_LETTER_COUNTS.georgian +
  ONE_LETTER_COUNTS.emoji +
  ONE_LETTER_COUNTS.peopleFamilyEmoji +
  ONE_LETTER_COUNTS.flags +
  ONE_LETTER_COUNTS.hindi +
  ONE_LETTER_COUNTS.arabic;

/**
 * Unicode blocks (or sub-ranges of blocks) that are already used by this generator.
 * This is just for reference so you can avoid adding the same block twice.
 *
 * NOTE: The "Basic Latin" block (U+0000–U+007F) is only *partially* used here:
 *   - U+0030–U+0039  (digits 0–9)
 *   - U+0041–U+005A  (A–Z)
 *   - U+0061–U+007A  (a–z)
 */
const UNICODE_BLOCKS_USED = [
  {
    name: 'Basic Latin (digits)',
    start: 0x0030,
    end: 0x0039,
    comment: '0–9',
  },
  {
    name: 'Basic Latin (uppercase letters)',
    start: 0x0041,
    end: 0x005a,
    comment: 'A–Z',
  },
  {
    name: 'Basic Latin (lowercase letters)',
    start: 0x0061,
    end: 0x007a,
    comment: 'a–z',
  },
  {
    name: 'Latin-1 Supplement',
    start: 0x00c0,
    end: 0x00ff,
    comment: 'accented Latin letters (subset of the block, non-letters filtered out)',
  },
  {
    name: 'Latin Extended-A',
    start: 0x0100,
    end: 0x017f,
    comment: 'extended Latin letters (subset of the block, non-letters filtered out)',
  },
  {
    name: 'Latin Extended-B',
    start: 0x0180,
    end: 0x024f,
    comment: 'subset of block; letters filtered via Unicode property',
  },
  {
    name: 'Combining Diacritical Marks',
    start: 0x0300,
    end: 0x036f,
    comment: 'combining marks used directly',
  },
  {
    name: 'Greek and Coptic',
    start: 0x0370,
    end: 0x03ff,
    comment: 'letters only; contributes to Alphabet Extended 21.0',
  },
  {
    name: 'Cyrillic',
    start: 0x0400,
    end: 0x04ff,
    comment: 'letters only; contributes to Alphabet Extended 21.0',
  },
  {
    name: 'Cyrillic Supplement',
    start: 0x0500,
    end: 0x052f,
    comment: 'letters only; added as extra symbols beyond Alphabet Extended 21.0',
  },
  {
    name: 'Cyrillic Extended-A',
    start: 0x2de0,
    end: 0x2dff,
    comment: 'additional Cyrillic combining letters',
  },
  {
    name: 'Cyrillic Extended-B',
    start: 0xa640,
    end: 0xa69f,
    comment: 'historic and extended Cyrillic letters (includes ꙮ U+A66E)',
  },
  {
    name: 'Cyrillic Extended-C',
    start: 0x1c80,
    end: 0x1c8f,
    comment: 'historic Cyrillic letters (case pairs and variants)',
  },
  {
    name: 'Cyrillic Extended-D',
    start: 0x1e030,
    end: 0x1e08f,
    comment: 'recently added extended Cyrillic letters',
  },
  {
    name: 'Phonetic Extensions',
    start: 0x1d00,
    end: 0x1d7f,
    comment: 'letters only; added as extra phonetic symbols',
  },
  {
    name: 'Latin Extended Additional',
    start: 0x1e00,
    end: 0x1eff,
    comment: 'letters only; extended Latin with additional diacritics',
  },
  {
    name: 'Miscellaneous Symbols',
    start: 0x2600,
    end: 0x26ff,
    comment: 'general symbols, many used as emoji',
  },
  {
    name: 'Dingbats',
    start: 0x2700,
    end: 0x27bf,
    comment: 'decorative symbols, many used as emoji',
  },
  {
    name: 'Miscellaneous Symbols and Pictographs',
    start: 0x1f300,
    end: 0x1f5ff,
    comment: 'emoji and pictographic symbols',
  },
  {
    name: 'Emoticons',
    start: 0x1f600,
    end: 0x1f64f,
    comment: 'face emoji',
  },
  {
    name: 'Transport and Map Symbols',
    start: 0x1f680,
    end: 0x1f6ff,
    comment: 'transport, map, and other emoji symbols',
  },
  {
    name: 'Miscellaneous Symbols and Arrows / Supplemental emoji blocks',
    start: 0x1f700,
    end: 0x1f8ff,
    comment: 'additional pictographs and arrows sometimes rendered as emoji',
  },
  {
    name: 'Supplemental Symbols and Pictographs',
    start: 0x1f900,
    end: 0x1f9ff,
    comment: 'extended emoji set',
  },
  {
    name: 'Symbols and Pictographs Extended-A',
    start: 0x1fa70,
    end: 0x1faff,
    comment: 'more recent emoji additions',
  },
  {
    name: 'CJK Symbols and Punctuation',
    start: 0x3000,
    end: 0x303f,
    comment: 'punctuation used with CJK scripts',
  },
  {
    name: 'Hiragana',
    start: 0x3040,
    end: 0x309f,
    comment: 'Japanese Hiragana',
  },
  {
    name: 'Katakana',
    start: 0x30a0,
    end: 0x30ff,
    comment: 'Japanese Katakana',
  },
  {
    name: 'Katakana Phonetic Extensions',
    start: 0x31f0,
    end: 0x31ff,
    comment: 'additional Katakana for Ainu and other uses',
  },
  {
    name: 'CJK Unified Ideographs Extension A',
    start: 0x3400,
    end: 0x4dbf,
    comment: 'extended set of Han characters',
  },
  {
    name: 'CJK Unified Ideographs',
    start: 0x4e00,
    end: 0x9fff,
    comment: 'core Han characters used in Chinese and Japanese',
  },
  {
    name: 'CJK Compatibility Ideographs',
    start: 0xf900,
    end: 0xfaff,
    comment: 'Han characters for compatibility with legacy encodings',
  },
  {
    name: 'Braille Patterns',
    start: 0x2800,
    end: 0x28ff,
    comment: 'Braille pattern symbols',
  },
  {
    name: 'Georgian',
    start: 0x10a0,
    end: 0x10ff,
    comment: 'Georgian script (Asomtavruli, Nuskhuri, Mkhedruli)',
  },
  {
    name: 'Devanagari',
    start: 0x0900,
    end: 0x097f,
    comment: 'Hindi and related languages (Devanagari script)',
  },
  {
    name: 'Arabic',
    start: 0x0600,
    end: 0x06ff,
    comment: 'Arabic main block',
  },
  {
    name: 'Arabic Extended-A',
    start: 0x08a0,
    end: 0x08ff,
    comment: 'Additional Arabic letters and marks',
  },
  {
    name: 'Arabic Presentation Forms-A',
    start: 0xfb50,
    end: 0xfdff,
    comment: 'Contextual forms and ligatures (Arabic)',
  },
  {
    name: 'Arabic Presentation Forms-B',
    start: 0xfe70,
    end: 0xfeff,
    comment: 'Additional contextual forms (Arabic)',
  },
];

export {
  letters,
  letterCategories,
  TOTAL_POSITIONS,
  EPSILON_POSITION,
  getCharAtPosition,
  UNICODE_BLOCKS_USED,
  getExtremeCharAtPosition,
  // exports for inverse lookup / UI
  getPositionOfWord,
  ALPHABET_SIZE,
  ONE_LETTER_COUNTS,
  getCategoryForWord,
};