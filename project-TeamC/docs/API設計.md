# API 設計

> OpenAPI（Swagger）で詳細を記述する場合、スキーマファイルは `backend/openapi.yaml` 等で管理する。
> 本ドキュメントでは、MVPで必要なAPIの概要、認証方式、リクエスト/レスポンス例、運用ルールを整理する。

## 1. 設計方針

- スタイル：REST
- 認証方式：JWT認証
- バージョニング：MVPではURLにバージョンを含めず、必要になった場合に `/v1/...` を検討する
- データ形式：JSON
- バックエンド：FastAPI
- フロントエンド：Next.js からAPIを呼び出す
- 認証が必要なAPIでは、`Authorization` ヘッダーにJWTを付与する

### 認証ヘッダー

```http
Authorization: Bearer <JWT>
```

### エラーレスポンスの共通フォーマット

APIでエラーが発生した場合は、以下の形式で返す。

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラー内容"
  }
}
```

---

## 2. エンドポイント一覧

### 認証API

| メソッド | パス        | 概要                               | 認証 |
| -------- | ----------- | ---------------------------------- | ---- |
| POST     | /auth/login | ログインし、JWTを取得する          | 不要 |
| GET      | /me         | ログイン中のユーザー情報を取得する | 必要 |

### 投稿API

| メソッド | パス          | 概要                               | 認証 |
| -------- | ------------- | ---------------------------------- | ---- |
| GET      | /reports      | 自分の日報・進捗投稿一覧を取得する | 必要 |
| POST     | /reports      | 日報・進捗投稿を作成する           | 必要 |
| GET      | /reports/{id} | 指定した投稿の詳細を取得する       | 必要 |
| PUT      | /reports/{id} | 指定した投稿を更新する             | 必要 |
| DELETE   | /reports/{id} | 指定した投稿を削除する             | 必要 |

### Good to have

| メソッド | パス           | 概要                             | 認証 |
| -------- | -------------- | -------------------------------- | ---- |
| GET      | /admin/reports | 講師が全員分の投稿一覧を取得する | 必要 |

---

## 3. リクエスト / レスポンス例

### POST /auth/login

ログイン処理を行い、成功時にJWTを返す。

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

#### レスポンス例

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

---

### GET /me

ログイン中のユーザー情報を取得する。

```http
GET /me
Authorization: Bearer <JWT>
```

#### レスポンス例

```json
{
  "id": 1,
  "name": "山田 花子",
  "email": "user@example.com",
  "role": "student"
}
```

---

### GET /reports

ログイン中のユーザー本人の日報・進捗投稿一覧を取得する。

```http
GET /reports
Authorization: Bearer <JWT>
```

#### レスポンス例

```json
[
  {
    "id": 1,
    "type": "daily",
    "title": "Next.jsの学習",
    "content": "App Routerについて学習した",
    "blockers": "認証まわりの理解がまだ浅い",
    "nextAction": "ログイン画面の実装を進める",
    "studyMinutes": 120,
    "understandingLevel": 3,
    "createdAt": "2026-06-09T10:00:00Z",
    "updatedAt": "2026-06-09T10:00:00Z"
  }
]
```

---

### POST /reports

日報・進捗投稿を作成する。

```http
POST /reports
Content-Type: application/json
Authorization: Bearer <JWT>
```

```json
{
  "type": "daily",
  "title": "FastAPIの学習",
  "content": "ルーティングとレスポンスの返し方を確認した",
  "blockers": "JWT認証の実装方法を確認したい",
  "nextAction": "ログインAPIを作成する",
  "studyMinutes": 90,
  "understandingLevel": 3
}
```

#### レスポンス例

```json
{
  "id": 1,
  "type": "daily",
  "title": "FastAPIの学習",
  "content": "ルーティングとレスポンスの返し方を確認した",
  "blockers": "JWT認証の実装方法を確認したい",
  "nextAction": "ログインAPIを作成する",
  "studyMinutes": 90,
  "understandingLevel": 3,
  "createdAt": "2026-06-09T10:00:00Z",
  "updatedAt": "2026-06-09T10:00:00Z"
}
```

---

### GET /reports/{id}

指定した日報・進捗投稿の詳細を取得する。

```http
GET /reports/1
Authorization: Bearer <JWT>
```

#### レスポンス例

```json
{
  "id": 1,
  "type": "daily",
  "title": "Next.jsの学習",
  "content": "App Routerについて学習した",
  "blockers": "認証まわりの理解がまだ浅い",
  "nextAction": "ログイン画面の実装を進める",
  "studyMinutes": 120,
  "understandingLevel": 3,
  "createdAt": "2026-06-09T10:00:00Z",
  "updatedAt": "2026-06-09T10:00:00Z"
}
```

---

### PUT /reports/{id}

自分の投稿を更新する。

```http
PUT /reports/1
Content-Type: application/json
Authorization: Bearer <JWT>
```

```json
{
  "title": "FastAPIとJWTの学習",
  "content": "JWT認証の流れまで確認した",
  "blockers": "",
  "nextAction": "認証付きAPIを実装する",
  "studyMinutes": 120,
  "understandingLevel": 4
}
```

#### レスポンス例

```json
{
  "id": 1,
  "type": "daily",
  "title": "FastAPIとJWTの学習",
  "content": "JWT認証の流れまで確認した",
  "blockers": "",
  "nextAction": "認証付きAPIを実装する",
  "studyMinutes": 120,
  "understandingLevel": 4,
  "createdAt": "2026-06-09T10:00:00Z",
  "updatedAt": "2026-06-09T12:00:00Z"
}
```

---

### DELETE /reports/{id}

自分の投稿を削除する。

```http
DELETE /reports/1
Authorization: Bearer <JWT>
```

#### レスポンス例

```json
{
  "message": "Report deleted"
}
```

---

## 4. エラーレスポンス

APIエラーは、以下の形式で返す。

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが正しくありません"
  }
}
```

### 主なエラーコード

| HTTPステータス | code                  | 概要                         |
| -------------- | --------------------- | ---------------------------- |
| 400            | BAD_REQUEST           | リクエスト内容が不正         |
| 401            | UNAUTHORIZED          | 未ログイン、またはJWTが不正  |
| 403            | FORBIDDEN             | 操作権限がない               |
| 404            | NOT_FOUND             | 対象データが存在しない       |
| 422            | VALIDATION_ERROR      | 入力値のバリデーションエラー |
| 500            | INTERNAL_SERVER_ERROR | サーバー内部エラー           |

---

## 5. レート制限・冪等性

### レート制限

MVPでは厳密なレート制限は実装しない。  
ただし、ログインAPIについては連続試行による不正ログイン対策が必要になる可能性があるため、将来的に制限を検討する。

### 冪等性

MVPでは冪等キーは使用しない。  
`POST /reports` は新規作成、`PUT /reports/{id}` は更新として扱う。

### 注意点

- フロントエンドから送られた `user_id` をそのまま信用しない
- バックエンド側でJWTを検証し、ログイン中のユーザーを特定する
- 投稿の取得・編集・削除は、ログイン中のユーザー本人の投稿に限定する
- Good to haveとして講師権限を追加する場合は、`role` を確認して管理画面用APIを利用できるようにする
