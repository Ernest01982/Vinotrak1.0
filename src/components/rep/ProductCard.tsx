import React from 'react';
import { Plus, Minus, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  vintage: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: string, change: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onUpdateQuantity }) => {
  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 ${
      !product.inStock 
        ? 'border-gray-200 bg-gray-50 opacity-60' 
        : quantity > 0
        ? 'border-sky-300 bg-sky-50'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      <div className="flex space-x-4">
        <img
          src={product.imageUrl}
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
                  {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-gray-500">per case</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {!product.inStock ? (
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium inline-block">
              Out of Stock
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onUpdateQuantity(product.id, -1)}
                  disabled={quantity === 0}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center transition-colors duration-200"
                >
                  <Minus size={16} />
                </button>
                
                <span className="w-8 text-center font-medium text-gray-900">
                  {quantity}
                </span>
                
                <button
                  onClick={() => onUpdateQuantity(product.id, 1)}
                  className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              {quantity > 0 && (
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(product.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
};

export default ProductCard;