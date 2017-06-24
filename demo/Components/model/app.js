function ()
{
	this.firstName = 'Jane';
	this.secondName = 'Doe';
	this.fullName = function()
	{
		return this.firstName + ' ' + this.secondName;
	};
};