import Matter from 'matter-js';

// Setup basic aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Body = Matter.Body,
      Vector = Matter.Vector,
      Collision = Matter.Collision,
      Query = Matter.Query; // Added for collision checking

const MIN_WIDTH = 800;
const MIN_HEIGHT = 600;

// Game State
let engine;
let render;
let runner;
let greenSquare;
let redSquare;
let brownSquare; // New secret character
let blueSquare; // New character: The Blue Cube
let yellowSquare; // New character: The Yellow Cube
let catSquare = null; // Yellow's pet cat cube
let cloudCharacter = null; // Always-present cloud cube in Brown's house
let platformParts = [];
let waterSensor;
let boatBody = null;
let nextBoatSpawnTime = 0;
let boatSpawnTime = 0;
let ruler = null;
let cloudMachine = null;
let needle = null;
let cloudTransformed = null; // 'green','red','blue','brown','merged'
let cloudTransformStartTime = 0;
let isGameOver = false;
let currentChapter = 1; // 1, 2, or 3
let gameStartTime = 0;
let greenFallenTime = 0; // Timestamp when green square hits water/lava
let redFallenTime = 0;   // Timestamp when red square hits water
let brownFallenTime = 0; // Timestamp when brown square hits water
let blueFallenTime = 0;  // Timestamp when blue square hits water
let yellowFallenTime = 0; // Timestamp when yellow square hits water
let catFallenTime = 0;    // Timestamp when cat cube hits water

 // Audio
let backgroundMusic;
let splashSound;
let hitSound;
let vineboomSound;
let achievementBeep;



  // Water splash visual effects
const waterSplashes = [];
const SPLASH_DURATION_MS = 800;

// Hit effects (gif at collision point)
const impactEffects = [];
const HIT_EFFECT_DURATION_MS = 500;

// Merge explosion effects (big boom with tint)
const mergeEffects = [];
const MERGE_EFFECT_DURATION_MS = 1200;

const SIMULTANEOUS_KILL_WINDOW = 500; // ms window for dual kill ending
const SQUARE_SIZE = 75; // Size of all squares (150% of original 50px)
let PLATFORM_WIDTH = 0; // Rightmost X coordinate of the platform structure

const STALEMATE_DURATION_MS = 60000; // 1 minute
let isStalemateEnabled = true; // State for controlling the stalemate ending
let isCloudEndingEnabled = false; // State for controlling the timed cloud ending

// Red Square AI State
let isRedPushing = false;
let pushTimer = 0;
const PUSH_DURATION = 750; // 0.75 seconds

// Red Square Grip Mechanics
let mouseConstraint;
let redGrabStartTime = 0;
let shakeEnergy = 0; // Tracks shaking intensity
let isRedAggressive = false;
const RED_HOLD_LIMIT = 15000; // 15 seconds before he breaks free

// Prison Ending State
let prisonBounds = null;
let prisonEntryTime = 0;
const PRISON_DURATION = 3000; // 3 seconds

// Cloud Ending State
let isCloudMode = false;
let cloudModeStartTime = 0;
const CLOUD_TRANSITION_DURATION = 3000;

// Chapter 2 State
let chapter2LavaSensor;
// Chapter 3 State
const CAGE_TIME_LIMIT_MS = 10000; // 10 seconds to escape
let cageExplosionTimer = 0;
let cageParts = [];

let chapter2FloatingPlatform;
let greenSquareInitialSize = SQUARE_SIZE;
let greenMeltingProgress = 0;
const MELT_DURATION_MS = 3000; // 3 seconds to melt once touching lava

// Cursor Easter Egg State
let easterEggCursorActive = false;

 // Robot Invasion State
let robotsSpawned = false;
let robotAttackStartTime = 0;
let robotBodies = [];

 // Robot transformation animation
const ROBOT_TRANSFORM_DURATION = 1000; // ms for cube to fully become robotic

 // Big Eye / Freezer State
let greenSpinEnergy = 0;
let greenBigEyeReady = false;
let bigEyeFreezeStartTime = 0;
let freezerBody = null;

 // Mad Red / Freezer State
let redSpinEnergy = 0;
let redMadReady = false;
let madFreezeStartTime = 0;

 // Mad Ending timer once Red becomes aggressive
let madAggressiveStartTime = 0;

 // Brown sunglasses removal ending timer
let brownSunglassesHitTime = 0;

 // Yellow TV / anger state
let yellowTV = null;
let yellowRoof = null;

// Helper to explode Yellow's roof into falling debris
function explodeYellowRoof() {
    if (!yellowRoof || !engine) return;

    const roofPos = { x: yellowRoof.position.x, y: yellowRoof.position.y };

    // Spawn 100 roof debris pieces that fly in random directions and collide
    const debrisPieces = [];
    for (let i = 0; i < 100; i++) {
        const pieceSize = 6 + Math.random() * 6;
        const piece = Bodies.rectangle(
            roofPos.x + (Math.random() - 0.5) * 40,
            roofPos.y + (Math.random() - 0.5) * 20,
            pieceSize,
            pieceSize,
            {
                frictionAir: 0.05,
                restitution: 0.2,
                density: 0.0005,
                label: 'yellow_roof_piece',
                render: { fillStyle: '#FFF9C4' },
                isSensor: false // now solid and colliding
            }
        );
        const angle = Math.random() * Math.PI * 2;
        const force = 0.01 + Math.random() * 0.015;
        Body.applyForce(piece, piece.position, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force - 0.01
        });
        debrisPieces.push(piece);
    }
    Composite.add(engine.world, debrisPieces);

    // Remove the solid roof body so Yellow can pass through
    Composite.remove(engine.world, yellowRoof);
    yellowRoof = null;
}
let yellowMad = false;
let yellowTVOffTime = 0;
let yellowWhatWatchingTime = 0;

 // Cat state
let catMad = false;
let catSpinEnergy = 0;
let catMadStartTime = 0;

// Fish state for Yummy Fish Ending
let fishBody = null;
let nextFishSpawnTime = 0;
let fishSpawnTime = 0;

// Dance ending state (Green scared + spinning on Yellow's roof)
let danceStartTime = 0;

// Track which cube was last pushed by the cat
let lastCatPushVictimId = null;
let lastCatPushTime = 0;

// State for Chapter 2 Blue Cube Action
let blueActionInitiated = false;

 // Ending Definitions
const ENDINGS = {
    'bad': {
        title: "BAD ENDING",
        color: "#F44336",
        description: "The green square was pushed into the water.",
        hint: "Throw Green into the water."
    },
    'good': {
        title: "GOOD ENDING",
        color: "#4CAF50",
        description: "The angry red square fell into the water!",
        hint: "Make Red fall into the water instead of Green."
    },
    'dance': {
        title: "DANCE ENDING",
        color: "#FF80AB",
        description: "Green danced on Yellow’s roof until he forgot to be scared.",
        hint: "While Green is making his scared face, spin him on Yellow’s roof for about 10 seconds."
    },
    'space': {
        title: "SPACE ENDING",
        color: "#9C27B0",
        description: "You threw the red square into space! (Throw Red high enough)",
        hint: "Launch Red so high that he flies off the top of the screen."
    },
    'stalemate': {
        title: "STALEMATE ENDING",
        color: "#FFD700",
        description: "Achieved uneasy peace after 1 minute (Can be disabled).",
        hint: "Do nothing dangerous for a long time."
    },
    'dual_kill': {
        title: "MUTUAL DESTRUCTION ENDING",
        color: "#000000",
        description: "Both combatants fell into the abyss at the same time.",
        hint: "Drop Red and Green into the water within a split second of each other."
    },
    'secret': {
        title: "NOT SO SECRET ENDING",
        color: "#795548",
        description: "You found the hidden Chill Brown Square inside the wall.",
        hint: "Touch Brown with Green inside Brown’s cave."
    },
    'prison': {
        title: "PRISON ENDING",
        color: "#607D8B",
        description: "Red square was trapped in the dungeon for 3 seconds.",
        hint: "Push Red deep inside the cave and keep him there."
    },
    'cloud': {
        title: "CLOUD ENDING",
        color: "#29B6F6",
        description: "Everything has become soft and fluffy... (Throw Brown Square into a cloud)",
        hint: "Use the cloud machine on a cube and wait in cloud mode."
    },
    'merged': {
        title: "MERGED ENDING",
        color: "#8D6E63",
        description: "The hostile red and player green squares fused into a single, chill brown square (1% chance on collision).",
        hint: "Let Red and Green collide over and over until they fuse."
    },
    'merged2': {
        title: "MERGED ENDING 2",
        color: "#9C27B0",
        description: "Blue and Red fused into a single intense purple cube after a brutal kick.",
        hint: "Make Blue slam into Red hard on the cliff."
    },
    'run': {
        title: "RUN ENDING",
        color: "#4CAF50",
        description: "The green square escaped to the far left.",
        hint: "Move Green all the way off the left side of the land."
    },
    'nvm': {
        title: "NVM ENDING",
        color: "#F44336",
        description: "The red square gave up and retreated far left.",
        hint: "Let Red walk all the way off the left side."
    },
    'sad_ending': {
        title: "SAD ENDING",
        color: "#A9A9A9",
        description: "The chill brown square fell into the water.",
        hint: "Throw Brown into the water."
    },
    'chapter2_death': {
        title: "LAVA DEATH",
        color: "#FF4500",
        description: "Red watched his rival Green melt slowly into the boiling lava.",
        hint: "Let Green fall into the lava in Chapter 2."
    },
    'revenge': {
        title: "REVENGE ENDING",
        color: "#007FFF",
        description: "The Blue Cube, Red's old victim, achieved ultimate revenge.",
        hint: "Use Blue to make Red die instead of Green."
    },
    'revenge_died': {
        title: "VERY BAD ENDING",
        color: "#003366",
        description: "The Blue Cube fell into the lake alone and drowned.",
        hint: "Let only Blue fall into the water."
    },
    'explosion': {
        title: "CAGE EXPLOSION ENDING",
        color: "#B71C1C",
        description: "Green failed to break the cage in time and was destroyed by Red's trap.",
        hint: "Stay trapped in the Chapter 3 cage until the timer runs out."
    },
    'escape': {
        title: "ESCAPE ENDING",
        color: "#64DD17",
        description: "Green successfully broke out of the cage before it exploded.",
        hint: "Break the cage bars and touch the floor before the bomb timer hits 0."
    },
    'boat': {
        title: "BOAT ENDING",
        color: "#2196F3",
        description: "You timed your jump perfectly and landed safely in the passing boat.",
        hint: "Jump Green into the boat as it sails past on the water."
    },
    'red_boat': {
        title: "RED BOAT ENDING",
        color: "#F44336",
        description: "Red sailed away instead of fighting, escaping on the boat.",
        hint: "Make Red land on the boat."
    },
    'blue_boat': {
        title: "BLUE BOAT ENDING",
        color: "#1E88E5",
        description: "Blue cooled off and took a relaxing ride on the boat.",
        hint: "Drop Blue onto the boat."
    },
    'brown_boat': {
        title: "BROWN BOAT ENDING",
        color: "#6D4C41",
        description: "Chill Brown found the coziest spot on the passing boat.",
        hint: "Drop Brown onto the boat."
    },
    'baldi': {
        title: "BALDI ENDING",
        color: "#CDDC39",
        description: "You found the ruler, empowered Green, and transformed into Baldi.",
        hint: "Touch the ruler with Green in Brown’s house."
    },
    'red_baldi': {
        title: "RED BALDI ENDING",
        color: "#E53935",
        description: "Red stole the ruler and became a terrifying Baldi variant.",
        hint: "Let Red get the ruler."
    },
    'blue_baldi': {
        title: "BLUE BALDI ENDING",
        color: "#1E88E5",
        description: "Blue claimed the ruler and turned into a vengeful Baldi.",
        hint: "Give the ruler to Blue."
    },
    'brown_baldi': {
        title: "BROWN BALDI ENDING",
        color: "#6D4C41",
        description: "Chill Brown got the ruler and became an unexpectedly strict Baldi.",
        hint: "Push the ruler into Brown."
    },
    'blue_space': {
        title: "BLUE SPACE ENDING",
        color: "#1565C0",
        description: "You launched Blue so high it drifted forever into space.",
        hint: "Throw Blue off the top of the screen."
    },
    'red_space': {
        title: "RED SPACE ENDING",
        color: "#C62828",
        description: "Red’s rage took it all the way into orbit.",
        hint: "Launch Red very high without using the freezer."
    },
    'orange_space': {
        title: "ORANGE SPACE ENDING",
        color: "#FB8C00",
        description: "The chill one rocketed into space in a blaze of orange light.",
        hint: "Throw Brown so high he leaves the screen."
    },
    'green_cloud': {
        title: "GREEN CLOUD ENDING",
        color: "#A5D6A7",
        description: "Green relaxed as a fluffy cloud cube for a while.",
        hint: "Transform Green in the cloud machine and wait."
    },
    'red_cloud': {
        title: "RED CLOUD ENDING",
        color: "#EF9A9A",
        description: "Red simmered down into a brooding storm cloud cube.",
        hint: "Transform Red in the cloud machine and wait."
    },
    'blue_cloud': {
        title: "BLUE CLOUD ENDING",
        color: "#90CAF9",
        description: "Blue cooled off and floated around as a calm cloud cube.",
        hint: "Transform Blue in the cloud machine and wait."
    },
    'brown_cloud': {
        title: "BROWN CLOUD ENDING",
        color: "#BCAAA4",
        description: "Brown became the softest, sleepiest cloud cube imaginable.",
        hint: "Transform Brown in the cloud machine and wait."
    },

    'green_pop': {
        title: "GREEN POP OH NO",
        color: "#66BB6A",
        description: "You poked Green with a needle and it popped!",
        hint: "Touch Green with the needle."
    },
    'red_pop': {
        title: "RED POP OH NO",
        color: "#EF5350",
        description: "Red’s rage ended with a single POP from the needle.",
        hint: "Touch Red with the needle."
    },
    'blue_pop': {
        title: "BLUE POP OH NO",
        color: "#42A5F5",
        description: "Blue burst into tiny droplets after touching the needle.",
        hint: "Touch Blue with the needle."
    },
    'brown_pop': {
        title: "BROWN POP OH NO",
        color: "#8D6E63",
        description: "Even the chill Brown cube couldn’t survive the needle.",
        hint: "Touch Brown with the needle."
    },
    'cloud_pop': {
        title: "POP OH NO (CLOUD)",
        color: "#B3E5FC",
        description: "Your fluffy cloud cube got popped back into nothingness.",
        hint: "Pop a cloud-transformed cube with the needle."
    },
    'bad_cloud': {
        title: "BAD CLOUD ENDING",
        color: "#90A4AE",
        description: "Your transformed cloud cube sank sadly into the lake.",
        hint: "Throw a cloud cube into the water."
    },
    'space_cloud': {
        title: "SPACE CLOUD ENDING",
        color: "#B39DDB",
        description: "The cloud cube drifted so high it floated into space.",
        hint: "Send a cloud cube off the top of the screen."
    },
    'nvm_cloud': {
        title: "NVM CLOUD ENDING",
        color: "#FFCDD2",
        description: "In cloud mode, Red just floated back left and gave up.",
        hint: "Be in cloud mode and let Red drift to the far left."
    },
    'blue_nvm': {
        title: "BLUE NVM ENDING",
        color: "#1E88E5",
        description: "Blue backed out of the fight and floated off to the left.",
        hint: "Let Blue leave the cliff at the far left."
    },
    'new_character': {
        title: "NEW CHARACTER ENDING",
        color: "#CE93D8",
        description: "Red and Green merged in cloud mode and moved into Brown’s home as a new cloud character.",
        hint: "In cloud mode, fuse Red and Green together."
    },
    'cloud_baldi': {
        title: "CLOUD BALDI ENDING",
        color: "#FFF176",
        description: "Cloudy Green grabbed the ruler and became a floating Baldi in the sky.",
        hint: "As cloud Green, touch the ruler."
    },
    'robot': {
        title: "ROBOT INVASION ENDING",
        color: "#9E9E9E",
        description: "A swarm of 199 flying robots hunted down every cube after you touched the strange wall.",
        hint: "Find and touch the dark discolored wall near Brown’s house."
    },
    'last_second': {
        title: "LAST SECOND ENDING",
        color: "#00C853",
        description: "You grabbed Green out of the water at the very last moment!",
        hint: "Let Green touch the water and quickly drag him back up."
    },
    'flashbang': {
        title: "FLASHBANG ENDING",
        color: "#FCE4EC",
        description: "The pink cloud cube touched Green and everything went blinding white.",
        hint: "Touch Green with the pink cloud cube in Brown’s house."
    },
    'big_eye': {
        title: "BIG EYE ENDING",
        color: "#81D4FA",
        description: "You spun Green so much his eyes went huge, then froze him solid in the freezer.",
        hint: "Spin Green a lot, then shove him into the freezer."
    },
    'frozen_green': {
        title: "FROZEN GREEN CUBE",
        color: "#4FC3F7",
        description: "You locked Green in the freezer and turned him into an ice cube.",
        hint: "Put Green into the freezer without Big Eye active."
    },
    'frozen_red': {
        title: "FROZEN RED CUBE",
        color: "#EF5350",
        description: "The furious Red cube got shoved into the freezer and frozen in place.",
        hint: "Push Red into the freezer."
    },
    'frozen_blue': {
        title: "FROZEN BLUE CUBE",
        color: "#42A5F5",
        description: "Blue chilled out a little too hard in the freezer.",
        hint: "Push Blue into the freezer."
    },
    'frozen_brown': {
        title: "FROZEN BROWN CUBE",
        color: "#8D6E63",
        description: "Chill Brown became a permanently cold cube in the freezer.",
        hint: "Push Brown into the freezer."
    },
    'brown_sunglasses': {
        title: "NO SUNGLASSES ENDING",
        color: "#5D4037",
        description: "Red crashed into Brown so hard his sunglasses flew off and left him frowning.",
        hint: "Hit Brown with Red."
    },
    'mad': {
        title: "MAD ENDING",
        color: "#D32F2F",
        description: "You spun Red so much he went berserk and now nothing can calm him down.",
        hint: "Spin Red a lot or hold him too long until he gets aggressive."
    },

    // Yellow / friends endings
    'saddest': {
        title: "SADDEST ENDING",
        color: "#FBC02D",
        description: "You threw Yellow into the water and his TV time ended forever.",
        hint: "Throw Yellow into the water."
    },
    'yellow_baldi': {
        title: "YELLOW BALDI ENDING",
        color: "#FFEB3B",
        description: "Yellow grabbed the ruler and became the loudest Baldi in the room.",
        hint: "Let Yellow touch the ruler."
    },
    'tv_off': {
        title: "TV OFF ENDING",
        color: "#F57F17",
        description: "You turned off Yellow’s TV, he snapped, and punched straight through his own roof.",
        hint: "Click Yellow’s TV to turn it off and watch him react."
    },
    'yellow_space': {
        title: "YELLOW SPACE ENDING",
        color: "#FFF176",
        description: "Yellow flew so high in anger he drifted all the way into space.",
        hint: "Launch Yellow off the top of the screen."
    },
    'what_watching': {
        title: "WHAT ARE YOU WATCHING ENDING",
        color: "#FDD835",
        description: "Red crashed into Yellow, who had to explain his weird show in a speech bubble.",
        hint: "Throw Red at Yellow while he is watching TV."
    },

    'secret2': {
        title: "NOT SO SECRET ENDING 2",
        color: "#AED581",
        description: "You threw Green at Yellow and crashed his peaceful TV session.",
        hint: "Throw Green at Yellow’s house."
    },
    'friends': {
        title: "FRIENDS ENDING",
        color: "#FFCC80",
        description: "Red, Green, Blue, Yellow, Brown and the pink cloud all shared the same cliff together.",
        hint: "Put Red, Green, Blue, Yellow, Brown and the pink cloud together on the grass cliff."
    },

    // Cat endings
    'cat_very_sad': {
        title: "VERY VERY SAD ENDING",
        color: "#9E9E9E",
        description: "You threw Yellow’s pet cat into the lake and it sank.",
        hint: "Throw the cat cube into the water."
    },
    'cat_baldi': {
        title: "CAT BALDI ENDING",
        color: "#FFEE58",
        description: "The cat grabbed the ruler and turned into a strict Baldi cat.",
        hint: "Let the cat touch the ruler on Brown’s table."
    },
    'cat_space': {
        title: "SPACE CAT ENDING",
        color: "#BA68C8",
        description: "The cat flew so high it drifted away into space.",
        hint: "Throw the cat cube off the top of the screen."
    },
    'cat_evil': {
        title: "CAT IS EVIL ENDING",
        color: "#6A1B9A",
        description: "The cat shoved another cube into the lake on purpose.",
        hint: "Use the cat to push any cube into the lake."
    },
    'cat_yummy_fish': {
        title: "YUMMY FISH ENDING",
        color: "#4DD0E1",
        description: "The cat jumped down and ate a fish that leapt out of the water.",
        hint: "Wait for a fish to jump out of the water, then bump it with the cat."
    },
    'cat_nvm': {
        title: "CAT NVM ENDING",
        color: "#AB47BC",
        description: "You threw the cat back to the far left and it walked away from everything.",
        hint: "Push or throw the cat off the far left side of the land."
    },
    'cat_mad': {
        title: "MAD CAT ENDING",
        color: "#D81B60",
        description: "You spun the cat so fast it went completely mad.",
        hint: "Grab the cat and spin it at a very high speed."
    },
};

