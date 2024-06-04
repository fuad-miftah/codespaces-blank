import { useState } from 'react';
import { createBook } from '../../services/chromiaService';

const AddBookPage = () => {
    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createBook(isbn, title, author);
        alert('Book created successfully');
    };

    return (
        <div>
            <h1>Add Book</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ISBN</label>
                    <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                </div>
                <div>
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <button type="submit">Create Book</button>
            </form>
        </div>
    );
};

export default AddBookPage;
