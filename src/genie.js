$(document).ready(function(){

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

		//if(pages){
			//_ANCHOR3D_route("#" + pages[0].hyperlink)

			//createPage(pages.find(e => e.hyperlink === _ANCHOR3D_page()));	
		//i've heard it through disciplic succession that those who forsake the family tradition dwell always in Hell
		
		//else{
		if(!_ANCHOR3D_page()){
				console.log("HERE")
				_ANCHOR3D_route("#" + pages[0].hyperlink);
		}
		else{
			_ANCHOR3D_load();
		}
		//}
		//}		
	})
}


$(document).on("_ANCHOR3D_load", function () {
	console.log("LOADED")
	if(pages){
		let found = pages.find(e => e.hyperlink === _ANCHOR3D_page());
		
		console.log(found.hyperlink);

    	createPage(found)
    	//sketchy workaround because the page that holds ANCHOR3D data comes back after the load. 
    	//this is for refresh-->back button 
    	showDiv(found.hyperlink);
	}
});


/*
	This allows anyone to make a wiki with 1 single html file without running a server
	Because Wikipedia is fascist and my site is arbitrarily delayed we'll see how far this can go
*/
//clientside edit of jsonblob


//TODO: write something like TaffyDB that queries nested arrays

//partition : heading, subheading, or content
//id : index of subheading or content
function updateJSONBlob(partition, id){
	console.log(partition, id);

	var heading = currentPage.heading;

	if(partition === "heading"){
		currentPage.heading = $("#edit_heading_input").val();
		currentPage.hyperlink = linkify($("#edit_heading_input").val()).replace(/ /g,"_").toLowerCase();
		_ANCHOR3D_hyperlink("#" + currentPage.hyperlink);
		console.log(currentPage.heading);
	}
	else if(partition === "subheading"){
		//i herd you liek mudkips
		currentPage.contents[id].subheading = $("#edit_subheading_input_" + id).val()		
	}
	else if(partition === "content"){
		currentPage.contents[id].content =  $("#edit_content_input_" + id).val()
	}

	var index = pages.map(function(e) { return e.heading; }).indexOf(heading);
	pages[index] = currentPage;

	console.log(pages);

	//TODO: streamline reference
	//TODO: refactor with addChapter
	lance()
}

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    return replacedText;
}


