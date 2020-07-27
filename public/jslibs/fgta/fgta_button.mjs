import { Component } from './fgta__component-base.mjs'




var EVENTS = {
	// 'ngikngok' : (params) => { Textbox_Ngikngok(comp, params) }
}


export function Button(obj, opt) {
	if (opt==null) { opt = {} }
	Object.assign(opt, {
		EVENTS: EVENTS
	});

	var el = (typeof obj==='string') ?  document.getElementById(obj) : obj;
	var comp = Object.assign(el, Component(el, opt));

	// Object.defineProperty(comp, 'Text', {
	// 	get: function() { return el.value; },
	// 	set: function(text) { el.value = text; }
	// });

	return comp;
}

