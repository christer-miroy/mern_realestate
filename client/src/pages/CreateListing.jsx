const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Create Listing</h1>
        <form
            className="flex flex-col sm:flex-row gap-4"
        >
            {/* left column */}
            <div className="flex flex-col gap-4 flex-1">
                {/* text fields */}
                <input
                    type="text"
                    placeholder="Name"
                    className="border p-3 rounded-lg"
                    id="name"
                    maxLength='62'
                    minLength='10'
                    required
                />
                <textarea
                    type="text"
                    placeholder="Description"
                    className="border p-3 rounded-lg"
                    id="description"
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    className="border p-3 rounded-lg"
                    id="address"
                    required
                />
                {/* check boxes */}
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="sale"
                        />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="rent"
                        />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="parking"
                        />
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="furnished"
                        />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="offer"
                        />
                        <span>Offer</span>
                    </div>
                </div>
                {/* number fields */}
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            id="bedrooms"
                            min='1'
                            max="10"
                            className="p-3 border border-slate-300 rounded-lg"
                        />
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            id="baths"
                            min='1'
                            max="10"
                            className="p-3 border border-slate-300 rounded-lg"
                        />
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            id="regularPrice"
                            min='1'
                            max="10"
                            className="p-3 border border-slate-300 rounded-lg"
                        />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">(per month)</span>
                        </div>
                        
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            id="discountedPrice"
                            min='1'
                            max="10"
                            className="p-3 border border-slate-300 rounded-lg"
                        />
                        <div className="flex flex-col items-center">
                            <p>Discounted Price</p>
                            <span className="text-xs">(per month)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* right column */}
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">
                    Images:
                    <span className="font-normal ml-2">The first image will be cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input
                        type="file"
                        id="images"
                        className="p-3 border-blue-300 text-blue-300 rounded w-full"
                        accept="image/*"
                        multiple
                    />
                    <button className="p-3 border border-blue-300 rounded-lg uppercase hover:bg-blue-300 hover:text-blue-800 disabled:opacity-50">Upload</button>
                </div>
                {/* create listing button */}
                <button className="p-3 bg-blue-500 text-blue-100 rounded-lg uppercase hover:opacity-50 disabled:opacity-50">Create Listing</button>
            </div>
        </form>
    </main>
  )
}
export default CreateListing