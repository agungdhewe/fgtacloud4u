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
	for (var p of panels) {
		var panel = p.panel;
		panel.handler = p.handler;

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
			STATE.currentpanel = id;
		}
	}

	
}


export function showPanel(id) {
	if (id===STATE.currentpanel) {
		return;
	}

	for (var panel_id in PANELS) {
		var panel = PANELS[panel_id]
		if (panel.id===id) {
			panel.style.display = 'block';
			panel.style.visibility = 'visible';
			panel.style.opacity = 1;
		} else {
			panel.style.display = 'none';
			panel.style.visibility = 'hidden';
			panel.style.opacity = 0;
		}
	}

}


