"use client";

import React from "react"
import { useProjects } from '../hooks/useProjects';
import { useTabs } from "@/hooks/useTabs";
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/Sidebar";
import { TabsSection } from "../components/TabsSection";
import { useAuthCheck } from "@/hooks/authHooks";
import { useRouter } from "next/navigation";
import { TaskProvider } from "@/hooks/TaskContext";

export default function TodoApp() {
  const router = useRouter();

  useAuthCheck(router);
  
  const { projects, selectedProject, setSelectedProject, addProject, updateProject, deleteProject } = useProjects();
  const { tabs, addTab, updateTab, deleteTab } = useTabs();

  return (
    <TaskProvider>
      <Card className="flex w-full overflow-hidden">
        <Sidebar
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          onAddProject={addProject}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
        />
        <TabsSection
          selectedProject={selectedProject}
          tabs={tabs}
          addTab={addTab}
          updateTab={updateTab}
          deleteTab={deleteTab}
        />
      </Card>
    </TaskProvider>
  );
}
