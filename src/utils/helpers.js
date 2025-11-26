
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Low': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};
