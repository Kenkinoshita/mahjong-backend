import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // JSの推奨ルール
  eslint.configs.recommended,

  // TSの推奨ルール
  ...tseslint.configs.recommended,

  // Type-aware（型情報あり）ルールを TS ファイルにだけ適用
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ...c.languageOptions,
      parserOptions: {
        ...c.languageOptions?.parserOptions,
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname, // ESM前提で安定させる
      },
    },
  })),

  // あなたのプロジェクト固有ルール（TSファイルだけ）
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // JS版を無効化し、TS版を使う（recommendedで入ることもあるが明示）
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // これが欲しいなら warn ではなく error にすることが多い
      '@typescript-eslint/consistent-type-imports': 'error',

      // Nodeバックエンドなら console は普通に使うので warn は好み
      'no-console': 'warn',

      // 相対パス（./ と ../）を全面禁止
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./**', '../**'],
              message: '相対パスは禁止です。エイリアス（@/）を使ってください。',
            },
          ],
        },
      ],
    },
  },

  // Prettier と衝突する ESLint ルールを最後に無効化
  prettierConfig,
];
