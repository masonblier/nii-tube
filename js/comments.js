var Comments = window.Comments = {};

Comments.$el = null;
Comments._timer = null;

Comments.colors = [
  '#7dfe9f',
  '#e37d12',
  '#81c810',
  '#3a7699',
  '#e35e4e',
  '#c93c7b',
  '#f7d521'
];

Comments.start = function(){
  Comments.$el = document.getElementById("comments-block");
  Comments.resume();
};

Comments.stop = function(){
  clearInterval(Comments._timer);
  Comments._timer = null;
  Comments.$el.innerHTML = '';
};

Comments.resume = function(){
  if (Comments._timer) { clearInterval(Comments._timer); }
  Comments._timer = setInterval(function(){
    Comments.showRandom();
  }, 500);
  if (Comments.$el) {
    Array.prototype.forEach.call(Comments.$el.children, function($comment){
      $comment.style.setProperty("-webkit-animation-play-state", "running");
      $comment.style.setProperty("animation-play-state", "running");
    });
  }
};

Comments.pause = function(){
  clearInterval(Comments._timer);
  Comments._timer = null;
  if (Comments.$el) {
    Array.prototype.forEach.call(Comments.$el.children, function($comment){
      $comment.style.setProperty("-webkit-animation-play-state", "paused");
      $comment.style.setProperty("animation-play-state", "paused");
    });
  }
};

Comments.showRandom = function(){
  var comments = Videos[App.currentVideo].comments;
  var randomIdx = Math.floor(Math.random()*comments.length);
  Comments.showText(comments[randomIdx]);
};

Comments.showText = function(text){
  var $comment = document.createElement("div");
  var top = Math.floor(Math.random()*(window.innerHeight-300)/20)*20;
  var size = Math.floor(Math.random()*100)+48;
  var stroke = (size > 72 ? (size > 112 ? '8px' : '6px') : '4px');
  var colorIdx = Math.floor(Math.random()*20);
  var colorCode = (colorIdx>=Comments.colors.length ? '#ffffff' : Comments.colors[colorIdx]);

  $comment.setAttribute("class", "comment");
  $comment.style.setProperty("font-size", size+"px");
  $comment.style.setProperty("top", top+"px");
  $comment.style.setProperty("color", colorCode);
  $comment.style.setProperty("-webkit-text-stroke-width", stroke);
  $comment.innerHTML = text;
  $comment.addEventListener("webkitAnimationEnd", function(e){
    $comment.remove();
  }, false);
  $comment.addEventListener("animationend", function(e){
    $comment.remove();
  }, false);
  Comments.$el.appendChild($comment);
};
