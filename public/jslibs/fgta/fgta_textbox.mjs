import { Component } from './fgta__component-base.mjs'




var EVENTS = {
	// 'ngikngok' : (comp, params) => { Textbox_Ngikngok(comp, params) }
}

var thisform;

export function Textbox(obj, opt) {
	if (opt==null) { opt = {} }
	Object.assign(opt, {
		EVENTS: EVENTS
	});

	var el = (typeof obj==='string') ?  document.getElementById(obj) : obj;
	var comp = Object.assign(el, Component(el, opt));
	

	PrepareProperties(comp);


	return comp;
}


export function Textbox_setForm(form) {
	thisform = form;
	console.log(form);
}




function PrepareProperties(comp) {
	// Text
	Object.defineProperty(comp, 'Text', {
		get: function() { return comp.value; },
		set: function(text) { comp.value = text; }
	});

	// Readonly
	Object.defineProperty(comp, 'Readonly', {
		get: function() { return comp.value; },
		set: function(text) { comp.value = text; }
	});	
}



// function Textbox_Ngikngok(comp, params) {
// 	console.log('ini yang dilakukan saat ngikngok');
// 	comp.RaiseEvent('after_ngikngok', params);
// }