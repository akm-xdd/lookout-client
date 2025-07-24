import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
// 1. Import the plugin itself:
import pluginUnusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // keep your Next.js presets
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.[jt]s?(x)"],

    // 2. Provide the plugin under `plugins` as an object:
    plugins: {
      "unused-imports": pluginUnusedImports
    },

    rules: {
      // 3. Turn off the TS rule, and let unused‑imports handle it:
      "@typescript-eslint/no-unused-vars": "off",

      // Remove unused imports automatically:
      "unused-imports/no-unused-imports": "error",
      // Warn on unused vars (with your underscore-ignores):
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],

      // Keep your other overrides:
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
    }
  }
];

export default eslintConfig;
