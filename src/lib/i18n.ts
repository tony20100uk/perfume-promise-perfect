
export type Language = 'th' | 'en';

export interface Translations {
  // Navigation
  dashboard: string;
  payments: string;
  orders: string;
  admin: string;
  profile: string;
  logout: string;
  
  // Auth
  login: string;
  password: string;
  idNumber: string;
  email: string;
  phone: string;
  
  // Dashboard
  welcome: string;
  paymentHistory: string;
  overdue: string;
  paid: string;
  pending: string;
  amount: string;
  date: string;
  status: string;
  dueAmount: string;
  payWithPromptpay: string;
  
  // Orders
  reorderIdentical: string;
  orderHistory: string;
  customPerfume: string;
  
  // Admin
  clientManagement: string;
  addClient: string;
  orderManagement: string;
  paymentTracking: string;
  reports: string;
  
  // Common
  save: string;
  cancel: string;
  loading: string;
  error: string;
  success: string;
}

export const translations: Record<Language, Translations> = {
  th: {
    // Navigation
    dashboard: 'แดชบอร์ด',
    payments: 'การชำระเงิน',
    orders: 'คำสั่งซื้อ',
    admin: 'ผู้ดูแลระบบ',
    profile: 'โปรไฟล์',
    logout: 'ออกจากระบบ',
    
    // Auth
    login: 'เข้าสู่ระบบ',
    password: 'รหัสผ่าน',
    idNumber: 'เลขบัตรประชาชน',
    email: 'อีเมล',
    phone: 'โทรศัพท์',
    
    // Dashboard
    welcome: 'ยินดีต้อนรับ',
    paymentHistory: 'ประวัติการชำระเงิน',
    overdue: 'เกินกำหนด',
    paid: 'ชำระแล้ว',
    pending: 'รอชำระ',
    amount: 'จำนวนเงิน',
    date: 'วันที่',
    status: 'สถานะ',
    dueAmount: 'ยอดค้างชำระ',
    payWithPromptpay: 'ชำระด้วย PromptPay',
    
    // Orders
    reorderIdentical: 'สั่งซื้อซ้ำ',
    orderHistory: 'ประวัติคำสั่งซื้อ',
    customPerfume: 'น้ำหอมสั่งทำพิเศษ',
    
    // Admin
    clientManagement: 'จัดการลูกค้า',
    addClient: 'เพิ่มลูกค้า',
    orderManagement: 'จัดการคำสั่งซื้อ',
    paymentTracking: 'ติดตามการชำระเงิน',
    reports: 'รายงาน',
    
    // Common
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    loading: 'กำลังโหลด...',
    error: 'เกิดข้อผิดพลาด',
    success: 'สำเร็จ'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    payments: 'Payments',
    orders: 'Orders',
    admin: 'Admin',
    profile: 'Profile',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    password: 'Password',
    idNumber: 'ID Number',
    email: 'Email',
    phone: 'Phone',
    
    // Dashboard
    welcome: 'Welcome',
    paymentHistory: 'Payment History',
    overdue: 'Overdue',
    paid: 'Paid',
    pending: 'Pending',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    dueAmount: 'Amount Due',
    payWithPromptpay: 'Pay with PromptPay',
    
    // Orders
    reorderIdentical: 'Reorder Identical',
    orderHistory: 'Order History',
    customPerfume: 'Custom Perfume',
    
    // Admin
    clientManagement: 'Client Management',
    addClient: 'Add Client',
    orderManagement: 'Order Management',
    paymentTracking: 'Payment Tracking',
    reports: 'Reports',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  }
};
