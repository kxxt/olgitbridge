const { JSDOM } = require('jsdom')

/*
| Performs a login.
|
| ~client: axios handle with proper tough cookie jar support
| ~olServer: overleaf server to connect to
| ~email: email to login as
| ~password: password to login as
*/
module.exports =
	async function( client, olServer, email, password )
{
	const res = await client.get( olServer + '/login' );
	const data = res.data;
	const dom = new JSDOM(data)
	const csrfToken = dom.window.document.head.querySelector('meta[name="ol-csrfToken"]').content
	await client.post(
		olServer + '/login',
		{ _csrf: csrfToken, email: email, password: password }
	);
};
