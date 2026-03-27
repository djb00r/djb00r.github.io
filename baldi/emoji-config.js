export const emojiMap = {
  ":angry:": '<img src="https://files.catbox.moe/81xis1.png" class="chat-emoji" alt="angry">',
  ":quarter:": '<img src="https://files.catbox.moe/fvuf33.png" class="chat-emoji" alt="quarter">',
  ":happy:": '<img src="https://files.catbox.moe/zxqhcf.png" class="chat-emoji" alt="happy">',
  ":funny:": '<img src="https://files.catbox.moe/3z7s7j.jpg" class="chat-emoji" alt="funny">',
  ":mad:": '<img src="https://files.catbox.moe/x0evpj.png" class="chat-emoji" alt="mad">',
  ":playtime:": '<img src="https://files.catbox.moe/0zmrum.webp" class="chat-emoji" alt="playtime">',
  ":apple:": '<img src="https://files.catbox.moe/imhnd4.gif" class="chat-emoji" alt="apple">',
  ":broom:": "🧹",
  ":smallbaldi:": '<img src="https://cdn3.emoji.gg/emojis/42274-goober-baldi.png" class="chat-emoji" alt="smallbaldi">',
  ":paperman:": '<img src="/60420785_3111111111111111111111111111111112x311111111111111111111111111112.png" class="chat-emoji" alt="paperman">',
  ":dance:": '<img src="https://cdn3.emoji.gg/emojis/baldi_l_dance.gif" class="chat-emoji" alt="dance">',
  ":dance2:": '<img src="https://cdn3.emoji.gg/emojis/baldidespacito.gif" class="chat-emoji" alt="dance2">',
  ":cool:": '<img src="https://cdn3.emoji.gg/emojis/45391-baldi-head-shocked.png" class="chat-emoji" alt="cool">',
  ":oreo:": '<img src="https://cdn3.emoji.gg/emojis/9294-oreo.png" class="chat-emoji" alt="oreo">',
  ":baldiflag:": '<img src="https://pbs.twimg.com/media/FJa7k8VXoAcyyl9.png" class="chat-emoji" alt="baldiflag">',
  ":wheelchair:": '<img src="https://static-00.iconduck.com/assets.00/wheelchair-symbol-emoji-2048x2048-3367lyc2.png" class="chat-emoji" alt="wheelchair">',
  ":papererror:": '<img src="https://www.thewindowsclub.com/wp-content/uploads/2018/06/xBroken-image-icon-in-Chrome.gif.pagespeed.ic.Nusm2KeUdg.gif" class="chat-emoji" alt="papererror">',
  ":lock:": '<img src="https://symbl-world.akamaized.net/i/webp/cc/1d2a1237aea685c22886f34c5207e7.webp" class="chat-emoji" alt="lock">',
  ":baldidressdance:": '<img src="https://gifdb.com/images/high/baldi-basics-dancing-happily-7sm7gmj5e7t4f4aq.gif" class="chat-emoji" alt="Baldi dancing happily in a dress">',
  ":baldistickman:": '<img src="https://media.tenor.com/ZeO50HVd-oQAAAAM/distraction-dance.gif" class="chat-emoji" alt="Baldi dancing as a stick figure">',
  ":baldiheadrocket:": '<img src="https://gifdb.com/images/high/removing-the-head-of-baldi-am32dvb6qiztfibu.gif" class="chat-emoji" alt="Baldi removing his head">',
  ":nopass:": '<img src="https://media.tenor.com/cyP_9L6Xd-cAAAAM/baldi-baldi%27s-basics.gif" class="chat-emoji" alt="Baldi blocking passage">',
  ":bsoda:": '<img src="https://baldigames.com/data/image/posts/bsoda.png" class="chat-emoji" alt="Baldi\'s branded soda drink">',
  ":giantbaldi:": '<img src="https://i.makeagif.com/media/1-08-2023/nWw8iv.gif" class="chat-emoji" alt="Giant Baldi">'
};

export function getEmojiList() {
  return Object.entries(emojiMap).map(([code, html]) => ({
    code,
    html,
    description: getEmojiDescription(code)
  }));
}

export function getEmojiDescription(code) {
  const descriptions = {
    ":angry:": "Angry face expressing frustration",
    ":quarter:": "Quarter coin or money symbol",
    ":happy:": "Smiling face showing joy",
    ":funny:": "Laughing face representing humor",
    ":mad:": "Angry or upset expression",
    ":playtime:": "Playful jump rope or playground symbol",
    ":apple:": "Red apple or food emoji",
    ":broom:": "Broom for cleaning",
    ":smallbaldi:": "Cute mini version of Baldi",
    ":paperman:": "Paper character or document symbol",
    ":dance:": "Dancing or celebration emoji",
    ":dance2:": "Alternative dance movement",
    ":cool:": "Cool or calm expression",
    ":oreo:": "Oreo cookie",
    ":baldiflag:": "Baldi's flag or logo",
    ":wheelchair:": "Wheelchair accessibility symbol",
    ":papererror:": "Broken or error image icon",
    ":lock:": "Locked or secure symbol",
    ":baldidressdance:": "Baldi dancing happily in a dress",
    ":baldistickman:": "Baldi dancing as a stick figure",
    ":baldiheadrocket:": "Baldi removing his head",
    ":nopass:": "Baldi blocking passage",
    ":bsoda:": "Baldi's branded soda drink",
    ":giantbaldi:": "Massive version of Baldi"
  };

  return descriptions[code] || "Emoji";
}