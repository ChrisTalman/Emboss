'use strict';

module.exports = Web;

// External Modules
const Express = require('express');
const HTTP = require('http');

// Constants
const PORT = 3030;

Web();
function Web()
{
	initialise();
	function initialise()
	{
		var app = Express();
		var http = HTTP.Server(app);
		app.get(
			/\.(?:html|css|js|json)$/,
			function(request, response, next)
			{
				response.status(200).sendFile(
					'' + request.path,
					{
						root: './'
					},
					function(error)
					{
						if (error)
						{
							console.log('Asset fetch error: \n' + error);
							next();
						};
					}
				);
			}
		);
		app.get('/*', function(request, response)
		{
			response.status(200).sendFile('/app.html', {root: './'});
		});
		http.listen(PORT, function ()
		{
			console.log('Web server listening on port ' + PORT + '.');
		});
	};
};