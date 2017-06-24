'use strict';

// Internal Modules
import * as Utilities from 'Utilities.ts';

// Render
export function render(template, target, model)
{
	model = preprocess(model);
	if (typeof template === 'function')
	{
		return internalRender(template, target, model);
	}
	else if (template instanceof HTMLScriptElement || typeof template === 'string')
	{
		return internalRender(compile.compile(template), target, model);
	}
	else
	{
		Utilities.throwError(
			{
				message: 'Template must be HTMLScriptElement, function, or string.'
			}
		);
	};
};

// Preprocess
export function preprocess(model)
{
	if (typeof model === 'object')
	{
		return model;
	}
	else
	{
		Utilities.throwError(
			{
				message: 'Model must be object.'
			}
		);
	};
};

// Internal Render
export function internalRender(renderer, target, model)
{
	try
	{
		return renderer.call(null, target, model);
	}
	catch (ErrorEvent)
	{
		Utilities.throwError(
			{
				message: 'Error during template render. Ensure JavaScript expressions are valid and all integral data is being provided. Error reported by JavaScript: \n' + ErrorEvent.message,
				omitTemplate: true
			}
		);
	};
};