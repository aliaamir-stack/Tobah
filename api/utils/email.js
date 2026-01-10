import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendConfirmationEmail = async (to, teamName, sportName, fee, players) => {
  try {
    const playersList = players
      .map((p, i) => `  ${i + 1}. ${p.name} (CNIC: ${p.cnic})`)
      .join('\n');

    const response = await resend.emails.send({
      from: 'Sportics <noreply@sportics.com>',
      to: [to],
      subject: `Registration Confirmed - ${sportName} | FAST Olympiad 2025`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'League Spartan', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #420212, #6b0f24); color: white; padding: 30px; text-align: center; }
            .header img { max-width: 120px; margin-bottom: 15px; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .info-card { background-color: #f9f9f9; border-left: 4px solid #f3a93e; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .info-card h3 { margin: 0 0 10px 0; color: #420212; }
            .info-card p { margin: 5px 0; color: #555; }
            .fee-badge { display: inline-block; background-color: #f3a93e; color: #420212; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 18px; }
            .footer { background-color: #420212; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .footer a { color: #f3a93e; text-decoration: none; }
            .players-list { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 10px; }
            .player-item { padding: 8px 0; border-bottom: 1px solid #ddd; }
            .player-item:last-child { border-bottom: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 FAST Olympiad 2025</h1>
              <p>Registration Confirmed!</p>
            </div>
            <div class="content">
              <p>Dear <strong>${players[0]?.name || 'Participant'}</strong>,</p>
              <p>Congratulations! Your team has been successfully registered for FAST Olympiad 2025.</p>
              
              <div class="info-card">
                <h3>📋 Registration Details</h3>
                <p><strong>Team Name:</strong> ${teamName}</p>
                <p><strong>Sport:</strong> ${sportName}</p>
                <p><strong>Registration Fee:</strong> <span class="fee-badge">PKR ${fee}</span></p>
              </div>
              
              <div class="info-card">
                <h3>👥 Team Members</h3>
                <div class="players-list">
                  ${players.map((p, i) => `
                    <div class="player-item">
                      <strong>Player ${i + 1}:</strong> ${p.name}<br>
                      <small>CNIC: ${p.cnic} | Age: ${p.age}</small>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <p>📅 Event Dates: <strong>February 2-6, 2026</strong></p>
              <p>📍 Venue: FAST University, Karachi</p>
              
              <p>Please keep this email for your records. For any queries, contact us at our official channels.</p>
              
              <p>Best of luck! 🎉</p>
            </div>
            <div class="footer">
              <p>FAST Olympiad 2025 - Sportics Society</p>
              <p><a href="https://sportics.nuces.edu.pk">sportics.nuces.edu.pk</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
FAST Olympiad 2025 - Registration Confirmed

Dear ${players[0]?.name || 'Participant'},

Your team has been successfully registered!

Team: ${teamName}
Sport: ${sportName}
Fee: PKR ${fee}

Players:
${playersList}

Event Dates: February 3-7, 2025
Venue: FAST University, Karachi

Best of luck!
Sportics Society
      `,
    });

    return response;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};

export default { sendConfirmationEmail };