const ENDING_STORAGE_KEY = 'unlockedEndingsV1';
let unlockedEndings = new Set();

// Achievements
const ACHIEVEMENT_STORAGE_KEY = 'unlockedAchievementsV1';
const ACHIEVEMENT_PROGRESS_KEY = 'achievementProgressV1';

const ACHIEVEMENTS = {
    pool_party: {
        title: 'Pool Party',
        description: 'Have all unique cubes drown in the lake in separate games.'
    },
    broken_ruler: {
        title: 'Broken Ruler?',
        description: 'Throw the ruler into the lake.'
    },
    freeze_candy: {
        title: 'Freeze Dried Candy',
        description: 'Freeze a cloud cube in the freezer.'
    },
    good_day: {
        title: 'Good Day',
        description: 'Get the Stalemate Ending 10 times in a row.'
    },
    too_long: {
        title: "You're taking too long!",
        description: 'Turn off the stalemate ending and wait 60 minutes.'
    },
    resetii: {
        title: 'Resetii',
        description: 'Reset all unlocked endings.'
    },
    music_note: {
        title: '🎶',
        description: 'Touch Green with Red, leave them on the grass, and wait 30 seconds.'
    },
    weak_cube: {
        title: 'Weak Cube',
        description: 'Turn off Yellow’s TV but avoid his TV and roof endings.'
    },
    why: {
        title: 'Why?',
        description: 'Drown Green in the lake while you are holding him with the mouse.'
    }
};

let unlockedAchievements = new Set();
let achievementProgress = {
    poolPartyCubes: [],   // e.g. ['green','red',...]
    stalemateStreak: 0
};

// Runtime-only flags
let tooLongAchievementGiven = false;
let lastRedGreenTouchTime = 0;
let musicNoteArmed = false;
let weakCubeEligible = false;
let weakCubeDone = false;

function loadUnlockedEndings() {
    try {
        const raw = localStorage.getItem(ENDING_STORAGE_KEY);
        if (!raw) {
            unlockedEndings = new Set();
            return;
        }
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
            unlockedEndings = new Set(arr);
        } else {
            unlockedEndings = new Set();
        }
    } catch (e) {
        console.error('Failed to load unlocked endings', e);
        unlockedEndings = new Set();
    }
}

function loadAchievements() {
    try {
        const raw = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                unlockedAchievements = new Set(arr);
            }
        }
    } catch (e) {
        unlockedAchievements = new Set();
    }

    try {
        const rawProg = localStorage.getItem(ACHIEVEMENT_PROGRESS_KEY);
        if (rawProg) {
            const obj = JSON.parse(rawProg);
            if (obj && typeof obj === 'object') {
                achievementProgress.poolPartyCubes = Array.isArray(obj.poolPartyCubes) ? obj.poolPartyCubes : [];
                achievementProgress.stalemateStreak = typeof obj.stalemateStreak === 'number' ? obj.stalemateStreak : 0;
            }
        }
    } catch (e) {
        achievementProgress = {
            poolPartyCubes: [],
            stalemateStreak: 0
        };
    }
}

function saveAchievements() {
    try {
        localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(Array.from(unlockedAchievements)));
        localStorage.setItem(ACHIEVEMENT_PROGRESS_KEY, JSON.stringify(achievementProgress));
    } catch (e) {
        console.error('Failed to save achievements', e);
    }
}

function saveUnlockedEndings() {
    try {
        localStorage.setItem(ENDING_STORAGE_KEY, JSON.stringify(Array.from(unlockedEndings)));
    } catch (e) {
        console.error('Failed to save unlocked endings', e);
    }
}

// --- Audio & Splash Helpers ---

function initAudio() {
    try {
        backgroundMusic = new Audio('/endinggamesong.wav');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.4;

        splashSound = new Audio('/splash.ogg');
        splashSound.volume = 0.7;

        hitSound = new Audio('/Minecraft - Hit (Sound Effect).mp3');
        hitSound.volume = 0.8;

        vineboomSound = new Audio('/vineboom.mp3');
        vineboomSound.volume = 0.9;

        achievementBeep = new Audio('/achievement-beep.mp3');
        achievementBeep.volume = 0.7;
    } catch (e) {
        console.error('Audio initialization failed', e);
    }
}

function playSplashSound() {
    if (!splashSound) return;
    try {
        const sfx = splashSound.cloneNode();
        sfx.volume = splashSound.volume;
        sfx.play().catch(() => {});
    } catch (e) {
        console.error('Failed to play splash sound', e);
    }
}

// Ensure music starts on first interaction with the game
let musicStarted = false;
function setupMusicInteraction() {
    const startMusic = () => {
        if (musicStarted || !backgroundMusic) return;
        musicStarted = true;
        backgroundMusic.play().catch(() => {});
        gameContainer.removeEventListener('pointerdown', startMusic);
    };
    gameContainer.addEventListener('pointerdown', startMusic);
}

// Custom cursor switching between up/down textures
function setupCustomCursor() {
    const setMouseDownCursor = () => {
        document.body.style.cursor = 'default';
    };
    const setMouseUpCursor = () => {
        document.body.style.cursor = 'default';
    };

    window.addEventListener('pointerdown', setMouseDownCursor);
    window.addEventListener('pointerup', setMouseUpCursor);
    window.addEventListener('pointercancel', setMouseUpCursor);
}

function addWaterSplash(x, y) {
    waterSplashes.push({
        x,
        y,
        startTime: engine.timing.timestamp
    });
}

function addImpactEffect(x, y) {
    impactEffects.push({
        x,
        y,
        startTime: engine.timing.timestamp
    });

    if (!hitSound) return;
    try {
        const sfx = hitSound.cloneNode();
        sfx.volume = hitSound.volume;
        sfx.play().catch(() => {});
    } catch (e) {
        console.error('Failed to play hit sound', e);
    }
}

// Big merge explosion effect and audio
function addMergeEffect(x, y, tintColor) {
    if (!engine) return;

    mergeEffects.push({
        x,
        y,
        color: tintColor,
        startTime: engine.timing.timestamp
    });

    if (!vineboomSound) return;
    try {
        const boom = vineboomSound.cloneNode();
        boom.volume = vineboomSound.volume;
        boom.play().catch(() => {});
    } catch (e) {
        console.error('Failed to play vine boom sound', e);
    }
}

 // DOM Elements
const gameContainer = document.getElementById('game-container');
const endingScreen = document.getElementById('ending-screen');
const logoCircle = document.querySelector('.logo-circle');
const endingTitle = document.getElementById('ending-title');
const endingDescription = document.getElementById('ending-description');
const restartBtn = document.getElementById('restart-btn');
const suggestionModal = document.getElementById('suggestion-modal');
const suggestBtn = document.getElementById('suggest-btn');
const cancelSuggestionBtn = document.getElementById('cancel-suggestion');
const submitSuggestionBtn = document.getElementById('submit-suggestion');
const suggestionText = document.getElementById('suggestion-text');
const toggleStalemateBtn = document.getElementById('toggle-stalemate-btn');
const toggleCloudEndingBtn = document.getElementById('toggle-cloud-ending-btn');
const hardResetBtn = document.getElementById('hard-reset-btn');

if (logoCircle) {
    logoCircle.addEventListener('click', () => {
        window.location.href = 'homeandwikiandetc.html';
    });
}

// Chapter Buttons
const startChapter1Btn = document.getElementById('start-chapter1-btn');
const startChapter2Btn = document.getElementById('start-chapter2-btn');
const startChapter3Btn = document.getElementById('start-chapter3-btn');

// New Ending List Elements
const endingListModal = document.getElementById('ending-list-modal');
const showEndingsBtn = document.getElementById('show-endings-btn');
const closeEndingsListBtn = document.getElementById('close-endings-list');
const endingsListContainer = document.getElementById('endings-list');
const resetProgressBtn = document.getElementById('reset-progress-btn');
const resetOverlay = document.getElementById('reset-overlay');

// Achievement list modal elements
const showAchievementsBtn = document.getElementById('show-achievements-btn');
const achievementListModal = document.getElementById('achievement-list-modal');
const achievementsListContainer = document.getElementById('achievements-list');
const closeAchievementsListBtn = document.getElementById('close-achievements-list');

// Achievement toast UI
let achievementToastEl = null;
let achievementToastTimeout = null;

function ensureAchievementToastElement() {
    if (achievementToastEl) return;
    achievementToastEl = document.createElement('div');
    achievementToastEl.id = 'achievement-toast';
    achievementToastEl.className = 'hidden';
    document.body.appendChild(achievementToastEl);
}

function showAchievementToast(id) {
    const data = ACHIEVEMENTS[id];
    if (!data) return;
    ensureAchievementToastElement();

    achievementToastEl.innerHTML = `
        <div class="achievement-title">Achievement Unlocked</div>
        <div class="achievement-name">${data.title}</div>
        <div class="achievement-desc">${data.description}</div>
    `;
    achievementToastEl.classList.remove('hidden');

    if (achievementToastTimeout) {
        clearTimeout(achievementToastTimeout);
    }
    achievementToastTimeout = setTimeout(() => {
        achievementToastEl.classList.add('hidden');
    }, 3500);
}

function unlockAchievement(id) {
    if (!ACHIEVEMENTS[id]) return;
    if (unlockedAchievements.has(id)) return;
    unlockedAchievements.add(id);
    saveAchievements();

    // Play beep
    if (achievementBeep) {
        try {
            const sfx = achievementBeep.cloneNode();
            sfx.volume = achievementBeep.volume;
            sfx.play().catch(() => {});
        } catch (e) {}
    }

    showAchievementToast(id);
}

// Init Game
function isResolutionSupported() {
    return window.innerWidth >= MIN_WIDTH && window.innerHeight >= MIN_HEIGHT;
}

function init() {
    loadUnlockedEndings();
    loadAchievements();

    if (!isResolutionSupported()) {
        const errorScreen = document.getElementById('error-screen');
        if (errorScreen) errorScreen.classList.remove('hidden');
        return;
    }

    // Create engine
    engine = Engine.create();
    
    // Create renderer
    render = Render.create({
        element: gameContainer,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent' // We use CSS for sky
        }
    });

    // Create World
    setupGame(currentChapter); // Start Chapter 1 by default

    // Audio
    initAudio();
    setupMusicInteraction();

    // Set initial timer
    gameStartTime = engine.timing.timestamp;

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.4,
            render: {
                visible: false
            }
        },
        collisionFilter: {
            mask: 0xFFFFFFFF // allow dragging all interactive bodies, including blue
        }
    });

    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Set up custom cursor behavior
    setupCustomCursor();

    // Click-to-toggle TV for Yellow
    if (render && render.canvas) {
        render.canvas.addEventListener('click', (evt) => {
            if (!yellowTV || isGameOver) return;
            const rect = render.canvas.getBoundingClientRect();
            const x = evt.clientX - rect.left;
            const y = evt.clientY - rect.top;
            const point = { x, y };
            if (Matter.Bounds.contains(yellowTV.bounds, point) && !yellowMad) {
                yellowMad = true;
                yellowTVOffTime = engine.timing.timestamp;
                // Roof now explodes automatically when TV is turned off
                explodeYellowRoof();
                // Enable Weak Cube achievement path
                weakCubeEligible = true;
                weakCubeDone = false;
            }
        });
    }

    // Run the engine
    runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Game Loop Events
    Events.on(engine, 'beforeUpdate', updateGame);
    Events.on(render, 'afterRender', renderCustomScene);
    Events.on(engine, 'collisionStart', handleCollisionStart);
    
    // Resize handler
    window.addEventListener('resize', handleResize);
}

function setupGame(chapter) {
    // Reset global state for setup
    currentChapter = chapter;
    greenSquareInitialSize = SQUARE_SIZE;
    greenMeltingProgress = 0;
    cageExplosionTimer = 0;
    cageParts = [];
    blueActionInitiated = false;
    
    document.body.classList.toggle('chapter-2', chapter === 2 || chapter === 3); // Use chapter-2 style for chapter 3 too, it's a facility/lab
    
    Composite.clear(engine.world);
    if (engine) engine.gravity.y = 1; // Reset gravity

    if (chapter === 2) {
        setupChapter2World();
    } else if (chapter === 3) {
        setupChapter3World();
    } else {
        setupChapter1World();
    }
    
    gameStartTime = engine.timing.timestamp;
}

