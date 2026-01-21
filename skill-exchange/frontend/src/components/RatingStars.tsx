import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number;
    totalRatings?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
    size?: number;
}

export default function RatingStars({
    rating,
    totalRatings,
    interactive = false,
    onRate,
    size = 16
}: RatingStarsProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (e: React.MouseEvent, value: number) => {
        e.stopPropagation();
        e.preventDefault();
        if (interactive && onRate) {
            onRate(value);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className="rating" onClick={(e) => e.stopPropagation()}>
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    size={size}
                    className={`rating-star ${value <= displayRating ? 'filled' : ''}`}
                    style={{
                        cursor: interactive ? 'pointer' : 'default',
                        fill: value <= displayRating ? 'var(--color-warning)' : 'none',
                        color: value <= displayRating ? 'var(--color-warning)' : 'var(--color-text-muted)'
                    }}
                    onClick={(e) => handleClick(e, value)}
                    onMouseEnter={() => interactive && setHoverRating(value)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                />
            ))}
            {totalRatings !== undefined && (
                <span className="rating-value">
                    {rating.toFixed(1)} ({totalRatings})
                </span>
            )}
        </div>
    );
}
