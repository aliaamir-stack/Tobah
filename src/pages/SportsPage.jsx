import React from 'react';
import './SportsPage.css'; // Assuming you will create a CSS file for styling

const sportsData = [
  // Sports
  { name: 'Futsal (Male)', fee: 8000, category: 'Sports' },
  { name: 'Futsal (Female)', fee: 6000, category: 'Sports' },
  { name: 'Indoor Cricket', fee: 6000, category: 'Sports' },
  { name: 'Basketball (Male & Female)', fee: 7000, category: 'Sports' },
  { name: 'Volleyball', fee: 6500, category: 'Sports' },
  { name: 'Throwball', fee: 5000, category: 'Sports' },
  { name: 'Badminton Singles (Male & Female)', fee: 1200, category: 'Sports' },
  { name: 'Badminton Doubles (Male & Female)', fee: 2000, category: 'Sports' },
  { name: 'Table Tennis Singles (Male & Female)', fee: 1000, category: 'Sports' },
  { name: 'Table Tennis Doubles (Male)', fee: 1200, category: 'Sports' },
  { name: 'Table Tennis (Mixed)', fee: 1500, category: 'Sports' },
  { name: 'Padel (Doubles)', fee: 15000, category: 'Sports' },

  // Esports
  { name: 'PUBG', fee: 1000, category: 'Esports' },
  { name: 'CS2', fee: 2000, category: 'Esports' },
  { name: 'Valorant', fee: 2000, category: 'Esports' },
  { name: 'Tekken', fee: 900, category: 'Esports' },
  { name: 'FIFA/FC 26', fee: 900, category: 'Esports' },
];

function SportsPage() {
  const categories = [...new Set(sportsData.map(sport => sport.category))];

  return (
    <div className="sports-page">

      {categories.map(category => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="sports-list">
            {sportsData.filter(sport => sport.category === category).map((sport, index) => (
              <div key={index} className="sport-item">
                <span className="sport-name">{sport.name}</span>
                <div className="sport-fee">
                  {sport.discountedFee ? (
                    <>
                      <span className="original-fee" style={{ textDecoration: 'line-through', color: 'red' }}>
                        Fee: {sport.fee} PKR
                      </span>
                      <div className="discounted-fee">New Fee: {sport.discountedFee} PKR</div>
                    </>
                  ) : (
                    <div>Fee: {sport.fee} PKR</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SportsPage;
