// pages/index.tsx

import { useEffect, useState } from "react";
import { useServiceContext } from "../contexts/ServiceContextProvider";
import Navbar from "../components/NavBar";

type Book = {
  isbn: string;
  title: string;
  author: string;
};

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const serviceContext = useServiceContext();

  useEffect(() => {
    if (serviceContext) {
      const fetchBooks = async () => {
        const bookList = await serviceContext.client.query<Book[]>("get_all_books", {});
        setBooks(bookList);
      };

      fetchBooks().catch(console.error);
    }
  }, [serviceContext]);

  return (
    <div>
      <Navbar />
      <h1>Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.isbn}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