function setupChapter1World() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Platform (Grass/Dirt)
    // Located on the left, takes up about 60% of width
    PLATFORM_WIDTH = Math.min(width * 0.6, 500);
    const platformWidth = PLATFORM_WIDTH;
    const platformHeight = height * 0.5;
    const platformX = platformWidth / 2;

    // Water level is the kill zone/visual cutoff for the sea (0.85 of height)
    const waterLevel = height * 0.85; 

    // Calculate platform Y such that the bottom edge of the structure (platformY + platformHeight/2)
    // sits 20 pixels above the water line, fulfilling the request for 'bottom fake ground extend higher than the sea'.
    const platformY = waterLevel - 20 - (platformHeight / 2); 

    // Reconstruct Platform as a Hollow Box (Cave)
    // We used to have one big block. Now we need pieces.
    const wallThick = 60;
    
    // Top Surface (Grass)
    const topY = platformY - platformHeight/2 + wallThick/2;
    const platformTop = Bodies.rectangle(platformX, topY, platformWidth, wallThick, {
        isStatic: true,
        friction: 0.8,
        label: 'ground_top',
        render: { visible: false }
    });

    // Bottom Floor (Cave Floor)
    const bottomY = platformY + platformHeight/2 - wallThick/2;
    const platformBottom = Bodies.rectangle(platformX, bottomY, platformWidth, wallThick, {
        isStatic: true,
        label: 'ground',
        render: { visible: false }
    });

    // Left Wall (Back of cave)
    const leftX = platformX - platformWidth/2 + wallThick/2;
    // height adjustment to fit between top and bottom
    const sideHeight = platformHeight - (wallThick * 2); 
    const platformLeft = Bodies.rectangle(leftX, platformY, wallThick, sideHeight, {
        isStatic: true,
        label: 'ground',
        render: { visible: false }
    });

    // Right Wall (The Fake Wall / Secret Entrance)
    // It is a Sensor, so objects pass through, but we will render it as solid dirt.
    const rightX = platformX + platformWidth/2 - wallThick/2;
    const platformRightFake = Bodies.rectangle(rightX, platformY, wallThick, sideHeight, {
        isStatic: true,
        isSensor: true, // GHOST WALL
        label: 'fake_ground',
        render: { visible: false }
    });

    platformParts = [platformTop, platformBottom, platformLeft, platformRightFake];

    // Secret discolored wall at bottom-left of Brown's hut (robot trigger)
    const secretWallWidth = 40;
    const secretWallHeight = 60;
    const secretWallX = platformLeft.position.x + secretWallWidth / 2;
    const secretWallY = platformBottom.position.y - secretWallHeight / 2;
    const robotSecretWall = Bodies.rectangle(secretWallX, secretWallY, secretWallWidth, secretWallHeight, {
        isStatic: true,
        isSensor: true,
        label: 'robot_wall',
        render: { visible: false }
    });
    platformParts.push(robotSecretWall);

    // Brown Square (Secret Character)
    // Sitting inside the cave
    const brownSize = SQUARE_SIZE;
    brownSquare = Bodies.rectangle(platformX, bottomY - wallThick/2 - brownSize/2, brownSize, brownSize, {
        restitution: 0.2,
        friction: 0.8,
        density: 0.005,
        render: { fillStyle: '#8D6E63' }, // Brown
        label: 'brown'
    });

    // New cloud character automatically living in Brown's house
    const cloudCharacterY = brownSquare.position.y - brownSize - 10;
    const cloudCharacter = Bodies.rectangle(platformX, cloudCharacterY, SQUARE_SIZE, SQUARE_SIZE, {
        isStatic: false, // Make it draggable / movable
        frictionAir: 0.1,
        restitution: 0.2,
        render: { fillStyle: '#CE93D8' },
        label: 'cloud_character'
    });

    // Furniture in Brown's house: bed and bedside table
    const bedWidth = 140;
    const bedHeight = 25;
    const bedX = platformX - 60; // keep bed on the left side
    const bedY = brownSquare.position.y + brownSize / 2 + bedHeight / 2 + 10;
    const bed = Bodies.rectangle(bedX, bedY, bedWidth, bedHeight, {
        isStatic: true,
        label: 'bed',
        render: { visible: false }
    });

    const tableWidth = 40;
    const tableHeight = 20;
    // Move the bedside table (and ruler) to the far right side of Brown's house
    const tableX = platformX + platformWidth / 2 - wallThick - tableWidth / 2 - 10;
    const tableY = brownSquare.position.y + brownSize / 2 + tableHeight / 2 + 5;
    const bedTable = Bodies.rectangle(tableX, tableY, tableWidth, tableHeight, {
        isStatic: true,
        label: 'bed_table',
        render: { visible: false }
    });

    // Ruler (for Baldi endings) - appears on the far bedside table
    const rulerWidth = 80;
    const rulerHeight = 10;
    const rulerX = tableX;
    const rulerY = tableY - tableHeight / 2 - rulerHeight / 2 - 2;
    ruler = Bodies.rectangle(rulerX, rulerY, rulerWidth, rulerHeight, {
        restitution: 0.1,
        friction: 0.6,
        density: 0.001,
        render: { fillStyle: '#FFD54F' },
        label: 'ruler'
    });

    // Cloud Transformer Machine moved to the right side of the screen
    const machineWidth = 80;
    const machineHeight = 40;
    const machineX = window.innerWidth - 150;
    const machineY = topY - 40;
    cloudMachine = Bodies.rectangle(machineX, machineY, machineWidth, machineHeight, {
        isStatic: true,
        label: 'cloud_machine',
        render: { visible: false }
    });

    // Wooden ledge near the water for the freezer (like the boat ledge)
    const freezerWidth = machineWidth + 20;
    const freezerHeight = 40;
    const ledgeWidth = 160;
    const ledgeHeight = 20;

    const ledgeX = window.innerWidth - 180;
    const ledgeY = waterLevel - 80;

    const freezerX = ledgeX;
    const freezerY = ledgeY - ledgeHeight / 2 - freezerHeight / 2;

    const freezerLedge = Bodies.rectangle(ledgeX, ledgeY, ledgeWidth, ledgeHeight, {
        isStatic: true,
        label: 'freezer_ledge',
        render: { visible: false }
    });

    freezerBody = Bodies.rectangle(freezerX, freezerY, freezerWidth, freezerHeight, {
        isStatic: true,
        isSensor: true,
        label: 'freezer',
        render: { visible: false }
    });

    // --- Yellow's ledge and house near the freezer ---

    // Small wooden ledge for Yellow near the freezer, but not touching it
    const yellowLedgeWidth = 140;
    const yellowLedgeHeight = 20;
    const yellowLedgeX = freezerX - freezerWidth - yellowLedgeWidth / 2 - 40;
    const yellowLedgeY = freezerY + freezerHeight / 2 - yellowLedgeHeight / 2;
    const yellowLedge = Bodies.rectangle(yellowLedgeX, yellowLedgeY, yellowLedgeWidth, yellowLedgeHeight, {
        isStatic: true,
        label: 'yellow_ledge',
        render: { visible: false }
    });

    // Yellow's small house (walls + roof) on that ledge
    // Make Yellow's house large, similar in scale to Brown's cave
    const houseWidth = PLATFORM_WIDTH; 
    const houseHeight = 200;
    const houseWallThickness = 10;
    const houseCenterX = yellowLedgeX;
    const houseCenterY = yellowLedgeY - yellowLedgeHeight / 2 - houseHeight / 2;

    const yellowLeftWall = Bodies.rectangle(
        houseCenterX - houseWidth / 2 + houseWallThickness / 2,
        houseCenterY,
        houseWallThickness,
        houseHeight,
        { isStatic: true, label: 'yellow_house_wall', render: { visible: false } }
    );

    const yellowRightWall = Bodies.rectangle(
        houseCenterX + houseWidth / 2 - houseWallThickness / 2,
        houseCenterY,
        houseWallThickness,
        houseHeight,
        { isStatic: true, label: 'yellow_house_wall', render: { visible: false } }
    );

    // House roof that Yellow can break
    yellowRoof = Bodies.rectangle(
        houseCenterX,
        houseCenterY - houseHeight / 2,
        houseWidth,
        houseWallThickness,
        { isStatic: true, label: 'yellow_roof', render: { visible: false } }
    );

    // TV inside Yellow's house
    const tvWidth = 30;
    const tvHeight = 20;
    const tvX = houseCenterX;
    const tvY = houseCenterY; // center of house
    yellowTV = Bodies.rectangle(tvX, tvY, tvWidth, tvHeight, {
        isStatic: true,
        isSensor: true,
        label: 'yellow_tv',
        render: { visible: false }
    });

    // Yellow cube, sitting on his ledge, watching TV
    yellowSquare = Bodies.rectangle(
        yellowLedgeX,
        yellowLedgeY - yellowLedgeHeight / 2 - SQUARE_SIZE / 2,
        SQUARE_SIZE,
        SQUARE_SIZE,
        {
            restitution: 0.2,
            friction: 0.5,
            density: 0.003,
            render: { fillStyle: '#FFEB3B' },
            label: 'yellow'
        }
    );

    // Cat cube sitting in Yellow's house with him
    catSquare = Bodies.rectangle(
        yellowLedgeX + SQUARE_SIZE + 10,
        yellowLedgeY - yellowLedgeHeight / 2 - SQUARE_SIZE / 2,
        SQUARE_SIZE * 0.9,
        SQUARE_SIZE * 0.9,
        {
            restitution: 0.25,
            friction: 0.6,
            density: 0.003,
            render: { fillStyle: '#D1C4E9' },
            label: 'cat'
        }
    );

    yellowMad = false;
    yellowTVOffTime = 0;
    yellowWhatWatchingTime = 0;
    catMad = false;
    catSpinEnergy = 0;
    catMadStartTime = 0;
    catFallenTime = 0;
    lastCatPushVictimId = null;
    lastCatPushTime = 0;
    fishBody = null;
    fishSpawnTime = 0;
    nextFishSpawnTime = engine.timing.timestamp + 8000 + Math.random() * 8000;

    // Needle next to the machine
    const needleWidth = 10;
    const needleHeight = 30;
    const needleX = machineX + machineWidth / 2 + 20;
    const needleY = machineY;
    needle = Bodies.rectangle(needleX, needleY, needleWidth, needleHeight, {
        isStatic: true,
        label: 'needle',
        render: { visible: false }
    });

    // Green Square (Player/Victim)
    const squareSize = SQUARE_SIZE;
    
    // Position Green Square near the right edge of the top platform
    const edgeBuffer = 20; 
    const greenX = platformWidth - (squareSize / 2) - edgeBuffer; 
    // Start on top of the top platform
    const startY = topY - wallThick/2 - squareSize/2;

    greenSquare = Bodies.rectangle(greenX, startY, squareSize, squareSize, {
        restitution: 0.2,
        friction: 0.5,
        density: 0.002,
        render: {
            fillStyle: '#4CAF50'
        },
        label: 'green'
    });

    // Define a safe X coordinate well inside the platform structure for starting squares
    // Moved further right so Blue doesn't instantly trigger the BLUE NVM ending at the left edge
    const SAFE_START_X = wallThick + 2 * SQUARE_SIZE; // 60 + 2*75 = 210

    // Red Square (Enemy)
    const redX = SAFE_START_X; 
    redSquare = Bodies.rectangle(redX, startY, SQUARE_SIZE, SQUARE_SIZE, {
        restitution: 0.2,
        friction: 0.5,
        density: 0.005, // Heavier
        render: {
            fillStyle: '#F44336'
        },
        label: 'red'
    });

    const bodiesToAdd = [...platformParts, brownSquare, greenSquare, redSquare, cloudCharacter];

    // Add Brown's furniture and ruler
    bodiesToAdd.push(bedTable, bed);
    if (freezerBody) bodiesToAdd.push(freezerBody);
    // Add wooden ledge for the freezer if it exists
    if (typeof freezerLedge !== 'undefined' && freezerLedge) bodiesToAdd.push(freezerLedge);
    if (ruler) bodiesToAdd.push(ruler);
    if (cloudMachine) bodiesToAdd.push(cloudMachine);
    if (needle) bodiesToAdd.push(needle);
    bodiesToAdd.push(yellowLedge, yellowLeftWall, yellowRightWall, yellowRoof, yellowTV, yellowSquare, catSquare);

    // Blue Square (Revenge Seeker) - 20% chance to appear in Chapter 1
    if (Math.random() < 0.20) {
        // Position Blue behind Red (smaller X value), but still safely away from the far left edge
        const blueX = SAFE_START_X - SQUARE_SIZE + 20; 
        blueSquare = Bodies.rectangle(blueX, startY, SQUARE_SIZE, SQUARE_SIZE, {
            restitution: 0.2,
            friction: 0.5,
            density: 0.004, // Slightly lighter than Red
            render: {
                fillStyle: '#007FFF' // Blue
            },
            label: 'blue'
        });
        bodiesToAdd.push(blueSquare);
    } else {
        blueSquare = null;
    }

    Composite.add(engine.world, bodiesToAdd);

    // Initialize boat spawn timing for Boat Ending (Chapter 1)
    const firstDelay = 2000 + Math.random() * 3000; // 2–5 seconds for first boat
    nextBoatSpawnTime = engine.timing.timestamp + firstDelay;
    boatBody = null;
    boatSpawnTime = 0;

    // Add boundaries (allowing left movement for endings)
    const wallThickness = 100;
    // Removed ceiling to allow throwing enemies into space
    // Left wall is now a sensor so cubes can pass through to trigger the run/nvm endings
    const leftWall = Bodies.rectangle(-wallThickness/2, height/2, wallThickness, height * 10, { isStatic: true, isSensor: true, render: { visible: false } });
    // Right wall is far away so you can push them off
    const rightWall = Bodies.rectangle(width + wallThickness/2, height/2, wallThickness, height * 10, { isStatic: true, render: { visible: false } });

    Composite.add(engine.world, [leftWall, rightWall]);

    // Define Prison Bounds (The Cave Interior)
    prisonBounds = {
        minX: platformX - platformWidth/2 + wallThick,
        maxX: platformX + platformWidth/2 - wallThick,
        minY: platformY - platformHeight/2 + wallThick,
        maxY: platformY + platformHeight/2 - wallThick
    };
}

function setupChapter2World() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Reset gravity for lab environment
    engine.gravity.y = 1; 

    // --- Lab Structure ---
    const wallThick = 50;
    
    // Floor (Bottom) - Hidden by lava
    const floor = Bodies.rectangle(width / 2, height + wallThick / 2, width, wallThick, { isStatic: true, label: 'floor_lab', render: { fillStyle: '#111' } });
    
    // Walls
    const leftWall = Bodies.rectangle(wallThick / 2, height / 2, wallThick, height, { isStatic: true, label: 'wall_lab', render: { fillStyle: '#111' } });
    const rightWall = Bodies.rectangle(width - wallThick / 2, height / 2, wallThick, height, { isStatic: true, label: 'wall_lab', render: { fillStyle: '#111' } });
    const ceiling = Bodies.rectangle(width / 2, wallThick / 2, width, wallThick, { isStatic: true, label: 'ceiling_lab', render: { fillStyle: '#111' } });

    // Lava Zone (Sensor at bottom)
    const lavaHeight = height * 0.25;
    const lavaY = height - lavaHeight / 2;
    chapter2LavaSensor = Bodies.rectangle(width / 2, lavaY, width - wallThick * 2, lavaHeight, {
        isStatic: true,
        isSensor: true,
        label: 'lava_sensor',
        render: { visible: false } // Custom rendered later
    });
    
    // --- Characters & Platform ---

    // Red Square (Watcher, static)
    // Position Red on a small ledge on the right wall
    const redXPos = width - wallThick - SQUARE_SIZE/2;
    const redYPos = height * 0.4;
    redSquare = Bodies.rectangle(redXPos, redYPos, SQUARE_SIZE, SQUARE_SIZE, {
        isStatic: true, // Red is watching, not fighting
        render: { fillStyle: '#F44336' },
        label: 'red'
    });
    
    // Floating Platform
    const platformWidth = width / 3;
    const platformHeight = 20;
    const platformYStart = height * 0.3;
    chapter2FloatingPlatform = Bodies.rectangle(width / 2, platformYStart, platformWidth, platformHeight, {
        isStatic: true,
        label: 'floating_platform',
        render: { fillStyle: '#616161' } // Grey lab platform
    });
    
    // Green Square (Victim)
    greenSquare = Bodies.rectangle(width / 2, platformYStart - SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, {
        restitution: 0.2,
        friction: 0.5,
        density: 0.002,
        render: { fillStyle: '#4CAF50' },
        label: 'green'
    });
    
    // Blue Square (Revenge Seeker) - 50% chance to appear in Chapter 2
    const bodiesToAdd = [floor, leftWall, rightWall, ceiling, chapter2LavaSensor, chapter2FloatingPlatform, redSquare, greenSquare];
    
    if (Math.random() < 0.50) {
        // Start Blue high up on the opposite side
        const blueXPos = wallThick + SQUARE_SIZE/2;
        const blueYPos = height * 0.2;
        blueSquare = Bodies.rectangle(blueXPos, blueYPos, SQUARE_SIZE, SQUARE_SIZE, {
            restitution: 0.2,
            friction: 0.5,
            density: 0.004,
            render: { fillStyle: '#007FFF' },
            label: 'blue'
        });
        bodiesToAdd.push(blueSquare);
    } else {
        blueSquare = null;
    }
    
    // Brown Square is not present in Chapter 2
    brownSquare = null;
    
    Composite.add(engine.world, bodiesToAdd);
    
    // Make green square controllable by mouse constraint
    // We don't remove mouse constraint, so it will automatically be applied if user clicks greenSquare

    // Chapter 2: boat is not used here anymore
}

function setupChapter3World() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Set environment (Gravity still 1)
    engine.gravity.y = 1;

    // --- Outer Lab/Containment Structure ---
    const wallThick = 50;
    
    const floor = Bodies.rectangle(width / 2, height - wallThick / 2, width, wallThick, { isStatic: true, label: 'floor_lab', render: { fillStyle: '#111' } });
    const leftWall = Bodies.rectangle(wallThick / 2, height / 2, wallThick, height, { isStatic: true, label: 'wall_lab', render: { fillStyle: '#111' } });
    const rightWall = Bodies.rectangle(width - wallThick / 2, height / 2, wallThick, height, { isStatic: true, label: 'wall_lab', render: { fillStyle: '#111' } });
    const ceiling = Bodies.rectangle(width / 2, wallThick / 2, width, wallThick, { isStatic: true, label: 'ceiling_lab', render: { fillStyle: '#111' } });
    
    const bodiesToAdd = [floor, leftWall, rightWall, ceiling];

    // --- Cage Definition ---
    const cageSize = 200;
    const barWidth = 10;
    const center = { x: width / 2, y: height / 2 };
    
    // Create cage bars (thin dynamic rectangles)
    const cageMaterialOptions = {
        restitution: 0.1,
        friction: 0.9,
        density: 0.05, // Heavy and breakable
        label: 'cage_bar',
        render: { fillStyle: '#A52A2A' } // Rusty brown/red bars
    };

    // 4 vertical bars
    const offsets = [-cageSize/2 + barWidth, -cageSize/6, cageSize/6, cageSize/2 - barWidth];
    
    offsets.forEach(offset => {
        const bar = Bodies.rectangle(center.x + offset, center.y, barWidth, cageSize, cageMaterialOptions);
        cageParts.push(bar);
    });

    // 4 horizontal bars
    offsets.forEach(offset => {
        const bar = Bodies.rectangle(center.x, center.y + offset, cageSize, barWidth, cageMaterialOptions);
        cageParts.push(bar);
    });
    
    // Green Square (Trapped)
    greenSquare = Bodies.rectangle(center.x, center.y, SQUARE_SIZE, SQUARE_SIZE, {
        restitution: 0.5,
        friction: 0.5,
        density: 0.002, // Light and movable
        render: { fillStyle: '#4CAF50' },
        label: 'green'
    });
    
    // Red Square (Watcher, outside the cage)
    // Position Red on the left wall ledge
    const redXPos = wallThick + SQUARE_SIZE/2;
    const redYPos = height * 0.4;
    redSquare = Bodies.rectangle(redXPos, redYPos, SQUARE_SIZE, SQUARE_SIZE, {
        isStatic: true, // Red is watching
        render: { fillStyle: '#F44336' },
        label: 'red'
    });
    
    // Add all to world
    bodiesToAdd.push(...cageParts, greenSquare, redSquare);
    Composite.add(engine.world, bodiesToAdd);

    blueSquare = null; // Blue is not present here
}

function updateChapter3Game() {
    if (isGameOver || !greenSquare || cageParts.length === 0) return;
    
    const now = engine.timing.timestamp;

    // Start timer upon entry
    if (cageExplosionTimer === 0) {
        cageExplosionTimer = now;
    }
    
    const timeElapsed = now - cageExplosionTimer;
    
    // Check for Explosion Ending
    if (timeElapsed >= CAGE_TIME_LIMIT_MS) {
        // Trigger explosion ending, potentially with visual flair later
        triggerEnding('explosion');
        return;
    }

    // Check for Escape Ending (Green breaks out)
    // The cage is made of dynamic bodies. 
    
    // Check if Green is far enough from the center AND touching the ground (meaning the escape is complete)
    const cageCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const greenPos = greenSquare.position;
    
    const distanceSquared = (greenPos.x - cageCenter.x)**2 + (greenPos.y - cageCenter.y)**2;
    
    const isFarFromCage = Math.sqrt(distanceSquared) > 150;
    
    // Use Matter.Query to check if Green is touching the static floor body (label 'floor_lab')
    const isTouchingFloor = Query.collides(greenSquare, Composite.allBodies(engine.world).filter(b => b.label === 'floor_lab')).length > 0;

    // If Green has broken out and landed, they escaped.
    if (isFarFromCage && isTouchingFloor) {
        triggerEnding('escape');
        return;
    }
    
    // The bars will break if Green applies enough force. Green is dynamic, the bars are dynamic and heavy.
}


function updateChapter2Game() {
    if (isGameOver || !greenSquare || !chapter2FloatingPlatform || !chapter2LavaSensor) return;

    const now = engine.timing.timestamp;
    
    // 1. Platform Movement (Slowly descend)
    // Move platform down 0.1 units per frame
    const platformVelocityY = 0.05; 
    Body.translate(chapter2FloatingPlatform, { x: 0, y: platformVelocityY });

    // --- Blue Cube Revenge Action in Chapter 2 ---
    if (blueSquare) {
        // If the player is dragging Blue, stop his automatic revenge animation
        if (mouseConstraint && mouseConstraint.body === blueSquare) {
            Body.setVelocity(blueSquare, { x: 0, y: 0 });
            Body.setAngularVelocity(blueSquare, 0);
        } else {
            if (!blueActionInitiated) {
                // Trigger action after 5 seconds
                if (now - gameStartTime > 5000) { 
                    blueActionInitiated = true;
                    
                    // 1. Make Red dynamic so it can be pushed
                    Body.setStatic(redSquare, false);
                    
                    // 2. Make Blue jump/fly towards Red
                    const target = redSquare.position;
                    const bluePos = blueSquare.position;
                    
                    // Calculate vector towards Red
                    const dx = target.x - bluePos.x;
                    const dy = target.y - bluePos.y;
                    
                    // Apply large initial jump force
                    const totalForce = 0.05 * blueSquare.mass;
                    Body.applyForce(blueSquare, bluePos, { 
                        x: totalForce * Math.sign(dx), 
                        y: totalForce * 1.5 * Math.sign(dy) 
                    });
                }
            }
            
            // If Blue has reached Red, apply a final downward push on Red
            if (blueActionInitiated && redSquare && !redSquare.isStatic) {
                // Check collision using bounds query for more robust detection
                const collision = Query.collides(blueSquare, [redSquare])[0];
                
                if (collision) {
                     // Blue cube has hit Red cube! Apply decisive downward force on Red.
                     const dropForce = 0.1 * redSquare.mass;
                     Body.applyForce(redSquare, redSquare.position, { x: 0, y: dropForce });
                     
                     // Ensure Blue is also moving away/rebounding slightly
                     Body.applyForce(blueSquare, blueSquare.position, { x: -0.01 * blueSquare.mass * Math.sign(blueSquare.velocity.x), y: -0.01 * blueSquare.mass });
                }
            }
        }
    }


    // Check if Red has fallen into the lava (Chapter 2 Revenge Ending)
    const lavaTopY = chapter2LavaSensor.bounds.min.y;
    if (redSquare && redSquare.position.y > lavaTopY && !isGameOver) {
        // Red fell into the lava (due to Blue's push)
        if (greenMeltingProgress === 0 || redSquare.position.y > greenSquare.position.y) {
             triggerEnding('revenge');
             return;
        }
    }


    // 2. Check Lava Collision (Green)
    const lavaCollision = Query.collides(greenSquare, [chapter2LavaSensor])[0];
    
    if (lavaCollision) {
        // Green is touching lava. Start/continue melting process.
        
        // Ensure green is kinematic so it stops falling (it is now 'melting')
        Body.setStatic(greenSquare, true);
        Body.setVelocity(greenSquare, { x: 0, y: 0 });
        
        if (greenMeltingProgress === 0) {
            greenMeltingProgress = now;
        }

        const progress = Math.min(1, (now - greenMeltingProgress) / MELT_DURATION_MS);
        
        // Scale the green square down to simulate melting
        const currentSize = greenSquareInitialSize * (1 - progress * 0.9); // Reduce size to 10%
        
        if (progress < 1) {
            // Adjust scale of the square
            const scale = currentSize / (greenSquare.bounds.max.x - greenSquare.bounds.min.x); 
            Body.scale(greenSquare, scale, scale);
            
            // Adjust position so it melts downwards/stays on the surface
            Body.setPosition(greenSquare, {
                x: greenSquare.position.x,
                y: chapter2LavaSensor.bounds.min.y - currentSize / 2
            });
            
        } else {
            // Melting complete
            triggerEnding('chapter2_death');
            return;
        }
    } else if (greenMeltingProgress > 0) {
        // If Green was melting but is somehow pulled away 
        greenMeltingProgress = 0;
        Body.setStatic(greenSquare, false); 
    }
}

