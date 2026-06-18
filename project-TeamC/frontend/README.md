# 学習記録アプリ フロントエンド

このディレクトリは、学習記録アプリのフロントエンドを管理します。

Next.js App Router を使用し、ログイン、ログアウト、学習報告の投稿、投稿一覧、講師向け画面などを実装します。

## 使用技術

| 種類 | 技術 |
| --- | --- |
| フレームワーク | Next.js |
| UI ライブラリ | React |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS / CSS Modules |
| 状態管理 | Zustand |
| API通信 | Axios |
| フォーム | react-hook-form |
| バリデーション | zod |
| パッケージ管理 | pnpm |
| Lint | ESLint |

## 前提

- Node.js: 現時点では `.nvmrc` / `package.json` の `engines` は未設定です。チームで指定された Node.js を使用してください。
- パッケージマネージャ: `package.json` の `packageManager` に従い、`pnpm@11.5.2` を使用します。

## セットアップ手順

### 1. フロントエンドディレクトリへ移動する

```powershell
cd frontend
```

### 2. 依存関係をインストールする

```powershell
pnpm.cmd install
```

`node_modules` が作成されれば成功です。

### 3. 環境変数ファイルを作成する

`.env.example` をもとに、`.env.local` を作成します。

```powershell
copy .env.example .env.local
```

### 4. `.env.local` を確認する

ローカル開発では、以下のように設定します。

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

| 環境変数名 | 内容 |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | フロントエンドから接続するバックエンドAPIのURL |

Next.js でブラウザ側から参照する環境変数は、名前を `NEXT_PUBLIC_` で始める必要があります。

### 5. バックエンドとDBを起動する

フロントエンドのログイン機能を確認するには、バックエンドとDBが起動している必要があります。

別のPowerShellで、プロジェクトルートへ移動します。

```powershell
cd project-TeamC
```

Docker Compose を起動します。

```powershell
docker compose up -d
```

起動確認をします。

```powershell
docker compose ps
```

`backend` と `db` が `Up` になっていればOKです。

### 6. フロントエンド開発サーバーを起動する

```powershell
pnpm.cmd dev
```

通常は以下で起動します。

```text
http://localhost:3000
```

もし `3000` が使用中の場合は、`3001` など別のポートが表示されます。

## 開発環境とよく使うコマンド

### 開発サーバーを起動する

```powershell
pnpm.cmd dev
```

Next.js の開発サーバーを起動します。

ブラウザで以下を開きます。

```text
http://localhost:3000
```

### 本番用ビルドを確認する

```powershell
pnpm.cmd build
```

TypeScript や Next.js のビルドエラーがないか確認します。

### ビルド済みアプリを起動する

```powershell
pnpm.cmd start
```

`pnpm.cmd build` 実行後に、本番モードでアプリを起動します。

### ESLint を実行する

```powershell
pnpm.cmd lint
```

`src` 配下のコードに構文エラーや未使用 import などがないか確認します。

### 依存関係を確認する

```powershell
pnpm.cmd list
```

インストール済みのパッケージを確認します。

特定のパッケージを確認する場合は、以下のように実行します。

```powershell
pnpm.cmd list axios zustand
```

## 動作確認用アカウント

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
│  │  ├─ dashboard/         # student用ダッシュボード
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
├─ .env.local               # ローカル環境変数
├─ middleware.ts            # Next.js Middleware
├─ package.json             # scripts と依存関係
├─ pnpm-lock.yaml           # pnpm lockfile
├─ next.config.ts           # Next.js 設定
├─ tsconfig.json            # TypeScript 設定
└─ README.md                # フロントエンド説明
```

## よくある注意点

### `localhost:3000` が使われている場合

すでにNext.jsの開発サーバーが起動している可能性があります。

表示例:

```text
Port 3000 is in use
```

既存のサーバーを使う場合は、ブラウザで以下を開きます。

```text
http://localhost:3000
```

停止したい場合は、表示されたPIDを使って停止します。

```powershell
taskkill /PID <PID番号> /F
```

### ログインできない場合

以下を確認してください。

- Docker Desktop が起動しているか
- `docker compose ps` で `backend` と `db` が `Up` になっているか
- `.env.local` に `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` が設定されているか
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

```powershell
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

`pnpm.cmd build` の実行後に `next-env.d.ts` が変更されることがあります。

意図しない差分であれば、コミット前に差分を確認してください。

```powershell
git diff project-TeamC/frontend/next-env.d.ts
```

## 関連ドキュメント

- [PRD](../docs/PRD.md)
- [要件定義](../docs/要件定義.md)
- [画面設計](../docs/画面設計.md)
- [API 設計](../docs/API設計.md)
- [テスト設計書](../docs/テスト設計書.md)
- [セキュリティ設計](../docs/セキュリティ設計.md)
