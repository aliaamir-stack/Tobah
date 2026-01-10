import React, { useEffect, useRef } from "react"
import Marquee from "react-fast-marquee"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const images = [
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
          <span className="text-[#00A8FF]">OLYMPIAD 2024 </span>
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
