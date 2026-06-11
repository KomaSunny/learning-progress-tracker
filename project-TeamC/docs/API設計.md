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
- ログイン中ユーザーのIDとroleは、JWTまたはDB上のユーザー情報をもとにバックエンド側で判定する
- `user_id` はリクエストボディでは受け取らず、JWTから取得したログイン中ユーザーのIDを使用する
- `GET /reports` はログイン中ユーザーのroleによって返却範囲を切り替える
  - `student`：自分の投稿のみ返却する
  - `teacher`：生徒全員分の投稿を返却する
- MVPでは、`teacher` による投稿の作成・編集・削除は対象外とする

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

| メソッド | パス          | 概要                           | 認証 | 権限                  |
| -------- | ------------- | ------------------------------ | ---- | --------------------- |
| GET      | /reports      | roleに応じて投稿一覧を取得する | 必要 | 　student / teacher　 |
| POST     | /reports      | 投稿を作成する                 | 必要 | student               |
| GET      | /reports/{id} | 指定した投稿の詳細を取得する   | 必要 | student / teacher　   |
| PUT      | /reports/{id} | 指定した投稿を更新する         | 必要 | student               |
| DELETE   | /reports/{id} | 指定した投稿を削除する         | 必要 | student               |

### Good to have

| メソッド | パス                          | 概要                           | 認証 | 権限              |
| -------- | ----------------------------- | ------------------------------ | ---- | ----------------- |
| GET      | /reports?type=progress_report | 投稿種別で絞り込む             | 必要 | student / teacher |
| GET      | /reports?user_id=1            | 生徒で絞り込む                 | 必要 | teacher           |
| PATCH    | /reports/{id}/status          | 講師が確認ステータスを更新する | 必要 | teacher           |

> 講師も `GET /reports` を利用し、roleに応じて生徒全員分の投稿を取得する。

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

roleに応じて投稿一覧を取得する。

```http
GET /reports
Authorization: Bearer <JWT>
```

#### 取得ルール

- `student` の場合：ログイン中ユーザー本人の投稿のみ返却する
- `teacher` の場合：生徒全員分の投稿を返却する
- `teacher` の場合は、誰の投稿か分かるように `user_id` と `user_name` を含める
- 投稿一覧は `createdAt` の降順で返却する想定とする

#### student のレスポンス例

```json
[
  {
    "id": 1,
    "userId": 2,
    "userName": "山田 花子",
    "type": "progress_report",
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

#### teacher のレスポンス例

```json
[
  {
    "id": 1,
    "userId": 2,
    "userName": "山田 花子",
    "type": "progress_report",
    "title": "Next.jsの学習",
    "content": "App Routerについて学習した",
    "blockers": "認証まわりの理解がまだ浅い",
    "nextAction": "ログイン画面の実装を進める",
    "studyMinutes": 120,
    "understandingLevel": 3,
    "createdAt": "2026-06-09T10:00:00Z",
    "updatedAt": "2026-06-09T10:00:00Z"
  },
  {
    "id": 2,
    "userId": 3,
    "userName": "佐藤 太郎",
    "type": "daily_report",
    "title": "FastAPIの復習",
    "content": "ルーティングとレスポンスの返し方を確認した",
    "blockers": "",
    "nextAction": "認証付きAPIを実装する",
    "studyMinutes": 90,
    "understandingLevel": 4,
    "createdAt": "2026-06-09T09:00:00Z",
    "updatedAt": "2026-06-09T09:00:00Z"
  }
]
```

---

### POST /reports

投稿を作成する。

```http
POST /reports
Content-Type: application/json
Authorization: Bearer <JWT>
```

#### 権限

- `student` のみ作成可能
- `teacher` はMVPでは作成不可
- `teacher` が実行した場合は `403 Forbidden` を返す
- `userId` はリクエストボディに含めない
- 投稿者はJWTから取得したログイン中ユーザーIDを使用する
- `type` が未指定の場合は `progress_report` として保存する
- レスポンスは投稿取得APIと同じ形式で返却する
- そのため、作成後のレスポンスにも `userId` / `userName` を含める

#### リクエスト例

```json
{
  "type": "progress_report",
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
  "userId": 2,
  "userName": "山田　花子",
  "type": "progress_report",
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

指定した投稿の詳細を取得する。

```http
GET /reports/1
Authorization: Bearer <JWT>
```

#### 権限

- `student` は自分の投稿のみ取得可能
- `teacher` は生徒全員分の投稿を取得可能
- `teacher` の場合は、投稿者名を表示できるように `user_id` と `user_name` を含める
- `student` が他人の投稿を取得しようとした場合は `403 Forbidden` または `404 Not Found` を返す

#### レスポンス例

```json
{
  "id": 1,
  "userId": 2,
  "userName": "山田 花子",
  "type": "progress_report",
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

#### 権限

- `student` のみ更新可能
- `student` は自分の投稿のみ更新可能
- `teacher` はMVPでは更新不可
- `teacher` が実行した場合は `403 Forbidden` を返す
- 他人の投稿を更新しようとした場合は `403 Forbidden` または `404 Not Found` を返す

#### リクエスト例

```json
{
  "type": "progress_report",
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
  "userId": 2,
  "userName": "山田 花子",
  "type": "progress_report",
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

#### 権限

- `student` のみ削除可能
- `student` は自分の投稿のみ削除可能
- `teacher` はMVPでは削除不可
- `teacher` が実行した場合は `403 Forbidden` を返す
- 他人の投稿を削除しようとした場合は `403 Forbidden` または `404 Not Found` を返す

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

## 5. バリデーションルール

### reports

| 項目               | ルール                                                              |
| ------------------ | ------------------------------------------------------------------- |
| type               | daily_report または progress_report。未指定の場合は progress_report |
| title              | 必須。255文字以内                                                   |
| content            | 必須                                                                |
| blockers           | 任意                                                                |
| nextAction         | 任意                                                                |
| studyMinutes       | 任意。指定する場合は0以上                                           |
| understandingLevel | 任意。指定する場合は1〜5                                            |

---

## 6. レート制限・冪等性

### レート制限

MVPでは厳密なレート制限は実装しない。  
ただし、ログインAPIについては連続試行による不正ログイン対策が必要になる可能性があるため、将来的に制限を検討する。

### 冪等性

MVPでは冪等キーは使用しない。  
`POST /reports` は新規作成、`PUT /reports/{id}` は更新として扱う。

---

## 7. 注意点

- フロントエンドから送られた `user_id` をそのまま信用しない
- 投稿作成時、userId はリクエストボディでは受け取らない
- バックエンド側でJWTを検証し、ログイン中のユーザーを特定する
- `student`の投稿取得・編集・削除は、ログイン中のユーザー本人の投稿に限定する
- `teacher` は生徒全員分の投稿を閲覧できる
- `teacher` が生徒全員分の投稿を閲覧する際は、`reports.user_id` をもとに `users.name` を取得し、`userName` として返却する
- MVPでは、`teacher` による投稿の作成・編集・削除は対象外とする
- 専用管理画面や `/admin/reports` はMVPでは作成しない
