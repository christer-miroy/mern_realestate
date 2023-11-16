import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }
  
  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border-2 rounded-lg p-1"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-2 rounded-lg p-1"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-2 rounded-lg p-1"
          id="password"
          onChange={handleChange}
        />
        <button
          className="bg-slate-500 text-white p-1 rounded-lg uppercase hover:opacity-50 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
      { error && <p className="text-red-500">{error}</p> }
    </div>
  )
}
export default Signup