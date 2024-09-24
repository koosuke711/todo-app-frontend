// src/types.ts
  export interface Project {
    id: number;
    name: string;
  }

  export interface Tab {
    id: number;
    name: string;
    tasks: Task[];
    project: number;
  }

  export interface Task {
    id: number;
    title: string;
    status: string;
    purpose?: string;
    background?: string;
    description?: string;
    scheduled_start_time?: string | null;  // 日付はISO 8601の文字列形式
    due_date?: string | null;    // 締め切り（追加）
    actual_start_time?: string | null;  // 開始時
    completion_date?: string | null;  // 完了時
    difficulty: number;  // 難易度 (1-10段階)
    expected_work_time: number;      // 想定作業時間（分単位）
    actual_work_time?: number;      // 想定作業時間（分単位）
    overtime: number;    // 超過時間（分単位）
    achievement: number; // 達成度（%）
    tab: number;         // タブの外部キー
    project: number;
    comment?: string;    // コメント（追加）
  }
  