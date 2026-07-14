import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Turn off stylistic rules that Prettier already enforces.
  prettier,
  {
    rules: {
      // Unused code is dead weight; underscore-prefixed args are allowed
      // for intentionally ignored parameters.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // `any` defeats TypeScript's safety guarantees.
      "@typescript-eslint/no-explicit-any": "error",
      // Keep console output intentional: use the logger instead.
      "no-console": ["error", { allow: ["warn", "error"] }],
      // Prefer `const` so values can't be accidentally reassigned.
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
