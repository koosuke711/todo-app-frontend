// components/ProjectTreeCanvas.tsx
import React, { useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { Task } from '../../src/types';
import { TaskDialog } from '../TaskDialog';
import { TaskNode } from './TaskNode';

interface ProjectTreeCanvasProps {
  tasks: Task[];
  projectId: number;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  tabColors: { [key: string]: string };
  saveProjectTree: (updatedEdges: Edge[], updatedNodes: Node[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  handleNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  handleEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  handleNodeDoubleClick: (_: React.MouseEvent, node: Node) => void;
  isTaskDialogOpen: boolean;
  setIsTaskDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskToEdit: Task;
  isEditMode: boolean;
}

// ReactFlow のキャンバス表示用コンポーネント
export function ProjectTreeCanvas({
  projectId,
  nodes,
  edges,
  saveProjectTree,
  onNodesChange,
  handleNodesChange,
  onEdgesChange,
  handleEdgesChange,
  onConnect,
  handleNodeDoubleClick,
  isTaskDialogOpen,
  setIsTaskDialogOpen,
  taskToEdit,
  isEditMode,
}: ProjectTreeCanvasProps) {
  const nodeTypes = {
    taskNode: TaskNode,
  };

  console.log(nodes)
  // console.log(edges)
  console.log('キャンバスのレンダリング')

  return (
    <div className="w-3/4 pl-4">
      <h3 className="text-lg font-semibold mb-2">プロジェクトツリー</h3>
      <div style={{ width: '75%', height: '95%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // onNodesChange={onNodesChange}
          // onNodesChange={() => handleNodesChange}
          onNodesChange={handleNodesChange}
          // onEdgesChange={onEdgesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={handleNodeDoubleClick}
          fitView
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>

        <TaskDialog
          isOpen={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          task={taskToEdit}
          tabId={taskToEdit?.tab}
          projectId={projectId}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
}
