
export async function SlidePanelRight(pnl_prev, pnl_next, pnl_prev_remove=false, fn_callback=()=>{}) {
	// ------>
	// pnl_prev.hide();
	// pnl_next.show()
	// pnl_prev.remove()
	let hide_pnl_prev = () => {
		return new Promise((resolve) => {
			pnl_prev
				.css('opacity', 1)
				.css('margin-left', '0px')			
				.animate({opacity: .2, marginLeft: '100px'}, 50, 'linear', ()=>{
					pnl_prev.hide()
					if (pnl_prev_remove===true) {
						pnl_prev.remove()
					}
					resolve(true)
				})			

		})
	}

	let show_pnl_next = () => {
		return new Promise((resolve) => {
			pnl_next
				.css('opacity', 0)
				.css('margin-left', '-100px')
			
			pnl_next.show();	
			pnl_next.animate({opacity: 1, marginLeft: '0px'}, 100, 'linear', ()=>{
				resolve(true)
			})			
		})
	}	

	await hide_pnl_prev();
	await show_pnl_next()	

	if (typeof fn_callback === 'function') {
		fn_callback(pnl_next);
	}

}

export async function SlidePanelLeft(pnl_prev, pnl_next, pnl_prev_remove=false, fn_callback=()=>{}) {
	// <-------
	// pnl_prev.hide()
	// pnl_next.show()
	// pnl_prev.remove()
	let hide_pnl_prev = () => {
		return new Promise((resolve) => {
			pnl_prev
				.css('opacity', 1)
				.css('margin-left', '0px')			
				.animate({opacity: .2, marginLeft: '-30px'}, 50, 'linear', ()=>{
					pnl_prev.hide()
					if (pnl_prev_remove===true) {
						pnl_prev.remove()
					}
					resolve(true)
				})			

		})
	}

	let show_pnl_next = () => {
		return new Promise((resolve) => {
			pnl_next
				.css('opacity', 0)
				.css('margin-left', '200px')
			
			pnl_next.show();	
			pnl_next.animate({opacity: 1, marginLeft: '0px'}, 100, 'linear', ()=>{
				resolve(true)
			})			
		})
	}


	await hide_pnl_prev();	
	await show_pnl_next();

	if (typeof fn_callback === 'function') {
		fn_callback(pnl_next);
	}

}
