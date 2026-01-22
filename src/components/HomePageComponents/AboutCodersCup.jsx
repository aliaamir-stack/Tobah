import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Use the new local logo
const logo = "/sportics-logo-2025.png"

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin

export default function AboutCodersCup() {
    const logoRef = useRef(null); // Ref for the logo
    const sectionRef = useRef(null); // Ref for the section

    useEffect(() => {
        // Parallax and scaling effect on the logo
        gsap.fromTo(
            logoRef.current,
            { y: 50, scale: 0.8, opacity: 0 }, // Start below with small size and hidden
            {
                y: 0, scale: 1, opacity: 1, // Align in place with full size and opacity
                scrollTrigger: {
                    trigger: logoRef.current,
                    start: 'top 80%', // Starts animation when 80% of section is visible
                    end: 'bottom 20%', // Ends when 40% remains
                    scrub: 1, // Smooth scrubbing animation
                },
            }
        );

        // Subtle zoom-in effect on the entire section during scroll
        gsap.fromTo(
            sectionRef.current,
            { scale: 1 },
            {
                scale: 1.02,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            }
        );
    }, []);

    return (
        <div className="text-golden bg-[#fff] py-12 mb-16" ref={sectionRef}>
            <h1 className="integral-cf text-center text-5xl md:text-7xl font-bold py-6 px-2 bg-gradient-to-b from-maroon to-maroon-700 text-transparent bg-clip-text">
                WHAT IS <span className="integral-cf text-golden">FAST OLYMPIAD?</span>
            </h1>

            <div className="sporting-grotesque flex flex-col lg:flex-row gap-8 justify-center items-center px-4 py-8">
                <p className="text-gray-700 w-full lg:w-6/12 text-center md:text-left">
                    FAST Olympiad 2026 is the annual flagship sports event hosted by FAST University, bringing together athletes and enthusiasts from universities across Karachi. This exciting five-day event, happening from February 2nd to February 6th, 2026, is a dynamic showcase of outdoor sports, indoor games, and e-sports.
                    <br /><br />
                    With a wide range of competitions, participants have the chance to demonstrate their skills, teamwork, and passion for sports. More than just a competition, FAST Olympiad celebrates the spirit of unity, excellence, and the vibrant energy of youth.
                    <br /><br />
                    Whether you're an athlete ready to compete, a gaming enthusiast looking for thrills, or a supporter cheering from the sidelines, FAST Olympiad offers something for everyone. Join us for this unforgettable experience and be part of a community that thrives on passion and sportsmanship.

                </p>

                {/* Animated Logo */}
                <img
                    className="w-full lg:w-4/12"
                    src={logo}
                    alt="Olympiad Logo"
                    ref={logoRef}
                />
            </div>
        </div>
    );
}