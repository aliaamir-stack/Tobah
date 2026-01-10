import React from 'react';

const tempImage = "https://i.ibb.co/0MYbGtD/rb-55783.png";

const PremiumSponsor = () => {
  return (
    <div className='w-full flex justify-center items-center text-center flex-col gap-y-4 mt-12'>
        <h1 className="fira-code font-bold text-[#e0bc6e] text-2xl md:text-3xl">
            <span className="uppercase text-[#e0bc6e] text-center">Diamond Sponsor</span>
        </h1>
        <div className='flex sm:flex-row flex-col justify-center items-center sm:gap-x-8 gap-y-8 w-[50%]'>
            <a href="" target="_blank" rel="noopener noreferrer">
                <img src={tempImage} alt="Premium Sponsor" className='w-64' />
            </a>
        </div>
    </div>
  );
}

export default PremiumSponsor;