import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { useParams } from "react-router-dom";
import { Spinner } from "../components";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { ImLocation } from "react-icons/im";
import { AiOutlineHome } from "react-icons/ai";
import { GiSolarTime, GiResize } from "react-icons/gi";
import { FaParking } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

const Details = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  if (loading) return <Spinner />;
  return (
    <section className="mt-16 mb-6 relative">
      {/* Image Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
      >
        {listing?.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[400px]"
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <p className="absolute left-8 top-4 bg-blue-500 text-white rounded-md px-3 py-1 z-20">
        {formatDistanceToNow(new Date(listing?.timestamp), {
          addSuffix: true,
        }).replace("about", "")}
      </p>
      <div className="px-4 md:px-8 lg:px-12 mt-4 grid gap-5 md:grid-cols-2">
        <div className="">
          {/* Type and address */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 items-center">
              <div className="rect" />
              <p className="font-bold text-xl">
                For{" "}
                {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
              </p>
            </div>
            <p className="flex">
              <ImLocation className="text-lg text-green-500 mt-1" />{" "}
              {listing.address}
            </p>
          </div>

          {/* Price */}
          <h1 className="my-2">
            <span className="font-bold text-2xl">${listing.regular}</span>
            {listing.type === "rent" && <span>/mo</span>}
          </h1>
          <h3>
            {listing.discounted > 0 && `Final Price: $${listing.discounted}`}
          </h3>

          {/* Bed,Bath and Size */}
          <div className="flex items-center gap-2 my-2">
            <p>
              <span className="font-bold">{listing.bedrooms}</span> Bed
            </p>
            <p>
              <span className="font-bold">{listing.baths}</span> Bath
            </p>
            <p>
              <span className="font-bold">{listing.size} </span>m<sup>2</sup>
            </p>
          </div>

          {/* Description */}
          <p>
            <span className="font-bold">Description: </span>{" "}
            <span className="text-sm font-light">{listing.description}</span>
          </p>

          {/* Additional Info */}
          <div className="grid grid-cols-2 mt-3">
            <div className="flex gap-2 items-center">
              <AiOutlineHome className="font-bold text-2xl" />
              <div>
                <p className="font-bold">{listing.name}</p>
                <p className="text-sm font-light">Property Type</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <GiSolarTime className="font-bold text-2xl" />
              <div>
                <p className="font-bold">
                  {formatDistanceToNow(new Date(listing?.timestamp)).replace(
                    "about",
                    ""
                  )}
                </p>
                <p className="text-sm font-light">Time on Realtor.com</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 mt-3">
            <div className="flex gap-2 items-center">
              <FaParking className="font-bold text-2xl" />
              <div>
                <p className="font-bold">
                  {listing.parking.charAt(0).toUpperCase() +
                    listing.parking.slice(1)}
                </p>
                <p className="text-sm font-light">Parking Spot</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <MdChair className="font-bold text-2xl" />
              <div>
                <p className="font-bold">
                  {listing.furnish.charAt(0).toUpperCase() +
                    listing.furnish.slice(1)}
                </p>
                <p className="text-sm font-light">Furnished</p>
              </div>
            </div>
          </div>

          {listing.type === "sale" && (
            <div className="flex gap-2 items-center mt-3">
              <GiResize className="font-bold text-2xl" />
              <div>
                <p className="font-bold">
                  ${parseInt(listing.regular / listing.size)}
                </p>
                <p className="font-light text-sm">
                  Price per m<sup>2</sup>
                </p>
              </div>
            </div>
          )}
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default Details;
