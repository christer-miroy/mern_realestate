import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const Contact = ({listing}) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  }

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchLandlord();
  },[listing.userRef])

  return (
    <>
    {landlord && (
      <div className="text-xl flex flex-col gap-3">
        <p className="text-center">Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
        <textarea
          name="message"
          id="message"
          rows="5"
          value={message}
          onChange={onChange}
          placeholder="Message..."
          className="w-full rounded-md bg-slate-100 p-2"
        ></textarea>
        <Link
          to={`mailto:${landlord.email}?subject=Inquiry for ${listing.name}&body=${message}`}
          className="bg-blue-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-50"
        >
          Send message
        </Link>
      </div>
    )}</>
  )
}
export default Contact