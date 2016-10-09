function throttle (callback, limit) {
  var wait = false;                 // Initially, we're not waiting
  return function () {              // We return a throttled function
    if (!wait) {                  // If we're not waiting
      callback.call();          // Execute users function
      wait = true;              // Prevent future invocations
      setTimeout(function () {  // After a period of time
        wait = false;         // And allow future invocations
      }, limit);
    }
  }
}

function getColour(hue, lightness, alpha) {
  if (hue > 1) {
    hue = 1;
  }
  if (hue < 0) {
    hue = 0;
  }

  if (lightness < 50) {
    lightness = 50;
  }
  if (lightness > 100) {
    lightness = 100;
  }

  var _hue = ((1 - hue) * 120).toString(10);
  return ['hsla(', _hue, ',100%,',lightness,'%,', alpha, ')'].join("");
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

function parseNodes(nodes) {
  var _nodes = {};
  var node;

  for(var i = 0, ii = nodes.length; i < ii; i += 1) {
    node = {};

    for (var j = 0, jj = nodes[i].attributes.length; j < jj; j += 1) {
      node[nodes[i].attributes[j].name] = nodes[i].attributes[j].value;
    }

    node.lat = parseFloat(node.lat);
    node.lon = parseFloat(node.lon);

    node.tags = parseTags(nodes[i]);

    node.distance = measure(node.lat, node.lon, position.coords.latitude, position.coords.longitude);

    _nodes[node.id] = node;
  }

  return _nodes;
}

function parseTags(parent) {
  var tags = parent.querySelectorAll('tag');
  var _tags = {};
  var _key;
  var _value;

  for (var j = 0, jj = tags.length; j < jj; j += 1) {
    _key = tags[j].getAttribute('k');
    _value = tags[j].getAttribute('v');

    _tags[_key] = _value;
  }

  return _tags;
}

function parseWays(ways, nodes) {
  var _ways = [];
  var way;
  var tags;
  var node_references;
  var _key;
  var _value;
  for (var i = 0, ii = ways.length; i < ii; i += 1) {
    way = {
      lat: null,
      lon: null,
      tags: {},
      nodes: []
    };

    if (ways[i].getAttribute('lat')) {
      way.lat = ways[i].getAttribute('lat');
    }
    if (ways[i].getAttribute('lon')) {
      way.lon = ways[i].getAttribute('lon');
    }

    way.tags = parseTags(ways[i]);

    node_references = ways[i].querySelectorAll('nd');

    for (var j = 0, jj = node_references.length; j < jj; j += 1) {
      _value = node_references[j].getAttribute('ref');
      if (nodes[_value]) {
        way.nodes.push(nodes[_value]);
      }
    }

    _ways.push(way);
  }

  return _ways;
}

function getClosestWay(ways) {
  var _ways = ways.slice(0);

  if (_ways.length === 1) {
    return _ways[0];
  }

  for (var i = 0, ii = _ways.length; i < ii; i += 1) {
    _ways[i].nodes.sort(function (a, b) {
      return b.distance < a.distance;
    });

    _ways[i].distance = _ways[i].nodes[0].distance;
  }

  _ways.sort(function (a, b) {
    return b.distance < a.distance;
  });

  return _ways[0];
}