function handleCollisionStart(event) {
    const cubeLabels = new Set(['green', 'red', 'blue', 'brown', 'yellow', 'cat', 'merged', 'merged2', 'cloud_character']);
    const now = engine.timing.timestamp;

    for (const pair of event.pairs) {
        const aLabel = pair.bodyA.label;
        const bLabel = pair.bodyB.label;

        if (!cubeLabels.has(aLabel) || !cubeLabels.has(bLabel)) continue;

        // Use the first support point as the collision point
        const supports = pair.collision && pair.collision.supports;
        if (!supports || supports.length === 0) continue;

        const point = supports[0];
        addImpactEffect(point.x, point.y);
    }
}

function updateGame() {
    if (currentChapter === 2) {
        updateChapter2Game();
        return;
    }
    
    if (currentChapter === 3) {
        updateChapter3Game();
        return;
    }
    
    // --- Chapter 1 Game Loop starts here ---

    if (isGameOver || !greenSquare || !redSquare) return;

    const now = engine.timing.timestamp;

    // Your taking too long! achievement: stalemate off + 60 real minutes in one run
    if (!isStalemateEnabled && !tooLongAchievementGiven) {
        if (now - gameStartTime >= 60 * 60 * 1000) {
            unlockAchievement('too_long');
            tooLongAchievementGiven = true;
        }
    }

    // --- Robot Invasion Logic (Chapter 1 only) ---
    if (robotsSpawned) {
        // Make robots fly toward nearest target cube
        const targets = [greenSquare, redSquare, blueSquare, brownSquare].filter(b => !!b);
        const cloudCharacterBody = Composite.allBodies(engine.world).find(b => b.label === 'cloud_character');
        if (cloudCharacterBody) targets.push(cloudCharacterBody);

        const robotSpeed = 6;

        robotBodies = robotBodies.filter(body => !!body && !body.isSleeping);

        robotBodies.forEach(robot => {
            if (targets.length === 0) return;
            // Find nearest target
            let nearest = targets[0];
            let nearestDistSq = (robot.position.x - nearest.position.x) ** 2 + (robot.position.y - nearest.position.y) ** 2;
            for (let i = 1; i < targets.length; i++) {
                const t = targets[i];
                const dSq = (robot.position.x - t.position.x) ** 2 + (robot.position.y - t.position.y) ** 2;
                if (dSq < nearestDistSq) {
                    nearestDistSq = dSq;
                    nearest = t;
                }
            }
            const dx = nearest.position.x - robot.position.x;
            const dy = nearest.position.y - robot.position.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const vx = (dx / len) * robotSpeed;
            const vy = (dy / len) * robotSpeed;
            Body.setVelocity(robot, { x: vx, y: vy });

            // Check for robot contact with any cube to start transformation
            targets.forEach(target => {
                if (!target) return;
                const hit = Query.collides(robot, [target])[0];
                if (hit && !target.robotifiedAt) {
                    // Mark cube as starting to transform into a robot
                    target.robotifiedAt = now;
                    // Change its body color to metallic grey
                    if (target.render) {
                        target.render.fillStyle = '#9E9E9E';
                    }
                }
            });
        });

        // Trigger Robot ending 5 seconds after spawn
        if (!isGameOver && robotAttackStartTime > 0 && now - robotAttackStartTime >= 5000) {
            triggerEnding('robot');
            return;
        }
    }

    const redPos = redSquare.position;
    const greenPos = greenSquare.position;
    const catPos = catSquare ? catSquare.position : null;
    
    const waterLine = window.innerHeight * 0.85;

    // Update water splash lifetimes
    {
        const nowTime = now;
        for (let i = waterSplashes.length - 1; i >= 0; i--) {
            if (nowTime - waterSplashes[i].startTime > SPLASH_DURATION_MS) {
                waterSplashes.splice(i, 1);
            }
        }
    }
    
    // Secret robot wall trigger: touching spawns 199 robots
    if (!robotsSpawned) {
        const bodies = Composite.allBodies(engine.world);
        const robotWall = bodies.find(b => b.label === 'robot_wall');
        if (robotWall) {
            const cubes = [greenSquare, redSquare, blueSquare, brownSquare].filter(b => !!b);
            const cloudCharacterBody = bodies.find(b => b.label === 'cloud_character');
            if (cloudCharacterBody) cubes.push(cloudCharacterBody);

            let touched = false;
            for (const cube of cubes) {
                if (Query.collides(cube, [robotWall])[0]) {
                    touched = true;
                    break;
                }
            }
            if (touched) {
                spawnRobots();
            }
        }
    }

    // --- Yellow TV anger / roof / dance logic ---
    if (yellowSquare && !isGameOver) {
        // If Yellow is mad from TV off, make him keep jumping
        if (yellowMad) {
            Body.applyForce(yellowSquare, yellowSquare.position, { x: 0, y: -0.002 * yellowSquare.mass });
        }

        // Dance Ending: Green scared + spinning on Yellow's roof for 10 seconds
        if (yellowRoof && greenSquare) {
            const gPos = greenSquare.position;
            const yPos = yellowRoof.position;
            const horizontalOnRoof = Math.abs(gPos.x - yPos.x) < 100; // roughly over the house
            const verticalAboveRoof = gPos.y < yPos + 20;            // near or above roof line
            const scared = !!greenSquare.isFrowning;
            const spinning = Math.abs(greenSquare.angularVelocity) > 0.4;

            if (horizontalOnRoof && verticalAboveRoof && scared && spinning) {
                if (danceStartTime === 0) {
                    danceStartTime = now;
                } else if (now - danceStartTime >= 10000 && !isGameOver) {
                    triggerEnding('dance');
                    return;
                }
            } else {
                danceStartTime = 0;
            }
        } else {
            danceStartTime = 0;
        }

        // TV OFF ending: happens shortly after TV is turned off (roof already exploded on click)
        if (yellowTVOffTime > 0 && now - yellowTVOffTime >= 500) {
            triggerEnding('tv_off');
            return;
        }
    }

    // --- Cat spin / mad logic ---
    if (catSquare && !isGameOver) {
        if (mouseConstraint && mouseConstraint.body === catSquare) {
            const angVelCat = Math.abs(catSquare.angularVelocity);
            if (angVelCat > 0.25) {
                catSpinEnergy += angVelCat * 10;
            } else {
                catSpinEnergy = Math.max(0, catSpinEnergy - 1);
            }

            if (!catMad && catSpinEnergy > 220) {
                catMad = true;
                catMadStartTime = now;
            }
        } else {
            catSpinEnergy = Math.max(0, catSpinEnergy - 2);
        }

        if (catMad && catMadStartTime > 0 && now - catMadStartTime >= 2000 && !isGameOver) {
            triggerEnding('cat_mad');
            return;
        }
    }

    // --- Fish logic for Yummy Fish Ending ---
    if (!isGameOver) {
        if (!fishBody && nextFishSpawnTime > 0 && now >= nextFishSpawnTime) {
            const fishX = Math.random() * window.innerWidth;
            const waterLineLocal = window.innerHeight * 0.85;
            const fishSize = 30;
            fishBody = Bodies.rectangle(fishX, waterLineLocal + fishSize, fishSize, fishSize / 2, {
                isStatic: true,
                isSensor: true,
                label: 'fish',
                render: { visible: false }
            });
            fishSpawnTime = now;
            Composite.add(engine.world, fishBody);
        }

        if (fishBody) {
            const waterLineLocal = window.innerHeight * 0.85;
            const jumpDuration = 2500;
            const age = now - fishSpawnTime;
            const t = age / jumpDuration;

            let y;
            if (t < 0.5) {
                // Up
                y = waterLineLocal + 40 - t * 2 * 80;
            } else {
                // Down
                y = waterLineLocal + 40 - (1 - t) * 2 * 80;
            }
            Body.setPosition(fishBody, { x: fishBody.position.x, y });

            if (catSquare) {
                const hitFish = Query.collides(catSquare, [fishBody])[0];
                if (hitFish) {
                    triggerEnding('cat_yummy_fish');
                    Composite.remove(engine.world, fishBody);
                    fishBody = null;
                    nextFishSpawnTime = now + 12000 + Math.random() * 8000;
                    return;
                }
            }

            if (age >= jumpDuration) {
                Composite.remove(engine.world, fishBody);
                fishBody = null;
                nextFishSpawnTime = now + 12000 + Math.random() * 8000;
            }
        }
    }

    // --- Boat logic for Boat Ending ---
    if (!boatBody && nextBoatSpawnTime > 0 && now >= nextBoatSpawnTime) {
        const width = window.innerWidth;
        const boatWidth = 140;
        const boatHeight = 30;
        const startX = -boatWidth;
        const boatY = waterLine - boatHeight / 2 - 5; // float on water surface

        boatBody = Bodies.rectangle(startX, boatY, boatWidth, boatHeight, {
            isStatic: true,
            label: 'boat',
            render: { visible: false }
        });
        Composite.add(engine.world, boatBody);
        boatSpawnTime = now;
    }

    // Move active boat across the water and despawn after 5 seconds
    if (boatBody) {
        const boatDuration = 5000;
        const t = now - boatSpawnTime;

        const travelWidth = window.innerWidth + 300;
        const speed = travelWidth / boatDuration;

        Body.setPosition(boatBody, {
            x: -150 + speed * t,
            y: boatBody.position.y
        });

        // Check Boat Endings: character riding the boat while over water
        if (!isGameOver) {
            // Green boat ending
            const greenBoatCollision = greenSquare ? Query.collides(greenSquare, [boatBody])[0] : null;
            if (greenBoatCollision && greenPos.y > waterLine - SQUARE_SIZE && greenPos.y < waterLine + SQUARE_SIZE) {
                triggerEnding('boat');
                return;
            }

            // Red boat ending
            const redBoatCollision = redSquare ? Query.collides(redSquare, [boatBody])[0] : null;
            if (redBoatCollision && redSquare.position.y > waterLine - SQUARE_SIZE && redSquare.position.y < waterLine + SQUARE_SIZE) {
                triggerEnding('red_boat');
                return;
            }

            // Blue boat ending
            const blueBoatCollision = blueSquare ? Query.collides(blueSquare, [boatBody])[0] : null;
            if (blueBoatCollision && blueSquare.position.y > waterLine - SQUARE_SIZE && blueSquare.position.y < waterLine + SQUARE_SIZE) {
                triggerEnding('blue_boat');
                return;
            }

            // Brown boat ending
            const brownBoatCollision = brownSquare ? Query.collides(brownSquare, [boatBody])[0] : null;
            if (brownBoatCollision && brownSquare.position.y > waterLine - SQUARE_SIZE && brownSquare.position.y < waterLine + SQUARE_SIZE) {
                triggerEnding('brown_boat');
                return;
            }
        }

        if (t >= boatDuration) {
            Composite.remove(engine.world, boatBody);
            boatBody = null;
            const delay = 10000 + Math.random() * 20000; // 10–30 seconds between boats
            nextBoatSpawnTime = now + delay;
            boatSpawnTime = 0;
        }
    }

    // Check Baldi-style endings (any main character gets the ruler)
    if (ruler && !isGameOver) {
        const greenRulerCollision = Query.collides(greenSquare, [ruler])[0];
        if (greenRulerCollision) {
            if (isCloudMode && cloudTransformed === 'green') {
                triggerEnding('cloud_baldi');
            } else {
                triggerEnding('baldi');
            }
            return;
        }

        const redRulerCollision = redSquare ? Query.collides(redSquare, [ruler])[0] : null;
        if (redRulerCollision) {
            triggerEnding('red_baldi');
            return;
        }

        const blueRulerCollision = blueSquare ? Query.collides(blueSquare, [ruler])[0] : null;
        if (blueRulerCollision) {
            triggerEnding('blue_baldi');
            return;
        }

        const brownRulerCollision = brownSquare ? Query.collides(brownSquare, [ruler])[0] : null;
        if (brownRulerCollision) {
            triggerEnding('brown_baldi');
            return;
        }

        const catRulerCollision = catSquare ? Query.collides(catSquare, [ruler])[0] : null;
        if (catRulerCollision) {
            triggerEnding('cat_baldi');
            return;
        }
    }

    // --- Music note achievement arming (🎶) ---
    // Arm after Red touches Green while on grass
    if (!isGameOver) {
        const topBodyForMusic = Composite.allBodies(engine.world).find(b => b.label === 'ground_top');
        if (topBodyForMusic && lastRedGreenTouchTime > 0 && !musicNoteArmed) {
            const topY = topBodyForMusic.position.y;
            const yTol = SQUARE_SIZE;
            const onGrass = (cube) =>
                cube &&
                cube.position.y < topY + yTol &&
                cube.position.y > topY - yTol &&
                cube.position.x >= 0 &&
                cube.position.x <= PLATFORM_WIDTH;

            if (onGrass(greenSquare) && onGrass(redSquare)) {
                musicNoteArmed = true;
            } else {
                // If they moved away from grass before arming, clear timer
                if (engine.timing.timestamp - lastRedGreenTouchTime > 5000) {
                    lastRedGreenTouchTime = 0;
                }
            }
        }

        if (musicNoteArmed && engine.timing.timestamp - lastRedGreenTouchTime >= 30000) {
            const topBodyNow = Composite.allBodies(engine.world).find(b => b.label === 'ground_top');
            if (topBodyNow) {
                const topY = topBodyNow.position.y;
                const yTol = SQUARE_SIZE;
                const onGrassNow = (cube) =>
                    cube &&
                    cube.position.y < topY + yTol &&
                    cube.position.y > topY - yTol &&
                    cube.position.x >= 0 &&
                    cube.position.x <= PLATFORM_WIDTH;

                if (onGrassNow(greenSquare) && onGrassNow(redSquare)) {
                    unlockAchievement('music_note');
                }
            }
            musicNoteArmed = false;
            lastRedGreenTouchTime = 0;
        }
    }

    // Check Left Edge Endings
    // Trigger if the cube's center is within 35px of the left edge (SQUARE_SIZE/2 + 10 buffer)
    const leftEdgeXThreshold = SQUARE_SIZE / 2 + 10; 
    
    if (greenPos.x < leftEdgeXThreshold) {
        triggerEnding('run');
        return;
    }
    
    if (redPos.x < leftEdgeXThreshold) {
        if (isCloudMode) {
            triggerEnding('nvm_cloud');
        } else {
            triggerEnding('nvm');
        }
        return;
    }

    if (blueSquare && blueSquare.position.x < leftEdgeXThreshold) {
        triggerEnding('blue_nvm');
        return;
    }

    if (catSquare && catPos && catPos.x < leftEdgeXThreshold) {
        triggerEnding('cat_nvm');
        return;
    }

    // Check Stalemate Ending
    if (isStalemateEnabled && now - gameStartTime >= STALEMATE_DURATION_MS) {
        triggerEnding('stalemate');
        return;
    }

    // --- AI Logic for Red Square ---

    // Check Secret Ending (Green touches Brown)
    if (greenSquare && brownSquare) {
        const secretCollision = Query.collides(greenSquare, [brownSquare])[0];
        if (secretCollision) {
            triggerEnding('secret');
            return;
        }
    }

    // Not so secret ending 2: Green collides with Yellow
    if (!isGameOver && greenSquare && yellowSquare) {
        const secret2Hit = Query.collides(greenSquare, [yellowSquare])[0];
        if (secret2Hit) {
            triggerEnding('secret2');
            return;
        }
    }

    // Remove Brown's sunglasses ending: Red collides with Brown
    if (!isGameOver && redSquare && brownSquare) {
        const rbHit = Query.collides(redSquare, [brownSquare])[0];
        if (rbHit && brownSunglassesHitTime === 0) {
            brownSunglassesHitTime = now;
            brownSquare.noSunglasses = true;
            brownSquare.sad = true;
        }
    }
    if (brownSunglassesHitTime > 0 && !isGameOver && now - brownSunglassesHitTime >= 1000) {
        triggerEnding('brown_sunglasses');
        return;
    }

    // What are you watching ending: Red collides with Yellow
    if (!isGameOver && redSquare && yellowSquare) {
        const ryHit = Query.collides(redSquare, [yellowSquare])[0];
        if (ryHit && yellowWhatWatchingTime === 0) {
            yellowWhatWatchingTime = now;
            yellowSquare.sad = true;
        }
    }

    // Track cat pushing other cubes for Cat is Evil ending
    if (catSquare && !isGameOver) {
        const possibleVictims = [greenSquare, redSquare, blueSquare, brownSquare, yellowSquare].filter(b => !!b);
        for (const v of possibleVictims) {
            const hit = Query.collides(catSquare, [v])[0];
            if (hit) {
                lastCatPushVictimId = v.id;
                lastCatPushTime = now;
                break;
            }
        }
    }
    if (yellowWhatWatchingTime > 0 && !isGameOver && now - yellowWhatWatchingTime >= 1000) {
        triggerEnding('what_watching');
        return;
    }

    // Check Prison Ending (Red trapped in cave)
    if (prisonBounds && redSquare) {
        const rPos = redSquare.position;
        // Check if Red is inside the cave bounds
        const inPrison = rPos.x > prisonBounds.minX && rPos.x < prisonBounds.maxX &&
                         rPos.y > prisonBounds.minY && rPos.y < prisonBounds.maxY;
        
        if (inPrison) {
            if (prisonEntryTime === 0) {
                prisonEntryTime = now;
            } else if (now - prisonEntryTime > PRISON_DURATION) {
                triggerEnding('prison');
                return;
            }
        } else {
            prisonEntryTime = 0;
        }
    }

    // Flashbang ending: Green touches the pink cloud cube in Brown's house
    const flashCloud = Composite.allBodies(engine.world).find(b => b.label === 'cloud_character');
    if (flashCloud) {
        const flashHit = Query.collides(greenSquare, [flashCloud])[0];
        if (flashHit) {
            triggerEnding('flashbang');
            return;
        }
    }

    // Cloud Machine transformation (Chapter 1)
    if (!isGameOver && !cloudTransformed && cloudMachine) {
        const nowLocal = now;
        const checkTransform = (cube, label) => {
            if (!cube) return;
            const hit = Query.collides(cube, [cloudMachine])[0];
            if (hit && !cloudTransformed) {
                cloudTransformed = label;
                cloudTransformStartTime = nowLocal;
                isCloudMode = true;
                cloudModeStartTime = nowLocal;
                engine.gravity.y = 0.1;

                // Soften background music in cloud mode
                if (backgroundMusic) {
                    backgroundMusic.volume = 0.2;
                }
            }
        };
        checkTransform(greenSquare, 'green');
        checkTransform(redSquare, 'red');
        checkTransform(blueSquare, 'blue');
        checkTransform(brownSquare, 'brown');
    }

    // Needle POP OH NO endings disabled (no longer trigger on needle contact)

    // Brown no longer triggers the main Cloud Ending when thrown into the clouds
    // (Cloud mode is now entered only through the machine.)

    // Check Cloud Ending Timer (can be disabled)
    if (isCloudMode && !isGameOver && isCloudEndingEnabled) {
        if (now - cloudModeStartTime > CLOUD_TRANSITION_DURATION) {
            triggerEnding('cloud');
            return;
        }
    }

    // Cloud idle timer -> specific cloud cube endings
    if (!isGameOver && isCloudMode && cloudTransformed && cloudTransformStartTime > 0) {
        if (now - cloudTransformStartTime >= 25000) {
            if (cloudTransformed === 'green') triggerEnding('green_cloud');
            else if (cloudTransformed === 'red') triggerEnding('red_cloud');
            else if (cloudTransformed === 'blue') triggerEnding('blue_cloud');
            else if (cloudTransformed === 'brown') triggerEnding('brown_cloud');
            return;
        }
    }

    // Check FRIENDS Ending: all main cubes + pink cloud on same grass cliff
    if (!isGameOver) {
        const bodies = Composite.allBodies(engine.world);
        const topBody = bodies.find(b => b.label === 'ground_top');
        const cloudCharBody = bodies.find(b => b.label === 'cloud_character');

        const mainCubes = [greenSquare, redSquare, blueSquare, yellowSquare, brownSquare];
        const allPresent = mainCubes.every(b => !!b) && !!cloudCharBody;

        if (allPresent && topBody) {
            const topY = topBody.position.y;
            const yTolerance = SQUARE_SIZE;
            const leftX = 0;
            const rightX = PLATFORM_WIDTH;

            const onCliff = (cube) =>
                cube.position.y < topY + yTolerance &&
                cube.position.y > topY - yTolerance &&
                cube.position.x >= leftX &&
                cube.position.x <= rightX;

            if (mainCubes.every(onCliff) && onCliff(cloudCharBody)) {
                triggerEnding('friends');
                return;
            }
        }
    }

    // Check collision with green square
    const collision = Query.collides(redSquare, [greenSquare])[0];
    const isTouchingGreen = !!collision;

    // Track last touch time for 🎶 achievement
    if (isTouchingGreen) {
        lastRedGreenTouchTime = now;
    }

    // Green frowns whenever he is being hit or pushed by other cubes
    let isHitOrPushed = isTouchingGreen;
    if (blueSquare) {
        const blueHit = Query.collides(blueSquare, [greenSquare])[0];
        if (blueHit) isHitOrPushed = true;
    }
    greenSquare.isFrowning = isHitOrPushed;

    // --- Merge ending logic left in place, but the new character also exists in Brown's house automatically ---
    if (isTouchingGreen && !isGameOver) {
        if (Math.random() < 0.01) { // 1/100 chance
            const mergePos = {
                x: (redSquare.position.x + greenSquare.position.x) / 2,
                y: (redSquare.position.y + greenSquare.position.y) / 2
            }; 
            if (isCloudMode) {
                cloudTransformed = 'merged';
                cloudTransformStartTime = now;
                triggerEnding('new_character', mergePos);
            } else {
                triggerEnding('merged', mergePos);
            }
            return;
        }
    }

    // --- Red Square Grip Logic ---
    // Track green spin energy when grabbed for Big Eye logic
    if (mouseConstraint.body === greenSquare) {
        const angVel = Math.abs(greenSquare.angularVelocity);
        if (angVel > 0.2) {
            greenSpinEnergy += angVel * 10;
        } else {
            greenSpinEnergy = Math.max(0, greenSpinEnergy - 1);
        }

        if (!greenBigEyeReady && greenSpinEnergy > 300) {
            greenBigEyeReady = true;
            greenSquare.bigEye = true;
            // Start at 2x face scale once the Big Eye state is reached
            greenSquare.bigEyeScale = 2;
        } else if (greenBigEyeReady) {
            // Let the scale grow slightly with more spin, capped
            const scale = 1 + greenSpinEnergy / 200;
            greenSquare.bigEyeScale = Math.min(3, Math.max(2, scale));
        }
    } else {
        greenSpinEnergy = Math.max(0, greenSpinEnergy - 2);
    }

    // Track red spin energy when grabbed for Mad Ending logic
    if (mouseConstraint.body === redSquare) {
        const angVelRed = Math.abs(redSquare.angularVelocity);
        if (angVelRed > 0.25) {
            redSpinEnergy += angVelRed * 10;
        } else {
            redSpinEnergy = Math.max(0, redSpinEnergy - 1);
        }

        if (!redMadReady && redSpinEnergy > 200) {
            redMadReady = true;
            redSquare.mad = true;
            isRedAggressive = true; // visually make him angry too
        }
    } else {
        redSpinEnergy = Math.max(0, redSpinEnergy - 2);
    }

    if (mouseConstraint.body === redSquare) {
        if (isRedAggressive) {
            // Cannot hold him if he's aggressive - immediately release
            mouseConstraint.constraint.bodyB = null;
        } else {
            if (redGrabStartTime === 0) redGrabStartTime = now;
            
            // Check if held too long
            if (now - redGrabStartTime > RED_HOLD_LIMIT) {
                isRedAggressive = true;
                if (madAggressiveStartTime === 0) madAggressiveStartTime = now;
                mouseConstraint.constraint.bodyB = null; // Force release
                
                // Jump/Explode out of hand
                Body.setVelocity(redSquare, { 
                    x: (Math.random() - 0.5) * 20, 
                    y: -15 
                });
                Body.setAngularVelocity(redSquare, (Math.random() - 0.5) * 2);
            }

            // Check if shaken too aggressively
            const speed = Vector.magnitude(redSquare.velocity);
            if (speed > 20) {
                shakeEnergy += speed;
            } else {
                shakeEnergy = Math.max(0, shakeEnergy - 2); // Decay
            }

            if (shakeEnergy > 1000) {
                explodeRedSquare();
            }
        }
    } else {
        redGrabStartTime = 0;
        shakeEnergy = 0;
    }

    // If Red is in his aggressive state, start (or keep) the Mad Ending timer
    if (isRedAggressive && madAggressiveStartTime === 0) {
        madAggressiveStartTime = now;
    }

    // If Red has been aggressive for at least 2 seconds, trigger Mad Ending
    if (madAggressiveStartTime > 0 && now - madAggressiveStartTime >= 2000 && !isGameOver) {
        triggerEnding('mad');
        return;
    }

    // Freezer logic: freeze cubes and handle Big Eye / Mad Endings
    if (!isGameOver && freezerBody) {
        const cubes = [
            { body: greenSquare, type: 'green' },
            { body: redSquare, type: 'red' },
            { body: blueSquare, type: 'blue' },
            { body: brownSquare, type: 'brown' }
        ];

        cubes.forEach(entry => {
            const cube = entry.body;
            if (!cube) return;
            const hit = Query.collides(cube, [freezerBody])[0];
            if (!hit) return;

            // Special Big Eye path for Green
            if (cube === greenSquare && greenBigEyeReady && (greenSquare.bigEyeScale || 1) >= 2) {
                if (bigEyeFreezeStartTime === 0) {
                    bigEyeFreezeStartTime = now;
                    Body.setVelocity(cube, { x: 0, y: 0 });
                    Body.setAngularVelocity(cube, 0);
                    Body.setStatic(cube, true);
                    cube.render.fillStyle = '#81D4FA';
                }
            }
            // Special Mad path for Red - if he has been spun enough to become mad
            else if (cube === redSquare && (redMadReady || redSquare.mad)) {
                if (madFreezeStartTime === 0) {
                    madFreezeStartTime = now;
                    Body.setVelocity(cube, { x: 0, y: 0 });
                    Body.setAngularVelocity(cube, 0);
                    Body.setStatic(cube, true);
                    if (cube.render) {
                        cube.render.fillStyle = '#FFCDD2';
                    }
                }
            } else if (!cube.frozen) {
                // Generic frozen cube endings
                cube.frozen = true;
                Body.setVelocity(cube, { x: 0, y: 0 });
                Body.setAngularVelocity(cube, 0);
                Body.setStatic(cube, true);
                if (cube.render) {
                    cube.render.fillStyle = '#B3E5FC';
                }
                if (entry.type === 'green') triggerEnding('frozen_green');
                else if (entry.type === 'red') triggerEnding('frozen_red');
                else if (entry.type === 'blue') triggerEnding('frozen_blue');
                else if (entry.type === 'brown') triggerEnding('frozen_brown');
            }
        });

        // Delay Big Eye ending 2 seconds after freezing
        if (bigEyeFreezeStartTime > 0 && now - bigEyeFreezeStartTime >= 2000 && !isGameOver) {
            triggerEnding('big_eye');
            return;
        }

        // Delay Mad ending 2 seconds after freezing Red
        if (madFreezeStartTime > 0 && now - madFreezeStartTime >= 2000 && !isGameOver) {
            triggerEnding('mad');
            return;
        }
    }

    // 1. Handle Pushing Cooldown / Inertia Wait State
    if (isRedPushing) {
        if (now - pushTimer < PUSH_DURATION) {
            // Active Cooldown (0ms to 750ms): Dampen movement but apply no force.
            Body.setVelocity(redSquare, { x: redSquare.velocity.x * 0.8, y: redSquare.velocity.y * 0.8 });
            return; 
        } 
        
        // Cooldown expired
        if (isTouchingGreen) {
            // If still touching after cooldown, Red remains inert/stopped until separation.
            // We keep isRedPushing = true to maintain the inert/waiting state.
            Body.setVelocity(redSquare, { x: 0, y: 0 });
            Body.setAngularVelocity(redSquare, 0);
            return;
        } else {
            // Cooldown expired AND separated. Red is now ready to approach again.
            isRedPushing = false;
        }
    }
    
    // 2. Handle Ready State / Approach / Initial Push (isRedPushing is guaranteed false here)
    if (isTouchingGreen) {
        // FIRST CONTACT or contact after separation. Initiate push sequence.
        isRedPushing = true;
        pushTimer = now;
        
        // 1. Stop Red Cube movement immediately
        Body.setVelocity(redSquare, { x: 0, y: 0 }); 
        Body.setAngularVelocity(redSquare, 0);
        
        // 2. Apply a significant impulse force to Green Cube to 'throw' it off the platform.
        // Pushing right (positive X) towards the water.
        const horizontalPushMagnitude = 0.03 * greenSquare.mass; // Adjusted push force for horizontal dominance
        
        // Apply impulse force relative to center of mass
        // Removing explicit upward force (y component) to maximize horizontal throw
        Body.applyForce(greenSquare, greenPos, { x: horizontalPushMagnitude, y: 0 }); 

    } else {
        // Approach the edge (travel in a straight line towards the water/right edge)
        
        // Check if Red is close to the edge, preventing it from walking off.
        const redCubeHalfSize = SQUARE_SIZE / 2;
        // Target stop X position: PLATFORM_WIDTH (right edge of platform, X=platformWidth) minus half the cube size, plus a small buffer (5px)
        const stopX = PLATFORM_WIDTH - redCubeHalfSize - 5; 

        if (redPos.x < stopX) {
            const approachMagnitude = 0.0015 * redSquare.mass;
            const forceX = approachMagnitude; // Constant rightward force
            
            // Apply force
            Body.applyForce(redSquare, redPos, { x: forceX, y: 0 });
        } else {
            // Stop when reaching the boundary
            Body.setVelocity(redSquare, { x: 0, y: redSquare.velocity.y });
            Body.setAngularVelocity(redSquare, 0);
        }
    }

    // Upright constraint for characters (try to keep them from rolling too much)
    if (greenSquare.angle > 0.5) Body.setAngularVelocity(greenSquare, -0.1);
    if (greenSquare.angle < -0.5) Body.setAngularVelocity(greenSquare, 0.1);
    if (redSquare.angle > 0.5) Body.setAngularVelocity(redSquare, -0.1);
    if (redSquare.angle < -0.5) Body.setAngularVelocity(redSquare, 0.1);

    // --- AI Logic for Blue Square (Revenge) ---
    if (blueSquare && !isGameOver) {
        // If player is clicking/dragging Blue, stop his AI movement and let the mouse control him
        if (mouseConstraint && mouseConstraint.body === blueSquare) {
            Body.setVelocity(blueSquare, { x: 0, y: 0 });
            Body.setAngularVelocity(blueSquare, 0);
        } else {
            const bluePos = blueSquare.position;
            const targetPos = redSquare.position;
            const blueCubeHalfSize = SQUARE_SIZE / 2;
            
            // Define the right edge stop point (same as Red's)
            const stopX = PLATFORM_WIDTH - blueCubeHalfSize - 5; 

            // 1. Check if Blue is close enough to Red to push
            const dist = targetPos.x - bluePos.x;
            const targetDistance = SQUARE_SIZE + 5; 
            
            const isTouchingRed = dist > -targetDistance && dist < targetDistance && 
                                  Math.abs(targetPos.y - bluePos.y) < SQUARE_SIZE;

            if (isTouchingRed) {
                // 1% chance that Blue and Red fuse into a single purple cube instead of just a kick
                if (Math.random() < 0.01) {
                    const mergePos = {
                        x: (redSquare.position.x + blueSquare.position.x) / 2,
                        y: (redSquare.position.y + blueSquare.position.y) / 2
                    };

                    // Remove original Blue and Red
                    Composite.remove(engine.world, [redSquare, blueSquare]);

                    // Create fused purple cube
                    const mergedPurple = Bodies.rectangle(mergePos.x, mergePos.y, SQUARE_SIZE, SQUARE_SIZE, {
                        restitution: 0.5,
                        friction: 0.5,
                        density: 0.004,
                        render: { fillStyle: '#9C27B0' }, // Purple
                        label: 'merged2'
                    });
                    Composite.add(engine.world, mergedPurple);

                    // Trigger the second merged ending
                    triggerEnding('merged2', mergePos);
                    return;
                }

                // Push Red hard towards the water (Right, positive X direction)
                // Use mass-based force for consistent push regardless of red's density
                const pushMagnitude = 0.05 * redSquare.mass; 
                Body.applyForce(redSquare, redSquare.position, { x: pushMagnitude, y: 0 });
                
                // Recoil Blue slightly (make it look like an aggressive shove)
                Body.applyForce(blueSquare, bluePos, { x: -0.01 * blueSquare.mass, y: 0 });
                
            } else if (bluePos.x < stopX && targetPos.x > bluePos.x) {
                // 2. Approach Red if Red is to the right and Blue is still on the platform
                const approachMagnitude = 0.002 * blueSquare.mass;
                Body.applyForce(blueSquare, bluePos, { x: approachMagnitude, y: 0 });
                
            } else {
                // Stop movement if Blue has reached the edge or Red is behind him
                 Body.setVelocity(blueSquare, { x: 0, y: blueSquare.velocity.y });
                 Body.setAngularVelocity(blueSquare, 0);
            }
            
            // Upright constraint for Blue
            if (blueSquare.angle > 0.5) Body.setAngularVelocity(blueSquare, -0.1);
            if (blueSquare.angle < -0.5) Body.setAngularVelocity(blueSquare, 0.1);
        }
    }


    // Check Win/Loss Condition
    
    // Handle Space Endings (take precedence)
    if (!isGameOver) {
        // Green: never gets a space ending
        if (greenSquare && greenSquare.position.y < -300) {
            // Intentionally no ending for Green in space
        }

        // Red space ending
        if (redSquare && redSquare.position.y < -300) {
            if (cloudTransformed === 'red') {
                triggerEnding('space_cloud');
            } else {
                // If Red is aggressive/mad, override Red Space with Mad Ending
                if (isRedAggressive || redMadReady) {
                    triggerEnding('mad');
                } else {
                    triggerEnding('red_space');
                }
            }
            return;
        }
        // Blue space ending
        if (blueSquare && blueSquare.position.y < -300) {
            if (cloudTransformed === 'blue') {
                triggerEnding('space_cloud');
            } else {
                triggerEnding('blue_space');
            }
            return;
        }
        // Orange (Brown) space ending
        if (brownSquare && brownSquare.position.y < -300) {
            if (cloudTransformed === 'brown') {
                triggerEnding('space_cloud');
            } else {
                triggerEnding('orange_space');
            }
            return;
        }

        // Yellow space ending
        if (yellowSquare && yellowSquare.position.y < -300) {
            triggerEnding('yellow_space');
            return;
        }

        // Cat space ending
        if (catSquare && catSquare.position.y < -300) {
            triggerEnding('cat_space');
            return;
        }
        // Merged cloud character to space
        const mergedBody = Composite.allBodies(engine.world).find(b => b.label === 'merged');
        if (mergedBody && mergedBody.position.y < -300 && cloudTransformed === 'merged') {
            triggerEnding('space_cloud');
            return;
        }
    }

    // 1. Check if squares have touched the water
    if (greenFallenTime === 0 && greenSquare.position.y > waterLine) {
        greenFallenTime = now;
        // Splash on first contact with water
        playSplashSound();
        addWaterSplash(greenSquare.position.x, waterLine);

        // Pool Party progress + Why? achievement
        try {
            if (!achievementProgress.poolPartyCubes.includes('green')) {
                achievementProgress.poolPartyCubes.push('green');
            }
            // Why?: drowned while held by mouse
            if (mouseConstraint && mouseConstraint.body === greenSquare) {
                unlockAchievement('why');
            }
            saveAchievements();
        } catch (e) {}

        if (isCloudMode && cloudTransformed === 'green') {
            // Cloud Green: instantly gets soaked and disappears
            Composite.remove(engine.world, greenSquare);
            triggerEnding('bad_cloud');
            return;
        }
    }

    if (redFallenTime === 0 && redSquare.position.y > waterLine) {
        redFallenTime = now;
        // Splash on first contact with water
        playSplashSound();
        addWaterSplash(redSquare.position.x, waterLine);

        // Pool Party progress
        try {
            if (!achievementProgress.poolPartyCubes.includes('red')) {
                achievementProgress.poolPartyCubes.push('red');
                saveAchievements();
            }
        } catch (e) {}

        if (isCloudMode && cloudTransformed === 'red') {
            // Cloud Red: instantly gets soaked and disappears
            Composite.remove(engine.world, redSquare);
            triggerEnding('bad_cloud');
            return;
        } else if (!isCloudMode) {
            // Volleyball-style ending removed: use standard GOOD ENDING
            // If Red is aggressive/mad, override Good Ending with Mad Ending
            if (isRedAggressive || redMadReady) {
                triggerEnding('mad');
            } else {
                triggerEnding('good');
            }
            return;
        }
    }
    
    if (blueSquare && blueFallenTime === 0 && blueSquare.position.y > waterLine) {
        blueFallenTime = now;
        // Splash on first contact with water
        playSplashSound();
        addWaterSplash(blueSquare.position.x, waterLine);

        // Pool Party progress
        try {
            if (!achievementProgress.poolPartyCubes.includes('blue')) {
                achievementProgress.poolPartyCubes.push('blue');
                saveAchievements();
            }
        } catch (e) {}

        if (isCloudMode && cloudTransformed === 'blue') {
            // Cloud Blue: instantly gets soaked and disappears
            Composite.remove(engine.world, blueSquare);
            triggerEnding('bad_cloud');
            return;
        } else if (!isCloudMode) {
            // Volleyball-style ending removed for Blue: just record fall and let later logic handle VERY BAD ENDING
        }
    }

    // Yellow falls into water -> Saddest ending
    if (yellowSquare && yellowFallenTime === 0 && yellowSquare.position.y > waterLine) {
        yellowFallenTime = now;
        playSplashSound();
        addWaterSplash(yellowSquare.position.x, waterLine);

        // Pool Party progress
        try {
            if (!achievementProgress.poolPartyCubes.includes('yellow')) {
                achievementProgress.poolPartyCubes.push('yellow');
                saveAchievements();
            }
        } catch (e) {}

        // If recently pushed by cat, Cat is Evil overrides
        if (
            lastCatPushVictimId === yellowSquare.id &&
            now - lastCatPushTime <= SIMULTANEOUS_KILL_WINDOW
        ) {
            triggerEnding('cat_evil');
        } else {
            triggerEnding('saddest');
        }
        return;
    }

    // Cat falls into water -> Very Very Sad
    if (catSquare && catFallenTime === 0 && catSquare.position.y > waterLine) {
        catFallenTime = now;
        playSplashSound();
        addWaterSplash(catSquare.position.x, waterLine);

        if (
            lastCatPushVictimId === catSquare.id &&
            now - lastCatPushTime <= SIMULTANEOUS_KILL_WINDOW
        ) {
            // Should not happen (cat pushing itself), ignore
        }

        triggerEnding('cat_very_sad');
        return;
    }

    // Check Brown Square Death (Sad / Bad Cloud Ending)
    if (brownSquare && brownFallenTime === 0 && brownSquare.position.y > waterLine) {
        brownFallenTime = now;
        // Splash on first contact with water
        playSplashSound();
        addWaterSplash(brownSquare.position.x, waterLine);

        if (isCloudMode && cloudTransformed === 'brown') {
            // Cloud Brown: instantly gets soaked and disappears
            Composite.remove(engine.world, brownSquare);
            triggerEnding('bad_cloud');
        } else if (!isCloudMode) {
            // Volleyball-style Brelly Ball removed: use the original Sad Ending
            triggerEnding('sad_ending');
        } else {
            triggerEnding('sad_ending');
        }
        return;
    }

    // Always-present cloud cube in Brown's house also drowns like cotton candy
    const cloudCharacterBody = Composite.allBodies(engine.world).find(b => b.label === 'cloud_character');
    if (cloudCharacterBody && cloudCharacterBody.position.y > waterLine) {
        // Splash on first contact with water
        playSplashSound();
        addWaterSplash(cloudCharacterBody.position.x, waterLine);

        // Pool Party progress for cloud
        try {
            if (!achievementProgress.poolPartyCubes.includes('cloud')) {
                achievementProgress.poolPartyCubes.push('cloud');
                saveAchievements();
            }
        } catch (e) {}

        Composite.remove(engine.world, cloudCharacterBody);
        triggerEnding('bad_cloud');
        return;
    }

    // Check for Last Second rescue: Green touched water, then is pulled back up quickly
    if (
        greenFallenTime > 0 &&
        greenSquare.position.y < waterLine &&
        now - greenFallenTime <= SIMULTANEOUS_KILL_WINDOW &&
        mouseConstraint &&
        mouseConstraint.body === greenSquare
    ) {
        triggerEnding('last_second');
        return;
    }

    // If Green was pulled back up without using the mouse, just cancel the pending fall timer
    if (
        greenFallenTime > 0 &&
        greenSquare.position.y < waterLine &&
        now - greenFallenTime <= SIMULTANEOUS_KILL_WINDOW &&
        (!mouseConstraint || mouseConstraint.body !== greenSquare)
    ) {
        greenFallenTime = 0;
    }

    // Check Broken Ruler? achievement (ruler in lake)
    if (ruler && !ruler.brokenAchievement && ruler.position.y > waterLine) {
        ruler.brokenAchievement = true;
        unlockAchievement('broken_ruler');
    }

    // Pool Party completion check: green, red, blue, brown, yellow, cloud
    try {
        const required = ['green', 'red', 'blue', 'brown', 'yellow', 'cloud'];
        const haveAll = required.every(id => achievementProgress.poolPartyCubes.includes(id));
        if (haveAll) {
            unlockAchievement('pool_party');
        }
    } catch (e) {}

    // 2. Evaluate endings based on fall times
    
    // Check if the Blue Square fell alone and the window has passed.
    if (blueFallenTime > 0 && greenFallenTime === 0 && redFallenTime === 0 && blueFallenTime + SIMULTANEOUS_KILL_WINDOW < now) {
         triggerEnding('revenge_died');
         return;
    }
    
    // Check Revenge Ending (Blue pushes Red into water)
    if (redFallenTime > 0) {
        
        if (blueSquare) {
            const timeDiff = Math.abs(redFallenTime - blueFallenTime);
            
            // If Red fell, and Green is standing, or Red and Blue fell simultaneously
            if (greenFallenTime === 0 || (blueFallenTime > 0 && timeDiff <= SIMULTANEOUS_KILL_WINDOW)) {
                // Prioritize revenge if Blue is involved and Red is the primary victim
                triggerEnding('revenge');
                return;
            }
        }
    }
    
    // 2b. Continue with existing fall logic if not revenge
    if (greenFallenTime > 0 && redFallenTime > 0) {
        // Both have fallen
        const timeDiff = Math.abs(greenFallenTime - redFallenTime);
        
        if (timeDiff <= SIMULTANEOUS_KILL_WINDOW) {
            triggerEnding('dual_kill');
        } else {
            // Determine who fell first
            if (greenFallenTime < redFallenTime) {
                // Green fell first
                triggerEnding('bad');
            } else {
                // Red fell first, leading to Good Ending (Green's victory)
                triggerEnding('good');
            }
        }
    } else if (greenFallenTime > 0 && greenFallenTime + SIMULTANEOUS_KILL_WINDOW < now) {
        // Green fell, and the window for Red/Blue to fall has passed
        triggerEnding('bad');
    } else if (redFallenTime > 0 && redFallenTime + SIMULTANEOUS_KILL_WINDOW < now) {
        // Red fell, and the window for Green/Blue to fall has passed
        // This case should only be reached if blueSquare is null OR if the initial check failed (e.g., Green fell first).
        if (isRedAggressive || redMadReady) {
            triggerEnding('mad'); 
        } else {
            triggerEnding('good'); 
        }
    }
}

