require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();



app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE_ID = process.env.OBJECT_TYPE_ID;


const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req,res) => {

    try {
        const customProperties = ['name', 'field_number', 'team', 'shooting_foot'];



        // Construct the API endpoint URL with the property query string
        const apiUrl = `https://api.hubspot.com/crm/v3/objects/${OBJECT_TYPE_ID}?properties=name,team,field_number,shooting_foot`;
            //API access token 
        const response = await axios.get(apiUrl, { headers });
        const data = response.data.results;
        console.log('CRM Record Data:', data);
        
        res.render('homepage', { title: 'Homepage | Integration With Hubspot', data: response.data });
        
    } catch (error) {
        console.error('Error retrieving records from HubSpot ', error.response.data);
        res.status(500).send('Error retrieving records from HubSpot. Please try again later');
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req,res) => {
    // Render the updates template
    res.render('updates',{ title: 'Update Soccer Players Form | Integrating With HubSpot I Practicum', layout: 'contacts' })
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-cobj', async(req, res) =>{

    // Extract form data submitted by the user
    const { name, field_number, team, shooting_foot } = req.body;

    // Prepare the data to be sent to HubSpot
    const PlayerObjectData = {
        properties: {
            name,
            field_number,
            team,
            shooting_foot
        }
    };

    //API endpoint 
    const apiUrl = `https://api.hubspot.com/crm/v3/objects/${OBJECT_TYPE_ID}`;


    try {
        // POST request to create a new record in HubSpot 
        await axios.post(apiUrl, PlayerObjectData, { headers });

        // Redirect back to the homepage after successful POST request
        res.redirect('/');

    } catch(error){

        console.error('Error creating record in HubSpot: ', error.response.data);
        res.status(500).send('Error creating record. Please try again later. ')
    }
});




// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));