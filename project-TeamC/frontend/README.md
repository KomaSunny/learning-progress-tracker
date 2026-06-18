# 学習進捗管理アプリ フロントエンド

このディレクトリは、学習進捗管理アプリのフロントエンドを管理します。

Next.js App Router を使用し、ログイン、ログアウト、学習報告の投稿、投稿一覧、投稿詳細・編集、講師向け画面などを実装しています。

## 使用技術

| 種類           | 技術                       |
| -------------- | -------------------------- |
| フレームワーク | Next.js                    |
| UI ライブラリ  | React                      |
| 言語           | TypeScript                 |
| スタイリング   | Tailwind CSS / CSS Modules |
| 状態管理       | Zustand                    |
| API通信        | Axios                      |
| フォーム       | react-hook-form            |
| バリデーション | zod                        |
| カレンダー     | react-calendar             |
| パッケージ管理 | pnpm                       |
| Lint           | ESLint                     |

## 前提

- Docker Desktopが起動していること
- Docker Composeを利用できること
- フロントエンド、バックエンド、DBはDocker Composeで起動する

フロントエンドコンテナではNode.js 22とpnpmを使用します。

Dockerを使用せずフロントエンドをローカルで直接実行する場合は、`package.json`の`packageManager`に従い、`pnpm@11.5.2`を使用します。

## セットアップ手順

### 1. プロジェクトルートへ移動する

```bash
cd project-TeamC
```

### 2. 環境変数を確認する

フロントエンドでは、以下の環境変数を使用してバックエンドAPIへ接続します。

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Docker Compose利用時は、Composeまたは環境変数ファイルに設定された値を使用します。

### 3. Docker Composeで起動する

フロントエンド、バックエンド、DBをまとめて起動します。

```bash
docker compose up --build
```

バックグラウンドで起動する場合は、以下を実行します。

```bash
docker compose up -d --build
```

### 4. 起動状態を確認する

```bash
docker compose ps
```

`frontend`、`backend`、`db`が起動状態になっていれば準備完了です。

### 5. アプリを開く

フロントエンド：

```text
http://localhost:3000
```

バックエンドのSwagger UI：

```text
http://localhost:8000/docs
```

### ローカルでフロントエンドを直接実行する場合

通常はDocker Composeで起動しますが、フロントエンドだけをローカルで直接実行する場合は、`frontend`ディレクトリで依存関係をインストールします。

```bash
cd frontend
pnpm install
pnpm dev
```

## 開発環境とよく使うコマンド

以下は、フロントエンドをローカルで直接実行する場合に、`frontend`ディレクトリで使用するコマンドです。事前に`pnpm install`を実行してください。

> Windows環境で`pnpm`が認識されない場合は、`pnpm.cmd`へ読み替えてください。

### 開発サーバーを起動する

```bash
pnpm dev
```

Next.js の開発サーバーを起動します。

ブラウザで以下を開きます。

```text
http://localhost:3000
```

### 本番用ビルドを確認する

```bash
pnpm build
```

TypeScript や Next.js のビルドエラーがないか確認します。

### ビルド済みアプリを起動する

```bash
pnpm start
```

`pnpm build` 実行後に、本番モードでアプリを起動します。

### ESLint を実行する

```bash
pnpm lint
```

`src` 配下のコードに構文エラーや未使用 import などがないか確認します。

### 依存関係を確認する

```bash
pnpm list
```

インストール済みのパッケージを確認します。

特定のパッケージを確認する場合は、以下のように実行します。

```bash
pnpm list axios zustand
```

## 動作確認用アカウント

> 以下はローカル開発・動作確認用のseedデータです。本番環境では使用しません。

バックエンドのseedデータが投入されている場合、以下のアカウントで確認できます。

### studentユーザー

```text
email: user@example.com
password: password
```

ログイン後は以下へ遷移します。

```text
/dashboard
```

### teacherユーザー

```text
email: teacher@example.com
password: password
```

ログイン後は以下へ遷移します。

```text
/teacher
```

## 環境変数について

### `.env.example`

チームで共有する環境変数のサンプルです。

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

このファイルはGit管理します。

### `.env.local`

各開発者のローカル環境用ファイルです。

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

`.env.local` はGit管理しません。