function lance(){
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

//om mane padme hum
function mintPage(){
	//just give someone a blank template
	//hyperlink
	//THx

	var hash = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
	
	_ANCHOR3D_hyperlink("#" + hash);

	var page = {
		"heading": "Hello World!",
		"hyperlink": hash,
		"contents": [
		    {
		        "subheading": "Subheading",
		    "content": "Lorem ipsum hocus pocus stupendo!"
		    }
		],
		"references" : [

		]
	}



			

	createPage(page)
	

	pages.push(page);

	lance();

	


}

//title, content

//i need to go to CONCENTRATION_CAMP
function addChapter(title, index, content){
	var heading = currentPage.heading;
	var i = index ? parseInt(index) : currentPage.contents.length;
	currentPage.contents.splice(i, 0, {
		subheading : title,
		content: content
	})
	var index = pages.map(function(e) { return e.heading; }).indexOf(heading);
	//let's play pong
	console.log(currentPage);
	pages[index] = currentPage;
	lance();
}

function deleteChapter(id){
	var heading = currentPage.heading;

	currentPage.contents.splice(id, 1);

	var index = pages.map(function(e){return e.heading; }).indexOf(heading)
	pages[index] = currentPage;
	lance();
}

function deletePage(){
	var heading = currentPage.heading;

	var index = pages.map(function(e){return e.heading; }).indexOf(heading)

	pages.splice(index, 1);

	lance();
}

function deleteReference(i){
	var heading = currentPage.heading;

	console.log(i);

	//wat
	currentPage.references.splice(i, 1);
	console.log(currentPage.references);
	var index = pages.map(function(e){return e.heading; }).indexOf(heading)
	pages[index] = currentPage;
	lance(); 
}

function updateIMG(hyperlink){

	var heading = currentPage.heading;
	currentPage.img = {} 
	currentPage.img.hyperlink = hyperlink;

	var index = pages.map(function(e){return e.heading; }).indexOf(heading)
	pages[index] = currentPage;
	console.log(hyperlink);
	//this is technically logic the Father taught me
	lance();
}

function addReference(text, hyperlink){
	//search the content for this text, add []
	/* Dr34D */
	//add the reference as a data entry
	var heading = currentPage.heading;
	
	var index = pages.map(function(e){return e.heading; }).indexOf(heading)
	currentPage.references = currentPage.references ? currentPage.references : []

	currentPage.references.push({
		text : text,
		hyperlink : hyperlink
	}) 

	pages[index] = currentPage;

	lance();
}

var currentPage;

function createPage(page){
	currentPage = page;
	$(".wiki").empty();

	//wiki is the container
	var main = document.createElement("div");
	$(main).addClass("main");

	//sidebar
	var sidebar = document.createElement("div");
	$(".wiki").append(main);
	$(".wiki").append(sidebar);
	var button = document.createElement("button");
	$(sidebar).append(button);
	$(button).text("Mint Page");
	$(sidebar).append("<br>");
	$(button).click(function(e){
		e.preventDefault();
		//pig american
		mintPage();
	})


	/* SRC img */
	var img = document.createElement("img");
	$(img).attr("id", "src_img");
	$(sidebar).append(img);
	//for now
	if(page.img)
	$(img).attr("src", page.img.hyperlink);
	var imgEdit = document.createElement("a")
	
	//weird quirk of HTML is an href needs a # to be clickable
	$(imgEdit).attr("href", "#");
	$(imgEdit).text("hyperlink");
	$(imgEdit).click(function(e){
		//another weird quirk
		e.preventDefault();
		$(imgEditInput).fadeToggle(777);
		$(imgEditInputButton).fadeToggle(777);
	})

	var imgEditInput = document.createElement("input");
	$(imgEditInput).hide();
	$(sidebar).append(imgEditInput);
	var imgEditInputButton = document.createElement("button");
	$(sidebar).append(imgEditInputButton);

	//exclamation point for image magick
	$(imgEditInputButton).text("Update!")
	$(imgEditInputButton).hide();
	//feross teaches this method of DOM-creation in WebTorrent docs
	$(imgEditInputButton).click(function(e){
		//for redundancy (i invented that i truly did!)
		e.preventDefault();
		updateIMG($(imgEditInput).val());
	})

	$(sidebar).append(imgEdit);

	$(sidebar).addClass("sidebar");
	//[]D[][]\/[][]D
	//i don't know what i did
	var button = document.createElement("button");
	$(sidebar).append(button);
	$(button).click(function(e){
		e.preventDefault();
		//pig american
		deletePage();
	})
	$(button).attr("id", "delete_page_button");
	$(button).text("DELETE Page");


	var div = document.createElement("div");
	var partial = $(main).append(div)
	$(partial).addClass("partial");
	$(partial).addClass(page.hyperlink);

	var h1 = document.createElement("h1");
	$(partial).append(h1)
	$(h1).text(page.heading);
	$(h1).attr("id", "heading");
	var a0 = document.createElement("a");
	$(partial).append(a0);
	$(a0).text("[edit]");
	$(a0).addClass("editContent");
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


	//----TABLE OF CHAPTERS-----
	var span = document.createElement("span");
	$(span).text("Table of Chapters");
	$(span).attr("id", "table_of_chapters");
	$(partial).append("<br><br>")
	$(partial).append(span);
	var ol = document.createElement("ol");
	$(partial).append(ol);
	$(ol).attr('start', 0)
	$(partial).append("<br>")
	//AM I NOT MERCIFUL
	//foreach to create index
	page.contents.forEach(function(content, i){
		//add to ul this is the Table of Chapters

		//--TABLE OF CHAPTERS, cont.--
		var li = document.createElement("li");
		$(ol).append(li);
		var a = document.createElement("a");

		$(li).append(a);
		$(a).text(content.subheading);
		$(a).attr("href" , "#");
		$(a).click(function(e){
			e.preventDefault();
			$([document.documentElement, document.body]).animate({
        		scrollTop: $("#" + content.subheading.replace(/\W/g,'_')).offset().top
    		}, 777);
		})

		var h2 = document.createElement("h2");

		$(partial).append(h2);
		$(h2).text(content.subheading);
		$(h2).attr("id", content.subheading.replace(/\W/g,'_'));
		var a1 = document.createElement("a");
		$(partial).append(a1);
		$(a1).text("[edit]");
		$(a1).addClass("editContent");

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
			$(content_delete_button).fadeToggle(747);
		})
		$(subheading_button).text("Update");
		$(subheading_button).hide();

		//delete button
		var content_delete_button = document.createElement("button");
		$(content_delete_button).text("Delete");
		$(partial).append(content_delete_button);
		$(content_delete_button).hide();
		$(content_delete_button).click(function(e){
			e.preventDefault();
			deleteChapter(i);
		})
		
		var div = document.createElement("div");
		$(div).addClass("contentDiv")
		$(partial).append(div);
		var a2 = document.createElement("a");
		
		$(a2).text("[edit]");
		$(a2).attr("id", "edit_content_" + i)
		$(a2).addClass("editContent")
		$(a2).attr("href", "#");
		//create an overlay on click
		var content_edit = document.createElement("textarea");
		//now we're gonna access this in the callback from JSONBlob PUT
		//let me add the buttons first
		$(content_edit).attr("id", "edit_content_input_" + i);
		$(partial).append(content_edit);
		$(content_edit).height("444px");
		$(content_edit).width("555px");
		$(content_edit).hide();
		//we invented Legato Jasmine and me OH THAT'S WHAT THAT IS

		$(a2).click(function(e){
			e.preventDefault();
			//these numbers are actually crucially important because all pRNG is time-Based
			$(content_edit).fadeToggle(747);
			$(content_button).fadeToggle(747);
		})
		var span = document.createElement("span")
		$(div).append(span) //USSS slave
		$(span).append(content.content);	
		$(span).attr("id", "content_span_" + i);
		$(content_edit).val($(span).html())
		$(div).append(a2);
		var content_button = document.createElement("button");
		$(content_button).addClass("edit_button");
		$(content_button).attr("id", "edit_content_button_" + i);
		$(partial).append("<br>")
		$(partial).append(content_button);
		$(partial).append("<br>")
		$(content_button).text("Update");
		$(content_button).hide();

		//this needs to go here because the page doesn't automatically load the event
		//note this also applies edit_button event to the heading above
		$(".edit_button").click(function(e){
			e.preventDefault();
			var id = $(this).attr("id").slice(-1);
			//CAMP AVE
			//yes the kakadaimon gave me a head wound and it is going to be miraculously healed
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

	//TODO: remove section

	//add Chapter
	var content_button = document.createElement("button");
	$(content_button).text("Add Chapter");
	$(partial).append("<br>")
	$(partial).append(content_button);
	$(partial).append("<br>")
	var content_title = document.createElement("input")
	var content_input = document.createElement("textarea")
	$(partial).append(content_title);
	var content_index = document.createElement("input");
	$(partial).append(content_index);
	$(content_index).attr("id", "content_index")
	$(content_index).attr("placeholder", "index: 0-n")
	$(partial).append("<br>")
	$(partial).append(content_input);
	$(content_title).hide();
	$(content_index).hide();
	$(content_input).hide();
	$(content_title).attr("placeholder", "Title")
	$(content_input).attr("placeholder", "Content")
	$(content_input).width("555px");
	$(content_input).height("444px");
	$(content_button).click(function(e){
		e.preventDefault();
		$(content_title).fadeToggle(757);
		$(content_input).fadeToggle(757);
		$(content_index).fadeToggle(757);
		$(section_update_button).fadeToggle(757)
	})

	//see i don't say "Submit" because it's a matter of subversivity 
	var section_update_button = document.createElement("button");
	//this makes the frontend 'delightful'!
	$(section_update_button).text("Update");
	$(partial).append(section_update_button);
	$(section_update_button).hide();
	$(section_update_button).click(function(e){
		e.preventDefault();
		addChapter($(content_title).val(), $(content_index).val(), $(content_input).val());
	})

	
	//references
	$(partial).append("<br>");
	var divref = document.createElement("div");
	$(divref).attr("id", "references")
	$(partial).append(divref);
	var h3ref = document.createElement("h3");
	$(divref).append(h3ref);
	$(divref).append("<br>")
	$(h3ref).text("References")
	var spanref = document.createElement("spanref")
	$(divref).append(spanref); 
	var referenceTextInput = document.createElement("input");
	var referenceHyperlinkInput = document.createElement("input");
	$(divref).append(referenceTextInput);
	$(divref).append(referenceHyperlinkInput);
	var referenceAddButton = document.createElement("button");
	//i have made first contact
	$(referenceTextInput).width("333px").attr("placeholder", "Text to match")
	$(referenceHyperlinkInput).width("125px").attr("placeholder", "hyperlink");
	$(divref).append(referenceAddButton);
	$(referenceAddButton).text("+")
	$(referenceAddButton).click(function(e){
		e.preventDefault();

		//Technically this could link to a torrent on SolomonsHouse..
		//TODO modular architecture
		addReference($(referenceTextInput).val(), $(referenceHyperlinkInput).val());
	})



	manifestReference(page);
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
			console.log("IT HAS BEEN CLICKED")
			//get it to DISPLAY
			_ANCHOR3D_route($(this).attr("href"));
			//substring(1) because there is a # on the hyperlink
		})

	})
}

