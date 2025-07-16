// Mock data for the application
export interface Rep {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'rep';
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  storeType: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  repId: string;
  createdAt: string;
}

export interface Call {
  id: string;
  repId: string;
  clientId: string;
  scheduledDate: string;
  duration?: number; // in minutes
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  outcomes?: string[]; // Array of outcomes like "Order Placed", "Sample Left", etc.
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  vintage: string;
  pricePerCase: number;
  description: string;
  category: string;
  inStock: boolean;
  imageUrl: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  pricePerCase: number;
}

export interface Order {
  id: string;
  repId: string;
  clientId: string;
  items: OrderItem[];
  subtotal: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

// Mock Reps Data
export const mockReps: Rep[] = [
  {
    id: 'rep-1',
    displayName: 'Sarah Johnson',
    email: 'sarah.johnson@vinotrack.com',
    photoURL: 'https://placehold.co/150x150/4F46E5/FFFFFF?text=SJ',
    role: 'rep',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'rep-2',
    displayName: 'Mike Davis',
    email: 'mike.davis@vinotrack.com',
    photoURL: 'https://placehold.co/150x150/059669/FFFFFF?text=MD',
    role: 'rep',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 'rep-3',
    displayName: 'John Smith',
    email: 'john.smith@vinotrack.com',
    photoURL: 'https://placehold.co/150x150/DC2626/FFFFFF?text=JS',
    role: 'rep',
    createdAt: '2024-02-01T09:45:00Z'
  },
  {
    id: 'rep-4',
    displayName: 'Lisa Chen',
    email: 'lisa.chen@vinotrack.com',
    photoURL: 'https://placehold.co/150x150/7C3AED/FFFFFF?text=LC',
    role: 'rep',
    createdAt: '2024-02-10T16:20:00Z'
  },
  {
    id: 'rep-5',
    displayName: 'David Wilson',
    email: 'david.wilson@vinotrack.com',
    photoURL: 'https://placehold.co/150x150/EA580C/FFFFFF?text=DW',
    role: 'rep',
    createdAt: '2024-02-15T11:30:00Z'
  },
  {
    id: 'rep-6',
    displayName: 'Emma Rodriguez',
    email: 'emma.rodriguez@vinotrack.com',
    photoURL: 'https://placehold.co/150x150/0891B2/FFFFFF?text=ER',
    role: 'rep',
    createdAt: '2024-02-20T13:45:00Z'
  }
];

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Château Margaux',
    vintage: '2018',
    pricePerCase: 2400.00,
    description: 'Premier Grand Cru Classé from Bordeaux. Elegant and complex with notes of blackcurrant and cedar.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-2',
    name: 'Dom Pérignon',
    vintage: '2012',
    pricePerCase: 1800.00,
    description: 'Prestigious Champagne with fine bubbles and notes of white flowers and citrus.',
    category: 'Champagne',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-3',
    name: 'Opus One',
    vintage: '2019',
    pricePerCase: 3600.00,
    description: 'Napa Valley Bordeaux-style blend. Rich and powerful with layers of dark fruit and spice.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-4',
    name: 'Chablis Premier Cru',
    vintage: '2020',
    pricePerCase: 480.00,
    description: 'Crisp and mineral-driven Chardonnay from Burgundy with notes of green apple and oyster shell.',
    category: 'White Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-5',
    name: 'Barolo Brunate',
    vintage: '2017',
    pricePerCase: 720.00,
    description: 'Traditional Nebbiolo from Piedmont. Full-bodied with tannins and notes of cherry and leather.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-6',
    name: 'Sancerre',
    vintage: '2021',
    pricePerCase: 360.00,
    description: 'Loire Valley Sauvignon Blanc with bright acidity and notes of gooseberry and herbs.',
    category: 'White Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-7',
    name: 'Caymus Cabernet',
    vintage: '2020',
    pricePerCase: 600.00,
    description: 'Napa Valley Cabernet Sauvignon with rich dark fruit flavors and smooth tannins.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-8',
    name: 'Veuve Clicquot',
    vintage: 'NV',
    pricePerCase: 540.00,
    description: 'Classic Champagne with a perfect balance of strength and silkiness.',
    category: 'Champagne',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-9',
    name: 'Riesling Kabinett',
    vintage: '2021',
    pricePerCase: 240.00,
    description: 'German Riesling with delicate sweetness balanced by crisp acidity and mineral notes.',
    category: 'White Wine',
    inStock: false,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-10',
    name: 'Pinot Noir Reserve',
    vintage: '2019',
    pricePerCase: 420.00,
    description: 'Oregon Pinot Noir with bright cherry flavors and earthy undertones.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Clients Data
export const mockClients: Client[] = [
  { 
    id: 'client-1', 
    name: 'ABC Wine & Spirits', 
    storeType: 'Liquor Store',
    location: 'New York, NY',
    contactPerson: 'John Martinez',
    phone: '(555) 123-4567',
    email: 'john@abcwine.com', 
    repId: 'rep-1', 
    createdAt: '2024-01-16T10:00:00Z' 
  },
  { 
    id: 'client-2', 
    name: 'TechStart Restaurant', 
    storeType: 'Restaurant',
    location: 'San Francisco, CA',
    contactPerson: 'Sarah Kim',
    phone: '(555) 234-5678',
    email: 'sarah@techstart.com', 
    repId: 'rep-1', 
    createdAt: '2024-01-18T14:30:00Z' 
  },
  { 
    id: 'client-3', 
    name: 'GreenTech Bar & Grill', 
    storeType: 'Bar',
    location: 'Austin, TX',
    contactPerson: 'Mike Thompson',
    phone: '(555) 345-6789',
    email: 'mike@greentech.com', 
    repId: 'rep-1', 
    createdAt: '2024-01-22T09:15:00Z' 
  },
  { 
    id: 'client-4', 
    name: 'Blue Ocean Hotel', 
    storeType: 'Hotel',
    location: 'Miami, FL',
    contactPerson: 'Lisa Rodriguez',
    phone: '(555) 456-7890',
    email: 'lisa@blueocean.com', 
    repId: 'rep-2', 
    createdAt: '2024-01-21T11:45:00Z' 
  },
  { 
    id: 'client-5', 
    name: 'Sunrise Grocery', 
    storeType: 'Grocery Store',
    location: 'Phoenix, AZ',
    contactPerson: 'David Chen',
    phone: '(555) 567-8901',
    email: 'david@sunrise.com', 
    repId: 'rep-2', 
    createdAt: '2024-01-25T16:20:00Z' 
  },
  { 
    id: 'client-6', 
    name: 'Metro Wine Shop', 
    storeType: 'Wine Shop',
    location: 'Chicago, IL',
    contactPerson: 'Emma Wilson',
    phone: '(555) 678-9012',
    email: 'emma@metro.com', 
    repId: 'rep-3', 
    createdAt: '2024-02-02T10:30:00Z' 
  },
  { 
    id: 'client-7', 
    name: 'Peak Performance Club', 
    storeType: 'Country Club',
    location: 'Denver, CO',
    contactPerson: 'Alex Johnson',
    phone: '(555) 789-0123',
    email: 'alex@peak.com', 
    repId: 'rep-3', 
    createdAt: '2024-02-05T13:15:00Z' 
  },
  { 
    id: 'client-8', 
    name: 'Quantum Bistro', 
    storeType: 'Bistro',
    location: 'Seattle, WA',
    contactPerson: 'Rachel Green',
    phone: '(555) 890-1234',
    email: 'rachel@quantum.com', 
    repId: 'rep-4', 
    createdAt: '2024-02-11T15:45:00Z' 
  },
  { 
    id: 'client-9', 
    name: 'Stellar Wine Bar', 
    storeType: 'Wine Bar',
    location: 'Portland, OR',
    contactPerson: 'Tom Anderson',
    phone: '(555) 901-2345',
    email: 'tom@stellar.com', 
    repId: 'rep-4', 
    createdAt: '2024-02-14T12:30:00Z' 
  },
  { 
    id: 'client-10', 
    name: 'Nexus Catering', 
    storeType: 'Catering',
    location: 'Las Vegas, NV',
    contactPerson: 'Jennifer Lee',
    phone: '(555) 012-3456',
    email: 'jennifer@nexus.com', 
    repId: 'rep-5', 
    createdAt: '2024-02-16T14:20:00Z' 
  }
];

// Mock Calls Data - Updated with scheduled dates, status, and outcomes
export const mockCalls: Call[] = [
  { 
    id: 'call-1', 
    repId: 'rep-1', 
    clientId: 'client-1', 
    scheduledDate: '2025-06-15T10:00:00Z',
    duration: 45, 
    notes: 'Discussed Q1 requirements and new product line. Client showed strong interest in premium wines.', 
    status: 'completed',
    outcomes: ['Order Placed', 'Sample Left'],
    createdAt: '2024-02-01T10:00:00Z' 
  },
  { 
    id: 'call-2', 
    repId: 'rep-1', 
    clientId: 'client-2', 
    scheduledDate: '2025-06-20T14:30:00Z',
    notes: 'Follow-up on proposal', 
    status: 'pending',
    createdAt: '2024-02-02T14:30:00Z' 
  },
  { 
    id: 'call-3', 
    repId: 'rep-1', 
    clientId: 'client-3', 
    scheduledDate: '2025-06-20T16:15:00Z',
    notes: 'Product demo session', 
    status: 'pending',
    createdAt: '2024-02-03T09:15:00Z' 
  },
  { 
    id: 'call-4', 
    repId: 'rep-1', 
    clientId: 'client-1', 
    scheduledDate: '2025-06-21T11:45:00Z',
    notes: 'Contract negotiation', 
    status: 'pending',
    createdAt: '2024-02-05T11:45:00Z' 
  },
  { 
    id: 'call-5', 
    repId: 'rep-2', 
    clientId: 'client-4', 
    scheduledDate: '2025-06-20T09:00:00Z',
    duration: 40, 
    notes: 'Initial consultation', 
    status: 'completed',
    outcomes: ['Brochure Left', 'Follow-up Scheduled'],
    createdAt: '2024-02-01T16:20:00Z' 
  },
  { 
    id: 'call-6', 
    repId: 'rep-2', 
    clientId: 'client-5', 
    scheduledDate: '2025-06-20T13:30:00Z',
    notes: 'Pricing discussion', 
    status: 'pending',
    createdAt: '2024-02-04T10:30:00Z' 
  },
  { 
    id: 'call-7', 
    repId: 'rep-2', 
    clientId: 'client-4', 
    scheduledDate: '2025-06-20T15:15:00Z',
    duration: 50, 
    notes: 'Technical requirements', 
    status: 'pending',
    createdAt: '2024-02-06T13:15:00Z' 
  },
  { 
    id: 'call-8', 
    repId: 'rep-3', 
    clientId: 'client-6', 
    scheduledDate: '2025-06-20T11:00:00Z',
    duration: 30, 
    notes: 'Quarterly review', 
    status: 'completed',
    outcomes: ['Order Placed'],
    createdAt: '2024-02-03T15:45:00Z' 
  },
  { 
    id: 'call-9', 
    repId: 'rep-3', 
    clientId: 'client-7', 
    scheduledDate: '2025-06-20T14:00:00Z',
    notes: 'New product introduction', 
    status: 'pending',
    createdAt: '2024-02-07T12:30:00Z' 
  },
  { 
    id: 'call-10', 
    repId: 'rep-4', 
    clientId: 'client-8', 
    scheduledDate: '2025-06-20T10:30:00Z',
    duration: 55, 
    notes: 'Implementation planning', 
    status: 'pending',
    createdAt: '2024-02-12T14:20:00Z' 
  },
  { 
    id: 'call-11', 
    repId: 'rep-4', 
    clientId: 'client-9', 
    scheduledDate: '2025-06-20T16:00:00Z',
    notes: 'Support requirements', 
    status: 'pending',
    createdAt: '2024-02-15T16:10:00Z' 
  },
  { 
    id: 'call-12', 
    repId: 'rep-5', 
    clientId: 'client-10', 
    scheduledDate: '2025-06-20T12:00:00Z',
    notes: 'Partnership discussion', 
    status: 'pending',
    createdAt: '2024-02-17T11:00:00Z' 
  },
  // Additional historical calls for visit history
  { 
    id: 'call-13', 
    repId: 'rep-1', 
    clientId: 'client-2', 
    scheduledDate: '2025-06-10T15:00:00Z',
    duration: 35, 
    notes: 'Initial meeting to discuss wine selection for restaurant. Reviewed current menu and wine pairing options.', 
    status: 'completed',
    outcomes: ['Menu Reviewed', 'Sample Left', 'Follow-up Scheduled'],
    createdAt: '2024-02-10T15:00:00Z' 
  },
  { 
    id: 'call-14', 
    repId: 'rep-1', 
    clientId: 'client-3', 
    scheduledDate: '2025-06-05T11:30:00Z',
    duration: 50, 
    notes: 'Discussed seasonal wine offerings and promotional opportunities. Bar manager very interested in craft beer alternatives.', 
    status: 'completed',
    outcomes: ['Promotional Materials Left', 'Price List Updated'],
    createdAt: '2024-02-05T11:30:00Z' 
  }
];

// Mock Orders Data
export const mockOrders: Order[] = [
  { 
    id: 'order-1', 
    repId: 'rep-1', 
    clientId: 'client-1', 
    items: [
      { productId: 'product-1', quantity: 2, pricePerCase: 2400.00 },
      { productId: 'product-4', quantity: 3, pricePerCase: 480.00 }
    ],
    subtotal: 6240.00,
    status: 'completed', 
    createdAt: '2024-02-01T10:00:00Z' 
  },
  { 
    id: 'order-2', 
    repId: 'rep-1', 
    clientId: 'client-2', 
    items: [
      { productId: 'product-2', quantity: 1, pricePerCase: 1800.00 },
      { productId: 'product-6', quantity: 2, pricePerCase: 360.00 }
    ],
    subtotal: 2520.00,
    status: 'completed', 
    createdAt: '2024-02-03T14:30:00Z' 
  },
  { 
    id: 'order-3', 
    repId: 'rep-1', 
    clientId: 'client-3', 
    items: [
      { productId: 'product-7', quantity: 4, pricePerCase: 600.00 }
    ],
    subtotal: 2400.00,
    status: 'pending', 
    createdAt: '2024-02-05T09:15:00Z' 
  },
  { 
    id: 'order-4', 
    repId: 'rep-2', 
    clientId: 'client-4', 
    items: [
      { productId: 'product-3', quantity: 1, pricePerCase: 3600.00 },
      { productId: 'product-8', quantity: 2, pricePerCase: 540.00 }
    ],
    subtotal: 4680.00,
    status: 'completed', 
    createdAt: '2024-02-02T16:20:00Z' 
  }
];

// Current logged-in rep for demo purposes
export const currentRep = mockReps[0]; // Sarah Johnson

// Available outcomes for call logging
export const availableOutcomes = [
  'Order Placed',
  'Sample Left',
  'Brochure Left',
  'Price List Updated',
  'Menu Reviewed',
  'Follow-up Scheduled',
  'Promotional Materials Left',
  'No Interest',
  'Competitor Present',
  'Decision Pending'
];