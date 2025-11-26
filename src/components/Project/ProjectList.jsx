import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Edit2, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function ProjectList({ projects, tasks, columns, onEditProject, onDeleteProject, onCreateProject }) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-slate-100 p-6 rounded-full inline-block mb-4">
          <Layout size={48} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No projects yet</h3>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create your first project to start managing tasks with your team.</p>
        <button 
          onClick={onCreateProject}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => {
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const completed = projectTasks.filter(t => {
           const col = columns.find(c => c.id === t.columnId);
           return col && col.name.toLowerCase() === 'done';
        }).length;
        const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

        return (
          <div 
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEditProject(project); }}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                    className="p-1.5 hover:bg-red-50 rounded text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.description || "No description provided."}</p>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{completed}/{projectTasks.length} tasks</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={12} />
                <span>Updated {formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
