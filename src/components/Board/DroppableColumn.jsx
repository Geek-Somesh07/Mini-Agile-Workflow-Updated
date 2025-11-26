import React from 'react';
import { useSortable } from '@dnd-kit/sortable';

export default function DroppableColumn({ id, children, className }) {
  const { setNodeRef } = useSortable({ 
    id: id,
    data: {
      type: 'Column',
    }
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}
