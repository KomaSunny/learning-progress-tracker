# Backend

このディレクトリには、本プロジェクトのバックエンドアプリケーションを配置する。
FastAPI + PostgreSQL を利用し、学習進捗管理アプリの認証・ユーザー情報取得・投稿管理APIを提供する。

## 技術スタック

| 種別           | 採用技術                |
| -------------- | ----------------------- |
| 言語           | Python 3.13             |
| フレームワーク | FastAPI                 |
| ORM            | SQLModel                |
| DB             | PostgreSQL 18           |
| 認証           | JWT                     |
| コンテナ       | Docker / Docker Compose |
| Lint / Format  | Ruff                    |
| テスト         | 今後検討（例：pytest）  |

> 詳細は [`docs/技術選定.md`](../docs/技術選定.md) を参照。

## 前提

- Docker / Docker Compose
- Python 3.13
- PostgreSQL 18

プロジェクト全体をDocker Composeで起動する方法は、ルートの[`README.md`](../README.md)を参照してください。

## 環境変数

`backend/.env.example` をコピーして `backend/.env` を作成する。

プロジェクトルートで実行する場合：

```bash
cp backend/.env.example backend/.env
```

※ `.env.example` の値はローカル開発用のサンプルです。本番環境では使用しません。

| 変数名          | 内容                      | 備考                                        |
| --------------- | ------------------------- | ------------------------------------------- |
| `DATABASE_URL`  | PostgreSQLへの接続URL     | 　ローカル開発用の値を `.env.example`に記載 |
| `DB_ECHO`       | SQLログを出力するかどうか | 　開発中は`true`、本番環境では`false`を想定 |
| JWT関連の設定値 | JWTの署名・有効期限に使用 | 　実際の.env.exampleに記載された変数を使用  |

## API疎通確認

FastAPIの起動確認を行う。

```bash
curl http://localhost:8000/health
```

以下が返れば成功。

```json
{ "status": "ok" }
```

## DB接続確認

FastAPIからPostgreSQLへの接続確認を行う。

```bash
curl http://localhost:8000/health/db
```

以下が返れば成功。

```json
{ "status": "ok", "db": "connected" }
```

DB設定がない場合や、DBに接続できない場合は 503 Service Unavailable を返す。

## DB初期化・seed投入

DBモデル作成後、以下のコマンドで `users` / `reports` テーブルを作成し、MVPの動作確認用seedユーザーを投入する。

```bash
docker compose exec backend python -m app.db.seed
```

この処理では、以下を実行する。

- `users` テーブルの作成
- `reports` テーブルの作成
- `student` ユーザーの作成
- `teacher` ユーザーの作成

seedユーザーは、同じメールアドレスのユーザーが既に存在する場合は重複作成しない。

### DB確認方法

PostgreSQLコンテナに入る。

```bash
docker compose exec db psql -U postgres -d learning_progress_db
```

テーブル一覧を確認する。

```sql
\dt
```

seedユーザーを確認する。

```sql
SELECT id, name, email, role FROM users;
```

psqlを終了する。

```sql
\q
```

## 動作確認用ログイン情報

### student

生徒ユーザー1

- email: user@example.com
- password: password

生徒ユーザー2

- email: user2@example.com
- password: password

### teacher

講師ユーザー

- email: teacher@example.com
- password: password

※ 現時点ではローカル開発・動作確認用の仮ユーザーです。  
※ 本番用の認証情報ではありません。

## 開発用コマンド

以下のコマンドは、基本的に`backend`ディレクトリで実行する。

```bash
cd backend
```

### RuffによるLint

コードの問題を確認する。

```bash
python -m ruff check app
```

自動修正可能な問題を修正する場合：

```bash
python -m ruff check app --fix
```

### Ruffによるフォーマット確認

フォーマットが適用済みか確認する。

```bash
python -m ruff format --check app
```

### Ruffによるフォーマット

コードを自動整形する。

```bash
python -m ruff format app
```

Pull Requestを作成する前に、以下が成功することを確認する。

```bash
python -m ruff check app
python -m ruff format --check app
```

Dockerコンテナ内で実行する場合：

```bash
docker compose exec backend python -m ruff check app
docker compose exec backend python -m ruff format --check app
```

## 現在のディレクトリ構成

```text
backend/
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── health.py
│   │   ├── reports.py
│   │   └── users.py
│   ├── core/
│   │   ├── config.py
│   │   ├── cors.py
│   │   ├── exception_handlers.py
│   │   └── security.py
│   ├── crud/
│   │   ├── __init__.py
│   │   └── report.py
│   ├── db/
│   │   ├── init_db.py
│   │   ├── seed.py
│   │   └── session.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── report.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── auth.py
│   │   └── report.py
│   ├── dependencies.py
│   └── main.py
├── .env.example
├── Dockerfile
├── README.md
└── requirements.txt
```

