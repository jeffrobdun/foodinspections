// JavaScript Document

var endpointUrl = './getResturants.php';

$(document).ajaxStart(function(){
	$("#loading").text("Loading...");
	$("#loading").css("display", "block");
	
});

var cookies = document.cookie;
var cookieArray = cookies.split(';');
var token = '';
if(cookieArray.length == 1){
	if(cookieArray[0].indexOf('nb_foodinspections') > -1){
		token = cookieArray[0].split('=')[1];
	}
}else{
	for(var i=0; i < cookieArray.length; i++){
		if(cookieArray[i].indexOf('nb_foodinspections') > -1){
			token = cookieArray[i].split('=')[1];
		}
	}
}

$("#getResturants").click(function(){
	
	$.ajax({
		type: "POST",
		url: endpointUrl + '?token=' + token,
		statusCode: {
		    404: function() {
		    	alert( "page not found" );
		    },
			403: function(){
				document.location.reload(true);
			}
		},
		data: $("#form").serialize(),
		success: function(data){
// 			$("#test").text(data);
			dataArray = JSON.parse(data);
			var table = buildResturantTable(dataArray, $("#results"));
			$("#results").css("display","block");
			$("#loading").css("display","none");
		},
		error: function(jqXHR, status, error){
			console.log(status + " - " + error);
		}
	});	
	return false;
});

$("#letter").change(function(){
	$.ajax({
		type: "POST",
		url: endpointUrl + '?token=' + token,
		statusCode: {
		    404: function() {
		    	alert( "page not found" );
		    },
			403: function(){
				document.location.reload(true);
			}
		},
		data: 'letter=' + $("#letter").val(),
		success: function(data){
			dataArray = JSON.parse(data);
			var table = buildResturantTable(dataArray, $("#results"));
			$("#results").css("display","block");
			$("#loading").css("display","none");
		},
		error: function(jqXHR, status, error){
			console.log(status + " - " + error);
		}
	});	
	return false;
});

$("input[type=radio][name=resultMode]").click(function(event){
	if($(".radio[name=resultMode]:checked").val() == "current"){
		endpointUrl = './getResturants.php';
	}else{
		endpointUrl = './getEstablishmentsHistory.php';
	}
});

$(".radio").click(function(event){

	var image = event.target;
	var radio = $("#" + $(image).attr("for"));
	var checkedImageSrc = "https://cdn1.iconfinder.com/data/icons/material-core/20/radio-button-on-24.png";
	var uncheckedImageSrc = "https://cdn1.iconfinder.com/data/icons/material-core/20/radio-button-off-24.png";
	
	radio.click();
	var radioButtons = $("input[type=radio][name=" + $(radio).attr("name") + "]");
	for(var x=0;x<radioButtons.length;x++){
		if($(radioButtons[x]).prop("checked")){
			$("[for=" + $(radioButtons[x]).prop("id") + "]").prop("src", checkedImageSrc);
		}else{
			$("[for=" + $(radioButtons[x]).prop("id") + "]").prop("src", uncheckedImageSrc);
		}
	}
});

$(".checkbox").click(function(event){
	var image = event.target;
	var checkbox = $("#" + $(image).attr("for"));
	var checkedImageSrc = "images/checked_checkbox.png";
	var uncheckedImageSrc = "images/unchecked_checkbox.png";
	
	if($(image).attr("src").includes("unchecked")){
		$(image).attr("src", checkedImageSrc);
		checkbox.click();
	}else{
		$(image).attr("src", uncheckedImageSrc);
		checkbox.click();
	}
});

function buildResturantTable(data, table){
	var tableString = '';
	
	var tableHeaders = table.find("th");
	var template = '';
	var templateString = '';
	
	if(data.length > 0){
		for(var i=0;i<data.length;i++){
			tableString += '<tr>';
			for(var j=0;j<tableHeaders.length;j++){
				template = templates[$(tableHeaders[j]).attr('data-column') + 'Template'];

				if(template){
					templateString = template.replace("{value}", data[i][$(tableHeaders[j]).attr('data-column')]);
					tableString += '<td class="' + $(tableHeaders[j]).attr('data-column') + '">' + templateString + '</td>';
				}else{
					tableString += '<td class="' + $(tableHeaders[j]).attr('data-column') + '">' + data[i][$(tableHeaders[j]).attr('data-column')] + '</td>';
				}
			}
			tableString += '</tr>';
		}
	}else{
		tableString = '<tr><td colspan="' + tableHeaders.length + '">No Results</td></tr>';
	}
	
	table.find('tbody').html(tableString);
	
	return tableString;
}

function createPDF(pdfId){
	$.ajax({
		type: "GET",
		url: './extractPdf.php',
		statusCode: {
		    404: function() {
		    	alert( "page not found" );
		    }
		},
		data: 'id=' + pdfId,
		success: function(data){
			window.open(window.location + data);
		},
		error: function(jqXHR, status, error){
			alert(status + " - " + error);
		}
	});	


	$.ajax({
		type: "GET",
		url: './deletePdf.php',
		statusCode: {
			404: function() {
				alert( "page not found" );
			}
		},
		data: {'id':pdfId, 'delay': 20},
		success: function(data){
			
		},
		error: function(jqXHR, status, error){
			alert(status + " - " + error);
		}
	});
}

