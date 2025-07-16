import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import ProductCard from './ProductCard';

// Mock product data
const mockProducts = [
  {
    id: 'product-1',
    name: 'Château Margaux',
    vintage: '2018',
    price: 2400.00,
    description: 'Premier Grand Cru Classé from Bordeaux. Elegant and complex with notes of blackcurrant and cedar.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-2',
    name: 'Dom Pérignon',
    vintage: '2012',
    price: 1800.00,
    description: 'Prestigious Champagne with fine bubbles and notes of white flowers and citrus.',
    category: 'Champagne',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-3',
    name: 'Opus One',
    vintage: '2019',
    price: 3600.00,
    description: 'Napa Valley Bordeaux-style blend. Rich and powerful with layers of dark fruit and spice.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-4',
    name: 'Chablis Premier Cru',
    vintage: '2020',
    price: 480.00,
    description: 'Crisp and mineral-driven Chardonnay from Burgundy with notes of green apple and oyster shell.',
    category: 'White Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-5',
    name: 'Barolo Brunate',
    vintage: '2017',
    price: 720.00,
    description: 'Traditional Nebbiolo from Piedmont. Full-bodied with tannins and notes of cherry and leather.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-6',
    name: 'Sancerre',
    vintage: '2021',
    price: 360.00,
    description: 'Loire Valley Sauvignon Blanc with bright acidity and notes of gooseberry and herbs.',
    category: 'White Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-7',
    name: 'Caymus Cabernet',
    vintage: '2020',
    price: 600.00,
    description: 'Napa Valley Cabernet Sauvignon with rich dark fruit flavors and smooth tannins.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-8',
    name: 'Veuve Clicquot',
    vintage: 'NV',
    price: 540.00,
    description: 'Classic Champagne with a perfect balance of strength and silkiness.',
    category: 'Champagne',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-9',
    name: 'Riesling Kabinett',
    vintage: '2021',
    price: 240.00,
    description: 'German Riesling with delicate sweetness balanced by crisp acidity and mineral notes.',
    category: 'White Wine',
    inStock: false,
    imageUrl: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'product-10',
    name: 'Pinot Noir Reserve',
    vintage: '2019',
    price: 420.00,
    description: 'Oregon Pinot Noir with bright cherry flavors and earthy undertones.',
    category: 'Red Wine',
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const NewOrderPage: React.FC = () => {
  const clientName = "ABC Wine & Spirits"; // Placeholder client name
  const categories = [...new Set(mockProducts.map(p => p.category))];
  
  // Cart state - object where keys are product IDs and values are quantities
  const [cart, setCart] = useState<{ [productId: string]: number }>({});

  // Function to update quantity in cart
  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      if (newQuantity === 0) {
        // Remove product from cart if quantity reaches 0
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [productId]: newQuantity };
    });
  };

  // Calculate total price from cart
  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = mockProducts.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    return Object.keys(cart).length === 0 || Object.values(cart).every(qty => qty === 0);
  };

  // Get total item count in cart
  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">New Order for:</h2>
              <p className="text-gray-600">{clientName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Cart Summary - Only show when cart has items */}
        {!isCartEmpty() && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5 text-sky-500" />
                <span className="font-medium text-gray-900">
                  {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} in cart
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ${getCartTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">Subtotal</p>
              </div>
            </div>
          </div>
        )}

        {/* Products by Category */}
        {categories.map(category => {
          const categoryProducts = mockProducts.filter(p => p.category === category);
          
          return (
            <div key={category} className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-sky-500" />
                  <span>{category}</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      quantity={cart[product.id] || 0}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-2xl font-bold text-gray-900">
                ${getCartTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <button
              disabled={isCartEmpty()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 min-w-[140px] justify-center"
            >
              <ShoppingCart size={20} />
              <span>Submit Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderPage;