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

環境を指定しない場合は `.env`、`--env=dev` を指定した場合は `.env.dev` を読み込みます。
`.env.sample` を `.env.dev` や `.env.prod` にコピーし、各環境の接続情報を設定してください。
指定ファイルが存在しない場合はエラーで終了します。環境別ファイルは Git の管理対象外です。
シェルなどで既に設定されている環境変数は、ファイル内の値より優先されます。
`--env` はファイルを選択する指定であり、`NODE_ENV` は各ファイル内で設定します。

### クエリ作成

```bash
npm run migration:generate -- src/dataSource/migrations/initial --env=dev
```

### クエリ実行

```bash
npm run migration:run
npm run migration:run -- --env=dev
npm run migration:run -- --env=prod
```

### リバート

```bash
npm run migration:revert -- --env=dev
```

## 注意

- `better-sqlite3` はネイティブビルドを行うため、環境にビルドツールが必要です（macOS では Xcode Command Line Tools など）。