APIのURLが変わる場合は、`.env.local` の `NEXT_PUBLIC_API_BASE_URL` を変更してください。

例:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## ディレクトリ構成

```text
frontend/
├─ public/                  # 画像などの静的ファイル
├─ src/
│  ├─ app/                  # Next.js App Router のページ
│  │  ├─ dashboard/         # student用投稿作成画面
│  │  ├─ teacher/           # teacher用ページ
│  │  ├─ login/             # ログイン画面
│  │  ├─ logout/            # ログアウト画面
│  │  ├─ report-list/       # 投稿一覧画面
│  │  ├─ detail/[id]/       # 投稿詳細画面
│  │  └─ edit/[id]/         # 投稿編集画面
│  ├─ components/           # 共通コンポーネント
│  │  ├─ reports/           # 投稿関連のUI部品
│  │  ├─ AuthSkeleton.tsx   # 認証確認中の表示
│  │  ├─ ErrorMessage.tsx   # エラー表示
│  │  ├─ Loading.tsx        # ローディング表示
│  │  ├─ LogoutButton.tsx   # ログアウトボタン
│  │  └─ ProtectedRoute.tsx # 未ログイン時の画面保護
│  ├─ lib/                  # API通信・バリデーションなど
│  │  ├─ api.ts             # Axios共通設定
│  │  ├─ authApi.ts         # 認証API
│  │  ├─ reportsApi.ts      # 投稿API
│  │  └─ validations.ts     # フォームバリデーション
│  ├─ providers/            # アプリ全体のProvider
│  │  └─ AuthProvider.tsx   # 認証状態の復元
│  ├─ stores/               # Zustandストア
│  │  └─ authStore.ts       # 認証状態管理
│  └─ types/                # 型定義
│     └─ report.ts          # 投稿関連の型
├─ .env.example             # 環境変数サンプル
├─ .env.local               # 各開発者が作成するローカル環境変数（Git管理外）
├─ middleware.ts            # Next.js Middleware
├─ package.json             # scripts と依存関係
├─ pnpm-lock.yaml           # pnpm lockfile
├─ next.config.ts           # Next.js 設定
├─ tsconfig.json            # TypeScript 設定
└─ README.md                # フロントエンド説明
```

## よくある注意点

### `localhost:3000` が使われている場合

すでにfrontendコンテナまたはNext.jsの開発サーバーが起動している可能性があります。

まず、Docker Composeの起動状態を確認します。

```bash
docker compose ps
```

frontendコンテナを停止する場合：

```bash
docker compose stop frontend
```

ローカルで起動したNext.jsを停止する場合は、起動中のターミナルで`Ctrl + C`を押します。

### ログインできない場合

以下を確認してください。

- Docker Desktop が起動しているか
- `docker compose ps` で `frontend`、`backend` 、 `db` が 起動状態になっているか
- Docker Composeまたは`.env.local` に `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` が正しく設定されているか
- ブラウザの `localStorage` に古い `access_token` が残っていないか

古いトークンが残っている場合は、一度ログアウトするか、開発者ツールから `access_token` を削除してください。

### teacherでログインしてもstudent画面に見える場合

ログイン済みの古いトークンが残っている可能性があります。

一度ログアウトしてから、teacherアカウントでログインし直してください。

```text
email: teacher@example.com
password: password
```

teacherの場合は `/teacher` に遷移します。

### `.env.local` はGitに追加しない

`.env.local` はローカル環境用のファイルです。

Gitに追加しないでください。

```
git status
```

で `.env.local` が表示されていないことを確認してください。

### `node_modules` や `.next` はGitに追加しない

以下は自動生成されるため、Gitに追加しません。

```text
node_modules/
.next/
.env.local
```

### build後に `next-env.d.ts` が変更される場合

`pnpm build` の実行後に `next-env.d.ts` が変更されることがあります。

意図しない差分であれば、コミット前に差分を確認してください。

```
git diff -- frontend/next-env.d.ts
```

## 関連ドキュメント

- [要件定義](../docs/要件定義.md)
- [画面設計](../docs/画面設計.md)
- [技術選定](../docs/技術選定.md)
- [API 設計](../docs/API設計.md)
- [DB設計](../docs/DB設計.md)
- [テスト設計書](../docs/テスト設計書.md)
- [セキュリティ設計](../docs/セキュリティ設計.md)
