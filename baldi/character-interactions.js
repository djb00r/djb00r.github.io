import { characterPersonalities } from './character-personalities.js';
import { predefinedResponses } from './predefined-responses.js';

export class CharacterInteractions {
    static getCharacterPersonality(characterName) {
        // First, try character personalities
        if (characterPersonalities[characterName]) {
            return characterPersonalities[characterName];
        }

        // Then try predefined responses
        if (predefinedResponses[characterName]) {
            return predefinedResponses[characterName];
        }

        // If no specific personality found, generate a default
        return [
            `Hi, I'm ${characterName}! :happy:`,
            `Just hanging out in the Here School chat :quarter:`,
            `Anybody want to chat? :smallbaldi:`
        ];
    }

    static getRandomMessageForCharacter(characterName) {
        const messages = this.getCharacterPersonality(characterName);
        return messages[Math.floor(Math.random() * messages.length)] || 
               predefinedResponses.getDefaultResponse(characterName);
    }
}