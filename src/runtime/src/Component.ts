'use strict';

// Component
export class Component
{
	data = null;
	constructor(model)
	{
		//this.proxyData(model.data);
		this.monitorData(model.data);
	};
	/*private proxyData(object)
	{
		this.data = new Proxy(model.data, this.handlers);
	};*/
	handlers =
	{
		get: function(target, property, receiver)
		{
			let path = this.getPropertyPath.call(this, principal, principalKey);
			console.log(path);
			//View.update(path, newValue);
			return target[property];
		}
	};
	monitorData(object)
	{
		Object.defineProperty(
			object,
			'__emboss__',
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
		this.monitorProperties.call(this, object, object);
	};
	monitorProperties(principal, proxy)
	{
		var propertyKeys = Object.keys(principal);
		for (var propertyIndex = 0; propertyIndex < propertyKeys.length; propertyIndex++)
		{
			var propertyKey = propertyKeys[propertyIndex];
			if (propertyKey !== '__emboss__')
			{
				this.monitorProperty.call(this, principal, propertyKey, proxy, propertyKey);
			};
		};
	};
	monitorProperty(principal, principalKey, proxy, proxyKey)
	{
		if (principal === proxy)
		{
			this.establishPropertyBackend(principal, principalKey);
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
					this.monitorData.call(this, principalValue);
					principalValue.__emboss__.key = principalKey;
					principalValue.__emboss__.parent = principal;
					this.monitorProperties.call(this, principalValue, principalValue);
					if (Array.isArray(principalValue))
					{
						this.monitorArray.call(this, principal, principalKey, proxy, proxyKey);
					};
				};
				break;
		};
	};
	monitorPrimitive(principal, principalKey, proxy, proxyKey)
	{
		Object.defineProperty(proxy, proxyKey,
		{
			configurable: true,
			enumerable: true,
			get: (function()
			{
				/*if (View.awaiting)
				{
					var path = this.getPropertyPath.call(this, principal, principalKey);
					console.log('Getting Primitive: ' + path + '.');
					//View.observeAwaiting(path);
				};*/
				return principal.__emboss__.data[principalKey];
			}).bind(this),
			set: (function(newValue)
			{
				var path = this.getPropertyPath.call(this, principal, principalKey);
				console.log('Setting Primitive: ' + path + '.');
				principal.__emboss__.data[principalKey] = newValue;
				if (primitiveTypes.indexOf(typeof newValue) === -1)
				{
					this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
				};
				//View.update(path, newValue);
			}).bind(this)
		});
	};
	monitorArray(principal, principalKey, proxy, proxyKey)
	{
		Object.defineProperty(proxy, proxyKey,
		{
			configurable: true,
			enumerable: true,
			get: function()
			{
				return principal.__emboss__.data[principalKey];
			},
			set: (function(newValue)
			{
				console.log('Array modified.');
				principal.__emboss__.data[principalKey] = newValue;
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
	monitorObject(principal, principalKey, proxy, proxyKey)
	{
		Object.defineProperty(proxy, proxyKey,
		{
			configurable: true,
			enumerable: true,
			get: function()
			{
				return principal.__emboss__.data[principalKey];
			},
			set: (function(newValue)
			{
				console.log('Object modified.');
				principal.__emboss__.data[principalKey] = newValue;
				if (primitiveTypes.indexOf(typeof newValue) === -1)
				{
					this.monitorProperty.call(this, principal, principalKey, proxy, proxyKey);
				};
			}).bind(this)
		});
	};
	establishPropertyBackend(object, propertyKey)
	{
		object.__emboss__.data[propertyKey] = object[propertyKey];
	};
	getPropertyPath(object, propertyKey)
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
	getPropertyPathRecursive(object, branches)
	{
		if (object.__emboss__.key)
		{
			branches.push(object);
		};
		if (object.__emboss__.parent)
		{
			return this.getPropertyPathRecursive.call(this, object.__emboss__.parent, branches);
		}
		else
		{
			var path = '';
			for (var branchIndex = 0; branchIndex < branches.length; branchIndex++)
			{
				var branch = branches[branchIndex];
				if (branchIndex === 0)
				{
					path += branch.__emboss__.key;
				}
				else
				{
					path += '.' + branch.__emboss__.key;
				};
			};
			return path;
		};
	};
};