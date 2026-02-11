/**
 * Learning Sequences for Each Syndrome
 * Evidence-based teaching approaches with distinct patterns
 */

export type LearningStep = {
    type: 'visual' | 'audio' | 'visual-audio' | 'interaction' | 'feedback' | 'context' | 'song' | 'social' | 'letter-name' | 'letter-sound';
    duration: number;
    silent?: boolean;
    autoAdvance?: boolean;
    blur?: boolean;
    enthusiastic?: boolean;
    waitForTap?: boolean;
};

export type SyndromeSequence = {
    intro: LearningStep[];
    learning: LearningStep[];
    feedback: LearningStep[];
};

/**
 * DOWN SYNDROME: Visual First, Concrete, Errorless
 * Evidence: Strong visual learning, weaker auditory processing (Buckley & Bird, 1993)
 */
export const downSyndromeSequence: SyndromeSequence = {
    intro: [
        { type: 'visual', duration: 2500, silent: true, waitForTap: false }, // Show image/letter silently (Visual strength)
    ],
    learning: [
        { type: 'letter-name', duration: 2000, autoAdvance: true }, // "Alif" / "Ay"
        { type: 'letter-sound', duration: 2000, autoAdvance: true }, // "A" / "/æ/"
        { type: 'visual-audio', duration: 2500, waitForTap: false }, // Image + Word connection
        { type: 'interaction', duration: 0, waitForTap: true }, // Check for engagement
    ],
    feedback: [
        { type: 'visual', duration: 1500, silent: false },
    ],
};

/**
 * WILLIAMS SYNDROME: Auditory First, Social, Musical
 * Evidence: Strong auditory/verbal skills, hypersocial (Mervis & John, 2010)
 */
export const williamsSyndromeSequence: SyndromeSequence = {
    intro: [
        { type: 'song', duration: 3500, enthusiastic: true, autoAdvance: true }, // Musical intro
        { type: 'social', duration: 2500, enthusiastic: true, autoAdvance: true }, // "Are you ready?"
    ],
    learning: [
        { type: 'audio', duration: 2500, autoAdvance: true }, // Hear name/sound first!
        { type: 'visual-audio', duration: 3000, autoAdvance: true }, // Then see with audio
        { type: 'social', duration: 2000, autoAdvance: true }, // Social question
    ],
    feedback: [
        { type: 'social', duration: 2500, enthusiastic: true }, // Enthusiastic verbal praise
        { type: 'song', duration: 2000, enthusiastic: true }, // Musical celebration
    ],
};

/**
 * FRAGILE X SYNDROME: Context First, Slow, Predictable
 * Evidence: Sensory sensitivities, anxiety, need for context (Cornish et al., 2004)
 */
export const fragileXSequence: SyndromeSequence = {
    intro: [
        { type: 'context', duration: 4000, blur: true }, // Show whole scene (blurred) first
        { type: 'social', duration: 2500, silent: false }, // Calm invitation "Let's explore"
    ],
    learning: [
        { type: 'visual', duration: 4000, silent: true }, // Slow reveal of detail
        { type: 'visual-audio', duration: 3000, waitForTap: false }, // Direct connection
        { type: 'interaction', duration: 0, waitForTap: true }, // Wait for ready
    ],
    feedback: [
        { type: 'visual', duration: 2500, silent: true }, // Gentle visual reward
    ],
};

/**
 * AUTISM: Structured, Predictable, Visual Schedule
 * Evidence: Visual thinking, need for predictability (Grandin, 2006)
 */
export const autismSequence: SyndromeSequence = {
    intro: [
        { type: 'social', duration: 2000, silent: false }, // Direct "Start lesson"
    ],
    learning: [
        { type: 'visual', duration: 3000, silent: true }, // Clear image focus
        { type: 'audio', duration: 2000, waitForTap: false }, // Brief, clear audio
        { type: 'interaction', duration: 0, waitForTap: true }, // Clear choice
    ],
    feedback: [
        { type: 'feedback', duration: 2000, silent: false }, // Consistent "Correct" reward
    ],
};

/**
 * Get the appropriate learning sequence for a syndrome
 */
export function getLearningSequence(syndrome: string): SyndromeSequence {
    const key = syndrome.replace('_', '-');
    switch (key) {
        case 'down-syndrome':
            return downSyndromeSequence;
        case 'williams':
            return williamsSyndromeSequence;
        case 'fragile-x':
            return fragileXSequence;
        case 'autism':
            return autismSequence;
        default:
            return downSyndromeSequence;
    }
}
