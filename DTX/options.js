let setting_apiURL = "https://www.gov.uk/bank-holidays.json"; // URL to fetch up to date bank holidays

// Pulls bank holidays from UK gov site and sends them to handler
function fetchBankHolidaysJSON(callback) {
    const endpoint = setting_apiURL;
    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => callback(data));
}


// Saves options to chrome.storage
function save_options() {
	var shortcutKeys = document.getElementById('shortcutKeys').checked;
	var selectMode = document.getElementById('selectMode').checked;
	var showBankHolidays = document.getElementById('showBankHolidays').checked;
	var holidayRegion = document.getElementById('holidayRegion').value;
	var autoLogin = document.getElementById('autoLogin').checked;
	var employeeNumber = document.getElementById('employeeNumber').value;
	
	chrome.storage.sync.set({
		shortcutKeys: shortcutKeys,
		selectMode: selectMode,
		showBankHolidays: showBankHolidays,
		holidayRegion: holidayRegion,
		autoLogin: autoLogin,
		employeeNumber: employeeNumber,
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved!';
		setTimeout(function() {
			status.textContent = '';
		}, 2000);
	});
}

// Toggles visibility of bank holiday sub-settings
function toggleBankHolidayContainer(shouldShow) {
	document.getElementById('bankHolidaySettingsContainer').style.display = shouldShow ? "block" : "none";
}
// Toggles visibility of auto login sub-settings
function toggleAutoLoginContainer(shouldShow) {
	document.getElementById('autoLoginSettingsContainer').style.display = shouldShow ? "block" : "none";
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		shortcutKeys: true,
		selectMode: true,
		showBankHolidays: true,
		holidayRegion: 'england-and-wales',
		autoLogin: false,
		employeeNumber: "",
	}, function(items) {
		document.getElementById('shortcutKeys').checked = items.shortcutKeys;
		document.getElementById('selectMode').checked = items.selectMode;
		
		document.getElementById('showBankHolidays').checked = items.showBankHolidays;
		document.getElementById('holidayRegion').value = items.holidayRegion;
		toggleBankHolidayContainer(items.showBankHolidays);
		
		document.getElementById('autoLogin').checked = items.autoLogin;
		document.getElementById('employeeNumber').value = items.employeeNumber;
		toggleAutoLoginContainer(items.autoLogin);
	});
}


// Fetches bank holidays from UK gov and fills out the settings list
function fill_region_options() {
	fetchBankHolidaysJSON(function(holidaysJSON) {
		let optionsList = document.getElementById("holidayRegion");
		
		let regions = Object.keys(holidaysJSON)
		
		for (var i = 0; i < regions.length; i++){
			let region = regions[i];
			
			let option = document.createElement("option");
			option.text = region;
			option.value = region;
			
			optionsList.add(option);
		}
		
		// Only try to restore options once all options are avaliable
		restore_options();
	});
}

document.addEventListener('DOMContentLoaded', fill_region_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById("showBankHolidays").addEventListener("change", function(event) {
	toggleBankHolidayContainer(event.target.checked);
});
document.getElementById("autoLogin").addEventListener("change", function(event) {
	toggleAutoLoginContainer(event.target.checked);
});