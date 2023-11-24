import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from "swiper"
import {Navigation} from "swiper/modules"
import 'swiper/css/bundle'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare
}  from 'react-icons/fa'
import { useSelector } from "react-redux"
import Contact from "../components/Contact"

const Listing = () => {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const {currentUser} = useSelector((state) => state.user);

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return ;
                }
                console.log(data);
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };

        fetchListing();
    }, [params.listingId]);

  return (
    <main>
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
        {error && <p className="text-center my-7 text-2xl">Something went wrong</p>}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div
                                className="h-[400px]"
                                style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: "cover",
                                }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-blue-300 cursor-pointer">
                    <FaShare
                        className="text-blue-800"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 20000);
                        }}
                    />
                </div>
                {copied && (
                    <p className="fixed top-[23%] right-[5%] font-semibold">
                        Link Copied!
                    </p>
                )}
                <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                    <p className="text-3xl font-semibold">
                        {listing.name} - PHP{' '}
                        {listing.offer
                            ? listing.discountedPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')
                        }
                        {listing.type === 'rent' && ' per month'}
                    </p>
                    <p className="flex items-center mt-6 gap-2 text-2xl">
                        <FaMapMarkerAlt />
                        {listing.address}
                    </p>
                    <div className="flex gap-4">
                        <p className="bg-blue-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {
                            listing.offer && (
                            <p className="bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                                PHP {(+listing.regularPrice - +listing.discountedPrice).toLocaleString('en-US')} OFF
                            </p>)
                        }
                    </div>
                    <p className="text-xl">
                        <span className="font-semibold">Description - </span>
                        {listing.description}
                    </p>
                    <ul className="font-semibold text-xl flex flex-wrap items-center gap-4sm:gap-6">
                        <li className="flex items-center gap-3 p-3 whitespace-nowrap">
                            <FaBed className="text-xl" />
                            {listing.bedrooms}
                        </li>
                        <li className="flex items-center gap-3 p-3 whitespace-nowrap">
                            <FaBath className="text-xl" />
                            {listing.bathrooms}
                        </li>
                        <li className="flex items-center gap-3 p-3 whitespace-nowrap">
                            <FaParking className="text-xl" />
                            {listing.parking ? 'Available' : 'Not Available'}
                        </li>
                        <li className="flex items-center gap-3 p-3 whitespace-nowrap">
                            <FaChair className="text-xl" />
                            {listing.furnished ? 'Furnished' : 'Unfurnished'}
                        </li>
                    </ul>
                    {/* owner will not see this button if viewing own listing, button will disappear when clicked */}
                    {
                        currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button
                                className="bg-blue-700 text-white uppercase hover:opacity-50 p-3 rounded-lg"
                                onClick={() => setContact(true)}
                            >Contact</button>
                        )
                    }
                    {/* contact page will appear when clicked */}
                    {
                        contact && <Contact listing={listing} />
                    }
                </div>
            </>
        )}
    </main>
  )
}
export default Listing