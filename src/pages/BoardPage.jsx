import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/Board/KanbanBoard';

export default function BoardPage({ 
  projects, 
  columns, 
  tasks, 
  setTasks, 
  setColumns,
  onAddTask,
  onEditTask
}) {
  const { projectId } = useParams();
  
  const project = projects.find(p => p.id === projectId);

  // Filter columns for this specific project
  const projectColumns = useMemo(() => {
    return columns
      .filter(c => c.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }, [columns, projectId]);

  const handleAddColumn = () => {
    const name = prompt("Enter column name:");
    if (name) {
      setColumns([...columns, {
        id: Math.random().toString(36).substr(2, 9),
        projectId: projectId,
        name,
        order: projectColumns.length
      }]);
    }
  };

  const handleDeleteColumn = (colId) => {
    const colTasks = tasks.filter(t => t.columnId === colId);
    if (colTasks.length > 0) {
      alert("Please move or delete all tasks in this column first.");
      return;
    }
    if (window.confirm("Delete this column?")) {
      setColumns(columns.filter(c => c.id !== colId));
    }
  };

  if (!project) {
    return <div className="p-10 text-center text-slate-500">Project not found</div>;
  }

  return (
    <KanbanBoard 
      project={project}
      columns={projectColumns}
      tasks={tasks}
      setTasks={setTasks}
      onAddColumn={handleAddColumn}
      onDeleteColumn={handleDeleteColumn}
      onAddTask={onAddTask}
      onEditTask={onEditTask}
    />
  );
}
