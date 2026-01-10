import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-screen bg-maroon flex flex-col items-center justify-center gap-8">
      <img
        src="/sportics-logo-2025.png"
        alt="Olympiad Logo"
        className="h-80 md:h-120 w-auto"
      />
      <h2 className="text-golden text-3xl font-bold tracking-wider">OLYMPIAD 26</h2>
      <div className="loader">
        <div className="loader-inner">
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="loader-block"></div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .loader {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          position: relative;
        }
        .loader:before {
          content: "";
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
        }
        .loader-inner {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .loader-block {
          display: inline-block;
          width: 8px;
          height: 10px;
          margin: 2px;
          background-color: #f3a93e;
          box-shadow: 0 0 30px #f3a93e;
          animation: loader 5s infinite;
        }
        ${Array.from({ length: 24 })
          .map(
            (_, index) =>
              `.loader-block:nth-child(${index + 1}) { animation-delay: ${0.2 * index
              }s; }`
          )
          .join("\n")}
        @keyframes loader {
          0% {
            transform: scale(1);
            box-shadow: 0 0 40px #f3a93e;
          }
          13% {
            transform: scale(1, 4);
            box-shadow: 0 0 60px #f3a93e;
          }
          26% {
            transform: scale(1);
            box-shadow: 0 0 40px #f3a93e;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
