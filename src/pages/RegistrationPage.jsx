import React, { useState } from 'react'
import EnhancedMultiStepForm from '../components/Register-Now/MultiStepForm'

const RegistrationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleExternalRegister = (url) => {
    window.location.href = url
  }

  if (selectedCategory === 'sports') {
    return <EnhancedMultiStepForm />
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">

        {/* Sports */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#F3A93E] border-b-[3px] border-b-transparent">
          <h2 className="text-2xl font-bold mb-4">Sports</h2>
          <button
            className="text-white text-lg bg-maroon border border-white rounded-md px-8 py-3 hover:bg-golden hover:text-maroon transition-all transform hover:scale-105 active:scale-95 font-semibold"            onClick={() => setSelectedCategory('sports')}
          >
            Register
          </button>
        </div>

        {/* Esports */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#F3A93E] border-b-[3px] border-b-transparent">
          <h2 className="text-2xl font-bold mb-4">Esports</h2>
          <button
            className="text-white text-lg bg-maroon border border-white rounded-md px-8 py-3 hover:bg-golden hover:text-maroon transition-all transform hover:scale-105 active:scale-95 font-semibold"            onClick={() =>
              handleExternalRegister('https://docs.google.com/forms/d/e/1FAIpQLSeBoe2583RglYclNCVwynwQaESGWrdikeQ0rF4vkEeZlIdIGQ/viewform?usp=header')
            }
          >
            Register
          </button>
        </div>

        {/* Padel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#F3A93E] border-b-[3px] border-b-transparent">
          <h2 className="text-2xl font-bold mb-4">Padel</h2>
          <button
            className="text-white text-lg bg-maroon border border-white rounded-md px-8 py-3 hover:bg-golden hover:text-maroon transition-all transform hover:scale-105 active:scale-95 font-semibold"            onClick={() =>
              handleExternalRegister('https://forms.gle/PADEL_GOOGLE_FORM_LINK')
            }
          >
            Register
          </button>
        </div>

      </div>
    </div>
  )
}

export default RegistrationPage