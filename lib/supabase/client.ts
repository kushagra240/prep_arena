import { createClient } from '@supabase/supabase-js';
import { Subject, Chapter, Problem, Profile, Submission, Achievement, UserAchievement } from './types';

// Detect whether Supabase credentials are valid placeholders
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isRealSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl.includes('supabase.co') && 
  supabaseAnonKey && 
  !supabaseAnonKey.includes('mock_anon_key');

export const supabase = isRealSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// CLIENT-SIDE OFFLINE DB ENGINE (FALLBACK)
// ==========================================

export const MOCK_SUBJECTS: Subject[] = [
  { id: 'sub-math', slug: 'mathematics', name: 'Mathematics', icon: '📐', color: '#3B82F6', description: 'Commercial Math, Algebra, Geometry, Mensuration, Trigonometry, Statistics & Probability.', chapter_count: 13 },
  { id: 'sub-phy', slug: 'physics', name: 'Physics', icon: '⚡', color: '#EF4444', description: 'Force, Work, Power & Energy, Machines, Light, Sound, Electricity, Household Circuits, Electromagnetism, Modern Physics.', chapter_count: 10 },
  { id: 'sub-che', slug: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#10B981', description: 'Periodic Properties, Chemical Bonding, Acids, Bases & Salts, Mole Concept, Electrolysis, Metallurgy, Study of Compounds, Organic Chemistry.', chapter_count: 12 },
  { id: 'sub-bio', slug: 'biology', name: 'Biology', icon: '🧬', color: '#8B5CF6', description: 'Cell Division, Genetics, Plant Physiology (Transpiration, Photosynthesis), Human Anatomy (Circulatory, Excretory, Nervous, Endocrine), Reproductive System.', chapter_count: 10 },
  { id: 'sub-comp', slug: 'computer-applications', name: 'Computer Applications', icon: '💻', color: '#06B6D4', description: 'OOPs principles, Java basics, Control structures, user-defined functions, Constructors, library classes, Arrays (1D/2D), Strings.', chapter_count: 8 },
  { id: 'sub-englit', slug: 'english-literature', name: 'English Literature', icon: '🎭', color: '#EC4899', description: 'Merchant of Venice (Acts I-V key scenes), poetry analysis (prescribed poems), and prose short stories.', chapter_count: 6 },
  { id: 'sub-englang', slug: 'english-language', name: 'English Language', icon: '✍️', color: '#F59E0B', description: 'Composition (Letters, Stories, Essays), Grammar (Tenses, Voice, Narration, Synthesis, Transformation), Comprehension.', chapter_count: 5 },
  { id: 'sub-hindi', slug: 'hindi', name: 'Hindi', icon: '📚', color: '#10B981', description: 'गद्य (Prose), पद्य (Poetry), व्याकरण (Grammar), निबंध एवं पत्र लेखन (Composition).', chapter_count: 4 },
  { id: 'sub-his', slug: 'history-civics', name: 'History & Civics', icon: '🏛️', color: '#6366F1', description: 'Civics (Union Legislature, Executive, Judiciary); History (First War of Independence, Nationalist Movement, World Wars, United Nations).', chapter_count: 6 },
  { id: 'sub-geo', slug: 'geography', name: 'Geography', icon: '🗺️', color: '#14B8A6', description: 'Topographical Maps, Climate of India, Soils, Natural Vegetation, Minerals & Energy, Agriculture, Transport, Waste Management.', chapter_count: 8 }
];

export const MOCK_CHAPTERS: Chapter[] = [
  // Math
  { id: 'ch-math-1', subject_id: 'sub-math', name: 'Commercial Mathematics', description: 'GST (Goods and Services Tax), Banking (RD), and Shares.', order_index: 1, syllabus_reference: 'ICSE-MAT-01', created_at: new Date().toISOString() },
  { id: 'ch-math-2', subject_id: 'sub-math', name: 'Algebra: Quadratic Equations', description: 'Solving quadratic equations and solving word problems.', order_index: 2, syllabus_reference: 'ICSE-MAT-02', created_at: new Date().toISOString() },
  
  // Physics
  { id: 'ch-phy-1', subject_id: 'sub-phy', name: 'Force', description: 'Turning effect, center of gravity, circular motion.', order_index: 1, syllabus_reference: 'ICSE-PHY-01', created_at: new Date().toISOString() },
  { id: 'ch-phy-2', subject_id: 'sub-phy', name: 'Light & Lenses', description: 'Refraction, critical angle, convex and concave lenses.', order_index: 4, syllabus_reference: 'ICSE-PHY-04', created_at: new Date().toISOString() },
  
  // Chemistry
  { id: 'ch-che-1', subject_id: 'sub-che', name: 'Periodic Properties', description: 'Periodic properties and variations across groups/periods.', order_index: 1, syllabus_reference: 'ICSE-CHE-01', created_at: new Date().toISOString() },
  { id: 'ch-che-2', subject_id: 'sub-che', name: 'Organic Chemistry', description: 'Alkanes, Alkenes, Alkynes, functional groups.', order_index: 12, syllabus_reference: 'ICSE-CHE-12', created_at: new Date().toISOString() },

  // Biology
  { id: 'ch-bio-1', subject_id: 'sub-bio', name: 'Cell Division', description: 'Mitosis and Meiosis, chromosomes.', order_index: 1, syllabus_reference: 'ICSE-BIO-01', created_at: new Date().toISOString() },
  { id: 'ch-bio-2', subject_id: 'sub-bio', name: 'Genetics: Mendel\'s Laws', description: 'Monohybrid, dihybrid crosses and pedigree charts.', order_index: 2, syllabus_reference: 'ICSE-BIO-02', created_at: new Date().toISOString() },

  // Computer Applications
  { id: 'ch-comp-1', subject_id: 'sub-comp', name: 'Object-Oriented Programming', description: 'OOPs principles, Classes and Objects.', order_index: 1, syllabus_reference: 'ICSE-COM-02', created_at: new Date().toISOString() },
  { id: 'ch-comp-2', subject_id: 'sub-comp', name: 'Arrays in Java', description: '1D and 2D arrays, sorting and searching.', order_index: 7, syllabus_reference: 'ICSE-COM-07', created_at: new Date().toISOString() },

  // English Lit
  { id: 'ch-lit-1', subject_id: 'sub-englit', name: 'Drama: The Merchant of Venice Act I & II', description: 'Bassanio\'s request, Shylock\'s bond, Casket choices.', order_index: 5, syllabus_reference: 'ICSE-LIT-05', created_at: new Date().toISOString() },

  // English Grammar
  { id: 'ch-eng-1', subject_id: 'sub-englang', name: 'Synthesis & Sentence Transformation', description: 'Combining sentences, degree changes, tenses.', order_index: 4, syllabus_reference: 'ICSE-ENG-04', created_at: new Date().toISOString() },

  // Hindi
  { id: 'ch-hin-1', subject_id: 'sub-hindi', name: 'व्याकरण (Grammar)', description: 'संधि, समास, मुहावरे और लोकोक्तियाँ।', order_index: 3, syllabus_reference: 'ICSE-HIN-03', created_at: new Date().toISOString() },

  // History & Civics
  { id: 'ch-his-1', subject_id: 'sub-his', name: 'Civics: The Union Legislature', description: 'Lok Sabha, Rajya Sabha functions and powers.', order_index: 1, syllabus_reference: 'ICSE-HIS-01', created_at: new Date().toISOString() },

  // Geography
  { id: 'ch-geo-1', subject_id: 'sub-geo', name: 'Climate of India', description: 'Monsoon mechanisms and regional climate details.', order_index: 2, syllabus_reference: 'ICSE-GEO-02', created_at: new Date().toISOString() }
];

export const MOCK_PROBLEMS: Problem[] = [
  // Commercial Math - MCQ
  {
    id: 'prob-math-1',
    chapter_id: 'ch-math-1',
    subject_id: 'sub-math',
    title: 'GST Calculation on Inter-State Supply',
    slug: 'gst-calculation-inter-state-supply',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'A shopkeeper in Maharashtra sells goods to a consumer in Maharashtra worth ₹12,000. If the rate of GST is 18%, what are the CGST and SGST amounts paid by the consumer?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 120,
    tags: ['#gst', '#commercial-math', '#board-2023'],
    mcq_options: [
      { id: 'A', text: 'CGST = ₹1,080, SGST = ₹1,080', isCorrect: true },
      { id: 'B', text: 'CGST = ₹2,160, SGST = ₹0', isCorrect: false },
      { id: 'C', text: 'CGST = ₹0, SGST = ₹2,160', isCorrect: false },
      { id: 'D', text: 'CGST = ₹540, SGST = ₹540', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2023,
    is_board_question: true,
    total_attempts: 1450,
    total_correct: 1102,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Commercial Math - Brief Writing
  {
    id: 'prob-math-2',
    chapter_id: 'ch-math-1',
    subject_id: 'sub-math',
    title: 'Recurring Deposit Maturity Value',
    slug: 'recurring-deposit-maturity-value',
    problem_type: 'brief_writing',
    difficulty: 'medium',
    question_text: 'Karan deposits ₹800 per month in a recurring deposit account for 2 years (24 months) at a rate of 10% per annum simple interest. Find the total interest earned and the maturity value of this account. Explain your calculation steps.',
    question_image_url: null,
    marks: 4,
    time_limit_seconds: 240,
    tags: ['#banking', '#rd-account', '#interest'],
    mcq_options: null,
    expected_answer: 'Principal P = ₹800 per month. Number of months n = 24. Rate of interest R = 10%. \nTotal Principal deposited = P × n = ₹800 × 24 = ₹19,200. \nEquivalent Principal for 1 month = P × [n(n+1)] / 2 = 800 × [24 × 25] / 2 = ₹240,000. \nSimple Interest = (Equivalent Principal × R × 1) / (100 × 12) = (240000 × 10) / 1200 = ₹2,000. \nMaturity Value = Total Principal + Simple Interest = ₹19,200 + ₹2,000 = ₹21,200.',
    answer_keywords: ['Maturity Value', 'Interest = P * n(n+1)/2 * R / (12 * 100)', '₹2,000', '₹21,200', '24 months'],
    min_words: 40,
    max_words: 250,
    icse_year: 2020,
    is_board_question: true,
    total_attempts: 890,
    total_correct: 620,
    xp_reward: 30,
    created_at: new Date().toISOString(),
    is_active: true
  },
  
  // Physics - Turning effect (Force) - Brief Writing
  {
    id: 'prob-phy-1',
    chapter_id: 'ch-phy-1',
    subject_id: 'sub-phy',
    title: 'Principle of Moments & Rule Balance',
    slug: 'principle-of-moments-rule-balance',
    problem_type: 'brief_writing',
    difficulty: 'hard',
    question_text: 'A uniform half-metre rule balances horizontally on a knife-edge placed at the 29 cm mark when a weight of 20 gf is suspended from one end. \n1. Draw a diagram of this arrangement. \n2. State the position of the center of gravity of the rule. \n3. Determine the mass of the half-metre rule. State and explain the principle of moments used.',
    question_image_url: null,
    marks: 4,
    time_limit_seconds: 300,
    tags: ['#force', '#moments', '#torque', '#board-2022'],
    mcq_options: null,
    expected_answer: '1. A uniform half-metre rule is 50 cm long. Its center of gravity G lies at the midpoint, which is 25 cm. \n2. The knife-edge is placed at 29 cm. This is to the right of the center of gravity (25 cm). \n3. To balance it, a 20 gf weight must be suspended from the left end (0 cm) to counteract the clockwise moment of the rule\'s weight. \nAnticlockwise Moment = 20 gf × (29 cm - 0 cm) = 20 × 29 = 580 gf-cm. \nClockwise Moment = Weight of rule (W) × (29 cm - 25 cm) = W × 4 cm. \nBy the Principle of Moments, in equilibrium: Anticlockwise Moment = Clockwise Moment. \n580 = W × 4 => W = 580 / 4 = 145 gf. Therefore, the mass of the half-metre rule is 145 g.',
    answer_keywords: ['Center of gravity', '25 cm', 'Principle of Moments', 'Anticlockwise = Clockwise', '145 gf', '145 g'],
    min_words: 50,
    max_words: 300,
    icse_year: 2022,
    is_board_question: true,
    total_attempts: 1200,
    total_correct: 420,
    xp_reward: 50,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Physics - Lenses - MCQ
  {
    id: 'prob-phy-2',
    chapter_id: 'ch-phy-2',
    subject_id: 'sub-phy',
    title: 'Character of Convex Lens Image',
    slug: 'character-of-convex-lens-image',
    problem_type: 'mcq',
    difficulty: 'medium',
    question_text: 'An object is placed at a distance of 12 cm in front of a convex lens of focal length 8 cm. What is the nature and size of the image formed?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 120,
    tags: ['#light', '#lenses', '#refraction'],
    mcq_options: [
      { id: 'A', text: 'Real, inverted, and magnified', isCorrect: true },
      { id: 'B', text: 'Real, inverted, and diminished', isCorrect: false },
      { id: 'C', text: 'Virtual, upright, and magnified', isCorrect: false },
      { id: 'D', text: 'Virtual, upright, and diminished', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2019,
    is_board_question: true,
    total_attempts: 2030,
    total_correct: 1450,
    xp_reward: 20,
    created_at: new Date().toISOString(),
    is_active: true
  },
  
  // Chemistry - Periodic Properties - MCQ
  {
    id: 'prob-che-1',
    chapter_id: 'ch-che-1',
    subject_id: 'sub-che',
    title: 'Electronegativity Trend in Periodic Table',
    slug: 'electronegativity-trend-periodic-table',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'As we move from left to right across a period in the periodic table, what is the trend of atomic size and electronegativity?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#periodic-trends', '#electronegativity'],
    mcq_options: [
      { id: 'A', text: 'Atomic size decreases, electronegativity increases', isCorrect: true },
      { id: 'B', text: 'Atomic size increases, electronegativity decreases', isCorrect: false },
      { id: 'C', text: 'Both atomic size and electronegativity increase', isCorrect: false },
      { id: 'D', text: 'Both atomic size and electronegativity decrease', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2024,
    is_board_question: true,
    total_attempts: 3200,
    total_correct: 2460,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Chemistry - Organic Chemistry - Brief Writing
  {
    id: 'prob-che-2',
    chapter_id: 'ch-che-2',
    subject_id: 'sub-che',
    title: 'Saturated vs Unsaturated Hydrocarbons',
    slug: 'saturated-vs-unsaturated-hydrocarbons',
    problem_type: 'brief_writing',
    difficulty: 'medium',
    question_text: 'Distinguish between saturated and unsaturated hydrocarbons based on: \n1. Types of bonds present. \n2. Action of Bromine water (Br₂ in CCl₄). \nWrite down the relevant chemical equation for the bromine test with Ethylene (Ethene).',
    question_image_url: null,
    marks: 2,
    time_limit_seconds: 180,
    tags: ['#organic-chemistry', '#bromine-test', '#hydrocarbons'],
    mcq_options: null,
    expected_answer: '1. Saturated hydrocarbons (e.g., Alkanes) contain only single covalent carbon-carbon bonds. Unsaturated hydrocarbons (e.g., Alkenes, Alkynes) contain double or triple carbon-carbon bonds. \n2. Saturated hydrocarbons do not react with Bromine water at room temperature (no color change). Unsaturated hydrocarbons rapidly decolorize reddish-brown Bromine water in an addition reaction. \nEquation: CH₂=CH₂ + Br₂ → CH₂Br-CH₂Br (1,2-dibromoethane, colorless).',
    answer_keywords: ['covalent single bonds', 'double or triple bonds', 'decolorizes', 'reddish-brown bromine water', 'CH2=CH2 + Br2', '1,2-dibromoethane'],
    min_words: 35,
    max_words: 200,
    icse_year: 2021,
    is_board_question: true,
    total_attempts: 1100,
    total_correct: 820,
    xp_reward: 20,
    created_at: new Date().toISOString(),
    is_active: true
  },

  // Computer Applications - String manipulation - MCQ
  {
    id: 'prob-comp-1',
    chapter_id: 'ch-comp-2',
    subject_id: 'sub-comp',
    title: 'Java String substring() Method Execution',
    slug: 'java-string-substring-method-execution',
    problem_type: 'mcq',
    difficulty: 'medium',
    question_text: 'What will be the output of the following Java expression? \n`String s = "COMPUTER"; System.out.println(s.substring(2, 6));`',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#java-strings', '#substring', '#loops'],
    mcq_options: [
      { id: 'A', text: '"MPUT"', isCorrect: true },
      { id: 'B', text: '"OMPU"', isCorrect: false },
      { id: 'C', text: '"OMPUT"', isCorrect: false },
      { id: 'D', text: '"MPUTE"', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2023,
    is_board_question: true,
    total_attempts: 2500,
    total_correct: 1980,
    xp_reward: 20,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Computer Applications - OOP - Brief Writing
  {
    id: 'prob-comp-2',
    chapter_id: 'ch-comp-1',
    subject_id: 'sub-comp',
    title: 'Explain Encapsulation in Java',
    slug: 'explain-encapsulation-in-java',
    problem_type: 'brief_writing',
    difficulty: 'easy',
    question_text: 'Define "Encapsulation" in Java. Explain how it is achieved in Object-Oriented Programming and state one advantage of it.',
    question_image_url: null,
    marks: 2,
    time_limit_seconds: 150,
    tags: ['#oop', '#encapsulation', '#data-hiding'],
    mcq_options: null,
    expected_answer: 'Encapsulation is the mechanism of wrapping data (variables) and code acting on the data (methods) together as a single unit (class). \nIt is achieved by: \n1. Declaring the variables of a class as private. \n2. Providing public getter and setter methods to access and modify the variables. \nAdvantage: It provides data hiding and makes the class read-only or write-only, improving security and maintainability.',
    answer_keywords: ['wrapping data and methods', 'single unit', 'private variables', 'getter and setter', 'data hiding', 'security'],
    min_words: 30,
    max_words: 150,
    icse_year: 2024,
    is_board_question: true,
    total_attempts: 1780,
    total_correct: 1420,
    xp_reward: 15,
    created_at: new Date().toISOString(),
    is_active: true
  },

  // English Literature - merchant of Venice - Brief Writing
  {
    id: 'prob-lit-1',
    chapter_id: 'ch-lit-1',
    subject_id: 'sub-englit',
    title: 'Merchant of Venice: Act I Scene 3 Bond',
    slug: 'merchant-of-venice-act-i-scene-3-bond',
    problem_type: 'brief_writing',
    difficulty: 'hard',
    question_text: 'In Act I, Scene 3 of "The Merchant of Venice", Shylock proposes a "merry bond" to Antonio. What are the specific terms of this bond? Analyze Shylock\'s underlying motives in proposing this seemingly humorous agreement.',
    question_image_url: null,
    marks: 4,
    time_limit_seconds: 300,
    tags: ['#merchant-of-venice', '#shylock', '#shakespeare'],
    mcq_options: null,
    expected_answer: 'The terms of the bond are: Shylock lends Bassanio 3,000 ducats for a period of three months, with Antonio acting as the surety (guarantor). If Antonio fails to repay the loan on the exact day and place, Shylock has the right to cut a "pound of flesh" from any part of Antonio\'s body that pleases him. \nShylock\'s underlying motives are far from "merry" or humorous. He harbors a deep, venomous hatred for Antonio because Antonio is a Christian, spits on Shylock\'s Jewish gaberdine, mocks his usury, and lends money without interest, which lowers interest rates in Venice. Proposing the bond under the guise of a joke allows Shylock to trap Antonio under legal terms so that he can "feed fat his ancient grudge" if Antonio defaults, effectively seeking Antonio\'s death.',
    answer_keywords: ['3,000 ducats', 'three months', 'pound of flesh', 'surety', 'venomous hatred', 'feed fat his ancient grudge', 'Christian'],
    min_words: 60,
    max_words: 350,
    icse_year: 2023,
    is_board_question: true,
    total_attempts: 980,
    total_correct: 540,
    xp_reward: 50,
    created_at: new Date().toISOString(),
    is_active: true
  },

  // History & Civics - MCQ
  {
    id: 'prob-his-1',
    chapter_id: 'ch-his-1',
    subject_id: 'sub-his',
    title: 'Quorum of the Indian Parliament',
    slug: 'quorum-of-the-indian-parliament',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'What is the "Quorum" required to constitute a meeting of either House of the Indian Parliament (Lok Sabha or Rajya Sabha)?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#civics', '#parliament', '#quorum'],
    mcq_options: [
      { id: 'A', text: '1/10th of the total membership of the House', isCorrect: true },
      { id: 'B', text: '1/3rd of the total membership of the House', isCorrect: false },
      { id: 'C', text: '1/2 of the total membership of the House', isCorrect: false },
      { id: 'D', text: '2/3rd of the total membership of the House', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2022,
    is_board_question: true,
    total_attempts: 2100,
    total_correct: 1850,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  },

  // Geography - Soils - MCQ
  {
    id: 'prob-geo-1',
    chapter_id: 'ch-geo-1',
    subject_id: 'sub-geo',
    title: 'Soil Formed by In-situ Weathering of Lava',
    slug: 'soil-formed-by-in-situ-weathering-of-lava',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'Which soil in India is formed by the in-situ weathering of basaltic lava rocks, is highly argillaceous, moisture-retentive, and is ideal for growing cotton?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#soils', '#cotton', '#geography'],
    mcq_options: [
      { id: 'A', text: 'Black Soil (Regur Soil)', isCorrect: true },
      { id: 'B', text: 'Alluvial Soil', isCorrect: false },
      { id: 'C', text: 'Red Soil', isCorrect: false },
      { id: 'D', text: 'Laterite Soil', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2024,
    is_board_question: true,
    total_attempts: 2900,
    total_correct: 2340,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-first-step', slug: 'first-step', name: 'First Step', description: 'Solve your first MCQ correctly', icon: '🚶', xp_bonus: 50, condition_type: 'solved_mcq_count', condition_value: 1 },
  { id: 'ach-board-master', slug: 'board-master', name: 'Board Master', description: 'Solve 10 questions correctly', icon: '🏆', xp_bonus: 200, condition_type: 'solved_count', condition_value: 10 },
  { id: 'ach-physics-prodigy', slug: 'physics-prodigy', name: 'Physics Prodigy', description: 'Solve 3 Physics questions correctly', icon: '⚡', xp_bonus: 100, condition_type: 'subject_solved_count', condition_value: 3 },
  { id: 'ach-chemistry-whiz', slug: 'chemistry-whiz', name: 'Chemistry Whiz', description: 'Solve 3 Chemistry questions correctly', icon: '🧪', xp_bonus: 100, condition_type: 'subject_solved_count', condition_value: 3 },
  { id: 'ach-computer-applications', slug: 'computer-applications', name: 'computer-applications', description: 'Solve 3 Computer Applications questions correctly', icon: '💻', xp_bonus: 100, condition_type: 'subject_solved_count', condition_value: 3 },
  { id: 'ach-english-scholar', slug: 'english-scholar', name: 'English Scholar', description: 'Solve 3 English questions correctly', icon: '📚', xp_bonus: 100, condition_type: 'subject_solved_count', condition_value: 3 },
  { id: 'ach-streak-warrior', slug: 'streak-warrior', name: 'Streak Warrior', description: 'Achieve a 3-day study streak', icon: '⚔️', xp_bonus: 150, condition_type: 'streak', condition_value: 3 },
  { id: 'ach-night-owl', slug: 'night-owl', name: 'Night Owl', description: 'Solve a question between 11 PM and 4 AM', icon: '🦉', xp_bonus: 100, condition_type: 'night_owl', condition_value: 1 }
];

// Initialize localStorage DB if on client side
const getLocalStorageData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorageData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
};

// Initial Profile
const INITIAL_PROFILE: Profile = {
  id: 'user-id-mock-student',
  clerk_user_id: 'clerk-user-id-mock-student',
  username: 'kushagra_icse',
  full_name: 'Kushagra Sharma',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  school: 'St. Xavier\'s Collegiate School',
  city: 'Kolkata',
  grade: '10',
  board: 'ICSE',
  xp: 180, // Start with a bit of XP for initial showcase
  streak_days: 3,
  last_activity_date: new Date().toISOString().split('T')[0],
  total_solved: 4,
  total_attempted: 6,
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
  focus_subjects: []
};

// Mock leaderboards
const MOCK_COMPETITIVE_STUDENTS = [
  { rank: 1, username: 'arjun_mehta', full_name: 'Arjun Mehta', school: 'DPS Mumbai', city: 'Mumbai', xp: 12450, total_solved: 843, accuracy: 91, streak_days: 47, avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { rank: 2, username: 'priya_sharma', full_name: 'Priya Sharma', school: 'Modern School Barakhamba', city: 'New Delhi', xp: 9800, total_solved: 512, accuracy: 88, streak_days: 14, avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { rank: 3, username: 'soham_roy', full_name: 'Soham Roy', school: 'La Martiniere for Boys', city: 'Kolkata', xp: 8200, total_solved: 420, accuracy: 86, streak_days: 28, avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { rank: 4, username: 'ananya_sen', full_name: 'Ananya Sen', school: 'Welham Girls School', city: 'Dehradun', xp: 6400, total_solved: 310, accuracy: 89, streak_days: 7, avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
  { rank: 5, username: 'rahul_verma', full_name: 'Rahul Verma', school: 'Bishop Cotton Boys School', city: 'Bengaluru', xp: 5100, total_solved: 254, accuracy: 82, streak_days: 5, avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' }
];

export const clientDb = {
  getProfile: (): Profile => {
    return getLocalStorageData('preparena_profile', INITIAL_PROFILE);
  },
  
  saveProfile: (profile: Profile): void => {
    setLocalStorageData('preparena_profile', profile);
  },

  getSubmissions: (): Submission[] => {
    const defaultSubmissions: Submission[] = [
      { id: 'sub-mock-1', user_id: 'user-id-mock-student', problem_id: 'prob-math-1', answer_text: null, selected_option_id: 'A', is_correct: true, ai_score: null, ai_feedback: null, time_taken_seconds: 45, xp_earned: 10, submitted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'sub-mock-2', user_id: 'user-id-mock-student', problem_id: 'prob-che-1', answer_text: null, selected_option_id: 'A', is_correct: true, ai_score: null, ai_feedback: null, time_taken_seconds: 32, xp_earned: 10, submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'sub-mock-3', user_id: 'user-id-mock-student', problem_id: 'prob-comp-1', answer_text: null, selected_option_id: 'A', is_correct: true, ai_score: null, ai_feedback: null, time_taken_seconds: 50, xp_earned: 20, submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'sub-mock-4', user_id: 'user-id-mock-student', problem_id: 'prob-comp-2', answer_text: 'Encapsulation is data hiding. We make variables private and write getters and setters to access them. This keeps variables safe.', selected_option_id: null, is_correct: true, ai_score: 8.5, ai_feedback: 'Very good definition of data hiding. You successfully covered getters and setters. To improve, mention the keyword class as a wrapping unit.', time_taken_seconds: 110, xp_earned: 15, submitted_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
    ];
    return getLocalStorageData('preparena_submissions', defaultSubmissions);
  },

  saveSubmissions: (submissions: Submission[]): void => {
    setLocalStorageData('preparena_submissions', submissions);
  },

  getUserAchievements: (): UserAchievement[] => {
    const defaultEarned: UserAchievement[] = [
      { id: 'ua-1', user_id: 'user-id-mock-student', achievement_id: 'ach-1', earned_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
    ];
    return getLocalStorageData('preparena_user_achievements', defaultEarned);
  },

  saveUserAchievements: (userAchievements: UserAchievement[]): void => {
    setLocalStorageData('preparena_user_achievements', userAchievements);
  },

  submitAnswer: (problemId: string, payload: { selectedOptionId?: string; answerText?: string; isCorrect: boolean; aiScore?: number; aiFeedback?: string; timeTakenSeconds: number }): { submission: Submission; xpEarned: number; newProfile: Profile; achievementsUnlocked: Achievement[] } => {
    const profile = clientDb.getProfile();
    const submissions = clientDb.getSubmissions();
    const userAchievements = clientDb.getUserAchievements();

    const problem = MOCK_PROBLEMS.find(p => p.id === problemId);
    if (!problem) throw new Error('Problem not found');

    // Calculate XP
    let xpEarned = problem.xp_reward;
    if (problem.problem_type === 'brief_writing' && payload.aiScore !== undefined) {
      // Scale based on score out of 10
      xpEarned = Math.round((problem.xp_reward * payload.aiScore) / 10);
      if (payload.aiScore >= 9) xpEarned += 10; // Perfect score bonus
    } else if (problem.problem_type === 'mcq' && !payload.isCorrect) {
      xpEarned = 0; // No XP for wrong MCQs
    }

    // Check if solved before
    const isFirstTime = !submissions.some(s => s.problem_id === problemId && s.is_correct);
    if (isFirstTime && payload.isCorrect) {
      xpEarned += 5; // First solve bonus
    }

    // Apply Daily Challenge 2x XP Multiplier
    const dailyChallengeId = typeof window !== 'undefined' ? localStorage.getItem('preparena_daily_challenge_id') : null;
    const isDailyChallenge = problemId === dailyChallengeId;
    const xpMultiplier = isDailyChallenge ? 2 : 1;
    xpEarned = xpEarned * xpMultiplier;

    // Create Submission
    const submission: Submission = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      user_id: profile.id,
      problem_id: problemId,
      answer_text: payload.answerText || null,
      selected_option_id: payload.selectedOptionId || null,
      is_correct: payload.isCorrect,
      ai_score: payload.aiScore || null,
      ai_feedback: payload.aiFeedback || null,
      time_taken_seconds: payload.timeTakenSeconds,
      xp_earned: xpEarned,
      submitted_at: new Date().toISOString()
    };

    const newSubmissions = [submission, ...submissions];
    clientDb.saveSubmissions(newSubmissions);

    // Update Profile Stats
    const uniqueSolvedCount = new Set(
      newSubmissions.filter(s => s.is_correct).map(s => s.problem_id)
    ).size;

    const uniqueAttemptedCount = new Set(
      newSubmissions.map(s => s.problem_id)
    ).size;

    // Handle activity and streak
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = profile.streak_days;
    
    if (profile.last_activity_date !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (profile.last_activity_date === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // Streak reset to 1 day on new activity
      }
    }

    const newProfile: Profile = {
      ...profile,
      xp: profile.xp + xpEarned,
      streak_days: newStreak,
      last_activity_date: todayStr,
      total_solved: uniqueSolvedCount,
      total_attempted: uniqueAttemptedCount,
      updated_at: new Date().toISOString()
    };

    clientDb.saveProfile(newProfile);

    // Check achievements unlock
    const achievementsUnlocked: Achievement[] = [];
    MOCK_ACHIEVEMENTS.forEach(ach => {
      const alreadyEarned = userAchievements.some(ua => ua.achievement_id === ach.id);
      if (alreadyEarned) return;

      let meetsCondition = false;
      if (ach.condition_type === 'solved_mcq_count') {
        const mcqSolved = newSubmissions.filter(s => {
          const p = MOCK_PROBLEMS.find(prob => prob.id === s.problem_id);
          return p && p.problem_type === 'mcq' && s.is_correct;
        }).length;
        meetsCondition = mcqSolved >= ach.condition_value;
      } else if (ach.condition_type === 'solved_count') {
        meetsCondition = uniqueSolvedCount >= ach.condition_value;
      } else if (ach.condition_type === 'streak') {
        meetsCondition = newStreak >= ach.condition_value;
      } else if (ach.condition_type === 'subject_solved_count') {
        // Map target slugs
        let targetSubjectId = '';
        if (ach.slug === 'physics-prodigy') targetSubjectId = 'sub-physics';
        else if (ach.slug === 'chemistry-whiz') targetSubjectId = 'sub-chem';
        else if (ach.slug === 'computer-applications') targetSubjectId = 'sub-computer';
        else if (ach.slug === 'english-scholar') targetSubjectId = 'sub-englit';

        const solvedCountForSubject = newSubmissions.filter(s => {
          const p = MOCK_PROBLEMS.find(prob => prob.id === s.problem_id);
          if (!p || !s.is_correct) return false;
          if (ach.slug === 'english-scholar') {
            return p.subject_id === 'sub-englit' || p.subject_id === 'sub-englang';
          }
          return p.subject_id === targetSubjectId;
        }).length;

        meetsCondition = solvedCountForSubject >= ach.condition_value;
      } else if (ach.condition_type === 'night_owl') {
        const hours = new Date().getHours();
        meetsCondition = hours >= 23 || hours <= 4;
      }

      if (meetsCondition) {
        achievementsUnlocked.push(ach);
        userAchievements.push({
          id: `ua-${Math.random().toString(36).substr(2, 9)}`,
          user_id: profile.id,
          achievement_id: ach.id,
          earned_at: new Date().toISOString()
        });
      }
    });

    if (achievementsUnlocked.length > 0) {
      // Add achievements XP to profile
      const bonusXP = achievementsUnlocked.reduce((sum, a) => sum + a.xp_bonus, 0);
      newProfile.xp += bonusXP;
      clientDb.saveProfile(newProfile);
      clientDb.saveUserAchievements(userAchievements);
    }

    return { submission, xpEarned, newProfile, achievementsUnlocked };
  },

  getLeaderboard: (): { rank: number; username: string; full_name: string; school: string; city: string; xp: number; total_solved: number; accuracy: number; streak_days: number; avatar_url: string }[] => {
    const profile = clientDb.getProfile();
    const submissions = clientDb.getSubmissions();

    // calculate user metrics
    const totalSub = submissions.length;
    const correctSub = submissions.filter(s => s.is_correct).length;
    const accuracy = totalSub > 0 ? Math.round((correctSub / totalSub) * 100) : 0;

    const userEntry = {
      username: profile.username,
      full_name: profile.full_name || 'Anonymous Student',
      school: profile.school || 'ICSE Academy',
      city: profile.city || 'India',
      xp: profile.xp,
      total_solved: profile.total_solved,
      accuracy,
      streak_days: profile.streak_days,
      avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    const combinedList = [...MOCK_COMPETITIVE_STUDENTS, userEntry]
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    return combinedList;
  },

  getMockExams: (): any[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('prep_arena_mock_exams');
    return saved ? JSON.parse(saved) : [];
  },

  saveMockExam: (exam: any): void => {
    if (typeof window === 'undefined') return;
    const exams = clientDb.getMockExams();
    // Prevent duplicate entries by checking if the id already exists
    const filteredExams = exams.filter(e => e.id !== exam.id);
    filteredExams.push(exam);
    localStorage.setItem('prep_arena_mock_exams', JSON.stringify(filteredExams));
  },

  getProblems: (): Problem[] => {
    return getLocalStorageData('preparena_problems', MOCK_PROBLEMS);
  },

  saveProblems: (problems: Problem[]): void => {
    setLocalStorageData('preparena_problems', problems);
  },

  getChapters: (): Chapter[] => {
    const chapters = getLocalStorageData('preparena_chapters', MOCK_CHAPTERS);
    return chapters.map((ch: any) => {
      if (!ch.topics) {
        if (ch.id === 'ch-math-1') ch.topics = ['GST on goods/services', 'Maturity value of RD', 'Shares & Dividends yield'];
        else if (ch.id === 'ch-phy-1') ch.topics = ['Turning effect of force', 'Center of gravity', 'Uniform circular motion'];
        else if (ch.id === 'ch-che-1') ch.topics = ['Periodic trends', 'Ionization potential', 'Electronegativity'];
        else ch.topics = ['Introduction & Basics', 'Key concepts', 'Example applications'];
      }
      return ch;
    });
  },

  saveChapters: (chapters: Chapter[]): void => {
    setLocalStorageData('preparena_chapters', chapters);
  }
};
