"use client";

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { TaskList } from './TaskList';
import { ReviewSection } from "./ReviewSection"
import { ProjectTree } from "./ProjectTree"
import { TabDialog } from "./TabDialog"
import { Project, Tab, Task } from '@/src/types';
import { useTasks } from '@/hooks/useTasks';
import { useTaskReminder } from '@/hooks/useTaskReminder';
import { CalendarSection } from './CalendarSection';
import { ScrollArea } from "@/components/ui/scroll-area";

interface TabsSectionProps {
  selectedProject: Project | null;
  tabs: Tab[];
  addTab: (projectId: number, tabName: string) => void;
  updateTab: (projectId: number, tabId: number, tabName: string) => void;
  deleteTab: (tabId: number) => void;
}

export function TabsSection({
  selectedProject,
  tabs,
  addTab,
  updateTab,
  deleteTab,
}: TabsSectionProps) {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [isTabDialogOpen, setIsTabDialogOpen] = useState(false);
  const [editingTab, setEditingTab] = useState<Tab | null>(null); // 編集中のタブ
  const { allTask, addTask, updateTask, deleteTask } = useTasks();
  const [tasks, setTasks] = useState<Task[]>([]);  // 選ばれたプロジェクトのタスクを管理するステート
  
  // ここで通知を送る関数を実行する
  useTaskReminder(allTask)

  useEffect(() => {
    if (selectedProject) {
      // 選ばれたプロジェクトのタスクをallTaskからフィルタリング
      const filteredTasks = allTask.filter(task => task.project === selectedProject.id);
      setTasks(filteredTasks);  // フィルタリングしたタスクをtasksにセット
    } else {
      setTasks([]);  // プロジェクトが選ばれていない場合は空にする
    }
  }, [selectedProject, allTask]);  // selectedProject または allTask が変わるたびに実行

  // 新しいタブを作成
  const handleNewTab = () => {
    setEditingTab(null);
    setIsTabDialogOpen(true);
  };

  // タブ名を編集
  const handleEditTab = (tab: Tab) => {
    setEditingTab(tab);
    setIsTabDialogOpen(true);
  };

  return (
    <>
      <ScrollArea className="overflow-y-auto">
        <div className="w-full p-4 flex flex-col">
          <CalendarSection allTask={allTask} /> 
          {selectedProject ? (
            <Tabs onValueChange={setSelectedTab}>
              <div className="flex">
                <div className="flex overflow-x-auto max-w-screen-lg">
                  <TabsList>
                    <TabsTrigger value="振り返り">
                      振り返り
                    </TabsTrigger>
                    <TabsTrigger value="プロジェクトツリー">
                      プロジェクトツリー
                    </TabsTrigger>
                    {tabs
                      .filter((tab) => tab.project === selectedProject.id)
                      .map((tab) => (
                        <TabsTrigger 
                          key={tab.id} 
                          value={tab.name} 
                          className="relative pr-8"
                          onDoubleClick={() => handleEditTab(tab)}
                        >
                          {tab.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-0 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTab(tab.id);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TabsTrigger>
                      ))}
                  </TabsList>
                </div>
                <div>
                  <Button variant="outline" size="icon" className="ml-2" onClick={handleNewTab}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <TabsContent value="振り返り">
                <ReviewSection tasks={tasks} onUpdate={updateTask}/>
              </TabsContent>
              <TabsContent value="プロジェクトツリー">
                <ProjectTree tasks={tasks} projectId={selectedProject.id} />
              </TabsContent>
              {tabs
                .filter((tab) => tab.project === selectedProject.id)
                .map((tab) => (
                  <TabsContent key={tab.id} value={tab.name}>
                    <TaskList 
                      tasks={tasks} 
                      currentTab={tab.id} 
                      addTask={addTask}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                      projectId={selectedProject.id} 
                    />
                  </TabsContent>
                ))}
            </Tabs>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              プロジェクトを選択してください
            </div>
          )}

          {/* 新規タブ追加のダイアログ */}
          <TabDialog
            isOpen={isTabDialogOpen}
            onClose={() => setIsTabDialogOpen(false)}
            projectId={selectedProject?.id}
            tab={editingTab}
            onAdd={addTab}
            onUpdate={updateTab}
          />
        </div>
      </ScrollArea>
    </>
  );
}
