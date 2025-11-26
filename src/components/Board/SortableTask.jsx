import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, User } from 'lucide-react';
import { formatDate, getPriorityColor } from '../../utils/helpers';

export default function SortableTask({ task, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task: task
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-50 bg-slate-50 border-2 border-dashed border-blue-400 rounded-lg h-[120px] w-full"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-300 transition-all group relative touch-none"
    >
      <div className="absolute top-2 right-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={14} />
      </div>

      <div className="flex justify-between items-start mb-2 pr-4">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className={`text-[10px] flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            <Calendar size={10} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
      
      <h4 className="text-sm font-medium text-slate-800 leading-snug mb-2">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
         <div className="flex items-center gap-1.5 text-slate-500">
           <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
             {task.assignee ? task.assignee.charAt(0).toUpperCase() : <User size={10}/>}
           </div>
           <span className="text-xs truncate max-w-[80px]">{task.assignee || 'Unassigned'}</span>
         </div>
      </div>
    </div>
  );
}
