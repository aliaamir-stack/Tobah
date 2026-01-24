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
      <PremiumSponsor />
      
    </div>
  );
}

export default SponsorComp;