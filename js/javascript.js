var map;

//Array of points of interest locations that will be listed on the map
var POIlist = [
  {
    title: 'Parliament of Canada',
    description: '<a target="_BLANK" href="http://www.parl.gc.ca/" target="_blank">www.parl.gc.ca</a>',
    id: "poi0",
    lat: 45.423594, 
    lng: -75.700929
  },
  {
    title: 'National Arts Centre',
    description: '<a target="_BLANK" href="http://nac-cna.ca/en/" target="_blank">nac-cna.ca</a>',
    id: "poi1",
    lat: 45.423263,
    lng: -75.693275 
  },
  {
    title: 'Byward Market',
    description: '<a target="_BLANK" href="http://www.byward-market.com/" target="_blank">www.byward-market.com</a>',
    id: "poi2",
    lat: 45.428866,
    lng: -75.691159
  },
  {
    title: 'Canada Aviation and Space Museum',
    description: '<a target="_BLANK" href="http://www.casmuseum.techno-science.ca/" target="_blank">www.casmuseum.techno-science.ca </a>',
    id: "poi3",
    lat: 45.421530,
    lng: -75.697193
  },
  {
    title: 'Rideau Centre',
    description: '<a target="_BLANK" href="https://www.cfshops.com/rideau-centre.html" target="_blank">www.cfshops.com/rideau-centre.html</a>',
    id: "poi4",
    lat: 45.425098,
    lng: -75.691250
  },
];

//Defines the PointOfInterest class with title, description, and location.
class PointOfInterest {
  constructor(poi) {
    this.title = poi.title;
    this.description = poi.description;
    this.id = poi.id;
    this.wikilink = ko.observable(poi.wikilink);
    this.wikisummary = ko.observable(poi.wikisummary);
    this.location = new Location(poi.lat, poi.lng);
  }
}

//Defines the Location class with latitude and longitude.
class Location {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}

class NeighborhoodMap {
  constructor(pointsOfInterest) {
    this.pointsOfInterest = pointsOfInterest;
    this.pointsOfInterest.subscribe(this.onChange, this, "arrayChange");

    this._map = new google.maps.Map(
      document.getElementById('map'), 
      {
        center: {lat: 45.4256, lng: -75.6953},
        zoom: 16
      }
    );
    console.log(this._map);
//    this._map.setPadding(250, 0, 0, 0);
  }

  onChange(events) {
    var pointsOfInterest = events.map(function(event) { return event.value });
    
    for (var pointOfInterest of pointsOfInterest) {
      this.renderPOIMarker(pointOfInterest)
    }
  }
  
  renderPOIMarker(pointOfInterest) {
    new POIMarker(this._map, pointOfInterest);
  }
}


//Defines the POIMarker class with map and pointOfInterest
class POIMarker {
  constructor(map, pointOfInterest){
    this.pointOfInterest = pointOfInterest;
    this.defaultIcon = this._makeMarkerIcon('0091ff');
    this.highlightedIcon = this._makeMarkerIcon('FFFF24');
    this._map = map;
    this._marker = this._makeMarker();
    this.pointOfInterest.marker = this._marker;
  }
  
