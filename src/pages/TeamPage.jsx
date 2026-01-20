import React from 'react';
import { PersonCard } from './PersonCard';

const TeamPage = () => {
  return (
    <div className='flex flex-col justify-center items-center w-[100%] py-12 px-12 mb-28'>

      <div className='flex justify-center items-center w-[100%] py-12'>
        <h1 className="integral-cf text-center text-5xl md:text-7xl font-bold py-6 px-2 bg-gradient-to-b from-maroon to-maroon-700 text-transparent bg-clip-text">
          OUR TEAM
        </h1>
      </div>

      <div className="flex flex-col lg:gap-16 md:gap-8 gap-8 flex-wrap">
        {/* President */}
        <div className='flex justify-center'>
          <PersonCard image="/team/ausaja-hussain.png" name="Ausaja Hussain" position="President" />
        </div>

        {/* Vice President */}
        <div className="flex gap-8 lg:gap-16 md:gap-8 justify-center md:flex flex-wrap">
          <PersonCard image="/team/warun-kumar.png" name="Warun Kumar" position="Vice President" />
        </div>

        {/* General Secretary & EM Head */}
        <div className='flex gap-8 lg:gap-16 md:gap-8 flex-wrap justify-center'>
          <PersonCard image="/team/fatimah-riaz.png" name="Fatimah Riaz" position="General Secretary" />
          <PersonCard image="/team/ali-aamir-khan.png" name="Ali Aamir Khan" position="Event Manager" />
        </div>

        {/* Others */}
        <div className='flex gap-8 lg:gap-16 md:gap-8 flex-wrap justify-center'>
          <PersonCard image="/team/shubair-hyder.png" name="Shubair Hyder" position="Esports Head" />
          <PersonCard image="/team/shayan-aamir.png" name="Shayan Aamir" position="DC Head Male" />
          <PersonCard image="/team/unaiza-rehman.png" name="Uniza Rehman" position="DC Head Female" />
          <PersonCard image="/team/aimen-qureshi.png" name="Aimen Qureshi" position="Media and Promotions Head" />
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
