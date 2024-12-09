import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Task } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { LogOut } from 'lucide-react';



export function TaskDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { addTask, updateTask, deleteTask } = useTaskStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleCreateTask = (data: any) => {
    const userId = user?._id;
    console.log("our user is ",userId)
    // const user = useAuthStore((state) => state.user);
    // console.log("user id of the user",user._id)
    addTask({
      ...data,
      status: 'pending',
      createdBy: userId || '',
    });
    setIsCreating(false);
    toast.success('Task created successfully');
  };
  

  const handleUpdateTask = async (data: Task) => {
    if (editingTask) {
      await updateTask(editingTask._id, data); // Call updateTask with ID and updates
      setEditingTask(null);
      toast.success('Task updated successfully');
    }
  };
  

  const handleDeleteTask = (task: string) => {
    deleteTask(task._id);
    toast.success('Task deleted successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isCreating || editingTask ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <TaskForm
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask || undefined}
                buttonText={editingTask ? 'Update Task' : 'Create Task'}
              />
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingTask(null);
                }}
                className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create New Task
                </button>
              </div>
              <TaskList
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}