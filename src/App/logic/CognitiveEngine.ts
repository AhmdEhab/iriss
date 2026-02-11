import { MASTER_CURRICULUM, CurriculumItem } from '../data/MasterCurriculum';
import { SYNDROME_RULES, SyndromeRuleSet } from '../constants/syndromeRules';

export interface LearningSession {
    id: string;
    items: CurriculumItem[];
    syndrome: string;
    targetDuration: number; // in items or minutes
}

export interface PerformanceSnapshot {
    itemId: string;
    repeated: boolean;
    completed: boolean;
    timestamp: number;
}

/**
 * Cognitive Learning Engine
 * Orchestrates the "Brain" of the pedagogical program
 */
export class CognitiveEngine {
    /**
     * Generate a personalized learning session
     */
    static generateSession(
        syndrome: string,
        progress: Record<string, number>,
        previousSessions: PerformanceSnapshot[]
    ): LearningSession {
        const rules = SYNDROME_RULES[syndrome.replace('_', '-')] || SYNDROME_RULES['other'];
        const sessionItems: CurriculumItem[] = [];

        // 1. Prioritize modules based on Syndrome Rule moduleOrder
        const preferredModules = rules.moduleOrder;

        // 2. Pick items from the current module the child is working on
        for (const module of preferredModules) {
            const moduleItems = MASTER_CURRICULUM.filter(i => i.category === (module as any));

            // Find items not yet mastered (simplified logic for now)
            const remainingItems = moduleItems.filter(item => {
                const itemProgress = progress[item.id] || 0;
                return itemProgress < 3; // Basic mastery threshold
            });

            if (remainingItems.length > 0) {
                // Add a mix of new and review items
                const sessionSize = rules.contentComplexity['3-5'].itemCount; // Default to younger group if unknown
                sessionItems.push(...remainingItems.slice(0, sessionSize));
                break; // Focus on one module at a time for structured learning
            }
        }

        // 3. Fallback to general items if no preferred items found
        if (sessionItems.length === 0) {
            sessionItems.push(...MASTER_CURRICULUM.slice(0, 5));
        }

        return {
            id: `session_${Date.now()}`,
            items: sessionItems,
            syndrome,
            targetDuration: rules.sessionLimit
        };
    }

    /**
     * Adjust pedagogical rules based on performance trends
     */
    static evaluateAndAdapt(
        currentRules: SyndromeRuleSet,
        performance: PerformanceSnapshot[]
    ): Partial<SyndromeRuleSet> {
        const adaptions: Partial<SyndromeRuleSet> = {};

        const repeatRate = performance.filter(p => p.repeated).length / performance.length;
        if (repeatRate > 0.4) {
            adaptions.animationIntensity = 'low';
            adaptions.errorHandling = 'errorless';
        }

        const completionSpeed = performance.length / (performance[performance.length - 1]?.timestamp - performance[0]?.timestamp || 1);
        if (completionSpeed > 2) { 
            adaptions.animationIntensity = 'high';
        }

        return adaptions;
    }
}
