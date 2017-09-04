function getBlockList() {
	var blockList = [];
	var sites;

	var defaultJSON = localStorage.default;
	var customizedJSON = localStorage.customized;

	if(defaultJSON === undefined) {
		sites = [
		{
			url: "www.youtube.com",
			block: true	
		},
		{
			url: "www.facebook.com",
			block: true	
		},
		{
			url: "www.instagram.com",
			block: true	
		},
		{
			url: "twitter.com",
			block: true	
		}];

		localStorage.default = JSON.stringify(sites);
		blockList = blockList.concat(sites);
	} else {
		sites = JSON.parse(defaultJSON);
		blockList = blockList.concat(sites);
	}

	if(customizedJSON  === undefined) {
		sites = [];
		localStorage.customized = JSON.stringify(sites);
	} else {
		sites = JSON.parse(customizedJSON);
		blockList = blockList.concat(sites);
	}
	return blockList;
}

function contains(url, blockList) {
	for(var i = 0; i < blockList.length; i++) {
		var blockSite = blockList[i];
		if(blockSite.block && url.indexOf(blockSite.url) !== -1) {
			return true;
		}
	}
	return false;
}


function checkTimeRemain() {
	var endTime = localStorage.endTime;
	if(endTime !== undefined) {
		endTime = Number(endTime);
	} else {
		return;
	}
	var now = new Date().getTime();
	if(now >= endTime) {
		localStorage.on = false;
		localStorage.removeItem("endTime");
		chrome.notifications.clear('notify1');
		var opt = {
		  iconUrl: "../image/congrats48.png",
		  type: 'basic',
		  title: 'Congratulations!',
		  message: 'You made it! Take a break...',
		};
		chrome.notifications.create('notify1', opt, function() { console.log('created!'); });
	}
}

function updateView(details) {
	checkTimeRemain();
	var on = localStorage.on;
	var blockList = getBlockList();
	if(on === "true") {
		if(details.frameId === 0 && contains(details.url, blockList)) {
			var id = details.tabId;
			chrome.tabs.executeScript(id, {
				code:'document.body.style.filter = "blur(7px)"'
			});
		}
	}
}

chrome.webNavigation.onDOMContentLoaded.addListener(updateView);

setInterval(function(){
	chrome.notifications.clear("notify2");
		var opt = {
		  iconUrl: "../image/eye48.png",
		  type: 'basic',
		  title: 'Eye protection',
		  message: 'Watch around, relax your eye',
		};
		chrome.notifications.create('notify2', opt, function() { console.log('created!'); });	
}, 15*60*1000);

setInterval(function(){
	chrome.notifications.clear("notify3");
		var opt = {
		  iconUrl: "../image/sit48.png",
		  type: 'basic',
		  title: '',
		  message: 'Straight your back!',
		};
		chrome.notifications.create('notify3', opt, function() { console.log('created!'); });	
}, 30*60*1000);