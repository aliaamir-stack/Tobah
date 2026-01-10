import React, { useState, useEffect } from "react";

const RegistrationCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Target date: 1st February 2026, at 23:59 in Pakistan Standard Time
  const targetDate = new Date('2026-02-01T23:59:00+05:00'); // PST (UTC+5)

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      let remainingTime = targetDate.getTime() - currentTime;

      if (remainingTime <= 0) {
        remainingTime = 0;
        clearInterval(countdownInterval);
      }

      setTimeRemaining(remainingTime);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Function to format the time in days, hours, minutes, and seconds
  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return (
      <div className="flex justify-around items-center md:gap-4 gap-2 flex-wrap">
        <div className="flex flex-col items-center justify-center bg-maroon rounded-md text-white font-bold text-3xl p-4 w-20 h-20 md:w-24 md:h-24">
          {days.toString().padStart(2, "0")}
          <span className="text-xs text-golden mt-[-0.55rem]">days</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-maroon rounded-md text-white font-bold text-3xl p-4 w-20 h-20 md:w-24 md:h-24">
          {hours.toString().padStart(2, "0")}
          <span className="text-xs text-golden mt-[-0.5rem]">hours</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-maroon rounded-md text-white font-bold text-3xl p-4 w-20 h-20 md:w-24 md:h-24">
          {minutes.toString().padStart(2, "0")}
          <span className="text-xs text-golden mt-[-0.5rem]">minutes</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-maroon rounded-md text-white font-bold text-3xl p-4 w-20 h-20 md:w-24 md:h-24">
          {seconds.toString().padStart(2, "0")}
          <span className="text-xs text-golden mt-[-0.5rem]">seconds</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col my-6 justify-center items-center w-full h-full bg-cover bg-center bg-fixed ">
      {/* Display the formatted time remaining */}
      {formatTime(timeRemaining)}

      <p className="text-gray-900 md:text-lg text-center my-6 px-4">
        Registration ends on: {targetDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
};

export default RegistrationCountdown;
