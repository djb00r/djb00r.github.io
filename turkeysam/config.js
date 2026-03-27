export const config = {
  backgroundColor: 0xf0f0f0,
  sandwich: {
    bread: { color: 0xDEB887, shininess: 30 },
    turkey: { color: 0xF5E1A4, shininess: 10 },
    lettuce: { color: 0x78AB46, shininess: 50 },
    tomato: { color: 0xFF6347, shininess: 60 }
  },
  text: {
    message: "turkey sandwich 3.",
    // This color is used for 3D text if one were to build it in Three.js;
    // our overlay text in CSS also uses a matching brown shade.
    color: 0x8B4513,
    font: "Comic Sans MS"
  }
};