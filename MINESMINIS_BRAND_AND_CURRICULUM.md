# MinesMinis - Brand Identity, Educational Methodology & Curriculum

> **Document Version:** 1.0
> **Date:** 2026-03-16
> **Status:** Canonical Reference - All agents and teams must use this as the single source of truth.

---

# TABLE OF CONTENTS

1. [Brand Identity](#1-brand-identity)
2. [Educational Methodology](#2-educational-methodology)
3. [Curriculum Structure](#3-curriculum-structure)
4. [Game Types](#4-game-types)
5. [Smart Board / Classroom Mode](#5-smart-board--classroom-mode)
6. [Parent Dashboard](#6-parent-dashboard)
7. [Subscription Tiers](#7-subscription-tiers)
8. [User Flows](#8-user-flows)

---

# 1. BRAND IDENTITY

## 1.1 Name & Tagline

**Name:** MinesMinis

**Tagline:** *"Little Words, Big Worlds"*

**Secondary taglines for marketing:**
- "Where English Comes Alive"
- "Learn English with Mimi"
- "Her kelime bir macera" (Turkish marketing)

## 1.2 Mission

Premium English education for children ages 1-10 through play, stories, and adventure. Every interaction teaches. Every game has purpose. Every child feels like a hero on a learning journey guided by their dragon friend Mimi.

## 1.3 Brand Personality

| Trait | What It Means | What It Does NOT Mean |
|-------|--------------|----------------------|
| **Warm** | Inviting, safe, encouraging | Not saccharine or patronizing |
| **Smart** | Research-backed, purposeful design | Not dry, academic, or boring |
| **Playful** | Delightful interactions, surprise moments | Not chaotic, noisy, or overstimulating |
| **Premium** | Refined visuals, smooth UX, attention to detail | Not cold, corporate, or exclusionary |
| **Trustworthy** | Parents feel confident, teachers feel supported | Not preachy or over-promising |

**Brand Voice:**
- Speaks TO children, not DOWN to them
- Turkish and English blend naturally (Mimi is bilingual)
- Short, clear sentences for children; warm, data-rich language for parents
- Never uses fear, shame, or punishment language
- Celebrates effort, not just correctness

---

## 1.4 Visual Identity

### 1.4.1 Color System

> **IMPORTANT:** This is a completely new palette. The old purple (#6C5CE7) palette is deprecated and must NOT be used anywhere.

#### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Honey Amber** | `#E8A317` | 232, 163, 23 | Primary brand color. Buttons, highlights, headers. Warm, inviting, educational. Evokes curiosity and warmth. |
| **Honey Amber Light** | `#F5CC5C` | 245, 204, 92 | Hover states, secondary highlights, soft backgrounds |
| **Honey Amber Dark** | `#C4880F` | 196, 136, 15 | Active states, text on light backgrounds |

#### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Deep Teal** | `#1A6B5A` | 26, 107, 90 | Secondary actions, navigation, accents. Grounding, trustworthy, educational. |
| **Deep Teal Light** | `#2A9D8F` | 42, 157, 143 | Cards, badges, secondary UI |
| **Deep Teal Dark** | `#134D42` | 19, 77, 66 | Footer, dark mode accents |

#### Mimi Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Mimi Green** | `#4CAF50` | 76, 175, 80 | Mimi's body, primary dragon color |
| **Mimi Green Light** | `#81C784` | 129, 199, 132 | Mimi's belly, glow effects |
| **Mimi Green Dark** | `#2E7D32` | 46, 125, 50 | Mimi's scales, shadow |
| **Mimi Gold** | `#FFD54F` | 255, 213, 79 | Mimi's eyes, sparkle effects, XP indicators |

#### Semantic Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Success** | `#43A047` | 67, 160, 71 | Correct answers, completed lessons, achievements |
| **Warning** | `#FB8C00` | 251, 140, 0 | Time alerts, gentle reminders |
| **Error** | `#E53935` | 229, 57, 53 | Incorrect answers (used gently, never punishing) |
| **Error Soft** | `#FFCDD2` | 255, 205, 210 | Error backgrounds (soft, non-threatening) |
| **Info** | `#1E88E5` | 30, 136, 229 | Tips, hints, Mimi suggestions |

#### Neutral Scale

| Name | Hex | Usage |
|------|-----|-------|
| **Ink** | `#1A1A2E` | Primary text, headings |
| **Charcoal** | `#2D2D44` | Body text |
| **Slate** | `#5C5C7A` | Secondary text, captions |
| **Stone** | `#9393A8` | Placeholder text, disabled |
| **Cloud** | `#D4D4E0` | Borders, dividers |
| **Mist** | `#EEEEF5` | Card backgrounds, subtle fills |
| **Snow** | `#F8F8FC` | Page backgrounds |
| **White** | `#FFFFFF` | Cards, modals, clean surfaces |

#### Background Gradients

```
/* Primary warm gradient - for hero sections, world cards */
--gradient-warm: linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 50%, #FDECC8 100%);

/* Mimi's world gradient - for game screens */
--gradient-mimi: linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 100%);

/* Premium dark gradient - for parent/teacher dashboards */
--gradient-premium: linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%);

/* Sky gradient - for world map backgrounds */
--gradient-sky: linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 30%, #90CAF9 100%);
```

### 1.4.2 Typography

| Role | Font | Weight | Size | Usage |
|------|------|--------|------|-------|
| **Display** | Nunito | 800 (ExtraBold) | 32-48px | World titles, hero text |
| **Heading 1** | Nunito | 700 (Bold) | 24-32px | Section headers |
| **Heading 2** | Nunito | 700 (Bold) | 20-24px | Card titles, lesson names |
| **Heading 3** | Nunito | 600 (SemiBold) | 16-20px | Sub-sections |
| **Body** | Inter | 400 (Regular) | 14-16px | General text, descriptions |
| **Body Strong** | Inter | 600 (SemiBold) | 14-16px | Emphasized body text |
| **Caption** | Inter | 400 (Regular) | 12-13px | Metadata, timestamps |
| **Button** | Nunito | 700 (Bold) | 14-16px | All interactive buttons |
| **Child Text** | Nunito | 600 (SemiBold) | 18-24px | Text children read directly (larger, rounder) |

**Why Nunito + Inter:**
- Nunito: Rounded terminals feel friendly without being childish. Excellent readability at all sizes. Premium feel.
- Inter: Clean, professional for parent/teacher interfaces. Superb legibility on screens.
- Both are free (Google Fonts), load fast, and have full character sets including Turkish characters.

### 1.4.3 Spacing & Sizing System

**Base unit:** 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight gaps, icon padding |
| `--space-sm` | 8px | Inline spacing, small gaps |
| `--space-md` | 16px | Standard component padding |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Major section gaps |
| `--space-2xl` | 48px | Page-level spacing |
| `--space-3xl` | 64px | Hero sections |

**Border Radius:**

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Buttons, inputs |
| `--radius-md` | 12px | Cards, modals |
| `--radius-lg` | 16px | Large cards, world tiles |
| `--radius-xl` | 24px | Feature cards, hero elements |
| `--radius-full` | 9999px | Avatars, badges, pills |

**Shadows:**

```
--shadow-sm: 0 1px 3px rgba(26, 26, 46, 0.08);
--shadow-md: 0 4px 12px rgba(26, 26, 46, 0.10);
--shadow-lg: 0 8px 24px rgba(26, 26, 46, 0.12);
--shadow-xl: 0 16px 48px rgba(26, 26, 46, 0.16);
--shadow-glow: 0 0 20px rgba(232, 163, 23, 0.3);  /* Mimi's warm glow */
```

### 1.4.4 Iconography & Illustrations

- Icons: Rounded, 2px stroke weight, consistent with Nunito's friendly character
- Style: Flat with subtle depth (not fully flat, not skeuomorphic)
- Illustrations: Warm, hand-drawn feel but clean lines. Think "premium children's book" not "clip art"
- Mimi appears as a full character (not an icon) in various poses and expressions
- World backgrounds: Rich, layered parallax illustrations unique to each world

### 1.4.5 Motion & Animation

- Micro-interactions: 200-300ms, ease-out curves
- Page transitions: 400ms, smooth slide or fade
- Mimi animations: Lottie-based, 30fps, expressive but not distracting
- Celebration effects: Confetti, sparkles, Mimi dance (reserved for real achievements)
- Loading: Mimi breathing animation or playful tail wag
- Never: Flashing, shaking, or attention-hijacking animations

---

## 1.5 Mimi - Character Bible

### Who Is Mimi?

Mimi is a young, friendly green dragon who loves languages. Mimi is NOT a mascot in the traditional sense -- Mimi is the child's companion, guide, and friend throughout their entire learning journey.

### Personality Traits

| Trait | Expression |
|-------|-----------|
| **Curious** | Mimi asks questions, wonders aloud, gets excited about new words |
| **Encouraging** | "You're doing great!" / "Harika gidiyorsun!" / "Let's try again together!" |
| **Sometimes Silly** | Makes funny faces, pretends to not know a word (so the child can teach Mimi) |
| **Wise** | Explains things simply, draws connections between words, shares fun facts |
| **Supportive** | Never judges mistakes. "Oops! That's okay, let's try again!" |
| **Bilingual** | Speaks Turkish and English naturally, code-switches like a real bilingual friend |

### Mimi's Emotional States

| State | When | Visual | Audio |
|-------|------|--------|-------|
| **Happy** | Child gets answer right | Big smile, little jump, sparkle eyes | Cheerful chirp |
| **Excited** | New lesson, new world unlocked | Wings flutter, bounces | Ascending trill |
| **Thinking** | Waiting for child's answer | Taps chin, looks up | Soft hum |
| **Encouraging** | Child gets wrong answer | Gentle nod, kind eyes | Warm tone |
| **Celebrating** | Lesson complete, badge earned | Full dance, confetti breath | Victory melody |
| **Sleepy** | App idle, bedtime reminder | Yawns, curls up | Soft lullaby note |
| **Storytelling** | Story segments | Sits with book, animated gestures | Warm narration voice |
| **Curious** | Introducing new topic | Wide eyes, tilted head | Wonder sound |

### Mimi's Role in Each Context

| Context | Mimi's Role | Example |
|---------|-------------|---------|
| **Lesson Intro** | Guide | "Today we're going to learn about animals! Hayvanlar hakkinda ogrenecegiz!" |
| **Vocabulary** | Teacher | Points to image, says word, encourages child to repeat |
| **Games** | Cheerleader | Reacts to right/wrong answers, keeps energy up |
| **Stories** | Narrator | Tells the story, voices characters, asks comprehension questions |
| **Assessment** | Supportive tester | "Let's see what you remember! Ben de seninle dusunecegim." |
| **Achievement** | Celebrator | Full celebration animation, awards badge |
| **Hint** | Helper | "Hmm, think about what color the sky is... Gokyuzunun rengi ne?" |
| **Idle** | Companion | Plays with butterflies, reads a book, practices words |

### Mimi Speech Patterns

**For Ages 1-3:**
- Very short phrases: "Look! A cat! Kediii!"
- Lots of repetition and rhythm
- Sound effects and animal noises
- Mostly Turkish with English target words highlighted

**For Ages 4-6:**
- Simple bilingual sentences: "This is a dog. Turkce'de kopek diyoruz!"
- Questions: "Can you say 'apple'? Soyle bakalim!"
- Encouragement: "Wow, you remembered! Hafiza sende!"

**For Ages 7-8:**
- More English, less Turkish scaffolding
- "Let's read this sentence together. Ready?"
- Grammar hints: "When we talk about yesterday, we say 'went' not 'goed'. Interesting, right?"

**For Ages 9-10:**
- Primarily English with Turkish only for complex explanations
- "Great paragraph! I noticed you used three different adjectives. That makes your writing vivid."
- Conversational: "What do YOU think happened next in the story?"

---

# 2. EDUCATIONAL METHODOLOGY

## 2.1 Theoretical Foundation

MinesMinis' methodology is built on established research in child language acquisition and educational psychology:

| Theory | Application in MinesMinis |
|--------|--------------------------|
| **Krashen's Input Hypothesis (i+1)** | Content is always one step above current level. Comprehensible input with slight stretch. |
| **Vygotsky's Zone of Proximal Development** | Mimi provides scaffolding that gradually withdraws as competence grows. |
| **Ebbinghaus Forgetting Curve / Spaced Repetition** | Vocabulary reappears at calculated intervals. Words due for review are woven into games and stories. |
| **Total Physical Response (TPR)** | Interactive gestures, tap-to-match, drag-and-drop mirror physical action learning. |
| **Multiple Intelligences (Gardner)** | Visual (images), auditory (sound), linguistic (text), kinesthetic (interaction), musical (songs/rhymes). |
| **Flow Theory (Csikszentmihalyi)** | Difficulty adjusts to maintain challenge without frustration. Micro-lessons prevent cognitive overload. |
| **Positive Reinforcement (Skinner)** | Every correct action receives immediate positive feedback. Mistakes receive gentle redirection, never punishment. |
| **Constructivism (Piaget)** | Children build understanding through active exploration, not passive reception. |

## 2.2 Core Principles

### Principle 1: Play IS the Lesson
Games are not rewards for completing work. Games ARE the work. Every tap, drag, match, and choice is a learning moment disguised as play.

### Principle 2: Spaced Repetition Engine
Every word the child encounters enters a spaced repetition queue. The system tracks:
- When the word was first introduced
- How many times it's been seen
- How many times it's been recalled correctly
- Time since last review
- Confidence score (0-100)

Words are scheduled for review using a modified SM-2 algorithm adapted for children:
- New words: Review after 1 min, 10 min, 1 day, 3 days, 7 days, 14 days, 30 days
- Failed recall: Reset interval to 1 day
- Successful recall: Advance to next interval
- Words appear naturally in games and stories, not as boring flashcard drills

### Principle 3: Multi-Sensory Input
Every new vocabulary word is presented through ALL channels:
1. **See:** Image + written word + animation
2. **Hear:** Native pronunciation + Mimi's voice
3. **Speak:** Prompted to repeat (optional mic input for older children)
4. **Interact:** Tap, drag, match, or draw the word
5. **Context:** See the word used in a Mimi story sentence

### Principle 4: Scaffolded Difficulty (i+1)
- The system continuously assesses the child's level
- New content is always slightly above current mastery
- If a child struggles, difficulty drops gracefully (never punishing)
- If a child excels, difficulty increases to prevent boredom
- The child never sees a "level" number -- they just feel appropriately challenged

### Principle 5: Positive Reinforcement Only
- Correct answer: Mimi celebrates, XP awarded, sparkle effect
- Incorrect answer: Mimi gently says "Almost! Let's try again" or gives a hint
- NEVER: Red X marks, buzzer sounds, point deductions, frowning faces
- Error feedback is soft pink/warm, never harsh red
- The word "wrong" is never used. "Not quite" or "Almost" instead.

### Principle 6: Story-Driven Context
Words are NEVER taught in isolation. Every vocabulary word lives inside:
- A Mimi adventure story for that world
- Meaningful sentences the child encounters
- Dialogues between characters
- Songs and rhymes
- Real-life scenarios the child recognizes

### Principle 7: Active Recall Over Passive Recognition
- Prioritize: "What is this?" (child produces answer)
- Over: "Is this a cat or a dog?" (child just recognizes)
- Production exercises increase as age and level increase
- Recognition exercises scaffold toward production

### Principle 8: Micro-Lessons (3-5 Minutes)
- Each lesson is 3-5 minutes maximum
- Designed for the attention span of each age group:
  - Ages 1-3: 2-3 minutes per session
  - Ages 4-6: 3-4 minutes per session
  - Ages 7-8: 4-5 minutes per session
  - Ages 9-10: 5-7 minutes per session
- A "daily session" is 3-5 micro-lessons = 15-25 minutes
- Children can stop between any two micro-lessons without losing progress

## 2.3 Age Group Methodology

### Ages 1-3: "Mimi's Baby World" (Sensory Exposure Phase)

**Goal:** Familiarize with English sounds, build audio vocabulary of 50-80 words, enjoy English as a positive experience.

**Approach:**
- Parent-guided sessions (parent holds device, child watches/interacts)
- Heavy use of nursery rhymes, songs, and rhythmic speech
- Mimi animated shorts (30-60 seconds each)
- Tap-anywhere interactivity (every tap produces a sound/word)
- Focus on: colors, shapes, animals, body parts, family words, basic actions
- NO reading, NO writing, NO assessment pressure
- Turkish is primary language of instruction, English words are highlighted targets

**Session Structure:**
1. Mimi sings/dances (30 sec)
2. Show & Say: Mimi shows 3-5 objects, names them in English (1 min)
3. Tap & Play: Child taps objects to hear names repeated (1 min)
4. Song/Rhyme: Short nursery rhyme with target words (30 sec)
5. Mimi waves goodbye

**Parent Role:** Hold device, repeat words with child, make it a shared experience.

### Ages 4-6: "Mimi's Garden" (Foundation Phase)

**Goal:** Build phonics awareness, learn 200 core vocabulary words, form simple sentences, develop listening comprehension.

**Approach:**
- Child can navigate independently with simple UI
- Systematic phonics introduction (letter sounds, blending)
- Core vocabulary through themed units (animals, food, family, etc.)
- Simple sentence patterns: "I like ___", "This is a ___", "The ___ is ___"
- Interactive games: matching, sorting, simple puzzles
- Mimi stories: short narratives with repetitive language patterns
- Introduction to sight words
- Turkish scaffolding gradually reduces

**Session Structure (per micro-lesson):**
1. Mimi Intro: "Hello! Today we're learning fruit names!" (1 min)
2. Vocabulary: See, hear, tap 4-5 new words (2 min)
3. Game: Match fruit to word, sort by color, etc. (2 min)
4. Story: Mimi goes to the market (1 min)
5. Quick Review: "Which one is the apple?" (1 min)
6. Celebration: Stars, Mimi dance

**Phonics Sequence:**
- Phase 1: Single letter sounds (s, a, t, p, i, n)
- Phase 2: More single letters + CVC words (cat, dog, sun)
- Phase 3: Consonant digraphs (sh, ch, th)
- Phase 4: Adjacent consonants (bl, cr, st)
- Phase 5: Long vowel sounds

### Ages 7-8: "Mimi's Kingdom" (Growth Phase)

**Goal:** Read simple texts, understand basic grammar, expand to 500+ words, begin writing, hold simple conversations.

**Approach:**
- Reading exercises with graduated difficulty
- Grammar introduced contextually (not rule-first, usage-first)
- Writing: trace, copy, then free-write
- Conversation practice with Mimi (scripted dialogues, then semi-open)
- Longer Mimi stories with comprehension questions
- Cross-curricular content (science facts, math vocabulary in English)
- Minimal Turkish scaffolding (only for complex grammar explanations)

**Grammar Sequence:**
- Present simple (I play, she plays)
- Present continuous (I am playing)
- Simple past (I played)
- Articles (a/an/the)
- Plurals (regular and common irregular)
- Prepositions of place (in, on, under, next to)
- Question forms (What, Where, Who, How many)
- Adjectives (big, small, happy, sad)
- Comparatives (bigger, smaller)

**Session Structure (per micro-lesson):**
1. Warm-up: Mimi reviews yesterday's words (1 min)
2. New Content: Vocabulary OR grammar point (2 min)
3. Practice Game: Active recall activity (3 min)
4. Story: Mimi adventure chapter (2 min)
5. Check: Mini-quiz or sentence building (2 min)
6. XP + Badge progress

### Ages 9-10: "Mimi's Universe" (Fluency Phase)

**Goal:** Read independently, write paragraphs, understand complex grammar, vocabulary 1000+, have conversations, present ideas.

**Approach:**
- Independent reading with comprehension exercises
- Creative writing prompts (Mimi as writing coach)
- Complex grammar (past continuous, future tenses, conditionals)
- Presentation mode (child records themselves speaking)
- Debate/discussion prompts
- Real-world English (menus, signs, emails, letters)
- Cultural content (holidays, traditions, geography in English-speaking countries)
- Near-zero Turkish scaffolding

**Grammar Sequence:**
- Past continuous (I was playing)
- Future (will / going to)
- Present perfect (I have seen)
- First conditional (If it rains, I will...)
- Modal verbs (can, could, should, must)
- Passive voice basics (The cake was eaten)
- Reported speech basics
- Relative clauses (who, which, that)

**Session Structure (per micro-lesson):**
1. Warm-up: Spaced repetition review (1 min)
2. New Content: Vocabulary, grammar, or reading passage (2 min)
3. Activity: Writing exercise, conversation, or complex game (3 min)
4. Story/Content: Chapter from ongoing Mimi saga or real-world text (2 min)
5. Reflection: What did you learn? (Mimi asks) (1 min)
6. Progress update

## 2.4 Assessment Philosophy

**No Tests. No Grades. No Failure.**

Assessment is continuous, invisible, and embedded in gameplay:

| Method | How It Works |
|--------|-------------|
| **In-Game Performance** | Every tap, answer, and choice is tracked silently |
| **Spaced Repetition Data** | The system knows exactly which words are mastered vs. shaky |
| **Response Time** | Faster correct answers = higher confidence score |
| **Consistency** | Regular practice weighted more than single high scores |
| **Story Comprehension** | Choices in Mimi stories reveal understanding |
| **Production vs. Recognition** | System tracks if child can produce (harder) or just recognize (easier) |

**For Parents:** Progress is shown as friendly metrics (words learned, worlds completed, streak days) -- never as grades or percentages that invite comparison.

**For Teachers:** More detailed data available: specific skill gaps, word-level mastery, recommended focus areas.

---

# 3. CURRICULUM STRUCTURE

## 3.1 System Overview: The 12 Worlds

The full curriculum spans 12 thematic "Worlds." Each World is designed for approximately one month of daily practice (3-5 micro-lessons per day, 5 days per week).

Each World contains:
- 10 structured lessons
- 20-30 core vocabulary words
- 1 grammar focus
- 1 Mimi story arc (10 chapters, one per lesson)
- 5+ game activities
- Continuous assessment

**Progression:** Worlds unlock sequentially. However, the system adapts the difficulty within each world based on the child's age group and level. A 4-year-old and an 8-year-old can both be in World 1, but they experience different complexity levels.

---

## WORLD 1: "The Friendly Forest" (Eylul / September)

### Theme: Animals & Nature

### Core Vocabulary (25 words)
`cat, dog, bird, fish, rabbit, bear, frog, butterfly, tree, flower, grass, sky, sun, rain, cloud, big, small, fast, slow, happy, sad, run, jump, fly, swim`

### Grammar Focus
- "This is a ___"
- "The ___ is ___" (adjective)
- Singular/plural basics (cat/cats)

### Skills
- Listening: Identify animals by sound and name
- Speaking: Name animals, describe with one adjective
- Reading (4+): Match word to picture
- Writing (7+): Trace and copy animal names

### Mimi Story Arc: "Mimi's Forest Friends"
Mimi moves to a new forest and meets animal friends one by one. Each chapter introduces 2-3 animals through a mini-adventure.

### 10 Lessons

**Lesson 1: "Welcome to the Forest!"**
- Objective: Learn cat, dog, bird, fish
- Warm-up: Mimi arrives in a new forest, hears sounds
- Vocabulary: 4 animals introduced with images, sounds, animations
- Game: Tap the animal you hear (listening match)
- Story: Mimi meets a cat named Whiskers
- Review: "Show me the dog!" (tap correct animal)

**Lesson 2: "More Friends!"**
- Objective: Learn rabbit, bear, frog, butterfly
- Warm-up: Mimi reviews yesterday's 4 animals (spaced repetition)
- Vocabulary: 4 new animals
- Game: Animal sorting (big animals vs. small animals)
- Story: Mimi meets a bouncy frog by the pond
- Review: All 8 animals -- match name to picture

**Lesson 3: "Where Do They Live?"**
- Objective: Learn tree, flower, grass, sky
- Warm-up: Quick animal sound quiz (review)
- Vocabulary: 4 nature words
- Game: Drag animals to their habitat
- Story: Mimi and friends explore the forest
- Review: "Point to the tree!" / "Where is the flower?"

**Lesson 4: "Look Up!"**
- Objective: Learn sun, rain, cloud
- Warm-up: Name the animals in the scene (review)
- Vocabulary: 3 weather/sky words
- Game: Dress Mimi for the weather (sunny = sunglasses, rainy = umbrella)
- Story: A rainy day in the forest -- friends find shelter
- Review: "Is it sunny or rainy?" (listening comprehension)

**Lesson 5: "Big and Small"**
- Objective: Learn big, small + review all nouns with adjectives
- Warm-up: Mimi shows two animals, "Which is big?"
- Vocabulary: big, small (applied to known animals)
- Game: Sort animals by size, build sentences "The bear is big"
- Story: Mimi tries to fit into a small rabbit hole (comedy)
- Review: "Is the butterfly big or small?"

**Lesson 6: "Fast and Slow"**
- Objective: Learn fast, slow, happy, sad
- Warm-up: Big/small review game
- Vocabulary: 4 adjectives with expressive Mimi animations
- Game: Race game -- fast animals vs. slow animals
- Story: Forest friends have a race, everyone wins something
- Review: Describe animals with two adjectives

**Lesson 7: "What Can They Do?"**
- Objective: Learn run, jump, fly, swim
- Warm-up: Adjective review (describe the animal)
- Vocabulary: 4 action verbs with animated demonstrations
- Game: "Can it fly?" -- Yes/No sorting game
- Story: Each friend shows off their special talent
- Review: "What can a bird do?" / "A bird can fly"

**Lesson 8: "Sentences!"**
- Objective: Build simple sentences using all words
- Warm-up: Verb charades (Mimi acts, child guesses)
- Activity: Sentence builder -- drag words to make "The cat is small"
- Game: Sentence scramble (reorder words)
- Story: Mimi writes a letter to a friend describing the forest
- Review: Read/say 3 sentences

**Lesson 9: "The Forest Song"**
- Objective: Review all 25 words through a song
- Warm-up: Quick fire picture naming
- Activity: Learn "The Friendly Forest Song" with Mimi
- Game: Fill-in-the-blank song lyrics
- Story: Forest friends put on a concert
- Review: Sing along with missing words

**Lesson 10: "Forest Festival"**
- Objective: World assessment (disguised as a festival game)
- Warm-up: Mimi says "Let's have a festival!"
- Activity: Multi-game festival with stations testing all vocabulary
- Game: Badge challenge -- earn the Forest Explorer badge
- Story: Grand finale -- Mimi and friends celebrate, set up for next world
- Celebration: World 1 complete! Forest Explorer badge, XP bonus, Mimi mega-dance

### Assessment Criteria (Internal)
- 80%+ vocabulary recognition = mastery
- 60%+ vocabulary production = on track
- Below 60% = system increases review frequency for weak words

---

## WORLD 2: "Mimi's Cozy Home" (Ekim / October)

### Theme: Family, Home & Daily Routines

### Core Vocabulary (28 words)
`mother, father, sister, brother, baby, family, house, room, bed, table, chair, door, window, kitchen, bathroom, eat, drink, sleep, wake up, wash, morning, night, breakfast, lunch, dinner, love, hug, thank you`

### Grammar Focus
- "I have a ___"
- "My ___ is ___"
- Simple present: "I eat breakfast"

### Skills
- Listening: Identify family members, rooms, routines
- Speaking: Talk about family, describe home
- Reading (4+): Match family/home words
- Writing (7+): Write about "My family"

### Mimi Story Arc: "Mimi's Dragon Family"
Mimi invites the child to meet Mimi's dragon family. Each lesson reveals a family member and their role in daily life.

### 10 Lessons

**Lesson 1:** "Meet My Family!" - mother, father, sister, brother, baby, family, love
**Lesson 2:** "Our Dragon House" - house, room, door, window, bed
**Lesson 3:** "The Kitchen & Bathroom" - kitchen, bathroom, table, chair
**Lesson 4:** "Good Morning!" - morning, wake up, wash, breakfast
**Lesson 5:** "Lunchtime!" - eat, drink, lunch
**Lesson 6:** "Good Night!" - night, sleep, dinner
**Lesson 7:** "My Family, My Sentences" - "I have a sister" / "My mother is happy"
**Lesson 8:** "A Day in Mimi's House" - full daily routine storytelling
**Lesson 9:** "The Family Song" - review through music
**Lesson 10:** "Family Festival" - assessment + Home Sweet Home badge

---

## WORLD 3: "Rainbow Market" (Kasim / November)

### Theme: Colors, Numbers (1-20) & Food

### Core Vocabulary (30 words)
`red, blue, green, yellow, orange, purple, pink, black, white, brown, one through ten, apple, banana, orange (fruit), bread, milk, water, egg, cheese, rice, delicious, hungry, please, how many`

### Grammar Focus
- "I like ___" / "I don't like ___"
- "How many ___?"
- Numbers 1-20
- Colors as adjectives: "a red apple"

### Mimi Story Arc: "Mimi Goes Shopping"
Mimi needs to buy food for a party. Each lesson is a trip to a different market stall.

### 10 Lessons

**Lesson 1:** "Red, Blue, Green!" - primary colors
**Lesson 2:** "All the Colors!" - remaining colors
**Lesson 3:** "1, 2, 3!" - numbers 1-10
**Lesson 4:** "Count to 20!" - numbers 11-20
**Lesson 5:** "At the Fruit Stand" - apple, banana, orange
**Lesson 6:** "At the Bakery" - bread, milk, egg, cheese
**Lesson 7:** "Yummy!" - delicious, hungry, "I like ___"
**Lesson 8:** "How Many Apples?" - counting + colors + food combined
**Lesson 9:** "The Market Song" - musical review
**Lesson 10:** "Market Day Festival" - assessment + Market Master badge

---

## WORLD 4: "The Dress-Up Castle" (Aralik / December)

### Theme: Clothes, Body Parts & Weather

### Core Vocabulary (28 words)
`head, eyes, ears, nose, mouth, hands, feet, hair, shirt, pants, shoes, hat, coat, dress, socks, hot, cold, warm, cool, windy, snowy, sunny, rainy, wear, put on, take off, I'm wearing, weather`

### Grammar Focus
- "I'm wearing ___"
- "It's ___ today" (weather)
- Body parts: "I have two eyes"
- Imperatives: "Put on your hat!"

### Mimi Story Arc: "Mimi's Wardrobe Adventure"
Mimi's wardrobe is magical -- each outfit takes them to a different weather world.

### 10 Lessons

**Lesson 1:** "Head, Shoulders, Knees and Toes!" - body parts
**Lesson 2:** "My Face" - eyes, ears, nose, mouth, hair
**Lesson 3:** "Getting Dressed" - shirt, pants, shoes, socks
**Lesson 4:** "Fancy Dress!" - hat, coat, dress + "I'm wearing"
**Lesson 5:** "What's the Weather?" - sunny, rainy, snowy, windy
**Lesson 6:** "Hot and Cold" - hot, cold, warm, cool
**Lesson 7:** "Dress for the Weather" - matching clothes to weather
**Lesson 8:** "Simon Says" style commands - "Put on your hat!"
**Lesson 9:** "The Weather Song" - review
**Lesson 10:** "Fashion Show Festival" - assessment + Fashion Star badge

---

## WORLD 5: "Playground Planet" (Ocak / January)

### Theme: Actions, Sports & Playground

### Core Vocabulary (25 words)
`play, kick, throw, catch, hit, climb, slide, swing, ball, bike, game, team, win, lose, try, again, turn, share, friend, together, park, outside, inside, fun, let's go`

### Grammar Focus
- Present continuous: "I am playing"
- "Can you ___?" / "I can ___"
- Let's + verb: "Let's play!"
- Turn-taking language: "It's your turn"

### Mimi Story Arc: "The Dragon Games"
Mimi organizes a sports day for all forest and home friends. Each lesson is a different sport/activity.

### 10 Lessons

**Lesson 1:** "Let's Play!" - play, fun, friend, together
**Lesson 2:** "Kick and Throw" - kick, throw, catch, ball
**Lesson 3:** "At the Playground" - climb, slide, swing
**Lesson 4:** "Ride and Race" - bike, game, team, outside, park
**Lesson 5:** "I Can Do It!" - "I can climb" / "Can you catch?"
**Lesson 6:** "Win, Lose, Try Again" - sportsmanship vocabulary
**Lesson 7:** "What Are You Doing?" - present continuous practice
**Lesson 8:** "Let's Play Together" - sharing and turn-taking language
**Lesson 9:** "The Playground Song" - action verb song
**Lesson 10:** "Sports Day Festival" - assessment + Champion badge

---

## WORLD 6: "Story Island" (Subat / February)

### Theme: Emotions, Descriptions & Storytelling

### Core Vocabulary (28 words)
`happy, sad, angry, scared, surprised, excited, tired, brave, kind, funny, beautiful, ugly, tall, short, old, young, strong, weak, because, but, and, then, once upon a time, the end, story, tell, feel, why`

### Grammar Focus
- "I feel ___"
- "He/She is ___"
- Conjunctions: and, but, because
- Sequencing: first, then, finally
- Question: "Why are you sad?"

### Mimi Story Arc: "The Island of Feelings"
Mimi discovers an island where each region represents an emotion. The child helps characters navigate their feelings.

### 10 Lessons

**Lesson 1:** "Happy and Sad" - core emotions with Mimi expressions
**Lesson 2:** "Angry and Scared" - understanding negative emotions positively
**Lesson 3:** "Surprised and Excited" - high-energy emotions
**Lesson 4:** "How Are You?" - "I feel ___" conversations
**Lesson 5:** "Describing People" - tall, short, old, young, beautiful
**Lesson 6:** "Strong and Brave" - empowering adjectives
**Lesson 7:** "Because and But" - connecting ideas
**Lesson 8:** "Once Upon a Time" - storytelling structure
**Lesson 9:** "Our Story" - child builds a story with Mimi
**Lesson 10:** "Story Festival" - assessment + Storyteller badge

---

## WORLD 7: "Doctor Mimi's Clinic" (Mart / March)

### Theme: Health, Body & Helping Others

### Core Vocabulary (25 words)
`doctor, nurse, hospital, medicine, sick, healthy, hurt, help, headache, stomachache, cough, fever, rest, exercise, fruit, vegetable, strong, clean, germs, wash hands, feel better, take care, careful, ambulance, emergency`

### Grammar Focus
- "I have a ___" (ailment)
- "You should ___"
- "Does your ___ hurt?"
- Past tense introduction: "I ate an apple" / "I washed my hands"

### Mimi Story Arc: "Doctor Mimi to the Rescue"
Mimi's friends get sick one by one. Mimi learns to be a doctor and teaches healthy habits.

### 10 Lessons

**Lesson 1:** "My Body Feels..." - sick, healthy, hurt, headache
**Lesson 2:** "What's Wrong?" - stomachache, cough, fever
**Lesson 3:** "At the Doctor's" - doctor, nurse, hospital, medicine
**Lesson 4:** "Get Well Soon!" - rest, feel better, take care
**Lesson 5:** "Healthy Habits" - exercise, fruit, vegetable, clean
**Lesson 6:** "Wash Your Hands!" - germs, wash hands, careful
**Lesson 7:** "You Should Rest" - advice language
**Lesson 8:** "Yesterday I..." - simple past introduction
**Lesson 9:** "The Healthy Song" - hygiene and health song
**Lesson 10:** "Health Fair" - assessment + Doctor Mimi badge

---

## WORLD 8: "Treasure Town" (Nisan / April)

### Theme: Community, Places & Transportation

### Core Vocabulary (28 words)
`school, shop, library, park, restaurant, hospital, street, bus, car, train, plane, boat, walk, drive, ride, teacher, student, police, firefighter, chef, go to, come from, near, far, left, right, turn, straight`

### Grammar Focus
- "Where is the ___?"
- "I go to school by ___"
- Prepositions: near, far, in front of, behind
- Directions: "Turn left" / "Go straight"
- "What does a ___ do?"

### Mimi Story Arc: "Mimi's Treasure Map"
Mimi finds a treasure map of a town. Each lesson explores a different location while following clues.

### 10 Lessons

**Lesson 1:** "Around Town" - school, shop, library, park
**Lesson 2:** "More Places" - restaurant, hospital, street
**Lesson 3:** "How Do We Get There?" - bus, car, train, plane, boat
**Lesson 4:** "Walk, Drive, Ride" - movement verbs + "by ___"
**Lesson 5:** "People Who Help" - teacher, police, firefighter, chef
**Lesson 6:** "Where Is It?" - near, far, prepositions
**Lesson 7:** "Left, Right, Straight" - directions
**Lesson 8:** "My Town" - describe places and routes
**Lesson 9:** "The Town Song" - community song
**Lesson 10:** "Treasure Found!" - assessment + Explorer badge

---

## WORLD 9: "Time Traveler's Clock" (Mayis / May)

### Theme: Time, Days, Months & Routines

### Core Vocabulary (30 words)
`Monday through Sunday, January through December (recognition), morning, afternoon, evening, night, today, tomorrow, yesterday, o'clock, half past, hour, minute, early, late, always, sometimes, never, usually, before, after, schedule, calendar, clock`

### Grammar Focus
- "What time is it?"
- "I usually ___ in the morning"
- Adverbs of frequency: always, sometimes, never, usually
- Past/present/future basic distinction
- "Before/after" sequencing

### Mimi Story Arc: "Mimi's Time Machine"
Mimi builds a time machine and visits the same day in different ways -- learning about schedules and time.

### 10 Lessons

**Lesson 1:** "Days of the Week" - Monday through Sunday song
**Lesson 2:** "Months of the Year" - month recognition
**Lesson 3:** "What Time Is It?" - o'clock, half past
**Lesson 4:** "Morning, Afternoon, Night" - time of day vocabulary
**Lesson 5:** "My Day" - daily routine with times
**Lesson 6:** "Yesterday, Today, Tomorrow" - basic time concepts
**Lesson 7:** "Always, Sometimes, Never" - frequency adverbs
**Lesson 8:** "Before and After" - sequencing activities
**Lesson 9:** "The Days Song" - full week/month review song
**Lesson 10:** "Time Festival" - assessment + Time Traveler badge

---

## WORLD 10: "The Wild Safari" (Haziran / June)

### Theme: Nature, Seasons & Environment

### Core Vocabulary (28 words)
`spring, summer, autumn, winter, hot, cold, rain, snow, wind, flower, leaf, seed, grow, plant, water (verb), garden, forest, mountain, river, ocean, island, desert, earth, sky, star, moon, recycle, protect`

### Grammar Focus
- "In summer, it is ___"
- Comparatives: "Summer is hotter than winter"
- "There is/are ___"
- Future: "It will rain tomorrow"
- Environmental language: "We should protect ___"

### Mimi Story Arc: "Mimi's World Tour"
Mimi flies around the world experiencing all four seasons and different ecosystems.

### 10 Lessons

**Lesson 1:** "Four Seasons" - spring, summer, autumn, winter
**Lesson 2:** "Season Weather" - weather words linked to seasons
**Lesson 3:** "In the Garden" - plant, grow, seed, flower, leaf, water
**Lesson 4:** "Mountains and Rivers" - geographical features
**Lesson 5:** "Ocean and Desert" - more landscapes
**Lesson 6:** "Hotter and Colder" - comparatives
**Lesson 7:** "There is a Star" - there is/are constructions
**Lesson 8:** "Protect Our Earth" - environmental awareness
**Lesson 9:** "The Nature Song" - seasons and nature review
**Lesson 10:** "Safari Festival" - assessment + Nature Guardian badge

---

## WORLD 11: "The Invention Lab" (Temmuz / July)

### Theme: Technology, Materials & Making Things

### Core Vocabulary (25 words)
`make, build, draw, paint, cut, glue, paper, wood, metal, glass, plastic, hard, soft, heavy, light, machine, robot, computer, phone, idea, design, try, fail, succeed, invent`

### Grammar Focus
- "It is made of ___"
- "What is it made of?"
- Past tense regular: "I painted a picture"
- Past tense irregular: "I made a robot" / "I built a house"
- "First I ___, then I ___"

### Mimi Story Arc: "Mimi's Invention Contest"
The forest friends have an invention contest. Each lesson builds toward Mimi's big invention.

### 10 Lessons

**Lesson 1:** "Let's Make!" - make, build, draw, paint
**Lesson 2:** "Cut and Glue" - craft verbs + materials
**Lesson 3:** "What Is It Made Of?" - materials vocabulary
**Lesson 4:** "Hard, Soft, Heavy, Light" - material properties
**Lesson 5:** "Amazing Machines" - machine, robot, computer
**Lesson 6:** "I Have an Idea!" - design, plan, try
**Lesson 7:** "Try and Try Again" - fail, succeed, try again (growth mindset)
**Lesson 8:** "I Made It!" - past tense for making
**Lesson 9:** "The Inventor Song" - creative process song
**Lesson 10:** "Invention Fair" - assessment + Inventor badge

---

## WORLD 12: "The Grand Celebration" (Agustos / August)

### Theme: Review, Culture, Celebrations & Looking Ahead

### Core Vocabulary (30 words)
`birthday, party, cake, present, balloon, candle, wish, celebrate, invite, friend, dance, music, sing, costume, holiday, tradition, country, world, travel, language, learn, remember, proud, ready, future, dream, goal, next, together, congratulations`

### Grammar Focus
- Review all major structures
- "I learned ___"
- "I can now ___"
- "Next year, I will ___"
- Complex sentences combining all grammar points

### Mimi Story Arc: "Mimi's Birthday Bash"
It's Mimi's birthday! All friends from all 11 previous worlds come to celebrate. The party travels through every world revisiting vocabulary.

### 10 Lessons

**Lesson 1:** "It's Party Time!" - birthday, party, cake, present
**Lesson 2:** "Let's Celebrate!" - celebrate, balloon, candle, wish
**Lesson 3:** "Invite Your Friends" - invite, friend, together (review all characters)
**Lesson 4:** "Music and Dance" - dance, music, sing, costume
**Lesson 5:** "Holidays Around the World" - holiday, tradition, country
**Lesson 6:** "Remember the Forest?" - World 1-3 mega-review game
**Lesson 7:** "Remember the Town?" - World 4-6 mega-review game
**Lesson 8:** "Remember the World?" - World 7-9 mega-review game
**Lesson 9:** "Remember Everything!" - World 10-11 review + celebration song
**Lesson 10:** "The Grand Finale" - Full assessment + Grand Explorer badge + Mimi's graduation ceremony

---

## 3.2 Vocabulary Summary

| World | Theme | Words | Cumulative |
|-------|-------|-------|-----------|
| 1 | Animals & Nature | 25 | 25 |
| 2 | Family & Home | 28 | 53 |
| 3 | Colors, Numbers, Food | 30 | 83 |
| 4 | Clothes, Body, Weather | 28 | 111 |
| 5 | Actions & Sports | 25 | 136 |
| 6 | Emotions & Storytelling | 28 | 164 |
| 7 | Health & Body | 25 | 189 |
| 8 | Community & Transport | 28 | 217 |
| 9 | Time & Routines | 30 | 247 |
| 10 | Nature & Seasons | 28 | 275 |
| 11 | Technology & Making | 25 | 300 |
| 12 | Review & Celebration | 30 | 330 |

**Total unique vocabulary:** ~330 words (core curriculum)
- Ages 1-3 target: ~80 receptive words
- Ages 4-6 target: ~200 words (receptive + productive)
- Ages 7-8 target: ~500 words (core + expanded from reading)
- Ages 9-10 target: ~1000 words (core + expanded + academic)

The spaced repetition engine also introduces bonus vocabulary through stories and games, pushing totals higher for engaged learners.

## 3.3 Grammar Progression Summary

| World | Grammar Focus | Age 4-6 | Age 7-8 | Age 9-10 |
|-------|--------------|---------|---------|----------|
| 1 | "This is a ___" | Recognition | Production | + Plural rules |
| 2 | "I have a ___" / Simple present | Formulaic | Conjugation | + Negative forms |
| 3 | "I like ___" / Numbers | Formulaic | "Do you like?" | + Quantifiers |
| 4 | "I'm wearing ___" / Imperative | Present continuous intro | Full present continuous | + Past continuous |
| 5 | "I can ___" / "Let's ___" | Modal can | Can/can't | + Could/should |
| 6 | Conjunctions / Adjectives | And, but | Because | + Complex sentences |
| 7 | "You should ___" / Past simple | Exposure | Regular past | + Irregular past |
| 8 | Prepositions / Directions | In, on, under | Full set | + Complex spatial |
| 9 | Adverbs of frequency / Time | Always/never | Full set | + Reported time |
| 10 | Comparatives / There is | Bigger/smaller | Full comparatives | + Superlatives |
| 11 | Past tense production | Review | Regular + irregular | + Passive voice |
| 12 | All structures review | Consolidation | Consolidation | + Complex production |

---

# 4. GAME TYPES

## 4.1 Word Match

| Property | Detail |
|----------|--------|
| **What it teaches** | Vocabulary recognition, spelling awareness |
| **How it works** | Cards laid face down. Child flips two cards to find matching pairs (word + image, or English + Turkish). Timer optional for older kids. |
| **Age range** | All ages (3x3 grid for young, 5x5 for older) |
| **Mimi's role** | Celebrates matches, gives hints after 3 failed attempts ("Think about what a cat looks like..."), does a victory dance when all matched |
| **Curriculum connection** | Uses vocabulary from current world + spaced repetition words due for review |

## 4.2 Phonics Builder

| Property | Detail |
|----------|--------|
| **What it teaches** | Letter sounds, blending, decoding |
| **How it works** | Mimi shows a picture (e.g., "cat"). Letter blocks appear at bottom. Child drags letters to build the word: C-A-T. Sounds play as each letter is placed. |
| **Age range** | Ages 4-8 (CVC words for young, complex words for older) |
| **Mimi's role** | Sounds out each letter as placed, blends the sounds together, celebrates when word is complete |
| **Curriculum connection** | Aligned to phonics progression in current world |

## 4.3 Sentence Scramble

| Property | Detail |
|----------|--------|
| **What it teaches** | Word order, grammar, sentence structure |
| **How it works** | Words appear as shuffled blocks. Child drags them into correct order to build a sentence. Visual cue: capital letter block starts, period block ends. |
| **Age range** | Ages 5-10 (3-word sentences for young, 8+ words for older) |
| **Mimi's role** | Reads the sentence aloud when completed, asks "Does that sound right?" for self-correction, hints by reading partial sentence |
| **Curriculum connection** | Sentences use grammar pattern of current world |

## 4.4 Story Choices

| Property | Detail |
|----------|--------|
| **What it teaches** | Reading comprehension, vocabulary in context, critical thinking |
| **How it works** | Mimi tells a story. At key moments, the child chooses what happens next (2-3 options). Choices require understanding the vocabulary. Story branches based on choices. |
| **Age range** | Ages 4-10 (picture choices for young, text choices for older) |
| **Mimi's role** | Narrator. Reacts to choices ("Oh, you want to go to the mountain? Let's see what happens!"). Voices all characters. |
| **Curriculum connection** | Story uses current world's vocabulary and grammar patterns |

## 4.5 Listening Challenge

| Property | Detail |
|----------|--------|
| **What it teaches** | Listening comprehension, audio discrimination |
| **How it works** | Mimi (or another character) says a word/sentence. Child selects the matching picture, or types/spells the word. Progressive difficulty: single word > phrase > sentence > short paragraph. |
| **Age range** | All ages |
| **Mimi's role** | Speaker. Can repeat up to 3 times. Slows down if child requests. |
| **Curriculum connection** | Audio uses current vocabulary + review words |

## 4.6 Spelling Bee

| Property | Detail |
|----------|--------|
| **What it teaches** | Spelling, letter recognition, phonemic awareness |
| **How it works** | Mimi shows a picture and says the word. Child spells it by tapping letters on a keyboard or dragging letter tiles. Incorrect letters gently bounce back. |
| **Age range** | Ages 5-10 (3-4 letter words for young, longer words for older) |
| **Mimi's role** | Pronounces word, can repeat, gives letter hints ("It starts with a 'B' sound..."), celebrates correct spelling with fireworks |
| **Curriculum connection** | Words from current world, difficulty based on child's mastery level |

## 4.7 Color & Create

| Property | Detail |
|----------|--------|
| **What it teaches** | Vocabulary reinforcement through creative expression, color names, descriptive language |
| **How it works** | Child colors/decorates a scene related to the current world. Each color and object is labeled. Completed artwork uses the child's work in the story. |
| **Age range** | Ages 2-7 |
| **Mimi's role** | Suggests colors ("Can you make the tree green?"), names objects as they're colored, incorporates the artwork into the story |
| **Curriculum connection** | Scene contains current world vocabulary items |

## 4.8 Talk to Mimi (Conversation Practice)

| Property | Detail |
|----------|--------|
| **What it teaches** | Speaking, pronunciation, conversational patterns |
| **How it works** | Mimi asks questions, child responds verbally (speech-to-text) or by selecting response bubbles. Simulates real conversation. Topics tied to current world. |
| **Age range** | Ages 6-10 (response bubbles for younger, free speech for older) |
| **Mimi's role** | Conversation partner. Asks follow-up questions. Models correct pronunciation. Never corrects harshly. |
| **Curriculum connection** | Practices current world's grammar patterns in conversational context |

## 4.9 Quick Quiz (Spaced Repetition Review)

| Property | Detail |
|----------|--------|
| **What it teaches** | Long-term retention, active recall |
| **How it works** | 5-question rapid quiz pulling from the spaced repetition queue. Mix of: picture-to-word, word-to-picture, audio-to-picture, fill-in-blank. Appears at lesson start as warm-up. |
| **Age range** | All ages (question format adapts) |
| **Mimi's role** | Quizmaster. "Do you remember this one?" Celebrates streaks. Gently reintroduces forgotten words. |
| **Curriculum connection** | Pulls from ALL previously learned words, prioritizing those due for review |

## 4.10 World Builder

| Property | Detail |
|----------|--------|
| **What it teaches** | Vocabulary production, spatial reasoning, creativity, descriptive language |
| **How it works** | Child builds a scene by dragging labeled objects into a world canvas. "Put the big tree next to the house." "Add a red bird in the sky." For older children, they describe their scene in writing. |
| **Age range** | Ages 4-10 (drag-and-drop for all, writing for 7+) |
| **Mimi's role** | Guide. Gives building instructions (listening comprehension). Asks "What did you build?" Narrates the scene back. |
| **Curriculum connection** | Objects and instructions use current world vocabulary + prepositions + adjectives |

---

# 5. SMART BOARD / CLASSROOM MODE

## 5.1 Overview

Classroom Mode transforms MinesMinis from a personal learning app into a powerful classroom tool. It is designed for:
- Preschool/kindergarten English classes
- Primary school English lessons
- Private language school (dershane) group sessions
- Smart board / projector environments

## 5.2 Teacher Controls

### Teacher Dashboard (on teacher's device)

| Feature | Description |
|---------|-------------|
| **Lesson Launcher** | Browse worlds and lessons, tap to launch on smart board |
| **Pace Control** | Pause, replay, skip, adjust timing of any lesson element |
| **Student Selector** | Pick a student to answer (random picker with fun animation) |
| **Activity Mode** | Switch between: Watch Together, Take Turns, Team Challenge, Individual Practice |
| **Vocabulary Spotlight** | Pull up any word with image + audio for impromptu teaching |
| **Timer** | Visual countdown timer for activities |
| **Reward Button** | Award XP/stars to individual students or teams from teacher device |
| **Mimi Commands** | Trigger Mimi reactions: celebrate, encourage, think, clap |
| **Quick Assessment** | Launch a 5-question quiz, see class results in real-time |
| **Mute/Unmute** | Control audio from teacher device |

### Quick Launch Presets

- **5-Minute Warm-Up:** Spaced repetition review quiz for the class
- **15-Minute Lesson:** Full micro-lesson with all stages
- **10-Minute Game:** Any game type, class-wide
- **5-Minute Story Time:** Mimi story with comprehension questions
- **Free Explore:** Open world for student-led exploration

## 5.3 Student View (Smart Board Display)

| Principle | Implementation |
|-----------|---------------|
| **Large & Clear** | All text minimum 48px on smart board. Images large and high-contrast. |
| **Distraction-Free** | No sidebar navigation, no settings, no parent features visible |
| **High Visibility** | Designed for students sitting 2-5 meters from screen |
| **Touch-Friendly** | Supports smart board touch. Large tap targets (minimum 80x80px) |
| **Mimi is Big** | Mimi character is prominently displayed and animated |

### Display Modes

1. **Presentation Mode:** Mimi teaches, students watch and listen. Teacher controls pace.
2. **Interactive Mode:** Students come to the board to tap/drag. Turn-based with teacher selection.
3. **Team Mode:** Class split into teams. Board shows team scores and challenges.
4. **Response Mode:** Students use their own devices to answer simultaneously. Board shows aggregate results.

## 5.4 Class Activities

| Activity | Type | Duration | Description |
|----------|------|----------|-------------|
| **Mimi Says** | Whole class | 5 min | Like "Simon Says" -- Mimi gives commands in English, students act them out |
| **Picture Race** | Teams | 5 min | Mimi shows a word, first team to find the matching picture wins |
| **Spelling Relay** | Teams | 8 min | Teams take turns spelling words on the board |
| **Story Time** | Whole class | 10 min | Mimi tells a story, teacher pauses for predictions and vocabulary |
| **Board Match** | Turn-based | 5 min | Large matching game on smart board, students take turns |
| **Song & Dance** | Whole class | 5 min | Curriculum songs with actions |
| **Quick Fire** | Individual | 5 min | Random student picker + quick vocabulary questions |
| **World Builder** | Collaborative | 10 min | Class builds a scene together on the board |

## 5.5 Multi-Student Progress Tracking

| Feature | Description |
|---------|-------------|
| **Class Roster** | Add/manage students (name + avatar, no personal data required) |
| **Class Overview** | See all students' progress at a glance: worlds completed, words mastered, time spent |
| **Heat Map** | Visual grid showing class strengths/weaknesses by vocabulary area |
| **Individual Reports** | Drill into any student's detailed progress |
| **Export** | Download progress reports as PDF or CSV |
| **Recommendations** | System suggests which lessons to focus on based on class gaps |

---

# 6. PARENT DASHBOARD

## 6.1 Overview

The Parent Dashboard is accessed by switching to "Parent Mode" (protected by a simple parent gate -- e.g., "solve this math problem" or hold-two-buttons). It uses the premium dark gradient (`--gradient-premium`) to visually distinguish from the child's colorful interface.

## 6.2 Dashboard Sections

### 6.2.1 Today's Summary

| Metric | Display |
|--------|---------|
| **Time Today** | "15 min today" with daily goal progress bar |
| **Words Practiced** | Number of words reviewed + new words learned |
| **Lessons Completed** | X of Y daily lessons done |
| **Streak** | "7 day streak!" with flame icon |
| **Mimi's Message** | AI-generated summary: "Ayse practiced animal names today and learned 3 new words! She's doing great with colors but could use more practice with numbers." |

### 6.2.2 Progress Over Time

| View | Content |
|------|---------|
| **Weekly Chart** | Bar chart of daily minutes spent |
| **Monthly Overview** | Calendar view with activity dots |
| **World Progress** | Visual map showing completed worlds (filled), current world (glowing), and upcoming worlds (dimmed) |
| **Vocabulary Growth** | Line graph of total words learned over time |

### 6.2.3 Words Learned

| Feature | Detail |
|---------|--------|
| **Word List** | Searchable, sortable list of all encountered words |
| **Mastery Level** | Each word shows: New / Learning / Reviewing / Mastered |
| **Audio Playback** | Parent can tap any word to hear pronunciation |
| **Filter** | By world, by mastery level, by date learned |
| **Weak Words** | Highlighted section showing words that need more practice |

### 6.2.4 Strengths & Weaknesses

| Area | Visualization |
|------|--------------|
| **Skills Radar** | Spider chart showing: Listening, Speaking, Reading, Writing, Vocabulary, Grammar |
| **Best Topics** | "Ayse is strongest in: Animals, Colors" |
| **Needs Practice** | "Ayse could practice more: Numbers, Body parts" |
| **Learning Style** | "Ayse learns best through: Stories and Games" (based on performance data) |

### 6.2.5 Recommendations

| Type | Example |
|------|---------|
| **Daily Suggestion** | "Today, try the Spelling Bee game to practice this week's words" |
| **Weekly Focus** | "This week, focus on World 3: Colors and Numbers" |
| **Offline Activity** | "Practice counting objects in English at the grocery store!" |
| **Screen Time** | "Ayse has been learning for 20 min today. A good time for a break!" |

### 6.2.6 Settings (Parent)

| Setting | Options |
|---------|---------|
| **Daily Time Limit** | 15 / 20 / 30 / 45 / 60 min |
| **Daily Lesson Goal** | 3 / 4 / 5 lessons per day |
| **Notifications** | Daily reminder, weekly report, achievement alerts |
| **Audio** | Music on/off, sound effects volume |
| **Language** | Interface language: Turkish / English |
| **Child Profile** | Name, age, avatar |
| **Subscription** | View/manage plan |
| **Multiple Children** | Add/switch between children |

---

# 7. SUBSCRIPTION TIERS

## 7.1 Tier Overview

| Feature | Free (Kesfet) | Premium (Maceraci) | Family (Aile) | Classroom (Sinif) |
|---------|--------------|-------------------|---------------|-------------------|
| **World 1** | Full access | Full access | Full access | Full access |
| **Worlds 2-12** | Locked | Full access | Full access | Full access |
| **Lessons per day** | 2 | Unlimited | Unlimited | Unlimited |
| **Games** | Word Match only | All 10 game types | All 10 game types | All 10 + class games |
| **Mimi Stories** | World 1 only | All stories | All stories | All stories |
| **Spaced Repetition** | Basic (manual) | Smart algorithm | Smart algorithm | Smart algorithm |
| **Parent Dashboard** | Basic (time only) | Full dashboard | Full dashboard | N/A |
| **Teacher Dashboard** | N/A | N/A | N/A | Full dashboard |
| **Smart Board Mode** | N/A | N/A | N/A | Full access |
| **Offline Mode** | No | Yes | Yes | Yes |
| **Child Profiles** | 1 | 1 | Up to 4 | Up to 30 students |
| **Ads** | None (never) | None | None | None |
| **Progress Reports** | No | Weekly email | Weekly email | Detailed + export |

**Important:** Free tier has NO ads. We never show ads to children. Free tier is limited by content access, not interrupted by advertising.

## 7.2 Pricing (TRY)

| Plan | Monthly | Yearly | Savings |
|------|---------|--------|---------|
| **Premium (Maceraci)** | 149.99 TL/ay | 999.99 TL/yil | 2 ay bedava (~44% off) |
| **Family (Aile)** | 199.99 TL/ay | 1,399.99 TL/yil | 2 ay bedava |
| **Classroom (Sinif)** | 499.99 TL/ay | 3,499.99 TL/yil | 2.5 ay bedava |

### Special Offers
- **7-day free trial** for Premium (no credit card required)
- **Back-to-school promotion** (September): 30% off yearly plans
- **Teacher discount:** 50% off first year of Classroom plan with valid teacher ID
- **Referral program:** Both referrer and referee get 1 free month

## 7.3 Payment Methods
- Credit/debit card (Visa, Mastercard, Troy)
- Apple App Store (iOS in-app purchase)
- Google Play Store (Android in-app purchase)
- Bank transfer (yearly plans only, for schools)

## 7.4 What's Free (Kesfet / Discover Tier)

The free tier must provide genuine value, not just be a teaser:
- Full access to World 1 (The Friendly Forest) -- all 10 lessons, all games, full Mimi story
- 2 micro-lessons per day across any unlocked content
- Word Match game available for all learned vocabulary
- Basic progress tracking (time spent, current streak)
- Full Mimi character interaction (no feature-locked personality)

This gives parents and children enough to: (a) experience the quality, (b) see real learning results, (c) decide if the full curriculum is worth the investment.

---

# 8. USER FLOWS

## 8.1 New User Onboarding (Child)

```
1. WELCOME SCREEN
   - Mimi flies onto screen, waves
   - "Merhaba! Hi! I'm Mimi!"
   - "Let's go on an adventure together!"
   - [Start / Basla] button

2. LANGUAGE SELECTION
   - "I speak Turkish and English! What about you?"
   - Options: Turkce (default) / English
   - (Sets UI language, not learning language)

3. WHO ARE YOU?
   - "What's your name?"
   - Text input with friendly keyboard
   - Mimi repeats the name: "Hi [Name]! I love that name!"

4. AGE SELECTION
   - "How old are you?"
   - Mimi holds up number cards: 1-10
   - Child taps their age
   - Mimi reacts: "Wow, [age]! You're going to learn so much!"
   - (This sets the difficulty tier internally)

5. AVATAR CREATION
   - "Let's make your picture!"
   - Simple avatar builder: face shape, hair, color, accessories
   - Mimi stands next to avatar: "We look great together!"

6. PARENT GATE
   - "Can your mom or dad help for a moment?"
   - Simple parent verification (solve: 14 + 23 = ?)
   - Quick parent setup: email, notification preferences
   - Optional: subscription selection (or skip for free tier)

7. PLACEMENT (Ages 4+)
   - "Let's play a quick game so I know where to start!"
   - 5-question mini-assessment (fun, game-like, not test-like)
   - Determines starting point (most start at World 1)
   - "Perfect! I know exactly where our adventure begins!"

8. FIRST LESSON
   - Mimi flies to World 1: "The Friendly Forest"
   - World intro animation (5 seconds)
   - Seamlessly enters Lesson 1
   - Extra scaffolding: Mimi explains every interaction type
   - "Tap the cat!" (first interaction is guaranteed success)

9. POST-FIRST-LESSON
   - Big celebration: "You did it! Basardin!"
   - First badge earned: "Welcome Explorer"
   - XP animation
   - "Come back tomorrow for more! Yarin gorusuruz!"
   - Notification permission prompt (gentle, optional)
```

**Total onboarding time:** ~3 minutes before first lesson, ~8 minutes including first lesson.

## 8.2 Daily Learning Session

```
1. APP OPEN
   - Mimi greets child by name
   - Greeting varies by time: "Good morning!" / "Good afternoon!"
   - Shows streak: "Day 7! You're amazing!"
   - Daily goal indicator: "Let's do 3 lessons today!"

2. DAILY WARM-UP (Quick Quiz)
   - Automatic spaced repetition review
   - 5 questions from words due for review
   - Takes ~1-2 minutes
   - "Great memory! Let's keep going!"

3. LESSON SELECTION
   - World Map shows current world highlighted
   - Current lesson pulsing with Mimi sitting on it
   - Child taps to enter lesson
   - OR child can replay previous lessons for practice

4. LESSON FLOW (per micro-lesson)
   a. Mimi Intro (1 min)
   b. Vocabulary/Content (2 min)
   c. Practice Game (3 min)
   d. Story Segment (2 min)
   e. Review (2 min)
   f. Celebration + XP

5. BETWEEN LESSONS
   - "Great job! Ready for the next one?"
   - [Next Lesson] / [Take a Break] / [Play a Game]
   - If time limit reached: "Time for a break! See you later!"
   - Mimi yawns and waves

6. SESSION END
   - Summary: "Today you learned 5 new words!"
   - Words listed with images
   - Streak updated
   - "See you tomorrow! Yarin gorusuruz!"
```

## 8.3 Lesson Completion Flow

```
1. FINAL ACTIVITY COMPLETE
   - Mimi jumps with excitement

2. RESULTS SCREEN
   - Stars earned: 1-3 based on accuracy
   - XP earned: base + bonus for accuracy + streak bonus
   - New words count
   - Reviewed words count
   - "Best moment: You spelled 'butterfly' perfectly!"

3. BADGE CHECK
   - If badge earned: Special animation, badge reveal, Mimi mega-celebration
   - "You earned the [Badge Name] badge! Tebrikler!"
   - Badge added to collection with satisfying animation

4. WORLD PROGRESS UPDATE
   - Progress bar for current world fills
   - "3 more lessons to complete this world!"

5. NEXT STEPS
   - [Next Lesson] (if available and within time limit)
   - [Play a Game] (free play with earned vocabulary)
   - [Go to Map] (return to world selection)
   - [Done for Today] (Mimi waves goodbye)

6. IF WORLD COMPLETE
   - Extended celebration sequence (10 seconds)
   - World completion badge (unique design per world)
   - Mimi "unlocks" next world with a key animation
   - Preview of next world: "Next, we're going to [World Name]!"
   - "But first, you deserve a rest. See you next time!"
```

## 8.4 Parent Checking Progress

```
1. PARENT MODE ACTIVATION
   - From child's home screen: tap Mimi's "P" button (subtle, top corner)
   - Parent gate: "What is 27 + 15?" (blocks children, easy for adults)

2. PARENT DASHBOARD
   - Loads with today's summary front and center
   - Mimi's AI message: "Bugün Ayse hayvan isimlerini pratik etti..."
   - Quick stats: time, lessons, words, streak

3. DRILL DOWN
   - Tap "Words Learned" → see full vocabulary list with mastery levels
   - Tap "Progress" → see world map, charts, trends
   - Tap "Strengths" → see skills radar and recommendations
   - Tap "Settings" → adjust time limits, goals, notifications

4. WEEKLY REPORT (Push Notification / Email)
   - Sent every Sunday evening
   - Summary of week's activity
   - Words learned this week
   - Total progress
   - Recommendations for the coming week
   - "Ayse is 60% through World 3! She's on track to finish by end of month."

5. EXIT PARENT MODE
   - Tap "Back to Learning" or "Close"
   - Returns to child's home screen
```

## 8.5 Teacher Using in Classroom

```
1. TEACHER LOGIN
   - Open MinesMinis on teacher device (tablet/laptop)
   - Login with teacher credentials
   - Select class from roster

2. PRE-LESSON SETUP
   - Review class progress: "World 2, Lesson 4 - most students ready"
   - Select today's lesson or activity
   - Choose activity mode: Presentation / Interactive / Team

3. CONNECT TO SMART BOARD
   - Tap "Smart Board" button
   - Screen mirroring or direct connection
   - Smart Board shows student-facing view
   - Teacher device shows control panel

4. LESSON DELIVERY
   a. Teacher taps "Start Lesson"
   b. Mimi appears on smart board: "Hello class!"
   c. Teacher controls pace: next/pause/repeat
   d. Vocabulary introduction: teacher can pause to discuss
   e. Game time: teacher selects students or uses random picker
   f. Story time: teacher pauses for comprehension questions
   g. Review quiz: class responds together or individually (devices)

5. STUDENT INTERACTION (if students have devices)
   - Teacher pushes activity to student devices
   - Students respond individually
   - Teacher sees real-time results on their dashboard
   - Smart board shows class aggregate (no individual shaming)

6. POST-LESSON
   - Teacher marks lesson complete
   - Quick notes: "Review colors next week - class struggled"
   - System logs individual performance data
   - Recommendations updated for next session

7. REPORTS
   - Access class progress reports
   - Export for school administration
   - Share individual reports with parents
```

## 8.6 Admin Managing Content

```
1. ADMIN PORTAL (Web Application)
   - Secure login (2FA required)
   - Role-based access: Super Admin, Content Manager, Analytics Viewer

2. CONTENT MANAGEMENT
   a. WORLDS
      - View all 12 worlds
      - Edit world metadata (name, description, icon)
      - Reorder worlds
      - Toggle world availability (publish/unpublish)

   b. LESSONS
      - Edit lessons within worlds
      - Manage vocabulary list (add/remove/edit words)
      - Upload/replace images and audio
      - Edit Mimi story scripts
      - Configure game parameters (difficulty, timing)
      - Preview lesson as child would see it

   c. VOCABULARY DATABASE
      - Master word list with: English, Turkish, image URL, audio URL, phonetic transcription
      - Tag words by: world, topic, difficulty level, part of speech
      - Bulk import/export (CSV)
      - Audio recording interface for new words

   d. MIMI SCRIPTS
      - Edit Mimi dialogue per lesson
      - Set emotional states per dialogue line
      - Preview Mimi animations with dialogue
      - A/B test different scripts

3. USER MANAGEMENT
   - View all users (anonymized for privacy)
   - Manage teacher accounts
   - Handle subscription issues
   - Block/flag problematic accounts

4. ANALYTICS DASHBOARD
   - DAU/MAU metrics
   - Lesson completion rates
   - Drop-off points (which lessons lose users)
   - Most/least popular games
   - Vocabulary difficulty analysis (which words are hardest)
   - Subscription conversion rates
   - Revenue metrics

5. CONTENT PIPELINE
   - Content status workflow: Draft → Review → Approved → Published
   - Assign content tasks to team members
   - Version history for all content
   - Rollback capability

6. LOCALIZATION (Future)
   - Interface translations
   - Audio localization
   - Cultural adaptation notes
```

---

# APPENDIX A: Badge System

## Badge Categories

| Category | Trigger | Example |
|----------|---------|---------|
| **World Badges** | Complete a world | "Forest Explorer", "Home Sweet Home", "Market Master" |
| **Streak Badges** | Daily streak milestones | "3-Day Streak", "7-Day Streak", "30-Day Streak", "100-Day Streak" |
| **Vocabulary Badges** | Word milestones | "Word Collector (50)", "Word Wizard (100)", "Word Master (200)", "Word Champion (300)" |
| **Game Badges** | Game-specific achievements | "Match King", "Spelling Star", "Story Weaver" |
| **Special Badges** | Unique achievements | "First Lesson", "Helped Mimi", "Perfect Score", "Early Bird" |

## XP System

| Action | XP Earned |
|--------|----------|
| Complete a lesson | 50 XP |
| Perfect lesson (no mistakes) | 75 XP |
| Daily warm-up complete | 20 XP |
| Game completed | 30 XP |
| Word mastered (reaches "Mastered" level) | 10 XP per word |
| Daily streak maintained | 15 XP bonus |
| World completed | 200 XP bonus |

## Level Progression

| Level | XP Required | Title |
|-------|------------|-------|
| 1 | 0 | Little Explorer |
| 2 | 200 | Curious Learner |
| 3 | 500 | Word Collector |
| 4 | 1,000 | Story Reader |
| 5 | 2,000 | Language Adventurer |
| 6 | 3,500 | Grammar Guardian |
| 7 | 5,500 | Fluency Friend |
| 8 | 8,000 | English Hero |
| 9 | 12,000 | Language Champion |
| 10 | 18,000 | Mimi's Best Friend |

---

# APPENDIX B: Technical Requirements Summary

## For Development Teams

| Component | Requirement |
|-----------|------------|
| **Color Tokens** | Use CSS custom properties matching Section 1.4.1 exactly |
| **Typography** | Load Nunito (400, 600, 700, 800) and Inter (400, 600) from Google Fonts |
| **Spacing** | Use 4px base unit system from Section 1.4.3 |
| **Animations** | Mimi: Lottie files. UI: CSS transitions 200-300ms ease-out |
| **Audio** | All vocabulary: native speaker MP3 + Mimi voice MP3. Background music: loopable, calm |
| **Images** | All vocabulary images: SVG preferred, PNG fallback, 2x for retina |
| **Spaced Repetition** | Implement modified SM-2 algorithm per Section 2.2, Principle 2 |
| **Offline** | Premium users: cache current world + 2 previous worlds for offline use |
| **Accessibility** | WCAG 2.1 AA minimum. Voice-over compatible. Color-blind safe (all semantic colors have non-color indicators) |
| **Performance** | First meaningful paint < 2s. Lesson transition < 500ms. No jank in Mimi animations. |
| **Privacy** | COPPA and KVKK compliant. No personal data from children. No tracking pixels. No third-party analytics in child-facing UI. |

---

# APPENDIX C: Content Production Checklist

For each lesson, the content team must produce:

- [ ] Vocabulary list with Turkish translations
- [ ] Image for each vocabulary word (SVG/PNG)
- [ ] Native speaker audio for each word (MP3)
- [ ] Mimi voice audio for each word (MP3)
- [ ] Mimi dialogue script (English + Turkish)
- [ ] Mimi emotional state tags per dialogue line
- [ ] Story chapter script (with branching if applicable)
- [ ] Game configuration (which words, difficulty parameters)
- [ ] Quiz questions (5 per lesson)
- [ ] Background art for lesson scene
- [ ] Background music selection
- [ ] Badge artwork (for world completion badges)
- [ ] QA: test on iOS, Android, Web, Smart Board
- [ ] QA: test for ages 4-6, 7-8, 9-10 difficulty variants

---

# APPENDIX D: Key Metrics & Success Criteria

| Metric | Target |
|--------|--------|
| **Daily Active Users** | 70% of registered users active 4+ days/week |
| **Lesson Completion Rate** | 85%+ (started lessons are finished) |
| **Daily Session Length** | 12-20 minutes average |
| **Vocabulary Retention** | 80%+ words retained after 30 days (measured by spaced repetition) |
| **World Completion** | 60%+ users complete at least 6 worlds in 12 months |
| **Free-to-Premium Conversion** | 15%+ |
| **Monthly Churn (Premium)** | < 5% |
| **Parent NPS** | 60+ |
| **Teacher NPS** | 70+ |
| **App Store Rating** | 4.7+ |

---

*This document is the canonical reference for MinesMinis. All design, development, content, and business decisions should align with the principles, systems, and specifications outlined here.*

*Last updated: 2026-03-16 | Version 1.0*
