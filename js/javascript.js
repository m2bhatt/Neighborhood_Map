/* Main js file for the Neighborhood Map.
Gets the Google Map */
var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4215, lng: -75.6972},
    zoom: 15
  });
}

var initialStops = [
  {
    stop_num: '7688',
    stop_name: 'Bank / Slater',
    stop_lat: '45.419109',
    stop_lon: '-75.699486'
  },
  {
    stop_num: '3006',
    stop_name: 'Slater / Kent',
    stop_lat: '45.4179',
    stop_lon: '-75.70282'
  },
  {
    stop_num: '7694',
    stop_name: 'Bank/Slater',
    stop_lat: '45.419109',
    stop_lon: '-75.699486'
  },
  {
    stop_num: '7688',
    stop_name: 'Bank/Slater',
    stop_lat: '45.419109',
    stop_lon: '-75.699486'
  },
  {
    stop_num: '7688',
    stop_name: 'Bank/Slater',
    stop_lat: '45.419109',
    stop_lon: '-75.699486'
  }
]

var currentStop = function(data){
  this.stop_num = ko.observable(data.stop_num);
  this.stop_name = ko.observable(data.stop_name);
  this.stop_lat = ko.observable(data.stop_lat);
  this.stop_lon = ko.observable(data.stop_lon);
}
/* VIEW MODEL */

// Make stops show up in a list in HTML
function stopViewModel () {
  var self = this;

  this.stopList = ko.observableArray([]);

  initialStops.forEach(function(stopItem){
    self.stopList.push(new currentStop(stopItem));
  });

  this.currentStop = ko.observable(this.stopList()[0]);

  };

ko.applyBindings(new stopViewModel());
