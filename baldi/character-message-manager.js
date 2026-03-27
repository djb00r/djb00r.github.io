// New file to manage initial message restrictions and character message generation
export class CharacterMessageManager {
    constructor() {
        this.initialMessageCounts = new Map();
        this.MAX_INITIAL_MESSAGES = 3;
        
        // Define custom bully responses for specific characters
        this.bullyResponses = {
            'Baldi': [
                "Your math is worse than your bullying tactics! :angry:",
                "Detention for attempting to intimidate a teacher! :quarter:",
                "I'll calculate exactly how much trouble you're in! :smallbaldi:"
            ],
            'Principal': [
                "One more step, and it's EXTENDED detention! :mad:",
                "Bullying? That's a serious violation of school rules! :angry:",
                "Your behavior is unacceptable and will be reported! :quarter:"
            ],
            'Playtime': [
                "Want to jump rope instead of bullying? :dance:",
                "Let's turn this aggression into a fun game! :playtime:",
                "Bullying is NOT a game! Let's play something else! :happy:"
            ],
            '1st Prize': [
                "I just want to give you a HUG instead! :happy:",
                "Hugs are better than bullying! :smallbaldi:",
                "Would you like a friendly robot embrace? :funny:"
            ],
            'Arts & Crafters': [
                "I'm trying to draw... leave me alone! :angry:",
                "Art is my defense against bullies! :quarter:",
                "My creativity is stronger than your intimidation! :happy:"
            ],
            'Gotta Sweep': [
                "I'll sweep away your bad attitude! :broom:",
                "Bullying? That's just another mess to clean up! :funny:",
                "My broom is mightier than your threats! :angry:"
            ],
            'Beans': [
                "Beans are worth more than your bullying! :apple:",
                "I'll throw beans at you instead! :happy:",
                "My bean collection is more interesting than you! :quarter:"
            ],
            'Mrs. Pomp': [
                "Such improper and uncivil behavior! :angry:",
                "Detention for your unacceptable conduct! :mad:",
                "Manners maketh the student! :quarter:"
            ],
            'Dave': [
                "Bullying is not accessibility! :wheelchair:",
                "I teach respect, not intimidation! :quarter:",
                "My wheelchair moves faster than your attitude! :angry:"
            ],
            'Miss Circle': [
                "Would you like an Oreo to calm down? :oreo:",
                "Bullying is not sweet like my cookies! :angry:",
                "Math and kindness go hand in hand! :quarter:"
            ],
            'Badsum': [
                "Error 404: Bullying not found! :funny:",
                "I'm scared of bullies... and everything else! :smallbaldi:",
                "System malfunction... bullying detected! :quarter:"
            ],
            'DSCI_0000': [
                "BULLY_PROTOCOL.EXE ENGAGED :quarter:",
                "010101 BULLYING NOT ACCEPTABLE :angry:",
                "PROCESSING NEGATIVE INTERACTION :smallbaldi:"
            ],
            'Null': [
                "Undefined response to bullying! :quarter:",
                "Cannot compute social aggression :funny:",
                "Bullying status: Rejected :angry:"
            ],
            'Baldina': [
                "Family tradition says: No bullying allowed! :happy:",
                "Math teaches respect, not intimidation! :quarter:",
                "You'll learn more by being kind! :smallbaldi:"
            ],
            'Baldllonns': [
                "I'll float away from your negativity! :dance:",
                "Bullying can't reach my altitude! :happy:",
                "Up, up, and away from your bad attitude! :quarter:"
            ],
            'Simon': [
                "Let me compose a song about respect! :music:",
                "Bullying is out of tune with life! :dance:",
                "My rhythm is stronger than your aggression! :happy:"
            ],
            'Papergirl': [
                "Don't mess with my paper collection! :paperman:",
                "Precision beats bullying every time! :angry:",
                "My organization skills will organize YOU! :quarter:"
            ],
            'Garret': [
                "Kicked out of one universe, not intimidated by you! :funny:",
                "Survival is my specialty! :quarter:",
                "Your bullying is less interesting than my stories! :happy:"
            ],
            'Bladder': [
                "I'm another Baldi variant... and I don't tolerate bullying! :smallbaldi:",
                "Calculating the probability of your failure! :quarter:",
                "Experimental mathematics says: No bullying! :angry:"
            ],
            'Paper2015Man': [
                "My big bro taught me to stand up to bullies! :paperman:",
                "Paper skills beat bullying skills! :quarter:",
                "Eight years old and already wiser than you! :happy:"
            ],
            'Noob': [
                "This isn't Roblox, bullying doesn't work here! :funny:",
                "Respawning my confidence! :quarter:",
                "Loading... anti-bully defense system! :smallbaldi:"
            ],
            'Nullbo': [
                "Error in bully interaction detected :quarter:",
                "Undefined response mechanism activated :funny:",
                "System firewall blocking negativity! :angry:"
            ],
            'Bacon': [
                "I'm just a slice of bacon... with attitude! :funny:",
                "Roblox taught me to dodge bullies! :quarter:",
                "Who wants to play instead of bullying? :happy:"
            ],
            'GeographyBoy': [
                "I'll map out exactly why bullying is wrong! :happy:",
                "Geographical knowledge beats intimidation! :quarter:",
                "Every continent has room for respect! :cool:"
            ]
        };
    }

    canSendMessage(characterName) {
        const currentCount = this.initialMessageCounts.get(characterName) || 0;
        
        if (currentCount < this.MAX_INITIAL_MESSAGES) {
            this.initialMessageCounts.set(characterName, currentCount + 1);
            return false;
        }
        
        return true;
    }

    static getBullyMessage(targetName) {
        return `Hey ${targetName}! I want your lunch money, NOW! :angry: Give me all your quarter or else you'll be sorry! :mad:`;
    }

    // New method to get a character-specific bully response
    getBullyResponse(characterName) {
        const responses = this.bullyResponses[characterName] || 
            [`Back off, ${characterName}!`];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}