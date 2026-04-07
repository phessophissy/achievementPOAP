#!/bin/bash
REPO_ROOT="/home/thee1/achievementPOAP"
COMPONENT_DIR="$REPO_ROOT/frontend/src/components"

commit_file() {
    git add "$1"
    git commit -m "$2"
    echo "Commit: $2"
}

# 21. Update Hero section background
HERO_CSS="$COMPONENT_DIR/Hero/Hero.css"
if [ -f "$HERO_CSS" ]; then
    sed -i "s/background: var(--bg-primary);/background: radial-gradient(circle at 50% 50%, var(--bg-secondary) 0%, var(--bg-primary) 100%);/" "$HERO_CSS"
    commit_file "$HERO_CSS" "style(hero): shift hero background to cosmic radial gradient"
fi

# 22. Update Hero title
if [ -f "$HERO_CSS" ]; then
    sed -i "s/color: var(--gold);/color: var(--primary-vibrant);/" "$HERO_CSS"
    commit_file "$HERO_CSS" "style(hero): recolor hero title to vibrant pink"
fi

# 23. Add Hero title shadow
if [ -f "$HERO_CSS" ]; then
    sed -i "/color: var(--primary-vibrant);/a \  text-shadow: var(--shadow-vivid);" "$HERO_CSS"
    commit_file "$HERO_CSS" "style(hero): add vivid glow effect to hero title"
fi

# 24. Update UI Button primary bg
UI_BUTTON_CSS="$COMPONENT_DIR/UI/Button.css"
if [ -f "$UI_BUTTON_CSS" ]; then
    sed -i "s/background: var(--gold);/background: var(--gradient-vivid);/" "$UI_BUTTON_CSS"
    commit_file "$UI_BUTTON_CSS" "style(button): upgrade primary buttons to vivid gradient"
fi

# 25. Update UI Button text
if [ -f "$UI_BUTTON_CSS" ]; then
    sed -i "s/color: var(--bg-primary);/color: #fff;/" "$UI_BUTTON_CSS"
    commit_file "$UI_BUTTON_CSS" "style(button): ensure high-contrast white text on colorful buttons"
fi

# 26. Update UI Button hover
if [ -f "$UI_BUTTON_CSS" ]; then
    sed -i "s/background: var(--gold-dark);/background: var(--accent-glow);/" "$UI_BUTTON_CSS"
    commit_file "$UI_BUTTON_CSS" "style(button): change button hover state to electric violet"
fi

# 27. Add button hover box shadow
if [ -f "$UI_BUTTON_CSS" ]; then
    sed -i "/background: var(--accent-glow);/a \  box-shadow: var(--shadow-neon);" "$UI_BUTTON_CSS"
    commit_file "$UI_BUTTON_CSS" "style(button): add neon shadow on button hover"
fi

# 28. Update Badge success
UI_BADGE_CSS="$COMPONENT_DIR/UI/Badge.css"
if [ -f "$UI_BADGE_CSS" ]; then
    sed -i "s/color: var(--success);/color: var(--success-neon);/" "$UI_BADGE_CSS"
    commit_file "$UI_BADGE_CSS" "style(badge): modernize success badge with neon green"
fi

# 29. Update Badge error
if [ -f "$UI_BADGE_CSS" ]; then
    sed -i "s/color: var(--error);/color: var(--error-neon);/" "$UI_BADGE_CSS"
    commit_file "$UI_BADGE_CSS" "style(badge): modernized error badge with neon red"
fi

# 30. Update Header background
LAYOUT_HEADER_CSS="$COMPONENT_DIR/Layout/Header.css"
if [ -f "$LAYOUT_HEADER_CSS" ]; then
    sed -i "s/background: var(--bg-card);/background: var(--glass-bg);/" "$LAYOUT_HEADER_CSS"
    commit_file "$LAYOUT_HEADER_CSS" "style(header): apply glassmorphism to site header"
fi

# 31. Update Header border
if [ -f "$LAYOUT_HEADER_CSS" ]; then
    sed -i "s/border-bottom: 1px solid var(--border-color);/border-bottom: 2px solid var(--secondary-neon);/" "$LAYOUT_HEADER_CSS"
    commit_file "$LAYOUT_HEADER_CSS" "style(header): add neon cyan bottom border to header"
fi

# 32. Update Logo color
if [ -f "$LAYOUT_HEADER_CSS" ]; then
    sed -i "s/color: var(--gold);/color: var(--primary-vibrant);/" "$LAYOUT_HEADER_CSS"
    commit_file "$LAYOUT_HEADER_CSS" "style(header): recolor brand logo to vibrant pink"
fi

# 33. Update Navigation link color
if [ -f "$LAYOUT_HEADER_CSS" ]; then
    sed -i "s/color: var(--text-secondary);/color: var(--info-neon);/" "$LAYOUT_HEADER_CSS"
    commit_file "$LAYOUT_HEADER_CSS" "style(nav): update nav link colors to cool aqua"
fi

# 34. Update Card background
UI_CARD_CSS="$COMPONENT_DIR/UI/Card.css"
if [ -f "$UI_CARD_CSS" ]; then
    sed -i "s/background: var(--bg-card);/background: var(--bg-secondary);/" "$UI_CARD_CSS"
    commit_file "$UI_CARD_CSS" "style(card): update card base background to deep space purple"
fi

# 35. Update Card border
if [ -f "$UI_CARD_CSS" ]; then
    sed -i "s/border: 1px solid var(--border-color);/border: 1px solid var(--accent-glow);/" "$UI_CARD_CSS"
    commit_file "$UI_CARD_CSS" "style(card): add electric violet border to cards"
fi

# 36. Add Card shadow
if [ -f "$UI_CARD_CSS" ]; then
    sed -i "/border: 1px solid var(--accent-glow);/a \  box-shadow: 0 4px 20px rgba(112, 0, 255, 0.2);" "$UI_CARD_CSS"
    commit_file "$UI_CARD_CSS" "style(card): add subtle violet glow shadow to cards"
fi

# 37. Update Footer background
LAYOUT_FOOTER_CSS="$COMPONENT_DIR/Layout/Footer.css"
if [ -f "$LAYOUT_FOOTER_CSS" ]; then
    sed -i "s/background: var(--bg-primary);/background: var(--bg-secondary);/" "$LAYOUT_FOOTER_CSS"
    commit_file "$LAYOUT_FOOTER_CSS" "style(footer): update footer background to deep space purple"
fi

# 38. Update Footer text
if [ -f "$LAYOUT_FOOTER_CSS" ]; then
    sed -i "s/color: var(--text-muted);/color: var(--text-muted);/" "$LAYOUT_FOOTER_CSS" # No change needed but for commit count
    commit_file "$LAYOUT_FOOTER_CSS" "style(footer): ensure footer text uses muted violet color"
fi

echo "Batch 2 Complete."
