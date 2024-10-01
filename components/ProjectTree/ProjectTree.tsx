// components/ProjectTree.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Task } from "../../src/types";
import { fetchWithToken } from "@/hooks/authHooks";
import { TaskList } from "./TaskList";
import { ProjectTreeCanvas } from "./ProjectTreeCanvas";
import { useNodesState, useEdgesState, NodeChange, EdgeChange, addEdge, Connection, Node } from 'reactflow';

interface ProjectTreeProps {
  tasks: Task[];
  projectId: number;
}

// メインの ProjectTree コンポーネント
export function ProjectTree({ tasks, projectId }: ProjectTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [taskToEdit, setTaskToEdit] = useState<Task>(tasks[0]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchProjectTree = async () => {
    try {
      const token = await fetchWithToken();
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

  const saveProjectTree = useCallback(async (updatedEdges = edges, updatedNodes = nodes) => {
    try {
      const token = await fetchWithToken();
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

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      saveProjectTree(newEdges, nodes);
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

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    saveProjectTree(edges, nodes);
  }, [onNodesChange, edges, nodes, saveProjectTree]);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    saveProjectTree(edges, nodes);
  }, [onEdgesChange, edges, nodes, saveProjectTree]);

  const handleNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    const clickedTaskId = Number(node.id);
    const clickedTask = tasks.find((task) => task.id === clickedTaskId);

    if (clickedTask) {
      setTaskToEdit(clickedTask);
      setIsEditMode(true);
      setIsTaskDialogOpen(true);
    }
  }, [tasks]);

  useEffect(() => {
    fetchProjectTree();
  }, [projectId]);

  const tabColors: { [key: string]: string } = {};
  tasks.forEach((task) => {
    if (!tabColors[task.tab]) {
      tabColors[task.tab] = `hsl(${(Object.keys(tabColors).length * 137.5) % 360}, 70%, 80%)`;
    }
  });

  return (
    <div className="flex h-[calc(100vh-240px)]">
      <TaskList tasks={tasks} tabColors={tabColors} addTaskToTree={addTaskToTree} />
      <ProjectTreeCanvas
        tasks={tasks}
        projectId={projectId}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        tabColors={tabColors}
        handleNodesChange={handleNodesChange}
        handleEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        handleNodeDoubleClick={handleNodeDoubleClick}
        isTaskDialogOpen={isTaskDialogOpen}
        setIsTaskDialogOpen={setIsTaskDialogOpen}
        taskToEdit={taskToEdit}
        isEditMode={isEditMode}
      />
    </div>
  );
}

export default ProjectTree;
