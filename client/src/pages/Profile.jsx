import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage,  ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  // upload file to firebase
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress)); //round to nearest integer
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, photo: downloadURL });
        })
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  }
    

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={()=>fileRef.current.click()}
          src={formData.photo || currentUser.photo}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* file upload status */}
        <p className="text-center text-sm">
            {
              fileUploadError ? (
                <span className="text-red-300 text-center p-1 rounded-lg">Error Image Upload (Must be less than 2MB)</span>
              ) : filePercentage > 0 && filePercentage < 100 ? (
                <span className="text-blue-400 text-center p-1 rounded-lg">{`Uploading ${filePercentage}%`}</span>
              ) : filePercentage === 100 ? (
                <span className="text-blue-200 text-center p-1 rounded-lg">Image uploaded successfully!</span>
              ) : ("")
            }
        </p>

        <input
          type="text"
          name="username"
          id="username"
          defaultValue={currentUser.username}
          placeholder="Username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          className="bg-blue-800 text-blue-100 p-3 rounded-lg uppercase hover:opacity-50 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-blue-500 text-blue-100 p-3 rounded-lg uppercase text-center hover:opacity-50"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span>
          <button
            className="bg-red-700 text-red-100 p-2 rounded-lg uppercase hover:opacity-50"
            onClick={handleDeleteUser}
          >
              Delete Account
            </button>
        </span>
        <span>
          <button
            className="bg-red-700 text-red-100 p-2 rounded-lg uppercase hover:opacity-50"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </span>
      </div>
      <p className="text-red-300 mt-5">{error ? error : ""}</p>
      <p className="text-blue-300">{updateSuccess ? "Profile updated successfully!" : ""}</p>
      <button
        onClick={handleShowListings}
        className="w-full"
      >
        Show Listings
      </button>
      <p>{showListingsError ? "Error fetching listings" : ""}</p>
      {
        userListings && userListings.length > 0 && userListings.map((listing) => (
          <div key={listing._id} className="my-10 rounded-lg bg-blue-300 p-4 gap-4 items-center flex justify-between">
            <Link
              to={`/listing/${listing._id}`}
              className="flex gap-4 items-center"
            >
              <img
                src={listing.imageUrls[0]}
                alt="listing"
                className="h-16 w-16 object-contain"
              />
              <p className="font-semibold text-blue-800 flex-1 capitalize hover:underline truncate">{listing.name}</p>
            </Link>
            <div className="gap-4 flex flex-col">
              <Link to={`/update-listing/${listing._id}`}>
                <button
                  className="bg-blue-800 text-blue-100 p-2 rounded-lg uppercase hover:opacity-50"
                >
                  Edit
                </button>
              </Link>
              <button
                className="bg-red-700 text-red-100 p-2 rounded-lg uppercase hover:opacity-50"
                onClick={() => handleDeleteListing(listing._id)}
              >Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}
export default Profile
