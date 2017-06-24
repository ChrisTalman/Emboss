'use strict';

// Internal Modules
import * as Component from './Component.ts';

// Component
let data =
{
	message: 'Hello World'
};
window.data = data;
let component = new Component.Component(
	{
		data: data
	}
);
window.component = component;