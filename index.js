// api/index.js
const axios = require('axios');

module.exports = async (req, res) => {
    // 1. CORS Headers set karein taaki aap isay kahin se bhi call kar sakein
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Browser ke pre-flight check (OPTIONS request) ko handle karna
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. User se number lena (Query parameter se)
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide a number parameter. Example: ?number=03001234567" 
        });
    }

    // 3. Original API se data fetch karna
    const targetUrl = `https://shadowscriptz.xyz/public_apis/simdetailsapi.php?number=${number}`;

    try {
        const response = await axios.get(targetUrl);
        
        // 4. Data wapas user ko bhejna
        return res.status(200).json(response.data);

    } catch (error) {
        // Agar original API down hai ya koi error aaya
        console.error("API Error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch data from source.",
            error: error.message
        });
    }
};
