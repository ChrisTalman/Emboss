'use strict';

awaitLoad();

function awaitLoad()
{
	document.addEventListener('DOMContentLoaded', onDocumentLoaded);
	document.addEventListener('load', onDocumentLoaded);
};

function onDocumentLoaded()
{
	initialise();
};

function initialise()
{
	getHtmlTemplate('Templates/inputBinding.html', function(error, success)
	{
		if (error)
		{
			console.log('Failure.');
		}
		else
		{
			//visualise(success.template);
			render(success.template);
		};
	});
};

function render(template)
{
	//console.log(embossCompiler);
};

function visualise(template)
{
	var data =
	{
		engine: 'Emboss',
		version: '0.1',
		subtitle: 'Data binding and template engine.',
		fruits:
		[
			'Raspberry',
			'Apple',
			'Pear',
			'Banana'
		],
		team:
		{
			leader: 'Jane',
			designer: 'John',
			engineer: 'Bob'
		},
		attribute: 123,
		firstName: 'Jane',
		secondName: 'Doe',
		age: 21,
		name: 'Jane'
	};
	var model = new Emboss.Model(
	{
		template: template,
		target: document.querySelector('body'),
		data: data
	});
	window.data = data;
	window.model = model;
	//console.log(data);
	//console.log(Object.getOwnPropertyDescriptor(data, Object.getOwnPropertyNames(data)[0]).get);
};

function getHtmlTemplate(path, callback)
{
	// Instantiate request
	var request = new XMLHttpRequest();
	// Listen to request changes
	request.addEventListener('readystatechange', function(event)
	{
		if (event.currentTarget.readyState === 4)
		{
			if (event.currentTarget.status === 200)
			{
				var template = event.target.response.body.innerHTML;
				var success =
				{
					template: template
				};
				callback(null, success);
			}
			else
			{
				callback({message: 'Unexpected Status'});
			};
		};
	});
	// Expect document
	request.responseType = 'document';
	// Prepare resource target
	request.open('GET', path);
	// Send request
	request.send();
};

/*var data =
{
	message: 'Hello World!',
	new: true,
	date: 1,
	other:
	{
		firstName: 'Jane',
		lastName: 'Doe'
	},
	fruits:
	[
		'Apple',
		'Orange',
		'Banana',
		'Pear'
	]
};
var model = new Emboss.Model(
{
	template: '#app',
	target: 'app',
	data: data
});
console.log(data);
window.model = model;
window.data = data;
data.fruits[0] = 'Raspberry';
data.message = {a: 1, b: 2};
data.message.b = {c: 3, d: 4};
templateTest();*/
/*var renderFunction = Emboss.compile(document.querySelector('#app'));
console.log(renderFunction);
renderFunction(document.querySelector('body'),
{
	engine: 'Emboss',
	version: '0.1',
	subtitle: 'Data binding and template engine.',
	fruits:
	[
		'Raspberry',
		'Apple',
		'Pear',
		'Banana'
	]
});*/