var this_page_id;

const btn_next = $('#pnl_editpage1-btn_next'); 



export async function init(opt) {
	this_page_id = opt.id
	

	btn_next.linkbutton({onClick: () => { btn_next_click() }});


	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
			// $ui.getPages().show('pnl_edit')
		}
	})

	document.addEventListener('OnButtonHome', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
		}
	})

	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	
}


export function OnSizeRecalculated(width, height) {
}



export function OpenDetil(data) {
}


function btn_next_click() {
	var nextpnlname = 'pnl_editpage2';
	$ui.getPages().show(nextpnlname, () => {
		$ui.getPages().ITEMS[nextpnlname].handler.FormatPage()
	})
}