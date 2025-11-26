import React, { useState } from 'react';

export default function ProjectForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Project Name <span className="text-red-500">*</span></label>
        <input 
          autoFocus
          type="text" 
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="e.g. Website Redesign"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
        <textarea 
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="Briefly describe the goals of this project..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">Save Project</button>
      </div>
    </form>
  );
}
