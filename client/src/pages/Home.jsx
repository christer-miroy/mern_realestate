import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingCard from "../components/ListingCard";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  console.log(offerListings);
  console.log(saleListings);
  console.log(rentListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, [])

  return (
    <div>
      {/* top side */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="font-bold text-3xl lg:text-6xl">Your new <span className="text-blue-500">home</span><br/>is just a click away.</h1>
        <div className="text-xs sm:text-sm">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam autem mollitia.</p>
          <br />
          <p>We have a wide range of properties for you.</p>
        </div>
        <Link to={"/search"} className="font-semibold text-xs sm:text-sm text-blue-500 hover:underline">Start searching for your new home...</Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
        offerListings.length > 0 &&
        offerListings.map((listing) => (
          <SwiperSlide>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='h-[500px]'
              key={listing._id}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>      

      {/* all listings */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length > 0 && (
            <div className="my-3">
              <div className="text-center p-4">
                <h2 className="text-2xl font-semibold">Recent offers</h2>
                <Link className="text-sm hover:underline" to={'/search?offer=true'}>Show more offers</Link>
              </div>
              <div className="flex flex-wrap gap-4 p-4">
                {
                  offerListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          rentListings && rentListings.length > 0 && (
            <div className="my-3">
              <div className="text-center p-4">
                <h2 className="text-2xl font-semibold">Properties for Rent</h2>
                <Link className="text-sm hover:underline" to={'/search?type=rent'}>Other properties for rent</Link>
              </div>
              <div className="flex flex-wrap gap-4 p-4">
                {
                  rentListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div className="my-3">
              <div className="text-center p-4">
                <h2 className="text-2xl font-semibold">Properties for Sale</h2>
                <Link className="text-sm hover:underline" to={'/search?type=sale'}>Other properties for sale</Link>
              </div>
              <div className="flex flex-wrap gap-4 p-4">
                {
                  saleListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
export default Home