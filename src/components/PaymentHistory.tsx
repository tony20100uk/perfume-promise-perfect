
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Payment } from '@/types';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentHistoryProps {
  payments: Payment[];
  onPaymentUpdate?: (paymentId: string) => void;
}

// Mock PromptPay QR generation (in real app, use PromptParse library)
const generatePromptPayQR = (amount: number, ref: string) => {
  return `00020101021129370016A000000677010111011300668765432105204000053037645802TH630${amount.toFixed(2)}6304${ref}`;
};

export function PaymentHistory({ payments, onPaymentUpdate }: PaymentHistoryProps) {
  const { t } = useLanguage();
  
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'paid': return t.paid;
      case 'pending': return t.pending;
      case 'overdue': return t.overdue;
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const formatAmount = (amount: number) => {
    return `฿${amount.toLocaleString('th-TH')}`;
  };

  const overduePayments = payments.filter(p => p.status === 'overdue');
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overdue Alert */}
      {totalOverdue > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              ⚠️ {t.overdue}
            </CardTitle>
            <CardDescription className="text-red-600">
              {t.dueAmount}: {formatAmount(totalOverdue)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG 
                  value={generatePromptPayQR(totalOverdue, `OVERDUE${Date.now()}`)}
                  size={120}
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-medium text-red-700 mb-2">{t.payWithPromptpay}</p>
                <p className="text-sm text-red-600">
                  Scan QR code with your banking app
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>{t.paymentHistory}</CardTitle>
          <CardDescription>
            Complete history of your payments and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusText(payment.status)}
                    </Badge>
                    <span className="font-medium">{formatAmount(payment.amount)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{payment.description}</p>
                  <p className="text-xs text-gray-500">
                    Due: {formatDate(payment.dueDate)}
                    {payment.paidDate && ` • Paid: ${formatDate(payment.paidDate)}`}
                  </p>
                </div>
                
                {payment.status === 'pending' && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white p-2 rounded border">
                      <QRCodeSVG 
                        value={generatePromptPayQR(payment.amount, `PAY${payment.id}`)}
                        size={60}
                      />
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      {t.payWithPromptpay}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
