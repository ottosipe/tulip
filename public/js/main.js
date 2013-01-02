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

	// start ticker
	tick();
});


function tick() {
	$('.ticker li:first').animate( {"marginLeft": "-=120px"}, 5000, 'linear', function() {
		$(this).detach().appendTo('.ticker').removeAttr('style');
		tick();
	});
};