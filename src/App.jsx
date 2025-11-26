import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ChevronLeft, Layout, Plus } from 'lucide-react';
import { generateId } from './utils/helpers';
import { useLocalStorage } from './hooks/useLocalStorage';

// Components
import ProjectList from './components/Project/ProjectList';
import ProjectForm from './components/Project/ProjectForm';
import TaskForm from './components/Task/TaskForm';
import Modal from './components/UI/Modal';

// Pages
import BoardPage from './pages/BoardPage';

export default function App() {
  // --- STATE ---
  const [projects, setProjects] = useLocalStorage('agile-projects', []);
  const [columns, setColumns] = useLocalStorage('agile-columns', []);
  const [tasks, setTasks] = useLocalStorage('agile-tasks', []);
  
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Modals state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  
  // Need to track which column triggered 'add task'
  const [activeColumnId, setActiveColumnId] = useState(null);

  // --- ACTIONS: PROJECT ---
  const handleSaveProject = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectData, updatedAt: new Date().toISOString() } : p));
    } else {
      const newProject = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...projectData
      };
      setProjects([...projects, newProject]);
      
      // Create default columns
      const defaultCols = ['Backlog', 'To Do', 'In Progress', 'Done'];
      const newColumns = defaultCols.map((name, index) => ({
        id: generateId(),
        projectId: newProject.id,
        name,
        order: index
      }));
      setColumns(prev => [...prev, ...newColumns]);
    }
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure? This will delete all tasks in this project.")) {
      setProjects(projects.filter(p => p.id !== projectId));
      setColumns(columns.filter(c => c.projectId !== projectId));
      setTasks(tasks.filter(t => t.projectId !== projectId));
    }
  };

  // --- ACTIONS: TASK ---
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData, updatedAt: new Date().toISOString() } : t));
    } else {
      const projectId = columns.find(c => c.id === taskData.columnId)?.projectId;
      const colTasks = tasks.filter(t => t.columnId === taskData.columnId);
      
      const newTask = {
        id: generateId(),
        projectId: projectId, 
        columnId: taskData.columnId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: colTasks.length,
        ...taskData
      };
      setTasks([...tasks, newTask]);
    }
    setShowTaskModal(false);
    setEditingTask(null);
    setActiveColumnId(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter(t => t.id !== taskId));
      setShowTaskModal(false);
      setEditingTask(null);
    }
  };

  // Determine current project name for header
  const isBoardView = location.pathname.startsWith('/projects/');
  const currentProjectId = isBoardView ? location.pathname.split('/')[2] : null;
  const currentProject = projects.find(p => p.id === currentProjectId);

  const taskModalColumns = currentProjectId 
    ? columns.filter(c => c.projectId === currentProjectId)
    : columns; 

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {isBoardView ? (
            <button 
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Layout size={20} />
            </div>
          )}
          
          <h1 className="text-xl font-bold text-slate-800">
            {isBoardView && currentProject ? currentProject.name : 'My Projects'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!isBoardView && (
            <button 
              onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus size={16} /> New Project
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT WITH UPDATED ROUTES */}
      <main className="p-4 h-[calc(100vh-64px)] overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          
          <Route path="/projects" element={
            <div className="max-w-5xl mx-auto h-full overflow-y-auto pb-20">
              <ProjectList 
                 projects={projects} 
                 tasks={tasks} 
                 columns={columns}
                 onCreateProject={() => setShowProjectModal(true)}
                 onEditProject={(p) => { setEditingProject(p); setShowProjectModal(true); }}
                 onDeleteProject={handleDeleteProject}
              />
            </div>
          } />
          
          <Route path="/projects/:projectId" element={
            <BoardPage 
               projects={projects}
               columns={columns}
               tasks={tasks}
               setTasks={setTasks}
               setColumns={setColumns}
               onAddTask={(colId) => { setActiveColumnId(colId); setEditingTask(null); setShowTaskModal(true); }}
               onEditTask={(task) => { setEditingTask(task); setShowTaskModal(true); }}
            />
          } />
        </Routes>
      </main>

      {/* MODALS */}
      {showProjectModal && (
        <Modal 
          title={editingProject ? "Edit Project" : "Create New Project"} 
          onClose={() => setShowProjectModal(false)}
        >
          <ProjectForm 
            initialData={editingProject} 
            onSubmit={handleSaveProject} 
            onCancel={() => setShowProjectModal(false)} 
          />
        </Modal>
      )}

      {showTaskModal && (
        <Modal 
          title={editingTask ? "Edit Task" : "New Task"} 
          onClose={() => setShowTaskModal(false)}
          width="max-w-2xl"
        >
          <TaskForm 
            initialData={editingTask} 
            onSubmit={handleSaveTask}
            onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : null}
            onCancel={() => setShowTaskModal(false)}
            columns={taskModalColumns}
            defaultColumnId={activeColumnId}
          />
        </Modal>
      )}
    </div>
  );
}
