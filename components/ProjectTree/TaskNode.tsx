// components/TaskNode.tsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import { formatDate } from './utils';

interface TaskNodeProps {
  data: {
    label: string;
    start_date: string;
    due_date: string;
  };
}

// タスクノードの表示用コンポーネント
export function TaskNode({ data }: TaskNodeProps) {
  return (
    <div style={{ padding: 10, borderRadius: 5, border: '1px solid #ddd', background: '#f3f4f6', position: 'relative' }}>
      <Handle type="source" position={Position.Top} id="top" style={{ background: '#555' }} />
      <strong>{data.label}</strong>
      <div>開始日: {formatDate(data.start_date)}</div>
      <div>締切日: {formatDate(data.due_date)}</div>
      <Handle type="target" position={Position.Bottom} id="bottom" style={{ background: '#555' }} />
    </div>
  );
}
