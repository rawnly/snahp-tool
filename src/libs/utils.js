// import {
// 	BrowserWindow,
// 	ipcMain
// } from 'electron';
// import logger from 'electron-timber';

// import { join } from 'path';
// import os from 'os';

const { BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');

const os = require('os');
const logger = require('electron-timber');

module.exports.getWindow = name => {
	return BrowserWindow.getAllWindows().filter(window => {
		return window.name === name;
	});
};

module.exports.downloadCatcher = (event, item, wc) => {
	// const wc = BrowserWindow.getAllWindows()[0].webContents;
	item.setSavePath(join(os.homedir(), 'Downloads', item.getFilename()));

	// STOP DOWNLOAD
	ipcMain.on('stop-download', () => {
		item.cancel();
		wc.send('download-completed', {
			status: true,
			path: item.getSavePath(),
			actionByUser: true
		});
	});

	// SKIP DOWNLOAD
	ipcMain.on('skip-download', () => {
		item.cancel();
		wc.send('download-completed', {
			status: true,
			path: item.getSavePath()
		});
	});

	// PAUSE DOWNLOAD
	ipcMain.on('download-pause', () => {
		item.pause();
	});

	item.on('updated', (event, state) => {
		if (state === 'interrupted') {
			logger('Download is interrupted but can be resumed');
		} else if (state === 'progressing') {
			if (item.isPaused()) {
				wc.send('download-status', {
					status: 'paused',
					state
				});
			} else {
				wc.send('download-progress', {
					progress: (item.getReceivedBytes() / item.getTotalBytes()) * 100,
					filename: item.getFilename(),
					state: item.getState(),
					startTime: item.getStartTime(),
					path: item.getSavePath()
				});
			}
		}
	});

	// ONCE FINISHED
	item.once('done', (event, state) => {
		if (state === 'completed') {
			wc.send('download-completed', {
				status: true,
				path: item.getSavePath(),
				startTime: Math.floor(item.getStartTime()),
				state,
				actionByUser: false
			});
		} else {
			logger('Download Completed');
			wc.send('download-completed', {
				status: false,
				path: item.getSavePath(),
				state,
				actionByUser: false
			});
		}
	});
};