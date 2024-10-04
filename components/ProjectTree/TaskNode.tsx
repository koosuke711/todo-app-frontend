import React from 'react';
import { Handle, Position } from 'reactflow';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface TaskNodeProps {
  data: {
    label: string;
    start_date: string;
    due_date: string;
    tab: string;
    color: string,
  };
}

const formatDate = (dateString: string) => {
  if (dateString === '未設定') return dateString;
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export function TaskNode({ data }: TaskNodeProps) {
  // const getTabColor = (tab: string) => {
  //   const colors: { [key: string]: string } = {
  //     'タブ1': '#3B82F6', // 青
  //     'タブ2': '#10B981', // 緑
  //     'タブ3': '#F59E0B', // オレンジ
  //     'タブ4': '#EF4444', // 赤
  //   };
  //   return colors[tab] || '#6B7280'; // デフォルトはグレー
  // };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: '250px' }}>
      <div 
        className="w-full h-2" 
        style={{ backgroundColor: data.color }}
      />
      <div className="p-4">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
        <h3 className="text-lg font-bold mb-2 text-gray-800 truncate">{data.label}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>開始: {formatDate(data.start_date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>締切: {formatDate(data.due_date)}</span>
        </div>
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
      </div>
    </div>
  );
}