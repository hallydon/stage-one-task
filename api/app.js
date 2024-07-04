const express = require('express');
const app = express();
const axios = require('axios');

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    
    const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(clientIp);
    
    
    let location = 'Unknown';
    let temperature = 'Unknown';
    try {
        const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        location = locationResponse.data.city || 'Unknown';
        console.log(location);
    


        if (location !== 'Unknown') {
            const apiKey = process.env.WEATHER_API_KEY || 'c581371dfbe5dc70c0fa3e48da2ff3be';
            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
            console.log(weatherResponse);
            temperature = weatherResponse.data.main.temp || 'Unknown';
            
        
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
module.exports = app;