/* Main js file for the Neighborhood Map.
Gets the Google Map */
var map;
var markers = [];
//Array of locations listed on the map

class Location {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}

class PointOfInterest {
  constructor(title, description, location) {
    this.title = title;
    this.description = description;
    this.location = location;
  }
}

class NeighborhoodMarker {
  constructor(map, pointOfInterest){
    this.pointOfInterest = pointOfInterest;
    this.defaultIcon = this._makeMarkerIcon('0091ff');
    this.highlightedIcon = this._makeMarkerIcon('FFFF24');
    this._map = map;
    this._marker = this._makeMarker();
  }

  onClick() {
    this._marker.setIcon(this.highlightedIcon);
    this._populateInfoWindow();
  }

  onMouseOut() {
    this._marker.setIcon(this.defaultIcon);
  }

  _makeMarker() {
    var marker = new google.maps.Marker({
      map: this._map,
      position: this.pointOfInterest.location,
      animation: google.maps.Animation.DROP,
      icon: this.defaultIcon
    });

    marker.addListener('click', this.onClick.bind(this));
    marker.addListener('mouseout', this.onMouseOut.bind(this));

    return marker;
  }

  _makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21,34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34)
    );

    return markerImage;
  }

  _populateInfoWindow(marker) {
    var infoWindow = new google.maps.InfoWindow();
    // Check to make sure the infowindow is not already opened on this marker.
    infoWindow.marker = this._marker;
    infoWindow.setContent('<div>' + this.pointOfInterest.title + '</div>' + '<div>' + this.pointOfInterest.description + '</div>');
    infoWindow.open(this._map, this._marker);
  }
}

class NeighborhoodMap {
  constructor(pointsOfInterest) {
    this.pointsOfInterest = pointsOfInterest;
    this.pointsOfInterest.subscribe(this.onChange, this, "arrayChange");

    this._map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.4256, lng: -75.6953},
      zoom: 16
    });
  }

  onChange(events) {
    var pointsOfInterest = events.map(function(event) { return event.value });
    this.renderPointsOfInterest(pointsOfInterest);
  }

  renderPointsOfInterest(pointsOfInterest) {
    for (var pointOfInterest of pointsOfInterest) {
      this.renderPointOfInterest(pointOfInterest)
    }
  }

  renderPointOfInterest(pointOfInterest) {
    console.log(pointOfInterest);
    new NeighborhoodMarker(this._map, pointOfInterest);
  }
}

class Application {
  constructor() {
    this.pointsOfInterest = ko.observableArray([]);
    this.map = null;
  }

  initialize() {
    this.map = new NeighborhoodMap(this.pointsOfInterest);
    ko.applyBindings(this);

    this.addPointOfInterest(new PointOfInterest(
      'Parliament of Canada',
      '<a href="http://www.parl.gc.ca/" target="_blank">http://www.parl.gc.ca/</a>',
      new Location(45.423594, -75.700929)
    ));

    this.addPointOfInterest(new PointOfInterest(
      'National Arts Centre',
      '<a href="http://nac-cna.ca/en/" target="_blank">http://nac-cna.ca/en/</a>',
      new Location(45.423263, -75.693275)
    ));

    this.addPointOfInterest(new PointOfInterest(
      'Byward Market',
      '<a href="http://www.byward-market.com/" target="_blank">http://www.byward-market.com/</a>',
      new Location(45.428866, -75.691159)
    ));

    this.addPointOfInterest(new PointOfInterest(
      'Canadian Aviation and Space Museum',
      '<a href="http://www.casmuseum.techno-science.ca/" target="_blank"> http://www.casmuseum.techno-science.ca/</a>',
      new Location(45.421530, -75.697193)
    ));

    this.addPointOfInterest(new PointOfInterest(
      'Rideau Centre',
      '<a href="https://www.cfshops.com/rideau-centre.html" target="_blank">https://www.cfshops.com/rideau-centre.html</a>',
      new Location(45.425098, -75.691250)
    ));

  }

  addPointOfInterest(pointOfInterest) {
    this.pointsOfInterest.push(pointOfInterest);
  }
}

var app = new Application();
