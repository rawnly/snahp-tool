// import { app, BrowserWindow, Menu  } from 'electron';
// import { downloadCatcher } from './libs/utils';
// import menu from './libs/Menu';

const { app, BrowserWindow, Menu  } = require('electron');
const { downloadCatcher } = require('./libs/utils');
const menu = require('./libs/Menu');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = (index = `file://${__dirname}/render/index.html`) => {
  // Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 800,
		titleBarStyle: 'hidden-inset',
		show: false
	});

  // and load the index.html of the app.
	mainWindow.loadURL(index);

  // Open the DevTools.
	// mainWindow.webContents.openDevTools();
	mainWindow.webContents.session.on('will-download', downloadCatcher);

  // Emitted when the mainWindow is closed.
	mainWindow.on('closed', () => {
    // Dereference the mainWindow object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
		mainWindow = null;
	});

	// Once content is loaded show the mainWindow
	mainWindow.on('ready-to-show', function() {
		this.show();
	});

	return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createWindow();
	Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
require('./libs/listeners');