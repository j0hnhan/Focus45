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
		console.log(blockSite);
		if(blockSite.block && url.indexOf(blockSite.url) !== -1) {
			return true;
		}
	}
	return false;
}

function updateView(details) {
	var on = localStorage.on;
	var blockList = getBlockList();
	if(on === "true") {
		if(details.frameId === 0 && contains(details.url, blockList)) {
			console.log("inside");
			var id = details.tabId;
			chrome.tabs.executeScript(id, {
				code:'document.body.style.filter = "blur(7px)"'
			});
		}
	}
}

chrome.webNavigation.onDOMContentLoaded.addListener(updateView);
