
const btn_refresh = $('#btn_refresh')


export async function init() {


	btn_refresh.linkbutton({
		onClick: () => { btn_refresh_click() }
	})		

}


function btn_refresh_click() {
	// refresh parent
	$ui.redirecttologinpage();
}