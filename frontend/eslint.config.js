import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/**",
      ".vite/**",
      "coverage/**",
      "node_modules/**",
    ],
  },
  
  js.configs.recommended,

  pluginReact.configs.flat.recommended,
  { files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script",
    },
  },
]);