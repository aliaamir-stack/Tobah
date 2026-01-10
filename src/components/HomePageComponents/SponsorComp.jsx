import React from 'react';
import TitleSponsor from "./TitleSponsor.jsx";
import PremiumSponsor from './PremiumSponsor.jsx';

const SponsorComp = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full py-12 bg-white'>
      <div className='flex flex-col justify-center items-center w-full py-6'>
        <h1 className="integral-cf text-center text-5xl md:text-7xl font-bold py-4 px-2 bg-gradient-to-b from-gray-400 to-gray-600 text-transparent bg-clip-text">
          OUR PARTNERS
        </h1>
      </div>
      <TitleSponsor />
      <PremiumSponsor />

      {/* Blockeyfi Logo with Heading */}
      <div className="blockeyfi-logo-container mb-8 mt-8 flex flex-col items-center">
        <h2 className="fira-code text-gray-300 text-2xl md:text-3xl mb-2">
          <span className="uppercase font-bold text-gray-900">Gold Sponsor</span>
        </h2>
        <img 
          src="https://i.ibb.co/0MYbGtD/rb-55783.png" 
          alt="Blockeyfi" 
          className="max-w-[250px] mb-4" 
        />
      </div>

      {/* Sponsor Logos in Row (with responsive behavior) */}
      <div className="flex flex-col sm:flex-row justify-center gap-10 mb-12">
        {/* Circliphy Logo with Heading */}
        <div className="flex flex-col items-center mb-6 sm:mb-0">
          <h2 className="fira-code text-gray-300 text-2xl md:text-3xl mb-4">
            <span className="uppercase text-gray-900 font-bold">Silver Sponsor</span>
          </h2>
          <img 
            src="https://i.ibb.co/0MYbGtD/rb-55783.png" 
            alt="Circliphy" 
            className="max-w-[200px] object-contain mb-4" 
          />
        </div>

        {/* Datacamp Logo with Heading */}
        <div className="flex flex-col items-center mb-6 sm:mb-0 text-center">
          <h2 className="fira-code text-gray-300 text-2xl md:text-3xl mb-4">
            <span className="uppercase text-gray-900 font-bold">Module Sponsor</span>
          </h2>
          <img 
            src="https://i.ibb.co/0MYbGtD/rb-55783.png" 
            alt="Datacamp" 
            className="max-w-[200px] object-contain mb-4" 
          />
        </div>
      </div>
    </div>
  );
}

export default SponsorComp;