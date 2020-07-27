export function Component(el, opt) {
	return {
		// handle: function(eventname, fn_handler) {
		// 	el.addEventListener(eventname, fn_handler);
		// },
		states: {
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
}