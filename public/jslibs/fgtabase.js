export const STATE = {}
export const PANELS = {}



/**
 * ready
 * di panggil pada saat window modul telah selesai dimuat
 */
export async function ready() {
	console.log(`module ready`);
}


/**
 * init
 * di panggil pada setiap modul selesai dimuat
 * digunakan untuk melakukan inisiasi di tingkat modul
 * pada uibase, fungsi ini kosong
 * apabila akan di gunakan, fungsi ini di ovveride pada modul
 */
export async function init() {
	console.log('module initialization not created yet')
}




export async function CreatePanelPages(panels, param) {
	var fp;
	var previouspanel = null;
	for (var p of panels) {
		var panel = p.panel;
		panel.handler = p.handler;
		panel.previouspanel = previouspanel;

		let id = panel.id;
		panel.show = function() {
			showPanel(id);
		}

		if (panel.handler!==undefined) {
			if (typeof panel.handler.init==='function') {
				await panel.handler.init(param);
			}
		}

		PANELS[id] = panel;
		panel.style.display = 'none';
		if (fp===undefined) {
			fp = panel;
			fp.style.display = 'block';
			STATE.currentpanel_id = id;
		}

		previouspanel = panel;
	}


	var open_panel_id = window.location.hash.substr(1);
	if (open_panel_id!="") {
		showPanel(open_panel_id);
		console.log(open_panel_id);
	}
	
}


export function showPanel(id) {
	if (id===STATE.currentpanel_id) {
		return;
	}

	var panelfound = false;
	for (var panel_id in PANELS) {
		var panel = PANELS[panel_id]
		if (panel.id===id) {
			panelfound=true;
			panel.style.display = 'block';
			panel.style.visibility = 'visible';
			panel.style.opacity = 1;
			STATE.currentpanel_id = panel.id;
		} else {
			panel.style.display = 'none';
			panel.style.visibility = 'hidden';
			panel.style.opacity = 0;
		}
	}

	if (!panelfound) {
		console.error(`panel ${id} not found.`);
		alert(`panel ${id} not found.`)
	}

}



export function showPreviousPanel() {
	var panel = PANELS[STATE.currentpanel_id];
	if (panel.previouspanel!=null) {
		showPanel(panel.previouspanel.id);
	}
}


export function getPanel(panel_id) {
	return PANELS[panel_id];
}

export function getPanelHandler(panel_id) {
	var panel = getPanel(panel_id);
	return panel.handler;
}
