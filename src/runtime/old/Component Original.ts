'use strict';

export class Component
{
	constructor(model)
	{
		/*this.__model__ = model;
		this.establishObjectBackend.call(this, this.__model__.data);
		this.monitorProperties.call(this, this.__model__.data, this.__model__.data);
		this.monitorProperties.call(this, this.__model__.data, this);
		this.render();*/
	};
	private function monitorData(object)
	{
		Object.defineProperty(
			object,
			'__model__',
			{
				configurable: false,
				enumerable: false,
				value:
				{
					data: {}
				},
				writable: true
			}
		);
	};
	private function monitorProperties(principal, proxy)
	{
		var propertyKeys = Object.keys(principal);
		for (var propertyIndex = 0; propertyIndex < propertyKeys.length; propertyIndex++)
		{
			var propertyKey = propertyKeys[propertyIndex];
			if (propertyKey !== '__model__')
			{
				this.monitorProperty.call(this, principal, propertyKey, proxy, propertyKey);
			};
		};
	};
	private function monitorProperty(principal, principalKey, proxy, proxyKey)
	{
		if (principal === proxy)
		{
			this.establishModelBackendForProperty(principal, principalKey);
		};
		var principalValue = principal[principalKey];
		switch (typeof principalValue)
		{
			case 'number':
			case 'boolean':
			case 'string':
				this.monitorPrimitive.call(this, principal, principalKey, proxy, proxyKey);
				break;
			case 'object':
				this.monitorObject.call(this, principal, principalKey, proxy, proxyKey);
				if (principal === proxy)
				{
					this.establishObjectBackend.call(this, principalValue);
					principalValue.__model__.key = principalKey;
					principalValue.__model__.parent = principal;
					this.monitorProperties.call(this, principalValue, principalValue);
					if (Array.isArray(principalValue))
					{
						this.monitorArray.call(this, principal, principalKey, proxy, proxyKey);
					};
				};
				break;
		};
	};
	private function monitorPrimitive(principal, principalKey, proxy, proxyKey)
	{
		Object.defineProperty(proxy, proxyKey,
		{
			configurable: true,
			enumerable: true,
			get: (function()
			{
				if (View.awaiting)
				{
					var path = this.getPropertyPath.call(this, principal, principalKey);
					//console.log('Getting: ' + path + '.');
					View.observeAwaiting(path);
				};
				return principal.__model__.data[principalKey];
			}).bind(this),
			set: (function(newValue)
			{
				var path = this.getPropertyPath.call(this, principal, principalKey);
				//console.log('Setting: ' + path + '. Was primitive.');
				principal.__model__.data[principalKey] = newValue;
				if (primitiveTypes.indexOf(typeof newValue) === -1)
				{
					this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
				};
				View.update(path, newValue);
			}).bind(this)
		});
	};
	private function monitorArray(principal, principalKey, proxy, proxyKey)
	{
		Object.defineProperty(proxy, proxyKey,
		{
			configurable: true,
			enumerable: true,
			get: function()
			{
				return principal.__model__.data[principalKey];
			},
			set: (function(newValue)
			{
				console.log('Array modified.');
				principal.__model__.data[principalKey] = newValue;
				if (primitiveTypes.indexOf(typeof newValue) === -1)
				{
					this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
				};
			}).bind(this)
		});
		var array = principal[principalKey];
		for (var methodIndex = 0; methodIndex < arrayInterceptMethods.length; methodIndex++)
		{
			(function()
			{
				var methodKey = arrayInterceptMethods[methodIndex];
				var methodValue = Array.prototype[methodKey];
				Object.defineProperty(array, methodKey,
				{
					configurable: false,
					enumerable: false,
					value: function()
					{
						console.log('Array modified. Method: ' + methodKey + '.');
						return methodValue.apply(this, arguments);
					},
					writable: false
				});
			})();
		};
	};
	private function monitorObject(principal, principalKey, proxy, proxyKey)
	{
		Object.defineProperty(proxy, proxyKey,
		{
			configurable: true,
			enumerable: true,
			get: function()
			{
				return principal.__model__.data[principalKey];
			},
			set: (function(newValue)
			{
				console.log('Object modified.');
				principal.__model__.data[principalKey] = newValue;
				if (primitiveTypes.indexOf(typeof newValue) === -1)
				{
					this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
				};
			}).bind(this)
		});
	};
	private function establishModelBackendForProperty(object, propertyKey)
	{
		object.__model__.data[propertyKey] = object[propertyKey];
	};
	private function getPropertyPath(object, propertyKey)
	{
		var path = this.getPropertyPathRecursive.call(this, object, []);
		if (path.length === 0)
		{
			return propertyKey;
		}
		else
		{
			return path + '.' + propertyKey;
		};
	};
	private function getPropertyPathRecursive(object, branches)
	{
		if (object.__model__.key)
		{
			branches.push(object);
		};
		if (object.__model__.parent)
		{
			return this.getPropertyPathRecursive.call(this, object.__model__.parent, branches);
		}
		else
		{
			var path = '';
			for (var branchIndex = 0; branchIndex < branches.length; branchIndex++)
			{
				var branch = branches[branchIndex];
				if (branchIndex === 0)
				{
					path += branch.__model__.key;
				}
				else
				{
					path += '.' + branch.__model__.key;
				};
			};
			return path;
		};
	};
	private function render()
	{
		// Needs to handle render functions as well as the normal strings and script tags
		//render.render.call(render, this.__model__.template, this.__model__.target, this);
	};
};