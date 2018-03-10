const { ipcRenderer, remote } = require('electron');

const { Menu, MenuItem } = remote;

const ms = require('ms');
const Storage = require('electron-store');
const logger = require('electron-timber');

const settings = new Storage();
const menu = new Menu();

const startButton = document.querySelector('[data-action="select-source"]');
const statitstics = document.querySelector('#statitstic-group');

let count = settings.has('count') ? settings.get('count') : 0;
let times = [];

startButton.addEventListener('click', () => {
	ipcRenderer.send('source-file');
	ipcRenderer.on('source', () => {
		switchView();
		nextLink(settings.get('count'));
	});
});

ipcRenderer.on('download-status', (e, data) => {
	logger('download-status', data);
});

ipcRenderer.on('download-progress', (e, data) => {
	setProgress(Math.floor(data.progress), data.filename);
});

ipcRenderer.on('source-file-callback', () => {
	ipcRenderer.send('source-file');
});

ipcRenderer.on('download-completed', (e, data) => {
	if (data.status === false) {
		ipcRenderer.send('delete-file', { path: data.path });
	} else {
		setProgress(0, 'No downloads quequed.');
		startButton.disabled = false;
	}

	let end = new Date().getTime();
	let start = new Date(data.startTime * 1000).getTime();
	let totalTime = end - start;

	times.push(totalTime);

	settings.set('count', count + 1);

	nextLink(settings.get('count'));
});

menu.append(new MenuItem({
	label: 'Load File',
	click() {
		ipcRenderer.send('source-file');
	},
}));

window.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	menu.popup({
		window: remote.getCurrentWindow(),
	});
}, false);


function nextLink(index) {
	setProgress(0, 'Loading next file...');
	settings.set('midtime', ms(Math.floor(media(...times))));

	// Preventing double starting
	startButton.disabled = true;

	let links = settings.get('list');

	if (!links[index]) return;
	ipcRenderer.send('download-url', {
		url: links[index],
	});
}

function media(...arr) {
	let sum;

	if (arr.length) {
		if (arr.length < 2) {
			sum = arr[0];
		} else {
			sum = arr.reduce((a, b) => a + b);
		}

		return Math.floor((sum / arr.length) * 10) / 10;
	}

	return 0;
}

function setProgress(progress = 0, descr = '--') {
	const progressBar = document.querySelector('#statitstic-group progress');
	const filename = document.querySelector('#statitstic-group #filename');
	const percentage = document.querySelector('#statitstic-group #percentage');
	const parts  	    = document.querySelector('#statitstic-group #parts');

	if (filename.innerHTML !== descr) filename.innerHTML = descr;
	if (progressBar.value !== progress) progressBar.value = progress;
	if (percentage.innerHTML !== `${progress  }%`) percentage.innerHTML = `${progress}%`;

	parts.innerHTML = `${settings.get('count') + 1} of ${settings.get('list').length}`;
}

function switchView() {
	startButton.classList.toggle('hide');
	statitstics.classList.toggle('hide');
}
