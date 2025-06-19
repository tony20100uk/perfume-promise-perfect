import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Client, Payment, Order } from '@/types';
interface AdminDashboardProps {
  clients: Client[];
  payments: Payment[];
  orders: Order[];
}
export function AdminDashboard({
  clients,
  payments,
  orders
}: AdminDashboardProps) {
  const {
    t
  } = useLanguage();
  const formatAmount = (amount: number) => {
    return `฿${amount.toLocaleString('th-TH')}`;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  // Statistics
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'in-progress').length;
  return <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatAmount(totalRevenue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatAmount(overdueAmount)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">{t.clientManagement}</TabsTrigger>
          <TabsTrigger value="payments">{t.paymentTracking}</TabsTrigger>
          <TabsTrigger value="orders">{t.orderManagement}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t.clientManagement}</CardTitle>
                <Button>{t.addClient}</Button>
              </div>
              <CardDescription>Manage your perfume clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clients.map(client => <div key={client.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-sm text-gray-600">
                        {client.idNumber && `ID: ${client.idNumber}`}
                        {client.email && ` • ${client.email}`}
                        {client.phone && ` • ${client.phone}`}
                      </p>
                      <p className="text-xs text-gray-500">Joined: {formatDate(client.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Orders</Button>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.paymentTracking}</CardTitle>
              <CardDescription>Monitor all payment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.map(payment => {
                const client = clients.find(c => c.id === payment.clientId);
                return <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={payment.status === 'paid' ? 'bg-green-500' : payment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}>
                            {payment.status}
                          </Badge>
                          <span className="font-medium">{formatAmount(payment.amount)}</span>
                        </div>
                        <p className="text-sm text-gray-800">{client?.name}</p>
                        <p className="text-sm text-gray-600">{payment.description}</p>
                        <p className="text-xs text-gray-500">Due: {formatDate(payment.dueDate)}</p>
                      </div>
                      <div className="flex gap-2">
                        {payment.status !== 'paid' && <Button size="sm" variant="outline" className="bg-green-400 hover:bg-green-300">Mark Paid</Button>}
                        <Button size="sm" variant="outline" className="bg-orange-400 hover:bg-orange-300">Remind</Button>
                      </div>
                    </div>;
              })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.orderManagement}</CardTitle>
              <CardDescription>Track custom perfume orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.map(order => {
                const client = clients.find(c => c.id === order.clientId);
                return <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={order.status === 'completed' ? 'bg-green-500' : order.status === 'in-progress' ? 'bg-blue-500' : order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}>
                            {order.status}
                          </Badge>
                          <span className="font-medium">{formatAmount(order.amount)}</span>
                        </div>
                        <p className="text-sm text-gray-800">{client?.name}</p>
                        <p className="text-sm text-gray-600">{order.description}</p>
                        <p className="text-xs text-gray-500">Ordered: {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Update</Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>;
              })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}