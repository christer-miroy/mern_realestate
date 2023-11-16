import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-purple-300 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                <span className="text-purple-600">MERN</span>
                <span className="text-purple-800">Estate</span>
            </h1>
            <form action="" className="bg-purple-100 rounded-large p-3 flex items-center">
                <input
                    type="text"
                    name="search"
                    id=""
                    placeholder="Search"
                    className="bg-transparent focus:outline-none w-24 sm:w-64"
                />
                <FaSearch className='text-purple-500' />
            </form>
            <ul className='flex gap-3'>
                <Link to="/">
                    <li className='hidden sm:inline text-slate-600 hover:underline'>
                        <b>Home</b>
                    </li>
                </Link>
                <Link to="/about">
                    <li className='hidden sm:inline text-slate-600 hover:underline'>
                        <b>About</b>
                    </li>
                </Link>
                <Link to="/sign-in">
                    <li className='sm:inline text-slate-600 hover:underline'>
                        <b>Sign In</b>
                    </li>
                </Link>
            </ul>
        </div>
    </header>
  )
}
export default Header