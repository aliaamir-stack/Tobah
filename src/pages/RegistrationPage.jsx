import React, { useState } from 'react'
import CategoryRegistrationForm from '../components/Register-Now/CategoryRegistrationForm'

const CARDS = [
  { key: 'sports', title: 'Sports', icon: '🏆', desc: 'Futsal, Cricket, Basketball, Volleyball & more' },
  { key: 'esports', title: 'Esports', icon: '🎮', desc: 'PUBG, CS2, Valorant, Tekken & FIFA' },
  { key: 'padel', title: 'Padel', icon: '🎾', desc: 'Padel Doubles' },
]

const RegistrationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (selectedCategory) {
    return (
      <CategoryRegistrationForm
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#6B0F1A] mb-2 text-center">Register Now</h1>
      <p className="text-gray-500 mb-10 text-center">Choose your category to begin registration</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {CARDS.map((card) => (
          <div
            key={card.key}
            className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#F5A623] group cursor-pointer"
            onClick={() => setSelectedCategory(card.key)}
          >
            <div className="text-5xl mb-4">{card.icon}</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#6B0F1A] transition-colors">{card.title}</h2>
            <p className="text-sm text-gray-500 mb-5">{card.desc}</p>
            <button
              className="text-white text-lg bg-[#6B0F1A] border border-transparent rounded-md px-8 py-3 hover:bg-[#F5A623] hover:text-[#6B0F1A] transition-all transform hover:scale-105 active:scale-95 font-semibold"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedCategory(card.key)
              }}
            >
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RegistrationPage