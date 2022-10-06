//define url for later use
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Testing d3 data output with console
d3.json(url).then((data) => {
    map_data = data
    console.log(map_data);
});