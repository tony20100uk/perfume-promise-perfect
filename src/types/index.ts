
export interface Client {
  id: string;
  name: string;
  idNumber?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

export interface Order {
  id: string;
  clientId: string;
  description: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'client' | 'admin';
  clientId?: string;
}
