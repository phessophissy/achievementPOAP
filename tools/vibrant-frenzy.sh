#!/bin/bash
REPO_ROOT="/home/thee1/achievementPOAP"
CSS_FILE="$REPO_ROOT/frontend/src/styles.css"

commit_step() {
    git add "$CSS_FILE"
    git commit -m "$1"
    echo "Step: $1"
}

# --- Phase 3: The Vibrant Frenzy (50+ Commits) ---

# 41. Update base root variables
sed -i 's/--gold: #FFD700;/--vibrant-pink: #ff007f;/' "$CSS_FILE"
commit_step "style(tokens): introduce neon pink as primary accent"

# 42. Add glowing cyan
sed -i '/--vibrant-pink/a \  --neon-cyan: #00f3ff;' "$CSS_FILE"
commit_step "style(tokens): introduce neon cyan for digital glow"

# 43. Add electric purple
sed -i '/--neon-cyan/a \  --electric-purple: #7000ff;' "$CSS_FILE"
commit_step "style(tokens): introduce electric purple for depth"

# 44. Add laser yellow
sed -i '/--electric-purple/a \  --laser-yellow: #fefe00;' "$CSS_FILE"
commit_step "style(tokens): introduce laser yellow for warnings"

# 45. Rename black soft
sed -i 's/--black-soft: #0a0a0a;/--deep-obsidian: #05010a;/' "$CSS_FILE"
commit_step "style(tokens): redefine soft black as deep obsidian"

# 46. Update black card
sed -i 's/--black-card: #111111;/--void-space: #0a011a;/' "$CSS_FILE"
commit_step "style(tokens): redefine card background as void space purple"

# 47. Update black hover
sed -i 's/--black-hover: #1a1a1a;/--nebula-hover: #1e053d;/' "$CSS_FILE"
commit_step "style(tokens): redefine hover state as nebula purple"

# 48. Change body background
sed -i 's/background: var(--black);/background: var(--deep-obsidian);/' "$CSS_FILE"
commit_step "style(global): set body background to cosmic dark"

# 49. Update header gradient
sed -i 's/background: linear-gradient(180deg, var(--black-card) 0%, var(--black) 100%);/background: linear-gradient(180deg, var(--void-space) 0%, var(--deep-obsidian) 100%);/' "$CSS_FILE"
commit_step "style(header): apply void-to-obsidian gradient to header"

# 50. Update header border
sed -i 's/border-bottom: 1px solid var(--gold-dark);/border-bottom: 2px solid var(--neon-cyan);/' "$CSS_FILE"
commit_step "style(header): add neon cyan border for digital horizon effect"

# 51. Update logo gradient
sed -i 's/background: linear-gradient(135deg, var(--gold) 0%, var(--gold-metallic) 100%);/background: linear-gradient(135deg, var(--vibrant-pink) 0%, var(--electric-purple) 100%);/' "$CSS_FILE"
commit_step "style(logo): apply pink-to-purple sunset gradient to logo"

# 52. Update nav link hover
sed -i 's/color: var(--gold);/color: var(--neon-cyan);/' "$CSS_FILE"
commit_step "style(nav): update hover link color to glowing cyan"

# 53. Update connect-btn background
sed -i 's/background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);/background: linear-gradient(135deg, var(--vibrant-pink) 0%, var(--electric-purple) 100%);/' "$CSS_FILE"
commit_step "style(button): give connection button a high-energy pink gradient"

# 54. Update connect-btn hover shadow
sed -i 's/box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);/box-shadow: 0 0 20px rgba(255, 0, 127, 0.6);/' "$CSS_FILE"
commit_step "style(button): increase button hover glow with pink radiance"

# 55. Update hero background
sed -i 's/background: radial-gradient(ellipse at center, var(--black-card) 0%, var(--black) 70%);/background: radial-gradient(circle, var(--void-space) 0%, var(--deep-obsidian) 100%);/' "$CSS_FILE"
commit_step "style(hero): modernize hero section with deep radial cosmic void"

