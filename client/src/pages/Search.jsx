const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
        {/* left */}
        <div className="p-7 bg-blue-900 text-white md:min-h-screen">
            <form className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                    <label
                        className="whitespace-nowrap font-semibold"
                    >Search Term:</label>
                    <input
                        type="text"
                        name="searchTerm"
                        id=""
                        placeholder="Search"
                        className="border rounded-lg p-3 w-full"
                    />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="font-semibold">Type:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="all" className="w-5" />
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" className="w-5" />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className="w-5" />
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className="w-5" />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className="font-semibold">Ammenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className="w-5" />
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className="w-5" />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold">Sort:</label>
                    <select id="sort_order" className="border rounded-lg p-3 text-black">
                        <option>Price - Descending</option>
                        <option>Price - Ascending</option>
                        <option>Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>
                <button className="bg-blue-400 text-blue-900 rounded-lg p-3 uppercase">Search</button>
            </form>
        </div>
        {/* right */}
        <div className="">
            <h1 className="text-3xl font-semibold  p-3 mt-5">Listing Results:</h1>
        </div>
    </div>
  )
}
export default Search