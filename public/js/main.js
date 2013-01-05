$(function(){ 
	var curTab;// = $(".navlink:first");
	$(".navlink").click(function(e){
		if ($(this).attr("data-external")) return;
		
		e.preventDefault();
		$(".tab").hide();
		curTab = this; // remeber if needed
		$($(this).attr("href")).show();
		$(".navlink").removeClass("active");
		$(this).addClass("active");
	});

	$(".navlink").hover(function(e){ // hover in
		$(".navlink").removeClass("active");
	}, function(e){ // hover out
		$(curTab).addClass("active");
	});

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
		
	});

	// start ticker
	setInterval(function() {
	  tick();
	}, 3000);

});

function tick() {

	var next = Math.ceil($('.ticker').width() / 120);
    var victim = Math.ceil(Math.random() * next); // number from 0 to  8

	$('.ticker li:nth-child('+victim+')').fadeOut("slow",function() {
		$(this).detach().appendTo('.ticker');
		var that = $('.ticker li:nth-child('+next+')');
		that.hide().detach().fadeIn("slow");
		var replace = victim - 1;
		if (replace != 0)
			$('.ticker li:nth-child('+(victim - 1)+')').after(that);
		else 
			$('.ticker').prepend(that);
	})
	
};