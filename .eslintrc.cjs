module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: { 
        "project": ["./tsconfig.json"]
    },
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-type-checked"
    ],
    rules: {
        'react/jsx-filename-extension': 0,
        'import/no-extraneous-dependencies': 0,
        'import/extensions': 0,
        "@typescript-eslint/no-useless-constructor": "off"
    },
    ignorePatterns: ["build/*", "dist/*", "public/*", "node_modules/*"]
};
