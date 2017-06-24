'use strict';

let awaiting = null;
let observations = {};
let updatesSuppressed = [];

export function awaitGet(node, renderer, additionalParameters)
{
	if (typeof additionalParameters === 'undefined')
	{
		additionalParameters = null;
	};
	awaiting =
	{
		node: node,
		renderer: renderer,
		additionalParameters: additionalParameters
	};
};

export function ignoreGet()
{
	awaiting = null;
};

export function observeAwaiting(path)
{
	observe(path, awaiting.node, awaiting.renderer, awaiting.additionalParameters);
};

export function observe(path, node, renderer, additionalParameters)
{
	createObservation(path);
	var observation = getObservation(path);
	if (!isNodeObserved(observation, node))
	{
		observation.nodes.push(createObservationNode(node, renderer, additionalParameters));
	};
};

export function createObservation(path)
{
	var observation = observations[path];
	if (!observation)
	{
		observation = observations[path] =
		{
			path: path,
			nodes: []
		};
	};
};

export function createObservationNode(node, renderer, additionalParameters)
{
	var node =
	{
		node: node,
		renderer: renderer,
		additionalParameters: additionalParameters
	};
	return node;
};

export function getObservation(path)
{
	return observations[path];
};

export function isNodeObserved(observation, node)
{
	for (var nodeIndex = 0; nodeIndex < observation.nodes.length; nodeIndex++)
	{
		var compareNode = observation.nodes[nodeIndex];
		if (compareNode.node === node)
		{
			return true;
		};
	};
	return false;
};

export function update(path, newValue)
{
	console.log('Updating: ' + path + '.');
	var observation = getObservation(path);
	if (observation)
	{
		for (var nodeIndex = 0; nodeIndex < observation.nodes.length; nodeIndex++)
		{
			var node = observation.nodes[nodeIndex];
			if (!isUpdateSuppressed(node.node))
			{
				node.renderer(newValue, node.additionalParameters);
			};
		};
	};
};

export function suppressUpdate(node)
{
	if (node instanceof Node)
	{
		updatesSuppressed.push(node);
	}
	else
	{
		utilities.throwError({message: 'Update suppression requires node of type Node.'});
	};
};

export function isUpdateSuppressed(node)
{
	if (updatesSuppressed.indexOf(node) > -1)
	{
		return true;
	}
	else
	{
		return false;
	};
};

export function unsuppressUpdate(node)
{
	updatesSuppressed.splice(updatesSuppressed.indexOf(node), 1);
};