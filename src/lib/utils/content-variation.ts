// Advanced Content Variation Engine for High-Quality SEO Text
export class ContentVariation {
    // Synonyms for key terms to prevent keyword stuffing
    private static synonyms: Record<string, string[]> = {
        'sober living': ['recovery housing', 'transitional living', 'sober homes', 'recovery residences', 'supportive housing'],
        'treatment': ['recovery services', 'addiction care', 'substance use treatment', 'rehabilitation', 'healing journey'],
        'facility': ['center', 'residence', 'home', 'environment', 'community'],
        'support': ['guidance', 'assistance', 'care', 'mentorship', 'help'],
        'comprehensive': ['holistic', 'complete', 'all-encompassing', 'thorough', 'extensive'],
        'residents': ['individuals', 'community members', 'guests', 'clients', 'participants']
    };

    // Sentence templates for different section types
    private static templates = {
        intro: [
            "For individuals in {city} seeking a fresh start, {service} offers a vital bridge to long-term sobriety.",
            "Navigating recovery in {city} is easier with access to quality {service} that prioritizes personal growth.",
            "Located in the heart of {county} County, {city} provides a supportive backdrop for {service} and lasting change.",
            "Residents of {city} have access to premier {service} designed to support every stage of the recovery journey.",
            "Finding the right {service} in {city} is the first step toward a healthier, substance-free life."
        ],
        benefit: [
            "One of the key advantages of this approach is {benefit}, which helps build a strong foundation for the future.",
            "By focusing on {benefit}, participants can better address the underlying challenges of addiction.",
            "Experience the transformative power of {benefit}, a core component of successful recovery in {city}.",
            "Our network emphasizes {benefit} to ensure every individual receives the personalized care they deserve."
        ],
        community: [
            "The {city} recovery community is known for its welcoming atmosphere and dedication to mutual support.",
            "In {city}, you'll find a vibrant network of peers committed to walking the path of sobriety together.",
            "Connect with others in {city} who share your goals and understand the challenges of the recovery process.",
            "Local support groups in {city} play a crucial role in maintaining accountability and fostering connection."
        ]
    };

    // Get a synonym for a term, rotating based on a seed to ensure consistency within a page but variety across pages
    static getSynonym(term: string, seed: number): string {
        const options = this.synonyms[term.toLowerCase()];
        if (!options) return term;
        return options[seed % options.length];
    }

    // Generate a varied sentence using a template and local context
    static generateSentence(type: 'intro' | 'benefit' | 'community', context: { city: string; county?: string; service?: string; benefit?: string }, seed: number): string {
        const options = this.templates[type];
        const template = options[seed % options.length];

        let sentence = template
            .replace(/{city}/g, context.city)
            .replace(/{county}/g, context.county || 'local')
            .replace(/{service}/g, context.service || 'recovery services')
            .replace(/{benefit}/g, context.benefit || 'holistic care');

        return sentence;
    }

    // Inject local context naturally into a paragraph
    static enhanceWithContext(content: string, context: { population?: number; demographics?: string; facilities?: number }): string {
        if (!context.population && !context.facilities) return content;

        const enhancements = [];
        if (context.population) {
            enhancements.push(`Serving a community of over ${context.population.toLocaleString()} residents,`);
        }
        if (context.facilities) {
            enhancements.push(`with access to ${context.facilities}+ specialized facilities,`);
        }

        const prefix = enhancements.join(' ') + ' ';
        return prefix + content.charAt(0).toLowerCase() + content.slice(1);
    }

    // Generate a unique hash for consistent randomization
    static generateHash(input: string): number {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}
