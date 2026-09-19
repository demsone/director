import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { default as Projects } from './pages/Projects';
import { default as Index } from './pages/Index';
import { default as FeedbackComplete } from './pages/FeedbackComplete';
import { default as CompareComplete } from './pages/CompareComplete';
import { default as ProjectQuick } from './pages/ProjectQuick';
import { default as CompareLibrary } from './pages/CompareLibrary';
import { default as DarkroomQuick } from './pages/DarkroomQuick';
import { default as SettingsModels } from './pages/SettingsModels';
import { default as ProjectSettings } from './pages/ProjectSettings';
import { default as SettingsPersonalisation } from './pages/SettingsPersonalisation';
import { default as FeedbackDetail } from './pages/FeedbackDetail';
import { default as ProjectOverview } from './pages/ProjectOverview';
import { default as PromptEditorReference } from './pages/PromptEditorReference';
import { default as DesignStudioDetail } from './pages/DesignStudioDetail';
import { default as Prompts } from './pages/Prompts';
import { default as SettingsAppearance } from './pages/SettingsAppearance';
import { default as PromptEdit } from './pages/PromptEdit';
import { default as FeedbackThinking } from './pages/FeedbackThinking';
import { default as CompareThinking } from './pages/CompareThinking';
import { default as DarkroomDetail } from './pages/DarkroomDetail';
import { default as CompareLibraryDetail } from './pages/CompareLibraryDetail';
import { default as CompareDetail } from './pages/CompareDetail';
import { default as DesignStudio } from './pages/DesignStudio';
import { default as DesignStudioQuick } from './pages/DesignStudioQuick';
import { default as Darkroom } from './pages/Darkroom';
import { default as CompareNew } from './pages/CompareNew';
import { default as FeedbackNew } from './pages/FeedbackNew';
import { default as ProjectFeedback } from './pages/ProjectFeedback';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/feedback-new" replace />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/' element={<Index />} />
        <Route path='/feedback-complete' element={<FeedbackComplete />} />
        <Route path='/compare-complete' element={<CompareComplete />} />
        <Route path='/project-quick' element={<ProjectQuick />} />
        <Route path='/compare-library' element={<CompareLibrary />} />
        <Route path='/darkroom-quick' element={<DarkroomQuick />} />
        <Route path='/settings-models' element={<SettingsModels />} />
        <Route path='/project-settings' element={<ProjectSettings />} />
        <Route path='/settings-personalisation' element={<SettingsPersonalisation />} />
        <Route path='/feedback-detail' element={<FeedbackDetail />} />
        <Route path='/project-overview' element={<ProjectOverview />} />
        <Route path='/prompt-editor-reference' element={<PromptEditorReference />} />
        <Route path='/design-studio-detail' element={<DesignStudioDetail />} />
        <Route path='/prompts' element={<Prompts />} />
        <Route path='/settings-appearance' element={<SettingsAppearance />} />
        <Route path='/prompt-edit' element={<PromptEdit />} />
        <Route path='/feedback-thinking' element={<FeedbackThinking />} />
        <Route path='/compare-thinking' element={<CompareThinking />} />
        <Route path='/darkroom-detail' element={<DarkroomDetail />} />
        <Route path='/compare-library-detail' element={<CompareLibraryDetail />} />
        <Route path='/compare-detail' element={<CompareDetail />} />
        <Route path='/design-studio' element={<DesignStudio />} />
        <Route path='/design-studio-quick' element={<DesignStudioQuick />} />
        <Route path='/darkroom' element={<Darkroom />} />
        <Route path='/compare-new' element={<CompareNew />} />
        <Route path='/feedback-new' element={<FeedbackNew />} />
        <Route path='/project-feedback' element={<ProjectFeedback />} />

      </Routes>
          </AppProvider>
    </BrowserRouter>
  );
}

export default App;
