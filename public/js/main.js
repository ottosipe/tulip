$(function(){ 
	
	// build specials
	var specialTemp = _.template($("#specialTemp").html());
	$.get("/special", function(data) {
		var special = specialTemp(data);
		$("#special").html(special);
	})

	var photoTemp = _.template($("#photoTemp").html());
	$.get("/photos", function(data) {
		var photos = photoTemp({ photos: data });
		$(".ticker").html(photos);
		resize();
		$(".thumb").click(function(){
			$("#big img").attr("src", $(this).attr("src")+"/big");
		});
	});

	$(".feedback").submit(function(e){
		e.preventDefault();

		var inputs = $("input, textarea", this);
		
		var stop = false;
		inputs.each(function(i) {
			if($(this).val() == "") stop = true;
		})
		if(stop) {
			alert("Please fill out all parts of the form.");
			return;
		}

		var that = $(this);
		$.post("/feedback", $(this).serialize(), function(data){
			that.html(data);
		})
	})

	$("#job_app").submit(function(e){
		e.preventDefault();

		var that = $(this);
		$.post("/apply", $(this).serialize(), function(data){
			that.html(data);
		})
	})


	// start ticker
	setInterval(function() {
	  tick();
	}, 3000);

	var opts = {
	  lines: 13, // The number of lines to draw
	  length: 35, // The length of each line
	  width: 6, // The line thickness
	  radius: 36, // The radius of the inner circle
	  corners: 0, // Corner roundness (0..1)
	  rotate: 19, // The rotation offset
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  color: '#000', // #rgb or #rrggbb
	  speed: 0.5, // Rounds per second
	  trail: 100, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 0, // The z-index (defaults to 2000000000)
	  top: 'auto', // Top position relative to parent in px
	  left: 'auto' // Left position relative to parent in px
	};
	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);

});

var thumbWidth;
function resize() {
	var width = $('.ticker').width();
	thumbWidth = 111; // optimum 100 + 3(hover) + 8(margin)
	var number = Math.round(width / thumbWidth) ;
	thumbWidth = Math.round((width - (number-1)*11)/number - 3);
	//console.log(thumbWidth)
	$(".thumb").css("max-height",thumbWidth+"px");
}
window.onresize = function(event) {
    resize();
}
window.onorientationchange = function(event) {
	resize();
}

function tick() {
	var next = Math.ceil($('.ticker').width() / (thumbWidth));
    var victim = Math.ceil(Math.random() * next); // number from 0 to  8

	$('.ticker li:nth-child('+victim+')').fadeOut("slow",function() {
		$(this).detach().appendTo('.ticker').show();
		var that = $('.ticker li:nth-child('+next+')');
		that.hide().detach().fadeIn("slow");
		var replace = victim - 1;
		if (replace != 0)
			$('.ticker li:nth-child('+(victim - 1)+')').after(that);
		else 
			$('.ticker').prepend(that);
	})
	
};