var settingBtn = document.getElementById("setting");
var activeBtn = document.querySelector("#active");

function init() {
	if(localStorage.on === undefined) {
		localStorage.on = false;
	}

	if(localStorage.time === undefined) {
		localStorage.time = 45;
	}	
}

function attachSettingBtn() {
	settingBtn.addEventListener("click", function(){
			chrome.tabs.create({
		    index: 0,
		    url: '../html/setting.html',
		    active: true,
		    pinned: false,
		}, function(tab){
		    console.log(tab);
		});
	});	
}


function updateButton() {
	var onAndOff = localStorage.on;
	if(onAndOff === undefined || onAndOff === "false") {
		activeBtn.textContent = "Active";
		settingBtn.disabled = false;
	} else {
		activeBtn.textContent = "Deactivate";
		settingBtn.disabled = true;
	}
}

function showNotification(titleStr, messageStr, imgUrlStr) {
	chrome.notifications.clear('notify1');
	chrome.notifications.create (
		'notify1', {
			type:'basic',
			iconUrl: imgUrlStr,
			title: titleStr,
			message: messageStr
		},
		function(){}
	);
}

function displayTime() {
	var timeDisplay = document.querySelector(".timer p");
	var x = setInterval(function() {
		var now = new Date().getTime();
		var end = Number(localStorage.endTime);

		var distance = end - now;
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		if(distance <= 0) {
			timeDisplay.textContent = "00:00";
			showNotification("Congratulations!", "You made it! Take a break...", "../image/congrats48.png");
			localStorage.on = false;
			updateButton();
			updateTimeDisplay();
		} else {
			timeDisplay.textContent = (minutes >= 10? minutes: "0" + minutes) + ":" + (seconds >= 10? seconds: "0" + seconds);
		}
	}, 1000);

	return x;
}

function updateTimeDisplay() {
	var setTime;
	if(localStorage.time === undefined || localStorage.time === 0){
		setTime = -1
	} else {
		setTime = Number(localStorage.time);
	}
	var x;
	if(setTime !== -1 && localStorage.on === "true") {
		if(localStorage.endTime === undefined) {
			var endTime = new Date().getTime() + setTime * 60 * 1000;
			localStorage.endTime = endTime;

			x = displayTime();
		} else {
			x = displayTime();
		}
		localStorage.intervalId = x;
	} else {
		if(localStorage.intervalId !== undefined) {
			clearInterval(Number(localStorage.intervalId));
		}
		document.querySelector(".timer p").textContent = "00:00";
		localStorage.removeItem("intervalId");
		localStorage.removeItem("endTime");
	}
}

function onButtonClick() {
	var onAndOff = localStorage.on;
	if(onAndOff === undefined || onAndOff === "false") {
		localStorage.on = true;
	} else {
		localStorage.on = false;
	}

	updateButton();
	updateTimeDisplay();
}
init();
attachSettingBtn();
updateButton();
updateTimeDisplay();
activeBtn.addEventListener("click",onButtonClick);



