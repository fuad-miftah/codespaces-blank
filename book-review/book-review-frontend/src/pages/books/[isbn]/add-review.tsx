import { useRouter } from 'next/router';
import { useState } from 'react';
import { createBookReview } from '../../../services/chromiaService';

const AddReviewPage = () => {
    const router = useRouter();
    const { isbn } = router.query;
    const [reviewerName, setReviewerName] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createBookReview(isbn as string, reviewerName, review, rating);
        alert('Review added successfully');
        router.push(`/books/${isbn}`);
    };

    return (
        <div>
            <h1>Add Review for Book: {isbn}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Reviewer Name</label>
                    <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} />
                </div>
                <div>
                    <label>Review</label>
                    <input type="text" value={review} onChange={(e) => setReview(e.target.value)} />
                </div>
                <div>
                    <label>Rating</label>
                    <input type="number" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} />
                </div>
                <button type="submit">Add Review</button>
            </form>
        </div>
    );
};

export default AddReviewPage;
