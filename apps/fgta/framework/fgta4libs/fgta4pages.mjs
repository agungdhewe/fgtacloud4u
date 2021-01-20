export const ITEMS = {}


var CurrentPage = null
var slider = null;
var PAGES = null;

export function initPages(pages, opt) {
	var pagenum = 0;
	for (let page of pages) {
		pagenum++
		let id = page.panel.attr('id')
		
		page.panel.id = id
		page.panel.pagenum = pagenum
		page.panel.handler = page.handler

		ITEMS[id] = page.panel

		if (typeof ITEMS[id].handler.init === 'function') {
			if (opt!=null) {
				ITEMS[id].handler.init(Object.assign(opt, {id:id, pagenum:pagenum}));
			} else {
				ITEMS[id].handler.init({id:id, pagenum:pagenum});
			}
		}

		if (CurrentPage==null) {
			CurrentPage = id
			ITEMS[id].show(()=>{
				var showed = ITEMS[id].handler.showed;
				if (typeof showed === 'function') {
					setTimeout(()=>{
						showed();
					}, 100)
				}
			})
		} else {
			ITEMS[id].hide()
		}
	}


	


	return this
}

export function setSlider(fgta4pageslider) {
	slider = fgta4pageslider

	return this
}

export function getCurrentPage() {
	return CurrentPage;
}



export function show(objpage, fn_callback) {
	var page_id;
	if (typeof objpage !== 'string') {
		if (objpage!=null) {
			if (objpage.id != null) {
				page_id = objpage.id
			} else {
				console.error('parameter page pada show() salah');
			}
		} else {
			console.error('parameter page pada show() salah');
		}
	} else {
		page_id = objpage;
	}


	if (ITEMS[page_id]==null) {
		console.error(`${page_id} tidak ditemukan!`)
		return
	}

	if (page_id==CurrentPage)
		return

	var prev_page = ITEMS[CurrentPage]
	var next_page = ITEMS[page_id]

	CurrentPage = page_id
	if (next_page.pagenum>prev_page.pagenum) {
		slider.SlidePanelLeft(prev_page, next_page, false, fn_callback)
	} else {
		slider.SlidePanelRight(prev_page, next_page, false, fn_callback)
	}

	return ITEMS[page_id]

}

