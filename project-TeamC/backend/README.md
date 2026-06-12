# Backend

このディレクトリには、本プロジェクトのバックエンドアプリケーションを配置する。
FastAPI + PostgreSQL を利用し、学習進捗管理アプリのAPIを提供する。

## 技術スタック

| 種別           | 採用技術                          |
| -------------- | --------------------------------- |
| 言語           | Python 3.13                       |
| フレームワーク | FastAPI                           |
| ORM            | SQLModel                          |
| DB             | PostgreSQL 18                     |
| 認証           | JWT                               |
| コンテナ       | Docker / Docker Compose           |
| テスト         | （例：Vitest / Jest + Supertest） |
| Lint / Format  | ESLint / Prettier                 |

> 詳細は [`docs/技術選定.md`](../docs/技術選定.md) を参照。

## 前提

- Docker / Docker Compose
- Python 3.13
- PostgreSQL 18

※ ローカル開発では `Docker Compose` を利用して `backend` と `db` を起動する。

## セットアップ

`.env.example` をコピーして `.env` を作成する。

```bash
cp backend/.env.example backend/.env
```

※ `.env.example` の値はローカル開発用のサンプルです。本番環境では使用しません。

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
│   │   └── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   ├── db/
│   │   ├── __init__.py
│   │   └── session.py
│   ├── schemas/
│   │   └── __init__.py
│   └── main.py
├── .env.example
├── Dockerfile
├── README.md
└── requirements.txt
```

## 各ファイルの役割

| ファイル             | 役割                                                      |
| -------------------- | --------------------------------------------------------- |
| `app/main.py`        | FastAPIアプリの作成、ヘルスチェック用エンドポイントの定義 |
| `app/core/config.py` | 環境変数・設定値の読み込み                                |
| `app/db/session.py`  | DB接続エンジンとDBセッションの管理                        |
| `.env.example`       | ローカル開発用の環境変数サンプル                          |
| `Dockerfile`         | backendコンテナの定義                                     |
| `requirements.txt`   | Python依存パッケージ一覧                                  |

## API ドキュメント

FastAPIのSwagger UIは、開発時に以下で確認できる。

http://localhost:8000/docs

## コーディング方針

- main.py にすべての処理を書かず、責務ごとにファイルを分ける
- 環境変数の読み込みは app/core/config.py に集約する
- DB接続処理は app/db/session.py に集約する
- APIルーターは今後 app/api/ 配下に追加する
- スキーマは今後 app/schemas/ 配下に追加する

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
