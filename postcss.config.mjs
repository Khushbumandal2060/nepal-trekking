/**
 * This project uses a plain hand-written stylesheet (globals.css) with no
 * Tailwind/PostCSS transforms, so no plugins are needed.
 *
 * IMPORTANT: Next.js's `find-up` walks parent directories when looking for a
 * PostCSS config. There is a stray `postcss.config.js` (plus tailwind.config.ts)
 * at the D:\ drive root that otherwise gets picked up and tries to load
 * `tailwindcss`. Defining an empty config here overrides it.
 */
export default {
    plugins: {},
};
