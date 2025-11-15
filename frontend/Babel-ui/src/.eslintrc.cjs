module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    settings: {
        react: { version: "detect" }
    },
    env: {
        browser: true,
        node: true,
        es2022: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier" // disables ESLint rules that conflict with Prettier
    ],
    rules: {
        // General
        "eqeqeq": "error",
        "curly": "error",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-debugger": "warn",

        // TypeScript
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-explicit-any": "warn",

        // React
        "react/react-in-jsx-scope": "off", // not needed with React 17+
        "react/prop-types": "off" // using TypeScript types
    }
};
