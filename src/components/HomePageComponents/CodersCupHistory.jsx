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
  "https://i.ibb.co/Zz6mvmY1/1.png",
  "https://i.ibb.co/h12VQ7Nf/12.png",
  "https://i.ibb.co/Cp0JNrD7/2.png",
  "https://i.ibb.co/qLWhZjD5/3.png",
  "https://i.ibb.co/chmf4RV3/4.png",
  "https://i.ibb.co/F4q8jbbR/Untitled-design-34.png",
  "https://i.ibb.co/BV65PnL2/10.png",
  "https://i.ibb.co/pv7rrNt9/11.png",
  "https://i.ibb.co/HDY1B2rJ/13.png",
  "https://i.ibb.co/3ndM4xr/15.png",
  "https://i.ibb.co/zVWdw9DV/17.png",
  "https://i.ibb.co/1tg2B42H/16.png",
  "https://i.ibb.co/tTW8LvWk/14.png"
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
        <span className="integral-cf text-[#F3A93E]">Our</span> Vision
      </h1>

      {/* Description */}
      <p
        ref={descRef}
        className="text-center text-lg md:text-xl mb-10 px-4 md:px-20"
      >
To create a dynamic arena where passion meets excellence, uniting university students, and sports enthusiasts. Our event celebrates athleticism, fosters teamwork, and strengthens bonds within and beyond institutions, inspiring the next generation of champions.
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
