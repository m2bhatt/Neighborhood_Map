/* Main js file for the Neighborhood Map.
Gets the Google Map */
var map;

var markers = [];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4215, lng: -75.6972},
    zoom: 16
  });
  /* var tribeca = {lat: 45.419109, lng: -75.699486};
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'Bank /Slater'
  });
  var infoWindow = new google.maps.InfoWindow({
    content: 'Routes 1: Ottawa-Rockcliffe'
  });
  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  }); */


var locations = [
  {title: 'Bank / Slater', description: 'Route 1 (Ottawa-Rockcliffe) <br> Route 2 (Downtown) <br> Route 7 (St-Laurent)', location: {lat: 45.419109, lng: -75.699486}},
  {title: 'Slater / Kent', description: 'Route 97: (Airport)', location: {lat: 45.4179, lng: -75.70282}},
  {title: 'Wellington / Metacalfe (Parliament)', description:  'Route 1 (Ottawa-Rockcliffe) <br> Route 2 (Downtown) <br> Route 7 (St-Laurent)', location: {lat: 45.423405, lng: -75.698051}},
  {title: 'Queen / Bank', description: 'Route 4 (Rideau) <br> Route 9 (Hurdman) <br> Route 12 (Blair)', location: {lat:45.420593, lng: -75.700485}},
  {title: 'Queen / Metcalfe', description: 'Route 4 (Rideau) <br> Route 9 (Hurdman) <br> Route 12 (Blair)', location: {lat:45.421982, lng:-75.697273}}
];

var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

//The following group uses the location array to create an array of markers on intialize.
for (var i = 0; i < locations.length; i++) {
  var position = locations[i].location;
  var title = locations[i].title;
  var description = locations[i].description;
  var marker = new google.maps.Marker({
    map: map,
    position: position,
    title: title,
    description: description,
    animation: google.maps.Animation.DROP,
    id: i
  });

  markers.push(marker);

  marker.addListener('click', function(){
    populateInfoWindow(this, largeInfowindow);
  });
  bounds.extend(markers[i].position);
}
map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.description + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker(null);
          });
        }
      }

var initialStops = [
  {
    stopNum: '7688',
    stopName: 'Bank / Slater',
    stopLat: '45.419109',
    stopLon: '-75.699486'
  },
  {
    stopNum: '3006',
    stopName: 'Slater / Kent',
    stopLat: '45.4179',
    stopLon: '-75.70282'
  },
  {
    stopNum: '7694',
    stopName: 'Wellington / Metacalfe (Parliament)',
    stopLat: '45.423405',
    stopLon: '-75.698051'
  },
  {
    stopNum: '7561',
    stopName: 'Queen / Bank',
    stopLat: '45.420593',
    stopLon: '-75.700485'
  },
  {
    stopNum: '1512',
    stopName: 'Queen / Metcalfe',
    stopLat: '45.421982',
    stopLon: '-75.697273'
  }
];

var Stop = function(data){
  this.stopNum = ko.observable(data.stopNum);
  this.stopName = ko.observable(data.stopName);
  this.stopLat = ko.observable(data.stopLat);
  this.stopLon = ko.observable(data.stopLon);
};
/* VIEW MODEL */

// Make stops show up in a list in HTML
var ViewModel = function() {
  var self = this;

  this.stopList = ko.observableArray([]);

  initialStops.forEach(function(stopItem){
    self.stopList.push(new Stop(stopItem));
  });

  this.currentStop = ko.observable(this.stopList()[0]);

  };

ko.applyBindings(new ViewModel());
