import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

//Create an express app and set the port number.
const app = express();
const port = 3000;

//Use the public folder for static files.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

//URL endpoints
const geoCodeEndpoint = "http://api.openweathermap.org/geo/1.0/direct";
const openUVEndpoint = "https://api.openuv.io/api/v1/uv";
const geoCodeAPIKey = "cf919e247b5f2c10fd9c7a79f0a3fa10";
const openUVAPIKey = "openuv-4wp9mrlm0e63xe-io";

//When the user goes to the home page it should render the index.ejs file.
app.get("/", (req, res) => {
    res.render("index.ejs")
});

app.post("/submit", async (req, res) => {
    try
    {
        var queryParams = `?q=${req.body.inputCity}&appid=${geoCodeAPIKey}`;
        const response = await axios.get(geoCodeEndpoint + queryParams);
        const result = response.data;
        var lat = result[0].lat;
        var lng = result[0].lon;
    } catch (error) {
        console.log(`Got an error from openweathermap: ${error.message}`);
    }

    try {
        const config = {headers: {"x-access-token": openUVAPIKey}};
        const queryParams = `?lat=${lat}&lng=${lng}`
        const response = await axios.get(openUVEndpoint + queryParams, config);
        res.render("index.ejs", {
            city: req.body.inputCity,
            uvdata: response.data.result});
    } catch (error) {
        console.log(`Got an error from openUV: ${error.message}`);
    }

})

//Listen on your predefined port and start the server.
app.listen(port, () => {
    console.log(`Server now listening on port: ${port}`);
})
