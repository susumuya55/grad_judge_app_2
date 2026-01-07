# DB設計書（確定反映版）: Grad Judge Rooms（PostgreSQL / Prisma前提）

## 0. 前提・方針（確定）
- **Prismaで表現できる範囲の制約のみ実装**（部分UNIQUE・複合FKなどの高度制約は今回は入れない）
- **indexは今回は実装しない**
- **status は enum（DB/Prisma enum）**
- **payload は JSONB（Prisma: Json）**
- **enter_token は 1000〜9999 に制限**
- **ROOM_PARTICIPANTS に UNIQUE(room_id, student_id) を付与**
- **ROOM_SESSIONS から room_id を削除**し、room は participant 経由で辿る

---

## 1. テーブル定義と制約

## 1.1 HOSTS
### 役割
ホスト（先生側）のアカウント。

### カラム
| column | type | null | key | default | note |
|---|---|---:|---|---|---|
| id | BIGINT | NO | PK | auto | 内部ID |
| email | TEXT | NO | UNIQUE |  | メール |
| password_hash | TEXT | NO |  |  | ハッシュ |
| name | TEXT | NO |  |  | 表示名 |
| created_at | TIMESTAMPTZ | NO |  | now() | 作成時刻 |

### 制約（Prismaで実装）
- `PRIMARY KEY (id)`
- `UNIQUE (email)`
- `NOT NULL`（上記の通り）

---

## 1.2 ROOMS
### 役割
ホストが作成する部屋。

### status enum（確定）
- `OPEN`
- `CLOSED`
- `EXPIRED`

### カラム
| column | type | null | key | default | note |
|---|---|---:|---|---|---|
| id | BIGINT | NO | PK | auto | 内部ID |
| public_id | TEXT | NO | UNIQUE |  | 外部公開ID |
| host_id | BIGINT | NO | FK |  | `HOSTS.id` |
| name | TEXT | NO |  |  | ルーム名 |
| status | ROOM_STATUS(ENUM) | NO |  | OPEN | 状態 |
| enter_token | INTEGER | NO |  |  | 1000〜9999 |
| created_at | TIMESTAMPTZ | NO |  | now() | 作成時刻 |
| expires_at | TIMESTAMPTZ | NO |  |  | 有効期限 |

### 制約（Prismaで実装）
- `PRIMARY KEY (id)`
- `UNIQUE (public_id)`
- `FOREIGN KEY (host_id) REFERENCES HOSTS(id)`
- `CHECK (enter_token BETWEEN 1000 AND 9999)` ※Prismaの標準機能ではチェック制約が弱い場合があるので、**アプリ側バリデーションも必須**（ただし要件上は「制限する」なのでここに明記）
- `expires_at > created_at` は今回は「高度制約扱い」に寄せて **アプリ側で担保**（確実にやる）

> 注: PrismaでDB側CHECKを確実に入れるには migration SQL を編集する必要が出ることがあります。今回は「高度な制約は実装しない」方針なので、**enter_token と時刻関係はアプリ側で必ず検証**する前提にします。

---

## 1.3 ROOM_PARTICIPANTS
### 役割
ルーム参加者（学生）。

### カラム
| column | type | null | key | default | note |
|---|---|---:|---|---|---|
| id | BIGINT | NO | PK | auto | 内部ID |
| room_id | BIGINT | NO | FK |  | `ROOMS.id` |
| student_id | TEXT | NO |  |  | 学籍番号など |
| sended | BOOLEAN | NO |  | false | 送信済み |
| created_at | TIMESTAMPTZ | NO |  | now() | 作成時刻 |

### 制約（確定）
- `PRIMARY KEY (id)`
- `FOREIGN KEY (room_id) REFERENCES ROOMS(id)`
- ✅ `UNIQUE (room_id, student_id)`（確定・実装）

---

## 1.4 ROOM_SESSIONS（room_id削除版）
### 役割
参加者のブラウザ単位/セッション単位の識別。

### カラム
| column | type | null | key | default | note |
|---|---|---:|---|---|---|
| id | TEXT | NO | PK |  | UUID/ULIDなど |
| participant_id | BIGINT | NO | FK |  | `ROOM_PARTICIPANTS.id` |
| created_at | TIMESTAMPTZ | NO |  | now() | 作成時刻 |

### 制約（確定）
- `PRIMARY KEY (id)`
- `FOREIGN KEY (participant_id) REFERENCES ROOM_PARTICIPANTS(id)`

### ルーム特定方法（確定）
- `room_sessions -> participant -> room` の順で辿る  
  - `ROOM_SESSIONS.participant_id` → `ROOM_PARTICIPANTS.room_id` → `ROOMS.id`

---

## 1.5 GRAD_JUDGE_DATA（JSONB確定）
### 役割
提出データを保存（payloadはJSONB）。

### カラム
| column | type | null | key | default | note |
|---|---|---:|---|---|---|
| id | BIGINT | NO | PK | auto | 内部ID |
| room_session_id | TEXT | NO | FK |  | `ROOM_SESSIONS.id` |
| payload | JSONB | NO |  |  | Prisma: Json |
| created_at | TIMESTAMPTZ | NO |  | now() | 作成時刻 |

### 制約（確定）
- `PRIMARY KEY (id)`
- `FOREIGN KEY (room_session_id) REFERENCES ROOM_SESSIONS(id)`

### 提出回数ポリシー（今回）
- 今回は **履歴保存（複数行OK）** に寄せる（UNIQUE(room_session_id) は付けない）

---

## 2. リレーション（確定）
- `HOSTS 1 --- N ROOMS`
- `ROOMS 1 --- N ROOM_PARTICIPANTS`
- `ROOM_PARTICIPANTS 1 --- N ROOM_SESSIONS`
- `ROOM_SESSIONS 1 --- N GRAD_JUDGE_DATA`

---

## 3. ON DELETE 方針
MVPにおいては削除APIは実装しない

---

## 4. 実装で担保するルール（DB制約にしない確定事項）
- `enter_token` の 1000〜9999 は **API入力検証で必ず弾く**
- `expires_at > created_at` は **作成時に必ずチェック**
- status遷移（OPEN→CLOSED/EXPIRED）は **ユースケース層で制御**
- 「1host1open」などの強制は **今回は入れない**
