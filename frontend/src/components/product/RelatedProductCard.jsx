import React from 'react';
import { Link } from 'react-router-dom';

const RelatedProductCard = ({ product }) => {
  return (
    <div className="relative group">
      <div className="relative w-full h-72 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 flex items-center justify-center p-4">
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center group-hover:scale-105 transition-transform duration-300"
          alt={product.name}
          style={{ backgroundImage: `url("${product.image}")` }}
        ></div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-zinc-700 dark:text-zinc-200">
            <Link className="font-bold" to={`/product/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0"></span>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default RelatedProductCard;