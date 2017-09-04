function init() {
	updateDefaultList();
	updateCustomizedList();
	updateTimeInput();
}

function updateDefaultList() {
	var ul = document.querySelector("ul");
	var template = '<li class="list-group-item">{el}</li>';

	var defaultListJSON = localStorage.default;
	if(defaultListJSON !== undefined) {
		var sites = JSON.parse(defaultListJSON);

		for(var i = 0; i < sites.length; i++) {
			var checked = sites[i].block;
			var url = sites[i].url;
			var str = '<input type="checkbox" id="cbdefault' + i  + '" ' + (checked? 'checked />':'/>') +
						'<span  class="siteInList" id=spdefault' + i + '" ' + '>' + url + '</span>';
			var addOnHTML = template.replace("{el}",str);
			ul.innerHTML += addOnHTML;
		}
	}
}

function updateCustomizedList() {
	var table = document.querySelector("tbody");
	table.innerHTML = "";
	var template = '<tr>{el}</tr>';

	var customizedJSON = localStorage.customized;
	if(customizedJSON !== undefined) {
		var sites = JSON.parse(customizedJSON);

		for(var i = 0; i < sites.length; i++) {
			var checked = sites[i].block;
			var url = sites[i].url;
			var str = '<td><input type="checkbox" id="cbcus' + i + '" ' + (checked? 'checked />':'/>') + '</td>' +
						'<td>' + url + '</td>' +
						'<td><button class="tableButton" id="btncus' + i +'">' + 'X</button></td>';
			var addOnHTML = template.replace("{el}", str);
			table.innerHTML += addOnHTML;
		}
	} 
}

function updateTimeInput() {
	if(localStorage.time !== undefined) {
		var timeInput = document.querySelector('input[type="number"]');
		timeInput.value = localStorage.time;
	}
}

function checkBoxChange() {
	var siteList;
	var index;
	var type;
	var id = this.id;
	if(id.indexOf("default") !== -1) {
		type = "default";
		siteList = JSON.parse(localStorage[type]);
		index = Number(id.replace("cbdefault",""));
	} else {
		type = "customized";
		siteList = JSON.parse(localStorage[type]);
		index = Number(id.replace("cbcus",""));
	}
	siteList[index].block = this.checked;
	localStorage[type] = JSON.stringify(siteList);
}

function deleteClicked(e) {
	console.log('clicking');
	var index = Number(this.id.replace("btncus", ""));
	var siteList = JSON.parse(localStorage.customized);
	siteList.splice(index,1);
	localStorage.customized = JSON.stringify(siteList);
	updateCustomizedList();
	attchEventListener();
}

function siteAdd(e) {
	if(e.keyCode === 13) {
		var urlInput = document.querySelector('input[type="text"]');
		var siteList = JSON.parse(localStorage.customized);
		siteList.push({url:urlInput.value, block: true});
		localStorage.customized = JSON.stringify(siteList);
		urlInput.value = "";
		updateCustomizedList();
		attchEventListener();
	}
}

function setTime(e) {
	if(e.keyCode === 13) {
		var timeInput = document.querySelector('input[type="number"]');
		if(timeInput.value >= "15") {
			localStorage.time = timeInput.value;
		}else {
			alert("Focus for at least 15 minutes");
		}
	}
}

function attchEventListener() {
	var checkBoxes = document.querySelectorAll('input[type="checkbox"]');
	for(var i = 0; i < checkBoxes.length; i++) {
		checkBoxes[i].addEventListener("change",checkBoxChange);
	}

	var deleteBtns = document.querySelectorAll("button");
	for(var i = 0; i < deleteBtns.length; i++) {
		deleteBtns[i].addEventListener("click", deleteClicked);
	}

	var urlInput = document.querySelector('input[type="text"]');
	urlInput.addEventListener("keypress",siteAdd);

	var timeInput = document.querySelector('input[type="number"]');
	timeInput.addEventListener("keypress", setTime);
}

init();
attchEventListener();
