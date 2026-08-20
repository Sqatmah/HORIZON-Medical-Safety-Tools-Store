export default function StarRating({ rating, size = 'text-base' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= fullStars || (i === fullStars + 1 && hasHalf) ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
}