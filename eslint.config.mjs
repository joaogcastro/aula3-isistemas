import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    languageOptions: { 
      globals: {
        ...globals.browser,
        process: true,
      },
    },
  },
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Adiciona o contexto de globals.node
      },
    },
  },
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"] 
  },
]);