import {FaSearch} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
    const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-blue-800 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                <span className="text-blue-200">MERN</span>
                <span className="text-blue-400">Estate</span>
            </h1>
            <form action="" className="bg-blue-100 rounded-large p-3 flex items-center">
                <input
                    type="text"
                    name="search"
                    id=""
                    placeholder="Search"
                    className="bg-transparent focus:outline-none w-24 sm:w-64"
                />
                <FaSearch className='text-blue-500' />
            </form>
            <ul className='flex gap-3'>
                <Link to="/">
                    <li className='hidden sm:inline text-blue-300 hover:underline'>
                        <b>Home</b>
                    </li>
                </Link>
                <Link to="/about">
                    <li className='hidden sm:inline text-blue-300 hover:underline'>
                        <b>About</b>
                    </li>
                </Link>
                {/* protected route */}
                <Link to="/profile">
                {currentUser ? (
                    <img src={currentUser.photo} className='rounded-full h-7 w-7 object-cover' />
                ) : (
                    <li className='sm:inline text-blue-300 hover:underline'>
                        <b>Sign In</b>
                    </li>
                )}
                </Link>
                
            </ul>
        </div>
    </header>
  )
}
export default Header