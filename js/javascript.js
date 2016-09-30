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

class PointOfInterestsViewModel {
  pointOfInterests() {
    return ko.observableArray([
      new PointOfInterest(
        'Parliament of Canada',
        '<a href="http://www.parl.gc.ca/" target="_blank">http://www.parl.gc.ca/</a>',
        new Location(45.423594, -75.700929)
      ),
      new PointOfInterest(
        'National Arts Centre',
        '<a href="http://nac-cna.ca/en/" target="_blank">http://nac-cna.ca/en/</a>',
        new Location(45.423263, -75.693275)
      )
    ]);
  }
}

class NeighborhoodMap {
  constructor() {
    this._map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.4215, lng: -75.6972},
      zoom: 16
    });

    this._defaultIcon = this._makeMarkerIcon('0091ff');
    this._highlightedIcon = this._makeMarkerIcon('FFFF24');
  }

  renderPointOfInterests(pointOfInterests) {
    for (var i = 0; i < pointOfInterests.length; i++) {
      this.renderPointOfInterest(pointOfInterests[i]);
    }
  }

  renderPointOfInterest(pointOfInterest) {
    console.log(pointOfInterest);

    var marker = new google.maps.Marker({
      map: this._map,
      position: pointOfInterest.location,
      title: pointOfInterest.title,
      description: pointOfInterest.description,
      animation: google.maps.Animation.DROP,
      icon: this._defaultIcon
    });

    var self = this;

    markers.push(marker);
    marker.addListener('click', function(){
      console.log(this);
      self._populateInfoWindow(this);
    });
    marker.addListener('click', function(){ //changes marker's colour when clicked
      console.log(this);
      this.setIcon(self._highlightedIcon);
    });
    marker.addListener('mouseout', function(){ //cahnges marker's colour to default once the mouse isn't on the marker
      console.log(this);
      this.setIcon(self._defaultIcon);
    });
    // bounds.extend(markers[i].position);
    // map.fitBounds(bounds);
  }

  _populateInfoWindow(marker) {
    var infowindow = new google.maps.InfoWindow();
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.description + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
      });
    }
  }

  _makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21,34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
        return markerImage;

    }
}

function Run() {
  var map = new NeighborhoodMap();
  map.renderPointOfInterests([
    new PointOfInterest(
      'Parliament of Canada',
      '<a href="http://www.parl.gc.ca/" target="_blank">http://www.parl.gc.ca/</a>',
      new Location(45.423594, -75.700929)
    ),
    new PointOfInterest(
      'National Arts Centre',
      '<a href="http://nac-cna.ca/en/" target="_blank">http://nac-cna.ca/en/</a>',
      new Location(45.423263, -75.693275)
    )
  ]);
}
