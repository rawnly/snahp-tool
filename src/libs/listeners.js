// import { ipcMain, dialog, BrowserWindow } from 'electron';

// import fs from 'fs';
// import os from 'os';

// import zippy from 'zippyshare-extractor';
// import Storage from 'electron-store';

const {
	ipcMain, dialog,
	BrowserWindow
} = require('electron');

const fs = require('fs');
const os = require('os');

const zippy = require('zippyshare-extractor');
const Storage = require('electron-store');

const settings = new Storage();
const windows = BrowserWindow.getAllWindows();

ipcMain.on('download-url', (e, {url}) => {
	zippy(url).then(directURL => {
		windows[0].webContents.downloadURL(directURL);
	}).catch(err => {
		throw err;
	});
});

ipcMain.on('delete-file', (e, data) => {
	fs.unlinkSync(data.path);
});

ipcMain.on('source-file', () => {
	dialog.showOpenDialog(BrowserWindow.getAllWindows()[0], {
		properties: ['openFile'],
		buttonLabel: 'That\'s my source',
		defaultPath: os.homedir(),
		message: 'Show me your source list.',
		filters: [ { name: 'Text Files', extensions: ['txt', 'doc', 'text', 'rtf'] } ]
	}, paths => {		
		if ( paths && paths.length ) {
			var list = fs.readFileSync(paths[0], 'utf8')
				.split('\n')
				.filter(link => link !== '')
				.map(link => link.trim());

			settings.set('list', list);
			settings.set('count', 0);

			windows[0].webContents.send('source', {list});
		}
	});
});