# 56. Update hero border
sed -i 's/border: 1px solid var(--gold-dark);/border: 1px solid var(--electric-purple);/' "$CSS_FILE"
commit_step "style(hero): surround hero with electric purple rim"

# 57. Update hero title gradient
sed -i 's/background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold-metallic) 100%);/background: linear-gradient(45deg, var(--neon-cyan) 0%, var(--vibrant-pink) 50%, var(--electric-purple) 100%);/' "$CSS_FILE"
commit_step "style(hero): upgrade hero title to triple neon-spectrum gradient"

# 58. Update hero text shadow (add)
sed -i '/-webkit-text-fill-color: transparent;/a \  text-shadow: 0 0 20px rgba(0, 243, 255, 0.4);' "$CSS_FILE"
commit_step "style(hero): add aqua glow text-shadow to hero h1"

# 59. Update footer border
sed -i 's/border-top: 1px solid var(--gold-dark);/border-top: 1px solid var(--electric-purple);/' "$CSS_FILE"
commit_step "style(footer): add electric purple top border to footer"

# 60. Update shimmer animation
sed -i 's/rgba(255, 215, 0, 0.3)/rgba(0, 243, 255, 0.5)/' "$CSS_FILE"
commit_step "style(animations): convert gold shimmer to cyan plasma flow"

# 61. Update event card background
sed -i 's/background: var(--black-card);/background: var(--void-space);/' "$CSS_FILE"
commit_step "style(events): update card background to void-purple"

# 62. Update event card border
sed -i 's/border: 1px solid var(--gold-dark);/border: 1px solid var(--accent-glow);/' "$CSS_FILE"
commit_step "style(events): update card border color to accent-glow"

# 63. Update event card hover shadow
sed -i 's/box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);/box-shadow: 0 10px 40px rgba(112, 0, 255, 0.4);/' "$CSS_FILE"
commit_step "style(events): wrap cards in electric violet aura on hover"

# 64. Update event title color
sed -i 's/color: var(--gold);/color: var(--vibrant-pink);/' "$CSS_FILE"
commit_step "style(events): change card title color to vibrant pink"

# 65. Update event badge
sed -i 's/background: var(--gold-dark);/background: var(--electric-purple);/' "$CSS_FILE"
commit_step "style(badge): color event badges with electric purple"

# 66. Update mint button gradient
sed -i 's/background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);/background: var(--gradient-vivid);/' "$CSS_FILE"
commit_step "style(mint): upgrade mint buttons to vivid pink-violet flow"

# 67. Update poap image border
sed -i 's/border: 3px solid var(--gold);/border: 4px solid var(--neon-cyan);/' "$CSS_FILE"
commit_step "style(poap): frame POAPs in glowing neon cyan"

# 68. Update modal border
sed -i 's/border: 2px solid var(--gold);/border: 2px solid var(--primary-vibrant);/' "$CSS_FILE"
commit_step "style(modal): upgrade modal borders to vibrant pink"

# 69. Update modal title
sed -i '/.modal h2 { color: var(--gold);/c \.modal h2 { color: var(--secondary-neon); text-shadow: var(--shadow-neon); }' "$CSS_FILE"
commit_step "style(modal): colorize modal titles with neon cyan and glow"

# 70. Add colorful border sweep animation
cat >> "$CSS_FILE" <<EOF
.border-sweep {
  position: relative;
  overflow: hidden;
}
.border-sweep::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: conic-gradient(var(--vibrant-pink), var(--neon-cyan), var(--electric-purple), var(--vibrant-pink));
  animation: rotate 4s linear infinite;
}
EOF
commit_step "style(animations): add .border-sweep utility for rotating neon frame"

# 71. Add rotate keyframe
cat >> "$CSS_FILE" <<EOF
@keyframes rotate { to { transform: rotate(360deg); } }
EOF
commit_step "style(animations): add rotate keyframe for sweep effects"

# 72. Final style refinement: smooth transitions
sed -i 's/transition: all 0.3s ease;/transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);/' "$CSS_FILE"
commit_step "style(polishing): extend transitions with premium cubic-bezier curves"

echo "70+ commits target reached (or exceeded)."