  onClick() {
    var that = this;
    window.dispatchEvent(new Event('hideAllInfoWindows'));
    this._marker.setIcon(this.highlightedIcon);
    
    console.log("Fetching things from Wikipedia...");
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + encodeURIComponent(that.pointOfInterest.title),
      dataType: "jsonp",
      success: function(response) {
        that.pointOfInterest.wikisummary(response[2][0]);
        that.pointOfInterest.wikilink(response[3][0]);

        that._populateInfoWindow();
        that._map.setZoom(16);
        that._map.setCenter( that.pointOfInterest.location );
      },
      error: function(){
        that.pointOfInterest.wikisummary("");
        that.pointOfInterest.wikilink("#");
        alert("Uh Oh! Couldn't fetch extra info from Wikipedia. If this keeps happening, please contact the author.");
        
        that._populateInfoWindow();
        that._map.setZoom(16);
        that._map.setCenter( that.pointOfInterest.location );
      }
    });
    
  }
  
  hideInfoWindow() { 
    if(this.infoWindow != null){
      this.infoWindow.close();
      this._marker.setIcon(this.defaultIcon);
    }
  }
  
  _makeMarker() {
    var marker = new google.maps.Marker({
      map: this._map,
      position: this.pointOfInterest.location,
      animation: google.maps.Animation.DROP,
      icon: this.defaultIcon
    });
    
    marker.addListener('click', this.onClick.bind(this));
    window.addEventListener('hideAllInfoWindows', this.hideInfoWindow.bind(this));

    return marker;
  }

  _makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+markerColor+'|40|_|%E2%80%A2',
      new google.maps.Size(21,34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34)
    );

    return markerImage;
  }
  
  _populateInfoWindow(marker) {
    var that = this;
    var infoWindow = new google.maps.InfoWindow();
    // Check to make sure the infowindow is not already opened on this marker.
    infoWindow.marker = this._marker;
    
    var wikiInfo = "";
    
    if(this.pointOfInterest.wikilink() != "#"){
      wikiInfo = '<div>Wikipedia:</div>' +
                 '<div>' + this.pointOfInterest.wikisummary() + '</div>' +
                 '<div><a target="_BLANK" href="' + this.pointOfInterest.wikilink() + '">Read more on wikipedia</a></div>';
    }
    
    infoWindow.setContent(
      '<div>' + this.pointOfInterest.title + '</div>' + 
      '<div>' + this.pointOfInterest.description + '</div><br/.' +
      wikiInfo
    );
    infoWindow.open(this._map, this._marker);
    this.infoWindow = infoWindow;
    
    google.maps.event.addListener(infoWindow, 'closeclick', function() {
        that.hideInfoWindow();
    });
  }
}

class Application {
  constructor() {
    var that = this;
    this.pointsOfInterest = ko.observableArray([]);
    this.currentFilter = ko.observable();
    this.map = null;  
  }

  addPointOfInterest(pointOfInterest) {
    this.pointsOfInterest.push(pointOfInterest);
  }
  
  initialize() {
    var that = this;
    this.map = new NeighborhoodMap(this.pointsOfInterest);
    POIlist.forEach(function(poi){
      that.addPointOfInterest(new PointOfInterest(poi));
    });
    
    this.filterPOIs = ko.computed(function () {
        if (!that.currentFilter()) {
          ko.utils.arrayFilter(that.pointsOfInterest(), function (poi) {
            poi.marker.setMap(that.map._map);
          });
          
          // Return the full list of POIs
          return that.pointsOfInterest();
        } else {
          // Return only a list of POIs that match the search term
          return ko.utils.arrayFilter(that.pointsOfInterest(), function (poi) {
            if(poi.title.toLowerCase().indexOf(that.currentFilter()) >= 0){
              poi.marker.setMap(that.map._map);
              return true;
            } else {
              poi.marker.setMap(null);
              return false;
            }
          });
        }
    });

    this.filter = function (query) {
      this.currentFilter(query.toLowerCase());
    }

    this.applyFilter = function (data,event){
      this.filter(event.target.value);
    }

    this.onPOIListClick = function(data, event){
      ko.utils.arrayFilter(that.pointsOfInterest(), function (poi) {
        if( poi.id.indexOf(data.id) >= 0 ){
          google.maps.event.trigger(poi.marker, 'click');
        }
        
      });
    }
    
    ko.applyBindings(this);
    
//    this.fetchWikiLinks();
    
  }
}



var app = new Application();


$(document).ready(function(){
  $(".toggleList").click(function(){
    $("#list").toggleClass("hideList");
  });
});

// Google Maps Error Handling Function
var googleMapsError = function(){
  alert("Uh Oh! Google Maps failed to load. If this keeps happening, please contact the author.");
}