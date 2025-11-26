import React, { useState, useMemo } from 'react';
import { 
  DndContext, 
  closestCorners, 
  MouseSensor, 
  TouchSensor, 
  KeyboardSensor,
  useSensor, 
  useSensors, 
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus, X } from 'lucide-react';
import DroppableColumn from './DroppableColumn';
import SortableTask from './SortableTask';
import { getPriorityColor } from '../../utils/helpers';

export default function KanbanBoard({ 
  project, 
  columns, 
  tasks, 
  setTasks, 
  onAddColumn, 
  onDeleteColumn, 
  onAddTask, 
  onEditTask 
}) {
  const [activeDragId, setActiveDragId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const tasksByColumn = useMemo(() => {
     const grouped = {};
     columns.forEach(col => {
        grouped[col.id] = tasks
           .filter(t => t.columnId === col.id)
           .sort((a, b) => a.order - b.order);
     });
     return grouped;
  }, [tasks, columns]);

  // --- DND HANDLERS ---
  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((currentTasks) => {
        const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
        const overIndex = currentTasks.findIndex((t) => t.id === overId);
        
        if (currentTasks[activeIndex].columnId !== currentTasks[overIndex].columnId) {
          const newTasks = [...currentTasks];
          newTasks[activeIndex].columnId = currentTasks[overIndex].columnId;
          return arrayMove(newTasks, activeIndex, overIndex - 1); 
        }
        return arrayMove(currentTasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === 'Column';
    if (isActiveTask && isOverColumn) {
      setTasks((currentTasks) => {
        const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
        if (currentTasks[activeIndex].columnId !== overId) {
          const newTasks = [...currentTasks];
          newTasks[activeIndex].columnId = overId;
          return arrayMove(newTasks, activeIndex, activeIndex);
        }
        return currentTasks;
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Persist final order logic
    setTasks(currentTasks => {
       const columnCounters = {};
       return currentTasks.map(t => {
          if (!columnCounters[t.columnId]) columnCounters[t.columnId] = 0;
          const newOrder = columnCounters[t.columnId];
          columnCounters[t.columnId]++;
          return { ...t, order: newOrder };
       });
    });
  };

  const activeDragTask = activeDragId ? tasks.find(t => t.id === activeDragId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        <div className="mb-4 flex-shrink-0">
           <p className="text-slate-500 text-sm max-w-3xl">{project.description}</p>
        </div>
        
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex h-full gap-4 min-w-max px-1">
            {columns.map(column => {
              const columnTasks = tasksByColumn[column.id] || [];

              return (
                <div 
                  key={column.id}
                  className="w-80 flex flex-col rounded-xl bg-slate-100/80 transition-colors duration-200 max-h-full"
                >
                  <div className="p-3 flex items-center justify-between font-semibold text-slate-700 border-b border-slate-200/50">
                    <div className="flex items-center gap-2">
                       <span className="bg-slate-200 text-xs px-2 py-0.5 rounded-full text-slate-600">{columnTasks.length}</span>
                       <span>{column.name}</span>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => onDeleteColumn(column.id)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <SortableContext 
                    id={column.id}
                    items={columnTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn id={column.id} className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-300">
                      {columnTasks.map(task => (
                        <SortableTask 
                          key={task.id} 
                          task={task} 
                          onClick={() => onEditTask(task)}
                        />
                      ))}
                    </DroppableColumn>
                  </SortableContext>

                  <div className="p-3 pt-0">
                    <button 
                      onClick={() => onAddTask(column.id)}
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-200 rounded-lg transition-colors border border-transparent hover:border-slate-300 border-dashed"
                    >
                      <Plus size={16} /> Add Task
                    </button>
                  </div>
                </div>
              );
            })}

            <button 
              onClick={onAddColumn}
              className="w-12 flex-shrink-0 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              title="Add another column"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: { active: { opacity: '0.5' } },
        }),
      }}>
        {activeDragTask ? (
           <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-blue-500 cursor-grabbing w-80 rotate-2 scale-105">
              <h4 className="text-sm font-medium text-slate-800 leading-snug mb-2">{activeDragTask.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(activeDragTask.priority)}`}>
                  {activeDragTask.priority}
              </span>
           </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}
