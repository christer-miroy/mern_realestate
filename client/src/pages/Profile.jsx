import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage,  ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
          placeholder="Username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-blue-800 text-blue-100 p-3 rounded-lg uppercase hover:opacity-50 disabled:opacity-50">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span>
          <button className="bg-red-700 text-red-100 p-3 rounded-lg uppercase hover:opacity-50">Delete Account</button>
        </span>
        <span>
          <button className="bg-red-700 text-red-100 p-3 rounded-lg uppercase hover:opacity-50">Sign Out</button>
        </span>
      </div>
    </div>
  )
}
export default Profile