function triggerEnding(type, mergePos = null) {
    if (isGameOver) return;

    isGameOver = true;

    // Mark this ending as unlocked if it exists in the ENDINGS map
    if (ENDINGS[type]) {
        unlockedEndings.add(type);
        saveUnlockedEndings();
    }

    // Achievements tied to endings / streaks
    if (type === 'stalemate') {
        achievementProgress.stalemateStreak = (achievementProgress.stalemateStreak || 0) + 1;
        if (achievementProgress.stalemateStreak >= 10) {
            unlockAchievement('good_day');
        }
    } else {
        achievementProgress.stalemateStreak = 0;
    }

    // Weak Cube: any non-yellow-TV/roof ending after TV off
    if (weakCubeEligible && !weakCubeDone) {
        if (type === 'tv_off' || type === 'roof_boom') {
            weakCubeEligible = false;
        } else {
            unlockAchievement('weak_cube');
            weakCubeDone = true;
            weakCubeEligible = false;
        }
    }

    saveAchievements();

    // Handle Merged state modification for Green/Red fusion
    if (type === 'merged' && mergePos) {
        // Remove Red and Green
        Composite.remove(engine.world, [greenSquare, redSquare]);
        
        // Create a new, fused, chilled brown square at the merge location
        // Note: We use a label 'merged' so it doesn't interfere with the hidden 'brown' square
        const mergedSquare = Bodies.rectangle(mergePos.x, mergePos.y, SQUARE_SIZE, SQUARE_SIZE, {
            restitution: 0.5,
            friction: 0.5,
            density: 0.003,
            render: { fillStyle: '#8D6E63' }, // Brown
            label: 'merged'
        });
        Composite.add(engine.world, mergedSquare);

        // Brown-tinted merge explosion
        addMergeEffect(mergePos.x, mergePos.y, '#8D6E63');
    }

    // Purple merge explosion when Blue and Red fuse
    if (type === 'merged2' && mergePos) {
        addMergeEffect(mergePos.x, mergePos.y, '#9C27B0');
    }


    // Stop Physics roughly
    // We keep rendering so they fall into the abyss
    
    // Special flashbang effect: flash the whole screen white briefly before showing the ending text
    if (type === 'flashbang') {
        document.body.classList.add('flashbang');
        setTimeout(() => {
            document.body.classList.remove('flashbang');
        }, 300);
    }

    setTimeout(() => {
        endingScreen.classList.remove('hidden');
        
        const ending = ENDINGS[type];
        if (ending) {
            endingTitle.innerText = ending.title;
            endingTitle.style.color = ending.color;
            endingDescription.innerText = ending.description;
        } else {
            endingTitle.innerText = "UNKNOWN ENDING";
            endingTitle.style.color = "#9E9E9E";
            endingDescription.innerText = "An unidentified outcome occurred.";
        }
    }, 500);
}

