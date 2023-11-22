import { useEffect, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

const UpdateListing = () => {
    const navigate = useNavigate();
    const params = useParams();

    const {currentUser} = useSelector((state) => state.user);

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        address: '',
        description: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        offer: false,
        regularPrice: 50,
        discountedPrice: 0
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async() => {
            const listingId = params.listingId;
            
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setFormData(data);
        }

        fetchListing();
    }, [])
    
    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData,
                    imageUrls: formData.imageUrls.concat(urls)
                });
                setUploading(false);
                // error handling
                setImageUploadError(false);
            }).catch((err) => {
                setImageUploadError('Image upload failed (2mb max per image)');
                setUploading(false);
            });
        } else {
            setImageUploadError('Cannot upload more than 6 images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    console.log(progress);
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    };

    const handleChange = (e) => {
        // get value of type
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }

        // get values of parking, furnished and offer
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        // get values of text and number fields
        if (e.target.type === 'text' || e.target.type === 'number' || e.target.type === 'textarea') {
            // converting the string to integer and float for number fields
            let value;
            if (e.target.id === 'bedrooms' || e.target.id === 'bathrooms') {
                value = parseInt(e.target.value);
            } else if (e.target.id === 'regularPrice' || e.target.id === 'discountedPrice') {
                value = parseFloat(e.target.value);
            } else {
                value = e.target.value;
            }
            // original code
            setFormData({
                ...formData,
                [e.target.id]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) {
                setError('Please upload at least one image');
                return;
            }

            if (+formData.regularPrice <= +formData.discountedPrice) {
                setError('Discounted price cannot be higher than or equal to regular price');
                return;
            }
            setLoading(true);
            setError(false);

            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                ...formData,
                userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setLoading(false);
            setFormData({
                imageUrls: [],
                name: '',
                address: '',
                description: '',
                type: 'rent',
                bedrooms: 1,
                bathrooms: 1,
                parking: false,
                furnished: false,
                offer: false,
                regularPrice: 50,
                discountedPrice: 0,
            });
            setError(null);
            navigate(`/profile`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Update Listing</h1>
        <form
            className="flex flex-col sm:flex-row gap-4"
            onSubmit={handleSubmit}
        >
            {/* left column */}
            <div className="flex flex-col gap-4 flex-1">
                {/* text fields */}
                <input
                    type="text"
                    placeholder="Name"
                    className="border p-3 rounded-lg"
                    id="name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                />
                <textarea
                    type="text"
                    placeholder="Description"
                    className="border p-3 rounded-lg"
                    id="description"
                    required
                    onChange={handleChange}
                    value={formData.description}
                />
                <input
                    type="text"
                    placeholder="Address"
                    className="border p-3 rounded-lg"
                    id="address"
                    required
                    onChange={handleChange}
                    value={formData.address}
                />
                {/* check boxes */}
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="sale"
                            onChange={handleChange}
                            checked={formData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="rent"
                            onChange={handleChange}
                            checked={formData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="parking"
                            onChange={handleChange}
                            checked={formData.parking}
                        />
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="furnished"
                            onChange={handleChange}
                            checked={formData.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="w-5"
                            id="offer"
                            onChange={handleChange}
                            checked={formData.offer}
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
                            onChange={handleChange}
                            value={formData.bedrooms}
                        />
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            id="bathrooms"
                            min='1'
                            max="10"
                            className="p-3 border border-slate-300 rounded-lg"
                            onChange={handleChange}
                            value={formData.bathrooms}
                        />
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            id="regularPrice"
                            min='50'
                            max="10000000"
                            className="p-3 border border-slate-300 rounded-lg"
                            onChange={handleChange}
                            value={formData.regularPrice}
                        />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">(per month)</span>
                        </div>
                        
                    </div>
                    {
                        formData.offer && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="discountedPrice"
                                    min='0'
                                    max="10000000"
                                    className="p-3 border border-slate-300 rounded-lg"
                                    onChange={handleChange}
                                    value={formData.discountedPrice}
                                />
                                <div className="flex flex-col items-center">
                                    <p>Discounted Price</p>
                                    <span className="text-xs">(per month)</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* right column */}
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">
                    Images:
                    <span className="font-normal ml-2 text-xs">The first image will be cover (max 6)</span>
                </p>
                {/* error handling */}
                <p className="text-red-500">{imageUploadError && imageUploadError}</p>
                <div className="flex gap-4">
                    <input
                        type="file"
                        id="images"
                        className="p-3 text-blue-300 rounded w-full"
                        accept="image/*"
                        multiple
                        onChange={(e)=>setFiles(e.target.files)}
                    />
                    <button
                        type="button"
                        disabled={uploading}
                        className="p-3 border border-blue-300 rounded-lg uppercase hover:bg-blue-300 hover:text-blue-800 disabled:opacity-50"
                        onClick={handleImageSubmit}
                    >
                        {uploading ? 'Uploading image...' : 'Upload'}
                    </button>
                </div>
                {/* display images */}
                {formData.imageUrls.length > 0 &&
                    formData.imageUrls.map((url, index) => (
                    <div
                        key={url}
                        className='flex justify-between p-3 bg-blue-300 rounded-lg items-center'
                    >
                        <img
                        src={url}
                        alt='listing image'
                        className='w-20 h-20 object-contain rounded-lg'
                        />
                        <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='p-3 text-red-700 rounded-lg uppercase font-semibold hover:bg-red-500 hover:text-red-100'
                        >
                        Delete
                        </button>
                    </div>
                ))}
                {/* create listing button */}
                <button
                    disabled={loading || uploading}
                    className="p-3 bg-blue-500 text-blue-100 rounded-lg uppercase hover:opacity-50 disabled:opacity-50">{loading ? 'Loading...' : 'Update Listing'}
                </button>
                {
                    error && <p className="text-red-500 text-sm">{error}</p>
                }
            </div>
        </form>
    </main>
  )
}
export default UpdateListing