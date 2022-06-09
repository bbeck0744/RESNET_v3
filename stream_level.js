console.log("connection working");

// Define variables for our base layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// satellite map background tile layer
var satellitemap =  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	maxZoom: 18,
	ext: 'png'
});

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	maxZoom: 18,
	ext: 'png'
});

// Initialize all of the LayerGroups to be used
var layers = {
  CREEK_SITES: new L.LayerGroup(),
  BOUNDARIES: new L.LayerGroup()
};

// Create the map with layers
var map = L.map("map", {
  center: [44.933457, -93.502959],
  zoom: 10.7,
  layers: [
    layers.CREEK_SITES,
    layers.BOUNDARIES
  ]
});

// Add 'darkmap' tile layer to the map as default
darkmap.addTo(map);


// Create an overlay object
var overlayMaps = {
  "Stream Level": layers.CREEK_SITES,
  "Subwatersheds_test": layers.BOUNDARIES
  
};

var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Black and White": Stamen_TonerBackground,
  "Watercolor Map": Stamen_Watercolor
};


L.control.layers(baseMaps, overlayMaps).addTo(map);

// =================================================================================================
// WATERSHED BOUNDARIES LAYER
// =================================================================================================

// use var 'watershed' from 'watersheds.js' to import into leaflet geoJSON object
var watershedJson = L.geoJSON(watershed, {

  fillColor: 'lightblue',
  weight: 1.5,
  
  // highlight subwatershed in red for mouseover
  onEachFeature: function(feature, layer) {

    layer.on("mouseover", function(item) {
      layer.setStyle({fillColor: 'orange'})
    })
    .on("mouseout", function(item) {
      layer.setStyle({fillColor: 'lightblue'})
    });
  }
});

watershedJson.addTo(layers.BOUNDARIES);

// =================================================================================================
// Script to create graph and monitoring locations
// =================================================================================================
var sites = [{
  names: "CLA01",
  location: [44.9318, -93.6693],
  subwatershed: "Langdon",
  ts_id: "5182010"
}
,

{
  names: "CMH01",
  location: [44.9412, -93.4551],
  subwatershed: "Minnehaha Creek",
  ts_id: "5009010"
}
,
{
  names: "CMH04",
  location: [44.901323, -93.332248],
  subwatershed: "Minnehaha Creek",
  ts_id: "5088010"
},
{
  names: "CMH02",
  location: [44.9427, -93.3935],
  subwatershed: "Minnehaha Creek",
  ts_id: "5013010"
},
{
  names: "CMH03Up",
  location: [44.91235, -93.34251],
  subwatershed: "Minnehaha Creek",
  ts_id: "5084010"
},
{
  names: "CDU01",
  location: [44.95005, -93.66518],
  subwatershed: "Dutch",
  ts_id: "5080010"
},
{
  names: "CGL01",
  location: [44.97818, -93.49565],
  subwatershed: "Gleason",
  ts_id: "5039010"
},
{
  names: "LNK01",
  location: [44.908743, -93.241776],
  subwatershed: "Minnehaha Creek",
  ts_id: "5091010"
},
{
  names: "CVI01",
  location: [44.8846810, -93.62644000],
  subwatershed: "Virginia",
  ts_id: "5287010"
},
{
  names: "CMH24",
  location: [44.915574, -93.242167],
  subwatershed: "Minnehaha Creek",
  ts_id: "4145010"
}
];

function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

var url =
`http://gis.minnehahacreek.org/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=json&metadata=true&period=complete&ts_id=`;

console.log(sites);


  function circleClick(e) {
    const name = e.sourceTarget.options.name;
    document.getElementById('name').innerHTML = name;
    updateSite(name);
    
  }

  for (let i = 0; i < sites.length; i++) {
    L.circle(sites[i].location, 200, {
      name: sites[i].names, 
      fillOpacity: 0.8,
      color: "orange",
      fillColor: "blue",
      weight: 1.5
    }).addTo(layers.CREEK_SITES)
  .bindPopup("<p> Site: " + sites[i].names + "</p>")
  .on("click", circleClick)
  .on("mouseover", function() {
    this.setStyle({color: "orange", fillColor: 'blue', weight: 3})
    })
  .on("mouseout", function() {
    this.setStyle({color: "orange", fillColor: 'blue', weight: 1.5})
  });
};


// function getSiteData(site) {
//   result = sites.filter(obj => site.includes(obj.names));
//   // console.log(site);
//   timeseries_id = result[0].ts_id;
//   var query_url = url + timeseries_id
//   console.log(query_url);
//     d3.json(url).then(function(data) {
    
//     // Grab values from the data json object to build the plots
//     var dates = unpack(data[0].data, 0);
//     var flow = unpack(data[0].data, 1);
//     var start_date = dates[0]
//     var end_date = dates[dates.length - 1]
//     console.log(start_date);
//     console.log(end_date);
//     console.log(dates);
//     console.log(flow);
//     });  
// }

function setBubblePlot(site) {
  
  result = sites.filter(obj => site.includes(obj.names));
  timeseries_id = result[0].ts_id;
  var query_url = url + timeseries_id;


  d3.json(query_url).then(function(data) {
    
    // Grab values from the data json object to build the plots
    var dates = unpack(data[0].data, 0);
    var flow = unpack(data[0].data, 1);
    var start_date = dates[0]
    var end_date = dates[dates.length - 1]
    console.log(start_date);
    console.log(end_date);

    var trace1 = {
      x: dates,
      y: flow,
      mode: 'lines',
      marker: {
        size: 5, 
        opacity: 0.5
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Stream Elevation for <br>'+ site,
      xaxis: {
        autorange: true,
        range: [start_date, end_date],
        rangeselector: {buttons: [
            {
              count: 2,
              label: '2d',
              step: 'day',
              stepmode: 'backward'
            },
            {
              count: 1,
              label: '1m',
              step: 'month',
              stepmode: 'backward'
            },
            {
              count: 6,
              label: '6m',
              step: 'month',
              stepmode: 'backward'
            },
            {
            step: 'year',
            stepmode: 'backward',
            count: 1,
            label: '1y'
            }, 
            {step: 'all'}
          ]},
        rangeslider: {range: [start_date, end_date]},
        type: 'date'
      },
      yaxis: {
        autorange: true,
        type: 'linear',
        title: {
          text: 'Stream Elevation (feet)'
        }  
      }
    }
    var config = {responsive: true}

    Plotly.newPlot('plotdiv', data, layout, config, {showSendToCloud: true});
  });
};

function init() {
  var firstSite = "CMH02";
  setBubblePlot(firstSite)
};


function updateSite(site){
  setBubblePlot(site);
  //getSiteData(site);


}

init();

d3.select("#name").on("change", updateSite);