function resetGame() {
    isGameOver = false;
    greenFallenTime = 0;
    redFallenTime = 0;
    brownFallenTime = 0;
    blueFallenTime = 0; // Reset Blue's fall time
    yellowFallenTime = 0;
    catFallenTime = 0;
    redGrabStartTime = 0;
    shakeEnergy = 0;
    isRedAggressive = false;
    prisonEntryTime = 0;
    isCloudMode = false;
    cloudModeStartTime = 0;
    blueActionInitiated = false; // Reset chapter 2 state
    tooLongAchievementGiven = false;
    lastRedGreenTouchTime = 0;
    musicNoteArmed = false;
    cageExplosionTimer = 0; // Reset chapter 3 state
    cageParts = []; // Reset chapter 3 state
    robotsSpawned = false;
    robotAttackStartTime = 0;
    robotBodies = [];
    madAggressiveStartTime = 0;
    brownSunglassesHitTime = 0;
    yellowMad = false;
    yellowTVOffTime = 0;
    yellowWhatWatchingTime = 0;
    weakCubeEligible = false;
    boatBody = null;
    nextBoatSpawnTime = 0;
    boatSpawnTime = 0;
    ruler = null;
    boatBody = null;
    nextBoatSpawnTime = 0;
    boatSpawnTime = 0;
    ruler = null;
    cloudMachine = null;
    needle = null;
    cloudTransformed = null;
    cloudTransformStartTime = 0;
    freezerBody = null;
    greenSpinEnergy = 0;
    greenBigEyeReady = false;
    bigEyeFreezeStartTime = 0;
    redSpinEnergy = 0;
    redMadReady = false;
    madFreezeStartTime = 0;
    
    if (engine) engine.gravity.y = 1; // Reset gravity
    // Restore normal music volume when resetting out of any mode
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4;
    }

    endingScreen.classList.add('hidden');
    
    Composite.clear(engine.world);
    // Engine.clear(engine) removed to maintain engine listeners and stability upon scene reload.
    
    // Reset references to prevent race conditions in update loop
    greenSquare = null;
    redSquare = null;
    brownSquare = null;
    blueSquare = null; // Reset blue square reference
    yellowSquare = null;
    yellowTV = null;
    yellowRoof = null;
    catSquare = null;
    platformParts = [];
    cloudMachine = null;
    needle = null;
    cloudTransformed = null;
    cloudTransformStartTime = 0;
    chapter2LavaSensor = null;
    fishBody = null;
    nextFishSpawnTime = 0;
    fishSpawnTime = 0;
    lastCatPushVictimId = null;
    lastCatPushTime = 0;
    catMad = false;
    catSpinEnergy = 0;
    catMadStartTime = 0;
    chapter2FloatingPlatform = null;
    danceStartTime = 0;

    setupGame(currentChapter); // Use existing currentChapter state
    
    // Re-add mouse constraint because clearing world removes it
    const mouse = Mouse.create(render.canvas);
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.4,
            render: { visible: false }
        },
        collisionFilter: {
            mask: 0xFFFFFFFF
        }
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;
}

// Custom Rendering Loop for details
function drawImpactEffects(context) {
    if (!engine) return;
    const now = engine.timing.timestamp;
    for (let i = impactEffects.length - 1; i >= 0; i--) {
        const fx = impactEffects[i];
        const age = now - fx.startTime;
        if (age > HIT_EFFECT_DURATION_MS) {
            impactEffects.splice(i, 1);
            continue;
        }

        const progress = age / HIT_EFFECT_DURATION_MS;
        const size = 80 * (1 - 0.3 * progress);
        const alpha = 1 - progress;

        context.save();
        context.globalAlpha = alpha;
        const img = drawImpactEffects.burstImage;
        if (img && img.complete) {
            context.drawImage(img, fx.x - size / 2, fx.y - size / 2, size, size);
        } else {
            // Fallback: simple white burst if image isn't ready
            context.fillStyle = 'rgba(255,255,255,' + alpha + ')';
            context.beginPath();
            context.arc(fx.x, fx.y, size / 2, 0, Math.PI * 2);
            context.fill();
        }
        context.restore();
    }
}

 // Preload burst gif
drawImpactEffects.burstImage = new Image();
drawImpactEffects.burstImage.src = '/burst.gif';

// Reuse same burst gif for merge explosions
const mergeBurstImage = drawImpactEffects.burstImage;

