//Container
$(document).ready(function() {
	var tlFade = new TimelineLite({paused:true});
	tlFade
		.to("main", 2, {autoAlpha:1})
	;

	tlFade.play();
});

//Slideshow
$(document).ready(function() {
	var tlss = new TimelineMax({repeat: -1});

	tlss.to("#bckg1", 4, {force3D:true, autoAlpha: 1})
		.to("#bckg1", 15, {force3D:true, scale: 1.05}, "-=4")
		.to("#bckg1", 4, {force3D:true, autoAlpha: 0}, "-=2")
		.to("#bckg2", 4, {force3D:true, autoAlpha: 1}, "-=4")
		.to("#bckg2", 15, {force3D:true, scale: 1.1}, "-=4")
		.to("#bckg2", 4, {force3D:true, autoAlpha: 0}, "-=2")
		.to("#bckg3", 4, {force3D:true, autoAlpha: 1}, "-=4")
		.to("#bckg3", 15, {force3D:true, scale: 1.05}, "-=4")
		.to("#bckg3", 4, {force3D:true, autoAlpha: 0})
	;

	tlss.play();
});

//Map
$(document).ready(function() {
	$('#findMyPostcode').click(function(e) {
		e.preventDefault();

		var postcodeResult = 0;
		var locationResult = 0;

		$('.alert').hide();

		$.ajax({
	    type: "GET",
	    url: "https://maps.googleapis.com/maps/api/geocode/xml?address="+encodeURIComponent($('#address').val())+"&key=AIzaSyBPzSvySU15RXHXZrSCk41ldCrOV2DxuoU",
	    dataType: "xml",
	    success: processXML,
	    error: error
	   });

    function processXML(xml) {
	    var results = $(xml).find("result").length;
	    var formattedAddress = $(xml).find("formatted_address").text();

	    if(results == 1) {
				$(xml).find("address_component").each(function(){
					if($(this).find("type").text() == "postal_code") {
						var postcode = $(this).find('long_name').text();

						$('#success').html("The requested postcode is: "+postcode+"</br>Full address: "+formattedAddress).fadeIn();
						postcodeResult = 1;
					}
				});

				$(xml).find("location").each(function(){
					lat = $(this).find("lat").text();
					lng = $(this).find("lng").text();
					var myLatLng = new google.maps.LatLng(lat, lng);
          
					var map;
					map = new google.maps.Map(document.getElementById('map'), {
			      center: myLatLng,
						zoom: 12
			    });

			    var marker = new google.maps.Marker({
						position: myLatLng,
						map: map,
						title: formattedAddress
					});

					if($(window).width() >= 768) {
						$('#map').fadeIn();
					}

					locationResult = 1;
				});

				if(locationResult == 1 && postcodeResult == 0) {
			    $('#failNoPostcode').fadeIn();
				}

			} else if (results > 1){
				$('#failMultipleResults').fadeIn();
			} else if (results == 0){
				$('#failWrongAddress').fadeIn();
			}
    }

    function error() {
	    if($('#address').val()!=="") {
	    	$('#failConnection').fadeIn();
	    }
	  }

    if($('#address').val()=="") {
	    $('#failEmpty').fadeIn();
    }
	});

	$('#address').keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      $('#findMyPostcode').click();
    }
  });
});
