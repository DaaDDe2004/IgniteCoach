// AI Coach functionality for full chat view
const AI_COACH_PROMPTS = {
    greeting: "Hey! I'm your AI fitness coach. I can help with workout plans, form tips, nutrition advice, or just motivation. What would you like to work on today?",
    
    workout: {
        triggers: ['workout', 'routine', 'exercise', 'training'],
        responses: [
            "I can generate a personalized workout based on your goals and available equipment. What are you training today?",
            "Let's crush this! What's your focus today - strength, hypertrophy, or conditioning?",
            "How much time do you have? I can optimize your workout for any duration."
        ]
    },
    
    nutrition: {
        triggers: ['food', 'eat', 'diet', 'protein', 'calorie', 'meal'],
        responses: [
            "Nutrition is 80% of the battle! Are you looking to bulk, cut, or maintain?",
            "Tracking your macros? I can help you hit your protein goals while keeping calories in check.",
            "Meal prep Sunday? Let me suggest some high-protein, easy-prep meals."
        ]
    },
    
    form: {
        triggers: ['form', 'technique', 'hurt', 'pain', 'shoulder', 'back', 'knee'],
        responses: [
            "Form is everything! Can you describe what you're feeling, or better yet, upload a video?",
            "Pain is a signal, not a weakness. Let's modify the exercise to work around that.",
            "Try reducing the weight 20% and focusing on tempo. Slow and controlled beats heavy and sloppy."
        ]
    },
    
    motivation: {
        triggers: ['motivated', 'tired', 'bored', 'plateau', 'stuck'],
        responses: [
            "Everyone has off days. Remember: showing up is 90% of the battle. Even a light workout counts!",
            "Plateaus are part of the process. Let's switch up your routine or deload for a week.",
            "Look how far you've come! Check your progress chart - you're crushing it compared to 3 months ago."
        ]
    }
};

class AICoach {
    constructor() {
        this.context = [];
        this.maxContext = 10;
    }
    
    processMessage(message) {
        const lower = message.toLowerCase();
        
        // Check for specific triggers
        for (const [category, data] of Object.entries(AI_COACH_PROMPTS)) {
            if (category === 'greeting') continue;
            
            if (data.triggers.some(trigger => lower.includes(trigger))) {
                return this.getRandomResponse(data.responses);
            }
        }
        
        // Default responses
        const defaults = [
            "Interesting! Tell me more about your fitness journey.",
            "I'm here to help 24/7. What specific aspect would you like to dive into?",
            "Let's set some goals! What would you like to achieve in the next 90 days?",
            "Have you tracked today's workout yet? I can analyze your volume and suggest adjustments."
        ];
        
        return this.getRandomResponse(defaults);
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    addToContext(role, message) {
        this.context.push({ role, message, timestamp: new Date() });
        if (this.context.length > this.maxContext) {
            this.context.shift();
        }
    }
}

// Initialize AI Coach
const aiCoach = new AICoach();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AICoach;
}