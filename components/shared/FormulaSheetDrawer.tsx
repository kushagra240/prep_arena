import React, { useState } from 'react';
import { BookOpen, X, Search, Copy, Check, Info } from 'lucide-react';

interface Formula {
  name: string;
  equation: string;
  description: string;
  latex: string;
}

interface Category {
  title: string;
  icon: string;
  formulas: Formula[];
}

const FORMULA_DATABASE: Record<string, Category[]> = {
  physics: [
    {
      title: 'Force, Work, Power & Energy',
      icon: '⚡',
      formulas: [
        { name: 'Moment of a Force (Torque)', equation: 'τ = F × d', description: 'Force multiplied by perpendicular distance from pivot.', latex: '\\tau = F \\times d' },
        { name: 'Mechanical Advantage (MA)', equation: 'MA = Load / Effort', description: 'Ratio of load to effort for any machine.', latex: 'MA = \\frac{\\text{Load}}{\\text{Effort}}' },
        { name: 'Velocity Ratio (VR)', equation: 'VR = d_e / d_l', description: 'Distance moved by effort / distance moved by load.', latex: 'VR = \\frac{d_e}{d_l}' },
        { name: 'Efficiency (η)', equation: 'η = MA / VR', description: 'Ratio of mechanical advantage to velocity ratio.', latex: '\\eta = \\frac{MA}{VR}' },
        { name: 'Kinetic Energy (KE)', equation: 'K = ½ m v²', description: 'Energy possessed by a body due to its motion.', latex: 'K = \\frac{1}{2}mv^2' },
      ]
    },
    {
      title: 'Light & Optics',
      icon: '📐',
      formulas: [
        { name: 'Refractive Index (μ)', equation: 'μ = sin i / sin r', description: 'Snell\'s Law: ratio of sine of incidence to refraction.', latex: '\\mu = \\frac{\\sin i}{\\sin r}' },
        { name: 'Lens Formula', equation: '1/f = 1/v - 1/u', description: 'Relation between focal length, image distance, and object distance.', latex: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}' },
        { name: 'Linear Magnification (m)', equation: 'm = v / u', description: 'Ratio of height/distance of image to object.', latex: 'm = \\frac{v}{u}' },
        { name: 'Power of a Lens (P)', equation: 'P = 1 / f (in meters)', description: 'Reciprocal of focal length in meters (unit: Dioptre).', latex: 'P = \\frac{1}{f \\text{ (m)}}' }
      ]
    },
    {
      title: 'Electricity & Electromagnetism',
      icon: '💡',
      formulas: [
        { name: 'Ohm\'s Law', equation: 'V = I × R', description: 'Potential difference directly proportional to current.', latex: 'V = I \\times R' },
        { name: 'Series Resistance', equation: 'R_s = R₁ + R₂ + R₃', description: 'Equivalent resistance in series placement.', latex: 'R_s = R_1 + R_2 + R_3' },
        { name: 'Parallel Resistance', equation: '1/R_p = 1/R₁ + 1/R₂', description: 'Equivalent resistance in parallel placement.', latex: '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}' },
        { name: 'Electrical Energy (W)', equation: 'W = V × I × t', description: 'Work done by electric current over time.', latex: 'W = V \\times I \\times t' },
        { name: 'Joule\'s Heating Law', equation: 'H = I² × R × t', description: 'Heat generated in a resistor.', latex: 'H = I^2 \\times R \\times t' }
      ]
    }
  ],
  mathematics: [
    {
      title: 'Algebra & Quadratics',
      icon: '🔢',
      formulas: [
        { name: 'Quadratic Formula', equation: 'x = [-b ± √(b²-4ac)] / 2a', description: 'Roots of a quadratic equation ax² + bx + c = 0.', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
        { name: 'Discriminant (D)', equation: 'D = b² - 4ac', description: 'Determines nature of roots (real, equal, imaginary).', latex: 'D = b^2 - 4ac' },
        { name: 'Arithmetic Progression (nth term)', equation: 'a_n = a + (n-1)d', description: 'nth term of an arithmetic sequence.', latex: 'a_n = a + (n-1)d' },
        { name: 'AP Sum of n terms', equation: 'S_n = n/2 [2a + (n-1)d]', description: 'Sum of first n terms of an AP.', latex: 'S_n = \\frac{n}{2}[2a + (n-1)d]' }
      ]
    },
    {
      title: 'Coordinate Geometry',
      icon: '🗺️',
      formulas: [
        { name: 'Distance Formula', equation: 'd = √[(x₂-x₁)² + (y₂-y₁)²]', description: 'Distance between points (x₁,y₁) and (x₂,y₂).', latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}' },
        { name: 'Section Formula (Internal)', equation: 'P = [(mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)]', description: 'Coordinates dividing line segment in ratio m:n.', latex: 'P = \\left(\\frac{mx_2+nx_1}{m+n}, \\frac{my_2+ny_1}{m+n}\\right)' },
        { name: 'Slope of a Line (m)', equation: 'm = (y₂-y₁) / (x₂-x₁)', description: 'Tangent of angle of inclination of line.', latex: 'm = \\frac{y_2-y_1}{x_2-x_1}' },
        { name: 'Equation of a Line (Slope-Intercept)', equation: 'y = mx + c', description: 'Line equation with slope m and y-intercept c.', latex: 'y = mx + c' }
      ]
    },
    {
      title: 'Mensuration',
      icon: '📐',
      formulas: [
        { name: 'Cylinder Volume', equation: 'V = π r² h', description: 'Volume of solid circular cylinder.', latex: 'V = \\pi r^2 h' },
        { name: 'Cone Volume', equation: 'V = ⅓ π r² h', description: 'Volume of solid circular cone.', latex: 'V = \\frac{1}{3}\\pi r^2 h' },
        { name: 'Sphere Surface Area', equation: 'A = 4 π r²', description: 'Total surface area of sphere.', latex: 'A = 4\\pi r^2' },
        { name: 'Sphere Volume', equation: 'V = 4/3 π r³', description: 'Volume of solid sphere.', latex: 'V = \\frac{4}{3}\\pi r^3' }
      ]
    }
  ]
};

const BOARD_CONSTANTS = [
  { name: 'Acceleration due to gravity (g)', value: '9.8 m/s² (or 10 m/s²)', unit: 'Acceleration' },
  { name: 'Specific heat capacity of water', value: '4200 J/kg°C (or 1 cal/g°C)', unit: 'Thermodynamics' },
  { name: 'Speed of light in vacuum (c)', value: '3 × 10⁸ m/s', unit: 'Optics' },
  { name: 'Charge of an electron (e)', value: '1.6 × 10⁻¹⁹ C', unit: 'Electricity' },
  { name: 'Density of water', value: '1000 kg/m³ (or 1 g/cm³)', unit: 'Mechanics' }
];

export function FormulaSheetDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'physics' | 'mathematics' | 'constants'>('physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  React.useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-formula-drawer', handleToggle);
    return () => window.removeEventListener('toggle-formula-drawer', handleToggle);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getFilteredFormulas = () => {
    if (activeTab === 'constants') {
      return BOARD_CONSTANTS.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const categories = FORMULA_DATABASE[activeTab] || [];
    return categories.map(cat => ({
      ...cat,
      formulas: cat.formulas.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.equation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.formulas.length > 0);
  };

  const filteredData = getFilteredFormulas();

  return (
    <>
      {/* Floating Magic Book Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary bg-primary text-white hover:bg-primary-hover shadow-glow px-4 py-3.5 font-space font-extrabold text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-1"
      >
        <BookOpen size={16} className="animate-pulse" />
        <span className="hidden sm:inline">Board Reference</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        ></div>
      )}

      {/* Drawer Container */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-bgSecondary border-l border-borderColor z-50 shadow-wrongGlow transition-transform duration-300 transform flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-borderColor flex items-center justify-between bg-bgPrimary/60">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="font-space font-black text-white text-sm uppercase tracking-wider">
              Board Grimoire
            </h3>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg border border-borderColor hover:bg-bgTertiary text-textSecondary hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="grid grid-cols-3 border-b border-borderColor bg-bgPrimary/30 p-1.5 gap-1">
          {(['physics', 'mathematics', 'constants'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery('');
              }}
              className={`py-2 rounded-lg font-space text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow' 
                  : 'text-textSecondary hover:text-white border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Toolbar */}
        <div className="p-3 border-b border-borderColor bg-bgPrimary/10">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-textMuted" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-borderColor bg-bgPrimary/60 py-2 pl-9 pr-4 font-space text-xs text-white placeholder-textMuted focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-bgPrimary/25 custom-scrollbar">
          
          {activeTab === 'constants' ? (
            /* Constants List */
            <div className="space-y-3">
              {(filteredData as typeof BOARD_CONSTANTS).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-borderColor bg-bgSecondary/40 space-y-1.5 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-space text-[10px] font-bold text-primary uppercase tracking-wide">
                      {item.unit}
                    </span>
                    <button
                      onClick={() => handleCopy(item.value, `c-${idx}`)}
                      className="p-1 rounded text-textMuted hover:text-white transition-colors"
                      title="Copy Constant"
                    >
                      {copiedIndex === `c-${idx}` ? <Check size={12} className="text-correct" /> : <Copy size={12} />}
                    </button>
                  </div>
                  
                  <h4 className="font-space text-xs font-bold text-white leading-tight">
                    {item.name}
                  </h4>
                  <div className="font-mono text-xs font-black text-amberGold pt-1">
                    {item.value}
                  </div>
                </div>
              ))}
              
              {filteredData.length === 0 && (
                <div className="text-center font-space text-xs text-textMuted py-8">
                  No constants found matching "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            /* Formulas Categories */
            <div className="space-y-5">
              {(filteredData as typeof FORMULA_DATABASE['physics']).map((category, catIdx) => (
                <div key={catIdx} className="space-y-3">
                  <h4 className="font-space text-[10px] font-bold text-textMuted uppercase tracking-widest flex items-center gap-1.5 pl-1">
                    <span>{category.icon}</span>
                    <span>{category.title}</span>
                  </h4>
                  
                  <div className="space-y-3">
                    {category.formulas.map((f, formulaIdx) => {
                      const copyId = `${catIdx}-${formulaIdx}`;
                      return (
                        <div key={formulaIdx} className="p-3 rounded-xl border border-borderColor bg-bgSecondary/40 space-y-2 relative group hover:border-primary/50 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <h5 className="font-space text-xs font-bold text-white pr-6">
                              {f.name}
                            </h5>
                            
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleCopy(f.latex, `latex-${copyId}`)}
                                className="px-1.5 py-0.5 rounded border border-borderColor text-[9px] font-space text-textMuted hover:text-white transition-colors uppercase tracking-wider"
                                title="Copy LaTeX Formula"
                              >
                                {copiedIndex === `latex-${copyId}` ? 'Copied!' : 'LaTeX'}
                              </button>
                              
                              <button
                                onClick={() => handleCopy(f.equation, `eq-${copyId}`)}
                                className="p-1 rounded text-textMuted hover:text-white transition-colors"
                                title="Copy Text Formula"
                              >
                                {copiedIndex === `eq-${copyId}` ? <Check size={11} className="text-correct" /> : <Copy size={11} />}
                              </button>
                            </div>
                          </div>

                          <div className="font-mono text-xs font-black text-amberGold bg-bgPrimary/60 p-2 rounded border border-borderColor/40 shadow-inner">
                            {f.equation}
                          </div>

                          <p className="font-space text-[10px] text-textSecondary leading-relaxed">
                            {f.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {filteredData.length === 0 && (
                <div className="text-center font-space text-xs text-textMuted py-8">
                  No formulas found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-borderColor bg-bgPrimary/60 flex gap-2 items-center text-[10px] font-space text-textMuted leading-relaxed">
          <Info size={12} className="text-primary shrink-0 animate-pulse" />
          <span>Formulas comply with Selina Concise, Frank, and CISCE textbook syllabi.</span>
        </div>

      </div>
    </>
  );
}
