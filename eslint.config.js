import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";


export default defineConfig([
    { ignores: ["dist/**", "package-lock.json", "src/**"] },  // Ignore src since it has TypeScript syntax
    { files: ["**/*.{js,cjs,mjs}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,cjs,mjs}"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
    { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] },
]);