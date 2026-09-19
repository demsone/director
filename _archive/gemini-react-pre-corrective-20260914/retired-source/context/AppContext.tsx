import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Record {
  id: string;
  type: 'feedback' | 'compare';
  title: string;
  date: string;
  sourceImage?: string;
  sourceImages?: string[];
  prompt: string;
  model: string;
  result: string;
  isFavourite?: boolean;
  projectId?: string;
  chat?: { role: 'user' | 'assistant'; text: string }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
}

export interface Prompt {
  id: string;
  title: string;
  body: string;
  isArchived: boolean;
}

export interface AppState {
  records: Record[];
  projects: Project[];
  prompts: Prompt[];
  
  // Settings
  modelFeedback: string;
  modelCompare: string;
  modelVision: string;
  localServerUrl: string;
  baseStyle: string;
  warmth: string;
  theme: string;
  accent: string;
  
  // Actions
  saveRecord: (rec: Record) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, updates: Partial<Record>) => void;
  
  saveProject: (proj: Project) => void;
  savePrompt: (prompt: Prompt) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  
  updateSettings: (key: string, val: string) => void;
  
  // Intermediate state
  currentFeedbackImage: string | null;
  setCurrentFeedbackImage: (val: string | null) => void;
  currentFeedbackPrompt: string;
  setCurrentFeedbackPrompt: (val: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  
  const [currentFeedbackImage, setCurrentFeedbackImage] = useState<string | null>(null);
  const [currentFeedbackPrompt, setCurrentFeedbackPrompt] = useState<string>('');
  
  const [settings, setSettings] = useState({
    modelFeedback: 'gemma-4',
    modelCompare: 'gemma-4',
    modelVision: 'gemma-4-vision',
    localServerUrl: 'http://localhost:11434',
    baseStyle: 'direct',
    warmth: 'neutral',
    theme: 'Dark',
    accent: 'blue'
  });

  useEffect(() => {
    const savedRecords = localStorage.getItem('director_records');
    if (savedRecords) setRecords(JSON.parse(savedRecords));
    
    const savedProjects = localStorage.getItem('director_projects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    
    const savedPrompts = localStorage.getItem('director_prompts');
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
    else {
      // Default prompt
      setPrompts([{ id: uuidv4(), title: 'Photography', body: 'Analyze this photograph for composition and lighting.', isArchived: false }]);
    }
    
    const savedSettings = localStorage.getItem('director_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const saveRecord = (rec: Record) => {
    const next = [rec, ...records];
    setRecords(next);
    localStorage.setItem('director_records', JSON.stringify(next));
  };
  
  const deleteRecord = (id: string) => {
    const next = records.filter(r => r.id !== id);
    setRecords(next);
    localStorage.setItem('director_records', JSON.stringify(next));
  };
  
  const updateRecord = (id: string, updates: Partial<Record>) => {
    const next = records.map(r => r.id === id ? { ...r, ...updates } : r);
    setRecords(next);
    localStorage.setItem('director_records', JSON.stringify(next));
  };

  const saveProject = (proj: Project) => {
    const next = [proj, ...projects];
    setProjects(next);
    localStorage.setItem('director_projects', JSON.stringify(next));
  };
  
  const savePrompt = (p: Prompt) => {
    const next = [p, ...prompts];
    setPrompts(next);
    localStorage.setItem('director_prompts', JSON.stringify(next));
  };
  
  const updatePrompt = (id: string, updates: Partial<Prompt>) => {
    const next = prompts.map(r => r.id === id ? { ...r, ...updates } : r);
    setPrompts(next);
    localStorage.setItem('director_prompts', JSON.stringify(next));
  };
  
  const updateSettings = (key: string, val: string) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    localStorage.setItem('director_settings', JSON.stringify(next));
  };

  return (
    <AppContext.Provider value={{
      records, projects, prompts,
      ...settings,
      saveRecord, deleteRecord, updateRecord,
      saveProject, savePrompt, updatePrompt, updateSettings,
      currentFeedbackImage, setCurrentFeedbackImage,
      currentFeedbackPrompt, setCurrentFeedbackPrompt
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
