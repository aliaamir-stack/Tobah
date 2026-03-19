const url = "https://script.google.com/macros/s/AKfycbysBHZgMhcvp-BNoRYF_HusibuzK_33_HjAhD6xgJfFdcEqX6eNJ9ks8UI7k2Hfgqg-rQ/exec";

async function testPost() {
  const payload = {
    category: "Esports",
    sport: "PUBG",
    teamType: "private",
    teamName: "Test",
    captainName: "Cap",
    captainPhone: "123",
    captainCnic: "123",
    player1Name: "P1",
    player1Cnic: "1",
    player1Phone: "1",
    registrationFee: 1000
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testPost();
