import { Component } from './fgta__component-base.mjs'



var EVENTS = {
}

var ITEMS = {

}

export function Form(obj, opt) {
	if (opt==null) { opt = {} }
	Object.assign(opt, {
		EVENTS: EVENTS
	});

	var el = (typeof obj==='string') ?  document.getElementById(obj) : obj;
	var comp = Object.assign(el, Component(el, opt));
	

	PrepareProperties(comp);
	comp.Readonly = false;


	comp.addEventListener('submit', function(ev) {
		ev.preventDefault();
		return false;
	})

	comp.CheckError = async function (fn_on_error) {
		return await Form_CheckError(comp, fn_on_error);
	}  


	comp.add = function(obj) {
		Form_add(comp, obj);
	}

	return comp;
}


function Form_add(comp, obj) {
	for (var obj_id in ITEMS) {
		if (obj_id == obj.id) {
			return;
		}
	}

	ITEMS[obj.id] = obj;

	return obj;
}


function PrepareProperties(comp) {
	// Readonly
	Object.defineProperty(comp, 'Readonly', {
		get: function() { return comp.states.readonly; },
		set: function(value) { 
			comp.states.readonly = value;
			Form_Readonly_Set(comp, value);
		}
	});	


	Object.defineProperty(comp, 'Items', {
		get: function() { return ITEMS; }
		
	});	
}


async function Form_CheckError(comp, fn_on_error) {
	try {
		var ip = comp.elements;
		for (var i=0; i<ip.length; i++) {
			var CheckedElement = ip[i];
			if (!CheckedElement.checkValidity()) {
				var invalidMessage = CheckedElement.getAttribute('invalidMessage');
				if (invalidMessage!=null) {
					var err = new Error(invalidMessage);
					err.CheckedElement = CheckedElement;
					throw err;
				}
				break;
			}
		}

		return false;
	} catch (err) {
		if (typeof fn_on_error==='function') {
			await fn_on_error(err);
			return true;
		} else {
			err.isInvalidForm = true;
			throw err;
		}
	}

}

function Form_Readonly_Get(comp) {

}

function Form_Readonly_Set(comp, value) {
	var ip = comp.elements;
	for (var i=0; i<ip.length; i++) {
		var el = ip[i];
		switch (el.type) {
			case 'text' :
				
				break;

			case 'checkbox' :
				
				break;
		}
	}
}


