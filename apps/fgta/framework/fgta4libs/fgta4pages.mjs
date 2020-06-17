export const ITEMS = {}


var CurrentPage = null
var slider = null;
var PAGES = null;

export function initPages(pages, args) {
	var pagenum = 0;
	for (let page of pages) {
		pagenum++
		let id = page.panel.attr('id')
		
		page.panel.id = id
		page.panel.pagenum = pagenum
		page.panel.handler = page.handler

		ITEMS[id] = page.panel

		if (typeof ITEMS[id].handler.init === 'function') {
			ITEMS[id].handler.init({id:id, pagenum:pagenum, args: args})
		}

		if (CurrentPage==null) {
			CurrentPage = id
			ITEMS[id].show()
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



export function show(page_id, fn_callback) {
	if (ITEMS[page_id]==null)
		return

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

