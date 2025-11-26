import React, { useState } from 'react';
import { Layout, User, Calendar, Trash2 } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';

export default function TaskForm({ initialData, onSubmit, onDelete, onCancel, columns, defaultColumnId }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'Medium',
    assignee: initialData?.assignee || '',
    dueDate: initialData?.dueDate || '',
    columnId: initialData?.columnId || defaultColumnId || columns[0]?.id
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Task Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            required
            className="w-full px-3 py-2 text-lg font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="What needs to be done?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
            <div className="relative">
              <select 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.columnId}
                onChange={e => setFormData({...formData, columnId: e.target.value})}
              >
                {columns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-slate-500">
                <Layout size={14} />
              </div>
            </div>
          </div>
           
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium border transition-all ${
                    formData.priority === p 
                      ? getPriorityColor(p) + ' ring-1 ring-offset-1'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assignee</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.assignee}
                onChange={e => setFormData({...formData, assignee: e.target.value})}
                placeholder="Name"
              />
              <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
               <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
          <textarea 
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-slate-50 focus:bg-white"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Add more details..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        {onDelete ? (
           <button 
            type="button" 
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
           >
             <Trash2 size={16} /> Delete Task
           </button>
        ) : <div />}
        
        <div className="flex gap-3">
           <button type="button" onClick={onCancel} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
           <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200">
             {initialData ? 'Save Changes' : 'Create Task'}
           </button>
        </div>
      </div>
    </form>
  );
}
