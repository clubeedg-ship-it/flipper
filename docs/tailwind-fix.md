# Tailwind CSS Padding — Root Cause Investigation

## Problem
Tailwind 4 padding utilities are **not generating CSS at all**.

## Evidence
```js
// Browser console test
const test = document.createElement('div'); 
test.className = 'p-7'; 
document.body.appendChild(test);
getComputedStyle(test).padding  // → "0px"  (should be "28px")

// Same for p-4, px-4, py-1.5, p-1, p-0 — ALL return "0px"
```

- `rounded-xl`, `rounded-2xl`, `text-[#xxx]`, `bg-[#xxx]` DO work
- `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`, `mb-*` do NOT
- Background blur (`backdrop-filter`), shadows, custom keyframes all work

## Environment
- Tailwind CSS 4.3.0
- `@tailwindcss/vite` 4.3.0
- Vite 8.0.12
- `globals.css`: starts with `@import "tailwindcss";`
- `vite.config.ts`: `plugins: [react(), tailwindcss()]`

## Investigation Steps

1. Check if Tailwind CSS is actually generating utility classes:
   - `npm run build` and inspect the output CSS
   - Look for `.p-4`, `.p-7` in the built CSS bundle
   - Check if padding utilities exist in the generated CSS at all

2. Check if something in `globals.css` is overriding padding:
   - `* { padding: 0 }` — verify specificity vs Tailwind utilities
   - Is `@import "tailwindcss"` being processed correctly?

3. Check `@tailwindcss/vite` plugin behavior:
   - Does the Vite plugin scan source files for class names?
   - Is source scanning finding the `p-4`, `p-7` classes in the TSX files?
   - Are there any Vite warnings about missing Tailwind classes?

4. Check Tailwind 4 configuration:
   - Tailwind 4 doesn't use `tailwind.config.js` — it uses CSS-based config
   - Is there any config that might disable spacing utilities?
   - Check the `@import "tailwindcss"` directive resolution

5. Verify with a minimal test:
   - Create a test.html that uses `p-7` directly without the Vite pipeline
   - Or check the dev server's CSS output

6. Check Tailwind 4's preflight/base styles:
   - The `* { padding: 0 }` in globals.css might be conflicting with Tailwind's own reset
   - Tailwind 4's preflight is included via `@import "tailwindcss"` — it has its own reset

7. Try removing `* { padding: 0 }` from globals.css:
   - Tailwind's preflight already includes this
   - The duplicate might be causing issues in the cascade

## Deliverable
Fix the Tailwind configuration so ALL padding/spacing/margin utilities generate correctly. After fixing:
- `npx tsc -b` must pass
- `npm run build` must succeed
- Browser test: `getComputedStyle(document.querySelector('.p-7')).padding` must return non-zero
- All cards must render with proper padding
