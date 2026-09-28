import { Customer } from '../../core/models/user.model';

const NAMES = [
  'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Ananya Verma', 'Rohan Patel',
  'Sneha Reddy', 'Vikram Malhotra', 'Kavya Nair', 'Aditya Joshi', 'Meera Gupta',
  'Rajesh Iyer', 'Pooja Agarwal', 'Suresh Choudhary', 'Deepika Roy', 'Karthik Menon',
  'Sunita Deshmukh', 'Manish Saxena', 'Ritu Kapoor', 'Alok Pandey', 'Neha Tripathi'
];

export const MOCK_CUSTOMERS: Customer[] = NAMES.map((name, index) => {
  const firstName = name.split(' ')[0].toLowerCase();
  const lastName = name.split(' ')[1].toLowerCase();
  return {
    id: `cust-${index + 1}`,
    name: name,
    email: `${firstName}.${lastName}@example.in`,
    phone: `+91 98765 ${10000 + index}`,
    role: 'CUSTOMER',
    avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + index * 1000}?w=150&auto=format&fit=crop&q=80`,
    totalOrdersCount: Math.floor(Math.random() * 12 + 1),
    totalSpent: Math.floor(Math.random() * 45000 + 4500),
    loyaltyPoints: Math.floor(Math.random() * 450 + 20),
    status: index === 18 ? 'INACTIVE' : index === 19 ? 'SUSPENDED' : 'ACTIVE',
    createdAt: `2023-${(index % 12) + 1 < 10 ? '0' : ''}${(index % 12) + 1}-15`,
    updatedAt: '2024-03-01',
  };
});

