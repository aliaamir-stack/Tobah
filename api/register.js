import { appendToSheet } from './utils/googleSheets.js';
import { sendConfirmationEmail } from './utils/email.js';

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ message: 'OK' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { teamName, sportName, contactPerson, players, paymentScreenshot } = req.body;

        // Validate required fields
        if (!teamName || !sportName || !contactPerson || !players || players.length < 1) {
            return res.status(400).json({
                message: 'Missing required fields: teamName, sportName, contactPerson, and players are required'
            });
        }

        // Parse contact person if it's a string
        const contact = typeof contactPerson === 'string' ? JSON.parse(contactPerson) : contactPerson;
        const playersList = typeof players === 'string' ? JSON.parse(players) : players;

        // Validate contact person fields
        if (!contact.name || !contact.email || !contact.cnic || !contact.phone) {
            return res.status(400).json({
                message: 'Contact person must have name, email, cnic, and phone'
            });
        }

        // Get fee from sport name (basic lookup - in production you'd want a database)
        const sportsFees = {
            'Futsal Boys': 8000,
            'Futsal Girls': 6000,
            'Indoor Cricket': 6000,
            'Basketball Boys': 7000,
            'Basketball Girls': 7000,
            'Volleyball': 6500,
            'Throwball': 5000,
            'Badminton Singles Boy': 1200,
            'Badminton Singles Girl': 1200,
            'Badminton Doubles Boys': 2000,
            'Badminton Doubles Girls': 2000,
            'Table Tennis Singles Boy': 1000,
            'Table Tennis Singles Girl': 1000,
            'Table Tennis Doubles Boys': 1200,
            'Table Tennis Mixed': 1500,
            'Padel Doubles': 15000,
            'CS2': 2000,
            'Valorant': 2000,
            'PUBG': 1000,
            'Tekken': 900,
            'FIFA': 900,
        };

        const cleanSportName = sportName.replace(/\s*\([^)]*\)/, '').trim();
        const fee = sportsFees[cleanSportName] || 0;

        // Prepare row data for Google Sheets
        const timestamp = new Date().toISOString();
        const playersInfo = playersList.map(p => `${p.name} (${p.cnic})`).join('; ');

        const rowData = [
            timestamp,
            teamName,
            cleanSportName,
            fee,
            contact.name,
            contact.email,
            contact.phone,
            contact.cnic,
            playersList.length,
            playersInfo,
            paymentScreenshot ? 'Yes' : 'No',
            'Pending Review'
        ];

        // Append to Google Sheets
        const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
        if (spreadsheetId) {
            try {
                await appendToSheet(spreadsheetId, 'Registrations!A:L', rowData);
                console.log('Data appended to Google Sheets');
            } catch (sheetError) {
                console.error('Google Sheets error:', sheetError);
                // Continue anyway - don't fail the registration
            }
        }

        // Send confirmation email
        if (process.env.RESEND_API_KEY) {
            try {
                await sendConfirmationEmail(
                    contact.email,
                    teamName,
                    cleanSportName,
                    fee,
                    playersList
                );
                console.log('Confirmation email sent');
            } catch (emailError) {
                console.error('Email error:', emailError);
                // Continue anyway - don't fail the registration
            }
        }

        return res.status(200).json({
            message: 'Registration successful! A confirmation email has been sent.',
            data: {
                teamName,
                sport: cleanSportName,
                fee,
                players: playersList.length
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            message: 'An error occurred during registration. Please try again.'
        });
    }
}

// Set CORS headers for all responses
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb', // For payment screenshot uploads
        },
    },
};
