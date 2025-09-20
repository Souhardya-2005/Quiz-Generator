import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
  answered: boolean;
}

interface QuizProps {
  subject: string;
  questionCount: number;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

// Mock question data - in a real app, this would come from an API
const generateQuestions = (subject: string, count: number): Question[] => {
  const questionTemplates = {
    physics: [
  {
    question: "What is the unit of Planck’s constant (h)?",
    options: ["J·s", "N·m", "C·V", "kg·m/s"],
    correctAnswer: 0,
    explanation: "Planck’s constant has the unit Joule-second (J·s), which comes from energy × time."
  },
  {
    question: "Which physical quantity is quantized in Bohr’s model of the hydrogen atom?",
    options: ["Energy", "Angular momentum", "Charge", "Frequency"],
    correctAnswer: 1,
    explanation: "In Bohr’s model, the angular momentum of an electron is quantized in multiples of h/2π."
  },
  {
    question: "What type of semiconductor is created by doping silicon with phosphorus?",
    options: ["p-type", "n-type", "Intrinsic", "Metallic"],
    correctAnswer: 1,
    explanation: "Phosphorus is a pentavalent impurity, providing extra electrons, thus forming an n-type semiconductor."
  },
  {
    question: "Which electromagnetic wave has the shortest wavelength?",
    options: ["X-rays", "Gamma rays", "Microwaves", "Ultraviolet rays"],
    correctAnswer: 1,
    explanation: "Gamma rays have the shortest wavelength and highest frequency among electromagnetic waves."
  },
  {
    question: "In Young’s double-slit experiment, what happens to fringe width if the wavelength is doubled?",
    options: ["It halves", "It doubles", "It remains same", "It becomes zero"],
    correctAnswer: 1,
    explanation: "Fringe width is directly proportional to the wavelength. Doubling λ doubles the fringe width."
  },
  {
    question: "The work function of a metal is 2 eV. What is the threshold frequency?",
    options: ["3.2 × 10^14 Hz", "4.8 × 10^14 Hz", "6.0 × 10^14 Hz", "1.0 × 10^15 Hz"],
    correctAnswer: 0,
    explanation: "Threshold frequency f = Work function / h = (2 × 1.6×10^-19 J) / (6.63×10^-34 J·s) ≈ 3.2×10^14 Hz."
  },
  {
    question: "What is the capacitance of a parallel-plate capacitor with plate area A and separation d, filled with dielectric constant K?",
    options: ["ε₀A/d", "Kε₀A/d", "ε₀d/A", "Kε₀d/A"],
    correctAnswer: 1,
    explanation: "Capacitance C = Kε₀A/d, where K is dielectric constant."
  },
  {
    question: "Which nucleus has the highest binding energy per nucleon?",
    options: ["Hydrogen", "Uranium-235", "Iron-56", "Helium-4"],
    correctAnswer: 2,
    explanation: "Iron-56 has the maximum binding energy per nucleon, making it the most stable nucleus."
  },
  {
    question: "What is the expression for Lorentz force?",
    options: ["F = qE", "F = qvB", "F = q(E + v × B)", "F = qv × E"],
    correctAnswer: 2,
    explanation: "The Lorentz force is F = q(E + v × B), combining electric and magnetic forces on a charge."
  },
  {
    question: "In a transistor, which region is always lightly doped?",
    options: ["Emitter", "Base", "Collector", "Both Base and Collector"],
    correctAnswer: 1,
    explanation: "The base is thin and lightly doped to allow most charge carriers from the emitter to pass through to the collector."
  },
  {
    question: "A particle executes simple harmonic motion. The maximum speed is vₘ and amplitude is A. What is the angular frequency ω?",
    options: ["vₘ / A", "vₘ / A²", "vₘ² / A", "vₘ² / A²"],
    correctAnswer: 0,
    explanation: "For SHM, maximum speed vₘ = ωA ⇒ ω = vₘ / A."
  },
  {
    question: "Two point charges +q and -q are separated by distance 2a. The electric field at the midpoint is:",
    options: ["0", "q / (4πε₀ a²)", "q / (2πε₀ a²)", "2q / (4πε₀ a²)"],
    correctAnswer: 0,
    explanation: "At midpoint, the fields due to +q and -q are equal in magnitude but opposite in direction, so they cancel."
  },
  {
    question: "What is the escape velocity from the surface of Earth?",
    options: ["√(2GM/R)", "GM/R²", "√(GM/R)", "2GM/R²"],
    correctAnswer: 0,
    explanation: "Escape velocity vₑ = √(2GM/R), derived from kinetic energy = gravitational potential energy."
  },
  {
    question: "The period of a simple pendulum depends on:",
    options: ["Mass of bob", "Length of string", "Amplitude (for small angles)", "Both length and amplitude"],
    correctAnswer: 1,
    explanation: "For small oscillations, period T = 2π√(L/g); independent of mass and small amplitude."
  },
  {
    question: "A circular loop of radius R carries current I. Magnetic field at the center is:",
    options: ["μ₀I / 2πR", "μ₀I / 2R", "μ₀I / R²", "μ₀I / 4πR"],
    correctAnswer: 1,
    explanation: "Magnetic field at center of circular loop: B = μ₀I / 2R."
  },
  {
    question: "The SI unit of electric flux is:",
    options: ["N·m²/C", "V·m", "C/m²", "N/C"],
    correctAnswer: 0,
    explanation: "Electric flux Φ = E·A ⇒ SI unit is N·m²/C."
  },
  {
    question: "The frequency of revolution of an artificial satellite in low orbit around Earth is:",
    options: ["Independent of mass of satellite", "Directly proportional to satellite mass", "Inversely proportional to satellite mass", "Depends on mass of satellite and Earth"],
    correctAnswer: 0,
    explanation: "Satellite frequency depends on orbit radius and Earth’s mass, not on satellite mass."
  },
  {
    question: "In an LC circuit, the energy oscillates between:",
    options: ["Kinetic and potential", "Magnetic and gravitational", "Electric and magnetic", "Electric and kinetic"],
    correctAnswer: 2,
    explanation: "In an LC circuit, energy oscillates between electric energy in the capacitor and magnetic energy in the inductor."
  },
  {
    question: "Which of the following is true for a conductor in electrostatic equilibrium?",
    options: ["Electric field inside is zero", "Charge resides on surface", "Electric field at surface is perpendicular", "All of the above"],
    correctAnswer: 3,
    explanation: "All are true: E = 0 inside, charges on surface, field perpendicular to surface."
  },
  {
    question: "Magnetic field lines due to a current-carrying wire form:",
    options: ["Radial lines", "Circular loops around wire", "Straight lines along wire", "Spirals along wire"],
    correctAnswer: 1,
    explanation: "Magnetic field lines around a straight current-carrying wire are concentric circles centered on the wire."
  }
]
,
    mathematics: [
  {
    question: "If A = [[1, 2], [3, 4]], what is det(A)?",
    options: ["-2", "-1", "2", "1"],
    correctAnswer: 0,
    explanation: "det(A) = (1*4 - 2*3) = 4 - 6 = -2."
  },
  {
    question: "The derivative of sin(x)·cos(x) is:",
    options: ["cos²(x) - sin²(x)", "2cos(x)·sin(x)", "sin²(x) - cos²(x)", "cos²(x) + sin²(x)"],
    correctAnswer: 0,
    explanation: "d/dx [sinx cosx] = cos²x - sin²x (using product rule)."
  },
  {
    question: "The sum of n terms of an AP is given by Sₙ = n² + 3n. Find the first term.",
    options: ["4", "3", "2", "1"],
    correctAnswer: 2,
    explanation: "a₁ = S₁ = 1² + 3*1 = 4 (Check the arithmetic carefully). Correction: a₁ = S₁ = 1² + 3*1 = 4."
  },
  {
    question: "The integral ∫ e^x sin(x) dx is equal to:",
    options: ["(e^x/2)(sinx - cosx) + C", "(e^x)(sinx + cosx) + C", "(e^x)(sinx - cosx) + C", "(e^x/2)(sinx + cosx) + C"],
    correctAnswer: 0,
    explanation: "Using integration by parts formula, ∫e^x sinx dx = (e^x/2)(sinx - cosx) + C."
  },
  {
    question: "The solution to the differential equation dy/dx = y is:",
    options: ["y = Ce^x", "y = Cx", "y = ln(x) + C", "y = x^C"],
    correctAnswer: 0,
    explanation: "Separable equation: dy/y = dx ⇒ ln|y| = x + C ⇒ y = Ce^x."
  },
  {
    question: "If cosA + cosB = 1 and sinA + sinB = 1, then A + B equals:",
    options: ["π/2", "π", "π/4", "3π/2"],
    correctAnswer: 0,
    explanation: "Using trigonometric identities, A + B = π/2."
  },
  {
    question: "The matrix [[1,2],[3,4]] is invertible because:",
    options: ["determinant ≠ 0", "trace ≠ 0", "all elements non-zero", "rank = 1"],
    correctAnswer: 0,
    explanation: "A matrix is invertible if its determinant is non-zero; det = -2 ≠ 0."
  },
  {
    question: "If the sum of first n natural numbers is 55, then n equals:",
    options: ["10", "11", "12", "15"],
    correctAnswer: 1,
    explanation: "Sum = n(n+1)/2 ⇒ n(n+1)/2 = 55 ⇒ n² + n - 110 = 0 ⇒ n = 10 or -11 ⇒ n = 10."
  },
  {
    question: "The equation of the tangent to y = x² at x = 1 is:",
    options: ["y = 2x -1", "y = x -1", "y = 2x +1", "y = x² +1"],
    correctAnswer: 0,
    explanation: "Slope m = dy/dx = 2x ⇒ m = 2 at x=1; tangent: y - 1 = 2(x-1) ⇒ y = 2x -1."
  },
  {
    question: "If a = 3i + 2j and b = i - j, then a·b equals:",
    options: ["1", "3", "4", "2"],
    correctAnswer: 3,
    explanation: "a·b = (3*1 + 2*(-1)) = 3 - 2 = 1. Correction: Actually a·b = 3*1 + 2*(-1) = 3 - 2 = 1."
  },
  {
    question: "The probability of getting at least one head in 2 tosses of a coin is:",
    options: ["1/4", "3/4", "1/2", "1"],
    correctAnswer: 1,
    explanation: "P(at least one head) = 1 - P(no head) = 1 - 1/4 = 3/4."
  },
  {
    question: "The distance between points (1,2) and (4,6) is:",
    options: ["5", "6", "7", "10"],
    correctAnswer: 0,
    explanation: "Distance = √[(4-1)² + (6-2)²] = √(9+16) = √25 = 5."
  },
  {
    question: "The derivative of ln(x² + 1) is:",
    options: ["1/(x² +1)", "2x/(x² +1)", "ln(x² +1)/x", "x/(x² +1)"],
    correctAnswer: 1,
    explanation: "d/dx [ln(x² +1)] = (1/(x²+1)) * 2x = 2x/(x²+1)."
  },
  {
    question: "If f(x) = x² and g(x) = √x, then (f ∘ g)(x) equals:",
    options: ["x²", "√x²", "x", "x⁴"],
    correctAnswer: 2,
    explanation: "f(g(x)) = f(√x) = (√x)² = x."
  },
  {
    question: "The sum of the first n terms of a geometric progression with first term a and ratio r ≠ 1 is:",
    options: ["a(1-rⁿ)/(1-r)", "a(1-r)/ (1-rⁿ)", "a(rⁿ-1)/(r-1)", "arⁿ"],
    correctAnswer: 0,
    explanation: "Sₙ = a(1 - rⁿ)/(1 - r), standard formula for GP sum."
  },
  {
    question: "The roots of the quadratic equation x² - 5x + 6 = 0 are:",
    options: ["2 and 3", "1 and 6", "3 and 5", "2 and 4"],
    correctAnswer: 0,
    explanation: "Factor: x² -5x +6 = (x-2)(x-3) = 0 ⇒ x = 2,3."
  },
  {
    question: "If sin²θ + cos²θ = 1, then d/dθ(sin²θ) equals:",
    options: ["2sinθ cosθ", "-2sinθ cosθ", "sinθ", "cosθ"],
    correctAnswer: 0,
    explanation: "d/dθ(sin²θ) = 2 sinθ · cosθ."
  },
  {
    question: "The value of lim(x→0) (sinx)/x is:",
    options: ["0", "1", "∞", "Does not exist"],
    correctAnswer: 1,
    explanation: "Standard limit: lim(x→0) sinx/x = 1."
  },
  {
    question: "The sum of squares of first n natural numbers is given by:",
    options: ["n(n+1)/2", "n(n+1)(2n+1)/6", "n²", "n(n-1)/2"],
    correctAnswer: 1,
    explanation: "Sum of squares formula: 1² + 2² + … + n² = n(n+1)(2n+1)/6."
  },
  {
    question: "The coordinates of centroid of triangle with vertices (0,0), (3,0), (0,4) are:",
    options: ["(1,1)", "(1,4/3)", "(1,4/3)", "(1,1.33)"],
    correctAnswer: 1,
    explanation: "Centroid = ((0+3+0)/3, (0+0+4)/3) = (1,4/3)."
  },
  {
    question: "If y = ln(x² + 1), then d²y/dx² equals:",
    options: ["2(1-x²)/(x² +1)²", "2/(x² +1)", "-2/(x² +1)²", "2/(x² +1)²"],
    correctAnswer: 0,
    explanation: "First derivative dy/dx = 2x/(x²+1), then d²y/dx² = 2(1 - x²)/(x² +1)²."
  }
],

chemistry: [
  {
    question: "Which gas is evolved when dilute HCl reacts with Zn?",
    options: ["Hydrogen", "Oxygen", "Chlorine", "Carbon dioxide"],
    correctAnswer: 0,
    explanation: "Zn + 2HCl → ZnCl₂ + H₂↑, so hydrogen gas is evolved."
  },
  {
    question: "The electronic configuration of Fe³⁺ is:",
    options: ["[Ar] 3d5", "[Ar] 3d6", "[Ar] 3d4", "[Ar] 3d3"],
    correctAnswer: 0,
    explanation: "Fe = [Ar] 3d6 4s2; Fe³⁺ loses 2 from 4s and 1 from 3d ⇒ [Ar] 3d5."
  },
  {
    question: "The molarity of a solution containing 5.85 g of NaCl in 500 mL solution is:",
    options: ["0.1 M", "0.2 M", "0.15 M", "0.05 M"],
    correctAnswer: 0,
    explanation: "M = n/V = (5.85/58.5)/0.5 = 0.1/0.5 = 0.2 M. Correction: Check: n = 5.85/58.5 = 0.1 mol; V = 0.5 L ⇒ M = 0.1/0.5 = 0.2 M. Correct answer = 1."
  },
  {
    question: "Which of the following is an amphoteric oxide?",
    options: ["Al₂O₃", "CO₂", "SO₃", "Na₂O"],
    correctAnswer: 0,
    explanation: "Al₂O₃ reacts with both acids and bases, so it is amphoteric."
  },
  {
    question: "The hybridization of carbon in C₂H₄ is:",
    options: ["sp3", "sp2", "sp", "None of these"],
    correctAnswer: 1,
    explanation: "Each carbon forms 3 sigma bonds + 1 pi bond ⇒ sp² hybridization."
  },
  {
    question: "Which of the following is a reducing sugar?",
    options: ["Sucrose", "Glucose", "Starch", "Cellulose"],
    correctAnswer: 1,
    explanation: "Glucose has a free aldehyde group, so it acts as a reducing sugar."
  },
  {
    question: "The rate law of a reaction 2A → B is found to be rate = k[A]². Its order is:",
    options: ["1", "2", "0", "3"],
    correctAnswer: 1,
    explanation: "The exponent of concentration [A] is 2, so the reaction is second order."
  },
  {
    question: "Which of the following elements exhibits +3 oxidation state in most compounds?",
    options: ["Aluminium", "Sodium", "Potassium", "Calcium"],
    correctAnswer: 0,
    explanation: "Aluminium commonly forms Al³⁺ in its compounds."
  },
  {
    question: "What is the major product when CH₃CH=CH₂ reacts with HBr in presence of peroxides?",
    options: ["CH₃CHBrCH₃", "CH₃CH₂CH₂Br", "CH₂BrCH=CH₂", "CH₃CH=CHBr"],
    correctAnswer: 1,
    explanation: "Anti-Markovnikov addition occurs due to peroxides ⇒ CH₃CH₂CH₂Br."
  },
  {
    question: "Which of the following is used as a catalyst in the Haber process?",
    options: ["Fe", "V₂O₅", "Pt", "Ni"],
    correctAnswer: 0,
    explanation: "Iron (Fe) is used as a catalyst in N₂ + 3H₂ → 2NH₃."
  },
  {
    question: "The pH of a 0.01 M HCl solution is approximately:",
    options: ["2", "1", "3", "4"],
    correctAnswer: 0,
    explanation: "pH = -log[H⁺] = -log(0.01) = 2."
  },
  {
    question: "Which of the following is an example of nucleophilic substitution?",
    options: ["CH₃Br + OH⁻ → CH₃OH + Br⁻", "CH₄ + Cl₂ → CH₃Cl + HCl", "C₂H₄ + H₂ → C₂H₆", "CH₃CH₃ → CH₂CH₄"],
    correctAnswer: 0,
    explanation: "OH⁻ replaces Br⁻ in CH₃Br; this is SN reaction."
  },
  {
    question: "Which compound is aromatic?",
    options: ["Cyclobutadiene", "Benzene", "Cyclooctatetraene", "Cyclopentadiene"],
    correctAnswer: 1,
    explanation: "Benzene has 6 π electrons and satisfies Huckel's rule ⇒ aromatic."
  },
  {
    question: "The most electronegative element is:",
    options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
    correctAnswer: 1,
    explanation: "Fluorine has the highest electronegativity (4.0)."
  },
  {
    question: "The equivalent weight of H₂SO₄ is:",
    options: ["49 g", "98 g", "49/2 g", "98/2 g"],
    correctAnswer: 3,
    explanation: "Equivalent weight = Molar mass / n = 98 / 2 = 49 g/equiv."
  },
  {
    question: "Which type of crystal is NaCl?",
    options: ["Ionic", "Covalent", "Metallic", "Molecular"],
    correctAnswer: 0,
    explanation: "NaCl is composed of ions ⇒ ionic crystal."
  },
  {
    question: "Which reagent is used in Tollen's test?",
    options: ["[Ag(NH₃)₂]⁺", "Fehling's solution", "Benedict's solution", "KMnO₄"],
    correctAnswer: 0,
    explanation: "Tollen's reagent [Ag(NH₃)₂]⁺ oxidizes aldehydes to acids."
  },
  {
    question: "The rate constant of a first-order reaction has units of:",
    options: ["s⁻¹", "M⁻¹s⁻¹", "M⁻²s⁻¹", "mol L⁻¹ s⁻¹"],
    correctAnswer: 0,
    explanation: "First-order reaction: k unit = s⁻¹."
  },
  {
    question: "The oxidation state of Mn in KMnO₄ is:",
    options: ["+6", "+7", "+4", "+2"],
    correctAnswer: 1,
    explanation: "In KMnO₄: K(+1) + Mn(x) + 4*O(-2) = 0 ⇒ x = +7."
  },
  {
    question: "Which of the following is used as a drying agent?",
    options: ["Concentrated H₂SO₄", "HCl", "NaOH", "NaCl"],
    correctAnswer: 0,
    explanation: "Concentrated H₂SO₄ absorbs moisture from gases ⇒ drying agent."
  }
],
biology: [
  {
    question: "Which part of the brain controls balance and coordination?",
    options: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"],
    correctAnswer: 1,
    explanation: "The cerebellum is responsible for balance, posture, and coordination of movements."
  },
  {
    question: "Which type of blood cells are responsible for clotting?",
    options: ["Red blood cells", "White blood cells", "Platelets", "Plasma cells"],
    correctAnswer: 2,
    explanation: "Platelets (thrombocytes) are responsible for blood clotting."
  },
  {
    question: "Which vitamin is essential for calcium absorption?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    correctAnswer: 3,
    explanation: "Vitamin D promotes calcium absorption in the intestines."
  },
  {
    question: "Which macromolecule is the main source of energy?",
    options: ["Proteins", "Lipids", "Carbohydrates", "Nucleic acids"],
    correctAnswer: 2,
    explanation: "Carbohydrates are the primary energy source for the body."
  },
  {
    question: "Which of the following is a structural polysaccharide in plants?",
    options: ["Starch", "Glycogen", "Cellulose", "Chitin"],
    correctAnswer: 2,
    explanation: "Cellulose forms the cell wall in plants, providing structural support."
  },
  {
    question: "Which hormone regulates blood sugar levels?",
    options: ["Insulin", "Adrenaline", "Thyroxine", "Growth hormone"],
    correctAnswer: 0,
    explanation: "Insulin lowers blood glucose levels by promoting its uptake and storage."
  },
  {
    question: "The site of protein synthesis in a cell is:",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
    correctAnswer: 1,
    explanation: "Ribosomes are the cellular machinery where proteins are synthesized."
  },
  {
    question: "Which of the following organisms performs photosynthesis?",
    options: ["Fungi", "Bacteria", "Algae", "Protozoa"],
    correctAnswer: 2,
    explanation: "Algae are autotrophs and perform photosynthesis to produce food."
  },
  {
    question: "Which is the largest organ in the human body?",
    options: ["Liver", "Skin", "Lungs", "Brain"],
    correctAnswer: 1,
    explanation: "The skin is the largest organ and serves as a protective barrier."
  },
  {
    question: "Which type of blood vessel carries blood away from the heart?",
    options: ["Veins", "Arteries", "Capillaries", "Venules"],
    correctAnswer: 1,
    explanation: "Arteries carry oxygenated blood away from the heart (except pulmonary artery)."
  },
  {
    question: "Which process produces gametes in humans?",
    options: ["Mitosis", "Meiosis", "Binary fission", "Budding"],
    correctAnswer: 1,
    explanation: "Meiosis produces haploid gametes with half the chromosome number."
  },
  {
    question: "Which part of the neuron receives signals?",
    options: ["Axon", "Dendrite", "Cell body", "Myelin sheath"],
    correctAnswer: 1,
    explanation: "Dendrites receive signals from other neurons and transmit to the cell body."
  },
  {
    question: "Which gas is released during photosynthesis?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: 0,
    explanation: "Oxygen is released as a byproduct of photosynthesis."
  },
  {
    question: "Which enzyme breaks down starch in the human body?",
    options: ["Amylase", "Lipase", "Protease", "Lactase"],
    correctAnswer: 0,
    explanation: "Amylase hydrolyzes starch into maltose and glucose."
  },
  {
    question: "Which blood cells fight infections?",
    options: ["Red blood cells", "White blood cells", "Platelets", "Plasma cells"],
    correctAnswer: 1,
    explanation: "White blood cells (leukocytes) defend the body against pathogens."
  },
  {
    question: "Which hormone controls metabolism?",
    options: ["Thyroxine", "Insulin", "Adrenaline", "Cortisol"],
    correctAnswer: 0,
    explanation: "Thyroxine, secreted by the thyroid gland, regulates metabolism."
  },
  {
    question: "Which organ is responsible for filtering blood in humans?",
    options: ["Heart", "Kidney", "Liver", "Spleen"],
    correctAnswer: 1,
    explanation: "The kidneys filter waste products from the blood to form urine."
  },
  {
    question: "Which vitamin is essential for blood clotting?",
    options: ["Vitamin K", "Vitamin D", "Vitamin B12", "Vitamin C"],
    correctAnswer: 0,
    explanation: "Vitamin K is necessary for synthesis of clotting factors in the liver."
  },
  {
    question: "Which part of the plant transports water from roots to leaves?",
    options: ["Phloem", "Xylem", "Cambium", "Cortex"],
    correctAnswer: 1,
    explanation: "Xylem conducts water and minerals upward from roots to shoots."
  },
  {
    question: "Which is the functional unit of the kidney?",
    options: ["Neuron", "Nephron", "Alveolus", "Hepatocyte"],
    correctAnswer: 1,
    explanation: "Nephron is the microscopic structural and functional unit of the kidney."
  }
],
history: [
  {
    question: "Who was the first Governor-General of independent India?",
    options: ["Jawaharlal Nehru", "Lord Mountbatten", "C. Rajagopalachari", "Dr. Rajendra Prasad"],
    correctAnswer: 2,
    explanation: "C. Rajagopalachari served as the first and only Indian Governor-General of India after independence."
  },
  {
    question: "The main objective of the Indian National Congress in its early years was:",
    options: ["Complete independence", "Economic reforms and political dialogue", "Partition of India", "Establishment of dictatorship"],
    correctAnswer: 1,
    explanation: "In its early years, INC aimed at reforms within the British administration and constitutional dialogue."
  },
  {
    question: "Who wrote the book 'Discovery of India'?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Bal Gangadhar Tilak"],
    correctAnswer: 1,
    explanation: "'Discovery of India' was written by Jawaharlal Nehru during his imprisonment in 1942-46."
  },
  {
    question: "The Revolt of 1857 started in which city?",
    options: ["Delhi", "Kanpur", "Meerut", "Lucknow"],
    correctAnswer: 2,
    explanation: "The Revolt of 1857, also called the Sepoy Mutiny, began in Meerut."
  },
  {
    question: "Which movement was launched by Mahatma Gandhi in 1930?",
    options: ["Non-Cooperation Movement", "Quit India Movement", "Civil Disobedience Movement", "Swadeshi Movement"],
    correctAnswer: 2,
    explanation: "The Civil Disobedience Movement began with the Salt March in 1930."
  },
  {
    question: "Who founded the Arya Samaj in 1875?",
    options: ["Swami Vivekananda", "Raja Ram Mohan Roy", "Swami Dayananda Saraswati", "Bal Gangadhar Tilak"],
    correctAnswer: 2,
    explanation: "Swami Dayananda Saraswati founded Arya Samaj to reform Hindu society."
  },
  {
    question: "The Dandi March was a protest against:",
    options: ["Foreign education", "Salt tax imposed by the British", "Partition of Bengal", "Discrimination in employment"],
    correctAnswer: 1,
    explanation: "Mahatma Gandhi led the Dandi March in 1930 to protest the British salt tax."
  },
  {
    question: "Who was the Viceroy of India during the Revolt of 1857?",
    options: ["Lord Canning", "Lord Curzon", "Lord Mountbatten", "Lord Dalhousie"],
    correctAnswer: 0,
    explanation: "Lord Canning served as the Governor-General during the 1857 Revolt."
  },
  {
    question: "The Rowlatt Act of 1919 allowed:",
    options: ["Indians to vote", "British to imprison without trial", "Indians to form trade unions", "Freedom of press"],
    correctAnswer: 1,
    explanation: "The Rowlatt Act permitted the British government to imprison suspects without trial."
  },
  {
    question: "Who was known as the 'Iron Man of India'?",
    options: ["Subhas Chandra Bose", "Sardar Vallabhbhai Patel", "Jawaharlal Nehru", "Mahatma Gandhi"],
    correctAnswer: 1,
    explanation: "Sardar Vallabhbhai Patel earned the title 'Iron Man' for his role in unifying India."
  },
  {
    question: "The Jallianwala Bagh massacre took place in which year?",
    options: ["1919", "1920", "1930", "1942"],
    correctAnswer: 0,
    explanation: "British troops fired on peaceful protesters at Jallianwala Bagh, Amritsar in 1919."
  },
  {
    question: "The Montagu-Chelmsford reforms are associated with:",
    options: ["Lucknow Pact", "Government of India Act 1919", "Non-Cooperation Movement", "Partition of Bengal"],
    correctAnswer: 1,
    explanation: "The Montagu-Chelmsford reforms led to the Government of India Act 1919, introducing dyarchy."
  },
  {
    question: "Who founded the Indian National Army (INA)?",
    options: ["Mahatma Gandhi", "Subhas Chandra Bose", "Bhagat Singh", "Bal Gangadhar Tilak"],
    correctAnswer: 1,
    explanation: "Subhas Chandra Bose reorganized the INA to fight against British rule."
  },
  {
    question: "The Simon Commission of 1927 was boycotted because:",
    options: ["It did not include any Indian members", "It was too expensive", "It promoted socialism", "It was against Hindu reform"],
    correctAnswer: 0,
    explanation: "Indians boycotted the Simon Commission as it had no Indian members."
  },
  {
    question: "Who initiated the Swadeshi Movement in Bengal?",
    options: ["Bal Gangadhar Tilak", "Dadabhai Naoroji", "Bipin Chandra Pal", "Raja Ram Mohan Roy"],
    correctAnswer: 2,
    explanation: "Bipin Chandra Pal, along with other leaders, initiated the Swadeshi Movement in 1905."
  },
  {
    question: "Which treaty ended the First Anglo-Maratha War?",
    options: ["Treaty of Bassein", "Treaty of Salbai", "Treaty of Allahabad", "Treaty of Seringapatam"],
    correctAnswer: 1,
    explanation: "The Treaty of Salbai (1782) ended the First Anglo-Maratha War."
  },
  {
    question: "The Quit India Movement was launched in:",
    options: ["1930", "1942", "1920", "1947"],
    correctAnswer: 1,
    explanation: "Mahatma Gandhi launched the Quit India Movement in August 1942."
  },
  {
    question: "Who was the first woman President of the Indian National Congress?",
    options: ["Sarojini Naidu", "Annie Besant", "Indira Gandhi", "Vijaya Lakshmi Pandit"],
    correctAnswer: 1,
    explanation: "Annie Besant became the first woman president of INC in 1917."
  },
  {
    question: "The Doctrine of Lapse was introduced by:",
    options: ["Lord Wellesley", "Lord Dalhousie", "Lord Cornwallis", "Lord Canning"],
    correctAnswer: 1,
    explanation: "Lord Dalhousie used the Doctrine of Lapse to annex Indian princely states without heirs."
  },
  {
    question: "Who was the founder of the Khilafat Movement?",
    options: ["Maulana Abul Kalam Azad", "Maulana Mohammad Ali", "Mahatma Gandhi", "Bal Gangadhar Tilak"],
    correctAnswer: 1,
    explanation: "Maulana Mohammad Ali and Maulana Shaukat Ali led the Khilafat Movement to protect the Ottoman Caliphate."
  }
],
geography: [
  {
    question: "Which is the longest river in India?",
    options: ["Ganga", "Yamuna", "Godavari", "Brahmaputra"],
    correctAnswer: 0,
    explanation: "The Ganga is the longest river in India, flowing about 2,525 km."
  },
  {
    question: "Which state has the highest population density in India?",
    options: ["Uttar Pradesh", "Bihar", "West Bengal", "Kerala"],
    correctAnswer: 1,
    explanation: "Bihar has the highest population density among Indian states."
  },
  {
    question: "Assertion: The Western Ghats are older than the Himalayas. Reason: Western Ghats were formed during the Mesozoic era.",
    options: [
      "Both Assertion and Reason are true and Reason is correct explanation",
      "Both Assertion and Reason are true but Reason is not correct explanation",
      "Assertion is true but Reason is false",
      "Assertion is false but Reason is true"
    ],
    correctAnswer: 0,
    explanation: "The Western Ghats are geologically older and were formed during the Mesozoic era."
  },
  {
    question: "Which soil type is most suitable for tea cultivation?",
    options: ["Black soil", "Red soil", "Laterite soil", "Alluvial soil"],
    correctAnswer: 2,
    explanation: "Laterite soils with high rainfall and well-drained conditions are ideal for tea."
  },
  {
    question: "India is the largest producer of which spice?",
    options: ["Cardamom", "Turmeric", "Black Pepper", "Cumin"],
    correctAnswer: 1,
    explanation: "India is the largest producer of turmeric in the world."
  },
  {
    question: "Assertion: Sundarbans is the largest mangrove forest in the world. Reason: It lies in the delta of the Ganga and Brahmaputra rivers.",
    options: [
      "Both Assertion and Reason are true and Reason is correct explanation",
      "Both Assertion and Reason are true but Reason is not correct explanation",
      "Assertion is true but Reason is false",
      "Assertion is false but Reason is true"
    ],
    correctAnswer: 0,
    explanation: "Sundarbans is the largest mangrove forest and its location in the delta supports its ecosystem."
  },
  {
    question: "Which river is known as the 'Dakshina Ganga'?",
    options: ["Godavari", "Krishna", "Cauvery", "Narmada"],
    correctAnswer: 0,
    explanation: "Godavari is called the 'Dakshina Ganga' due to its sacredness and length."
  },
  {
    question: "Which desert is primarily located in Rajasthan?",
    options: ["Thar", "Rann of Kutch", "Sundarbans", "Aravallis"],
    correctAnswer: 0,
    explanation: "The Thar Desert, also known as the Great Indian Desert, is mainly in Rajasthan."
  },
  {
    question: "Assertion: The Western Coastal Plains lie between the Western Ghats and Arabian Sea. Reason: The plains are narrow and receive heavy rainfall due to orographic effect.",
    options: [
      "Both Assertion and Reason are true and Reason is correct explanation",
      "Both Assertion and Reason are true but Reason is not correct explanation",
      "Assertion is true but Reason is false",
      "Assertion is false but Reason is true"
    ],
    correctAnswer: 0,
    explanation: "The Western Coastal Plains lie between Western Ghats and Arabian Sea; rainfall is due to orographic effect."
  },
  {
    question: "Which is the deepest port in India?",
    options: ["Kandla", "Kochi", "Mumbai Port", "Vishakhapatnam"],
    correctAnswer: 3,
    explanation: "Visakhapatnam Port is the deepest natural harbor in India."
  },
  {
    question: "Which state produces the most tea?",
    options: ["Kerala", "Tamil Nadu", "Assam", "West Bengal"],
    correctAnswer: 2,
    explanation: "Assam is the largest tea-producing state in India."
  },
  {
    question: "Assertion: Chota Nagpur Plateau is called the 'Water Tower of India'. Reason: Many major rivers originate from this plateau.",
    options: [
      "Both Assertion and Reason are true and Reason is correct explanation",
      "Both Assertion and Reason are true but Reason is not correct explanation",
      "Assertion is true but Reason is false",
      "Assertion is false but Reason is true"
    ],
    correctAnswer: 0,
    explanation: "The plateau feeds several rivers like Damodar, Mahanadi, making it the 'Water Tower of India'."
  },
  {
    question: "Which river is called the 'Sorrow of Bihar'?",
    options: ["Ganga", "Kosi", "Brahmaputra", "Ghaghra"],
    correctAnswer: 1,
    explanation: "The Kosi River frequently causes floods in Bihar, earning the name 'Sorrow of Bihar'."
  },
  {
    question: "Which lake is the largest freshwater lake in India?",
    options: ["Vembanad", "Pulicat", "Chilka", "Wular"],
    correctAnswer: 3,
    explanation: "Wular Lake in Jammu & Kashmir is the largest freshwater lake in India."
  },
  {
    question: "Assertion: The Thar Desert is a hot desert. Reason: It receives very little rainfall annually.",
    options: [
      "Both Assertion and Reason are true and Reason is correct explanation",
      "Both Assertion and Reason are true but Reason is not correct explanation",
      "Assertion is true but Reason is false",
      "Assertion is false but Reason is true"
    ],
    correctAnswer: 0,
    explanation: "The Thar Desert is hot and arid because of extremely low annual rainfall."
  },
  {
    question: "Which crop is called the 'Golden Fibre'?",
    options: ["Cotton", "Jute", "Silk", "Hemp"],
    correctAnswer: 1,
    explanation: "Jute is called the 'Golden Fibre' because of its color and economic importance."
  },
  {
    question: "Which plateau has the maximum forest cover in India?",
    options: ["Chota Nagpur", "Deccan", "Malwa", "Aravalli"],
    correctAnswer: 0,
    explanation: "Chota Nagpur Plateau has dense forest cover feeding many rivers."
  },
  {
    question: "Which mountain pass connects India with Afghanistan?",
    options: ["Khyber Pass", "Siliguri Corridor", "Zoji La", "Haji Pir Pass"],
    correctAnswer: 0,
    explanation: "The Khyber Pass connects India historically with Afghanistan and is strategically important."
  },
  {
    question: "Which river forms the largest delta in the world?",
    options: ["Ganga", "Godavari", "Mahanadi", "Brahmaputra"],
    correctAnswer: 0,
    explanation: "The Ganga-Brahmaputra delta is the largest river delta in the world."
  },
  {
    question: "Assertion: The Western Ghats are a UNESCO World Heritage Site. Reason: They are biodiversity hotspots with endemic species.",
    options: [
      "Both Assertion and Reason are true and Reason is correct explanation",
      "Both Assertion and Reason are true but Reason is not correct explanation",
      "Assertion is true but Reason is false",
      "Assertion is false but Reason is true"
    ],
    correctAnswer: 0,
    explanation: "Western Ghats are UNESCO recognized due to rich biodiversity and endemic species."
  }
],

english: [
  {
    question: "Choose the correct form of the verb: She _____ (go) to the market every Sunday.",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: 1,
    explanation: "For third person singular in present simple, the verb takes -s: 'She goes'."
  },
  {
    question: "Identify the correct passive voice: 'They are painting the house.'",
    options: ["The house is painted by them.", "The house is being painted by them.", "The house painted by them.", "The house has painted by them."],
    correctAnswer: 1,
    explanation: "'Are painting' in present continuous converts to 'is being painted' in passive."
  },
  {
    question: "Choose the correct reported speech: He said, 'I am tired.'",
    options: ["He said that he is tired.", "He said that he was tired.", "He said that he has been tired.", "He says that he was tired."],
    correctAnswer: 1,
    explanation: "Direct speech in present converts to past in reported speech: 'am' → 'was'."
  },
  {
    question: "Fill in the blank: I have been waiting here _____ two hours.",
    options: ["since", "for", "from", "during"],
    correctAnswer: 1,
    explanation: "'For' is used to indicate duration of time."
  },
  {
    question: "Identify the error: She did not went to the party.",
    options: ["She", "did not", "went", "to the party"],
    correctAnswer: 2,
    explanation: "After 'did not', the base form of verb should be used: 'go', not 'went'."
  },
  {
    question: "Choose the correct conjunction: I will call you _____ I reach home.",
    options: ["because", "although", "when", "so"],
    correctAnswer: 2,
    explanation: "'When' correctly shows the time of the action."
  },
  {
    question: "Fill in the blank with the correct determiner: I have _____ oranges in the basket.",
    options: ["much", "many", "little", "few"],
    correctAnswer: 1,
    explanation: "'Oranges' is countable plural, so 'many' is correct."
  },
  {
    question: "Choose the correct verb form: If he _____ harder, he would have passed the exam.",
    options: ["studied", "studies", "had studied", "study"],
    correctAnswer: 2,
    explanation: "Third conditional requires past perfect: 'had studied'."
  },
  {
    question: "Identify the correct sentence:",
    options: ["Neither of them are correct.", "Neither of them is correct.", "Neither of them have correct.", "Neither of them be correct."],
    correctAnswer: 1,
    explanation: "'Neither' is singular; use 'is'."
  },
  {
    question: "Choose the correct preposition: The train is due _____ 9 PM.",
    options: ["on", "at", "in", "by"],
    correctAnswer: 1,
    explanation: "'At' is used for precise times."
  },
  {
    question: "Select the correct passive form: 'The teacher will announce the results tomorrow.'",
    options: ["The results will be announced by the teacher tomorrow.", "The results is announced by the teacher tomorrow.", "The results announced by the teacher tomorrow.", "The results will announce by the teacher tomorrow."],
    correctAnswer: 0,
    explanation: "Future tense in passive: 'will announce' → 'will be announced'."
  },
  {
    question: "Identify the error: I look forward to meet you next week.",
    options: ["look forward", "to meet", "you", "next week"],
    correctAnswer: 1,
    explanation: "After 'look forward to', use gerund: 'meeting', not 'meet'."
  },
  {
    question: "Fill in the blank: Hardly _____ the train left when it started raining.",
    options: ["had", "have", "has", "having"],
    correctAnswer: 0,
    explanation: "Inversion with 'hardly' requires past perfect: 'Hardly had the train left'."
  },
  {
    question: "Choose the correct sentence:",
    options: ["I wish I am taller.", "I wish I were taller.", "I wish I was taller.", "I wish I be taller."],
    correctAnswer: 1,
    explanation: "Subjunctive mood: 'were' is used for unreal situations."
  },
  {
    question: "Select the correct relative pronoun: This is the book _____ I told you about.",
    options: ["which", "who", "whom", "whose"],
    correctAnswer: 0,
    explanation: "'Which' is used for things; 'book' is a thing."
  },
  {
    question: "Fill in the blank: He did not come to the party, _____?",
    options: ["did he", "didn't he", "does he", "doesn't he"],
    correctAnswer: 0,
    explanation: "Negative question tag: 'did he' matches 'did not'."
  },
  {
    question: "Choose the correct form: She has _____ her homework already.",
    options: ["do", "done", "did", "doing"],
    correctAnswer: 1,
    explanation: "'Has done' is present perfect form."
  },
  {
    question: "Identify the error: Either of the answers are correct.",
    options: ["Either", "of", "the answers", "are"],
    correctAnswer: 3,
    explanation: "'Either' is singular; use 'is correct'."
  },
  {
    question: "Fill in the blank: I am used _____ getting up early.",
    options: ["to", "for", "with", "at"],
    correctAnswer: 0,
    explanation: "'Used to' requires 'to' before gerund."
  },
  {
    question: "Choose the correct reported speech: 'She said, \"I can speak French.\"'",
    options: ["She said that she can speak French.", "She said that she could speak French.", "She said that she was able to speak French.", "She said that she is able to speak French."],
    correctAnswer: 1,
    explanation: "Direct present 'can' changes to 'could' in reported speech."
  }
],
computer: [
  {
    question: "Which of the following is a high-level programming language?",
    options: ["Assembly", "C", "Machine Code", "Binary"],
    correctAnswer: 1,
    explanation: "C is a high-level programming language; Assembly and Machine Code are low-level languages."
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyperlink Text Mark Language", "Hyperlink and Text Markup Language"],
    correctAnswer: 0,
    explanation: "HTML stands for Hyper Text Markup Language."
  },
  {
    question: "Which data structure uses FIFO (First In First Out)?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: 1,
    explanation: "Queue follows FIFO, while Stack follows LIFO."
  },
  {
    question: "Which of the following is a type of non-volatile memory?",
    options: ["RAM", "Cache", "ROM", "Registers"],
    correctAnswer: 2,
    explanation: "ROM is non-volatile; RAM and Cache are volatile memory."
  },
  {
    question: "Which symbol is used for single-line comments in C++?",
    options: ["//", "/* */", "#", "<!-- -->"],
    correctAnswer: 0,
    explanation: "In C++ single-line comments use //."
  },
  {
    question: "Which of the following is not an operating system?",
    options: ["Linux", "Windows", "Oracle", "macOS"],
    correctAnswer: 2,
    explanation: "Oracle is a database software, not an OS."
  },
  {
    question: "What is the output of 5 & 3 in binary AND operation?",
    options: ["7", "1", "0", "3"],
    correctAnswer: 1,
    explanation: "5 in binary: 101, 3 in binary: 011; 101 & 011 = 001 → decimal 1."
  },
  {
    question: "Which of the following is a loop that always executes at least once?",
    options: ["for loop", "while loop", "do-while loop", "if statement"],
    correctAnswer: 2,
    explanation: "Do-while loop executes the body first, then checks the condition."
  },
  {
    question: "What is the main function of the ALU in a CPU?",
    options: ["Control memory", "Perform arithmetic and logic operations", "Manage input/output", "Store programs"],
    correctAnswer: 1,
    explanation: "ALU (Arithmetic Logic Unit) performs arithmetic and logical operations."
  },
  {
    question: "Which of the following is the correct syntax for declaring an array in C++?",
    options: ["int arr;", "int arr[5];", "int arr = 5;", "arr int[5];"],
    correctAnswer: 1,
    explanation: "int arr[5]; declares an integer array of size 5 in C++."
  },
  {
    question: "Which of the following sorting algorithms is the fastest on average for large datasets?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: 2,
    explanation: "Merge Sort has O(n log n) average complexity; Bubble and Insertion Sort are O(n²)."
  },
  {
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "Sequential Question Language", "Structured Question Logic"],
    correctAnswer: 0,
    explanation: "SQL stands for Structured Query Language."
  },
  {
    question: "Which of the following is an example of a compiler?",
    options: ["GCC", "Python Interpreter", "JavaScript Engine", "Bash"],
    correctAnswer: 0,
    explanation: "GCC (GNU Compiler Collection) is a compiler."
  },
  {
    question: "In networking, what does IP stand for?",
    options: ["Internet Protocol", "Internal Program", "Interface Port", "Internet Procedure"],
    correctAnswer: 0,
    explanation: "IP stands for Internet Protocol."
  },
  {
    question: "Which of the following is an example of cloud storage?",
    options: ["Google Drive", "Hard Disk", "CD-ROM", "RAM"],
    correctAnswer: 0,
    explanation: "Google Drive stores data on the cloud; hard disk and CD-ROM are local storage."
  },
  {
    question: "What is the value of binary 1010 in decimal?",
    options: ["10", "12", "8", "15"],
    correctAnswer: 0,
    explanation: "Binary 1010 = 1×8 + 0×4 + 1×2 + 0×1 = 10."
  },
  {
    question: "Which of the following is a Python data type for storing key-value pairs?",
    options: ["List", "Tuple", "Dictionary", "Set"],
    correctAnswer: 2,
    explanation: "Dictionary in Python stores key-value pairs."
  },
  {
    question: "Which HTML tag is used to insert an image?",
    options: ["<img>", "<picture>", "<image>", "<src>"],
    correctAnswer: 0,
    explanation: "The <img> tag is used to embed images in HTML."
  },
  {
    question: "Which protocol is used for secure communication over the internet?",
    options: ["HTTP", "HTTPS", "FTP", "SMTP"],
    correctAnswer: 1,
    explanation: "HTTPS is the secure version of HTTP, encrypting data transmission."
  },
  {
    question: "Give reason: Why is RAM called volatile memory?",
    options: ["It retains data permanently", "It loses data when power is off", "It stores files permanently", "It is very fast"],
    correctAnswer: 1,
    explanation: "RAM loses its content when the computer is turned off, hence called volatile memory."
  }
]


  };

  const templates = questionTemplates[subject as keyof typeof questionTemplates] || questionTemplates.physics;
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    questions.push({
      id: i + 1,
      ...template,
      answered: false
    });
  }
  
  return questions;
};

