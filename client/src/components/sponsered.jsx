import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import dummySponsoredMessages from "../data/sponsered";

const Sponsored = () => {
  const [sponsored, setSponsored] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load sponsored data
  const fetchSponsored = () => {
    setSponsored(dummySponsoredMessages);
  };

  useEffect(() => {
    fetchSponsored();
  }, []);

  // Automatically change sponsored post
  useEffect(() => {
    if (sponsored.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % sponsored.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [sponsored]);

  if (sponsored.length === 0) return null;

  const currentSponsored = sponsored[currentIndex];

  return (
    <div>
      <div
        className="
          rounded-[28px]
          bg-white/70
          border
          border-[#E8E2D8]
          p-5
          shadow-sm
          overflow-hidden
        "
      >

        {/* Heading */}
        <h2 className="text-[15px] font-semibold text-[#17383A]">
          Sponsored
        </h2>

        {/* Sponsored Content */}
        <div className="mt-4 overflow-hidden rounded-[20px]">

          <div
            key={currentSponsored.id}
            className="
              animate-slideIn
              bg-[#F8FCFB]
              border
              border-[#C9D2D0]
              rounded-[20px]
              overflow-hidden
            "
          >

            {/* Image */}
            {currentSponsored.media && (
              <img
                src={currentSponsored.media}
                alt={currentSponsored.sponsor.name}
                className="
                  w-full
                  h-[120px]
                  object-cover
                "
              />
            )}

            {/* Content */}
            <div className="p-4">

              {/* Sponsor */}
              <div className="flex items-center gap-2">

                <img
                  src={currentSponsored.sponsor.dp}
                  alt={currentSponsored.sponsor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-[#17383A]">
                      {currentSponsored.sponsor.name}
                    </p>

                    {currentSponsored.sponsor.verified && (
                      <span className="text-blue-500 text-xs">
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400">
                    Sponsored ·{" "}
                    {moment(currentSponsored.createdAt).fromNow()}
                  </p>
                </div>

              </div>

              {/* Message */}
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                {currentSponsored.message}
              </p>

              {/* CTA */}
              <Link
                to={currentSponsored.cta.link}
                className="
                  inline-flex
                  mt-3
                  px-4
                  py-2
                  rounded-full
                  bg-[#17383A]
                  text-white
                  text-xs
                  font-medium
                  transition-all
                  duration-200
                  hover:bg-[#285557]
                  hover:scale-105
                  active:scale-95
                "
              >
                {currentSponsored.cta.text}
              </Link>

            </div>

          </div>

        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 mt-3">

          {sponsored.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${
                  index === currentIndex
                    ? "w-5 bg-[#17383A]"
                    : "w-1.5 bg-gray-300"
                }
              `}
            />
          ))}

        </div>

      </div>
    </div>
  );
};

export default Sponsored;