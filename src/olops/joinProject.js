/*
| Makes the real-time operations to join a project
| using socket io.
*/
const io = require('../../lib/socket.io-client');
const { XMLHttpRequest } = require('../XMLHttpRequest')

io.util.request = function () {
	const xhr = new XMLHttpRequest()
	return xhr
}


module.exports =
	async function (client, olServer, project_id) {
		console.log(client.count, 'io connect to', project_id);
		const cookieJar = client.defaults.jar;
		const cookie = cookieJar.getCookieStringSync(olServer);
		const socket = io.connect(
			olServer,
			{
				withCredentials: true,
				cookie: cookie,
				transports: ['websocket'],
				'force new connection': true,
				query: new URLSearchParams({ projectId: project_id }).toString(),
				// Disable auto connect because we might get joinProjectResponse before
				// setting up the listener for it with auto connect
				'auto connect': false
			}
		);
		let storedProject;
		socket.on('joinProjectResponse', resp => {
			const { publicId, project, permissionsLevel, protocolVersion } = resp
			// console.log(project, protocolVersion)
			storedProject = project;
		})
		socket.on('connectionRejected', err => {
			storedProject = null
			console.log(err)
		})
		socket.on('disconnect', () => {
			console.log("Disconnected from socket.io")
		})
		socket.socket.connect()
		// this is a bad workaround, sometimes socket.io just doesn't seem to reply
		// (or reply to a previous connection, there are some fixes in newer versions it seems)
		// after a timeout just try again. Promise logic should discard the respective other event
		// should it occour.
		while (storedProject === undefined) {
			await new Promise(r => setTimeout(r, 1000));
			console.log('iosocket timeout');
		}
		console.log(client.count, 'iosocket disconnect');
		socket.disconnect();
		return storedProject;
	};
