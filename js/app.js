var App = window.App = {};

App.videoIdx = 0;

App.playing = false;
App.ended = false;

App.start = function(){
  App.renderPlaylist();
  App.play('runnin');

  window.addEventListener('resize', App.onResize);
  document.getElementById('comments-overlay').addEventListener('click', function(){
    if (App.player) {
      if (App.playing) App.player.pauseVideo();
      else if (!App.ended) App.player.playVideo();
    }
  }, false);
};

App.previousVideo = function(){
  App.stopAll();
  App.videoIdx = (App.videoIdx-1);
  if (App.videoIdx < 0) App.videoIdx = Object.keys(Videos).length-1;
  App.play();
};

App.nextVideo = function(){
  App.stopAll();
  App.videoIdx = (App.videoIdx+1)%(Object.keys(Videos).length);
  App.play();
};

App.stopAll = function(){
  if (App.playing) {
    App.player.stopVideo();
  }
  Comments.stop();
};

App.renderPlaylist = function(){
  var $controls = document.querySelector("#playlist>.playlist-controls");
  var $prevBtn = document.createElement('a');
  $prevBtn.setAttribute('href', '#');
  $prevBtn.addEventListener('click', function(e){
    e.preventDefault();
    App.previousVideo();
  }, false);
  $prevBtn.innerHTML = '←prev';
  var $nextBtn = document.createElement('a');
  $nextBtn.setAttribute('href', '#');
  $nextBtn.addEventListener('click', function(e){
    e.preventDefault();
    App.nextVideo();
  }, false);
  $nextBtn.innerHTML = 'next→';
  $controls.appendChild($nextBtn);
  $controls.appendChild($prevBtn);

  var $playlist = document.querySelector("#playlist>.playlist-videos");
  Object.keys(Videos).forEach(function(vk, idx){
    var $vlink = document.createElement('a');
    $vlink.setAttribute('href', '#');
    $vlink.addEventListener('click', function(e){
      e.preventDefault();
      App.videoIdx = idx;
      App.play();
    }, false);
    $vlink.innerHTML = Videos[vk].name;
    $playlist.appendChild($vlink);
  });
};

App.play = function(){
  App.currentVideo = Object.keys(Videos)[App.videoIdx];
  if (!App.player) {
    App.player = new YT.Player('player', {
      height: window.innerHeight,
      width: window.innerWidth,
      videoId: Videos[App.currentVideo].id,
      playerVars: {
        rel: 0,
        iv_load_policy: 3
      },
      events: {
        'onReady': App.onPlayerReady,
        'onStateChange': App.onPlayerStateChange
      }
    });
  } else {
    App.stopAll();
    App.player.loadVideoById(Videos[App.currentVideo].id);
  }
};

App.onPlayerReady = function(event) {
  event.target.playVideo();
};

var started = false;
App.onPlayerStateChange = function(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    App.playing = true;
    if (!started) {
      started = true;
      Comments.start();
    } else {
      Comments.resume();
    }
  } else {
    App.playing = false;
    if (event.data===YT.PlayerState.PAUSED||event.data===YT.PlayerState.BUFFERING) {
      Comments.pause();
    } else if (event.data === YT.PlayerState.ENDED) {
      App.ended = true;
      App.nextVideo();
    }
  }
};
App.stopVideo = function() {
  App.player.stopVideo();
};

App.onResize = function(){
  if (App.player) {
    App.player.setSize(window.innerWidth, window.innerHeight);
  }
};