function manifestReference(page){

	$("#references").append("<br>")
	var ol = document.createElement("ol")
	
	//we're not gonna use im
	if(page.references){
		page.references.forEach(function(ref, i){
			//does he have to pwn so h4rd
		//REST PHIL
			
			$("#references").append(ol);
			var li = document.createElement("li");
			$(ol).append(li);		
			var a = document.createElement("a");
			$(li).append(a);
			$(a).attr("id", "reference_li_" + i);
			$(a).attr("href", ref.hyperlink);
			$(a).text(ref.hyperlink);
			$(ol).attr("start", 0);
			var button = document.createElement("button");
			$(button).text("DELETE");
			$(li).append(button);

			$(button).click(function(){
				deleteReference(i)
			})

		    for (var j=0; j<page.contents.length; j++) {
		    	//get char length of ref.text
		    	//j is the content index
		    	console.log(ref);
		    	$("#content_span_" + j).html($("#content_span_" + j).html().replace(ref.text, ref.text + "<a class='reference' id='reference_a_" + i + "' href='#'>[" + i +"]</a>"));
		    	$(".contentDiv").on("click", "#reference_a_" + i, function(e){
		    		e.preventDefault();
		    		//doesn't work correctly...it should scroll to #reference_li_i
 		    		$("html, body").animate({ scrollTop: $("#reference_a_" + i).position().top }, 1);
		    		return false;    				
		    	})


					
			}
			//
	 		//KEK
		//((SCH1ZO))
		})
	}
	
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
