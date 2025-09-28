import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import plugin from "@hapi/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["**/*.js"],
    extends: [plugin.configs.recommended],
  },
]);
