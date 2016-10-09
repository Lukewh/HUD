$flip.addEventListener('touchend', function (e) {
  e.preventDefault();
  document.body.classList.toggle('reverse');
  if (document.body.classList.contains('reverse')) {
    localStorage.setItem('reverse', true);
  } else {
    localStorage.setItem('reverse', false);
  }
}, false);

if (window.location.href.indexOf('demo') === -1) {
  var speedWatch = navigator.geolocation.watchPosition(
    function (position) {
      setSpeed(position);
    },
    function (error) {
      /*var msg = '<small>Access to location required</small>';
       $content1.innerHTML = msg;*/
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000
    }
  );
}

window.addEventListener('resize', function(e) {
  var HEIGHT = window.innerHeight;

  styles.set($content1, 'content1', {
    'line-height': HEIGHT + 'px'
  });
});

/*window.addEventListener('touchmove', function (e) {
  e.preventDefault();
});*/