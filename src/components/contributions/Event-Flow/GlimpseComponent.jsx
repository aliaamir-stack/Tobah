import React, { useEffect, useRef } from "react"
import Marquee from "react-fast-marquee"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const images = [
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
  "https://i.ibb.co/tTW8LvWk/14.png",
];


export default function GlimpseComponentlow() {
  const componentRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const component = componentRef.current
    const title = titleRef.current

    gsap.fromTo(
      title,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: component,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    )

    gsap.fromTo(
      component,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: component,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    )
  }, [])

  return (
    <div ref={componentRef} className="my-16">
      <div className="flex justify-center px-2 sm:px-0 text-center items-center mb-8 md:mb-20 text-[34px] md:text-[41px] lg:text-[57px] xl:text-[70px] 2xl:text-7xl font-[700]">
        <h1 ref={titleRef} className="text-[#FFFFFF]">
          <span className="text-[#F3A93E]">SPORTICS 2025 </span>
          <span className="bg-gradient-to-b from-gray-400 to-gray-600 text-transparent bg-clip-text">GLIMPSE</span>
        </h1>
      </div>
    
      <Marquee gradient={false} speed={50} pauseOnHover={true}>
        {images.map((image, index) => (
          <div key={index} className="w-[180px] h-[120px] sm:w-[240px] sm:h-[160px] md:w-[270px] md:h-[180px] lg:w-[360px] lg:h-[240px] xl:w-[400px] xl:h-[267px] 2xl:w-[400px] 2xl:h-[267px] bg-[#D9D9D9] mx-4 flex items-center justify-center rounded-xl">
            <img src={image} alt={`Olympiad ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
          </div>
        ))}
      </Marquee>
    </div>
  )
}
