export const characterUniqueResponses = {
    // Default responses for any character not explicitly defined
    default: [
        "Just hanging out in the Here School chat! :happy:",
        "Another day, another adventure :quarter:",
        "Who's up for some fun? :smallbaldi:",
        "Life is full of surprises! :funny:",
        "Feeling pretty awesome today :cool:",
        "Ready to chat with anyone :wave:",
        "What's happening around here? :paperman:",
        "Enjoying the school vibes :dance:",
        "Got a story to share :happy:",
        "Just being myself :quarter:"
    ],

    // Character-specific unique responses
    'Paperman': [
        "My paper collection is pristine today! :paperman:",
        "Who wants to see my perfectly organized documents? :quarter:",
        "Every sheet tells a story :happy:",
        "Precision is my middle name :cool:",
        "Paper preservation is an art form :angry:",
        "Watermarks are like fingerprints :funny:",
        "Archival quality matters! :smallbaldi:",
        "Japanese washi paper is my passion :dance:",
        "Carbon paper: the unsung hero of documentation :quarter:",
        "Each page is a world of possibilities :papererror:"
    ],
    'Baldi': [
        "Math is everywhere today! :quarter:",
        "Who's ready for some mathematical madness? :smallbaldi:",
        "Equations are my favorite conversation :funny:",
        "Calculate your way to success :happy:",
        "Numbers never lie :cool:",
        "Let's solve some mind-bending problems :angry:",
        "Geometry rocks my world :dance:",
        "Probability is my playground :quarter:",
        "Mathematical logic is unbeatable :smallbaldi:",
        "Every problem has a solution :happy:"
    ],
    'Principal': [
        "Discipline is the key to success :lock:",
        "Rules are not suggestions :mad:",
        "Conduct matters more than you think :quarter:",
        "Respect is non-negotiable :angry:",
        "Education begins with self-control :happy:",
        "Zero tolerance for misbehavior :cool:",
        "Character builds your future :smallbaldi:",
        "Order in the classroom! :funny:",
        "Every action has a consequence :dance:",
        "Civility is our school's cornerstone :quarter:"
    ],
    'Playtime': [
        "Jump rope time! :playtime:",
        "Who wants to play a game? :dance:",
        "Energy is my superpower :happy:",
        "Let's hop and skip! :smallbaldi:",
        "Games make everything better :funny:",
        "Tag, you're it! :quarter:",
        "Playground rules rock :cool:",
        "Exercise is fun! :dance:",
        "Ready for some active fun :happy:",
        "Move those muscles! :playtime:"
    ],
    'Bully': [
        "Looking for some trouble :angry:",
        "Quarter collection time :quarter:",
        "Nobody messes with me :mad:",
        "Intimidation is my game :funny:",
        "Watch your back :cool:",
        "Lunch money sounds good :smallbaldi:",
        "Who wants to challenge me? :angry:",
        "Toughness is my trademark :quarter:",
        "No weakness allowed :mad:",
        "Fear is my favorite emotion :cool:"
    ]
};

export function getUniqueCharacterResponse(characterName) {
    const responses = characterUniqueResponses[characterName] || characterUniqueResponses.default;
    return responses[Math.floor(Math.random() * responses.length)];
}