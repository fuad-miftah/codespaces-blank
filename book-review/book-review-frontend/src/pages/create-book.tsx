// pages/create-book.tsx

import { useState } from "react";
import { useServiceContext } from "../contexts/ServiceContextProvider";
import Navbar from "../components/NavBar";

const CreateBook = () => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const serviceContext = useServiceContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceContext) {
      await serviceContext.client.signAndSendUniqueTransaction(
        { name: "create_book", args: [isbn, title, author] },
        serviceContext.bookKeeperSignatureProvider
      );
      alert("Book created successfully!");
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Create Book</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ISBN</label>
          <input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        </div>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  );
};

export default CreateBook;
