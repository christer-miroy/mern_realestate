import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"

const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    console.log(formData);
    
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
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

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
                <button className="p-3 bg-blue-500 text-blue-100 rounded-lg uppercase hover:opacity-50 disabled:opacity-50">Create Listing</button>
            </div>
        </form>
    </main>
  )
}
export default CreateListing