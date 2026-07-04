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
  pluginReact.configs.flat["jsx-runtime"],

  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);