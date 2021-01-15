// Creating map object
const myMap = L.map("map", {
    center: [39.32, -111.09],
    zoom: 6
});

// Adding tile layer
const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


// Connect to data
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab data with d3
d3.json(URL, function (data) {
    let earthquakes = data.features;
    
    // Create color scale
    let color = {
        level1: "#f4ccdc",
        level2: "#e06697",
        level3: "#b70049",
        level4: "#8e0039",
        level5: "#510020",
        level6: "#140008"
    }

    // Apply color scale
    for (var i = 0; i < earthquakes.length; i++) {
        let latitude = earthquakes[i].geometry.coordinates[1];
        let longitude = earthquakes[i].geometry.coordinates[0];
        let magnitude = earthquakes[i].properties.mag;
        var fillColor;
        if (magnitude > 6) {
            fillColor = color.level6;
        } else if (magnitude > 5) {
            fillColor = color.level5;
        } else if (magnitude > 4) {
            fillColor = color.level4;
        } else if (magnitude > 3) {
            fillColor = color.level3;
        } else if (magnitude > 2) {
            fillColor = color.level2;
        } else {
            fillColor = color.level1;
        } 

        // Create size scale
        var epicenter = L.circleMarker([latitude, longitude], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: fillColor,
            fillOpacity: 1,
            weight: 1
        });
        epicenter.addTo(myMap);


        
        // Create popups
        epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

    }

    // Create legend
    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);
})