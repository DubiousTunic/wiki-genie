$(document).ready(function(){

	_ANCHOR3D_load();
	$("._WIKI_heading").text(_ANCHOR3D_page());

	//set attributes to hyperlinks

	$("._WIKI_hyperlink").click(function(e){
		e.preventDefault();
	})

})

var pages;

function _WIKI_load(doc){
	//see how we call parseJSON first, because it is async, now
	//the result gets handed back in a callback function, THEN we store the
	//item in the db and route the page
	parseJSON(doc, function(err, result){
		console.log("RESULT : " + result);
		pages = result;

		if(pages){
			_ANCHOR3D_route("#" + pages[0].hyperlink)
			//load pages into Taffy

			createPage(pages[0]);	
		}
		
	})
}


$(document).on("_ANCHOR3D_load", function () {
	//i apologize to jeezy f.
	if(pages){
		let found = pages.find(e => e.hyperlink === _ANCHOR3D_page());
		
    	createPage(found)
	}
});


/*
	This allows anyone to make a wiki with 1 single html file without running a server
	Because Wikipedia is fascist and my site is arbitrarily delayed we'll see how far this can go
*/
//clientside edit of jsonblob


function getSuffix(str){
	return str.substring(str.indexOf('_') + 1);
}

//TODO: write something like TaffyDB that queries nested arrays

//partition : heading, subheading, or content
//id : index of subheading or content
function updateJSONBlob(partition, id){
	//did i win
	console.log(partition, id);

	var heading = currentPage.heading;

	//currentPage holds all our data
	//then it's id, partition of currentPage
	//do not struggle with me

	//WHY DIDN'T YOU USE A SWITCH
	//this is how you program
	if(partition === "heading"){
		//dealing with heading
		currentPage.heading = $("#edit_heading_input").val();
		//you have seething glowniggers (HEREBY!!!)
		//The Star
		console.log(currentPage.heading);
	}
	else if(partition === "subheading"){
		//i herd you liek mudkips
		currentPage.contents[id].subheading = $("#edit_subheading_input_" + id).val()		
	}
	else if(partition === "content"){
		//we did it reddit!!!1
		currentPage.contents[id].content =  $("#edit_content_input_" + id).val()
	}

	//glownigger butthurt that i don't want to use glowniggerDB
	//you can't query nested elements in TaffyDB, i read about TaffyDB in a book
	//i thought i'd try it yet i wondered if TaffyDB was jewish...ends up it is
	var index = pages.map(function(e) { return e.heading; }).indexOf(heading);
	pages[index] = currentPage;

	console.log(pages);

	//TODO: streamline reference
	$.ajax({
		type: "PUT",
		contentType : "application/json",
		url : "https://jsonblob.com/api/jsonBlob/887868769184268288",
		data : JSON.stringify(pages),
		success : function(){
			_ANCHOR3D_route("#" + _ANCHOR3D_page());
		}
	})
}

var currentPage;

