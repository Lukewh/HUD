if (localStorage.getItem('reflect')) {
  document.body.classList.add('flip');
}

function setSpeedColour() {
  var colour;
  var overDiff = 0;
  var underDiff = 100;

  if (typeof speedLimit === 'number' && speedLimit !== 0) {
    overDiff = (currentSpeed - speedLimit) / (speedLimit * 0.1);
    if (overDiff < 0) {
      overDiff = 0;
    } else if (overDiff > 1) {
      overDiff = 1;
    }

    underDiff = 50 + ((((speedLimit - currentSpeed) / speedLimit) / 2) * 100);

    colour = getColour(overDiff, underDiff, 1);
  } else {
    colour = getColour(120, 100, 1);
  }

  styles.set($speed, 'speed', {
    color: colour
  });
}

function setSpeed(position) {
  var speed = 0;
  window.position = position;

  if (typeof position.coords.speed === 'number') {
    speed = position.coords.speed / METERS_PER_SECOND;
  }

  speed = Math.ceil(speed);

  if (speed !== currentSpeed) {
    currentSpeed = speed;
    $speed.innerHTML = speed + '<small>mph</small>';
    setSpeedColour();
  }
};

HEIGHT = window.innerHeight;
styles = new SetStyle();

var $wrapper = document.querySelector('#wrapper');
var $content1 = document.querySelector('#content');

var $limit = document.querySelector('.limit');
var $streetName = document.querySelector('.streetName');
var $speed = document.querySelector('.speed');

var $flip = document.querySelector('.flip');

styles.set($content1, 'content1', {
  'line-height': HEIGHT + 'px'
});

/*
 reqwest({
 url: 'http://proxy.amionlineapi.com?url=' + encodeURIComponent('http://www.yournavigation.org/api/1.0/gosmore.php?flat=51.5033630&flon=-0.1276250&tlat=51.5217000&tlon=-0.1014650&instructions=1&format=geojson'),
 method: 'GET',
 contentType: 'application/json',
 header: {
 'X-Yours-client': 'lwh-hud.surge.sh'
 },
 crossDomain: true,
 success: function (resp) {
 console.log(resp);
 }
 });*/

var speedLimitTimeout = false;
var _position = {lat: 0, lon: 0};
function updateSpeedLimit() {
  var mod =  0.000047; // 1 meter?
  if (speedLimitTimeout) {
    clearTimeout(speedLimitTimeout);
  }

  var lat = window.position.coords.latitude;
  var lon = window.position.coords.longitude;

  if (lat !== _position.lat || lon !== _position.lon && measure(lat, lon, _position.lat, _position.lon) > 40) {
    console.log('http://www.overpass-api.de/api/xapi?*[maxspeed=*][bbox=' + (lon - mod) + ',' + (lat - mod) + ',' + (lon + mod) + ',' + (lat + mod) + ']');
    reqwest({
      url: 'http://proxy.amionlineapi.com?url=' +
      encodeURIComponent('http://www.overpass-api.de/api/xapi?*[maxspeed=*][bbox=' + (lon - mod) + ',' + (lat - mod) + ',' + (lon + mod) + ',' + (lat + mod) + ']'),
      method: 'GET',
      crossDomain: true,
      complete: function (xhr) {
        if (xhr.responseText) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(xhr.responseText, 'text/xml');
          var ways = parseWays(doc.querySelectorAll('way'), parseNodes(doc.querySelectorAll('node')));
          var road = getClosestWay(ways);

          if (road) {
            var maxSpeed = road.tags.maxspeed;
            var streetName = road.tags.name;
            if (maxSpeed) {
              speedLimit = parseInt(maxSpeed, 10);
              $limit.innerHTML = speedLimit;
              $limit.classList.add('show');
            } else {
              $limit.classList.remove('show');
            }

            if (streetName) {
              $streetName.innerHTML = streetName;
              $streetName.classList.add('show');
            } else {
              $streetName.classList.remove('show');
            }

            setSpeedColour();
          }
        }

        speedLimitTimeout = setTimeout(function () {
          updateSpeedLimit();
        }, 1000);
      }
    });
  } else {
    speedLimitTimeout = setTimeout(function () {
      updateSpeedLimit();
    }, 1000);
  }
  _position.lat = lat;
  _position.lon = lon;
}

updateSpeedLimit();

