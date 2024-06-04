import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getReviewsForBook } from '../../services/chromiaService';

const BookDetailPage = () => {
    const router = useRouter();
    const { isbn } = router.query;
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchReviews() {
            if (isbn) {
                const reviews = await getReviewsForBook(isbn as string);
                setReviews(reviews);
            }
        }
        fetchReviews();
    }, [isbn]);

    return (
        <div>
            <h1>Reviews for Book: {isbn}</h1>
            <ul>
                {reviews.map((review, index) => (
                    <li key={index}>
                        {review.reviewer_name}: {review.review}
                    </li>
                ))}
            </ul>
            <a href={`/books/${isbn}/add-review`}>Add Review</a>
        </div>
    );
};

export default BookDetailPage;
