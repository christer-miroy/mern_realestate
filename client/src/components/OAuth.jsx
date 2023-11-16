import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            
            const res = await fetch("/api/auth/google", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               },
               body: JSON.stringify({
                   name: result.user.displayName,
                   email: result.user.email,
                   photo: result.user.photoURL
               }), 
            });

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.log("Could not sign in with Google", error)
        }
    }

  return (
    <button
        type="button"
        className="bg-blue-800 text-blue-100 p-1 rounded-lg uppercase hover:opacity-50 disabled:opacity-50"
        onClick={handleGoogleClick}
    >
        Continue with Google
    </button>
  )
}
export default OAuth