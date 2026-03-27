export const PART_B = [
    {
        name: "Human Being",
        logSize: 0,
        desc: "A conscious spark of the cosmos, born against staggering odds.",
        details: "You are made of stardust. The atoms in your left hand probably came from a different star than the ones in your right.",
        color: 0xffe0bd,
        type: "human"
    },
    {
        name: "Smartphone",
        logSize: 0.5,
        desc: "A pocket supercomputer connecting billions, represented by a 3D device model.",
        details: "Modern phones contain cameras, radios, and processors enabling global networks. Rendered here using the provided GLB model for accurate scale and appearance.",
        color: 0x112233,
        type: "smartphone",
        // model asset provided in project root: super_low_poly_generic_smartphone.glb
    },
    {
        name: "96 PPI Screen Pixel (0.01\")",
        logSize: -3.6,
        desc: "A single 96 PPI pixel at 0.01 inches shown as a tiny RGB subpixel triple.",
        details: "A 0.01 inch pixel (approx 0.000254 m) represented as three subpixel rectangles (R/G/B) for close-up visual reference.",
        color: 0xffffff,
        type: "pixel"
    },
    {
        name: "Blue Whale",
        logSize: 1.5,
        desc: "The largest creature to ever live on Earth.",
        details: "Even larger than the biggest dinosaurs, their heart is the size of a bumper car and their tongue weighs as much as an elephant.",
        color: 0x4466aa,
        type: "blob"
    },

    {
        name: "Godzilla (Movie-Scale)",
        logSize: 1.8,
        desc: "A towering fictional kaiju rendered as a colossal green creature for dramatic scale comparison.",
        details: "At roughly 60 meters tall in this representation, Godzilla provides a pop-culture landmark to compare other nearby planetary-scale objects.",
        color: 0x2b8f2b,
        type: "blob"
    },

    {
        name: "United States of America",
        logSize: 5.9,
        desc: "The USA shown as a flag-map silhouette—smaller than Asia in this scene but a prominent continental landmark.",
        details: "Rendered as a plane textured with the USA flag map to visually indicate national-scale extent relative to other planetary features.",
        color: 0xffffff,
        type: "tower",
        image: "/USA_Flag_Map.png"
    },
    {
        name: "Eiffel Tower",
        logSize: 2.5,
        desc: "A landmark of human ambition reaching toward the sky.",
        details: "Built for the 1889 World's Fair, it was meant to be temporary but became an iconic symbol of engineering.",
        color: 0x888888,
        type: "tower"
    },
    {
        name: "Space Elevator (Concept)",
        logSize: 3.0,
        desc: "A proposed megastructure linking ground to geostationary orbit.",
        details: "Space elevators remain theoretical but would revolutionize access to orbit if materials and engineering permit.",
        color: 0x66ccff,
        type: "tower"
    },
    {
        name: "International Space Station",
        logSize: 0.8,
        desc: "Humanity's permanent outpost in low Earth orbit.",
        details: "The ISS is a multinational laboratory and habitat at ~400 km altitude; it supports science and technology demonstrations.",
        color: 0x99aaee,
        type: "sphere"
    },
    {
        name: "Great Pyramid",
        logSize: 2.15,
        desc: "An ancient marvel of precision engineering.",
        details: "The Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years.",
        color: 0xd4af37,
        type: "mountain"
    },
    {
        name: "City",
        logSize: 3,
        desc: "A dense human ecosystem of architecture, transit, and culture.",
        details: "Cities concentrate people, infrastructure, and technology; their skylines and networks are visible from space on clear nights.",
        color: 0x8888aa,
        type: "tower"
    },

    {
        name: "Ant",
        logSize: -2,
        desc: "A tiny titan of the insect world.",
        details: "Ants can lift many times their body weight and live in highly organized colonies — a micro-society.",
        color: 0x884422,
        type: "blob"
    },

    {
        name: "Robert Wadlow (Tallest Human)",
        logSize: 0.43,
        desc: "Robert Wadlow, the tallest recorded human being in history.",
        details: "Robert Wadlow reached 2.72 meters (8 ft 11 in); represented here as a scaled human object to show extraordinary human height.",
        color: 0xffe0bd,
        type: "human"
    },

    {
        name: "Statue of Liberty",
        logSize: 1.97,
        desc: "A colossal neoclassical sculpture on Liberty Island in New York Harbor.",
        details: "The Statue of Liberty stands as a symbol of freedom; represented here as a tower-like monument in the scale list.",
        color: 0x88bb99,
        type: "tower"
    },

    {
        name: "Holy See (Vatican City)",
        logSize: 3.1,
        desc: "The world’s smallest independent country, shown as its tiny outline filled with the Vatican flag.",
        details: "At this scale, the Holy See appears as a minuscule but distinct flag-map country—smaller on the scale than the Mount Everest landmark.",
        color: 0xffffff,
        type: "tower",
        image: "/Flag_map_of_Vatican_City.svg.png"
    },
    {
        name: "Russia",
        logSize: 6.0229,
        desc: "The largest country on Earth, shown as its vast outline filled with the Russian flag.",
        details: "From this vantage, Russia’s immense landmass appears as a sweeping flag-map silhouette stretching across the globe.",
        color: 0xffffff,
        type: "tower",
        image: "/Flag-map_of_Russia.png"
    },
    {
        name: "Asia",
        logSize: 6.6,
        desc: "The vast continent of Asia shown as a large flag-map silhouette—bigger than Russia but smaller than the whole Earth.",
        details: "Rendered as a prominent flag-map plane to represent the continent at intermediate planetary scale.",
        color: 0xff4444,
        type: "tower",
        image: "/Flag_map_of_Asia_(With_Flag_of_Asia).png"
    },
    {
        name: "Mount Everest",
        logSize: 3.9,
        desc: "The roof of the world. A frozen monument of rock and ice pushed upward by the titanic collision of continents.",
        color: 0xffffff,
        type: "mountain"
    },
    {
        name: "Comet",
        logSize: 5.5,
        desc: "Icy wanderers that sometimes put on spectacular tails when near the Sun.",
        details: "Comets are reservoirs of primitive ices and organic compounds from the early Solar System.",
        color: 0xaaddff,
        type: "blob"
    },
    {
        name: "The Moon",
        logSize: 6.5,
        desc: "Our constant companion in the dark, pulling tides and lighting the night.",
        details: "The Moon is moving away from Earth at a rate of 3.8 centimeters per year.",
        color: 0xcccccc,
        type: "sphere"
    },
    {
        name: "Asteroid",
        logSize: 7.5,
        desc: "Rocks and rubble that drift between planets—remnants of solar system formation.",
        details: "Asteroids range from pebble-like fragments to dwarf planets; they provide clues to the early solar system.",
        color: 0x8a7f6b,
        type: "blob"
    },
    {
        name: "Earth",
        logSize: 7.1,
        desc: "You live here. You get oxygen from trees. A fragile blue oasis.",
        details: "Earth is the only known planet with liquid water on its surface and a nitrogen-oxygen atmosphere capable of supporting life.",
        color: 0x2233ff,
        type: "earth"
    },
    {
        name: "Dwarf Planet (Ceres)",
        logSize: 7.3,
        desc: "A small world orbiting in the asteroid belt.",
        details: "Dwarf planets occupy regions where bodies are round under their own gravity but haven't cleared their orbital zone.",
        color: 0x998877,
        type: "sphere"
    },
    {
        name: "Exoplanet",
        logSize: 9.5,
        desc: "A planet orbiting another star, possibly harboring exotic climates and life.",
        details: "Thousands of exoplanets have been discovered with a huge variety of sizes, compositions, and orbital configurations.",
        color: 0xff8866,
        type: "sphere"
    },
    {
        name: "Jupiter",
        logSize: 8.1,
        desc: "The king of planets, a swirling giant acting as a cosmic shield.",
        details: "Jupiter is more than twice as massive as all the other planets in our solar system combined.",
        color: 0xffaa88,
        type: "sphere"
    },
    {
        name: "Saturn",
        logSize: 8.2,
        desc: "The jewel of the solar system, famous for its ring system.",
        details: "Saturn's rings are made of billions of chunks of ice and rock, ranging from grains of sand to the size of houses.",
        color: 0xeeddaa,
        type: "sphere"
    },

    {
        name: "Black Hole (Stellar)",
        logSize: 5.8,
        desc: "A region of space where gravity is so strong that nothing can escape.",
        details: "Stellar black holes form from collapsed massive stars; supermassive black holes reside at galaxy centers.",
        color: 0x000000,
        type: "sphere"
    },
    {
        name: "The Sun",
        logSize: 9.1,
        desc: "The furnace of our world, a colossal sphere of nuclear fusion.",
        details: "The Sun accounts for 99.8% of the total mass of the entire Solar System.",
        color: 0xffcc00,
        type: "sun"
    },
    {
        name: "Solar System",
        logSize: 13,
        desc: "A cosmic neighborhood bound by gravity, with planets dancing in eternal orbits.",
        details: "The Solar System formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud.",
        color: 0x444466,
        type: "system"
    },
    {
        name: "Light Year",
        logSize: 15.988,
        desc: "The distance light travels in a single year—nearly 6 trillion miles.",
        details: "Light travels at 300,000 kilometers per second. Even at this speed, it takes years to reach our nearest neighbor stars.",
        color: 0xffffff,
        type: "line"
    },
    {
        name: "Kuiper Belt",
        logSize: 16.0,
        desc: "A band of icy bodies beyond Neptune, source of many comets.",
        details: "Pluto resides in this distant region along with thousands of other small icy worlds.",
        color: 0x223344,
        type: "cloud"
    },
    {
        name: "Oort Cloud",
        logSize: 16.2,
        desc: "A frozen halo of comets marking the true outer edge of the sun's kingdom.",
        details: "It is believed to be a giant spherical shell surrounding the sun, containing trillions of icy objects.",
        color: 0x111122,
        type: "cloud"
    },
    {
        name: "Crab Nebula",
        logSize: 17.5,
        desc: "A vibrant remnant of a star that died in a supernova explosion.",
        details: "The explosion was recorded by Chinese astronomers in 1054 AD and was bright enough to be seen in daylight.",
        color: 0xffaa44,
        type: "cloud"
    }
];