# mahjong-backend

麻雀管理アプリのバックエンドです。

## 構成

- フレームワーク: `hono`
- ORM: `typeorm` (better-sqlite3)
- テスト: `vitest`
- フォーマッタ: `prettier`
- Lint: `eslint` (flat config)
- フック: `husky` + `lint-staged`

## セットアップ

```bash
npm install
```

## 開発

```bash
cmd/port-foward/dev.sh #踏み台サーバーを経由してDBにアクセスするため
npm run dev
```

## ビルド

```bash
npm run build
```

## テスト

```bash
npm test
```

## マイグレーション

### クエリ作成

```bash
npm run migration:generate -n <migration-name>
```

### クエリ実行

```bash
npm run migration:run
```

### リバート

```bash
npm run migration:revert
```

## 注意

- `better-sqlite3` はネイティブビルドを行うため、環境にビルドツールが必要です（macOS では Xcode Command Line Tools など）。
