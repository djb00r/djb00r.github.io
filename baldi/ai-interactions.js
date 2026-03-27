import { BaldiAI } from './baldi-ai.js';

export class AIAssistant {
    constructor() {
        this.baldiAI = new BaldiAI();
    }

    async generateResponse(prompt, context = {}) {
        return await this.baldiAI.generateResponse(prompt, context);
    }

    async analyzeContent(content, type = 'text') {
        return await this.baldiAI.analyzeContent(content, type);
    }
}

