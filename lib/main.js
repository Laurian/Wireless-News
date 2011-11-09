const widgets = require("widget");
const data = require("self").data;
const pageMod = require("page-mod");
const pageWorkers = require("page-worker");
var ss = require("simple-storage");

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
			// when a page mod sends an URL, start/enqueue a page worker on it
			enqueue(worker, href);
		});
    }
});

// a queue of [worker, url] tuples
var workers = [];
// an array of [worker, url] tuples with a page worker
var working = [];

// initialise storage history object
if (typeof ss.storage.history === "undefined") ss.storage.history = {};

function enqueue(worker, url) {
	// check storage
	var cell = ss.storage.history[url];
	if (cell == "match") {
		// console.log("***** cache hit +++++");
		worker.postMessage(url);
		return;
	} else if (cell == "no match") {
		// console.log("***** cache hit -----");
		return;
	}
	
	// not in storage, queue for processing
	workers.unshift([worker, url]);
	work();
}

function work() {
	// console.log("existing workers: " + working.length);
	
	if ( working.length > 5 || workers.length == 0) return;
	
	var tuple = workers.pop();
	working.push(tuple);
		
	var worker = tuple[0];
	var href = tuple[1];

	// console.log("running " + href);
		 
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
			// cache value
			ss.storage.history[href] = byline;
			// we have a match, send the URL back to the page mod
			if (byline == "match") worker.postMessage(href);
			// console.log(byline + " " + href);
			for (i = 0; i < working.length; i++) {
				if (working[i] == tuple)
					working.splice(i, 1);
			}
			work();
		}
	});
}
