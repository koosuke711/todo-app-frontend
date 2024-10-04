"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserCircle, Plus } from "lucide-react"
import { Project } from "../src/types"
import { ProjectDialog } from './ProjectDialog';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
  onAddProject: (name: string) => void;
  onUpdateProject: (id: number, name: string) => void;
  onDeleteProject: (id: number) => void;
}

export function Sidebar({
  projects, 
  selectedProject, 
  setSelectedProject, 
  onAddProject, 
  onUpdateProject, 
  onDeleteProject 
}: SidebarProps) {
  const router = useRouter();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleButtonClick = () => {
    router.push('/account');  // /account にプログラム的に遷移
  };

  // 新規プロジェクト作成時
  const handleNewProject = () => {
    setIsEditMode(false);
    setIsProjectDialogOpen(true);
  };

  // プロジェクト名をダブルクリックして編集する時
  const handleEditProject = () => {
    setIsEditMode(true);
    setIsProjectDialogOpen(true);
  };

  return (
    <div className="w-64 border-r">
      <div className="p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleButtonClick}>
          <UserCircle className="mr-2 h-4 w-4" />
          アカウント
        </Button>
      </div>
      {/* ↓プロジェクトがデカくて歪だから修正 */}
      <h1 className="text-xl font-bold mb-auto mt-6 mx-6">マイプロジェクト</h1>
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-2">
          {/* プロジェクト一覧をmap */}
          {projects.map((project) => (
            <Button
              key={project.id}
              variant={selectedProject === project ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedProject(project)}
              onDoubleClick={handleEditProject}  // ダブルクリックで編集ダイアログを開く
            >
              {project.name}
            </Button>
          ))}
          <Button variant="outline" className="w-full justify-start" onClick={handleNewProject}>
            <Plus className="mr-2 h-4 w-4" />
            新規プロジェクト
          </Button>
        </div>
      </ScrollArea>

      {/* ダイアログコンポーネント */}
      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        onAdd={onAddProject}  // 新規プロジェクト作成用
        onUpdate={onUpdateProject}  // プロジェクト更新用
        onDelete={onDeleteProject}  // プロジェクト削除用
        selectedProject={selectedProject}
        isEditMode={isEditMode}  // フラグで新規か更新かを管理
      />
    </div>
  )
}