function createPage(page){
	currentPage = page;
	console.log(page);
	$(".wiki").empty();
	//can you tell Jesus to stop hacking me
	var div = document.createElement("div");
	var partial = $(".wiki").append(div)
	$(partial).addClass("partial");
	$(partial).addClass(page.hyperlink);

	var h1 = document.createElement("h1");
	$(partial).append(h1)
	$(h1).text(page.heading);
	$(h1).attr("id", "heading");
	var a0 = document.createElement("a");
	$(partial).append(a0);
	$(a0).text(" [edit]");
	//there's only one :heading
	$(a0).attr("id", "edit_heading")
	$(a0).attr("href", "#");
	//create an overlay on click
	var heading_edit = document.createElement("input");
	$(heading_edit).attr("id", "edit_heading_input");
	$(heading_edit).val($(h1).text());
	$(partial).append(heading_edit);
	$(heading_edit).hide();
	$(a0).click(function(e){
		e.preventDefault();
		//these numbers are actually crucially important because all pRNG is time-Based
		$(heading_edit).fadeToggle(747);
		$(heading_button).fadeToggle(747);
	})

	var heading_button = document.createElement("button");
	$(heading_button).attr("id", "edit_heading_button");
	//classes are sets of elements, so now we can say, ".edit_button.click(jsonPUT...check id)"
	$(heading_button).addClass("edit_button");
	$(heading_button).text("Update");
	$(heading_button).hide();
	$(partial).append(heading_button);

	var table = document.createElement("table");
	$(partial).append(table);

	//AM I NOT MERCIFUL
	//foreach to create index
	page.contents.forEach(function(content, i){
		var h2 = document.createElement("h2");
		$(partial).append(h2);
		$(h2).text(content.subheading);
		var a1 = document.createElement("a");
		$(partial).append(a1);
		$(a1).text(" [edit]");

		//get the index of the loop through subheadings, append to ID of text box
		//now we can reference the subheading through that id in an ajax call later
		//to JSONBlob PUT
		//i learned this id method from looking at the What.CD source
		$(a1).attr("id", "edit_subheading_" + i)
		$(a1).attr("href", "#");
		//create an overlay on click
		var subheading_edit = document.createElement("input");
		$(subheading_edit).attr("id", "edit_subheading_input_" + i);
		$(partial).append(subheading_edit); 
		$(subheading_edit).val($(h2).text());
		$(subheading_edit).hide();

		var subheading_button = document.createElement("button");
		$(subheading_button).attr("id", "edit_subheading_button_" + i);
		$(subheading_button).addClass("edit_button");
		$(partial).append(subheading_button);
		$(a1).click(function(e){
			e.preventDefault();
			//these numbers are actually crucially important because all pRNG is time-Based
			$(subheading_edit).fadeToggle(747);
			$(subheading_button).fadeToggle(747);
		})
		$(subheading_button).text("Update");
		$(subheading_button).hide();
		
		var div = document.createElement("div");
		$(partial).append(div);
		var a2 = document.createElement("a");
		
		$(a2).text(" [edit]");
		$(a2).attr("id", "edit_content_" + i)
		$(a2).attr("href", "#");
		//create an overlay on click
		var content_edit = document.createElement("textarea");
		//now we're gonna access this in the callback from JSONBlob PUT
		//let me add the buttons first
		$(content_edit).attr("id", "edit_content_input_" + i);
		$(partial).append(content_edit);
		$(content_edit).height("556px");
		$(content_edit).width("777px");
		$(content_edit).hide();
		//we invented Legato Jasmine and I

		$(a2).click(function(e){
			e.preventDefault();
			//these numbers are actually crucially important because all pRNG is time-Based
			$(content_edit).fadeToggle(747);
			$(content_button).fadeToggle(747);
		})
		var span = document.createElement("span")
		$(div).append(span)
		$(span).append(content.content);	
		$(content_edit).val($(span).html())
		$(div).append(a2);
		var content_button = document.createElement("button");
		$(content_button).addClass("edit_button");
		$(content_button).attr("id", "edit_content_button_" + i);
		$(div).append(content_button);
		$(content_button).text("Update");
		$(content_button).hide();

		//this needs to go here because the page doesn't automatically load the event
		//note this also applies edit_button event to the heading above
		$(".edit_button").click(function(e){
			e.preventDefault();
			var id = $(this).attr("id").slice(-1);
			console.log(id);
			switch($(this).attr("id")){
				case "edit_heading_button":
					updateJSONBlob("heading", null)
					break;
				case "edit_subheading_button_" + id:
					console.log("here");
					updateJSONBlob("subheading", id);
					break;
				case "edit_content_button_" + id:
					updateJSONBlob("content", id);
					break;
				default:
					console.log("button error");
					break;
			}
		})
	})

	//references

	var divref = document.createElement("div");
	$(partial).append(divref);
	var h3ref = document.createElement("h3");
	$(partial).append(h3ref);
	$(h3ref).text("References")
	var spanref = document.createElement("spanref")
	$(divref).append(spanref); 

	manifestHyperlink();
}


function manifestHyperlink(){
	$("._WIKI_hyperlink").each(function(){
		//DENDRIT1C
		let hyperlink = pages.find(e => e.heading === $(this).text()).hyperlink;
		console.log(hyperlink);
		console.log($(this).text());
		console.log(hyperlink);
		$(this).addClass(hyperlink);
		$(this).attr("href", "#" + hyperlink);
		$(this).click(function(e){
			e.preventDefault();

			//get it to DISPLAY
			_ANCHOR3D_route($(this).attr("href"));
			//substring(1) because there is a # on the hyperlink
		})

	})
}

function parseJSON(doc, cb){
	console.log(doc);
	//if json is passed
	if(doc.isJson){
		cb(null, doc);
	}
	//if a hyperlink is passed
	else{
		console.log("processing json hyperlink")
		$.ajax({			
			url : doc,
		 	success : function(dat){
				console.log(dat);
				cb(null, dat);
			},
			error : function(err){
				console.log(err);
				cb(err);
			}
		})
	}
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}