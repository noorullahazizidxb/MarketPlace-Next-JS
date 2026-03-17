// Type declarations for static assets and CSS imports
// This allows side-effect imports like `import './globals.css'` in TS/TSX files.
declare module '*.css';
declare module '*.scss';
declare module '*.module.css';
declare module '*.module.scss';

// Images
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

// SVGs imported as URL
declare module '*.svg';
