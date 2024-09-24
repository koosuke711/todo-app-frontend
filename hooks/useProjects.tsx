"use client";

import { useState, useEffect } from 'react';
import { Project } from '../src/types';
import { fetchWithToken } from './authHooks';

// プロジェクト関連のロジックをカスタムフックにまとめる
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // プロジェクト一覧を取得
  useEffect(() => {
    const getProjects = async () => {
      const token = await fetchWithToken();
      if (token) {
        fetch(`${backendUrl}/api/projects/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data: Project[]) => setProjects(data))
          .catch((error) => console.error('Error fetching projects:', error));
      }
    };

    getProjects();
  }, []);

  // 新しいプロジェクトを追加（渡すのは新しいプロジェクト名）
  const addProject = async (newProjectName: string) => {
    const token = await fetchWithToken();
    fetch(`${backendUrl}/api/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newProjectName, description: '' }),
    })
      .then((response) => response.json())
      .then((newProject: Project) => setProjects((prevProjects) => [...prevProjects, newProject]))
      .catch((error) => console.error('Error adding project:', error));
  };

  // プロジェクト名を更新
  const updateProject = async (projectId: number, updatedProjectName: string) => {
    const token = await fetchWithToken();
    fetch(`${backendUrl}/api/projects/${projectId}/`, {
      method: 'PUT', // PATCHでも可
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: updatedProjectName }),
    })
      .then((response) => response.json())
      .then((updatedProject: Project) => {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
      })
      .catch((error) => console.error('Error updating project:', error));
  };

  // プロジェクトを削除
  const deleteProject = async (projectId: number) => {
    const token = await fetchWithToken();
    fetch(`${backendUrl}/api/projects/${projectId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      })
      .catch((error) => console.error('Error deleting project:', error));
  };

  return {
    projects,
    selectedProject,
    setSelectedProject,
    addProject,
    updateProject, // プロジェクト名の更新
    deleteProject, // プロジェクトの削除
  };
};
