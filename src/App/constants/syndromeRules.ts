/**
 * Implementation-ready rules based on Cognitive & Educational Framework
 */

export type SyndromeRuleSet = {
    visualPriority: 'high' | 'medium';
    auditoryHook: boolean;
    gestaltInstruction: boolean; // Whole-to-part
    repetitionFrequency: 'high' | 'standard';
    instructionStyle: 'object-first' | 'rhyme-first' | 'whole-scene' | 'structured';
    assessmentFocus: 'visual' | 'auditory' | 'gestalt';
    moduleOrder: string[];
    nonVerbalWeight: number; // 0.0 to 1.0
    verbalWeight: number;    // 0.0 to 1.0
    interactionStyle: 'direct' | 'avatar-driven' | 'indirect';
    sensoryProfile: 'standard' | 'low-arousal';
    sessionLimit: number; // minutes
    gameAdjustments: {
        balloonPopStyle: 'pop' | 'dissolve';
        memoryGameHints: boolean;
        hitboxScaling: number; // 1.0 = standard
    };
    // Enhanced fields for educational framework
    feedbackStyle: 'visual-primary' | 'auditory-primary' | 'balanced';
    animationIntensity: 'high' | 'medium' | 'low';
    advanceMode: 'auto' | 'tap' | 'both';
    errorHandling: 'gentle-redirect' | 'errorless' | 'standard';
    contentComplexity: {
        '3-5': { itemCount: number; stepsPerTask: number };
        '6-8': { itemCount: number; stepsPerTask: number };
        '9-12': { itemCount: number; stepsPerTask: number };
    };
};

export const SYNDROME_RULES: Record<string, SyndromeRuleSet> = {
    'down-syndrome': {
        visualPriority: 'high',
        auditoryHook: false,
        gestaltInstruction: false,
        repetitionFrequency: 'high',
        instructionStyle: 'object-first',
        assessmentFocus: 'visual',
        moduleOrder: ['animals', 'fruits', 'colors', 'numbers', 'letters'],
        nonVerbalWeight: 0.8,
        verbalWeight: 0.2,
        interactionStyle: 'direct',
        sensoryProfile: 'standard',
        sessionLimit: 15,
        gameAdjustments: {
            balloonPopStyle: 'pop',
            memoryGameHints: true,
            hitboxScaling: 1.3
        },
        feedbackStyle: 'visual-primary',
        animationIntensity: 'medium',
        advanceMode: 'tap',
        errorHandling: 'errorless',
        contentComplexity: {
            '3-5': { itemCount: 8, stepsPerTask: 3 },
            '6-8': { itemCount: 15, stepsPerTask: 6 },
            '9-12': { itemCount: 20, stepsPerTask: 10 }
        }
    },
    'williams': {
        visualPriority: 'medium',
        auditoryHook: true,
        gestaltInstruction: false,
        repetitionFrequency: 'standard',
        instructionStyle: 'rhyme-first',
        assessmentFocus: 'auditory',
        moduleOrder: ['songs', 'emotions', 'animals', 'letters', 'shapes'],
        nonVerbalWeight: 0.3,
        verbalWeight: 0.7,
        interactionStyle: 'avatar-driven',
        sensoryProfile: 'standard',
        sessionLimit: 10,
        gameAdjustments: {
            balloonPopStyle: 'pop',
            memoryGameHints: false,
            hitboxScaling: 1.0
        },
        feedbackStyle: 'auditory-primary',
        animationIntensity: 'high',
        advanceMode: 'auto',
        errorHandling: 'gentle-redirect',
        contentComplexity: {
            '3-5': { itemCount: 8, stepsPerTask: 3 },
            '6-8': { itemCount: 15, stepsPerTask: 6 },
            '9-12': { itemCount: 20, stepsPerTask: 10 }
        }
    },
    'fragile-x': {
        visualPriority: 'high',
        auditoryHook: false,
        gestaltInstruction: true,
        repetitionFrequency: 'standard',
        instructionStyle: 'whole-scene',
        assessmentFocus: 'gestalt',
        moduleOrder: ['life-skills', 'emotions', 'shapes', 'numbers', 'letters'],
        nonVerbalWeight: 0.6,
        verbalWeight: 0.4,
        interactionStyle: 'indirect',
        sensoryProfile: 'low-arousal',
        sessionLimit: 12,
        gameAdjustments: {
            balloonPopStyle: 'dissolve',
            memoryGameHints: true,
            hitboxScaling: 1.1
        },
        feedbackStyle: 'visual-primary',
        animationIntensity: 'low',
        advanceMode: 'auto',
        errorHandling: 'errorless',
        contentComplexity: {
            '3-5': { itemCount: 8, stepsPerTask: 3 },
            '6-8': { itemCount: 12, stepsPerTask: 6 },
            '9-12': { itemCount: 16, stepsPerTask: 10 }
        }
    },
    'autism': {
        visualPriority: 'high',
        auditoryHook: false,
        gestaltInstruction: false, // Detail-focused
        repetitionFrequency: 'high',
        instructionStyle: 'structured', // Concrete to abstract, heavily visual, predictable sequence
        assessmentFocus: 'visual',
        moduleOrder: ['life-skills', 'numbers', 'shapes', 'letters', 'emotions'], // Logical/Systemizing order
        nonVerbalWeight: 0.7,
        verbalWeight: 0.3,
        interactionStyle: 'indirect', // Avoid direct eye contact/social pressure
        sensoryProfile: 'low-arousal',
        sessionLimit: 15,
        gameAdjustments: {
            balloonPopStyle: 'dissolve', // Sensory friendly
            memoryGameHints: false, // Often have strong visual memory
            hitboxScaling: 1.0
        },
        feedbackStyle: 'visual-primary',
        animationIntensity: 'low',
        advanceMode: 'tap',
        errorHandling: 'errorless',
        contentComplexity: {
            '3-5': { itemCount: 8, stepsPerTask: 3 },
            '6-8': { itemCount: 12, stepsPerTask: 6 },
            '9-12': { itemCount: 16, stepsPerTask: 10 }
        }
    },
    'other': {
        visualPriority: 'medium',
        auditoryHook: false,
        gestaltInstruction: false,
        repetitionFrequency: 'standard',
        instructionStyle: 'object-first',
        assessmentFocus: 'visual',
        moduleOrder: ['letters', 'numbers', 'shapes', 'colors', 'animals'],
        nonVerbalWeight: 0.5,
        verbalWeight: 0.5,
        interactionStyle: 'direct',
        sensoryProfile: 'standard',
        sessionLimit: 20,
        gameAdjustments: {
            balloonPopStyle: 'pop',
            memoryGameHints: false,
            hitboxScaling: 1.0
        },
        feedbackStyle: 'balanced',
        animationIntensity: 'medium',
        advanceMode: 'both',
        errorHandling: 'standard',
        contentComplexity: {
            '3-5': { itemCount: 8, stepsPerTask: 3 },
            '6-8': { itemCount: 15, stepsPerTask: 6 },
            '9-12': { itemCount: 25, stepsPerTask: 10 }
        }
    }
};

export function getRulesForCondition(condition: string | undefined): SyndromeRuleSet {
    const key = (condition || 'other').replace('_', '-') as keyof typeof SYNDROME_RULES;
    return SYNDROME_RULES[key] || SYNDROME_RULES['other'];
}
