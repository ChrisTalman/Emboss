'use strict';

export namespace COMPILE
{
	export const BLOATSPACE = /[\f\n\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]/g;
	export namespace SYNTAX
	{
		export namespace HTML
		{
			export const BLOCK_EXPRESSION = /(<\/?[a-z][a-z0-9]* *(?: *(?:[a-z_:][a-z0-9_:\-]*(?:\.(?:bind))?(?:=(?:(?:"[^"]*")|(?:'[^']*')))?))* *>)/i;
			export namespace ATTRIBUTE
			{
				export const EXPRESSION = /([a-z_:][a-z0-9_:\-]*(?:\.(?:bind))?)(?:=(?:(?:"([^"]*)")|(?:'([^']*)')))?/ig;
				export namespace INDEXES
				{
					export const NAME = 1;
					export const VALUE = 2;
				};
			};
			export namespace CHILDLESS_KEYWORDS
			{
				export const AREA = 'area';
				export const BR = 'br';
				export const EMBED = 'embed';
				export const HR = 'hr';
				export const IMG = 'img';
				export const INPUT = 'input';
				export const KEYGEN = 'keygen';
				export const LINK = 'link';
				export const META = 'meta';
				export const PARAM = 'param';
				export const SOURCE = 'source';
				export const TRACK = 'track';
				export const WBR = 'wbr';
			};
		};
		export namespace EMBOSS
		{
			export const BLOCK_EXPRESSION = /({{.*?}})/i;
			export namespace KEYWORDS
			{
				export const PRINT = 'print';
				export const IF = 'if';
				export const ELSE_IF = 'elseif';
				export const ELSE = 'ELSE';
				export const FOR = 'for';
				export const EACH = 'each';
				export const IMPORT = 'import';
				export const EXECUTE = 'execute';
				export const IGNORE = 'ignore';
				export const NEGLECT = 'neglect';
			};
			export namespace SECOND_ORDER_KEYWORDS
			{
				export const IN = 'in';
				export const COUNT = 'count';
				export const KEY = 'key';
				export const CONTEXT = 'context';
			};
			export namespace CHILDLESS_KEYWORDS
			{
				export const PRINT = 'print';
				export const IMPORT = 'import';
				export const EXECUTE = 'execute';
			};
		};
	};
	export namespace RENDER
	{
		export namespace IDENTIFIERS
		{
			export const DATA_OBJECT = 'data';
			export const WINDOW_OBJECT = 'window';
		};
	};
};