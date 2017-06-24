'use strict';

let here = false;

// External Modules
import * as jsep from 'jsep';

// Internal Modules
import * as Utilities from './Utilities.ts';
import * as Constants from './Constants.ts';

console.log(Utilities.arrayClearEmptyStrings(['a', '', 'b']));
console.log(Constants);

/*(function()
{
	// Library Initialisation
	var libraryInterfaceName = 'EmbossCompiler';
	if (window[libraryInterfaceName])
	{
		throw 'EmbossError: Emboss could not be initialised due to name conflict.';
	}
	else
	{
		window[libraryInterfaceName] = new Emboss();
	};
	function Emboss()
	{
		// Constants
		var arrayInterceptMethods = ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'];
		var primitiveTypes = ['number', 'boolean', 'string'];
		// Public Methods
		// this.compile
		// Compile
		var compile =
		{
			compile: function(source)
			{
				var preprocessed = this.preprocess(source);
				//console.log(preprocessed);
				var tree = this.generateTree(preprocessed.source, preprocessed.templateID);
				console.log(tree);
				var renderFunction = this.compileRenderer(tree);
				return renderFunction;
			},
			preprocess: function(source)
			{
				var preprocessed =
				{
					source: null,
					templateID: null
				};
				if (source === undefined || source === null)
				{
					Utilities.throwError(
					{
						message: 'Source undefined or null.'
					});
				}
				else
				{
					// Components need to accept render functions (perhaps this is only relevant to the runtime library)
					if (source instanceof HTMLScriptElement)
					{
						preprocessed.source = source.innerHTML;
						preprocessed.templateID = source.id;
					}
					else if (typeof source === 'string')
					{
						preprocessed.source = source;
					}
					else
					{
						Utilities.throwError(
						{
							message: 'Source must be HTMLScriptElement or string.'
						});
					};
				};
				preprocessed.source = preprocessed.source.replace(this.bloatspace, '');
				return preprocessed;
			},
			generateTree: function(source, templateID)
			{
				var blocks = source.split(this.htmlSyntax.blockExpression);
				Utilities.arrayClearEmptyStrings(blocks);
				var blockPointer = null;
				var blockStack = [];
				var blockTree = [];
				for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++)
				{
					var blockText = blocks[blockIndex];
					var block = this.generateBlock(blockText, blockPointer);
					if (block.type === 'html')
					{
						if (block.closer)
						{
							if (blockStack.length === 0)
							{
								Utilities.throwError({message: 'No opening tag: got closer "' + block.keyword + '" without opener.'});
							}
							else
							{
								var openerBlock = blockStack.pop();
								if (openerBlock.keyword === block.keyword)
								{
									blockPointer = blockPointer.parent;
								}
								else
								{
									Utilities.throwError({message: 'Invalid closer: got "' + block.keyword + '", expected "' + openerBlock.keyword + '".'});
								};
							};
						}
						else
						{
							this.addBlockToTree(blockTree, blockPointer, block);
							if (!this.htmlSyntax.childlessKeywords[block.keyword])
							{
								blockStack.push(block);
								blockPointer = block;
							};
						};
					}
					else if (block.type === 'text')
					{
						var textBlocks = block.text.split(this.embossSyntax.blockExpression);
						Utilities.arrayClearEmptyStrings(textBlocks);
						for (var fromTextBlockIndex = 0; fromTextBlockIndex < textBlocks.length; fromTextBlockIndex++)
						{
							var fromTextBlockText = textBlocks[fromTextBlockIndex];
							var fromTextBlock = this.geneateBlockFromText(fromTextBlockText, blockPointer);
							if (fromTextBlock.type === 'emboss')
							{
								if (fromTextBlock.closer)
								{
									if (blockStack.length === 0)
									{
										Utilities.throwError({message: 'No opening tag: got closer "' + fromTextBlock.keyword + '" without opener.'});
									}
									else
									{
										var openerBlock = blockStack.pop();
										if (openerBlock.keyword === fromTextBlock.keyword)
										{
											blockPointer = blockPointer.parent;
										}
										else
										{
											Utilities.throwError({message: 'Invalid closer: got "' + fromTextBlock.keyword + '", expected "' + openerBlock.keyword + '".'});
										};
									};
								}
								else
								{
									this.addBlockToTree(blockTree, blockPointer, fromTextBlock);
									if (this.embossSyntax.keywords[this.embossSyntax.childlessKeywords[fromTextBlock.keyword]])
									{
										// Import
									}
									else
									{
										blockStack.push(fromTextBlock);
										blockPointer = fromTextBlock;
									};
								};
							}
							else
							{
								this.addBlockToTree(blockTree, blockPointer, fromTextBlock);
							};
						};
					};
				};
				if (blockStack.length > 0)
				{
					var openerBlock = blockStack[blockStack.length - 1];
					Utilities.throwError({message: 'No closing tag: got "' + openerBlock.keyword + '" without closer.'});
				};
				return blockTree;
			},
			generateBlock: function(blockText, parent)
			{
				// May need to take account of HTML comments.
				var isHtmlBlock = this.htmlSyntax.blockExpression.test(blockText);
				if (isHtmlBlock)
				{
					return this.generateHtmlBlock(blockText, parent);
				}
				else
				{
					return this.generateTextBlock(blockText, parent);
				};
			},
			geneateBlockFromText: function(blockText, parent)
			{
				// Might not be safe to run this on plaintext. For example, if Emboss block is at start of plaintext block, this might wrongly detect it as being an Emboss block.
				var isEmbossBlock = this.embossSyntax.blockExpression.test(blockText);
				if (isEmbossBlock)
				{
					return this.generateEmbossBlock(blockText, parent);
				}
				else
				{
					return this.generateTextBlock(blockText, parent);
				};
			},
			generateHtmlBlock: function(blockText, parent)
			{
				var innerText = blockText.replace(/[<>]/g, '');
				var spaceIndex = innerText.indexOf(' ');
				var keyword = innerText;
				var attributesText = '';
				var attributes = [];
				var closer = false;
				if (spaceIndex > -1)
				{
					keyword = innerText.slice(0, spaceIndex);
					attributesText = innerText.slice(spaceIndex + 1);
				};
				if (keyword.substring(0, 1) === '/')
				{
					closer = true;
					keyword = keyword.substring(1);
				}
				else
				{
					var matches = [];
					while ((matches = this.htmlSyntax.attribute.expression.exec(attributesText)) !== null)
					{
						var attributeType = 'standard';
						var attributeName = matches[this.htmlSyntax.attribute.indexes.attributeName];
						var attributeCommand = null;
						var attributeValue = matches[this.htmlSyntax.attribute.indexes.attributeValue];
						var attributeNameParts = attributeName.split('.');
						if (attributeNameParts.length > 1)
						{
							attributeCommand = attributeNameParts.slice(1, attributeNameParts.length).join('.');
							if (attributeCommand)
							{
								attributeName = attributeNameParts[0];
								attributeType = 'command';
								attributeValue = this.getRenderBlockExpression(attributeValue);
							};
						};
						attributes.push(
						{
							type: attributeType,
							name: attributeName,
							command: attributeCommand,
							value: attributeValue
						});
					};
				};
				var block =
				{
					type: 'html',
					parent: parent,
					text: blockText,
					keyword: keyword,
					attributes: attributes,
					closer: closer,
					children: []
				};
				return block;
			},
			generateEmbossBlock: function(blockText, parent)
			{
				var innerText = blockText.replace(/[{}]/g, '');
				var spaceIndex = innerText.indexOf(' ');
				var keyword = innerText;
				var argument = '';
				var closer = false;
				if (spaceIndex > -1)
				{
					keyword = innerText.slice(0, spaceIndex);
					argument = innerText.slice(spaceIndex + 1);
				};
				if (keyword.substring(0, 1) === '/')
				{
					closer = true;
					keyword = keyword.substring(1);
				};
				var block =
				{
					type: 'emboss',
					parent: parent,
					text: blockText,
					keyword: keyword,
					argument: argument,
					arguments: {},
					closer: closer,
					children: []
				};
				if (!block.closer && block.keyword !== this.embossSyntax.keywords['else'])
				{
					if (block.keyword === this.embossSyntax.keywords['each'])
					{
						this.setEachArguments(block);
					}
					else
					{
						block.argument = this.getRenderBlockExpression(block.argument);
					};
				};
				return block;
			},
			setEachArguments: function(block)
			{
				var argument = block.argument.trim();
				var frontPartExpression = /^([a-z_][\w]*) in /;
				var backPartExpression = /(?: (count|key) ([a-z_][\w]*)(?: (count|key) ([a-z_][\w]*))?)$/;
				var frontPart = frontPartExpression.exec(argument);
				var backPart = backPartExpression.exec(argument);
				var itemIdentifier = null;
				var arrayExpression = null;
				var countIdentifier = null;
				var keyIdentifier = null;
				if (frontPart)
				{
					itemIdentifier = frontPart[1];
					if (itemIdentifier)
					{
						if (backPart)
						{
							arrayExpression = argument.substring(frontPartExpression.exec(argument)[0].length, backPartExpression.exec(argument).index);
							var keywords = [{keyword: backPart[1], identifier: backPart[2]}, {keyword: backPart[3], identifier: backPart[4]}];
							for (var index in keywords)
							{
								var keyword = keywords[index];
								if (keyword.keyword)
								{
									if (keyword.keyword === this.embossSyntax.secondOrderKeywords['count'])
									{
										countIdentifier = keyword.identifier;
									}
									else
									{
										keyIdentifier = keyword.identifier;
									};
								};
							};
						}
						else
						{
							arrayExpression = argument.substring(frontPart[0].length, argument.length);
						};
					}
					else
					{
						Utilities.throwError({message: 'Item identifier not found.', block: block});
					};
				}
				else
				{
					Utilities.throwError({message: 'Each arguments not found.', block: block});
				};
				block.arguments.itemIdentifier = itemIdentifier;
				block.arguments.arrayExpression = this.getRenderBlockExpression(arrayExpression);
				block.arguments.countIdentifier = countIdentifier;
				block.arguments.keyIdentifier = keyIdentifier;
			},
			generateTextBlock: function(blockText, parent)
			{
				var block =
				{
					type: 'text',
					parent: parent,
					text: blockText
				};
				return block;
			},
			appendBlockToBlock: function(parent, child)
			{
				parent.children.push(child);
			},
			addBlockToTree: function (tree, blockPointer, block)
			{
				if (blockPointer)
				{
					this.appendBlockToBlock(blockPointer, block);
				}
				else
				{
					tree.push(block);
				};
			},
			conductImportStatement: function(block)
			{
				var firstDelimiterIndex = block.argument.indexOf('\'');
				var secondDelimiterIndex = -1;
				if (firstDelimiterIndex > -1)
				{
					secondDelimiterIndex = block.argument.indexOf('\'', firstDelimiterIndex + 1);
				};
				if (firstDelimiterIndex > -1 && secondDelimiterIndex > -1)
				{
					var templateID = block.argument.substring(firstDelimiterIndex + 1, secondDelimiterIndex);
					var scriptElement = document.getElementById(templateID);
					if (scriptElement)
					{
						return {scriptElement: scriptElement, templateID: templateID};
					}
					else
					{
						Utilities.throwError({message: 'Could not find script element for import expression.', block: block});
					};
				}
				else
				{
					Utilities.throwError({message: 'Missing script ID in import expression.', block: block});
				};
			},
			compileRenderer: function(tree, templateID)
			{
				var code = this.compileRendererCode(tree);
				try
				{
					var renderer = new Function('target', 'model', code);
				}
				catch (ErrorEvent)
				{
					Utilities.throwError({message: 'Error in template. Ensure JavaScript expressions are valid. Error reported by JavaScript: \n' + ErrorEvent.message, templateID: templateID});
				};
				console.log(renderer);
				return renderer;
			},
			compileRendererCode: function(tree)
			{
				var code = '"use strict";';
				code += 'var model = model;';
				code += 'var nodePointer = target;';
				code += 'var nodeStack = [target];';
				code += 'var data = model.__model__.data;';
				code += 'nodePointer.innerHTML = "";';
				code += 'var ifParentNode = null;';
				code += 'var ifLastNode = null;';
				code += this.inspectChildren(tree);
				return code;
			},
			inspectChildren: function(children)
			{
				var code = '';
				var ifPointer = null;
				var ifBlocks = [];
				for (var blockIndex = 0; blockIndex < children.length; blockIndex++)
				{
					var block = children[blockIndex];
					if (block.type === 'emboss' && (block.keyword === this.embossSyntax.keywords['if'] || block.keyword === this.embossSyntax.keywords['elseif'] || block.keyword === this.embossSyntax.keywords['else']))
					{
						if (block.keyword === this.embossSyntax.keywords['if'])
						{
							ifPointer = block;
						}
						else
						{
							if (!ifPointer)
							{
								Utilities.throwError({message: 'Must be preceded by if tag.', block: block});
							};
						};
						ifBlocks.push(block);
						var nextBlock = children[blockIndex + 1];
						if (blockIndex === (children.length - 1) || (nextBlock.type !== 'emboss' || (nextBlock.type === 'emboss' && nextBlock.keyword === this.embossSyntax.keywords['if'])))
						{
							code += this.getRenderIfCode(ifBlocks);
							ifPointer = null;
							ifBlocks = [];
						};
					}
					else
					{
						code += this.inspectBlock(block);
					};
				};
				return code;
			},
			getRenderIfCode: function(ifBlocks)
			{
				var code = '';
				code += this.getRenderBlockScopeStartCode();
				code += 'var ifBranches = [];';
				code += 'var ifPreviousBranchIndex = null;';
				code += 'var ifParentNode = nodePointer;';
				code += 'var ifFirstNode = null;';
				code += 'var ifLastNode = null;';
				code += 'ifFirstNode = document.createTextNode("");';
				code += 'nodePointer.appendChild(ifFirstNode);';
				code += 'ifLastNode = document.createTextNode("");';
				code += 'nodePointer.appendChild(ifLastNode);';
				for (var ifBlockIndex = 0; ifBlockIndex < ifBlocks.length; ifBlockIndex++)
				{
					var ifBlock = ifBlocks[ifBlockIndex];
					code += this.inspectBlock(ifBlock);
				};
				code += 'var getIfBranchIndex = function(){';
				code += 'Emboss.View.awaitGet(ifFirstNode, updateIfCompound, {nodePointer: nodePointer});';
				for (var ifBlockIndex = 0; ifBlockIndex < ifBlocks.length; ifBlockIndex++)
				{
					var ifBlock = ifBlocks[ifBlockIndex];
					if (ifBlock.keyword === this.embossSyntax.keywords['if'])
					{
						code += 'if (' + ifBlock.argument + '){';
						code += 	'return ' + ifBlockIndex + ';';
						code += '}';
					}
					else if (ifBlock.keyword === this.embossSyntax.keywords['elseif'])
					{
						code += 'else if (' + ifBlock.argument + '){';
						code += 	'return ' + ifBlockIndex + ';';
						code += '}';
					}
					else if (ifBlock.keyword === this.embossSyntax.keywords['else'])
					{
						code += 'else {';
						code += 	'return ' + ifBlockIndex + ';';
						code += '};';
					};
				};
				code += 'Emboss.View.ignoreGet();';
				code += '};';
				code += 'var updateIfCompound = function(newValue, additionalParameters){';
				code +=		'nodePointer = additionalParameters.nodePointer;';
				code +=		'ifParentNode = nodePointer;';
				code += 	'var ifBranchIndex = getIfBranchIndex();';
				code += 	'if (ifBranchIndex !== ifPreviousBranchIndex){';
				code +=			'console.log("If changed.");';
				code +=			'var childNodesToRemove = [];';
				code +=			'var childNodeRemovable = false;';
				code +=			'for (var childIndex = 0; childIndex < ifParentNode.childNodes.length; childIndex++){';
				code +=				'var childNode = ifParentNode.childNodes[childIndex];';
				code +=				'if (childNode === ifFirstNode.nextSibling){';
				code +=					'childNodeRemovable = true;';
				code +=				'};';
				code +=				'if (childNodeRemovable){';
				code +=					'childNodesToRemove.push(childNode);';
				code +=				'};';
				code +=				'if (childNode === ifLastNode.previousSibling){';
				code +=					'childNodeRemovable = false;';
				code +=				'};';
				code +=			'};';
				code +=			'for (var childIndex = 0; childIndex < childNodesToRemove.length; childIndex++){';
				code +=				'var childNode = childNodesToRemove[childIndex];';
				code +=				'ifParentNode.removeChild(childNode);';
				code +=			'};';
				code += 		'ifBranches[ifBranchIndex]();';
				code +=			'ifPreviousBranchIndex = ifBranchIndex;';
				code +=		'};';
				code += '};';
				code += 'var ifBranchIndex = getIfBranchIndex();';
				code += 'ifBranches[ifBranchIndex]();';
				code +=	'ifPreviousBranchIndex = ifBranchIndex;';
				code += this.getRenderBlockScopeEndCode();
				return code;
			},
			inspectBlock: function(block)
			{
				var code = '';
				if (block.type === 'html')
				{
					code += this.getRenderBlockScopeStartCode();
					code += 'var newElement = document.createElement("' + block.keyword + '");';
					for (var attributeIndex = 0; attributeIndex < block.attributes.length; attributeIndex++)
					{
						var attribute = block.attributes[attributeIndex];
						if (attribute.type === 'command')
						{
							if (attribute.name === 'value')
							{
								code += 'var renderer = function(newValue){';
								code += 	'newElement.' + attribute.name + ' = newValue;';
								code += '};';
								code += 'Emboss.View.awaitGet(newElement, renderer);';
								code += 'renderer(' + attribute.value + ');';
								code += 'Emboss.View.ignoreGet();';
								code += 'newElement.addEventListener("input", function(event){';
								code += 	'Emboss.View.suppressUpdate(newElement);';
								code += 	attribute.value + ' = event.target.value;';
								code += 	'Emboss.View.unsuppressUpdate(newElement);';
								code += '});';
							}
							else
							{
								Utilities.throwError({message: 'Unknown attribute command.'});
							};
						}
						else
						{
							code += 'newElement.setAttribute("' + attribute.name + '", "' + attribute.value + '");';
						};
					};
					code += 'nodePointer.insertBefore(newElement, (ifParentNode === nodePointer ? ifLastNode : null));';
					code += 'nodeStack.push(newElement);';
					if (!this.htmlSyntax.childlessKeywords[block.keyword])
					{
						code += 'nodePointer = newElement;';
					};
					code += this.inspectChildren(block.children);
					code += 'nodeStack.pop();';
					code += 'nodePointer = nodeStack[nodeStack.length - 1];';
					code += this.getRenderBlockScopeEndCode();
				}
				else if (block.type === 'emboss')
				{
					if (block.keyword === this.embossSyntax.keywords['if'] || block.keyword === this.embossSyntax.keywords['elseif'] || block.keyword === this.embossSyntax.keywords['else'])
					{
						code += 'ifBranches.push(function(){';
						code += 	this.inspectChildren(block.children);
						code += '});';
					}
					else if (block.keyword === this.embossSyntax.keywords['print'])
					{
						code += this.getRenderBlockScopeStartCode();
						code += 'var newNode = document.createTextNode("");';
						code += 'var renderer = function(newValue){';
						code += 	'newNode.nodeValue = newValue;';
						code += '};';
						code += 'Emboss.View.awaitGet(newNode, renderer);';
						code += 'newNode.nodeValue = ' + block.argument + ';';
						code += 'Emboss.View.ignoreGet();';
						code += 'nodePointer.insertBefore(newNode, (ifParentNode === nodePointer ? ifLastNode : null));';
						code += this.getRenderBlockScopeEndCode();
					}
					else if (block.keyword === this.embossSyntax.keywords['each'])
					{
						code += this.getRenderBlockScopeStartCode();
						code += 'var data = {};';
						code += 'model.monitorProperties(model.__model__.data, data);';
						code += 'for (var eachIndex = 0; eachIndex < Object.keys(' + block.arguments.arrayExpression + ').length; eachIndex++){';
						code += 'model.monitorProperty(' + block.arguments.arrayExpression + ', Object.keys(' + block.arguments.arrayExpression + ')[eachIndex], data, "' + block.arguments.itemIdentifier + '");';
						if (block.arguments.keyIdentifier)
						{
							code += 'Object.defineProperty(data, "' + block.arguments.keyIdentifier + '", {configurable: true, enumerable: false, writable: false, value: Object.keys(' + block.arguments.arrayExpression + ')[eachIndex]});';
						};
						if (block.arguments.countIdentifier)
						{
							code += 'Object.defineProperty(data, "' + block.arguments.countIdentifier + '", {configurable: true, enumerable: false, writable: false, value: eachIndex});';
						};
						code += this.inspectChildren(block.children);
						code += '};';
						code += this.getRenderBlockScopeEndCode();
					}
					//else
					//{
					//	Utilities.throwError({message: 'Unknown Emboss block keyword: ' + block.keyword + '.'});
					//};
				}
				else if (block.type === 'text')
				{
					code += 'var newNode = document.createTextNode("' + block.text + '");';
					code += 'nodePointer.insertBefore(newNode, (ifParentNode === nodePointer ? ifLastNode : null));';
				}
				else
				{
					Utilities.throwError({message: 'Unknown block type.'});
				};
				return code;
			},
			getRenderBlockScopeStartCode: function()
			{
				return '(function(){';
			},
			getRenderBlockScopeEndCode: function()
			{
				return '})();';
			},
			getRenderBlockIfBranchStart: function()
			{
				return 'var ifRenderer = function(){';
			},
			getRenderBlockIfBranchEnd: function()
			{
				var code = 'ifBranches.push(ifRenderer);';
				code += 'ifRenderer();';
				return code;
			},
			getRenderBlockExpression: function(expression)
			{
				var treeRootNode = jsep(expression);
				var modified = this.inspectExpressionNode(treeRootNode);
				return modified;
			},
			inspectExpressionNode: function(node)
			{
				if (node.type === 'MemberExpression')
				{
					if (node.computed)
					{
						return this.inspectExpressionNode(node.object) + '[' + this.inspectExpressionNode(node.property) + ']';
					}
					else
					{
						return this.inspectExpressionNode(node.object) + '.' + this.inspectExpressionProperty(node.property);
					};
				}
				else if (node.type === 'CallExpression')
				{
					return this.inspectExpressionCall(node);
				}
				else if (node.type === 'BinaryExpression' || node.type === 'LogicalExpression')
				{
					return this.inspectExpressionNode(node.left) + ' ' + node.operator + ' ' + this.inspectExpressionNode(node.right);
				}
				else if (node.type === 'ConditionalExpression')
				{
					return this.inspectExpressionNode(node.test) + ' ? ' + this.inspectExpressionNode(node.consequent) + ' : ' + this.inspectExpressionNode(node.alternate);
				}
				else if (node.type === 'Identifier')
				{
					return '(' + this.render.identifiers.dataObject + '.hasOwnProperty("' + node.name + '")' + ' ? ' + this.render.identifiers.dataObject + ' : ' + this.render.identifiers.windowObject + ')' + '.' + node.name;
				}
				else if (node.type === 'Literal')
				{
					return node.raw;
				}
				else
				{
					Utilities.throwError({message: 'Invalid expression.'});
				};
			},
			inspectExpressionProperty: function(property)
			{
				return property.name;
			},
			inspectExpressionCall: function(node)
			{
				var argumentsModified = '';
				for (var argumentIndex = 0; argumentIndex < node.arguments.length; argumentIndex++)
				{
					var argument = node.arguments[argumentIndex];
					argumentsModified += this.inspectExpressionNode(argument);
					if (argumentIndex < (node.arguments.length - 1))
					{
						argumentsModified += ',';
					};
				};
				return this.inspectExpressionNode(node.callee) + '(' + argumentsModified + ')';
			}
		};
		this.compile = compile.compile.bind(compile);
	};
}
)();*/