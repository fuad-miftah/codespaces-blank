// import Link from "next/link";

// export default function NavBar() {
//   return (
//     <nav className="py-2 px-6">
//       <ul className="flex justify-between">
//         <li>
//           <Link href="/" className="text-xl font-extrabold">
//             Book review dapp
//           </Link>
//         </li>
//         <div className="flex gap-4 font-semibold">
//           <li>
//             <Link href="/new-book" className="hover:text-gray-600">
//               New Book
//             </Link>
//           </li>
//           <li>
//             <Link href="/book-review" className="hover:text-gray-600">
//               Book Review
//             </Link>
//           </li>
//           <li>
//             <Link href="/" className="hover:text-gray-600">
//               Books
//             </Link>
//           </li>
//         </div>
//       </ul>
//     </nav>
//   );
// }
// components/Navbar.tsx

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/create-book">Create Book</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
