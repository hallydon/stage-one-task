const express = require('express');
const app = express();
const axios = require('axios');

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    
    let location = 'Unknown';
    let temperature = 'Unknown';
    try {
        const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        location = locationResponse.data.city || 'Unknown';
    
        // const locationResponse = await axios.get(`http://ipinfo.io/${clientIp}/json?token=e05d8cafc359e3`);
        // location = locationResponse.data.city || 'Unknown';

        if (location !== 'Unknown') {
            const apiKey = process.env.WEATHER_API_KEY || 'c581371dfbe5dc70c0fa3e48da2ff3be';
            const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
            temperature = weatherResponse.data.current.temp_c || 'Unknown';
            // const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=c581371dfbe5dc70c0fa3e48da2ff3be`);
            // temperature = weatherResponse.data.main.temp || 'Unknown';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        
    }

    res.json({
        client_ip: clientIp,
        location: location,
        greeting:`Hello, ${visitorName}!, the temperature is ${temperature} degrees celsius in ${location}`
    });
});

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});