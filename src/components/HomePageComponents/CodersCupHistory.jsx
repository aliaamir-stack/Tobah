import React, { useEffect, useRef } from 'react';
// import { Splide, SplideSlide } from '@splidejs/react-splide';
// import '@splidejs/react-splide/css/sea-green';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageGallery from './ImageGallery';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Store images in an array
const eventImages = [
  "https://i.ibb.co/jJt9Qk3/12.png",
  "https://i.ibb.co/BNG3gPb/13.png",
  "https://i.ibb.co/3fYQtc2/14.png",
  "https://i.ibb.co/WB4V49W/2.png",
  "https://i.ibb.co/6FRBBKs/1.png",
  "https://i.ibb.co/Bftmqk2/3.png",
  "https://i.ibb.co/j4363S6/4.png",
  "https://i.ibb.co/94h431K/5.png",
  "https://i.ibb.co/SRdyLym/6.png",
  "https://i.ibb.co/FY3NC4C/7.png", 
  "https://i.ibb.co/FskVQFY/8.png",
  "https://i.ibb.co/8NmZfH0/9.png",
  "https://i.ibb.co/QrG5yPT/10.png",
  "https://i.ibb.co/YPp1nzS/11.png"
];

const CodersCupHistory = () => {
  // Refs to target elements for animation
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Heading Animation on Scroll
    gsap.fromTo(
      headingRef.current,
      { y: -100, opacity: 0 }, // Initial state
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%', // Animation starts when 80% of the element is visible
          toggleActions: 'play none none none',
        },
      }
    );

    // Description Animation on Scroll
    gsap.fromTo(
      descRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: descRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Image Slider Animation on Scroll
    // gsap.fromTo(
    //   sliderRef.current.querySelectorAll('.splide__slide'),
    //   { opacity: 0, scale: 0.8 },
    //   {
    //     opacity: 1,
    //     scale: 1,
    //     duration: 1,
    //     stagger: 0.2, // Stagger the animation for each slide
    //     ease: 'power3.out',
    //     scrollTrigger: {
    //       trigger: sliderRef.current,
    //       start: 'top 90%',
    //       toggleActions: 'play none none none',
    //     },
    //   }
    // );
  }, []);

  return (
    <div className="bg-transparent text-gray-700 p-6 md:pb-24">
      {/* Heading */}
      <h1
        ref={headingRef}
        className="integral-cf text-center text-5xl md:text-7xl font-bold py-6 px-2 mb-6 bg-gradient-to-b from-gray-400 to-gray-600 text-transparent bg-clip-text"
      >
        <span className="integral-cf text-[#00A8FF]">Our</span> Vision
      </h1>

      {/* Description */}
      <p
        ref={descRef}
        className="text-center text-lg md:text-xl mb-10 px-4 md:px-20"
      >
To create a dynamic arena where passion meets excellence, uniting university students, local clubs, and sports enthusiasts. Our event celebrates athleticism, fosters teamwork, and strengthens bonds within and beyond institutions, inspiring the next generation of champions.
      </p>

      {/* Image Slider */}
      {/* <div ref={sliderRef} className="w-full sm:max-w-[90%] mx-auto">
        <Splide
          options={{
            rewind: true,
            gap: '',
            width: '100%',
            autoplay: true,
            pauseOnHover: true,
            type: 'loop',
          }}
          aria-label="Event Highlights"
        >
          {eventImages.map((src, index) => (
            <SplideSlide key={index}>
              <img
                src={src}
                alt={`Event ${index + 1}`}
                className="w-full mx-auto pb-4 rounded-xl object-contain h-[400px] md:h-[600px]"
              />
            </SplideSlide>
          ))}
        </Splide>
      </div> */}

      <ImageGallery images={eventImages}/>

      <style>
        {`
          @media (max-width: 768px) {
            .splide__arrow {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CodersCupHistory;