if (window.location.href.indexOf('demo') !== -1) {
  var list = [[-0.126365, 51.503166], [-0.126211, 51.503167], [-0.126222, 51.503346], [-0.126231, 51.503541], [-0.126246, 51.503729], [-0.126281, 51.503983], [-0.126302, 51.504133], [-0.126353, 51.5043], [-0.126401, 51.504463], [-0.126455, 51.504622], [-0.126474, 51.504673], [-0.126492, 51.504729], [-0.126494, 51.504763], [-0.126483, 51.504791], [-0.126461, 51.504816], [-0.126429, 51.504838], [-0.126395, 51.504849], [-0.126357, 51.504855], [-0.126219, 51.504872], [-0.126097, 51.504889], [-0.125901, 51.504917], [-0.125723, 51.504937], [-0.125507, 51.504934], [-0.125444, 51.504941], [-0.125281, 51.504952], [-0.125105, 51.504953], [-0.124836, 51.504935], [-0.12382, 51.504772], [-0.123729, 51.504753], [-0.123332, 51.504678], [-0.123263, 51.504625], [-0.123182, 51.504756], [-0.12303, 51.505301], [-0.122916, 51.505568], [-0.122814, 51.505809], [-0.122771, 51.505938], [-0.12271, 51.506058], [-0.122649, 51.506166], [-0.12256, 51.506282], [-0.122476, 51.506404], [-0.122436, 51.506464], [-0.122401, 51.506523], [-0.122346, 51.506612], [-0.122107, 51.506911], [-0.121932, 51.507165], [-0.121815, 51.507312], [-0.121456, 51.507708], [-0.121241, 51.507972], [-0.120967, 51.508265], [-0.120584, 51.508617], [-0.120346, 51.508797], [-0.120145, 51.508937], [-0.119976, 51.509044], [-0.118885, 51.509625], [-0.11873, 51.509698], [-0.118572, 51.509757], [-0.118351, 51.50983], [-0.117856, 51.509993], [-0.117311, 51.510166], [-0.116925, 51.51027], [-0.11667, 51.510333], [-0.116477, 51.510387], [-0.115983, 51.510501], [-0.115757, 51.510548], [-0.115295, 51.51063], [-0.115138, 51.510665], [-0.11474, 51.510734], [-0.114345, 51.510797], [-0.114162, 51.510824], [-0.113527, 51.51092], [-0.112751, 51.510989], [-0.112015, 51.511046], [-0.110711, 51.511067], [-0.109307, 51.511063], [-0.108006, 51.51106], [-0.107933, 51.511059], [-0.107622, 51.511068], [-0.107357, 51.511118], [-0.106885, 51.511127], [-0.10627, 51.511116], [-0.106161, 51.511118], [-0.106002, 51.511119], [-0.105776, 51.511116], [-0.105519, 51.511148], [-0.105278, 51.511207], [-0.105123, 51.511258], [-0.105027, 51.511298], [-0.104916, 51.511347], [-0.104762, 51.511416], [-0.104555, 51.511494], [-0.104474, 51.511573], [-0.10441, 51.511628], [-0.104369, 51.51166], [-0.104312, 51.511706], [-0.104289, 51.511757], [-0.104275, 51.511803], [-0.104266, 51.511853], [-0.104264, 51.511914], [-0.10427, 51.511977], [-0.104272, 51.512109], [-0.104276, 51.512293], [-0.104276, 51.512495], [-0.104221, 51.512726], [-0.104214, 51.512926], [-0.104209, 51.513034], [-0.104222, 51.513135], [-0.104272, 51.513533], [-0.104301, 51.51366], [-0.104314, 51.51372], [-0.104387, 51.51416], [-0.104408, 51.514225], [-0.104442, 51.514341], [-0.104495, 51.514632], [-0.104625, 51.515241], [-0.104635, 51.515277], [-0.104723, 51.515776], [-0.104731, 51.515827], [-0.104753, 51.515959], [-0.104786, 51.516094], [-0.104861, 51.516401], [-0.104903, 51.516604], [-0.104971, 51.516913], [-0.104992, 51.517038], [-0.105005, 51.517093], [-0.105134, 51.517652], [-0.105155, 51.517729], [-0.105322, 51.518394], [-0.105331, 51.518529], [-0.105375, 51.518693], [-0.105567, 51.519255], [-0.105724, 51.519812], [-0.105834, 51.520226], [-0.106024, 51.520665], [-0.106247, 51.521084], [-0.106286, 51.521142], [-0.106578, 51.5216], [-0.106788, 51.521911], [-0.106998, 51.52216], [-0.106872, 51.522167], [-0.10632, 51.522204], [-0.106218, 51.522215], [-0.105997, 51.522251], [-0.105637, 51.522308], [-0.105512, 51.522326], [-0.104976, 51.522393], [-0.104247, 51.522488], [-0.103757, 51.522552], [-0.103603, 51.52257], [-0.103444, 51.522577], [-0.103223, 51.522576], [-0.103283, 51.522639], [-0.103287, 51.522664], [-0.102157, 51.522827], [-0.102104, 51.522677], [-0.102094, 51.522637], [-0.10206, 51.52254], [-0.102016, 51.522394], [-0.101838, 51.521948], [-0.101828, 51.521923], [-0.101821, 51.521906], [-0.101719, 51.52166]];

  function move() {
    var item = list.splice(0, 1)[0];
    var speed = Math.random() * 13 - 8.9;
    setSpeed({coords: {longitude: item[0], latitude: item[1], speed: 8.9 + speed}});

    if (list.length > 0) {
      setTimeout(function () {
        move();
      }, 15000);
    }
  }

  move();
}
