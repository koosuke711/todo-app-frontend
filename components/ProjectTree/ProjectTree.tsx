import React, { useEffect, useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  NodeChange,
  EdgeChange,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Task } from "../../src/types";
import { fetchWithToken } from "@/hooks/authHooks";
import { TaskDialog } from "../TaskDialog";
import { TaskNode } from "./TaskNode";
import { TaskList } from "./TaskList";

// カスタムノードタイプを定義
const nodeTypes = {
  taskNode: TaskNode,
};

interface ProjectTreeProps {
  tasks: Task[];
  projectId: number;
}

// 動的に色を生成する関数
const generateColorForTab = (index: number) => {
  const hue = (index * 137.5) % 360; // 黄金角を使用して色相をずらす
  return `hsl(${hue}, 70%, 80%)`; // 彩度70%、明度80%で色を生成
}

export function ProjectTree({ tasks, projectId }: ProjectTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [taskToEdit, setTaskToEdit] = useState<Task>(tasks[0]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // プロジェクトツリーを取得
  const fetchProjectTree = async () => {
    try {
      const token = await fetchWithToken(); // JWTトークン取得
      const response = await fetch(`${backendUrl}/api/projects/${projectId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const project = await response.json();
        const { tree_data } = project;

        setNodes(tree_data?.nodes || []);
        setEdges(tree_data?.edges || []);
      } else {
        console.error("Failed to fetch project tree");
      }
    } catch (error) {
      console.error('Error fetching project tree:', error);
    }
  };

  // ツリーを保存
  const saveProjectTree = useCallback(async (updatedEdges = edges, updatedNodes = nodes) => {
    try {
      const token = await fetchWithToken(); // JWTトークン取得
      const treeData = { nodes: updatedNodes, edges: updatedEdges };

      const response = await fetch(`${backendUrl}/api/projects/${projectId}/save_tree/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(treeData),
      });

      if (!response.ok) {
        console.error('Failed to save project tree');
      } else {
        console.log('ツリーが保存されました');
      }
    } catch (error) {
      console.error('Error saving project tree:', error);
    }
  }, [edges, nodes, projectId]);

  // エッジを追加する
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      saveProjectTree(newEdges, nodes); // エッジ追加時にツリーを保存
      return newEdges;
    });
  }, [nodes, saveProjectTree]);

  // タスクをツリーに追加する
  const addTaskToTree = (task: Task) => {
    const newNode = {
      id: task.id.toString(),
      data: {
        label: task.title,
        start_date: task.scheduled_start_time || '未設定',
        due_date: task.due_date || '未設定',
      },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      style: { background: tabColors[task.tab] || '#E0E0E0', padding: 10, borderRadius: 5 },
      type: 'taskNode', // カスタムノードタイプを指定
    };

    setNodes((nds) => {
      const newNodes = [...nds, newNode];
      saveProjectTree(edges, newNodes); // 追加時にツリーを保存
      return newNodes;
    });
  };

  // ノード変更時にツリーを保存
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    saveProjectTree(edges, nodes); // ノードが変更されたらツリーを保存
  }, [onNodesChange, edges, nodes, saveProjectTree]);

  // エッジ変更時にツリーを保存
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    saveProjectTree(edges, nodes); // エッジが変更されたらツリーを保存
  }, [onEdgesChange, edges, nodes, saveProjectTree]);

  // ノードをダブルクリックしたときにダイアログを開くように変更
  const handleNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    const clickedTaskId = Number(node.id); // ノードの ID をタスクの ID として取得
    const clickedTask = tasks.find((task) => task.id === clickedTaskId); // ID に対応するタスクを取得

    if (clickedTask) {
      setTaskToEdit(clickedTask); // ダイアログに表示するタスクを設定
      setIsEditMode(true);        // 編集モードに設定
      setIsTaskDialogOpen(true);  // ダイアログを表示
    }
  }, [tasks]);

  // 初回レンダリング時にツリーを取得
  useEffect(() => {
    fetchProjectTree();
  }, [projectId]);

  // タスクの色を管理
  const tabColors: { [key: string]: string } = {};

  // タブごとの色を割り当てる
  tasks.forEach((task) => {
    if (!tabColors[task.tab]) {
      tabColors[task.tab] = generateColorForTab(Object.keys(tabColors).length);
    }
  });

  console.log(nodes)
  console.log(edges)

  return (
    <div className="flex h-[calc(100vh-240px)]">
      <TaskList tasks={tasks} tabColors={tabColors} addTaskToTree={addTaskToTree} />
      <div className="w-3/4 pl-4">
        <h3 className="text-lg font-semibold mb-2">プロジェクトツリー</h3>
        <div style={{ width: '75%', height: '95%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}  // ノード変更時に保存
            onEdgesChange={handleEdgesChange}  // エッジ変更時に保存
            onConnect={onConnect}              // ノード接続時に保存
            onNodeDoubleClick={handleNodeDoubleClick} // ノードをダブルクリックでダイアログを開くように変更
            fitView
            nodeTypes={nodeTypes}              // カスタムノードタイプを指定
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>

          <TaskDialog
            isOpen={isTaskDialogOpen}
            onClose={() => setIsTaskDialogOpen(false)}
            task={taskToEdit}
            tabId={taskToEdit?.tab}   // 編集するタスクのタブ ID
            projectId={projectId}     // プロジェクト ID
            isEditMode={isEditMode}   // 編集モードかどうか
          />
        </div>
      </div>
    </div>
  );
}
