#!/bin/bash
# Script to perform atomic colorful UI changes and commit them one by one.

REPO_ROOT="/home/thee1/achievementPOAP"
CSS_FILE="$REPO_ROOT/frontend/src/styles/index.css"

# Function to commit change
commit_change() {
    git add "$CSS_FILE"
    git commit -m "$1"
    echo "Commit: $1"
}

# 3. Add glow variables
sed -i '/--text-neon/a \  --shadow-neon: 0 0 10px rgba(0, 243, 255, 0.8);\n  --shadow-vivid: 0 0 15px rgba(255, 0, 127, 0.9);' "$CSS_FILE"
commit_change "style(theme): add neon and vivid glow shadow variables"

# 4. Add glassmorphism variables
sed -i '/--shadow-vivid/a \  --glass-bg: rgba(18, 3, 38, 0.7);\n  --glass-border: rgba(0, 243, 255, 0.2);' "$CSS_FILE"
commit_change "style(theme): define glassmorphism background and border variables"

# 5. Update success color to neon
sed -i 's/--success: #10B981;/--success: #39ff14;/' "$CSS_FILE"
commit_change "style(colors): update success color to neon green"

# 6. Update error color to neon
sed -i 's/--error: #EF4444;/--error: #ff3131;/' "$CSS_FILE"
commit_change "style(colors): update error color to neon red"

# 7. Add primary vivid gradient
sed -i '/--info-bg/a \  --gradient-vivid: linear-gradient(45deg, var(--primary-vibrant), var(--accent-glow));' "$CSS_FILE"
commit_change "style(gradients): add primary vivid linear gradient"

# 8. Add secondary neon gradient
sed -i '/--gradient-vivid/a \  --gradient-neon: linear-gradient(135deg, var(--secondary-neon), var(--info-neon));' "$CSS_FILE"
commit_change "style(gradients): add secondary neon linear gradient"

# 9. Update Heading 1 color
sed -i 's/h1 { font-size: 2.5rem; }/h1 { font-size: 2.5rem; color: var(--primary-vibrant); text-shadow: var(--shadow-vivid); }/' "$CSS_FILE"
commit_change "style(typography): enhance h1 with vibrant color and glow shadow"

# 10. Update Heading 2 color
sed -i 's/h2 { font-size: 2rem; }/h2 { font-size: 2rem; color: var(--secondary-neon); text-shadow: var(--shadow-neon); }/' "$CSS_FILE"
commit_change "style(typography): enhance h2 with neon color and shadow"

# 11. Add animation for vibrant pulse
cat >> "$CSS_FILE" <<EOF
@keyframes vibrantPulse {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.02); filter: brightness(1.2); }
  100% { transform: scale(1); filter: brightness(1); }
}
EOF
commit_change "style(animations): add vibrantPulse keyframes"

# 12. Add neon border animation
cat >> "$CSS_FILE" <<EOF
@keyframes neonBorderGlow {
  0% { border-color: var(--secondary-neon); box-shadow: 0 0 5px var(--secondary-neon); }
  50% { border-color: var(--primary-vibrant); box-shadow: 0 0 15px var(--primary-vibrant); }
  100% { border-color: var(--secondary-neon); box-shadow: 0 0 5px var(--secondary-neon); }
}
EOF
commit_change "style(animations): add neonBorderGlow keyframes"

# 13. Update link hover effect
sed -i 's/a:hover {/a:hover { text-shadow: var(--shadow-neon);/' "$CSS_FILE"
commit_change "style(links): add neon glow on hover"

# 14. Update input focus ring
sed -i 's/border-color: var(--gold);/border-color: var(--secondary-neon);/' "$CSS_FILE"
commit_change "style(inputs): update focus border color to neon"

# 15. Update input focus shadow
sed -i 's/box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);/box-shadow: var(--shadow-neon);/' "$CSS_FILE"
commit_change "style(inputs): enrich input focus with neon shadow"

# 16. Change selection background
sed -i 's/background: var(--gold);/background: var(--primary-vibrant);/' "$CSS_FILE"
commit_change "style(ui): update selection background to vibrant pink"

# 17. Update scrollbar thumb
sed -i 's/background: var(--gold-dark);/background: var(--accent-glow);/' "$CSS_FILE"
commit_change "style(ui): colorful scrollbar thumb (violet pulse)"

# 18. Update scrollbar thumb hover
sed -i 's/background: var(--gold);/background: var(--primary-vibrant);/' "$CSS_FILE"
commit_change "style(ui): colorful scrollbar thumb hover (pink)"

# 19. Add glow utility class
cat >> "$CSS_FILE" <<EOF
.glow-primary { text-shadow: var(--shadow-vivid); color: var(--primary-vibrant); }
EOF
commit_change "style(utils): add .glow-primary utility class"

# 20. Add glass utility enhancement
sed -i 's/background: rgba(26, 26, 26, 0.8);/background: var(--glass-bg); border-color: var(--glass-border);/' "$CSS_FILE"
commit_change "style(utils): modernize .glass utility with purple tones"

echo "Phase 1 & 2 complete. Proceeding with remaining steps..."
