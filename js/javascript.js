/* Main js file for the Neighborhood Map.
Gets the Google Map */
var map;

var markers = [];

function initMap() {
  // Constructor creates a new map
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

//Array of locations listed on the map
var locations = [
  {title: 'Parliament of Canada', description: '<a href="http://www.parl.gc.ca/" target="_blank">http://www.parl.gc.ca/</a>', location: {lat: 45.423594, lng: -75.700929}},
  {title: 'National Arts Centre', description: '<a href="http://nac-cna.ca/en/" target="_blank">http://nac-cna.ca/en/</a>', location: {lat: 45.423263, lng: -75.693275}},
  {title: 'Byward Market', description:  '<a href="http://www.byward-market.com/" target="_blank">http://www.byward-market.com/</a>', location: {lat: 45.428866, lng: -75.691159}},
  {title: 'Canadian Aviation and Space Museum', description: '<a href="http://www.casmuseum.techno-science.ca/" target="_blank">http://www.casmuseum.techno-science.ca/</a>', location: {lat:45.421530, lng: -75.697193}},
  {title: 'Rideau Centre', description: '<a href="https://www.cfshops.com/rideau-centre.html" target="_blank">https://www.cfshops.com/rideau-centre.html</a>', location: {lat:45.425098, lng:-75.691250}}
];

var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

//Change initial marker's colour
var defaultIcon = makeMarkerIcon('0091ff');
//Change clicked marker's colour
var highlightedIcon = makeMarkerIcon('FFFF24');

var largeInfowindow = new google.maps.InfoWindow();
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
    icon: defaultIcon,
    id: i,
  });

  markers.push(marker);
  marker.addListener('click', function(){
    populateInfoWindow(this, largeInfowindow);
  });
  marker.addListener('click', function(){ //changes marker's colour when clicked
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function(){ //cahnges marker's colour to default once the mouse isn't on the marker
    this.setIcon(defaultIcon);
  });
  bounds.extend(markers[i].position);
}
map.fitBounds(bounds);
}

//Adds info to the info Window for locations
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

    //Get the marker and changes colour
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21,34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
          return markerImage;

      }

function AppViewModel(){
  this.stopNum = ko.observable("9089");
  this.stopName = ko.observable("queen");
}

/* var Stop = function(data){
  this.stopNum = ko.observable(data.stopNum);
  this.stopName = ko.observable(data.stopName);
  this.stopLat = ko.observable(data.stopLat);
  this.stopLon = ko.observable(data.stopLon);
};
/* VIEW MODEL

// Make stops show up in a list in HTML
var ViewModel = function() {
  var self = this;

  this.stopList = ko.observableArray([]);

  initialStops.forEach(function(stopItem){
    self.stopList.push(new Stop(stopItem));
  });

  this.currentStop = ko.observable(this.stopList()[0]);

}; */

ko.applyBindings(new AppViewModel());
