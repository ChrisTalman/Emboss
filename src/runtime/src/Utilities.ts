'use strict';

export function throwError(parameters)
{
	throw 'EmbossError: ' + parameters.message;
};

export function arrayClearEmptyStrings(array)
{
	while (array.indexOf('') !== -1)
	{
		array.splice(array.indexOf(''), 1);
	};
	return array;
};

export function arraySplitStrings(array, separator)
{
	var newArray = [];
	for (var index = 0; index < array.length; index++)
	{
		var item = array[index];
		var split = item.split(separator);
		newArray = newArray.concat(split);
	};
	return newArray;
};