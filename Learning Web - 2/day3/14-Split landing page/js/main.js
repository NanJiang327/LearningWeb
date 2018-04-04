var left = document.querySelector('.left');
var right = document.querySelector('.right');
var container = document.querySelector('.container');

left.addEventListener('mouseenter', function(){
	container.classlist.add('hover-left');
});

left.addEventListener('mouseleave', function(){
	container.classlist.remove('hover-left');
});

right.addEventListener('mouseenter', function(){
	container.classlist.add('hover-right');
});

right.addEventListener('mouseleave', function(){
	container.classlist.remove('hover-right');
});