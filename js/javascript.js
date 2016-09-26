var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.4215, lng: -75.6972},
    zoom: 15
  });
}


/* VIEW MODEL */

var ViewModel = function (){
  this.stop_id = ko.observable();
  this.stop_num = ko.observable();
  this.stop_name = ko.observable();
  this.stop_lat = ko.observable();
  this.stop_lon = ko.observable();
}

ko.applyBindings(new ViewModel())
