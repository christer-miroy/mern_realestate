import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md"

const ListingCard = ({listing}) => {
  return (
    <div className="bg-blue-800 rounded-lg hover:scale-105 transition-scale duration-300 cursor-pointer w-full sm:w-[320px]">
        <Link
            to={`/listing/${listing._id}`}
            className="flex flex-col gap-4"
        >
            <img
                src={listing.imageUrls[0] || 'https://image.shutterstock.com/mosaic_250/0/0/562242718.jpg'}
                alt="listing cover"
                className="w-full h-[300px] sm:h-[220px] object-cover rounded-t-lg"
            />
            <div className="p-3 flex flex-col gap-2">
                <p className="text-xl font-semibold text-white truncate">{listing.name}</p>
                <div className="flex items-center gap-2">
                    <MdLocationOn className="h-4 w-4" />
                    <p className="text-xs text-white truncate w-full">{listing.address}</p>
                </div>
                <p className="text-sm text-white line-clamp-2">{listing.description}</p>
                <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">
                        PHP {listing.discountedPrice > 0 ? listing.discountedPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                        {/* if rent, display "monthly" */}
                        {listing.type === "rent" && " monthly"}
                    </p>
                    {/* if disounted price is more than 0, display discounted */}
                    {listing.discountedPrice > 0 ? (<p className="font-semibold underline">Discounted!</p>) : null}
                </div>
                <div className="flex items-center gap-4">
                    <div className="font-bold text-xs">
                        {
                            listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`
                        }
                    </div>
                    <div className="font-bold text-xs">
                        {
                            listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`
                        }
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
export default ListingCard