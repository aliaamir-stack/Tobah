// Registration config: all sports, esports, and padel options with fees and player counts

export const CATEGORIES = {
  sports: {
    label: 'Sports',
    sports: [
      { name: 'Futsal (Male)', fee: 8000, mandatory: 5, maxSubs: 3, labels: null },
      { name: 'Futsal (Female)', fee: 6000, mandatory: 5, maxSubs: 3, labels: null },
      { name: 'Indoor Cricket', fee: 6000, mandatory: 11, maxSubs: 4, labels: null },
      { name: 'Basketball (Male)', fee: 7000, mandatory: 5, maxSubs: 3, labels: null },
      { name: 'Basketball (Female)', fee: 7000, mandatory: 5, maxSubs: 3, labels: null },
      { name: 'Volleyball', fee: 6500, mandatory: 6, maxSubs: 3, labels: null },
      { name: 'Throwball', fee: 5000, mandatory: 7, maxSubs: 3, labels: null },
      { name: 'Badminton Singles (Male)', fee: 1200, mandatory: 1, maxSubs: 0, captainOnly: true, labels: null },
      { name: 'Badminton Singles (Female)', fee: 1200, mandatory: 1, maxSubs: 0, captainOnly: true, labels: null },
      { name: 'Badminton Doubles (Male)', fee: 2000, mandatory: 2, maxSubs: 1, labels: null },
      { name: 'Badminton Doubles (Female)', fee: 2000, mandatory: 2, maxSubs: 1, labels: null },
      { name: 'Table Tennis Singles (Male)', fee: 1000, mandatory: 1, maxSubs: 0, captainOnly: true, labels: null },
      { name: 'Table Tennis Singles (Female)', fee: 1000, mandatory: 1, maxSubs: 0, captainOnly: true, labels: null },
      { name: 'Table Tennis Doubles (Male)', fee: 1200, mandatory: 2, maxSubs: 1, labels: null },
      { name: 'Table Tennis Mixed', fee: 1500, mandatory: 2, maxSubs: 1, labels: ['Player 1 (Male)', 'Player 2 (Female)'] },
    ],
  },
  esports: {
    label: 'Esports',
    sports: [
      { name: 'PUBG', fee: 1000, mandatory: 4, maxSubs: 1, labels: null },
      { name: 'CS2', fee: 2000, mandatory: 5, maxSubs: 1, labels: null },
      { name: 'Valorant', fee: 2000, mandatory: 5, maxSubs: 1, labels: null },
      { name: 'Tekken', fee: 900, mandatory: 1, maxSubs: 0, captainOnly: true, labels: null },
      { name: 'FIFA/FC 26', fee: 900, mandatory: 1, maxSubs: 0, captainOnly: true, labels: null },
    ],
  },
  padel: {
    label: 'Padel',
    sports: [
      { name: 'Padel Doubles', fee: 15000, mandatory: 2, maxSubs: 1, labels: null },
    ],
  },
};
