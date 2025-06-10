import { Trash2 } from 'lucide-react';
import './ReviewTable.css';

interface ReviewTableProps {
  reviews: { id: string; content: string; author: string; rating: number }[];
  onDelete: (id: string) => void;
}

export function ReviewTable({ reviews, onDelete }: ReviewTableProps) {
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8187/api/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      alert('Review deleted successfully');
      onDelete(id);
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('An error occurred while deleting the review. Please try again.');
    }
  };

  return (
    <div className="review-table-container">
      <table>
        <thead>
          <tr>
            <th>Content</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.content}</td>
              <td>{review.author}</td>
              <td>{review.rating}</td>
              <td className="actions">
                <button
                  onClick={() => handleDelete(review.id)}
                  className="delete"
                >
                  <Trash2 className="icon" size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}