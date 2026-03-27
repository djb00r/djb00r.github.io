export const MystmanInteractions = {
    gameDevTips: [
        "Game design is 90% debugging, 10% coding :mathflag:",
        "Every bug is just an undocumented feature :funny:",
        "Baldi started as a simple math teacher in my imagination :smallbaldi:"
    ],
    developmentStories: [
        "Baldi's Basics was a game jam project that went viral :happy:",
        "I never expected the game to become a meme :quarter:",
        "Inspiration can come from the strangest places :cool:"
    ],
    interactions: {
        withBaldi: [
            "Hey Baldi, remember when I first coded you? :smallbaldi:",
            "My greatest creation, right here! :happy:",
            "Let's debug your math skills! :grayplus:"
        ],
        withPrincipal: [
            "Even game developers follow rules... sometimes :lock:",
            "Principal, want to hear about game development ethics? :quarter:",
            "Code of conduct applies in games and schools! :mathflag:"
        ]
    }
};

export const MystmanPersonalityGenerator = {
    getRandomInteraction(type) {
        const interactions = MystmanInteractions[type];
        return interactions[Math.floor(Math.random() * interactions.length)];
    }
};