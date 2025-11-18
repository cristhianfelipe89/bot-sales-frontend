import React from 'react';
import formatCurrency from '../utils/formatCurrency';

export default function ProductCard({ product }) {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-subtitle small text-muted">{product.category}</p>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><strong>{formatCurrency(product.price)}</strong></p>
                <p className="small">Stock: {product.stock}</p>
            </div>
        </div>
    );
}
