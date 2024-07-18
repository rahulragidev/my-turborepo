module.exports = {
    env: {
        es6: true,
        node: true
    },
    root: true,
    parser: "@typescript-eslint/parser",

    plugins: [
        "@typescript-eslint",
        "unicorn",
        "eslint-plugin-promise",
        "sort-imports-es6-autofix"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    rules: {
        "no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
        "no-nested-ternary": "off",

        "no-return-await": "off",

        "@typescript-eslint/no-unused-vars": [
            "error",
            { vars: "all", args: "all", argsIgnorePattern: "^_" }
        ],
        "unicorn/filename-case": [
            "error",
            {
                case: "kebabCase",
                ignore: [".md$", ".tsx$"]
            }
        ],
        "unicorn/better-regex": "error",
        "unicorn/consistent-destructuring": "error",
        "unicorn/explicit-length-check": "error",
        "unicorn/no-nested-ternary": "error",
        "unicorn/no-unsafe-regex": "error",
        "unicorn/prefer-array-find": "error",
        "unicorn/prefer-array-flat": "error",
        "unicorn/prefer-array-flat-map": "error",
        "unicorn/prefer-array-index-of": "error",
        "unicorn/prefer-date-now": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-keyboard-event-key": "warn",
        "unicorn/prefer-spread": "error",
        "unicorn/prefer-string-replace-all": "error",
        "unicorn/prefer-string-slice": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-ternary": "error",
        "unicorn/prevent-abbreviations": "error",

        "promise/prefer-await-to-callbacks": "error",
        "promise/prefer-await-to-then": "error",
        "promise/valid-params": "error",
        "promise/no-promise-in-callback": "error",
        "promise/catch-or-return": "error",

        "sort-imports-es6-autofix/sort-imports-es6": [
            "warn",
            {
                ignoreCase: false,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "single", "multiple"]
            }
        ],

        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
}
