$(document).ready(function(){
	
$(".partial").hide();

//routes the path on load

$("._anch_link").click(function(e){
	e.preventDefault();

	_ANCHOR3D_route("#" + anchorPath($(this)) + anchorParams($(this)))
})

})


window.addEventListener('popstate', function(event){
	var origin = event.state;

	//route(path);
	if(origin !== null){	
		var link = getLink(origin);
		hidePartial();
		//router(link.path, link.params);	
		showDiv(link.path);

		//TODO : shouldn't this use ANCHORED route?
		$(document).trigger("_ANCHOR3D_load");

	}									
})

function _ANCHOR3D_hyperlink(hyperlink){
	window.location.replace(hyperlink);
}


function hidePartial(){
	$(".partial").hide();
}

function getLink(origin){
	var params = origin.split("?")
	var path = params[0].split("#");
	return {
		path : path[1],
		params : params
	}
}

function _ANCHOR3D_load(){	
	_ANCHOR3D_route(window.location.hash + window.location.search)
}

function _ANCHOR3D_page(){
	return getLink(window.location.hash).path
}

function _ANCHOR3D_route(origin){
	console.log("INITIALIZE ORIGIN " + origin);
	hidePartial();
	var link = getLink(window.location.pathname + origin);			
	history.pushState(origin, '', origin)
	$(document).trigger("_ANCHOR3D_load");
	showDiv(link.path);
}


function showDiv(path){
	$("div." + path).fadeIn();
}

function anchorPath(href){
	return href.attr("class").split(/\s+/)[1];
}

function anchorParams(href){
	return href.attr("rel") ? href.attr("rel") : "";
}