function renderCustomScene() {
    const context = render.context;
    if (!context) return;
    
    // --- Chapter 2 Rendering ---
    if (currentChapter === 2) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Draw Lava
        if (chapter2LavaSensor) {
            const lavaBounds = chapter2LavaSensor.bounds;
            
            // Draw gradient for depth and heat
            const gradient = context.createLinearGradient(0, lavaBounds.min.y, 0, lavaBounds.max.y);
            gradient.addColorStop(0, '#FF4500'); // Orange Red (Surface)
            gradient.addColorStop(0.5, '#FF8C00'); // Deep Orange
            gradient.addColorStop(1, '#B22222'); // Dark Red (Bottom)

            context.fillStyle = gradient;
            context.fillRect(lavaBounds.min.x, lavaBounds.min.y, lavaBounds.max.x - lavaBounds.min.x, lavaBounds.max.y - lavaBounds.min.y);

            // Add shimmering/bubbling effect (visual flair)
            context.fillStyle = 'rgba(255, 255, 0, 0.3)';
            context.beginPath();
            for (let i = lavaBounds.min.x; i < lavaBounds.max.x; i += 30) {
                const waveHeight = 5 + Math.sin(engine.timing.timestamp / 300 + i / 50) * 5;
                context.arc(i + Math.random() * 10, lavaBounds.min.y + waveHeight, 8 + Math.random() * 5, 0, Math.PI * 2);
            }
            context.fill();
        }
        
        // Draw static walls/ceiling/floor
        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
             if (body.label.endsWith('_lab') || body.label === 'floating_platform') {
                context.fillStyle = body.label === 'floating_platform' ? '#616161' : '#111'; // Dark structure
                context.strokeStyle = '#444';
                context.lineWidth = 2;
                
                context.beginPath();
                const vertices = body.vertices;
                context.moveTo(vertices[0].x, vertices[0].y);
                for (let j = 1; j < vertices.length; j += 1) {
                    context.lineTo(vertices[j].x, vertices[j].y);
                }
                context.closePath();
                context.fill();
                context.stroke();

                // Draw pipes/details on walls
                if (body.label === 'wall_lab' || body.label === 'ceiling_lab') {
                    context.fillStyle = '#666';
                    const height = window.innerHeight;
                    for(let i=50; i<height-50; i+=100) {
                        context.fillRect(body.label === 'wall_lab' ? body.position.x : i, body.label === 'wall_lab' ? i : body.position.y, 
                                         body.label === 'wall_lab' ? 10 : 30, body.label === 'wall_lab' ? 30 : 10);
                    }
                }
            }
        });
        
        // Draw Faces on Squares
        drawFace(context, greenSquare, 'green');
        // Red is the static watcher in Chapter 2, need to pass isWatcher=true
        drawFace(context, redSquare, 'red', true); 
        drawFace(context, blueSquare, 'blue'); // Draw Blue cube face

        drawImpactEffects(context);
        drawMergeEffects(context);
        return;
    }
    
    // --- Chapter 3 Rendering ---
    if (currentChapter === 3) {
        // Draw standard lab background elements
        
        // Draw Countdown Timer
        if (cageExplosionTimer > 0 && !isGameOver) {
            const timeRemaining = Math.max(0, CAGE_TIME_LIMIT_MS - (engine.timing.timestamp - cageExplosionTimer));
            const seconds = (timeRemaining / 1000).toFixed(1);
            
            context.font = 'bold 30px Arial';
            context.textAlign = 'center';
            
            // Flash red as time runs out
            const color = timeRemaining < 3000 && Math.floor(timeRemaining / 200) % 2 === 0 ? 'red' : 'white';
            
            context.fillStyle = color;
            context.fillText(`BOMB TIMER: ${seconds}s`, window.innerWidth / 2, 80);
        }

        // Draw lab environment elements (walls, ceiling, floor) and cage bars
        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
             if (body.label.endsWith('_lab') || body.label === 'cage_bar') {
                context.fillStyle = body.label === 'cage_bar' ? '#A52A2A' : '#111'; // Dark structure / Cage bars
                context.strokeStyle = body.label === 'cage_bar' ? '#708090' : '#444';
                context.lineWidth = body.label === 'cage_bar' ? 3 : 2;
                
                context.beginPath();
                const vertices = body.vertices;
                context.moveTo(vertices[0].x, vertices[0].y);
                for (let j = 1; j < vertices.length; j += 1) {
                    context.lineTo(vertices[j].x, vertices[j].y);
                }
                context.closePath();
                context.fill();
                context.stroke();
            }
        });
        
        drawFace(context, greenSquare, 'green');
        drawFace(context, redSquare, 'red', true);
        drawImpactEffects(context);
        drawMergeEffects(context);
        return;
    }
    
    // --- Chapter 1 Rendering (existing code below) ---
    
    if (isCloudMode) {
        // Cloud Mode Rendering: Everything is fluffy
        context.fillStyle = '#E1F5FE'; // Pale blue sky
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);

        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
            // Calculate size based on bounds
            const width = body.bounds.max.x - body.bounds.min.x;
            const height = body.bounds.max.y - body.bounds.min.y;
            const size = Math.max(width, height);
            
            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);
            
            context.fillStyle = 'white';
            context.shadowColor = '#B3E5FC';
            context.shadowBlur = 15;
            
            // Draw multiple circles to form a cloud shape approximating the body
            const puffs = Math.max(3, Math.floor(size / 20));
            
            // If it's a square (players), draw a cute fluffy ball
            if (width < 100 && height < 100) {
                 context.beginPath();
                 context.arc(0, 0, width/1.5, 0, Math.PI * 2);
                 context.fill();
                 // Fluff
                 for(let i=0; i<5; i++) {
                     const ang = (Math.PI * 2 / 5) * i;
                     context.beginPath();
                     context.arc(Math.cos(ang)*width/3, Math.sin(ang)*width/3, width/3, 0, Math.PI*2);
                     context.fill();
                 }
                 
                 // Cute face for clouds
                 context.fillStyle = '#81D4FA';
                 context.beginPath();
                 context.arc(-10, -5, 4, 0, Math.PI*2);
                 context.arc(10, -5, 4, 0, Math.PI*2);
                 context.fill();
                 context.beginPath();
                 context.arc(0, 5, 6, 0, Math.PI);
                 context.stroke();

            } else {
                // Ground/Walls: Draw scattered puffs along the shape
                // We'll just draw along the bounding box for simplicity
                for(let x = -width/2; x <= width/2; x += 30) {
                    for(let y = -height/2; y <= height/2; y += 30) {
                        if (Math.random() > 0.5) continue; 
                        context.beginPath();
                        context.arc(x, y, 25, 0, Math.PI * 2);
                        context.fill();
                    }
                }
            }
            
            context.restore();
        });
        return;
    }
    
    // Draw Clouds (Static for now)
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.beginPath();
    context.arc(100, 100, 30, 0, Math.PI * 2);
    context.arc(140, 90, 40, 0, Math.PI * 2);
    context.arc(180, 100, 30, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(window.innerWidth - 150, 80, 35, 0, Math.PI * 2);
    context.arc(window.innerWidth - 100, 60, 45, 0, Math.PI * 2);
    context.arc(window.innerWidth - 60, 80, 35, 0, Math.PI * 2);
    context.fill();

    // Draw Water
    const waterLevel = window.innerHeight * 0.85;
    context.fillStyle = 'rgba(66, 165, 245, 0.8)';
    context.fillRect(0, waterLevel, window.innerWidth, window.innerHeight - waterLevel);
    
    // Draw Waves on top of water
    context.beginPath();
    context.moveTo(0, waterLevel);
    for(let i=0; i<window.innerWidth; i+=20) {
        context.quadraticCurveTo(i+10, waterLevel-5, i+20, waterLevel);
    }
    context.lineTo(window.innerWidth, window.innerHeight);
    context.lineTo(0, window.innerHeight);
    context.fill();

    // Water splash effects
    if (waterSplashes.length > 0) {
        const nowTime = engine.timing.timestamp;
        waterSplashes.forEach(s => {
            const age = nowTime - s.startTime;
            if (age < 0 || age > SPLASH_DURATION_MS) return;

            const t = age / SPLASH_DURATION_MS;
            const maxRadius = 40;
            const radius = maxRadius * t;
            const alpha = 1 - t;

            context.save();
            context.strokeStyle = `rgba(255,255,255,${alpha})`;
            context.lineWidth = 2;
            context.beginPath();
            context.arc(s.x, waterLevel, radius, 0, Math.PI * 2);
            context.stroke();

            // Small inner ring
            context.beginPath();
            context.arc(s.x, waterLevel, radius * 0.6, 0, Math.PI * 2);
            context.stroke();
            context.restore();
        });
    }


    // Draw Platform Parts (including fake walls)
    const bodies = Composite.allBodies(engine.world);

    // 1. Draw all Dirt parts (Real and Fake)
    context.fillStyle = '#795548'; // Dirt
    
    bodies.forEach(body => {
        // Include fake_ground for visual rendering of the soil wall (it remains a sensor for physics)
        if (body.label === 'ground' || body.label === 'ground_top' || body.label === 'fake_ground') {
            context.beginPath();
            const vertices = body.vertices;
            context.moveTo(vertices[0].x, vertices[0].y);
            for (let j = 1; j < vertices.length; j += 1) {
                context.lineTo(vertices[j].x, vertices[j].y);
            }
            context.closePath();
            context.fill();
        }
    });

    // 2. Draw Grass on Top Parts
    bodies.forEach(body => {
        if (body.label === 'ground_top') {
            const vertices = body.vertices;
            // Find top edge
            let minY = Math.min(...vertices.map(v => v.y));
            let topVerts = vertices.filter(v => Math.abs(v.y - minY) < 5).sort((a,b) => a.x - b.x);
            
            if (topVerts.length >= 2) {
                context.fillStyle = '#4CAF50';
                context.beginPath();
                context.moveTo(topVerts[0].x, topVerts[0].y);
                
                const dist = topVerts[topVerts.length-1].x - topVerts[0].x;
                const segments = 25;
                const step = dist / segments;
                
                for(let i=1; i<=segments; i++) {
                    let px = topVerts[0].x + step * i;
                    let py = topVerts[0].y + (i % 2 === 0 ? 0 : 6); 
                    context.lineTo(px, py);
                }
                context.lineTo(topVerts[topVerts.length-1].x, topVerts[topVerts.length-1].y + 15);
                context.lineTo(topVerts[0].x, topVerts[0].y + 15);
                context.fill();
            }
        }
    });

    // Draw Brown's bed and bedside table
    bodies.forEach(body => {
        if (body.label === 'bed' || body.label === 'bed_table') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            if (body.label === 'bed') {
                // Simple wooden bed
                context.fillStyle = '#6D4C41';
                context.fillRect(-w / 2, -h / 2, w, h);
                // Mattress
                context.fillStyle = '#B3E5FC';
                context.fillRect(-w / 2 + 5, -h / 2 - h / 2, w - 10, h);
            } else if (body.label === 'bed_table') {
                // Bedside table
                context.fillStyle = '#5D4037';
                context.fillRect(-w / 2, -h / 2, w, h);
                // Legs
                context.fillRect(-w / 2, h / 2 - 4, 6, 8);
                context.fillRect(w / 2 - 6, h / 2 - 4, 6, 8);
            }

            context.restore();
        }
    });

    // Find merged squares if they exist
    let mergedSquare = Composite.allBodies(engine.world).find(b => b.label === 'merged');
    let mergedPurpleSquare = Composite.allBodies(engine.world).find(b => b.label === 'merged2');

    // Draw Boat and special objects
    const bodiesAll = Composite.allBodies(engine.world);
    bodiesAll.forEach(body => {
        if (body.label === 'cloud_machine') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            context.fillStyle = '#B0BEC5';
            context.fillRect(-w / 2, -h / 2, w, h);
            context.fillStyle = '#FFF59D';
            context.fillRect(-w / 4, -h / 4, w / 2, h / 2);
            context.restore();
        } else if (body.label === 'robot_wall') {
            // Secret discolored wall (bottom-left of hut)
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            const grd = context.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
            grd.addColorStop(0, '#000000');
            grd.addColorStop(1, '#424242');
            context.fillStyle = grd;
            context.fillRect(-w / 2, -h / 2, w, h);
            context.restore();
        } else if (body.label === 'needle') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);
            context.fillStyle = '#BDBDBD';
            context.fillRect(-w / 4, -h / 2, w / 2, h);
            context.fillStyle = '#E0E0E0';
            context.beginPath();
            context.moveTo(0, -h / 2 - 8);
            context.lineTo(-w / 4, -h / 2);
            context.lineTo(w / 4, -h / 2);
            context.closePath();
            context.fill();
            context.restore();
        } else if (body.label === 'freezer') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            // Freezer body
            const grd = context.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
            grd.addColorStop(0, '#E0F7FA');
            grd.addColorStop(1, '#80DEEA');
            context.fillStyle = grd;
            context.fillRect(-w / 2, -h / 2, w, h);

            // Door outline
            context.strokeStyle = '#00838F';
            context.lineWidth = 3;
            context.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6);

            // Handle
            context.fillStyle = '#004D40';
            context.fillRect(w / 2 - 10, -h / 4, 4, h / 2);

            context.restore();
        } else if (body.label === 'freezer_ledge') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            // Wooden ledge like a dock/ship plank
            context.fillStyle = '#6D4C41';
            context.fillRect(-w / 2, -h / 2, w, h);

            // Simple plank lines
            context.strokeStyle = '#4E342E';
            context.lineWidth = 2;
            const plankCount = 4;
            const step = w / plankCount;
            for (let i = 1; i < plankCount; i++) {
                context.beginPath();
                context.moveTo(-w / 2 + i * step, -h / 2);
                context.lineTo(-w / 2 + i * step, h / 2);
                context.stroke();
            }

            context.restore();
        } else if (body.label === 'yellow_ledge') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);
            context.fillStyle = '#8D6E63';
            context.fillRect(-w / 2, -h / 2, w, h);
            context.restore();
        } else if (body.label === 'yellow_house_wall' || body.label === 'yellow_roof') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);
            context.fillStyle = '#FFF9C4';
            context.fillRect(-w / 2, -h / 2, w, h);
            context.restore();
        } else if (body.label === 'yellow_tv') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            // TV frame (small physical TV)
            context.fillStyle = '#212121';
            context.fillRect(-w / 2, -h / 2, w, h);

            // Simple on/off screen (no external image to keep canvas origin-clean)
            const innerW = w * 0.7;
            const innerH = h * 0.7;
            context.fillStyle = yellowMad ? '#000000' : '#00E676';
            context.fillRect(-innerW / 2, -innerH / 2, innerW, innerH);

            context.restore();
        } else if (body.label === 'boat') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            // Hull
            context.fillStyle = '#5D4037';
            context.beginPath();
            context.moveTo(-w/2, 0);
            context.lineTo(w/2, 0);
            context.lineTo(w/2 - 20, h/2);
            context.lineTo(-w/2 + 20, h/2);
            context.closePath();
            context.fill();

            // Small cabin
            context.fillStyle = '#B0BEC5';
            context.fillRect(-w/6, -h/1.2, w/3, h/1.5);

            context.restore();
        } else if (body.label === 'robot') {
            // Draw flying robot
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            // Body
            context.fillStyle = '#757575';
            context.fillRect(-w / 2, -h / 2, w, h);

            // Eyes
            context.fillStyle = '#FF5252';
            context.fillRect(-w / 4, -h / 4, w / 8, h / 4);
            context.fillRect(w / 8, -h / 4, w / 8, h / 4);

            // Jet flames (to show flying)
            context.fillStyle = '#FFB300';
            context.beginPath();
            context.moveTo(-w / 4, h / 2);
            context.lineTo(-w / 8, h / 2 + 8);
            context.lineTo(0, h / 2);
            context.closePath();
            context.fill();

            context.beginPath();
            context.moveTo(w / 4, h / 2);
            context.lineTo(w / 8, h / 2 + 8);
            context.lineTo(0, h / 2);
            context.closePath();
            context.fill();

            context.restore();
        } else if (body.label === 'fish') {
            const verts = body.vertices;
            const minX = Math.min(...verts.map(v => v.x));
            const maxX = Math.max(...verts.map(v => v.x));
            const minY = Math.min(...verts.map(v => v.y));
            const maxY = Math.max(...verts.map(v => v.y));
            const w = maxX - minX;
            const h = maxY - minY;

            context.save();
            context.translate(body.position.x, body.position.y);
            context.rotate(body.angle);

            // Simple fish shape
            context.fillStyle = '#4DD0E1';
            context.beginPath();
            context.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.moveTo(-w / 2, 0);
            context.lineTo(-w / 2 - 10, -h / 2);
            context.lineTo(-w / 2 - 10, h / 2);
            context.closePath();
            context.fill();

            context.restore();
        }
    });

    // Draw Faces on Squares

    // Green scared animation: eyes/body gently pulse without affecting physics
    const pulseScale = 1 + 0.08 * Math.sin(engine.timing.timestamp / 180);

    drawFace(context, greenSquare, 'green', false, pulseScale);
    drawFace(context, redSquare, 'red');
    drawFace(context, brownSquare, 'brown');
    drawFace(context, blueSquare, 'blue'); // Draw Blue cube face
    drawFace(context, yellowSquare, 'yellow'); // Yellow cube face
    drawFace(context, catSquare, 'cat'); // Cat cube face

    if (mergedSquare) {
        drawFace(context, mergedSquare, 'brown'); // Use brown face for merged square
    }
    if (mergedPurpleSquare) {
        drawFace(context, mergedPurpleSquare, 'blue'); // Reuse blue-style angry face for the purple fusion
    }

    // Draw the always-present cloud character in Brown's house using cloud-style visuals
    const cloudCharacterBody = Composite.allBodies(engine.world).find(b => b.label === 'cloud_character');
    if (cloudCharacterBody) {
        drawCloudCharacter(context, cloudCharacterBody);
    }

    drawImpactEffects(context);
    drawMergeEffects(context);
}

