// links in <a href=""> are relative, to retrieve them with a page worker they need to be qualified
// from http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
function qualifyURL(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.href;
}

// find all the links under a headline, send thir qualified URLs up the chain to be loaded by a page worker
$('.headline a').each(function(index, anchor) {
	$anchor = $(anchor);
	self.postMessage(qualifyURL($anchor.attr("href")));
});

// when an URL is send back by a page worker, locate the (relative) link in the page and hide the headline item block that contains it
self.on('message', function onMessage(href) {
	$('.headline a').each(function(index, anchor) {
		$anchor = $(anchor);
		if (href.indexOf($anchor.attr("href")) > -1) {
			$anchor.css({
				color: 	"red"
			}).parents('.headlineItem').css({
				opacity: 	0
			}).hover(function(){
				$(this).css({
					opacity: 	1
				});
			}, function(){
				$(this).css({
					opacity: 	0
				});
			});
		}
	});
});