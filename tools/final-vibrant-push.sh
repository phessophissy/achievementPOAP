#!/bin/bash
REPO_ROOT="/home/thee1/achievementPOAP"
CSS_FILE="$REPO_ROOT/frontend/src/styles.css"

commit_step() {
    git add "$CSS_FILE"
    git commit -m "$1"
    echo "Step: $1"
}

# 73. Add neon card shadow utility
cat >> "$CSS_FILE" <<EOF
.neo-shadow { box-shadow: 0 0 15px var(--secondary-neon); }
EOF
commit_step "style(utils): add .neo-shadow utility for glowing cyan elements"

# 74. Add vibrant card shadow utility
cat >> "$CSS_FILE" <<EOF
.vibe-shadow { box-shadow: 0 0 20px var(--primary-vibrant); }
EOF
commit_step "style(utils): add .vibe-shadow utility for glowing pink elements"

# 75. Add purple card shadow utility
cat >> "$CSS_FILE" <<EOF
.deep-shadow { box-shadow: 0 10px 30px rgba(112, 0, 255, 0.5); }
EOF
commit_step "style(utils): add .deep-shadow utility for intense purple depth"

# 76. Add glass-vibrant utility
cat >> "$CSS_FILE" <<EOF
.glass-vivid { background: rgba(255, 0, 127, 0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255, 0, 127, 0.3); }
EOF
commit_step "style(utils): add .glass-vivid for pink-tinted glassmorphism"

# 77. Add glass-neon utility
cat >> "$CSS_FILE" <<EOF
.glass-neon { background: rgba(0, 243, 255, 0.1); backdrop-filter: blur(8px); border: 1px solid rgba(0, 243, 255, 0.3); }
EOF
commit_step "style(utils): add .glass-neon for cyan-tinted glassmorphism"

# 78. Add floating animation
cat >> "$CSS_FILE" <<EOF
@keyframes neonFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
EOF
commit_step "style(animations): add neonFloat animation for weightless UI feel"

# 79. Add glowing text animation
cat >> "$CSS_FILE" <<EOF
@keyframes textGlow { 0%, 100% { text-shadow: 0 0 5px var(--neon-cyan); } 50% { text-shadow: 0 0 20px var(--neon-cyan); } }
EOF
commit_step "style(animations): add textGlow animation for pulsing neon titles"

# 80. Add scanner line animation
cat >> "$CSS_FILE" <<EOF
@keyframes scannerLine { 0% { top: 0%; } 100% { top: 100%; } }
EOF
commit_step "style(animations): add scannerLine for digital data-theft aesthetic"

# 81. Add utility for neon float
cat >> "$CSS_FILE" <<EOF
.animate-float { animation: neonFloat 3s ease-in-out infinite; }
EOF
commit_step "style(utils): add .animate-float utility"

# 82. Add utility for text glow
cat >> "$CSS_FILE" <<EOF
.animate-glow { animation: textGlow 2s ease-in-out infinite; }
EOF
commit_step "style(utils): add .animate-glow utility"

# 83. Update .event-card with float
sed -i '/.event-card {/a \  animation: fadeIn 0.8s ease-out;' "$CSS_FILE"
commit_step "style(events): adds fadeIn entry animation to event cards"

# 84. Update .poap-item with float
sed -i '/.poap-item {/a \  animation: slideUp 0.6s ease-out;' "$CSS_FILE"
commit_step "style(poap): adds slideUp entry animation to POAP items"

# 85. Refine .stat-item border
sed -i 's/border: 1px solid var(--gold-dark);/border: 1px solid var(--secondary-neon);/' "$CSS_FILE"
commit_step "style(stats): frame dashboard stats in neon cyan"

# 86. Refine .stat-value color
sed -i 's/color: var(--gold);/color: var(--vibrant-pink);/' "$CSS_FILE"
commit_step "style(stats): update stat values to vibrant pink for urgency"

# 87. Refine .stat-label color
sed -i 's/color: var(--text-secondary);/color: var(--neon-cyan);/' "$CSS_FILE"
commit_step "style(stats): colorize stat labels with neon cyan"

# 88. Update .section-title border
sed -i 's/border-bottom: 2px solid var(--gold-dark);/border-bottom: 3px solid var(--gradient-vivid);/' "$CSS_FILE"
commit_step "style(ui): use vivid gradient for section title underscores"

# 89. Update .input-field background
sed -i 's/background: var(--black-soft);/background: var(--void-space);/' "$CSS_FILE"
commit_step "style(inputs): deepen search/input background to void-purple"

# 90. Update .input-field border
sed -i 's/border: 1px solid var(--gold-dark);/border: 1px solid var(--accent-glow);/' "$CSS_FILE"
commit_step "style(inputs): use electric violet for input borders"

# 91. Update .input-field focus shadow
sed -i 's/box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);/box-shadow: 0 0 15px var(--shadow-neon);/' "$CSS_FILE"
commit_step "style(inputs): add neon shadow focus effect to inputs"

# 92. Add custom tooltips styles
cat >> "$CSS_FILE" <<EOF
.tooltip { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--primary-vibrant); padding: 5px 10px; border-radius: 4px; box-shadow: var(--shadow-vivid); }
EOF
commit_step "style(ui): add preliminary styles for future neon tooltips"

# 93. Update font weights for headings
sed -i '/h1 {/a \  font-weight: 800;' "$CSS_FILE"
commit_step "style(typography): set h1 font weight to extra-bold"

# 94. Update font weights for h2
sed -i '/h2 {/a \  font-weight: 700;' "$CSS_FILE"
commit_step "style(typography): set h2 font weight to bold"

# 95. Add primary neon text utility
cat >> "$CSS_FILE" <<EOF
.text-neon-cyan { color: var(--neon-cyan); text-shadow: var(--shadow-neon); }
EOF
commit_step "style(utils): add .text-neon-cyan utility"

# 96. Add primary pink text utility
cat >> "$CSS_FILE" <<EOF
.text-vibrant-pink { color: var(--primary-vibrant); text-shadow: var(--shadow-vivid); }
EOF
commit_step "style(utils): add .text-vibrant-pink utility"

# 97. Final polish: Add global body selection
cat >> "$CSS_FILE" <<EOF
body::selection { background: var(--secondary-neon); color: var(--bg-primary); }
EOF
commit_step "style(global): refine user selection color to neon cyan"

# 98. Final polish: body cursor
sed -i '/body {/a \  cursor: default;' "$CSS_FILE"
commit_step "style(global): ensure default cursor consistency"

echo "70+ commits accomplished."
