import { SyndromeRuleSet } from '../constants/syndromeRules';

/**
 * Helper utilities for syndrome-specific adaptations
 */

export type AgeGroup = '3-5' | '6-8' | '9-12';

/**
 * Determine age group from child's age
 */
export function getAgeGroup(age: number): AgeGroup {
    if (age <= 5) return '3-5';
    if (age <= 8) return '6-8';
    return '9-12';
}

/**
 * Filter content array based on child's age and syndrome rules
 */
export function filterContentByAge<T>(
    items: T[],
    age: number,
    rules: SyndromeRuleSet
): T[] {
    const ageGroup = getAgeGroup(age);
    const maxItems = rules.contentComplexity[ageGroup].itemCount;
    return items.slice(0, maxItems);
}

/**
 * Get maximum steps per task based on age and syndrome
 */
export function getMaxStepsPerTask(age: number, rules: SyndromeRuleSet): number {
    const ageGroup = getAgeGroup(age);
    return rules.contentComplexity[ageGroup].stepsPerTask;
}

/**
 * Get animation duration based on syndrome rules
 */
export function getAnimationDuration(rules: SyndromeRuleSet): number {
    switch (rules.animationIntensity) {
        case 'low': return 1000;
        case 'medium': return 500;
        case 'high': return 300;
    }
}

/**
 * Check if content should auto-advance
 */
export function shouldAutoAdvance(rules: SyndromeRuleSet): boolean {
    return rules.advanceMode === 'auto' || rules.advanceMode === 'both';
}

/**
 * Check if tap-to-advance is enabled
 */
export function shouldAllowTapAdvance(rules: SyndromeRuleSet): boolean {
    return rules.advanceMode === 'tap' || rules.advanceMode === 'both';
}

/**
 * Get feedback celebration component type
 */
export function getFeedbackType(rules: SyndromeRuleSet): 'visual' | 'auditory' | 'both' {
    switch (rules.feedbackStyle) {
        case 'visual-primary': return 'visual';
        case 'auditory-primary': return 'auditory';
        case 'balanced': return 'both';
    }
}

/**
 * Get sensory-appropriate background class
 */
export function getBackgroundClass(rules: SyndromeRuleSet, defaultGradient: string): string {
    return rules.sensoryProfile === 'low-arousal'
        ? 'bg-slate-50'
        : defaultGradient;
}

/**
 * Get sensory-appropriate color class
 */
export function getColorClass(
    rules: SyndromeRuleSet,
    standardColor: string,
    lowArousalColor: string = 'from-slate-300 to-slate-400'
): string {
    return rules.sensoryProfile === 'low-arousal'
        ? lowArousalColor
        : standardColor;
}

/**
 * Get sensory-appropriate text color
 */
export function getTextColorClass(
    rules: SyndromeRuleSet,
    standardColor: string,
    lowArousalColor: string = 'text-slate-600'
): string {
    return rules.sensoryProfile === 'low-arousal'
        ? lowArousalColor
        : standardColor;
}

/**
 * Get transition duration for animations
 */
export function getTransitionDuration(rules: SyndromeRuleSet): number {
    switch (rules.animationIntensity) {
        case 'low': return 800;
        case 'medium': return 500;
        case 'high': return 300;
    }
}

/**
 * Check if errorless learning should be used
 */
export function isErrorlessMode(rules: SyndromeRuleSet): boolean {
    return rules.errorHandling === 'errorless';
}

/**
 * Check if gentle redirect should be used
 */
export function isGentleRedirect(rules: SyndromeRuleSet): boolean {
    return rules.errorHandling === 'gentle-redirect';
}
