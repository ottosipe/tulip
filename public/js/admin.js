$(function(){
	$("#newSpec").click(function(e){
		e.preventDefault();
		$("#editSpecs").append('<li draggable="true" class="spec"><input type="text" name="type" placeholder="person" class="input-small"><input type="text" name="desc" placeholder="person"><button class="deleteSpec"><i class="icon-remove"></i></button><button class="moveSpec"><i class="icon-resize-vertical"></i></button></li>');	
		$('#editSpecs').sortable({
		    handle: '.moveSpec'
		});
	});
	$("body").on("click", ".moveSpec", function(e) {
		e.preventDefault();
	});
	$("body").on("click", ".deleteSpec", function(e) {
		e.preventDefault();
		$(this).parent().detach();
	});

	$(".specials").submit(function(e) {
		e.preventDefault();

  		$.post('/special', $(this).serialize(), function(data){
  			console.log(data)
  		});
	})
});