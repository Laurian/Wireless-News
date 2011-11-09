const widgets = require("widget");
const data = require("self").data;
const pageMod = require("page-mod");
const pageWorkers = require("page-worker");

// match Chicago Tribune's homepage only
pageMod.PageMod({
    include: ["http://www.chicagotribune.com/"],
    contentScriptWhen: 'ready',
    contentScriptFile: [
		data.url('jquery-1.7.js'),
		data.url('pagemod.js'),
	],
    onAttach: function onAttach(worker) {
		worker.on("message", function (href) {
			// when a page mod sends an URL, start a page worker on it
			pageWorkers.Page({
				allow: {
					script: false // do not execute external scripts on the page for speed and memory conservation
				}, 
				contentURL: href,
				contentScriptFile: [
					data.url('jquery-1.7.js'),
					data.url('pageworker.js')
				],
				contentScriptWhen: "ready",
				onMessage: function(byline) {
					// we have a match, send the URL back to the page mod
					worker.postMessage(href);
				}
			});
		});
    }
});
