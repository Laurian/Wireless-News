// get the byline text
var byLine = $('div.byline').text();

// look inside for offenders
if (
	   byLine.indexOf("Tribune News Services") > -1
	|| byLine.indexOf("Reuters") > -1
	|| byLine.indexOf("CNN") > -1
	|| byLine.indexOf("Associated Press") > -1
	) {
	// notify on match
	self.postMessage("match");
}
