import { Address } from '../../core/models/address.model';

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine1: '12 Lake Road, Lalpur',
    addressLine2: 'Near Peace Tower',
    city: 'Ranchi',
    state: 'Jharkhand',
    postalCode: '834001',
    country: 'India',
    isDefault: true,
    type: 'SHIPPING',
  },
  {
    id: 'addr-2',
    fullName: 'Rahul Sharma (Office)',
    phone: '+91 98123 45678',
    addressLine1: '45 Park Street, Connaught Place',
    addressLine2: '4th Floor, Tech Hub',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    isDefault: false,
    type: 'WORK',
  },
];

