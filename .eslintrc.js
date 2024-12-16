module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    extends: [
        'airbnb-base', // Базовая конфигурация AirBnB
        'plugin:@typescript-eslint/recommended', // Рекомендуемые правила для TypeScript
        'plugin:import/typescript', // Поддержка TypeScript для плагина import
    ],
    parser: '@typescript-eslint/parser', // Парсер для TypeScript
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json', // Указываем путь к tsconfig.json
    },
    plugins: ['@typescript-eslint', 'import'],
    settings: {
        'import/resolver': {
            typescript: {}, // Используем TypeScript для разрешения импортов
        },
    },
    rules: {
        // Отключаем правило, которое требует расширения .js для импортов
        'import/extensions': 'off',
        // Отключаем правило, которое требует использования `import type` для типов
        '@typescript-eslint/consistent-type-imports': 'off',
        // Отключаем правило, которое требует использования `interface` вместо `type`
        '@typescript-eslint/consistent-type-definitions': 'off',
        // Отключаем правило, которое требует использования `any` только в крайних случаях
        '@typescript-eslint/no-explicit-any': 'off',
        // Отключаем правило, которое требует использования `return` в функциях без возвращаемого значения
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // Отключаем правило, которое требует использования `this` только в методах класса
        '@typescript-eslint/no-invalid-this': 'off',
        // Отключаем правило, которое требует использования `const` вместо `let`
        'prefer-const': 'off',
        // Отключаем правило, которое требует использования `require` вместо `import`
        '@typescript-eslint/no-var-requires': 'off',
    },
};