import { create } from "zustand";
import axios from "axios";
import { Task, Priority, Status } from "../types/task";
import { useAuthStore } from '../store/authStore';

interface TaskState {
  tasks: Task[];
  currentPage: number;
  itemsPerPage: number;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "_id" | "createdAt" | "updatedAt">) => void;
  updateTask: (_id: string, updates: Partial<Task>) => void;
  deleteTask: (_id: string) => void;
  setPage: (page: number) => void;
  getTotalPages: () => number;
  getCurrentPageTasks: () => Task[];
  getTasksByPriority: (priority: Priority) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentPage: 1,
  itemsPerPage: 5,

  fetchTasks: async () => {
    const user = useAuthStore.getState().user;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          params: { userId: user._id },
        }
      );
      set({ tasks: response.data });
      console.log("respose data", response.data);
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to fetch tasks");
    }
  },

  addTask: async (taskData) => {
    const user = useAuthStore.getState().user;
    console.log(user._id);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,{
          taskData, // Add taskData
          userId: user._id, // Include the user's ID (make sure user._id exists)
        }
      );
      console.log(response);
      set((state) => ({ tasks: [...state.tasks, response.data] }));
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to add task");
    }
  },

  updateTask: async (id, updates) => {
    console.log("Updates of the data", updates);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        updates
      );
      console.log(response);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...response.data } : task
        ),
      }));
      console.log("Task updated successfully");
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to update task");
    }
  },

  deleteTask: async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          params: { id },
        }
      );
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
      console.log(response);
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to update task");
    }
  },

  setPage: (page) => set({ currentPage: page }),

  getTotalPages: () => {
    const { tasks, itemsPerPage } = get();
    return Math.ceil(tasks.length / itemsPerPage);
  },

  getCurrentPageTasks: () => {
    const { tasks, currentPage, itemsPerPage } = get();
    const start = (currentPage - 1) * itemsPerPage;
    return tasks.slice(start, start + itemsPerPage);
  },

  getTasksByPriority: (priority) => {
    const { tasks } = get();
    return tasks.filter((task) => task.priority === priority);
  },
}));
