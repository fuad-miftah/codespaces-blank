// pages/book-review/[isbn].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useServiceContext } from "../../contexts/ServiceContextProvider";
import Navbar from "../../components/NavBar";

type BookReview = {
  book: {
    isbn: string;
    title: string;
    author: string;
  };
  reviewer_name: string;
};

const BookReviewPage = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const serviceContext = useServiceContext();

  useEffect(() => {
    if (serviceContext && isbn) {
      const fetchReviews = async () => {
        const reviewList = await serviceContext.client.query<BookReview[]>(
          "get_all_reviews_for_book",
          { isbn }
        );
        setReviews(reviewList);
      };

      fetchReviews().catch(console.error);
    }
  }, [serviceContext, isbn]);

  return (
    <div>
      <Navbar />
      <h1>Book Reviews for ISBN: {isbn}</h1>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            {review.reviewer_name} reviewed {review.book.title} by {review.book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookReviewPage;
