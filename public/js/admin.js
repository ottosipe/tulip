$(function(){
	$("#newSpec").click(function(e){
		e.preventDefault();
		$("#editSpecs").append('<li draggable="true" class="spec"><input type="text" name="type" placeholder="category" class="input-small"><input type="text" name="desc" placeholder="description"><button class="deleteSpec"><i class="icon-remove"></i></button><button class="moveSpec"><i class="icon-resize-vertical"></i></button></li>');	
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
		var that = $(this);
  		$.post('/special', $(this).serialize(), function(data){
  			console.log(data)
  			that.html('<h2 class="center">'+data+'</h2>')
  		});
	});

	$("#addPhoto").submit(function(e) {
		e.preventDefault();
		var formData = new FormData($(this));
		var that = $(this);
		console.log(formData)
	    // $.ajax({
	    //     url: '/photo',  //server script to process data
	    //     type: 'POST',
	    //     /*xhr: function() {  // custom xhr
	    //         myXhr = $.ajaxSettings.xhr();
	    //         if(myXhr.upload){ // check if upload property exists
	    //             myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
	    //         }
	    //         return myXhr;
	    //     },*/
	    //     //Ajax events
	    //     //beforeSend: beforeSendHandler,
	    //     success: function(data){
	  		// 	console.log(data)
	  		// 	that.html('<h2 class="center">'+data+'</h2>')
	  		// },
	    //     //error: errorHandler,
	    //     // Form data
	    //     data: formData,
	    //     //Options to tell JQuery not to process data or worry about content-type
	    //     //cache: false,
	    //     //contentType: false,
	    //     processData: false
	    // });
	});

	var photoAdminTemp = _.template($("#photoAdminTemp").html());
	$.get("/photos", function(data) {
		console.log(data)
		var photos = photoAdminTemp({ photos: data });
		$("#photoAdmin").html(photos);
		$(".thumb").click(function(){
			$("#big img").attr("src", $(this).attr("src")+"/big")
		});		
	});

});