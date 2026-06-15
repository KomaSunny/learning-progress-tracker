# Backend

このディレクトリには、本プロジェクトのバックエンドアプリケーションを配置する。
FastAPI + PostgreSQL を利用し、学習進捗管理アプリのAPIを提供する。

## 技術スタック

| 種別           | 採用技術                |
| -------------- | ----------------------- |
| 言語           | Python 3.13             |
| フレームワーク | FastAPI                 |
| ORM            | SQLModel                |
| DB             | PostgreSQL 18           |
| 認証           | JWT                     |
| コンテナ       | Docker / Docker Compose |
| テスト         | 今後検討（例：pytest）  |
| Lint / Format  | 今後検討　（例：Ruff）  |

> 詳細は [`docs/技術選定.md`](../docs/技術選定.md) を参照。

## 前提

- Docker / Docker Compose
- Python 3.13
- PostgreSQL 18

※ ローカル開発では `Docker Compose` を利用して `backend` と `db` を起動する。
※ フロントエンドは別ブランチで作業中のため、現状は対象外とする。

## セットアップ

`.env.example` をコピーして `.env` を作成する。

```bash
cp backend/.env.example backend/.env
```

※ `.env.example` の値はローカル開発用のサンプルです。本番環境では使用しません。

## 環境変数

| 変数名         | 内容                      | 備考                                        |
| -------------- | ------------------------- | ------------------------------------------- |
| `DATABASE_URL` | PostgreSQLへの接続URL     | 　ローカル開発用の値を `.env.example`に記載 |
| `DB_ECHO`      | SQLログを出力するかどうか | 　開発中は`true`、本番環境では`false`を想定 |

## Docker Composeで起動

リポジトリ直下で以下を実行する。

```bash
docker compose up --build -d
```

## 起動確認

```bash
docker compose ps
```

`backend` と `db` が `Up` になっていれば起動成功。
`db` は `healthcheck` により、接続可能な状態になると `healthy` と表示される。

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

JWT認証やrole別表示の動作確認用に、以下のseedユーザーを利用する想定です。

### student

- email: user@example.com
- password: password

### teacher

- email: teacher@example.com
- password: password

※ 現時点ではローカル開発・動作確認用の仮ユーザーです。  
※ 本番用の認証情報ではありません。  
※ seedユーザーはDB実装Issueで作成します。

## 停止方法

```bash
docker compose down
```

DB volumeも削除して初期化したい場合は以下を実行する。

```bash
docker compose down -v
```

## 現在のディレクトリ構成

```text
backend/
├── app/
│   ├── api/
│   │   ├── auth.py         # ログイン・ログアウトAPI
│   │   ├── health.py       # ヘルスチェックAPI
│   │   ├── reports.py      # 投稿API
│   │   └── users.py        # ログイン中ユーザー情報取得API
│   ├── core/
│   │   ├── config.py       # 環境変数・設定管理
│   │   ├── exception_handlers.py # 共通エラーレスポンス変換
│   │   └── security.py     # パスワードハッシュ化・JWT関連処理
│   ├── crud/
│   │   ├── __init__.py
│   │   └── report.py       # reportsテーブルのDB操作
│   ├── db/
│   │   ├── init_db.py      # DBテーブル作成処理
│   │   ├── seed.py         # 初期ユーザー投入処理
│   │   └── session.py      # DB接続・セッション管理
│   ├── models/
│   │   ├── __init__.py
│   │   ├── report.py       # reportsテーブル定義
│   │   └── user.py         # usersテーブル定義
│   ├── schemas/
│   │   ├── auth.py         # 認証APIのリクエスト・レスポンス定義
│   │   └── report.py       # 投稿APIのリクエスト・レスポンス定義
│   └── main.py             # FastAPIアプリ作成・ルーター登録
├── .env.example
├── Dockerfile
├── README.md
└── requirements.txt
```

## 各ファイルの役割

