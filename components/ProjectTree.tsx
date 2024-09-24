import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Task } from "../src/types"
import { fetchWithToken } from "@/hooks/authHooks"

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
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  

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

        setNodes(tree_data.nodes || []);
        setEdges(tree_data.edges || []);
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
  const onConnect = useCallback((params) => {
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
      data: { label: task.title },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      style: { background: tabColors[task.tab] || '#E0E0E0', padding: 10, borderRadius: 5 }
    };

    setNodes((nds) => {
      const newNodes = [...nds, newNode];
      saveProjectTree(edges, newNodes); // 追加時にツリーを保存
      return newNodes;
    });
  };

  // ノード変更時にツリーを保存
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    saveProjectTree(edges, nodes); // ノードが変更されたらツリーを保存
  }, [onNodesChange, edges, nodes, saveProjectTree]);

  // エッジ変更時にツリーを保存
  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    saveProjectTree(edges, nodes); // エッジが変更されたらツリーを保存
  }, [onEdgesChange, edges, nodes, saveProjectTree]);

  // 初回レンダリング時にツリーを取得
  useEffect(() => {
    fetchProjectTree();
  }, [projectId]);

  // タスクの色を管理
  const tabColors: { [key: string]: string } = {}

  // タブごとの色を割り当てる
  tasks.forEach((task, index) => {
    if (!tabColors[task.tab]) {
      tabColors[task.tab] = generateColorForTab(Object.keys(tabColors).length)
    }
  })

  return (
    <div className="flex h-[calc(100vh-240px)]">
      <div className="w-1/3 border-r pr-4">
        <h3 className="text-lg font-semibold mb-2">タスク一覧</h3>
        <ScrollArea className="h-full">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              className={`flex items-center justify-between p-2 mb-2 rounded-lg cursor-pointer`}
              style={{ backgroundColor: tabColors[task.tab] || '#E0E0E0' }}
              whileHover={{ scale: 1.05 }}
              onClick={() => addTaskToTree(task)}
            >
              <span>{task.title}</span>
              <span className="text-sm text-gray-600">{task.tab}</span>
            </motion.div>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 pl-4">
        <h3 className="text-lg font-semibold mb-2">プロジェクトツリー</h3>
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}  // ノード変更時に保存
            onEdgesChange={handleEdgesChange}  // エッジ変更時に保存
            onConnect={onConnect}              // ノード接続時に保存
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