## 各ファイルの役割

| ファイル                         | 役割                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `app/main.py`                    | FastAPIアプリの作成、CORS・ルーター・共通エラーハンドラーの登録              |
| `app/api/auth.py`                | `/auth/login`、`/auth/logout` APIの定義                                      |
| `app/api/users.py`               | `/me` を定義し、ログイン中ユーザー情報を返す                                 |
| `app/api/reports.py`             | `/reports` 系APIを定義。投稿一覧取得・作成・詳細取得・更新・削除API          |
| `app/api/health.py`              | `/health`、`/health/db`のヘルスチェックAPIの定義                             |
| `app/core/config.py`             | 環境変数・アプリ設定の読み込み                                               |
| `app/core/cors.py`               | フロントエンドからのAPIアクセスを許可するCORS設定                            |
| `app/core/security.py`           | パスワードハッシュ化、パスワード検証、JWT作成・検証                          |
| `app/core/exception_handlers.py` | APIエラーのレスポンス形式を統一                                              |
| `app/dependencies.py`            | JWTからログイン中ユーザーを取得するなど、複数APIで共通して使う依存関係を定義 |
| `app/crud/report.py`             | reportsテーブルの取得・作成・更新・削除                                      |
| `app/db/session.py`              | DBエンジン作成、DBセッション管理、接続確認                                   |
| `app/db/init_db.py`              | SQLModelのモデル定義をもとにDBテーブルを作成                                 |
| `app/db/seed.py`                 | 動作確認用の初期ユーザーを作成                                               |
| `app/models/user.py`             | `users` テーブルのDBモデル定義                                               |
| `app/models/report.py`           | `reports` テーブルのDBモデル定義                                             |
| `app/schemas/auth.py`            | 認証APIのリクエスト・レスポンス形式を定義                                    |
| `app/schemas/report.py`          | 投稿APIのリクエスト・レスポンス形式を定義                                    |
| `.env.example`                   | ローカル開発用の環境変数サンプル                                             |
| `Dockerfile`                     | backendコンテナの定義                                                        |
| `requirements.txt`               | Python依存パッケージ一覧                                                     |

## ディレクトリ方針

単一責務の原則を意識し、main.py にすべての処理を書かず、責務ごとにファイルを分ける。

| ディレクトリ   | 方針                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------- |
| `app/api/`     | HTTPリクエスト・レスポンス、認証・認可の制御を担当                                       |
| `app/core/`    | 環境変数、セキュリティ、CORS、共通エラーハンドリングなど、アプリ全体で使う共通処理を配置 |
| `app/crud/`    | DB取得・作成・更新・削除などのDB操作を配置                                               |
| `app/db/`      | DB接続、DBセッション、テーブル作成、seed投入などDB関連処理を管理                         |
| `app/models/`  | SQLModelのDBモデルを配置                                                                 |
| `app/schemas/` | APIのリクエスト・レスポンス用スキーマを配置                                              |

## snake_case と camelCase の扱い

DBモデルでは、Python / DBの慣習に合わせて snake_case を使用する。

例：

```python
user_id
next_action
study_minutes
understanding_level
created_at
updated_at
```

APIのJSONリクエスト・レスポンスでは、API設計.mdに合わせて camelCase を使用する。

例：

```json
{
  "userId": 1,
  "nextAction": "認証付きAPIを実装する",
  "studyMinutes": 90,
  "understandingLevel": 3,
  "createdAt": "2026-06-09T10:00:00Z",
  "updatedAt": "2026-06-09T10:00:00Z"
}
```

そのため、DBモデルの`snake_case`は、APIレスポンスを作成する際に`camelCase`へ変換する。

## 共通エラーレスポンス

API設計.mdに合わせて、APIエラーは以下の形式で返す。

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラー内容"
  }
}
```

FastAPI標準の `HTTPException` は通常 `{ "detail": "..." }` 形式で返るため、`app/core/exception_handlers.py` で共通エラーハンドラーを定義し、`app/main.py` で登録する。

これにより、`auth.py`、`reports.py`、`dependencies.py` などで `HTTPException` を投げた場合も、API設計.mdの共通フォーマットに変換される。

## API ドキュメント

FastAPIのSwagger UIは、開発時に以下で確認できる。

http://localhost:8000/docs

## 関連ドキュメント

- [PRD](../docs/PRD.md)
- [要件定義](../docs/要件定義.md)
- [API 設計](../docs/API設計.md)
- [DB 設計](../docs/DB設計.md)
- [テスト設計書](../docs/テスト設計書.md)
- [ログ設計](../docs/ログ設計.md)
- [セキュリティ設計](../docs/セキュリティ設計.md)