| ファイル                         | 役割                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `app/main.py`                    | FastAPIアプリの作成、各APIルーターと共通エラーハンドラー登録する                                        |
| `app/api/auth.py`                | `/auth/login`、`/auth/logout` を定義する                                                                |
| `app/api/users.py`               | `/me` を定義し、ログイン中ユーザー情報を返す                                                            |
| `app/api/reports.py`             | `/reports` 系APIを定義する。投稿一覧取得、作成、詳細取得、更新、削除を担当する                          |
| `app/api/health.py`              | `/health`、`/health/db`のヘルスチェックAPIを定義する                                                    |
| `app/core/config.py`             | 環境変数・設定値の読み込む                                                                              |
| `app/core/security.py`           | パスワードハッシュ化、パスワード検証、JWT作成・検証を担当する                                           |
| `app/core/exception_handlers.py` | API設計.mdの共通エラーレスポンス形式に合わせて、HTTPExceptionやバリデーションエラーの返却形式を統一する |
| `app/dependencies.py`            | JWTからログイン中ユーザーを取得するなど、複数APIで共通して使う依存関係を定義する                        |
| `app/db/session.py`              | DBエンジン作成、DBセッション管理、DB接続確認を担当する                                                  |
| `app/db/init_db.py`              | SQLModelのモデル定義をもとにDBテーブルを作成する                                                        |
| `app/db/seed.py`                 | 動作確認用の初期ユーザーを作成する                                                                      |
| `app/models/user.py`             | `users` テーブルのDBモデルを定義する                                                                    |
| `app/models/report.py`           | `reports` テーブルのDBモデルを定義する                                                                  |
| `app/schemas/auth.py`            | 認証APIのリクエスト・レスポンス形式を定義する                                                           |
| `app/schemas/report.py`          | 投稿APIのリクエスト・レスポンス形式を定義する                                                           |
| `.env.example`                   | ローカル開発用の環境変数サンプル                                                                        |
| `Dockerfile`                     | backendコンテナの定義                                                                                   |
| `requirements.txt`               | Python依存パッケージ一覧                                                                                |

## ディレクトリ方針

単一責務の原則を意識し、main.py にすべての処理を書かず、責務ごとにファイルを分ける。

| ディレクトリ   | 方針                                                                                   |
| -------------- | -------------------------------------------------------------------------------------- |
| `app/api/`     | APIルーターを配置する。HTTPリクエスト・レスポンス、認証・認可の制御を担当する          |
| `app/core/`    | 環境変数、セキュリティ、共通エラーハンドリングなど、アプリ全体で使う共通処理を配置する |
| `app/crud/`    | DB取得・作成・更新・削除などのDB操作を配置する                                         |
| `app/db/`      | DB接続、DBセッション、テーブル作成、seed投入などDB関連処理を管理する                   |
| `app/models/`  | SQLModelのDBモデルを配置する                                                           |
| `app/schemas/` | APIのリクエスト・レスポンス用スキーマを配置する                                        |

## 命名・責務分担の方針

- `api/` はエンドポイント単位で分ける
  - 例：`app/api/reports.py` は `/reports` 系APIを担当する

- `models/` はDBテーブルに対応するモデルを定義する
  - 例：`app/models/report.py` は `reports` テーブルのDBモデルを担当する

- `schemas/` はAPIの入力・出力形式を定義する
  - 例：`app/schemas/report.py` は投稿APIのリクエスト・レスポンス形式を担当する

- `crud/` はDB操作を担当する
  - API層にDB操作を書きすぎないようにする

- `core/` はアプリ全体で共通して使う設定・セキュリティ・エラーハンドリングを担当する

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

そのため、`app/api/reports.py` の `to_report_response()` で、DBモデルのsnake_caseをAPIレスポンス用のcamelCaseに変換する。

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
- [運用設計](../docs/運用設計.md)
- [性能設計](../docs/性能設計.md)
- [ログ設計](../docs/ログ設計.md)
- [可用性設計](../docs/可用性設計.md)
- [セキュリティ設計](../docs/セキュリティ設計.md)
