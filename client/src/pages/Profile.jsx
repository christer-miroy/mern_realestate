import { useSelector } from "react-redux"

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.photo}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
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