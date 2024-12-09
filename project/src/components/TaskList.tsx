
import React ,{useEffect,useState} from 'react';
import { format } from 'date-fns';
import { Task } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { Pencil, Trash2, CheckCircle, User, Key } from 'lucide-react';

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export function TaskList({ onEdit, onDelete }: TaskListProps) {
  const tasks = useTaskStore((state) => state.getCurrentPageTasks());
  const currentPage = useTaskStore((state) => state.currentPage);
  const totalPages = useTaskStore((state) => state.getTotalPages());
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const setPage = useTaskStore((state) => state.setPage);
  const updateTask = useTaskStore((state) => state.updateTask);

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusToggle = (task:any) => {
    updateTask(task._id, {
      status: task.status === 'completed' ? 'pending' : 'completed',
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="space-y-4">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleStatusToggle(task)}
                    className={`${
                      task.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <div>
                    <h3
                      className={`text-lg font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description Section */}
              <div className="pl-8">
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              {/* Footer Section */}
              <div className="pl-8 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Assigned to: {task.assignedTo}</span>
                  </div>
                  <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                </div>
                <div>
                  <span className="text-xs">
                    Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}