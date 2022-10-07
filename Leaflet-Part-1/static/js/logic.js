//define url for later use
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//testing d3 data output with console
d3.json(url).then((data) => {
    map_data = data
    console.log(map_data);
});

//create a map that plots all the earthquakes from your dataset based on lat/lng
function buildMap(data) {
    //create map object with initial parameters
    var myMap = L.map("map", {
        center: [38.8283, -98.5795],
        zoom: 4   
    });

    //create the tile street layer that will be the background of map and add
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

        
    //Create a legend that will provide context for your map data
    //activity 4, day 2 has similar set up for legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var labels = [];
        var legendInfo = "<h4>Magnitude</h4>";

        div.innerHTML = legendInfo;

        // loop through depth intervals
        for (let i = 0; i < depths.length; i++) {
            labels.push('<li style="background-color:' + changeColor(depths[i] + 1) + '"> <span>' 
            + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '' : '+') + '</span></li>');
        }

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        
        return div;
        
    };

    //add legend to map
    legend.addTo(myMap);

    // Make popup for place, magnitude, and date of the earthquakes
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2> Location: " + feature.properties.place +
            //new Date works for date formats 
            //found with https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
            "</h2><hr><p>" + "<h3> Date: " + new Date(feature.properties.time) + "</p>" + "<br><h3> Magnitude: " + feature.properties.mag + "</h3>");
    };

    //add all marker info using oneachfeature created and change size and color
    L.geoJSON(data, {
        onEachFeature: onEachFeature,
        //pointtolayer creates circle markers
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: changeSize(feature.properties.mag),
                fillColor: changeColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9
            });
        }
    }).addTo(myMap);

};

//define ranges of magnitude depth
var depths = [1.0, 2.0, 4.0, 5.0, 8.0];

//data markers should reflect the magnitude of the earthquake by their size (radius): make function
function changeSize(depth) {
    return depth * 4;
}

//data markers reflect depth of the earthquake by color, higher depth = darker
function changeColor(depth) {
    if (depth <= depths[0]) {
        return "#FFEC19"
    }
    else if (depth <= depths[1]) {
        return "#FFC100"
    }
    else if (depth <= depths[2]) {
        return "#FF9800"
    }
    else if (depth <= depths[3]) {
        return "#FF5607"
    }
    else if (depth <= depths[4]) {
        return "#F6412D"
    }
    else {
        return "#8B0000"
    }
};
 
//official request to pull data from USGS to build map and features
d3.json(url).then((data) => {
    buildMap(data.features);
});