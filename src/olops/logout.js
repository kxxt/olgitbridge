const { JSDOM } = require('jsdom')

/*
| Logs out a ol session.
*/
module.exports =
	async function (client, olServer) {
		const res = await client.get(olServer + '/project');
		const dom = new JSDOM(res.data)
		const csrfToken = dom.window.document.head.querySelector('meta[name="ol-csrfToken"]').content
		await client.post(olServer + '/logout', { '_csrf': csrfToken });
	};