function drawFace(context, body, type, isWatcher = false, extraScale = 1) {
    if (!body) return;
    
    // Define chapter status locally to avoid potential global reference conflicts reported in errors
    const isChapter2 = currentChapter === 2;

    const pos = body.position;
    const angle = body.angle;
    // Base size for facial features, relative to the current body size
    const currentWidth = body.bounds.max.x - body.bounds.min.x;
    const faceScale = (currentWidth / SQUARE_SIZE) * 1.2;

    context.save();
    context.translate(pos.x, pos.y);
    context.rotate(angle);

    const baseScale = extraScale || 1;
    let totalScale = baseScale;
    if (type === 'green' && body.bigEye) {
        totalScale *= (body.bigEyeScale || 2);
    }
    context.scale(totalScale, totalScale);

    // Robot transformation override
    let faceType = type;
    let robotProgress = 0;
    const now = engine && engine.timing ? engine.timing.timestamp : 0;
    if (body.robotifiedAt !== undefined) {
        const dt = now - body.robotifiedAt;
        if (dt >= 0) {
            robotProgress = Math.max(0, Math.min(1, dt / ROBOT_TRANSFORM_DURATION));
            faceType = 'robot';
        }
    }

    context.fillStyle = 'black';
    
    if (faceType === 'green') {
        // Apply melting effect visual (opacity based on progress)
        let alpha = 1;
        if (isChapter2 && greenMeltingProgress > 0) {
            const progress = Math.min(1, (engine.timing.timestamp - greenMeltingProgress) / MELT_DURATION_MS);
            // Fade out completely when 90% melted
            alpha = 1 - Math.min(1, progress * 1.1); 
        }
        context.globalAlpha = alpha;

        const bigEyeActive = body.bigEye === true;

        // Eyes
        context.beginPath();
        if (bigEyeActive) {
            // Huge, round eyes for Big Eye state
            context.ellipse(-12 * faceScale, -6 * faceScale, 8 * faceScale, 10 * faceScale, 0, 0, Math.PI * 2);
            context.ellipse(12 * faceScale, -6 * faceScale, 8 * faceScale, 10 * faceScale, 0, 0, Math.PI * 2);
        } else {
            // Normal cute eyes
            context.ellipse(-10 * faceScale, -5 * faceScale, 4 * faceScale, 8 * faceScale, 0, 0, Math.PI * 2);
            context.fill();
            context.beginPath();
            context.ellipse(10 * faceScale, -5 * faceScale, 4 * faceScale, 8 * faceScale, 0, 0, Math.PI * 2);
        }
        context.fill();

        // Mouth: smile by default, frown when being hit or pushed, shrinks when Big Eye is active
        context.strokeStyle = 'black';
        context.lineWidth = 2 * faceScale;
        context.beginPath();
        const isFrowning = body.isFrowning;
        if (isFrowning) {
            // Frown (downward)
            const radius = bigEyeActive ? 4 * faceScale : 6 * faceScale;
            context.arc(0, 10 * faceScale, radius, Math.PI, 0);
        } else {
            // Smile (upward)
            const radius = bigEyeActive ? 4 * faceScale : 6 * faceScale;
            context.arc(0, 8 * faceScale, radius, 0, Math.PI);
        }
        context.stroke();
        
        context.globalAlpha = 1; // Reset alpha
        
    } else if (faceType === 'brown') {
        // Chill face / Sunglasses or bare sad face
        context.fillStyle = '#3E2723';

        if (!body.noSunglasses) {
            // Glasses on
            context.fillRect(-15 * faceScale, -8 * faceScale, 12 * faceScale, 8 * faceScale);
            context.fillRect(3 * faceScale, -8 * faceScale, 12 * faceScale, 8 * faceScale);
            context.fillRect(-3 * faceScale, -6 * faceScale, 6 * faceScale, 2 * faceScale); // Bridge
        } else {
            // Normal eyes when sunglasses are gone
            context.beginPath();
            context.arc(-10 * faceScale, -4 * faceScale, 4 * faceScale, 0, Math.PI * 2);
            context.arc(10 * faceScale, -4 * faceScale, 4 * faceScale, 0, Math.PI * 2);
            context.fill();
        }
        
        // Mouth: smile normally, frown when sad
        context.lineWidth = 2 * faceScale;
        context.strokeStyle = '#3E2723';
        context.beginPath();
        if (body.sad) {
            context.arc(0, 7 * faceScale, 8 * faceScale, Math.PI, 0); // Frown
        } else {
            context.arc(0, 5 * faceScale, 8 * faceScale, 0, Math.PI); // Smile
        }
        context.stroke();
    } else if (faceType === 'red') {
        // Red Face (Aggressive Cube)

        // Determined straight brow
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.beginPath();
        
        if (isWatcher) {
            // Smug/Evil Watching Face (Chapter 2/3)
            context.moveTo(-18 * faceScale, -10 * faceScale);
            context.lineTo(-5 * faceScale, -10 * faceScale);
            context.stroke();
            
            context.beginPath();
            context.moveTo(18 * faceScale, -10 * faceScale);
            context.lineTo(5 * faceScale, -10 * faceScale);
            context.stroke();
            
        } else if (isRedAggressive) {
            // Super Angry Eyebrows (Chapter 1 Aggressive)
            context.moveTo(-20 * faceScale, -8 * faceScale);
            context.lineTo(-2 * faceScale, 0 * faceScale);
            context.stroke();
            
            context.beginPath();
            context.moveTo(20 * faceScale, -8 * faceScale);
            context.lineTo(2 * faceScale, 0 * faceScale);
            context.stroke();
        } else {
            // Normal Angry Eyebrows (Chapter 1)
            context.moveTo(-18 * faceScale, -12 * faceScale);
            context.lineTo(-5 * faceScale, -5 * faceScale);
            context.stroke();
            
            context.beginPath();
            context.moveTo(18 * faceScale, -12 * faceScale);
            context.lineTo(5 * faceScale, -5 * faceScale);
            context.stroke();
        }

        // Eyes
        context.fillStyle = isRedAggressive || isWatcher ? '#FFEB3B' : 'black'; // Yellow/glowing eyes
        context.beginPath();
        context.arc(-10 * faceScale, 0 * faceScale, (isRedAggressive || isWatcher ? 5 : 4) * faceScale, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(10 * faceScale, 0 * faceScale, (isRedAggressive || isWatcher ? 5 : 4) * faceScale, 0, Math.PI * 2);
        context.fill();

        // Mouth 
        context.strokeStyle = 'black';
        context.beginPath();
        
        if (isWatcher) {
            // Smug Smile (Chapter 2/3)
            context.lineWidth = 2;
            context.arc(0, 10 * faceScale, 8 * faceScale, 0, Math.PI); 
            context.stroke();
        } else if (isRedAggressive) {
            // Gritted teeth / Open yell
            context.fillStyle = 'black';
            context.ellipse(0, 12 * faceScale, 10 * faceScale, 6 * faceScale, 0, 0, Math.PI * 2);
            context.fill();
        } else {
            context.arc(0, 10 * faceScale, 8 * faceScale, Math.PI, 0); // Frown
            context.stroke();
        }
        
    } else if (faceType === 'blue') {
        // Blue Face (Revenge Seeker - Constant Angry)
        
        // Angry Eyebrows
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.beginPath();
        
        // Consistent Angry Brows regardless of Red state
        context.moveTo(-18 * faceScale, -12 * faceScale);
        context.lineTo(-5 * faceScale, -5 * faceScale);
        context.stroke();
        
        context.beginPath();
        context.moveTo(18 * faceScale, -12 * faceScale);
        context.lineTo(5 * faceScale, -5 * faceScale);
        context.stroke();


        // Eyes (Always black)
        context.fillStyle = 'black'; 
        context.beginPath();
        context.arc(-10 * faceScale, 0 * faceScale, 4 * faceScale, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(10 * faceScale, 0 * faceScale, 4 * faceScale, 0, Math.PI * 2);
        context.fill();

        // Mouth (Slight frown)
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(0, 10 * faceScale, 8 * faceScale, Math.PI, 0); 
        context.stroke();
        
    } else if (faceType === 'robot') {
        // Robot face: use robotProgress (0..1) for simple animation
        const p = robotProgress;

        // Metallic eyes that "boot up" from small to large, red to bright cyan
        const eyeRadius = (2 + 4 * p) * faceScale;
        const eyeColor = p < 0.5 ? '#FF5252' : '#00E5FF';

        context.fillStyle = eyeColor;
        context.beginPath();
        context.arc(-10 * faceScale, -5 * faceScale, eyeRadius, 0, Math.PI * 2);
        context.arc(10 * faceScale, -5 * faceScale, eyeRadius, 0, Math.PI * 2);
        context.fill();

        // Mouth: straight line that grows longer as it powers up
        context.strokeStyle = '#B0BEC5';
        context.lineWidth = 2 * faceScale;
        const mouthWidth = 4 * faceScale + 10 * faceScale * p;
        context.beginPath();
        context.moveTo(-mouthWidth, 10 * faceScale);
        context.lineTo(mouthWidth, 10 * faceScale);
        context.stroke();

        // Little antenna on top that rises during transform
        const antennaHeight = 4 * faceScale + 10 * faceScale * p;
        context.strokeStyle = '#CFD8DC';
        context.lineWidth = 2 * faceScale;
        context.beginPath();
        context.moveTo(0, -currentWidth / 2 + 8 * faceScale);
        context.lineTo(0, -currentWidth / 2 - antennaHeight);
        context.stroke();
        context.fillStyle = eyeColor;
        context.beginPath();
        context.arc(0, -currentWidth / 2 - antennaHeight - 3 * faceScale, 3 * faceScale, 0, Math.PI * 2);
        context.fill();
    }
    
    // Yellow face
    else if (faceType === 'yellow') {
        const isAngry = yellowMad;
        const isSad = body.sad;

        // Eyes
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(-10 * faceScale, -4 * faceScale, 4 * faceScale, 0, Math.PI * 2);
        context.arc(10 * faceScale, -4 * faceScale, 4 * faceScale, 0, Math.PI * 2);
        context.fill();

        // Eyebrows (always present, shape depends on mood)
        context.strokeStyle = 'black';
        context.lineWidth = 2 * faceScale;
        if (isAngry) {
            // Tilted down toward the center (angry)
            context.beginPath();
            context.moveTo(-16 * faceScale, -10 * faceScale);
            context.lineTo(-4 * faceScale, -8 * faceScale);
            context.stroke();

            context.beginPath();
            context.moveTo(16 * faceScale, -10 * faceScale);
            context.lineTo(4 * faceScale, -8 * faceScale);
            context.stroke();
        } else {
            // Softer, turned “happy” eyebrows (tilted up toward the center)
            context.beginPath();
            context.moveTo(-16 * faceScale, -9 * faceScale);
            context.lineTo(-4 * faceScale, -11 * faceScale);
            context.stroke();

            context.beginPath();
            context.moveTo(16 * faceScale, -9 * faceScale);
            context.lineTo(4 * faceScale, -11 * faceScale);
            context.stroke();
        }

        // Mouth
        context.strokeStyle = 'black';
        context.lineWidth = 2 * faceScale;
        context.beginPath();
        if (isSad) {
            context.arc(0, 10 * faceScale, 8 * faceScale, Math.PI, 0);
        } else if (isAngry) {
            context.arc(0, 10 * faceScale, 8 * faceScale, Math.PI, 0);
        } else {
            context.arc(0, 8 * faceScale, 8 * faceScale, 0, Math.PI);
        }
        context.stroke();
    }

    // Cat face
    else if (faceType === 'cat') {
        // Ears
        context.fillStyle = 'black';
        context.beginPath();
        context.moveTo(-14 * faceScale, -10 * faceScale);
        context.lineTo(-6 * faceScale, -20 * faceScale);
        context.lineTo(2 * faceScale, -10 * faceScale);
        context.closePath();
        context.fill();

        context.beginPath();
        context.moveTo(14 * faceScale, -10 * faceScale);
        context.lineTo(6 * faceScale, -20 * faceScale);
        context.lineTo(-2 * faceScale, -10 * faceScale);
        context.closePath();
        context.fill();

        // Eyes
        context.beginPath();
        context.arc(-8 * faceScale, -4 * faceScale, 3.5 * faceScale, 0, Math.PI * 2);
        context.arc(8 * faceScale, -4 * faceScale, 3.5 * faceScale, 0, Math.PI * 2);
        context.fill();

        // Nose
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-3 * faceScale, 4 * faceScale);
        context.lineTo(3 * faceScale, 4 * faceScale);
        context.closePath();
        context.fill();

        // Mouth
        context.strokeStyle = 'black';
        context.lineWidth = 1.5 * faceScale;
        context.beginPath();
        context.arc(-2 * faceScale, 7 * faceScale, 3 * faceScale, 0, Math.PI);
        context.arc(2 * faceScale, 7 * faceScale, 3 * faceScale, 0, Math.PI);
        context.stroke();

        // Whiskers
        context.beginPath();
        context.moveTo(-8 * faceScale, 2 * faceScale);
        context.lineTo(-18 * faceScale, 0);
        context.moveTo(-8 * faceScale, 5 * faceScale);
        context.lineTo(-18 * faceScale, 7 * faceScale);
        context.moveTo(8 * faceScale, 2 * faceScale);
        context.lineTo(18 * faceScale, 0);
        context.moveTo(8 * faceScale, 5 * faceScale);
        context.lineTo(18 * faceScale, 7 * faceScale);
        context.stroke();
    }

    context.restore();
}

// Dedicated renderer for the always-present cloud character in Brown's house
function drawCloudCharacter(context, body) {
    if (!body) return;

    const width = body.bounds.max.x - body.bounds.min.x;
    const faceScale = width / SQUARE_SIZE;

    context.save();
    context.translate(body.position.x, body.position.y);
    context.rotate(body.angle);

    context.fillStyle = 'white';
    context.shadowColor = '#B3E5FC';
    context.shadowBlur = 15;

    // Main fluffy ball
    context.beginPath();
    context.arc(0, 0, width / 1.5, 0, Math.PI * 2);
    context.fill();

    // Extra puffs
    for (let i = 0; i < 5; i++) {
        const ang = (Math.PI * 2 / 5) * i;
        context.beginPath();
        context.arc(Math.cos(ang) * width / 3, Math.sin(ang) * width / 3, width / 3, 0, Math.PI * 2);
        context.fill();
    }

    // Cute cloud face (matching cloud-mode style)
    context.shadowBlur = 0;
    context.fillStyle = '#81D4FA';
    // Eyes
    context.beginPath();
    context.arc(-10 * faceScale, -5 * faceScale, 4 * faceScale, 0, Math.PI * 2);
    context.arc(10 * faceScale, -5 * faceScale, 4 * faceScale, 0, Math.PI * 2);
    context.fill();
    // Smile
    context.beginPath();
    context.strokeStyle = '#81D4FA';
    context.lineWidth = 2 * faceScale;
    context.arc(0, 5 * faceScale, 6 * faceScale, 0, Math.PI);
    context.stroke();

    context.restore();
}

function explodeRedSquare() {
    isRedAggressive = true;
    if (madAggressiveStartTime === 0 && engine && engine.timing) {
        madAggressiveStartTime = engine.timing.timestamp;
    }
    mouseConstraint.constraint.bodyB = null; // Release grip
    
    const pos = redSquare.position;
    
    // 1. Particle Effects
    const particles = [];
    for(let i=0; i<16; i++) {
        const particle = Bodies.rectangle(pos.x, pos.y, 8, 8, {
            render: { fillStyle: ['#FF9800', '#FF5722', '#FFC107', '#FFFFFF'][i%4] },
            frictionAir: 0.05,
            isSensor: true // Don't physically block things, just visuals
        });
        
        const angle = (Math.PI * 2 / 16) * i;
        const force = 0.02 + Math.random() * 0.01;
        Body.applyForce(particle, pos, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force
        });
        
        particles.push(particle);
    }
    Composite.add(engine.world, particles);
    
    // Clean up particles
    setTimeout(() => {
        Composite.remove(engine.world, particles);
    }, 1500);
    
    // 2. Blast Wave
    const blastRadius = 350;
    const blastForce = 0.25; 
    
    Composite.allBodies(engine.world).forEach(body => {
        if (body.isStatic || particles.includes(body)) return;
        
        const forceVec = Vector.sub(body.position, pos);
        const dist = Vector.magnitude(forceVec);
        
        if (dist < blastRadius) {
            let normal;
            if (dist === 0) {
                 normal = { x: 0, y: -1 };
            } else {
                 normal = Vector.normalise(forceVec);
            }
            // Stronger force when closer
            const strength = blastForce * (body.mass) * (1 - dist/blastRadius);
            Body.applyForce(body, body.position, Vector.mult(normal, strength));
        }
    });
    
    // 3. Launch Red Square itself (reaction)
    Body.applyForce(redSquare, pos, { 
        x: (Math.random() - 0.5) * 0.4, 
        y: -0.4 
    });
    Body.setAngularVelocity(redSquare, (Math.random() - 0.5) * 2);
}

function drawMergeEffects(context) {
    if (!engine) return;
    const now = engine.timing.timestamp;

    for (let i = mergeEffects.length - 1; i >= 0; i--) {
        const fx = mergeEffects[i];
        const age = now - fx.startTime;
        if (age > MERGE_EFFECT_DURATION_MS) {
            mergeEffects.splice(i, 1);
            continue;
        }

        const progress = age / MERGE_EFFECT_DURATION_MS;
        const size = 260 * (1 - 0.1 * progress); // bigger and lasts almost same size
        const alpha = 1 - progress * 0.9;

        context.save();
        context.globalAlpha = alpha;

        const img = mergeBurstImage;
        if (img && img.complete) {
            // Draw base burst
            context.drawImage(img, fx.x - size / 2, fx.y - size / 2, size, size);

            // Tint overlay
            context.globalCompositeOperation = 'source-atop';
            context.fillStyle = fx.color || '#FFFFFF';
            context.fillRect(fx.x - size / 2, fx.y - size / 2, size, size);
        } else {
            // Fallback: colored circle
            context.fillStyle = fx.color || `rgba(255,255,255,${alpha})`;
            context.beginPath();
            context.arc(fx.x, fx.y, size / 2, 0, Math.PI * 2);
            context.fill();
        }

        context.restore();
        context.globalCompositeOperation = 'source-over';
    }
}

// Spawn 199 flying robots that hunt all squares
function spawnRobots() {
    if (robotsSpawned) return;
    robotsSpawned = true;
    robotAttackStartTime = engine.timing.timestamp;
    robotBodies = [];

    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < 199; i++) {
        const startX = Math.random() < 0.5 ? -50 - Math.random() * 100 : width + 50 + Math.random() * 100;
        const startY = Math.random() * (height * 0.7);
        const size = 18;

        const robot = Bodies.rectangle(startX, startY, size, size, {
            frictionAir: 0.02,
            restitution: 0.2,
            density: 0.001,
            label: 'robot',
            render: { visible: false },
            isSensor: true // they don't interfere with normal physics
        });

        robotBodies.push(robot);
    }

    Composite.add(engine.world, robotBodies);
}

function handleResize() {
    if (render && render.canvas) {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
    }

    const errorScreen = document.getElementById('error-screen');
    if (!errorScreen) return;

    if (!isResolutionSupported()) {
        errorScreen.classList.remove('hidden');
    } else {
        errorScreen.classList.add('hidden');
    }
}

 // UI Handlers
restartBtn.addEventListener('click', resetGame);

 // Set initial label for cloud ending toggle (off by default)
if (toggleCloudEndingBtn) {
    toggleCloudEndingBtn.textContent = 'Enable Cloud Ending';
}



function startChapter(chapter) {
    chapter = parseInt(chapter);
    if (chapter !== 1) return; // Chapters 2 and 3 are unavailable
    if (currentChapter === chapter) return;
    setupGame(chapter); 
}

startChapter1Btn.addEventListener('click', () => startChapter(1));
// Chapter 2 and 3 buttons are disabled in HTML and ignored here

// Ending List Modal Handlers
function populateEndingList() {
    endingsListContainer.innerHTML = '';
    
    const sortedKeys = Object.keys(ENDINGS).sort();

    function getExtraNote(key) {
        // Notes about needing Cloud Ending toggle
        if (key === 'cloud') {
            return 'Note: Turn on the Cloud Ending in the banner so this timed ending can trigger.';
        }
        // Notes about needing Stalemate disabled / more time
        if (key === 'friends') {
            return 'Note: Disable the Stalemate Ending so you have more time, and wait for Blue to spawn (20% chance in Chapter 1).';
        }

        // Notes about Blue being required
        const blueRequiredKeys = new Set([
            'revenge',
            'revenge_died',
            'blue_boat',
            'blue_baldi',
            'blue_space',
            'blue_cloud',
            'blue_pop',
            'blue_nvm',
            'friends',
            'merged2'
        ]);
        if (blueRequiredKeys.has(key)) {
            return 'Note: The cube required to get this ending is Blue, which appears 20% of the time in Chapter 1 and 50% of the time in Chapter 2.';
        }

        // Notes about rare‑chance fusion endings
        const rareChanceKeys = new Set(['merged', 'merged2']);
        if (rareChanceKeys.has(key)) {
            return 'Note: This ending has about a 1% chance to happen each time the required cubes collide.';
        }

        return '';
    }

    sortedKeys.forEach(key => {
        const ending = ENDINGS[key];
        const item = document.createElement('div');
        item.className = 'ending-item';
        
        // Use inline style for color indicator
        item.style.borderLeft = `5px solid ${ending.color}`;
        item.style.paddingLeft = '10px';

        const isUnlocked = unlockedEndings.has(key);

        // Chapter 2/3 specific endings that should show a special locked message
        const chapter23LockedKeys = new Set([
            'chapter2_death',
            'revenge',
            'revenge_died',
            'explosion',
            'escape'
        ]);

        let descriptionHtml = '';
        if (isUnlocked) {
            // Unlocked: show full description (notes still appear below)
            descriptionHtml += `<p>${ending.description}</p>`;
        } else {
            if (chapter23LockedKeys.has(key)) {
                // Special locked text for chapter 2/3 endings with no hint
                descriptionHtml += `<p>Sorry! This ending is unavailable at the moment.</p>`;
            } else {
                // Locked: hide description, but show generic text + hint
                descriptionHtml += `<p>Get this ending to unlock description !</p>`;
                if (ending.hint) {
                    descriptionHtml += `<p><strong>Hint:</strong> ${ending.hint}</p>`;
                }
            }
        }

        const extraNote = getExtraNote(key);
        if (extraNote) {
            descriptionHtml += `<p><em>${extraNote}</em></p>`;
        }

        item.innerHTML = `
            <h3>${ending.title}</h3>
            ${descriptionHtml}
        `;
        endingsListContainer.appendChild(item);
    });
}

// Populate Achievements list modal
function populateAchievementsList() {
    if (!achievementsListContainer) return;
    achievementsListContainer.innerHTML = '';

    const keys = Object.keys(ACHIEVEMENTS);
    keys.forEach(key => {
        const data = ACHIEVEMENTS[key];
        const item = document.createElement('div');
        item.className = 'ending-item';
        item.style.borderLeft = unlockedAchievements.has(key) ? '5px solid #4CAF50' : '5px solid #9E9E9E';
        item.style.paddingLeft = '10px';

        const unlocked = unlockedAchievements.has(key);
        const statusText = unlocked ? 'Unlocked' : 'Locked';

        item.innerHTML = `
            <h3>${data.title} <small style="font-weight:normal;color:#777;">(${statusText})</small></h3>
            <p>${data.description}</p>
        `;
        achievementsListContainer.appendChild(item);
    });
}

showEndingsBtn.addEventListener('click', () => {
    populateEndingList();
    endingListModal.classList.remove('hidden');
});

closeEndingsListBtn.addEventListener('click', () => {
    endingListModal.classList.add('hidden');
});

// Achievements list modal handlers
if (showAchievementsBtn) {
    showAchievementsBtn.addEventListener('click', () => {
        populateAchievementsList();
        if (achievementListModal) {
            achievementListModal.classList.remove('hidden');
        }
    });
}

if (closeAchievementsListBtn) {
    closeAchievementsListBtn.addEventListener('click', () => {
        if (achievementListModal) {
            achievementListModal.classList.add('hidden');
        }
    });
}

suggestBtn.addEventListener('click', () => {
    suggestionModal.classList.remove('hidden');
});

toggleStalemateBtn.addEventListener('click', () => {
    isStalemateEnabled = !isStalemateEnabled;
    if (isStalemateEnabled) {
        // Stalemate is now ON. Button should prompt user to turn it OFF.
        toggleStalemateBtn.textContent = 'Disable Stalemate Ending';
        // Reset timer if we re-enable stalemate mode, giving a fresh 10s
        gameStartTime = engine.timing.timestamp; 
    } else {
        // Stalemate is now OFF. Button should prompt user to turn it ON.
        toggleStalemateBtn.textContent = 'Enable Stalemate Ending';
    }
    // Restart the game state so timer resets visually
    resetGame();
});

if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
        // Play alert sound (reuse vineboom)
        try {
            if (vineboomSound) {
                const boom = vineboomSound.cloneNode();
                boom.volume = vineboomSound.volume;
                boom.play().catch(() => {});
            }
        } catch (e) {}

        const confirmed = window.confirm('Reset all unlocked endings? This cannot be undone.');
        if (!confirmed) return;

        // Show reset loading overlay
        if (resetOverlay) {
            resetOverlay.classList.remove('hidden');
        }

        // Clear progress and reload lists after a short delay
        setTimeout(() => {
            try {
                localStorage.removeItem(ENDING_STORAGE_KEY);
            } catch (e) {}
            unlockedEndings = new Set();

            // Reset achievements progress tied to endings reset
            try {
                unlockAchievement('resetii');
            } catch (e) {}

            // Refresh the in-game endings popup list
            populateEndingList();

            // Hide overlay again
            if (resetOverlay) {
                resetOverlay.classList.add('hidden');
            }
        }, 2000);
    });
}

 // Toggle for timed Cloud Ending (off by default)
toggleCloudEndingBtn.addEventListener('click', () => {
    isCloudEndingEnabled = !isCloudEndingEnabled;
    if (isCloudEndingEnabled) {
        toggleCloudEndingBtn.textContent = 'Disable Cloud Ending';
        // When turning on, restart the cloud timer if already in cloud mode
        if (isCloudMode) {
            cloudModeStartTime = engine.timing.timestamp;
        }
    } else {
        toggleCloudEndingBtn.textContent = 'Enable Cloud Ending';
    }
});



cancelSuggestionBtn.addEventListener('click', () => {
    suggestionModal.classList.add('hidden');
    suggestionText.value = '';
});

// Hard reset button resets the whole game from the start
if (hardResetBtn) {
    hardResetBtn.addEventListener('click', () => {
        resetGame();
    });
}

submitSuggestionBtn.addEventListener('click', async () => {
    const text = suggestionText.value.trim();
    if (!text) return;

    // Post comment via Websim API
    try {
        await window.websim.postComment({
            content: `New Ending Suggestion: ${text}`
        });
        
        suggestionModal.classList.add('hidden');
        suggestionText.value = '';
        
        // Maybe show a thank you toast, but native UI handles confirmation usually.
        // We'll just assume success if no error thrown immediately
    } catch (e) {
        console.error("Failed to post suggestion", e);
        alert("Something went wrong posting your suggestion.");
    }
});

// Start
init();

