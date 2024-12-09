export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}