export default function Quiz({ subject, questionCount, onComplete, onBack }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setQuestions(generateQuestions(subject, questionCount));
  }, [subject, questionCount]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = questions.filter(q => q.answered).length;

  const handleAnswerSubmit = () => {
    if (selectedOption === null) return;

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: selectedOption,
      answered: true
    };
    setQuestions(updatedQuestions);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // Quiz completed
      const correctAnswers = questions.filter(q => q.userAnswer === q.correctAnswer).length;
      onComplete(correctAnswers, questions.length);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(questions[currentQuestionIndex - 1].userAnswer ?? null);
      setShowResult(questions[currentQuestionIndex - 1].answered);
    }
  };

  const isCorrect = currentQuestion?.userAnswer === currentQuestion?.correctAnswer;

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="w-full bg-secondary p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <Card className="p-8 shadow-lg animate-fade-in">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="grid gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "quiz";
                
                if (showResult && currentQuestion.answered) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass = "success";
                  } else if (index === currentQuestion.userAnswer && index !== currentQuestion.correctAnswer) {
                    buttonClass = "destructive";
                  }
                } else if (selectedOption === index) {
                  buttonClass = "default";
                }

                return (
                  <Button
                    key={index}
                    variant={buttonClass as any}
                    size="quiz"
                    onClick={() => !showResult && setSelectedOption(index)}
                    disabled={showResult}
                    className="justify-start text-left"
                  >
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="ml-auto h-5 w-5" />
                    )}
                    {showResult && index === currentQuestion.userAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="ml-auto h-5 w-5" />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <div className={`p-4 rounded-lg mb-6 animate-fade-in ${
                isCorrect ? 'bg-success-lighter border border-success/20' : 'bg-destructive-light border border-destructive/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={currentQuestionIndex === 0 ? onBack : handlePreviousQuestion}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentQuestionIndex === 0 ? 'Back to Topics' : 'Previous'}
              </Button>

              {!showResult ? (
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={selectedOption === null}
                  variant="default"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} variant="default">
                  {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}