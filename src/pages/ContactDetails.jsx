import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const contactData = [
  {
    name: 'Ausaja Hussain',
    role: 'President',
    phone: '+92 316 2334145'
  },
  {
    name: 'Warun Kumar',
    role: 'Vice President',
    phone: '+92 334 2702105'
  },
  {
    name: 'Ali Aamir Khan',
    role: 'Event Manager',
    phone: '03342063891'
  },
  {
    name: 'Fatima Riaz',
    role: 'General Secretary',
    phone: '+92 310 2022663'
  }
];

function ContactDetails() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center ">
      <h1
        className="integral-cf event-flow-title text-center text-3xl md:text-7xl font-bold py-6 px-2 mb-6 bg-gradient-to-b from-maroon to-maroon-700 text-transparent bg-clip-text"
      >
        Contact Us
      </h1>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 md:gap-12 md:flex-row md:flex-wrap justify-center">
          {contactData.map((contact, index) => (
            <div key={index} className="w-full sm:w-[300px] md:w-[400px] bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 border-b-4 border-transparent hover:border-golden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-maroon">{contact.name}</h3>
                <p className="text-golden mb-4 font-semibold">{contact.role}</p>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="text-maroon mr-2" />
                  <a href={`tel:${contact.phone}`} className="text-maroon hover:text-golden hover:underline">
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactDetails;
