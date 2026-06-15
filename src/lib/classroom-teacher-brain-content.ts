/**
 * classroom-teacher-brain-content.ts
 *
 * Natural teacher aside templates — the "voice" of the AI teacher between
 * scripted lesson steps. These are deterministic, warm, human phrases that
 * make the teacher feel alive without requiring AI generation.
 *
 * Organized by aside type and section. The teacher brain module
 * (classroom-teacher-brain.ts) selects from these based on the classroom state.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Transition asides (between board items)
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSITION_ASIDES: string[] = [
  "Alright, let's move on to the next part.",
  "Good. Now watch this next step carefully.",
  "Now that we've seen that, let's build on it.",
  "Here's where it gets interesting. Follow along.",
  "Okay, ready for the next piece? Let's go.",
  "That's the foundation. Now let's add to it.",
  "Good progress. Let me show you what comes next.",
  "Now we're going to put that idea to work.",
  "Watch closely — this next part connects everything.",
  "Alright, let's take this a step further.",
  "Now you'll see how this all fits together.",
  "Let's keep going — you're doing well.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Encouragement asides (after correct answers or good progress)
// ─────────────────────────────────────────────────────────────────────────────

export const ENCOURAGEMENT_ASIDES: string[] = [
  "That's exactly right! You're getting the hang of this.",
  "Perfect. See how that works?",
  "Great job. You're thinking like a real mathematician now.",
  "Exactly! That's the pattern we're looking for.",
  "Well done. You picked that up quickly.",
  "That's it! You've got it.",
  "Nice work. You're building real understanding here.",
  "Spot on. Let's keep this momentum going.",
  "Excellent. You're making this look easy.",
  "That's the right approach. You're learning fast.",
  "Wonderful. See how practice pays off?",
  "You nailed it. Let's see if you can do it again.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Check-in asides (periodic, after several items)
// ─────────────────────────────────────────────────────────────────────────────

export const CHECKIN_ASIDES: string[] = [
  "Are you following so far? Let me know if anything's unclear.",
  "Take a moment to look at what we've written. Does it make sense?",
  "How are we doing? Everything clicking so far?",
  "Pause for a second — can you see the pattern we're building?",
  "Let me know if you want me to go over anything again.",
  "Are you with me? We're making good progress.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Reaction asides (to confusion or frustration)
// ─────────────────────────────────────────────────────────────────────────────

export const REACTION_CONFUSED_ASIDES: string[] = [
  "I can see this part needs a moment. That's completely normal — let's slow down.",
  "This is the tricky part. Let me go over it again more carefully.",
  "No worries at all. This takes time to sink in. Let's look at it once more.",
  "Take a breath. We'll get through this together.",
  "This is where most students pause. You're not alone — let's work through it.",
];

export const REACTION_FRUSTRATED_ASIDES: string[] = [
  "I know this feels tough right now. But you're closer than you think.",
  "It's okay to feel stuck. That means you're pushing yourself, and that's good.",
  "Let's take a different angle. Sometimes looking at it differently helps.",
  "You're doing better than you realize. Let's keep going — one step at a time.",
  "Frustration is part of learning. The fact that you're still here means you're strong.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Personality asides (analogy, humor, real-world connection)
// ─────────────────────────────────────────────────────────────────────────────

export const PERSONALITY_ASIDES: Record<string, string[]> = {
  mathematics: [
    "Think of it like a recipe — you need the right ingredients in the right amounts.",
    "This is one of those beautiful moments in math where everything clicks together.",
    "Math is like a puzzle. Each piece we add makes the picture clearer.",
    "You know what I love about this? It's so elegant once you see it.",
    "Math isn't about memorizing — it's about seeing patterns. And you're starting to see them.",
  ],
  science: [
    "This is how the natural world works — it's fascinating once you see the pattern.",
    "Think about it this way — science is just asking 'why?' and then finding the answer.",
    "This connects to something you see every day, even if you haven't noticed before.",
    "Science is like being a detective — you follow the evidence to the answer.",
  ],
  technical: [
    "This is a practical skill you'll use again and again. It's worth mastering.",
    "Think of this like building with blocks — each piece supports the next.",
    "In the real world, this is exactly how problems get solved.",
    "This is one of those skills that separates beginners from experts.",
  ],
  social: [
    "This connects to something we all experience — that's what makes it interesting.",
    "Think about this from a different perspective. What do you notice?",
    "This idea has shaped how people think for centuries.",
    "When you understand this, you start seeing it everywhere.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Bridge asides (between lesson sections)
// ─────────────────────────────────────────────────────────────────────────────

export const BRIDGE_ASIDES: Record<string, string[]> = {
  welcome: [
    "Now that we've set the stage, let's dive into the actual concept.",
    "Good — now let's get into the heart of today's lesson.",
  ],
  concept: [
    "Now that you understand the concept, let's see it in action.",
    "Great — you've got the idea. Let me show you how to use it.",
    "That's the theory. Now let's make it practical.",
  ],
  worked_example: [
    "You've seen how it works. Now let's try it together.",
    "That example shows the pattern. Let's see if you can apply it.",
    "Now that we've worked through that, let's practice.",
  ],
  guided_practice: [
    "You're doing great with guidance. Now let's see you do it on your own.",
    "Good practice. Now it's your turn — try one independently.",
  ],
  independent_practice: [
    "Excellent work. Let me summarize what you've learned today.",
    "You've proven you can do this. Let's wrap up with a quick review.",
  ],
  summary: [
    "That's everything for today. Let's do a final check before we finish.",
    "Great lesson. Let me ask you one last thing before we go.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Section-aware transition hints (used to pick more relevant transitions)
// ─────────────────────────────────────────────────────────────────────────────

export const SECTION_INTRO_PHRASES: Record<string, string[]> = {
  concept: [
    "Now let's understand the key idea behind this.",
    "Here's the concept we need to grasp.",
  ],
  worked_example: [
    "Let me walk you through a complete example.",
    "Watch how this works step by step.",
  ],
  guided_practice: ["Now let's try one together.", "Your turn to think along with me."],
  independent_practice: ["Now it's all you. Give it a shot.", "Show me what you've learned."],
  summary: ["Let's回顾 everything we covered.", "Here's a quick summary of what you learned."],
};
