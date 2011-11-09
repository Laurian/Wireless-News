var byLine = $('div.byline').text();

if (
	   byLine.indexOf("Tribune News Services") > -1
	|| byLine.indexOf("Reuters") > -1
	|| byLine.indexOf("CNN") > -1
	|| byLine.indexOf("Associated Press") > -1
	) {
	self.postMessage("byline: " + byLine + " for " + window.location.href);
}
