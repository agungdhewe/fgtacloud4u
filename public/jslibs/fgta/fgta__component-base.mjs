var thisform;

export function Component(el, opt) {
	var comp = {
		// handle: function(eventname, fn_handler) {
		// 	el.addEventListener(eventname, fn_handler);
		// },
		states: {
		},


		getMapping: function() {
			var mapdata = el.getAttributeNode('mapping');
			if (mapdata==null) {
				return undefined;
			} else {
				return mapdata.value;
			}
		},

		getInvalidMessage: function() {
			var attribute = el.getAttributeNode('invalidMessage');
			if (attribute==null) {
				return undefined;
			} else {
				return attribute.value;
			}
		},		

		RaiseEvent: function(eventname, params) {
			if (el["on"+eventname]!==undefined) {
				// native event
				el.dispatchEvent(params);
			} else {
				// custom event
				var event = new CustomEvent(eventname, {detail: params, cancelable: true})
				el.dispatchEvent(event);
				if (!event.defaultPrevented) {
					if (typeof opt.EVENTS[eventname] === 'function') {
						opt.EVENTS[eventname](el, params);
					}
				}
			}
		}
	}





	return comp;
}


