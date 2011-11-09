const widgets = require("widget");
const data = require("self").data;
const pageMod = require("page-mod");
const pageWorkers = require("page-worker");
const tabs = require("tabs");

var workers = [];

// var widget = widgets.Widget({
//     id: "wirelessnews",
//     label: "Toggle Wireless News",
//     contentURL: "http://www.mozilla.org/favicon.ico",
//     onClick: function() {
//         tabs.open("http://www.chicagotribune.com/");
//     }
// });

pageMod.PageMod({
    include: ["http://www.chicagotribune.com/"],
    contentScriptWhen: 'ready',
    contentScriptFile: [
		data.url('jquery-1.7.js'),
		data.url('pagemod.js'),
	],
    onAttach: function onAttach(worker) {
        workers.push(worker);
		worker.on("message", function (href) {
			// console.log(href);

			pageWorkers.Page({
				allow: {
					script: false
				}, 
				contentURL: href,
				contentScriptFile: [
					data.url('jquery-1.7.js'),
					data.url('pageworker.js')
				],
				contentScriptWhen: "ready",
				onMessage: function(byline) {
					// console.log(byline);
					worker.postMessage(href);
				}
			});
		});
		//worker.postMessage('/business/sns-rt-us-markets-stockstre7a61ka-20111107,0,5730442.story');
    }
});

// tabs.open("http://www.chicagotribune.com/");