import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, text = '', color = '#f59e0b' }) => {
  const ratingValue = Number(value) || 0;

  return (
    <div className="product-rating">
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFull = ratingValue >= index;
          const isHalf = ratingValue >= index - 0.5 && ratingValue < index;

          return (
            <span key={index} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Star
                size={16}
                fill={isFull ? color : isHalf ? 'url(#half-star)' : 'none'}
                color={isFull || isHalf ? color : '#cbd5e1'}
                strokeWidth={2}
              />
            </span>
          );
        })}
      </div>
      {text && <span className="rating-text">{text}</span>}
    </div>
  );
};

export default Rating;
