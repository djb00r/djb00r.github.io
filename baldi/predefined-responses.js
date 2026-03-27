// REFACTORED: Removed many duplicate messages and simplified response generation
export const predefinedResponses = {
    // Removed detailed lists, now using getUniqueCharacterResponse instead
    getPredefinedResponse(character) {
        import('./character-unique-responses.js').then(module => {
            return module.getUniqueCharacterResponse(character);
        }).catch(error => {
            console.error('Error getting unique response:', error);
            return `${character} says: Hi there! :happy:`;
        });
    },

    getBullyResponse(character) {
        const bullyResponses = {
            'Paperman': "Don't touch my precious papers! :paperman:",
            'Baldi': "Math beats bullying! :quarter:",
            'Principal': "Detention for inappropriate behavior! :mad:",
            'Playtime': "Let's play instead of fighting! :dance:",
            '1st Prize': "Hugs solve conflicts! :happy:",
            'Arts & Crafters': "Creativity is my shield! :angry:",
            'Gotta Sweep': "I'll clean up your attitude! :broom:",
            'Beans': "Beans are mightier than mean words! :apple:",
            'Mrs. Pomp': "Improper conduct will not be tolerated! :quarter:",
            'Raldi': "Chaos beats bullying! :giantbaldi:",
            'Mystman12': "Error: Bullying not found! :mathflag:",
            'Dave': "Accessibility trumps aggression! :wheelchair:",
            'Miss Circle': "Kindness is sweeter than intimidation! :oreo:",
            'The Test': "Can you solve me first? :smallbaldi:",
            'Baldina': "Family tradition says: No bullying allowed! :happy:",
            'Baldllonns': "I'll float away from your negativity! :dance:",
            'Simon': "My rhythm speaks louder! :music:",
            'Papergirl': "Precision beats bullying every time! :angry:",
            'Garret': "Survival is my specialty! :quarter:",
            'Bladder': "Experimental mathematics rejects your behavior! :angry:",
            'Paper2015Man': "My big bro taught me to stand up to bullies! :paperman:",
            'Noob': "Respawning my confidence! :smallbaldi:",
            'Nullbo': "System firewall blocking negativity! :angry:",
            'Bacon': "Bacon doesn't tolerate drama! :funny:",
            'GeographyBoy': "Geographical knowledge beats intimidation! :quarter:",
            'Null': "Undefined response to aggression! :quarter:",
            'Badsum': "Error 404: Bullying not found! :funny:",
            'DSCI_0000': "BULLY_PROTOCOL.EXE ENGAGED :quarter:"
        };

        return bullyResponses[character] || `Back off, ${character}! :angry:`;
    }
};