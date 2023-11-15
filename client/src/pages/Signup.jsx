import { Link } from "react-router-dom"

const Signup = () => {
  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Signup Page</h1>
      <form action="" className="flex flex-col gap-3">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border-2 rounded-lg"
          id="username"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-2 rounded-lg"
          id="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-2 rounded-lg"
          id="password"
        />
        <button className="bg-slate-500 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50">Sign up</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
    </div>
  )
}
export default Signup