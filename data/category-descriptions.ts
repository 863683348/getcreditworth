/**
 * 分类页面独特描述
 * 每个分类一段独特的编辑性描述，解决 thin content 问题
 * slug → { heading, paragraphs, tips }
 */

export interface CategoryDescription {
  heading: string;
  paragraphs: string[];
  tips?: string[];
}

export const CATEGORY_DESCRIPTIONS: Record<string, CategoryDescription> = {
  fantasy: {
    heading: "Why Fantasy Audiobooks Are Perfect for Audible Credits",
    paragraphs: [
      "Fantasy audiobooks are the ideal use case for Audible credits. The genre is famous for epic-length novels that run 30-60 hours — giving you the lowest cost per hour of any audiobook category. A single credit on a 45-hour fantasy saga costs you just $0.33/hour of entertainment.",
      "From sprawling series like The Wheel of Time and The Stormlight Archive to standalone masterpieces, fantasy audiobooks deliver immersive world-building that is best experienced through top-tier narration. Many fantasy series have dedicated voice actors who become the voice of beloved characters.",
    ],
    tips: [
      "Prioritize series starters — the first book in a long series gives you the best value",
      "Check narrator samples before spending a credit on a new-to-you narrator",
      "Books with 25+ hours runtimes offer the best credit-to-value ratio in fantasy",
    ],
  },
  "science-fiction": {
    heading: "Science Fiction Audiobooks: Maximum Value for Your Credits",
    paragraphs: [
      "Science fiction audiobooks consistently rank among the best values for Audible credits. The genre produces long-form narratives with complex world-building that translates perfectly to audio. With average runtimes of 15-25 hours per book and many series spanning 5-10+ installments, sci-fi gives you exceptional hours-per-credit ratios.",
      "Top sci-fi narrators like RC Bray, Ray Porter, and Scott Brick have become genre icons in their own right, elevating already great stories into unforgettable audio experiences.",
    ],
    tips: [
      "Look for box sets — multi-book collections on a single credit offer insane value",
      "Space opera sub-genre often has the longest runtimes per credit",
      "Check if a book is part of a series before investing a credit",
    ],
  },
  "historical-fiction": {
    heading: "Historical Fiction on Audible: Credits Well Spent",
    paragraphs: [
      "Historical fiction offers a unique value proposition on Audible: you get both entertainment and education from a single credit. Many historical fiction audiobooks run 20-35 hours, covering sweeping sagas that transport you to another era. The genre's attention to period detail and character depth makes it especially rewarding in audio format.",
    ],
  },
  mystery: {
    heading: "Best Mystery Audiobooks for Your Audible Credits",
    paragraphs: [
      "Mystery audiobooks are a staple of the Audible ecosystem. While individual mysteries tend to be shorter (8-14 hours), series mysteries accumulate exceptional value over time. A single credit on a well-reviewed mystery gives you a tight, satisfying narrative that keeps you engaged during commutes or chores.",
    ],
  },
  thriller: {
    heading: "Thriller Audiobooks: Adrenaline-Fueled Credit Value",
    paragraphs: [
      "Thrillers excel in audio format — fast pacing, short chapters, and nail-biting tension translate perfectly to spoken word. While thrillers average 10-15 hours, the genre's high ratings (4.3+ average on Audible) ensure every credit spent delivers a quality experience. The best thriller series can hook you for dozens of hours across multiple books.",
    ],
  },
  biography: {
    heading: "Biography and Memoir Audiobooks Worth Your Credit",
    paragraphs: [
      "Biographies and memoirs are among the most rewarding audiobook genres. Hearing someone's life story narrated — often by the author themselves — adds an intimacy that reading cannot match. The best biographies run 15-25 hours, offering deep dives into fascinating lives at excellent cost-per-hour ratios.",
      "Many celebrity memoirs are narrated by the subject, adding authenticity that makes every credit feel well spent.",
    ],
  },
  business: {
    heading: "Business Audiobooks: Invest Your Credits Wisely",
    paragraphs: [
      "Business audiobooks turn your Audible credit into a career investment. From entrepreneurship guides to leadership manuals, the best business audiobooks pack actionable insights into 8-12 hours of listening. While shorter than fiction, their practical value often exceeds the credit cost many times over.",
    ],
    tips: [
      "Prioritize books with practical frameworks you can apply immediately",
      "Check publication dates — business books older than 5 years may have outdated advice",
      "Sample the narration before committing a credit to a business book",
    ],
  },
  "self-help": {
    heading: "Self-Help Audiobooks: Transformative Credit Value",
    paragraphs: [
      "Self-help audiobooks offer arguably the highest ROI per credit — the knowledge you gain can change your habits, career, and relationships. The best self-help titles on Audible combine research-backed insights with engaging narration that makes complex ideas stick. With ratings averaging 4.4+ stars, the genre consistently delivers quality.",
    ],
  },
  psychology: {
    heading: "Psychology Audiobooks: Understand Yourself and Others",
    paragraphs: [
      "Psychology audiobooks offer a fascinating window into human behavior. From behavioral economics to cognitive science, the genre's best titles are narrated with the clarity and engagement that complex topics deserve. Many psychology audiobooks run 10-16 hours — enough depth to cover serious research without overstaying their welcome.",
    ],
  },
  horror: {
    heading: "Horror Audiobooks That Are Worth Your Credit",
    paragraphs: [
      "Horror audiobooks have a secret advantage — the audio format amplifies tension and atmosphere in ways reading cannot. A skilled narrator can turn a good horror novel into a genuinely terrifying experience. While horror books average 10-14 hours, their immersive quality makes every minute of your credit count.",
    ],
  },
  romance: {
    heading: "Romance Audiobooks: Emotional Value for Your Credits",
    paragraphs: [
      "Romance audiobooks have become one of Audible's most popular categories for good reason. Dual-narration (male and female voice actors for each perspective character) has elevated the audio romance experience dramatically. With books averaging 10-12 hours and consistently high ratings, romance credits deliver reliable emotional satisfaction.",
    ],
  },
  "young-adult": {
    heading: "Young Adult Audiobooks: Quality Storytelling for All Ages",
    paragraphs: [
      "YA audiobooks punch above their weight class on credit value. Despite shorter runtimes (8-12 hours), the genre produces some of the highest-rated audiobooks on Audible, with ratings regularly hitting 4.6-4.8 stars. The combination of compelling storytelling, excellent narration, and tight pacing makes YA a safe bet for your credits.",
    ],
  },
  classic: {
    heading: "Classic Literature Audiobooks: Timeless Credit Value",
    paragraphs: [
      "Classic literature audiobooks are perhaps the best value proposition on Audible. These are works in the public domain that Audible has produced with professional narration — and they are often priced competitively. With many classics running 15-30+ hours and bearing 4.5+ star ratings, they offer exceptional credit value.",
    ],
    tips: [
      "The Count of Monte Cristo (52h) and Les Misérables (60h+) are among the best credit values in all of Audible",
      "Check for modern narrations — classic texts benefit greatly from skilled voice actors",
      "Many classics are available in the Plus Catalog, so check before spending a credit",
    ],
  },
};

export function getCategoryDescription(slug: string): CategoryDescription | null {
  return CATEGORY_DESCRIPTIONS[slug] ?? null;
}

export function getCategoryDescriptionSlugs(): string[] {
  return Object.keys(CATEGORY_DESCRIPTIONS);
}
