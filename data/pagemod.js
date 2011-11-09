// from http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
function qualifyURL(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.href;
}

$('.headline a').each(function(index, anchor) {
	$anchor = $(anchor);
	self.postMessage(qualifyURL($anchor.attr("href")));
});

self.on('message', function onMessage(href) {
	$('.headline a').each(function(index, anchor) {
		$anchor = $(anchor);
		if (href.indexOf($anchor.attr("href")) > -1) {
			$anchor.css({
				color: 	"red"
			});
			$anchor.parents('.headlineItem').css({
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