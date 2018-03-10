// import { shell, app, Menu, BrowserWindow } from 'electron';
const { shell, app, Menu, BrowserWindow } = require('electron');

const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Load',
				click() {
					BrowserWindow.getAllWindows()[0].webContents.send('source-file-callback');
				}
			}
		]
	}, {
		label: 'Edit',
		submenu: [
			{role: 'undo'},
			{role: 'redo'},
			{type: 'separator'},
			{role: 'cut'},
			{role: 'copy'},
			{role: 'paste'},
			{role: 'pasteandmatchstyle'},
			{role: 'delete'},
			{role: 'selectall'}
		]
	}, {
		label: 'View',
		submenu: [
			{role: 'resetzoom'},
			{role: 'zoomin'},
			{role: 'zoomout'},
			{type: 'separator'}
		]
	}, {
		role: 'window',
		submenu: [
			{role: 'minimize'},
			{role: 'close'}
		]
	}, {
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click () { shell.openExternal('https://github.com/Rawnly/snahp-downloader'); }
			}, {
				label: 'Issues?',
				click() { shell.openExternal('https://github.com/Rawnly/snahp-downloader/issues'); }
			}, { type: 'separator' }, {
				label: 'Snahp',
				click() { shell.openExternal('https://snahp.it'); }
			}
		]
	}
];

if (process.platform === 'darwin') {
	template.unshift({
		label: app.getName(),
		submenu: [
			{role: 'about'},
			{type: 'separator'},
			{role: 'services', submenu: []},
			{type: 'separator'},
			{role: 'hide'},
			{role: 'hideothers'},
			{role: 'unhide'},
			{type: 'separator'},
			{role: 'quit'}
		]
	});

	// Edit menu
	template[2].submenu.push(
		{type: 'separator'},
		{
			label: 'Speech',
			submenu: [
				{role: 'startspeaking'},
				{role: 'stopspeaking'}
			]
		}
	);

	// Window menu
	template[4].submenu = [
		{role: 'close'},
		{role: 'minimize'},
		{role: 'zoom'},
		{type: 'separator'},
		{role: 'front'}
	];
}

const menu = Menu.buildFromTemplate(template);

module.exports = menu;