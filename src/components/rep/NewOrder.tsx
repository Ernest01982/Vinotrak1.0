import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart, Package, DollarSign, AlertCircle } from 'lucide-react';
import { supabase, Product, Client } from '../../lib/supabase';

interface NewOrderProps {
  client: Client;
  onBack: () => void;
  onOrderSubmitted: () => void;
}

const NewOrder: React.FC<NewOrderProps> = ({ client, onBack, onOrderSubmitted }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [productId]: newQuantity };
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price_per_case * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const handleSubmitOrder = async () => {
    if (getCartItemCount() === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Start a transaction by creating the order first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          rep_id: user.id,
          client_id: client.id,
          subtotal: 0, // Will be updated by trigger
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId)!;
        return {
          order_id: orderData.id,
          product_id: productId,
          quantity,
          price_per_case: product.price_per_case
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Show success message
      const total = getCartTotal();
      alert(`Order submitted successfully for ${client.name}!\nTotal: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

      // Navigate back and trigger callback
      onOrderSubmitted();
      onBack();
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">New Order</h1>
              <p className="text-gray-600">{client.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Cart Summary */}
        {getCartItemCount() > 0 && (
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
          const categoryProducts = products.filter(p => p.category === category);
          
          return (
            <div key={category} className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-sky-500" />
                  <span>{category}</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryProducts.map(product => {
                    const quantity = cart[product.id] || 0;
                    
                    return (
                      <div
                        key={product.id}
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          !product.in_stock 
                            ? 'border-gray-200 bg-gray-50 opacity-60' 
                            : quantity > 0
                            ? 'border-sky-300 bg-sky-50'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex space-x-4">
                          <img
                            src={product.image_url || 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=300'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600">{product.vintage}</p>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="w-4 h-4 text-gray-500" />
                                  <span className="font-bold text-gray-900">
                                    {product.price_per_case.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">per case</p>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            
                            {!product.in_stock ? (
                              <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium inline-block">
                                Out of Stock
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => updateQuantity(product.id, -1)}
                                    disabled={quantity === 0}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center transition-colors duration-200"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  
                                  <span className="w-8 text-center font-medium text-gray-900">
                                    {quantity}
                                  </span>
                                  
                                  <button
                                    onClick={() => updateQuantity(product.id, 1)}
                                    className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors duration-200"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                                
                                {quantity > 0 && (
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                      ${(product.price_per_case * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {quantity} case{quantity !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${getCartTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <button
              onClick={handleSubmitOrder}
              disabled={getCartItemCount() === 0 || isSubmitting}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span>Submit Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;