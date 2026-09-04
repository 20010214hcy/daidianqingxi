#!/bin/bash
# Fix tailwindcss ESM compatibility in server output
OUTPUT_DIR='.output/server/node_modules/tailwindcss'

if [ -d "$OUTPUT_DIR" ]; then
  # Create colors.mjs if it doesn't exist
  if [ ! -f "$OUTPUT_DIR/colors.mjs" ]; then
    cat > "$OUTPUT_DIR/colors.mjs" << 'MEOF'
const colors = {
  inherit: 'inherit', current: 'currentColor', transparent: 'transparent',
  black: '#000', white: '#fff',
  slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
  gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' },
  blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
  red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a' },
  green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
  yellow: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006' },
}
export default colors
MEOF
    echo 'Created colors.mjs'
  fi

  # Update package.json with exports
  python3 -c "
import json
with open('$OUTPUT_DIR/package.json', 'r') as f:
    pkg = json.load(f)
if 'exports' not in pkg:
    pkg['exports'] = {}
pkg['exports']['./colors'] = {'import': './colors.mjs', 'require': './colors.js'}
with open('$OUTPUT_DIR/package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
print('Updated package.json exports')
"
fi
