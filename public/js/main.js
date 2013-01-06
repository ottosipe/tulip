$(function(){ 
	
	// build specials
	var specialTemp = _.template($("#specialTemp").html());
	$.get("/special", function(data) {
		console.log(data)
		var special = specialTemp(data);
		$("#special").html(special);
	})

	var photoTemp = _.template($("#photoTemp").html());
	$.get("/photos", function(data) {
		console.log(data)
		var photos = photoTemp({ photos: data });
		$(".ticker").html(photos);
		resize();
		$(".thumb").click(function(){
			$("#big img").attr("src", $(this).attr("src")+"/big")
		});
	});

	$(".feedback").submit(function(e){
		e.preventDefault();
		var that = $(this);
		$.post("/feedback", $(this).serialize(), function(data){
			that.html(data);
		})
	})

	// start ticker
	setInterval(function() {
	  tick();
	}, 3000);

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