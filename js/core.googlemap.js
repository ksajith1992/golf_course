"use strict";

function golfclub_googlemap_init(dom_obj, coords) {
	"use strict";
	if (typeof GOLFCLUB_STORAGE['googlemap_init_obj'] == 'undefined') golfclub_googlemap_init_styles();
	GOLFCLUB_STORAGE['googlemap_init_obj'].geocoder = '';
	try {
		var id = dom_obj.id;
		GOLFCLUB_STORAGE['googlemap_init_obj'][id] = {
			dom: dom_obj,
			markers: coords.markers,
			geocoder_request: false,
			opt: {
				zoom: coords.zoom,
				center: null,
				scrollwheel: false,
				scaleControl: false,
				disableDefaultUI: false,
				panControl: true,
				zoomControl: true, //zoom
				mapTypeControl: false,
				streetViewControl: false,
				overviewMapControl: false,
				styles: GOLFCLUB_STORAGE['googlemap_styles'][coords.style ? coords.style : 'default'],
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		};
		
		golfclub_googlemap_create(id);

	} catch (e) {
		
		dcl(GOLFCLUB_STORAGE['strings']['googlemap_not_avail']);

	};
}

function golfclub_googlemap_create(id) {
	"use strict";

	// Create map
	GOLFCLUB_STORAGE['googlemap_init_obj'][id].map = new google.maps.Map(GOLFCLUB_STORAGE['googlemap_init_obj'][id].dom, GOLFCLUB_STORAGE['googlemap_init_obj'][id].opt);

	// Add markers
	for (var i in GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers)
		GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].inited = false;
	golfclub_googlemap_add_markers(id);
	
	// Add resize listener
	jQuery(window).resize(function() {
		if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].map)
			GOLFCLUB_STORAGE['googlemap_init_obj'][id].map.setCenter(GOLFCLUB_STORAGE['googlemap_init_obj'][id].opt.center);
	});
}

function golfclub_googlemap_add_markers(id) {
	"use strict";
	for (var i in GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers) {
		
		if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].inited) continue;
		
		if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].latlng == '') {
			
			if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].geocoder_request!==false) continue;
			
			if (GOLFCLUB_STORAGE['googlemap_init_obj'].geocoder == '') GOLFCLUB_STORAGE['googlemap_init_obj'].geocoder = new google.maps.Geocoder();
			GOLFCLUB_STORAGE['googlemap_init_obj'][id].geocoder_request = i;
			GOLFCLUB_STORAGE['googlemap_init_obj'].geocoder.geocode({address: GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].address}, function(results, status) {
				"use strict";
				if (status == google.maps.GeocoderStatus.OK) {
					var idx = GOLFCLUB_STORAGE['googlemap_init_obj'][id].geocoder_request;
					if (results[0].geometry.location.lat && results[0].geometry.location.lng) {
						GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = '' + results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng();
					} else {
						GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = results[0].geometry.location.toString().replace(/\(\)/g, '');
					}
					GOLFCLUB_STORAGE['googlemap_init_obj'][id].geocoder_request = false;
					setTimeout(function() { 
						golfclub_googlemap_add_markers(id); 
						}, 200);
				} else
					dcl(GOLFCLUB_STORAGE['strings']['geocode_error'] + ' ' + status);
			});
		
		} else {
			
			// Prepare marker object
			var latlngStr = GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].latlng.split(',');
			var markerInit = {
				map: GOLFCLUB_STORAGE['googlemap_init_obj'][id].map,
				position: new google.maps.LatLng(latlngStr[0], latlngStr[1]),
				clickable: GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].description!=''
			};
			if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].point) markerInit.icon = GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].point;
			if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].title) markerInit.title = GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].title;
			GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].marker = new google.maps.Marker(markerInit);
			
			// Set Map center
			if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].opt.center == null) {
				GOLFCLUB_STORAGE['googlemap_init_obj'][id].opt.center = markerInit.position;
				GOLFCLUB_STORAGE['googlemap_init_obj'][id].map.setCenter(GOLFCLUB_STORAGE['googlemap_init_obj'][id].opt.center);				
			}
			
			// Add description window
			if (GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].description!='') {
				GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].infowindow = new google.maps.InfoWindow({
					content: GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].description
				});
				google.maps.event.addListener(GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].marker, "click", function(e) {
					var latlng = e.latLng.toString().replace("(", '').replace(")", "").replace(" ", "");
					for (var i in GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers) {
						if (latlng == GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].latlng) {
							GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].infowindow.open(
								GOLFCLUB_STORAGE['googlemap_init_obj'][id].map,
								GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].marker
							);
							break;
						}
					}
				});
			}
			
			GOLFCLUB_STORAGE['googlemap_init_obj'][id].markers[i].inited = true;
		}
	}
}

function golfclub_googlemap_refresh() {
	"use strict";
	for (id in GOLFCLUB_STORAGE['googlemap_init_obj']) {
		golfclub_googlemap_create(id);
	}
}

function golfclub_googlemap_init_styles() {
	"use strict";
	// Init Google map
	GOLFCLUB_STORAGE['googlemap_init_obj'] = {};
	GOLFCLUB_STORAGE['googlemap_styles'] = {
		'default': []
	};
	if (window.golfclub_theme_googlemap_styles!==undefined)
		GOLFCLUB_STORAGE['googlemap_styles'] = golfclub_theme_googlemap_styles(GOLFCLUB_STORAGE['googlemap_styles']);
}