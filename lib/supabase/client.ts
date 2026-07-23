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
  { id: 'ch-his-2', subject_id: 'sub-his', name: 'History: First War of Independence (1857)', description: 'Causes, events, and consequences of the Great Revolt of 1857.', order_index: 2, syllabus_reference: 'ICSE-HIS-02', created_at: new Date().toISOString() },

  // Geography
  { id: 'ch-geo-1', subject_id: 'sub-geo', name: 'Climate of India', description: 'Monsoon mechanisms and regional climate details.', order_index: 2, syllabus_reference: 'ICSE-GEO-02', created_at: new Date().toISOString() },
  { id: 'ch-geo-2', subject_id: 'sub-geo', name: 'Soils of India', description: 'Alluvial, Black, Red, and Laterite soils - formation, characteristics, and distribution.', order_index: 3, syllabus_reference: 'ICSE-GEO-03', created_at: new Date().toISOString() },

  // Mathematics New Chapters
  { id: 'ch-math-3', subject_id: 'sub-math', name: 'Algebra: Matrices', description: 'Types of matrices, addition, subtraction, multiplication, and solving matrix equations.', order_index: 5, syllabus_reference: 'ICSE-MAT-05', created_at: new Date().toISOString() },
  { id: 'ch-math-4', subject_id: 'sub-math', name: 'Trigonometry: Identities and Heights & Distances', description: 'Proving trigonometric identities and solving heights and distances word problems.', order_index: 10, syllabus_reference: 'ICSE-MAT-10', created_at: new Date().toISOString() },

  // Physics New Chapters
  { id: 'ch-phy-3', subject_id: 'sub-phy', name: 'Sound', description: 'Reflection of sound waves, echoes, free, forced, and resonant vibrations.', order_index: 6, syllabus_reference: 'ICSE-PHY-06', created_at: new Date().toISOString() },

  // Chemistry New Chapters
  { id: 'ch-che-3', subject_id: 'sub-che', name: 'Acids, Bases & Salts', description: 'pH scale, properties of acids/bases, preparation and properties of salts.', order_index: 3, syllabus_reference: 'ICSE-CHE-03', created_at: new Date().toISOString() },

  // Biology New Chapters
  { id: 'ch-bio-3', subject_id: 'sub-bio', name: 'Photosynthesis', description: 'Mechanism of photosynthesis, light and dark phases, and factors affecting it.', order_index: 5, syllabus_reference: 'ICSE-BIO-05', created_at: new Date().toISOString() },

  // Computer Applications New Chapters
  { id: 'ch-comp-3', subject_id: 'sub-comp', name: 'String Handling in Java', description: 'String class methods, string comparisons, and character extraction manipulation.', order_index: 8, syllabus_reference: 'ICSE-COM-08', created_at: new Date().toISOString() }
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
  },
  // Biology - Cell Division - MCQ
  {
    id: 'prob-bio-1',
    chapter_id: 'ch-bio-1',
    subject_id: 'sub-bio',
    title: 'Stages of Mitosis Alignment',
    slug: 'stages-of-mitosis-alignment',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'During which stage of mitosis do the sister chromatids align along the equatorial plane of the cell?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 120,
    tags: ['#mitosis', '#cell-division', '#biology'],
    mcq_options: [
      { id: 'A', text: 'Prophase', isCorrect: false },
      { id: 'B', text: 'Metaphase', isCorrect: true },
      { id: 'C', text: 'Anaphase', isCorrect: false },
      { id: 'D', text: 'Telophase', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2022,
    is_board_question: true,
    total_attempts: 1800,
    total_correct: 1450,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Biology - Genetics - Brief Writing
  {
    id: 'prob-bio-2',
    chapter_id: 'ch-bio-2',
    subject_id: 'sub-bio',
    title: "Mendel's Law of Dominance",
    slug: 'mendels-law-of-dominance',
    problem_type: 'brief_writing',
    difficulty: 'medium',
    question_text: "State Mendel's \"Law of Dominance\". Explain it with the help of a cross between a pure tall pea plant (TT) and a pure dwarf pea plant (tt) to show the phenotype of the F1 generation.",
    question_image_url: null,
    marks: 3,
    time_limit_seconds: 240,
    tags: ['#genetics', '#mendel-laws', '#inheritance'],
    mcq_options: null,
    expected_answer: "Mendel's Law of Dominance states that in a heterozygote, one allele will conceal the presence of another allele for the same characteristic. Rather than both alleles contributing to a phenotype, the dominant allele will be expressed exclusively.\nCross: Pure tall plant (TT) x Pure dwarf plant (tt) produces F1 gametes (T) and (t) which combine to form heterozygote (Tt). All F1 offspring are phenotypically Tall because the Tall allele (T) is dominant over the dwarf allele (t).",
    answer_keywords: ['Law of Dominance', 'heterozygote', 'dominant allele', 'Tt', 'phenotypically tall', 'dwarf allele'],
    min_words: 40,
    max_words: 250,
    icse_year: 2021,
    is_board_question: true,
    total_attempts: 950,
    total_correct: 680,
    xp_reward: 30,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // English Language - Sentence Transformation - MCQ
  {
    id: 'prob-englang-1',
    chapter_id: 'ch-eng-1',
    subject_id: 'sub-englang',
    title: 'Sentence Transformation: No sooner... than',
    slug: 'sentence-transformation-no-sooner-than',
    problem_type: 'mcq',
    difficulty: 'medium',
    question_text: 'Choose the correct transformation for the sentence: "As soon as the teacher entered the classroom, the students stood up." using "No sooner... than".',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 120,
    tags: ['#sentence-transformation', '#grammar', '#english-language'],
    mcq_options: [
      { id: 'A', text: 'No sooner did the teacher enter the classroom than the students stood up.', isCorrect: true },
      { id: 'B', text: 'No sooner had the teacher entered the classroom when the students stood up.', isCorrect: false },
      { id: 'C', text: 'No sooner the teacher entered the classroom than the students stood up.', isCorrect: false },
      { id: 'D', text: 'No sooner did the teacher entered the classroom than the students stood up.', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2023,
    is_board_question: true,
    total_attempts: 1650,
    total_correct: 1120,
    xp_reward: 20,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // English Language - Sentence Synthesis - Brief Writing
  {
    id: 'prob-englang-2',
    chapter_id: 'ch-eng-1',
    subject_id: 'sub-englang',
    title: 'Synthesis of Sentences',
    slug: 'synthesis-of-sentences',
    problem_type: 'brief_writing',
    difficulty: 'hard',
    question_text: 'Combine the following sentences into one simple or complex sentence without using the conjunctions "and", "but", or "so":\n"The rain stopped. The children went out to play in the garden." Explain the rules of participle or nominative absolute construction you applied.',
    question_image_url: null,
    marks: 2,
    time_limit_seconds: 180,
    tags: ['#synthesis', '#sentence-structure', '#nominative-absolute'],
    mcq_options: null,
    expected_answer: 'Combined Sentence: "The rain having stopped, the children went out to play in the garden." or "When the rain stopped, the children went out to play in the garden."\nExplanation: This synthesis uses a Nominative Absolute construction ("The rain having stopped") or an adverbial clause of time ("When the rain stopped"). Since the subjects of both clauses are different (rain and children), the noun "rain" is placed before the participle "having stopped".',
    answer_keywords: ['Nominative Absolute', 'The rain having stopped', 'When the rain stopped', 'participle', 'different subjects'],
    min_words: 30,
    max_words: 200,
    icse_year: 2020,
    is_board_question: true,
    total_attempts: 740,
    total_correct: 380,
    xp_reward: 40,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Hindi - Idioms - MCQ
  {
    id: 'prob-hindi-1',
    chapter_id: 'ch-hin-1',
    subject_id: 'sub-hindi',
    title: 'Hindi Idiom: Angutha Dikhana',
    slug: 'hindi-idiom-angutha-dikhana',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'निम्नलिखित मुहावरे का सही अर्थ चुनिए: "अंगूठा दिखाना"',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#idioms', '#grammar', '#hindi'],
    mcq_options: [
      { id: 'A', text: 'ऐन वक्त पर मना करना या धोखा देना', isCorrect: true },
      { id: 'B', text: 'खुशामद करना', isCorrect: false },
      { id: 'C', text: 'क्रोधित होना', isCorrect: false },
      { id: 'D', text: 'बहुत आदर सत्कार करना', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2024,
    is_board_question: true,
    total_attempts: 1200,
    total_correct: 980,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Hindi - Samas - Brief Writing
  {
    id: 'prob-hindi-2',
    chapter_id: 'ch-hin-1',
    subject_id: 'sub-hindi',
    title: 'Hindi Samas Vigrah',
    slug: 'hindi-samas-vigrah',
    problem_type: 'brief_writing',
    difficulty: 'medium',
    question_text: 'निम्नलिखित शब्दों का समास-विग्रह करके समास का नाम बताइए:\n1. प्रतिदिन\n2. यथाशक्ति\n3. नीलकमल',
    question_image_url: null,
    marks: 3,
    time_limit_seconds: 180,
    tags: ['#samas', '#grammar', '#hindi-grammar'],
    mcq_options: null,
    expected_answer: '1. प्रतिदिन: दिन-दिन (अव्ययीभाव समास)\n2. यथाशक्ति: शक्ति के अनुसार (अव्ययीभाव समास)\n3. नीलकमल: नीला है जो कमल (कर्मधारय समास)',
    answer_keywords: ['अव्ययीभाव समास', 'दिन-दिन', 'शक्ति के अनुसार', 'कर्मधारय समास', 'नीला है जो कमल'],
    min_words: 25,
    max_words: 150,
    icse_year: 2022,
    is_board_question: true,
    total_attempts: 850,
    total_correct: 560,
    xp_reward: 30,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Mathematics - Matrices MCQ
  {
    id: 'prob-math-3',
    chapter_id: 'ch-math-3',
    subject_id: 'sub-math',
    title: 'Matrix Multiplication Compatibility',
    slug: 'matrix-multiplication-compatibility',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'If matrix A is of order 2×3 and matrix B is of order 3×4, what is the order of the product matrix AB?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#matrices', '#algebra', '#board-2024'],
    mcq_options: [
      { id: 'A', text: '2×4', isCorrect: true },
      { id: 'B', text: '3×3', isCorrect: false },
      { id: 'C', text: '3×4', isCorrect: false },
      { id: 'D', text: 'Product AB is not defined', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2024,
    is_board_question: true,
    total_attempts: 1200,
    total_correct: 980,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Mathematics - Trigonometry Heights & Distances Brief Writing
  {
    id: 'prob-math-4',
    chapter_id: 'ch-math-4',
    subject_id: 'sub-math',
    title: 'Height and Distance: Shadow of a Tower',
    slug: 'height-and-distance-shadow-tower',
    problem_type: 'brief_writing',
    difficulty: 'hard',
    question_text: "The shadow of a vertical tower on a level ground is found to be 40 m longer when the sun's altitude is 30° than when it is 60°. Find the height of the tower. Show step-by-step mathematical reasoning.",
    question_image_url: null,
    marks: 4,
    time_limit_seconds: 360,
    tags: ['#trigonometry', '#heights-and-distances', '#board-2022'],
    mcq_options: null,
    expected_answer: "Let h be the height of the tower. Let the shadow length be x when the altitude is 60°.\nIn the 60° triangle, tan(60°) = h / x => x = h / √3.\nIn the 30° triangle, tan(30°) = h / (x + 40) => 1 / √3 = h / (x + 40) => x + 40 = h√3.\nSubstitute x: h / √3 + 40 = h√3 => h + 40√3 = 3h => 2h = 40√3 => h = 20√3 m.\nWith √3 ≈ 1.732, h = 20 × 1.732 = 34.64 m.",
    answer_keywords: ['tower height', 'tan(60)', 'tan(30)', '20√3', '34.64 m', 'altitude'],
    min_words: 40,
    max_words: 250,
    icse_year: 2022,
    is_board_question: true,
    total_attempts: 710,
    total_correct: 320,
    xp_reward: 50,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Physics - Sound MCQ
  {
    id: 'prob-phy-3',
    chapter_id: 'ch-phy-3',
    subject_id: 'sub-phy',
    title: 'Echo Minimum Distance Calculation',
    slug: 'echo-minimum-distance-calculation',
    problem_type: 'mcq',
    difficulty: 'medium',
    question_text: 'What is the minimum distance in air required between the source of sound and the obstacle to hear a distinct echo? (Take speed of sound in air as 340 m/s)',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#sound', '#echo', '#board-2023'],
    mcq_options: [
      { id: 'A', text: '17 m', isCorrect: true },
      { id: 'B', text: '34 m', isCorrect: false },
      { id: 'C', text: '8.5 m', isCorrect: false },
      { id: 'D', text: '170 m', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2023,
    is_board_question: true,
    total_attempts: 1450,
    total_correct: 1120,
    xp_reward: 20,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Chemistry - Acids, Bases & Salts Brief Writing
  {
    id: 'prob-che-3',
    chapter_id: 'ch-che-3',
    subject_id: 'sub-che',
    title: 'Action of Heat on Copper Carbonate',
    slug: 'action-heat-copper-carbonate',
    problem_type: 'brief_writing',
    difficulty: 'medium',
    question_text: 'Describe what you observe when green copper carbonate (CuCO₃) is heated in a dry test tube. State the chemical equation for the reaction and describe the test to identify the gas evolved.',
    question_image_url: null,
    marks: 3,
    time_limit_seconds: 180,
    tags: ['#acids-bases-salts', '#chemical-reactions', '#board-2021'],
    mcq_options: null,
    expected_answer: 'Observation: The green powder of copper carbonate decomposes to form a black residue of copper oxide (CuO). A colorless, odorless gas is evolved.\nEquation: CuCO₃ (heat) → CuO + CO₂↑.\nGas Test: When the gas is passed through freshly prepared limewater (calcium hydroxide solution), it turns the limewater milky/turbid due to the formation of calcium carbonate precipitate.',
    answer_keywords: ['black residue', 'copper oxide', 'limewater milky', 'carbon dioxide', 'CuCO3 -> CuO + CO2'],
    min_words: 35,
    max_words: 200,
    icse_year: 2021,
    is_board_question: true,
    total_attempts: 980,
    total_correct: 720,
    xp_reward: 30,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Biology - Photosynthesis MCQ
  {
    id: 'prob-bio-3',
    chapter_id: 'ch-bio-3',
    subject_id: 'sub-bio',
    title: 'Photolysis of Water Location',
    slug: 'photolysis-water-location',
    problem_type: 'mcq',
    difficulty: 'easy',
    question_text: 'Where does the photolysis of water occur during the light-dependent phase of photosynthesis?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#photosynthesis', '#plant-physiology', '#board-2024'],
    mcq_options: [
      { id: 'A', text: 'Grana of the chloroplast', isCorrect: true },
      { id: 'B', text: 'Stroma of the chloroplast', isCorrect: false },
      { id: 'C', text: 'Mitochondrial matrix', isCorrect: false },
      { id: 'D', text: 'Cytoplasm', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2024,
    is_board_question: true,
    total_attempts: 1890,
    total_correct: 1560,
    xp_reward: 10,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Computer Applications - String Handling Brief Writing
  {
    id: 'prob-comp-3',
    chapter_id: 'ch-comp-3',
    subject_id: 'sub-comp',
    title: 'Java String countUppercaseCharacters Method',
    slug: 'java-string-count-uppercase',
    problem_type: 'brief_writing',
    difficulty: 'medium',
    question_text: 'Write a short Java code snippet or method that takes a String parameter and returns the count of uppercase characters present in it. Explain your approach briefly.',
    question_image_url: null,
    marks: 3,
    time_limit_seconds: 180,
    tags: ['#java-strings', '#loops', '#board-2023'],
    mcq_options: null,
    expected_answer: 'Approach: Loop through each character of the string, check if the character is an uppercase letter using Character.isUpperCase(ch), and increment a counter if true.\nCode:\npublic int countUpper(String str) {\n    int count = 0;\n    for(int i = 0; i < str.length(); i++) {\n        if(Character.isUpperCase(str.charAt(i))) {\n            count++;\n        }\n    }\n    return count;\n}',
    answer_keywords: ['Character.isUpperCase', 'str.charAt(i)', 'str.length()', 'loop', 'counter'],
    min_words: 30,
    max_words: 200,
    icse_year: 2023,
    is_board_question: true,
    total_attempts: 1100,
    total_correct: 850,
    xp_reward: 30,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // History & Civics - First War of Independence Brief Writing
  {
    id: 'prob-his-2',
    chapter_id: 'ch-his-2',
    subject_id: 'sub-his',
    title: 'Political Causes of the Revolt of 1857',
    slug: 'political-causes-revolt-1857',
    problem_type: 'brief_writing',
    difficulty: 'hard',
    question_text: 'Analyze two major political causes that led to the outbreak of the First War of Independence in 1857 under the British East India Company.',
    question_image_url: null,
    marks: 4,
    time_limit_seconds: 300,
    tags: ['#revolt-1857', '#history', '#board-2022'],
    mcq_options: null,
    expected_answer: "1. Doctrine of Lapse: Introduced by Lord Dalhousie, it stated that if an Indian ruler of a dependent state died without a natural male heir, his state would lapse or be annexed by the British (e.g., Jhansi, Satara, Nagpur).\n2. Annexation of Awadh: Annexed in 1856 on the false grounds of 'maladministration' or misgovernment, which caused widespread resentment among the general public and the sepoys, many of whom came from Awadh.",
    answer_keywords: ['Doctrine of Lapse', 'Lord Dalhousie', 'Annexation of Awadh', 'maladministration', 'Jhansi', 'ruler without male heir'],
    min_words: 45,
    max_words: 250,
    icse_year: 2022,
    is_board_question: true,
    total_attempts: 840,
    total_correct: 430,
    xp_reward: 40,
    created_at: new Date().toISOString(),
    is_active: true
  },
  // Geography - Soils MCQ
  {
    id: 'prob-geo-2',
    chapter_id: 'ch-geo-2',
    subject_id: 'sub-geo',
    title: 'Laterite Soil Leaching Process',
    slug: 'laterite-soil-leaching-process',
    problem_type: 'mcq',
    difficulty: 'medium',
    question_text: 'Laterite soil is formed as a result of which of the following weathering processes that washes away silica and nutrients under heavy rainfall?',
    question_image_url: null,
    marks: 1,
    time_limit_seconds: 90,
    tags: ['#soils', '#leaching', '#board-2023'],
    mcq_options: [
      { id: 'A', text: 'Leaching', isCorrect: true },
      { id: 'B', text: 'Hydration', isCorrect: false },
      { id: 'C', text: 'Carbonation', isCorrect: false },
      { id: 'D', text: 'Oxidation', isCorrect: false }
    ],
    expected_answer: null,
    answer_keywords: null,
    min_words: null,
    max_words: null,
    icse_year: 2023,
    is_board_question: true,
    total_attempts: 1300,
    total_correct: 910,
    xp_reward: 15,
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
  { id: 'ach-biology-buff', slug: 'biology-buff', name: 'Biology Buff', description: 'Solve 3 Biology questions correctly', icon: '🧬', xp_bonus: 100, condition_type: 'subject_solved_count', condition_value: 3 },
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
        if (ach.slug === 'physics-prodigy') targetSubjectId = 'sub-phy';
        else if (ach.slug === 'chemistry-whiz') targetSubjectId = 'sub-che';
        else if (ach.slug === 'computer-applications') targetSubjectId = 'sub-comp';
        else if (ach.slug === 'english-scholar') targetSubjectId = 'sub-englit';
        else if (ach.slug === 'biology-buff') targetSubjectId = 'sub-bio';

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

  submitAnswers: (
    submissionsPayloads: {
      problemId: string;
      payload: {
        selectedOptionId?: string;
        answerText?: string;
        isCorrect: boolean;
        aiScore?: number;
        aiFeedback?: string;
        timeTakenSeconds: number;
      };
    }[]
  ): {
    submissions: Submission[];
    xpEarned: number;
    newProfile: Profile;
    achievementsUnlocked: Achievement[];
  } => {
    const profile = clientDb.getProfile();
    const submissions = clientDb.getSubmissions();
    const userAchievements = clientDb.getUserAchievements();

    let totalXpEarned = 0;
    const newSubmissionsList: Submission[] = [];
    
    // We will build a set of already solved problem IDs before this batch, to check firstTime solves correctly
    const solvedBeforeSet = new Set(
      submissions.filter(s => s.is_correct).map(s => s.problem_id)
    );

    // Track newly solved problem IDs within this batch
    const newlySolvedInBatch = new Set<string>();

    for (const item of submissionsPayloads) {
      const problem = MOCK_PROBLEMS.find(p => p.id === item.problemId);
      if (!problem) continue;

      let xpEarned = problem.xp_reward;
      if (problem.problem_type === 'brief_writing' && item.payload.aiScore !== undefined) {
        xpEarned = Math.round((problem.xp_reward * item.payload.aiScore) / 10);
        if (item.payload.aiScore >= 9) xpEarned += 10;
      } else if (problem.problem_type === 'mcq' && !item.payload.isCorrect) {
        xpEarned = 0;
      }

      // Check if solved before or earlier in this batch
      const isFirstTime = !solvedBeforeSet.has(item.problemId) && !newlySolvedInBatch.has(item.problemId);
      if (isFirstTime && item.payload.isCorrect) {
        xpEarned += 5;
        newlySolvedInBatch.add(item.problemId);
      }

      const dailyChallengeId = typeof window !== 'undefined' ? localStorage.getItem('preparena_daily_challenge_id') : null;
      const isDailyChallenge = item.problemId === dailyChallengeId;
      const xpMultiplier = isDailyChallenge ? 2 : 1;
      xpEarned = xpEarned * xpMultiplier;

      totalXpEarned += xpEarned;

      const submission: Submission = {
        id: `sub-${Math.random().toString(36).substr(2, 9)}`,
        user_id: profile.id,
        problem_id: item.problemId,
        answer_text: item.payload.answerText || null,
        selected_option_id: item.payload.selectedOptionId || null,
        is_correct: item.payload.isCorrect,
        ai_score: item.payload.aiScore || null,
        ai_feedback: item.payload.aiFeedback || null,
        time_taken_seconds: item.payload.timeTakenSeconds,
        xp_earned: xpEarned,
        submitted_at: new Date().toISOString()
      };
      newSubmissionsList.push(submission);
    }

    // Combine old submissions with new ones
    const combinedSubmissions = [...newSubmissionsList, ...submissions];
    clientDb.saveSubmissions(combinedSubmissions);

    // Update Profile Stats
    const uniqueSolvedCount = new Set(
      combinedSubmissions.filter(s => s.is_correct).map(s => s.problem_id)
    ).size;

    const uniqueAttemptedCount = new Set(
      combinedSubmissions.map(s => s.problem_id)
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
        newStreak = 1;
      }
    }

    const newProfile: Profile = {
      ...profile,
      xp: profile.xp + totalXpEarned,
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
        const mcqSolved = combinedSubmissions.filter(s => {
          const p = MOCK_PROBLEMS.find(prob => prob.id === s.problem_id);
          return p && p.problem_type === 'mcq' && s.is_correct;
        }).length;
        meetsCondition = mcqSolved >= ach.condition_value;
      } else if (ach.condition_type === 'solved_count') {
        meetsCondition = uniqueSolvedCount >= ach.condition_value;
      } else if (ach.condition_type === 'streak') {
        meetsCondition = newStreak >= ach.condition_value;
      } else if (ach.condition_type === 'subject_solved_count') {
        let targetSubjectId = '';
        if (ach.slug === 'physics-prodigy') targetSubjectId = 'sub-phy';
        else if (ach.slug === 'chemistry-whiz') targetSubjectId = 'sub-che';
        else if (ach.slug === 'computer-applications') targetSubjectId = 'sub-comp';
        else if (ach.slug === 'english-scholar') targetSubjectId = 'sub-englit';
        else if (ach.slug === 'biology-buff') targetSubjectId = 'sub-bio';

        const solvedCountForSubject = combinedSubmissions.filter(s => {
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
      const bonusXP = achievementsUnlocked.reduce((sum, a) => sum + a.xp_bonus, 0);
      newProfile.xp += bonusXP;
      clientDb.saveProfile(newProfile);
      clientDb.saveUserAchievements(userAchievements);
    }

    return { submissions: newSubmissionsList, xpEarned: totalXpEarned, newProfile, achievementsUnlocked };
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
        else if (ch.id === 'ch-math-3') ch.topics = ['Matrix order & elements', 'Matrix addition & subtraction', 'Matrix multiplication compatibilities', 'Solving matrix equations'];
        else if (ch.id === 'ch-math-4') ch.topics = ['Trigonometric identities proof', 'Angle of elevation & depression', 'Heights & distances word problems'];
        else if (ch.id === 'ch-phy-1') ch.topics = ['Turning effect of force', 'Center of gravity', 'Uniform circular motion'];
        else if (ch.id === 'ch-phy-3') ch.topics = ['Sound reflection & Echoes', 'Echo minimum distance calculations', 'Natural, forced and resonant vibrations'];
        else if (ch.id === 'ch-che-1') ch.topics = ['Periodic trends', 'Ionization potential', 'Electronegativity'];
        else if (ch.id === 'ch-che-3') ch.topics = ['pH scale significance', 'Acids, bases properties', 'Salt preparation methods', 'Thermal decomposition of salts'];
        else if (ch.id === 'ch-bio-3') ch.topics = ['Light reaction & Photolysis', 'Dark reaction & Carbon fixation', 'Photosynthesis limiting factors'];
        else if (ch.id === 'ch-comp-3') ch.topics = ['String class methods', 'Substring & concatenation', 'Comparing Strings', 'Character wrapper checks'];
        else if (ch.id === 'ch-his-2') ch.topics = ['Doctrine of Lapse', 'Annexation of Awadh', 'Immediate cause & cartridge incident', 'Consequences of the Revolt'];
        else if (ch.id === 'ch-geo-2') ch.topics = ['Soil erosion & conservation', 'Laterite soil leaching process', 'Black soil moisture retention', 'Alluvial soil composition'];
        else ch.topics = ['Introduction & Basics', 'Key concepts', 'Example applications'];
      }
      return ch;
    });
  },

  saveChapters: (chapters: Chapter[]): void => {
    setLocalStorageData('preparena_chapters', chapters);
  }
};
