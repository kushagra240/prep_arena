export interface Formula {
  id: string;
  subject: string;           // 'mathematics' | 'physics' | 'chemistry' | 'biology'
  chapter: string;
  title: string;             // e.g. "Area of a Circle"
  formula: string;           // LaTeX string e.g. "A = \\pi r^2"
  variables: { symbol: string; meaning: string }[];
  example?: string;          // worked example in plain text
  tags: string[];
}

export const FORMULA_DATABASE: Formula[] = [
  // ================= MATHEMATICS =================
  // Algebra
  {
    id: "math-quad-1",
    subject: "mathematics",
    chapter: "Algebra (Quadratic Equations)",
    title: "Quadratic Formula",
    formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    variables: [
      { symbol: "x", meaning: "Roots of the quadratic equation" },
      { symbol: "a", meaning: "Coefficient of x^2" },
      { symbol: "b", meaning: "Coefficient of x" },
      { symbol: "c", meaning: "Constant term" }
    ],
    example: "For 2x^2 - 5x + 3 = 0, a=2, b=-5, c=3. x = (5 ± √((-5)^2 - 4(2)(3))) / (2(2)) = (5 ± √(25-24)) / 4 = (5 ± 1)/4. Roots are 1.5 and 1.",
    tags: ["quadratic", "roots", "algebra"]
  },
  {
    id: "math-quad-2",
    subject: "mathematics",
    chapter: "Algebra (Quadratic Equations)",
    title: "Discriminant",
    formula: "D = b^2 - 4ac",
    variables: [
      { symbol: "D", meaning: "Discriminant which determines nature of roots" },
      { symbol: "a", meaning: "Coefficient of x^2" },
      { symbol: "b", meaning: "Coefficient of x" },
      { symbol: "c", meaning: "Constant term" }
    ],
    example: "For x^2 - 4x + 4 = 0, D = (-4)^2 - 4(1)(4) = 16 - 16 = 0. The roots are real and equal.",
    tags: ["discriminant", "roots", "algebra"]
  },
  {
    id: "math-quad-3",
    subject: "mathematics",
    chapter: "Algebra (Quadratic Equations)",
    title: "Discriminant Condition: Real & Distinct Roots",
    formula: "D > 0 \\implies b^2 - 4ac > 0",
    variables: [
      { symbol: "D", meaning: "Discriminant" }
    ],
    example: "For x^2 - 5x + 6 = 0, D = 25 - 24 = 1 > 0. Roots are real and distinct (2 and 3).",
    tags: ["discriminant", "nature of roots"]
  },
  {
    id: "math-quad-4",
    subject: "mathematics",
    chapter: "Algebra (Quadratic Equations)",
    title: "Discriminant Condition: Real & Equal Roots",
    formula: "D = 0 \\implies b^2 - 4ac = 0",
    variables: [
      { symbol: "D", meaning: "Discriminant" }
    ],
    example: "For x^2 - 6x + 9 = 0, D = 36 - 36 = 0. Roots are real and equal (3 and 3).",
    tags: ["discriminant", "nature of roots"]
  },
  {
    id: "math-quad-5",
    subject: "mathematics",
    chapter: "Algebra (Quadratic Equations)",
    title: "Discriminant Condition: Imaginary Roots",
    formula: "D < 0 \\implies b^2 - 4ac < 0",
    variables: [
      { symbol: "D", meaning: "Discriminant" }
    ],
    example: "For x^2 + x + 1 = 0, D = 1^2 - 4(1)(1) = -3 < 0. The roots are imaginary/not real.",
    tags: ["discriminant", "nature of roots"]
  },
  {
    id: "math-quad-6",
    subject: "mathematics",
    chapter: "Algebra (Quadratic Equations)",
    title: "Sum of Roots",
    formula: "\\alpha + \\beta = -\\frac{b}{a}",
    variables: [
      { symbol: "\\alpha, \\beta", meaning: "Roots of the quadratic equation" },
      { symbol: "a", meaning: "Coefficient of x^2" },
      { symbol: "b", meaning: "Coefficient of x" }
    ],
    example: "For 3x^2 - 9x + 5 = 0, sum of roots = -(-9)/3 = 3.",
    tags: ["roots", "sum", "algebra"]
  },
  {
    id: "math-quad-7",
    subject: "mathematics",
    chapter: "Algebra (Quadratic Equations)",
    title: "Product of Roots",
    formula: "\\alpha \\cdot \\beta = \\frac{c}{a}",
    variables: [
      { symbol: "\\alpha, \\beta", meaning: "Roots of the quadratic equation" },
      { symbol: "a", meaning: "Coefficient of x^2" },
      { symbol: "c", meaning: "Constant term" }
    ],
    example: "For 3x^2 - 9x + 5 = 0, product of roots = 5/3.",
    tags: ["roots", "product", "algebra"]
  },
  // Coordinate Geometry
  {
    id: "math-coord-1",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Distance Formula",
    formula: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
    variables: [
      { symbol: "d", meaning: "Distance between the two points" },
      { symbol: "x_1, y_1", meaning: "Coordinates of the first point" },
      { symbol: "x_2, y_2", meaning: "Coordinates of the second point" }
    ],
    example: "Distance between (1, 2) and (4, 6) is √((4-1)^2 + (6-2)^2) = √(9 + 16) = √25 = 5.",
    tags: ["distance", "coordinate", "geometry"]
  },
  {
    id: "math-coord-2",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Section Formula (Internal)",
    formula: "P(x, y) = \\left( \\frac{mx_2 + nx_1}{m + n}, \\frac{my_2 + ny_1}{m + n} \\right)",
    variables: [
      { symbol: "P(x, y)", meaning: "Coordinates of dividing point" },
      { symbol: "x_1, y_1", meaning: "First point coordinates" },
      { symbol: "x_2, y_2", meaning: "Second point coordinates" },
      { symbol: "m : n", meaning: "Ratio in which point divides the line internally" }
    ],
    example: "Point dividing (1,2) and (4,6) in ratio 2:1 internally is ((2*4 + 1*1)/(2+1), (2*6 + 1*2)/(2+1)) = (9/3, 14/3) = (3, 4.67).",
    tags: ["section", "ratio", "internal division"]
  },
  {
    id: "math-coord-3",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Section Formula (External)",
    formula: "P(x, y) = \\left( \\frac{mx_2 - nx_1}{m - n}, \\frac{my_2 - ny_1}{m - n} \\right)",
    variables: [
      { symbol: "P(x, y)", meaning: "Coordinates of dividing point" },
      { symbol: "x_1, y_1", meaning: "First point coordinates" },
      { symbol: "x_2, y_2", meaning: "Second point coordinates" },
      { symbol: "m : n", meaning: "Ratio in which point divides the line externally" }
    ],
    example: "If ratio is 2:1, dividing externally: ((2*4 - 1*1)/(2-1), (2*6 - 1*2)/(2-1)) = (7, 10).",
    tags: ["section", "ratio", "external division"]
  },
  {
    id: "math-coord-4",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Midpoint Formula",
    formula: "M(x, y) = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)",
    variables: [
      { symbol: "M(x, y)", meaning: "Midpoint coordinates" },
      { symbol: "x_1, y_1", meaning: "First point coordinates" },
      { symbol: "x_2, y_2", meaning: "Second point coordinates" }
    ],
    example: "Midpoint between (2, 8) and (6, 4) is ((2+6)/2, (8+4)/2) = (4, 6).",
    tags: ["midpoint", "average", "coordinate"]
  },
  {
    id: "math-coord-5",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Centroid of a Triangle",
    formula: "G(x, y) = \\left( \\frac{x_1 + x_2 + x_3}{3}, \\frac{y_1 + y_2 + y_3}{3} \\right)",
    variables: [
      { symbol: "G(x, y)", meaning: "Centroid coordinates" },
      { symbol: "x_1, y_1", meaning: "Vertex A coordinates" },
      { symbol: "x_2, y_2", meaning: "Vertex B coordinates" },
      { symbol: "x_3, y_3", meaning: "Vertex C coordinates" }
    ],
    example: "Centroid of A(1, 2), B(3, 4), C(5, 9) is ((1+3+5)/3, (2+4+9)/3) = (3, 5).",
    tags: ["centroid", "triangle", "geometry"]
  },
  {
    id: "math-coord-6",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Slope of a Line (Two Points)",
    formula: "m = \\frac{y_2 - y_1}{x_2 - x_1}",
    variables: [
      { symbol: "m", meaning: "Slope or gradient of the line" },
      { symbol: "x_1, y_1", meaning: "Coordinates of first point" },
      { symbol: "x_2, y_2", meaning: "Coordinates of second point" }
    ],
    example: "Slope of line passing through (1, 2) and (3, 6) is (6-2)/(3-1) = 4/2 = 2.",
    tags: ["slope", "gradient", "line"]
  },
  {
    id: "math-coord-7",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Slope of a Line (Angle)",
    formula: "m = \\tan \\theta",
    variables: [
      { symbol: "m", meaning: "Slope" },
      { symbol: "\\theta", meaning: "Angle of inclination made with positive x-axis" }
    ],
    example: "If a line is inclined at 45° to the positive x-axis, its slope m = tan 45° = 1.",
    tags: ["slope", "angle", "tangent"]
  },
  {
    id: "math-coord-8",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Equation of a Line (Slope-Intercept Form)",
    formula: "y = mx + c",
    variables: [
      { symbol: "m", meaning: "Slope of the line" },
      { symbol: "c", meaning: "y-intercept of the line" }
    ],
    example: "Line with slope 3 and y-intercept -2 is y = 3x - 2.",
    tags: ["equation of line", "slope", "intercept"]
  },
  {
    id: "math-coord-9",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Equation of a Line (Point-Slope Form)",
    formula: "y - y_1 = m(x - x_1)",
    variables: [
      { symbol: "m", meaning: "Slope of the line" },
      { symbol: "x_1, y_1", meaning: "Coordinates of the given point" }
    ],
    example: "Line passing through (2, 3) with slope 4 is y - 3 = 4(x - 2) => y = 4x - 5.",
    tags: ["equation of line", "point-slope"]
  },
  {
    id: "math-coord-10",
    subject: "mathematics",
    chapter: "Coordinate Geometry",
    title: "Area of a Triangle (Coordinate)",
    formula: "Area = \\frac{1}{2} |x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|",
    variables: [
      { symbol: "x_1, y_1", meaning: "Vertex A" },
      { symbol: "x_2, y_2", meaning: "Vertex B" },
      { symbol: "x_3, y_3", meaning: "Vertex C" }
    ],
    example: "Area of triangle with vertices (0,0), (4,0), (0,3) is 0.5 * |0(0-3) + 4(3-0) + 0(0-0)| = 6.",
    tags: ["area", "triangle", "geometry"]
  },
  // AP/GP
  {
    id: "math-apgp-1",
    subject: "mathematics",
    chapter: "AP & GP",
    title: "AP: nth Term",
    formula: "a_n = a + (n - 1)d",
    variables: [
      { symbol: "a_n", meaning: "nth term of the Arithmetic Progression" },
      { symbol: "a", meaning: "First term" },
      { symbol: "n", meaning: "Number of terms" },
      { symbol: "d", meaning: "Common difference" }
    ],
    example: "In AP 2, 5, 8..., 10th term a_10 = 2 + (10-1)*3 = 2 + 27 = 29.",
    tags: ["AP", "arithmetic progression", "sequence"]
  },
  {
    id: "math-apgp-2",
    subject: "mathematics",
    chapter: "AP & GP",
    title: "AP: Sum of n Terms (General)",
    formula: "S_n = \\frac{n}{2} [2a + (n - 1)d]",
    variables: [
      { symbol: "S_n", meaning: "Sum of first n terms" },
      { symbol: "a", meaning: "First term" },
      { symbol: "d", meaning: "Common difference" },
      { symbol: "n", meaning: "Number of terms" }
    ],
    example: "Sum of first 10 terms of AP 2, 5, 8... is S_10 = 10/2 * (2(2) + 9(3)) = 5 * (4 + 27) = 155.",
    tags: ["AP", "sum", "sequence"]
  },
  {
    id: "math-apgp-3",
    subject: "mathematics",
    chapter: "AP & GP",
    title: "AP: Sum of n Terms (Last Term)",
    formula: "S_n = \\frac{n}{2} [a + l]",
    variables: [
      { symbol: "S_n", meaning: "Sum of first n terms" },
      { symbol: "a", meaning: "First term" },
      { symbol: "l", meaning: "Last term (nth term)" },
      { symbol: "n", meaning: "Number of terms" }
    ],
    example: "Sum of AP with 10 terms, first term 2 and last term 29 is S_10 = 10/2 * (2 + 29) = 5 * 31 = 155.",
    tags: ["AP", "sum", "last term"]
  },
  {
    id: "math-apgp-4",
    subject: "mathematics",
    chapter: "AP & GP",
    title: "GP: nth Term",
    formula: "a_n = a r^{n-1}",
    variables: [
      { symbol: "a_n", meaning: "nth term of the Geometric Progression" },
      { symbol: "a", meaning: "First term" },
      { symbol: "r", meaning: "Common ratio" },
      { symbol: "n", meaning: "Term index" }
    ],
    example: "In GP 2, 6, 18..., 5th term is a_5 = 2 * 3^(5-1) = 2 * 81 = 162.",
    tags: ["GP", "geometric progression", "sequence"]
  },
  {
    id: "math-apgp-5",
    subject: "mathematics",
    chapter: "AP & GP",
    title: "GP: Sum of n Terms (r > 1)",
    formula: "S_n = \\frac{a(r^n - 1)}{r - 1}",
    variables: [
      { symbol: "S_n", meaning: "Sum of first n terms" },
      { symbol: "a", meaning: "First term" },
      { symbol: "r", meaning: "Common ratio (where r > 1)" },
      { symbol: "n", meaning: "Number of terms" }
    ],
    example: "Sum of first 4 terms of GP 2, 6, 18, 54 (r=3) is S_4 = 2(3^4 - 1)/(3 - 1) = 2(81-1)/2 = 80.",
    tags: ["GP", "sum", "geometric"]
  },
  {
    id: "math-apgp-6",
    subject: "mathematics",
    chapter: "AP & GP",
    title: "GP: Sum of n Terms (r < 1)",
    formula: "S_n = \\frac{a(1 - r^n)}{1 - r}",
    variables: [
      { symbol: "S_n", meaning: "Sum of first n terms" },
      { symbol: "a", meaning: "First term" },
      { symbol: "r", meaning: "Common ratio (where r < 1)" },
      { symbol: "n", meaning: "Number of terms" }
    ],
    example: "Sum of GP 10, 5, 2.5... for 3 terms (r=0.5) is S_3 = 10(1 - 0.5^3)/(1-0.5) = 10(1 - 0.125)/0.5 = 20 * 0.875 = 17.5.",
    tags: ["GP", "sum", "geometric"]
  },
  // Trigonometry
  {
    id: "math-trig-1",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Identity: Sine-Cosine relation",
    formula: "\\sin^2 \\theta + \\cos^2 \\theta = 1",
    variables: [
      { symbol: "\\theta", meaning: "Angle of interest" }
    ],
    example: "If sin θ = 3/5, then cos^2 θ = 1 - 9/25 = 16/25 => cos θ = 4/5.",
    tags: ["trigonometry", "identities"]
  },
  {
    id: "math-trig-2",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Identity: Secant-Tangent relation",
    formula: "1 + \\tan^2 \\theta = \\sec^2 \\theta",
    variables: [
      { symbol: "\\theta", meaning: "Angle of interest" }
    ],
    example: "If tan θ = 1, then sec^2 θ = 1 + 1 = 2 => sec θ = √2.",
    tags: ["trigonometry", "identities"]
  },
  {
    id: "math-trig-3",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Identity: Cosecant-Cotangent relation",
    formula: "1 + \\cot^2 \\theta = \\csc^2 \\theta",
    variables: [
      { symbol: "\\theta", meaning: "Angle of interest" }
    ],
    example: "If cot θ = √3, then csc^2 θ = 1 + 3 = 4 => csc θ = 2.",
    tags: ["trigonometry", "identities"]
  },
  {
    id: "math-trig-4",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Complementary Angles: Sine",
    formula: "\\sin(90^\\circ - \\theta) = \\cos \\theta",
    variables: [
      { symbol: "\\theta", meaning: "Angle of interest" }
    ],
    example: "sin(90° - 30°) = cos 30° = √3 / 2.",
    tags: ["trigonometry", "complementary"]
  },
  {
    id: "math-trig-5",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Complementary Angles: Cosine",
    formula: "\\cos(90^\\circ - \\theta) = \\sin \\theta",
    variables: [
      { symbol: "\\theta", meaning: "Angle of interest" }
    ],
    example: "cos(90° - 45°) = sin 45° = 1 / √2.",
    tags: ["trigonometry", "complementary"]
  },
  {
    id: "math-trig-6",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Complementary Angles: Tangent",
    formula: "\\tan(90^\\circ - \\theta) = \\cot \\theta",
    variables: [
      { symbol: "\\theta", meaning: "Angle of interest" }
    ],
    example: "tan(90° - 60°) = cot 60° = 1 / √3.",
    tags: ["trigonometry", "complementary"]
  },
  {
    id: "math-trig-7",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Standard Values: 0°",
    formula: "\\sin 0^\\circ = 0, \\quad \\cos 0^\\circ = 1, \\quad \\tan 0^\\circ = 0",
    variables: [],
    tags: ["trigonometry", "values", "standard angles"]
  },
  {
    id: "math-trig-8",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Standard Values: 30°",
    formula: "\\sin 30^\\circ = \\frac{1}{2}, \\quad \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}, \\quad \\tan 30^\\circ = \\frac{1}{\\sqrt{3}}",
    variables: [],
    tags: ["trigonometry", "values", "standard angles"]
  },
  {
    id: "math-trig-9",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Standard Values: 45°",
    formula: "\\sin 45^\\circ = \\frac{1}{\\sqrt{2}}, \\quad \\cos 45^\\circ = \\frac{1}{\\sqrt{2}}, \\quad \\tan 45^\\circ = 1",
    variables: [],
    tags: ["trigonometry", "values", "standard angles"]
  },
  {
    id: "math-trig-10",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Standard Values: 60°",
    formula: "\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}, \\quad \\cos 60^\\circ = \\frac{1}{2}, \\quad \\tan 60^\\circ = \\sqrt{3}",
    variables: [],
    tags: ["trigonometry", "values", "standard angles"]
  },
  {
    id: "math-trig-11",
    subject: "mathematics",
    chapter: "Trigonometry",
    title: "Standard Values: 90°",
    formula: "\\sin 90^\\circ = 1, \\quad \\cos 90^\\circ = 0, \\quad \\tan 90^\\circ = \\infty \\text{ (Undefined)}",
    variables: [],
    tags: ["trigonometry", "values", "standard angles"]
  },
  // Mensuration
  {
    id: "math-mens-1",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Cylinder: Curved Surface Area (CSA)",
    formula: "CSA = 2\\pi rh",
    variables: [
      { symbol: "CSA", meaning: "Curved Surface Area of cylinder" },
      { symbol: "r", meaning: "Radius of circular base" },
      { symbol: "h", meaning: "Height of cylinder" }
    ],
    example: "Cylinder with r=7cm and h=10cm: CSA = 2 * 22/7 * 7 * 10 = 440 cm².",
    tags: ["mensuration", "cylinder", "area"]
  },
  {
    id: "math-mens-2",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Cylinder: Total Surface Area (TSA)",
    formula: "TSA = 2\\pi r(r + h)",
    variables: [
      { symbol: "TSA", meaning: "Total Surface Area of cylinder" },
      { symbol: "r", meaning: "Radius of circular base" },
      { symbol: "h", meaning: "Height of cylinder" }
    ],
    example: "Cylinder with r=7cm and h=10cm: TSA = 2 * 22/7 * 7 * (7+10) = 44 * 17 = 748 cm².",
    tags: ["mensuration", "cylinder", "area"]
  },
  {
    id: "math-mens-3",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Cylinder: Volume",
    formula: "V = \\pi r^2 h",
    variables: [
      { symbol: "V", meaning: "Volume of cylinder" },
      { symbol: "r", meaning: "Radius of circular base" },
      { symbol: "h", meaning: "Height of cylinder" }
    ],
    example: "Cylinder with r=7cm and h=10cm: V = 22/7 * 49 * 10 = 1540 cm³.",
    tags: ["mensuration", "cylinder", "volume"]
  },
  {
    id: "math-mens-4",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Cone: Slant Height",
    formula: "l = \\sqrt{r^2 + h^2}",
    variables: [
      { symbol: "l", meaning: "Slant height of cone" },
      { symbol: "r", meaning: "Radius of base" },
      { symbol: "h", meaning: "Height of cone" }
    ],
    example: "Cone with r=3cm and h=4cm: l = √(9 + 16) = 5 cm.",
    tags: ["mensuration", "cone", "length"]
  },
  {
    id: "math-mens-5",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Cone: Curved Surface Area (CSA)",
    formula: "CSA = \\pi rl",
    variables: [
      { symbol: "CSA", meaning: "Curved Surface Area of cone" },
      { symbol: "r", meaning: "Radius of circular base" },
      { symbol: "l", meaning: "Slant height" }
    ],
    example: "Cone with r=7cm and l=10cm: CSA = 22/7 * 7 * 10 = 220 cm².",
    tags: ["mensuration", "cone", "area"]
  },
  {
    id: "math-mens-6",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Cone: Total Surface Area (TSA)",
    formula: "TSA = \\pi r(r + l)",
    variables: [
      { symbol: "TSA", meaning: "Total Surface Area of cone" },
      { symbol: "r", meaning: "Radius of base" },
      { symbol: "l", meaning: "Slant height" }
    ],
    example: "Cone with r=7cm and l=13cm: TSA = 22/7 * 7 * (7+13) = 22 * 20 = 440 cm².",
    tags: ["mensuration", "cone", "area"]
  },
  {
    id: "math-mens-7",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Cone: Volume",
    formula: "V = \\frac{1}{3}\\pi r^2 h",
    variables: [
      { symbol: "V", meaning: "Volume of cone" },
      { symbol: "r", meaning: "Radius of circular base" },
      { symbol: "h", meaning: "Height of cone" }
    ],
    example: "Cone with r=7cm and h=12cm: V = 1/3 * 22/7 * 49 * 12 = 616 cm³.",
    tags: ["mensuration", "cone", "volume"]
  },
  {
    id: "math-mens-8",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Sphere: Surface Area",
    formula: "A = 4\\pi r^2",
    variables: [
      { symbol: "A", meaning: "Total surface area of sphere" },
      { symbol: "r", meaning: "Radius of sphere" }
    ],
    example: "Sphere with r=7cm: Area = 4 * 22/7 * 49 = 616 cm².",
    tags: ["mensuration", "sphere", "area"]
  },
  {
    id: "math-mens-9",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Sphere: Volume",
    formula: "V = \\frac{4}{3}\\pi r^3",
    variables: [
      { symbol: "V", meaning: "Volume of sphere" },
      { symbol: "r", meaning: "Radius of sphere" }
    ],
    example: "Sphere with r=3cm: V = 4/3 * 22/7 * 27 = 113.14 cm³.",
    tags: ["mensuration", "sphere", "volume"]
  },
  {
    id: "math-mens-10",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Hemisphere: Curved Surface Area (CSA)",
    formula: "CSA = 2\\pi r^2",
    variables: [
      { symbol: "CSA", meaning: "Curved Surface Area of hemisphere" },
      { symbol: "r", meaning: "Radius" }
    ],
    example: "Hemisphere with r=7cm: CSA = 2 * 22/7 * 49 = 308 cm².",
    tags: ["mensuration", "hemisphere", "area"]
  },
  {
    id: "math-mens-11",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Hemisphere: Total Surface Area (TSA)",
    formula: "TSA = 3\\pi r^2",
    variables: [
      { symbol: "TSA", meaning: "Total Surface Area of solid hemisphere" },
      { symbol: "r", meaning: "Radius" }
    ],
    example: "Hemisphere with r=7cm: TSA = 3 * 22/7 * 49 = 462 cm².",
    tags: ["mensuration", "hemisphere", "area"]
  },
  {
    id: "math-mens-12",
    subject: "mathematics",
    chapter: "Mensuration",
    title: "Hemisphere: Volume",
    formula: "V = \\frac{2}{3}\\pi r^3",
    variables: [
      { symbol: "V", meaning: "Volume of hemisphere" },
      { symbol: "r", meaning: "Radius" }
    ],
    example: "Hemisphere with r=7cm: V = 2/3 * 22/7 * 343 = 718.67 cm³.",
    tags: ["mensuration", "hemisphere", "volume"]
  },
  // Statistics
  {
    id: "math-stats-1",
    subject: "mathematics",
    chapter: "Statistics",
    title: "Mean (Direct Method)",
    formula: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}",
    variables: [
      { symbol: "\\bar{x}", meaning: "Arithmetic Mean" },
      { symbol: "f_i", meaning: "Frequency of class i" },
      { symbol: "x_i", meaning: "Class mark/midpoint of class i" }
    ],
    example: "For values x=[10, 20] with f=[2, 3], mean = (10*2 + 20*3)/(2+3) = 80/5 = 16.",
    tags: ["statistics", "mean", "direct method"]
  },
  {
    id: "math-stats-2",
    subject: "mathematics",
    chapter: "Statistics",
    title: "Mean (Assumed Mean Method)",
    formula: "\\bar{x} = A + \\frac{\\sum f_i d_i}{\\sum f_i}",
    variables: [
      { symbol: "\\bar{x}", meaning: "Arithmetic Mean" },
      { symbol: "A", meaning: "Assumed mean (typically middle class mark)" },
      { symbol: "f_i", meaning: "Frequency of class i" },
      { symbol: "d_i", meaning: "Deviation = x_i - A" }
    ],
    example: "If A = 25, Σf_i d_i = 100, Σf_i = 20. Mean = 25 + (100/20) = 25 + 5 = 30.",
    tags: ["statistics", "mean", "assumed mean"]
  },
  {
    id: "math-stats-3",
    subject: "mathematics",
    chapter: "Statistics",
    title: "Mean (Step-Deviation Method)",
    formula: "\\bar{x} = A + h \\cdot \\left( \\frac{\\sum f_i u_i}{\\sum f_i} \\right)",
    variables: [
      { symbol: "\\bar{x}", meaning: "Arithmetic Mean" },
      { symbol: "A", meaning: "Assumed mean" },
      { symbol: "h", meaning: "Width of class interval" },
      { symbol: "f_i", meaning: "Frequency" },
      { symbol: "u_i", meaning: "Step-deviation = (x_i - A) / h" }
    ],
    example: "With A=25, h=10, Σf_i u_i=15, Σf_i=30. Mean = 25 + 10 * (15/30) = 25 + 5 = 30.",
    tags: ["statistics", "mean", "step deviation"]
  },
  {
    id: "math-stats-4",
    subject: "mathematics",
    chapter: "Statistics",
    title: "Median (Grouped Data)",
    formula: "\\text{Median} = l + \\left( \\frac{\\frac{N}{2} - CF}{f} \\right) \\cdot h",
    variables: [
      { symbol: "l", meaning: "Lower limit of median class" },
      { symbol: "N", meaning: "Total frequency = sum of all f" },
      { symbol: "CF", meaning: "Cumulative frequency of class preceding median class" },
      { symbol: "f", meaning: "Frequency of median class" },
      { symbol: "h", meaning: "Class width" }
    ],
    example: "For l=20, N=60, CF=22, f=15, h=10. Median = 20 + ((30 - 22)/15)*10 = 20 + 5.33 = 25.33.",
    tags: ["statistics", "median"]
  },
  {
    id: "math-stats-5",
    subject: "mathematics",
    chapter: "Statistics",
    title: "Mode (Grouped Data)",
    formula: "\\text{Mode} = l + \\left( \\frac{f_1 - f_0}{2f_1 - f_0 - f_2} \\right) \\cdot h",
    variables: [
      { symbol: "l", meaning: "Lower limit of modal class" },
      { symbol: "f_1", meaning: "Frequency of modal class (highest frequency)" },
      { symbol: "f_0", meaning: "Frequency of class preceding modal class" },
      { symbol: "f_2", meaning: "Frequency of class succeeding modal class" },
      { symbol: "h", meaning: "Class width" }
    ],
    example: "For l=15, f_1=10, f_0=6, f_2=8, h=5. Mode = 15 + ((10-6)/(20-6-8))*5 = 15 + (4/6)*5 = 18.33.",
    tags: ["statistics", "mode"]
  },
  // Probability
  {
    id: "math-prob-1",
    subject: "mathematics",
    chapter: "Probability",
    title: "Probability of an Event",
    formula: "P(E) = \\frac{\\text{Number of Favourable Outcomes}}{\\text{Total Number of Possible Outcomes}}",
    variables: [
      { symbol: "P(E)", meaning: "Probability that event E occurs" }
    ],
    example: "Rolling a die. P(even number) = 3 / 6 = 0.5.",
    tags: ["probability", "outcomes"]
  },

  // ================= PHYSICS =================
  // Force
  {
    id: "phys-force-1",
    subject: "physics",
    chapter: "Force & Motion",
    title: "Newton's Second Law",
    formula: "F = ma",
    variables: [
      { symbol: "F", meaning: "Force applied on body (Newtons)" },
      { symbol: "m", meaning: "Mass of the body" },
      { symbol: "a", meaning: "Acceleration produced" }
    ],
    example: "Force needed to accelerate a 5 kg mass at 2 m/s²: F = 5 * 2 = 10 N.",
    tags: ["force", "laws of motion"]
  },
  {
    id: "phys-force-2",
    subject: "physics",
    chapter: "Force & Motion",
    title: "Linear Momentum",
    formula: "p = mv",
    variables: [
      { symbol: "p", meaning: "Momentum (kg m/s)" },
      { symbol: "m", meaning: "Mass of the body" },
      { symbol: "v", meaning: "Velocity of the body" }
    ],
    example: "Momentum of a 2 kg ball moving at 10 m/s: p = 2 * 10 = 20 kg m/s.",
    tags: ["momentum", "velocity"]
  },
  {
    id: "phys-force-3",
    subject: "physics",
    chapter: "Force & Motion",
    title: "Impulse",
    formula: "J = F \\Delta t = \\Delta p",
    variables: [
      { symbol: "J", meaning: "Impulse of the force" },
      { symbol: "F", meaning: "Force applied" },
      { symbol: "\\Delta t", meaning: "Time duration for which force acts" },
      { symbol: "\\Delta p", meaning: "Change in linear momentum" }
    ],
    example: "A 50 N force acting for 0.1 s yields an impulse of 50 * 0.1 = 5 N s (or kg m/s).",
    tags: ["impulse", "force", "time"]
  },
  // Work, Energy & Power
  {
    id: "phys-wep-1",
    subject: "physics",
    chapter: "Work, Energy & Power",
    title: "Work Done",
    formula: "W = F s \\cos \\theta",
    variables: [
      { symbol: "W", meaning: "Work done (Joules)" },
      { symbol: "F", meaning: "Magnitude of force applied" },
      { symbol: "s", meaning: "Displacement of body" },
      { symbol: "\\theta", meaning: "Angle between direction of force and displacement" }
    ],
    example: "A force of 10 N displaces a body 5 m at an angle of 60°. W = 10 * 5 * cos 60° = 50 * 0.5 = 25 J.",
    tags: ["work", "force", "displacement"]
  },
  {
    id: "phys-wep-2",
    subject: "physics",
    chapter: "Work, Energy & Power",
    title: "Kinetic Energy",
    formula: "KE = \\frac{1}{2} m v^2",
    variables: [
      { symbol: "KE", meaning: "Kinetic Energy of body (Joules)" },
      { symbol: "m", meaning: "Mass of the body" },
      { symbol: "v", meaning: "Speed of the body" }
    ],
    example: "KE of a 4 kg object moving at 5 m/s: KE = 0.5 * 4 * 25 = 50 J.",
    tags: ["kinetic energy", "motion"]
  },
  {
    id: "phys-wep-3",
    subject: "physics",
    chapter: "Work, Energy & Power",
    title: "Gravitational Potential Energy",
    formula: "PE = mgh",
    variables: [
      { symbol: "PE", meaning: "Potential Energy (Joules)" },
      { symbol: "m", meaning: "Mass of the body" },
      { symbol: "g", meaning: "Acceleration due to gravity (9.8 m/s²)" },
      { symbol: "h", meaning: "Height above ground level" }
    ],
    example: "PE of a 2 kg block at a height of 5 m (g=10): PE = 2 * 10 * 5 = 100 J.",
    tags: ["potential energy", "gravity", "height"]
  },
  {
    id: "phys-wep-4",
    subject: "physics",
    chapter: "Work, Energy & Power",
    title: "Power",
    formula: "P = \\frac{W}{t} = F v",
    variables: [
      { symbol: "P", meaning: "Power generated (Watts)" },
      { symbol: "W", meaning: "Work done" },
      { symbol: "t", meaning: "Time taken" },
      { symbol: "F", meaning: "Force applied" },
      { symbol: "v", meaning: "Constant velocity" }
    ],
    example: "If a motor does 500 J of work in 10 s, Power P = 500 / 10 = 50 W.",
    tags: ["power", "work", "time"]
  },
  // Machines
  {
    id: "phys-mach-1",
    subject: "physics",
    chapter: "Machines",
    title: "Mechanical Advantage (MA)",
    formula: "MA = \\frac{L}{E}",
    variables: [
      { symbol: "MA", meaning: "Mechanical Advantage" },
      { symbol: "L", meaning: "Load (Force exerted by machine)" },
      { symbol: "E", meaning: "Effort (Force applied to machine)" }
    ],
    example: "If a machine lifts a load of 100 N using 25 N effort, MA = 100 / 25 = 4.",
    tags: ["MA", "load", "effort", "machines"]
  },
  {
    id: "phys-mach-2",
    subject: "physics",
    chapter: "Machines",
    title: "Velocity Ratio (VR)",
    formula: "VR = \\frac{d_E}{d_L}",
    variables: [
      { symbol: "VR", meaning: "Velocity Ratio" },
      { symbol: "d_E", meaning: "Distance moved by effort" },
      { symbol: "d_L", meaning: "Distance moved by load" }
    ],
    example: "If effort moves 4 m while load moves 1 m, VR = 4 / 1 = 4.",
    tags: ["VR", "effort distance", "load distance"]
  },
  {
    id: "phys-mach-3",
    subject: "physics",
    chapter: "Machines",
    title: "Efficiency of a Machine",
    formula: "\\eta = \\frac{MA}{VR} \\times 100\\%",
    variables: [
      { symbol: "\\eta", meaning: "Efficiency percent" },
      { symbol: "MA", meaning: "Mechanical Advantage" },
      { symbol: "VR", meaning: "Velocity Ratio" }
    ],
    example: "If MA = 3 and VR = 4, efficiency η = (3/4)*100 = 75%.",
    tags: ["efficiency", "MA", "VR"]
  },
  // Light
  {
    id: "phys-light-1",
    subject: "physics",
    chapter: "Light & Refraction",
    title: "Snell's Law (Refractive Index)",
    formula: "\\mu = \\frac{\\sin i}{\\sin r}",
    variables: [
      { symbol: "\\mu", meaning: "Refractive Index of second medium wrt first" },
      { symbol: "i", meaning: "Angle of incidence" },
      { symbol: "r", meaning: "Angle of refraction" }
    ],
    example: "Light entering water with i=45° and r=30°. μ = sin 45° / sin 30° = (1/√2) / (1/2) = √2 ≈ 1.41.",
    tags: ["refraction", "snells law", "optics"]
  },
  {
    id: "phys-light-2",
    subject: "physics",
    chapter: "Light & Refraction",
    title: "Lens Formula",
    formula: "\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}",
    variables: [
      { symbol: "f", meaning: "Focal length of lens" },
      { symbol: "v", meaning: "Image distance from optical center" },
      { symbol: "u", meaning: "Object distance from optical center" }
    ],
    example: "Convex lens with f=10cm, object u=-15cm. 1/v = 1/10 + 1/(-15) = 1/10 - 1/15 = 1/30. Image is formed at v=30cm.",
    tags: ["lens", "optics", "focal length"]
  },
  {
    id: "phys-light-3",
    subject: "physics",
    chapter: "Light & Refraction",
    title: "Linear Magnification",
    formula: "m = \\frac{v}{u}",
    variables: [
      { symbol: "m", meaning: "Linear magnification factor" },
      { symbol: "v", meaning: "Image distance" },
      { symbol: "u", meaning: "Object distance" }
    ],
    example: "If image forms at v=30cm for object at u=15cm, magnification m = 30 / 15 = 2 (real, inverted in lenses if signs applied).",
    tags: ["magnification", "optics"]
  },
  {
    id: "phys-light-4",
    subject: "physics",
    chapter: "Light & Refraction",
    title: "Power of a Lens",
    formula: "P = \\frac{1}{f \\text{ (in meters)}}",
    variables: [
      { symbol: "P", meaning: "Power of lens (Dioptres, D)" },
      { symbol: "f", meaning: "Focal length in meters" }
    ],
    example: "A lens with focal length f = 50 cm = 0.5 m has Power P = 1 / 0.5 = +2 D.",
    tags: ["power", "lens", "optics"]
  },
  // Electricity
  {
    id: "phys-elec-1",
    subject: "physics",
    chapter: "Current Electricity",
    title: "Ohm's Law",
    formula: "V = IR",
    variables: [
      { symbol: "V", meaning: "Potential difference across conductor (Volts)" },
      { symbol: "I", meaning: "Electric current flowing (Amperes)" },
      { symbol: "R", meaning: "Resistance of conductor (Ohms)" }
    ],
    example: "Current flowing through 5 Ω resistor connected to 10 V source: I = 10 / 5 = 2 A.",
    tags: ["ohms law", "resistance", "electricity"]
  },
  {
    id: "phys-elec-2",
    subject: "physics",
    chapter: "Current Electricity",
    title: "Equivalent Resistance (Series)",
    formula: "R_s = R_1 + R_2 + R_3",
    variables: [
      { symbol: "R_s", meaning: "Total resistance in series network" },
      { symbol: "R_1, R_2, R_3", meaning: "Individual resistances" }
    ],
    example: "Resistors of 2 Ω, 3 Ω, and 5 Ω in series. R_s = 2 + 3 + 5 = 10 Ω.",
    tags: ["series", "resistance", "circuits"]
  },
  {
    id: "phys-elec-3",
    subject: "physics",
    chapter: "Current Electricity",
    title: "Equivalent Resistance (Parallel)",
    formula: "\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}",
    variables: [
      { symbol: "R_p", meaning: "Total resistance in parallel network" },
      { symbol: "R_1, R_2, R_3", meaning: "Individual resistances" }
    ],
    example: "Resistors of 2 Ω, 3 Ω, and 6 Ω in parallel. 1/R_p = 1/2 + 1/3 + 1/6 = (3+2+1)/6 = 6/6 = 1. R_p = 1 Ω.",
    tags: ["parallel", "resistance", "circuits"]
  },
  {
    id: "phys-elec-4",
    subject: "physics",
    chapter: "Current Electricity",
    title: "Electric Power",
    formula: "P = VI = I^2 R = \\frac{V^2}{R}",
    variables: [
      { symbol: "P", meaning: "Power dissipated (Watts)" },
      { symbol: "V", meaning: "Potential difference" },
      { symbol: "I", meaning: "Electric current" },
      { symbol: "R", meaning: "Resistance" }
    ],
    example: "An appliance working at 220 V drawing 2 A current dissipates Power P = 220 * 2 = 440 W.",
    tags: ["power", "wattage", "electricity"]
  },
  // Sound
  {
    id: "phys-sound-1",
    subject: "physics",
    chapter: "Sound",
    title: "Wave Equation",
    formula: "v = f\\lambda",
    variables: [
      { symbol: "v", meaning: "Velocity of the wave" },
      { symbol: "f", meaning: "Frequency of wave" },
      { symbol: "\\lambda", meaning: "Wavelength of wave" }
    ],
    example: "Sound wave of frequency 500 Hz travelling in air at 340 m/s: Wavelength λ = 340 / 500 = 0.68 m.",
    tags: ["sound", "wave", "wavelength"]
  },
  {
    id: "phys-sound-2",
    subject: "physics",
    chapter: "Sound",
    title: "Frequency-Period relation",
    formula: "f = \\frac{1}{T}",
    variables: [
      { symbol: "f", meaning: "Frequency (Hz)" },
      { symbol: "T", meaning: "Time period of one oscillation (seconds)" }
    ],
    example: "If time period is 0.02 s, frequency f = 1 / 0.02 = 50 Hz.",
    tags: ["frequency", "time period", "sound"]
  },

  // ================= CHEMISTRY =================
  // Mole Concept
  {
    id: "chem-mole-1",
    subject: "chemistry",
    chapter: "Mole Concept",
    title: "Number of Moles",
    formula: "\\text{Moles } (n) = \\frac{\\text{Mass of substance (g)}}{\\text{Molar Mass (g/mol)}}",
    variables: [
      { symbol: "n", meaning: "Amount of substance in moles" }
    ],
    example: "Moles in 36g of Water (H2O, molar mass = 18g/mol): n = 36 / 18 = 2 moles.",
    tags: ["mole concept", "stoichiometry"]
  },
  {
    id: "chem-mole-2",
    subject: "chemistry",
    chapter: "Mole Concept",
    title: "Moles of Gas at STP",
    formula: "\\text{Moles } (n) = \\frac{\\text{Volume of gas at STP (L)}}{22.4 \\text{ L}}",
    variables: [
      { symbol: "n", meaning: "Number of moles" }
    ],
    example: "Moles in 11.2 Litres of CO2 gas at STP: n = 11.2 / 22.4 = 0.5 moles.",
    tags: ["mole concept", "gas laws", "STP"]
  },
  {
    id: "chem-mole-3",
    subject: "chemistry",
    chapter: "Mole Concept",
    title: "Avogadro's Number Relation",
    formula: "N = n \\times N_A",
    variables: [
      { symbol: "N", meaning: "Total number of particles (atoms/molecules)" },
      { symbol: "n", meaning: "Number of moles" },
      { symbol: "N_A", meaning: "Avogadro's Constant (6.022 \\times 10^{23} \\text{ particles/mol})" }
    ],
    example: "Number of molecules in 2 moles of O2: N = 2 * 6.022 * 10^23 = 1.2044 * 10^24 molecules.",
    tags: ["avogadros number", "particles"]
  },
  {
    id: "chem-mole-4",
    subject: "chemistry",
    chapter: "Mole Concept",
    title: "Vapor Density & Molecular Mass",
    formula: "\\text{Relative Molecular Mass} = 2 \\times \\text{Vapor Density}",
    variables: [],
    example: "If vapor density of gas is 22, its Relative Molecular Mass (RMM) = 2 * 22 = 44 g/mol (Carbon Dioxide).",
    tags: ["vapor density", "molecular mass"]
  },
  // Electrolysis
  {
    id: "chem-elec-1",
    subject: "chemistry",
    chapter: "Electrolysis",
    title: "Faraday's First Law",
    formula: "W = Z \\cdot I \\cdot t",
    variables: [
      { symbol: "W", meaning: "Mass of substance deposited (grams)" },
      { symbol: "Z", meaning: "Electrochemical Equivalent (ECE) of substance" },
      { symbol: "I", meaning: "Current passed in Amperes" },
      { symbol: "t", meaning: "Time in seconds" }
    ],
    example: "Mass deposited by 2A current passed for 965 seconds with Z = 0.000329 g/C: W = 0.000329 * 2 * 965 = 0.635 g.",
    tags: ["electrolysis", "faradays laws"]
  },
  {
    id: "chem-elec-2",
    subject: "chemistry",
    chapter: "Electrolysis",
    title: "Faraday's Second Law",
    formula: "\\frac{W_1}{W_2} = \\frac{E_1}{E_2}",
    variables: [
      { symbol: "W_1, W_2", meaning: "Masses of different substances liberated" },
      { symbol: "E_1, E_2", meaning: "Chemical equivalent weights of respective substances" }
    ],
    example: "If copper and silver cells are in series. Mass(Cu)/Mass(Ag) = EqWt(Cu)/EqWt(Ag) = 31.75 / 108.",
    tags: ["electrolysis", "faradays laws"]
  },
  // Concentration
  {
    id: "chem-conc-1",
    subject: "chemistry",
    chapter: "Study of Acids, Bases and Salts",
    title: "Mass Percent",
    formula: "\\text{Mass \\%} = \\frac{\\text{Mass of Solute}}{\\text{Total Mass of Solution}} \\times 100",
    variables: [],
    example: "10g salt dissolved in 90g water. Total solution mass = 100g. Mass% = (10/100)*100 = 10%.",
    tags: ["concentration", "percentage"]
  },
  {
    id: "chem-conc-2",
    subject: "chemistry",
    chapter: "Study of Acids, Bases and Salts",
    title: "Molarity",
    formula: "M = \\frac{\\text{Moles of Solute}}{\\text{Volume of Solution in Litres}}",
    variables: [
      { symbol: "M", meaning: "Molarity (mol/L)" }
    ],
    example: "0.5 moles of NaOH dissolved in 250 mL (0.25 L) of solution. Molarity = 0.5 / 0.25 = 2 M.",
    tags: ["concentration", "molarity"]
  },

  // ================= BIOLOGY =================
  // Genetics
  {
    id: "bio-gene-1",
    subject: "biology",
    chapter: "Genetics",
    title: "Mendelian Monohybrid Ratio (F2)",
    formula: "\\text{Phenotypic Ratio} = 3 : 1, \\quad \\text{Genotypic Ratio} = 1 : 2 : 1",
    variables: [
      { symbol: "3 : 1", meaning: "Dominant phenotype vs Recessive phenotype" },
      { symbol: "1 : 2 : 1", meaning: "Homozygous Dominant (TT) : Heterozygous (Tt) : Homozygous Recessive (tt)" }
    ],
    example: "In crossing tall (Tt) plants, 75% are tall, 25% are dwarf. Genotypic structure is 25% TT, 50% Tt, 25% tt.",
    tags: ["genetics", "mendelian ratios", "inheritance"]
  },
  {
    id: "bio-gene-2",
    subject: "biology",
    chapter: "Genetics",
    title: "Mendelian Dihybrid Ratio (F2 Phenotypic)",
    formula: "\\text{Phenotypic Ratio} = 9 : 3 : 3 : 1",
    variables: [
      { symbol: "9", meaning: "Both traits dominant (e.g., Round, Yellow)" },
      { symbol: "3", meaning: "One dominant, one recessive (e.g., Round, Green)" },
      { symbol: "3", meaning: "Other dominant, other recessive (e.g., Wrinkled, Yellow)" },
      { symbol: "1", meaning: "Both traits recessive (e.g., Wrinkled, Green)" }
    ],
    example: "F2 generation crossing of Round-Yellow seed pea plants yields 9/16 Round-Yellow, 3/16 Round-Green, 3/16 Wrinkled-Yellow, 1/16 Wrinkled-Green.",
    tags: ["genetics", "dihybrid ratio"]
  },
  // Photosynthesis & Respiration
  {
    id: "bio-photo-1",
    subject: "biology",
    chapter: "Photosynthesis",
    title: "Photosynthesis Balanced Equation",
    formula: "6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{H}_2\\text{O} + 6\\text{O}_2\\uparrow",
    variables: [
      { symbol: "\\text{C}_6\\text{H}_{12}\\text{O}_6", meaning: "Glucose (chemical energy stored)" }
    ],
    example: "Chloroplasts capture light to convert carbon dioxide and water into glucose, water, and oxygen byproduct.",
    tags: ["photosynthesis", "plant physiology"]
  },
  {
    id: "bio-resp-1",
    subject: "biology",
    chapter: "Chemical Coordination in Plants / Respiration",
    title: "Aerobic Respiration",
    formula: "\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\xrightarrow{\\text{Enzymes}} 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 38\\text{ ATP} \\text{ (Energy)}",
    variables: [
      { symbol: "\\text{ATP}", meaning: "Adenosine Triphosphate (energy currency of cells)" }
    ],
    example: "Breakdown of glucose in the presence of oxygen in mitochondria yielding carbon dioxide, water, and 38 ATP molecules.",
    tags: ["respiration", "aerobic", "energy"]
  },
  {
    id: "bio-resp-2",
    subject: "biology",
    chapter: "Chemical Coordination in Plants / Respiration",
    title: "Anaerobic Respiration (Plants / Yeast)",
    formula: "\\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{Yeast}} 2\\text{C}_2\\text{H}_5\\text{OH} \\text{ (Ethanol)} + 2\\text{CO}_2 + 2\\text{ ATP}",
    variables: [],
    example: "Also known as fermentation; glucose breaks down in absence of oxygen to produce ethanol and carbon dioxide.",
    tags: ["respiration", "anaerobic", "fermentation"]
  },
  {
    id: "bio-resp-3",
    subject: "biology",
    chapter: "Chemical Coordination in Plants / Respiration",
    title: "Anaerobic Respiration (Animals / Muscle Cells)",
    formula: "\\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{Glycolysis}} 2\\text{C}_3\\text{H}_6\\text{O}_3 \\text{ (Lactic Acid)} + 2\\text{ ATP}",
    variables: [],
    example: "Occurs in animal skeletal muscles during strenuous exercise, leading to accumulation of lactic acid causing fatigue.",
    tags: ["respiration", "anaerobic", "lactic acid"]
  },
  // Circulatory System
  {
    id: "bio-circ-1",
    subject: "biology",
    chapter: "Circulatory System",
    title: "Cardiac Output",
    formula: "\\text{Cardiac Output} = \\text{Stroke Volume} \\times \\text{Heart Rate}",
    variables: [
      { symbol: "\\text{Cardiac Output}", meaning: "Volume of blood pumped by left ventricle per minute (ml/min)" },
      { symbol: "\\text{Stroke Volume}", meaning: "Volume of blood pumped per beat (typically ~70 ml)" },
      { symbol: "\\text{Heart Rate}", meaning: "Number of beats per minute (typically ~72 bpm)" }
    ],
    example: "For stroke volume of 70 ml and heart rate of 72 bpm, Cardiac Output = 70 * 72 = 5040 ml/min ≈ 5 Litres/min.",
    tags: ["circulatory system", "cardiac output", "heart"]
  }
];
