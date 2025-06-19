
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { PaymentHistory } from '@/components/PaymentHistory';
import { OrderHistory } from '@/components/OrderHistory';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client, Payment, Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockClients: Client[] = [
  { id: 'client1', name: 'สมชาย ใจดี', idNumber: '1234567890123', email: 'somchai@email.com', phone: '081-234-5678', createdAt: '2024-01-15' },
  { id: 'client2', name: 'John Smith', email: 'john@email.com', phone: '+66-87-654-3210', createdAt: '2024-02-20' },
  { id: 'client3', name: 'นิดา สวยงาม', idNumber: '9876543210987', phone: '089-876-5432', createdAt: '2024-03-10' }
];

const mockPayments: Payment[] = [
  { id: 'pay1', clientId: 'client1', amount: 2500, dueDate: '2024-12-15', status: 'overdue', description: 'Custom Rose & Sandalwood Perfume' },
  { id: 'pay2', clientId: 'client1', amount: 1800, dueDate: '2024-12-25', status: 'pending', description: 'Jasmine Night Fragrance' },
  { id: 'pay3', clientId: 'client1', amount: 3200, dueDate: '2024-11-30', paidDate: '2024-11-28', status: 'paid', description: 'Citrus Fresh Collection' },
  { id: 'pay4', clientId: 'client2', amount: 4500, dueDate: '2024-12-20', status: 'pending', description: 'Signature Woody Blend' },
  { id: 'pay5', clientId: 'client2', amount: 2800, dueDate: '2024-11-15', paidDate: '2024-11-14', status: 'paid', description: 'Tropical Paradise Set' }
];

const mockOrders: Order[] = [
  { id: 'ord1', clientId: 'client1', description: 'Custom Rose & Sandalwood Perfume - 50ml', amount: 2500, status: 'completed', createdAt: '2024-11-01', completedAt: '2024-11-15', notes: 'Extra rose essence, medium sandalwood base' },
  { id: 'ord2', clientId: 'client1', description: 'Jasmine Night Fragrance - 30ml', amount: 1800, status: 'in-progress', createdAt: '2024-12-01', notes: 'Evening wear, subtle jasmine' },
  { id: 'ord3', clientId: 'client2', description: 'Signature Woody Blend - 100ml', amount: 4500, status: 'pending', createdAt: '2024-12-10', notes: 'Corporate signature scent' },
  { id: 'ord4', clientId: 'client2', description: 'Tropical Paradise Set - 3x30ml', amount: 2800, status: 'completed', createdAt: '2024-10-15', completedAt: '2024-11-01', notes: 'Mango, coconut, frangipani blend' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  if (!user) return null;

  const handlePaymentUpdate = (paymentId: string) => {
    toast({
      title: t.success,
      description: "Payment status updated successfully",
    });
  };

  const handleReorder = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    toast({
      title: t.success,
      description: `Reordering: ${order?.description}`,
    });
  };

  if (user.role === 'admin') {
    return (
      <Layout>
        <AdminDashboard 
          clients={mockClients}
          payments={mockPayments}
          orders={mockOrders}
        />
      </Layout>
    );
  }

  // Client view
  const clientPayments = mockPayments.filter(p => p.clientId === user.clientId);
  const clientOrders = mockOrders.filter(o => o.clientId === user.clientId);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {t.dashboard}
          </h2>
          <p className="text-gray-600">Manage your custom perfume orders and payments</p>
        </div>

        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments">{t.payments}</TabsTrigger>
            <TabsTrigger value="orders">{t.orders}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments">
            <PaymentHistory 
              payments={clientPayments}
              onPaymentUpdate={handlePaymentUpdate}
            />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderHistory 
              orders={clientOrders}
              onReorder={handleReorder}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
