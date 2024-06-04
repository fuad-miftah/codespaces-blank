export default function BookReview() {
    return (
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Book name</h1>
  
          <div className="flex text-center">
            {/* Followers Box */}
            <div className="bg-white m-1 p-2 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Reviewe Name</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
  
            {/* Following Box */}
            <div className="bg-white m-1 p-2 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Review</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
        </div>
  
        {/* News Feed */}
        <div className="bg-white p-4 rounded-lg shadow">
          <ul>
            <li key={0} className="mb-4">
              <div className="flex">
                <div className="font-semibold">Book1</div>
                <div className="text-gray-500 text-sm ml-2">
                  {new Date().toLocaleString()}
                </div>
              </div>
              <div className="mt-2">Some content</div>
              {/* Add a horizontal line between posts */}
              {<hr className="my-4 border-t border-gray-300" />}
            </li>
          </ul>
        </div>
      </div>
    );
  }