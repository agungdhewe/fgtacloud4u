const txtCheckAll = 'Check All'
const txtUnCheckAll = 'UnCheck All'

const STATE_ORIGINAL = 0
const STATE_NEW = 1
const STATE_DELETED = 2

let _tbl_id = 0

export function fgta4grid(tbl, opt) {
	++_tbl_id
	
	var _DATA = {}
	
	let self = this
	self.tbl_id = _tbl_id
	self.DATA = _DATA
	self.table = tbl
	self.options = opt
	self.view_checkbox_column = false
	self.maps = []
	self.lasttrid = null
	self.lasttridactive = null

	// self.btnFirst = CreateButton(self, { text: 'first', OnClick: () => { btnFirst_click(self)} })
	// self.btnPrev = CreateButton(self, { text: 'prev', OnClick: () => { btnPrev_click(self)} })
	self.btnNext = CreateButton(self, { text: 'next', OnClick: () => { btnNext_click(self)} })
	// self.btnLast = CreateButton(self, { text: 'last', OnClick: () => { btnLast_click(self)} })
	self.btnCheckAll = CreateButton(self, { text: txtCheckAll, OnClick: () => { btnCheckAll_click(self)} })

	self.view_paging =  tbl.attr('paging')!==undefined ? (tbl.attr('paging').toLowerCase().trim()==='true') : false
	
	self.rowcount = 0

	var datastate_total = 0;
	var datastate_offset = 0;
	var datastate_maxrow = 0;
	var datastate_criteria = {}
	self.datastate = {
		get total() {
			return datastate_total
		},

		set total(value) {
			datastate_total = value
		},

		get offset() {
			return datastate_offset
		},

		set offset(value) {
			datastate_offset = value
		},


		get maxrow() {
			return datastate_maxrow
		},

		set maxrow(value) {
			datastate_maxrow = value
		},

		get criteria() {
			return datastate_criteria
		},

		set criteria(value) {
			datastate_criteria = value
		}		
	}


	init(self)

	return {
		get DATA() {
			return self.DATA
		},

		fill: (data) => { fill(self, data) },
		clear: () => { clear(self) },
		clearactiverow: () => { clearactiverow(self) },
		removechecked: (options) => { removechecked(self, options) },
		update: (trid, data) => { update (self, trid, data) },
		removerow: (trid) => { removerow(self, trid) },
		getLastId: () => { return getLastId(self) },
		dataload: (records) => { return dataload(self, records) }, 
		listload: (fn_listloading, fn_listloaded) => { listload(self, fn_listloading, fn_listloaded) }

	}
}




function init(self) {

	var tbl = self.table

	//init table
	tbl.head = self.table.children('thead') 

	tbl.find('tbody').remove()
	tbl.append('<tbody></tbody>')
	tbl.body =  tbl.children('tbody')


	var headnumofrows = tbl.head.children().length
	if (headnumofrows==0) {
		console.error('thead belum didefinisikan untuk mapping kolom')
		throw ('thead belum didefinisikan untuk mapping kolom')
	}

	var colmapdata = tbl.head.find('tr').find('th')
	var mapid = 0
	for (var colmap of colmapdata) {
		var el = $(colmap)
		var mapping = el.attr('mapping')
		var onclick = el.attr('onclick')
		var type = el.attr('type');
		if (mapping===undefined) {
			mapping = '__CHECKBOX__'
			self.view_checkbox_column = true
		}		

		++mapid
		self.maps.push({
			mapid: mapid,
			mapping: mapping,
			onclick: onclick,
			type: type	
		})
	}

	if (headnumofrows>1) {
		tbl.head.children()[0].remove()
	}


	if (typeof global.OnTableCheckedChange !== 'function') {
		global.OnTableCheckedChange = (chk) => {
			var trid = chk.getAttribute('trid')
			var tds = $(`#${trid}`).find('td')
			if (chk.checked) {
				tds.addClass('fgtable-row-cellselected')
			} else {
				tds.removeClass('fgtable-row-cellselected')
			}		
		}
	}

	if (typeof global.OnRowSelect !== 'function') {
		global.OnRowSelect = (trid, selected) => {
			var tds = $(`#${trid}`).find('td')
			if (selected===true) {
				tds.addClass('fgtable-row-cellactive')
			} else {
				tds.removeClass('fgtable-row-cellactive')
			}		
		}
	}


	RenderTable(self)
	RenderFooter(self)

	self.btnNext.disable()

}


function RenderTable(self) {


}

function RenderFooter(self) {
	var tbl = self.table
	var divfooter = document.createElement('div')

	divfooter.setAttribute("style", "margin-top: 15px; margin-bottom: 40px; display: flex; justify-content: space-between;")



	// check all
	var divsel = document.createElement('div')
	if (self.view_checkbox_column) {
		divsel.appendChild(self.btnCheckAll )
	}
	divfooter.appendChild(divsel)


	// paging
	var divpaging = document.createElement('div')
	if (self.view_paging) {
		// divpaging.appendChild(self.btnFirst)
		// divpaging.appendChild(document.createTextNode('|'))
		// divpaging.appendChild(self.btnPrev)
		// divpaging.appendChild(document.createTextNode('||'))
		divpaging.appendChild(self.btnNext)
		// divpaging.appendChild(document.createTextNode('|'))
		// divpaging.appendChild(self.btnLast)	
	}
	divfooter.appendChild(divpaging)

	$(divfooter).insertAfter(tbl)
}


function RenderRow(self, row) {
	var tbl = self.table
	var tr = document.createElement('tr')
	

	let trid = `tbl-${self.tbl_id}-row-${self.rowcount}`
	tr.setAttribute('id', trid)
	tr.setAttribute('dataid', self.rowcount)




	var record = row.record
	for (var col of self.maps) {
		var mapid = col.mapid;
		var mapping = col.mapping;
		var type = col.type;
		var td = document.createElement('td')

		let tdid = `${trid}-col-${mapid}`

		td.setAttribute('id', tdid)
		td.setAttribute('trid', trid)
		td.setAttribute('dataid', self.rowcount)
		td.setAttribute('mapping', mapping)
		td.mapping = mapping

		if (mapping==='__CHECKBOX__') {
			let chkid = `${trid}-checkbox`
			var chk = CreateCheckbox(self, {
				chkid: chkid,
				tdid: tdid,
				trid: trid
			})

			td.style.textAlign = 'center'
			td.addEventListener('click', (ev)=>{
				var el = document.getElementById(chkid)
				el.checked = !el.checked;
				global.OnTableCheckedChange(el)
				ev.stopPropagation()
			})
			td.appendChild(chk)
		} else if (mapping==='') {
			td.innerHTML = '';
		} else {
			if (type==='checkbox') {
				td.setAttribute("style", "text-align: center");
				if (record[mapping]===true || record[mapping]===1 || record[mapping]==='1') {
					td.innerHTML = '<input class="fgta-grid-checkbox" type="checkbox" checked style="pointer-events: none"><label></label> ';
				} else {
					td.innerHTML = '<input class="fgta-grid-checkbox" type="checkbox" style="pointer-events: none"><label></label>';
				}
			} else {
				td.innerHTML = record[mapping]
				if (row.hasCellClickEvent) {
					td.addEventListener('click', (ev) => {
						var el = document.getElementById(tdid)
						self.options.OnCellClick(el, ev)
					})
				}
			}
		}
		
		row.OnCellRender(td)

		td.classList.add('fgtable-row')
		tr.appendChild(td)

		
	}

	row.OnRender(tr)

	tr.onmouseover = () => {
		// console.log(`over ${trid} `)
		var el = document.getElementById(trid)
		for (var td of el.childNodes) {
			td.classList.add('fgtable-row-over')
		}
	}

	tr.onmouseleave = () => {
		var el = document.getElementById(trid)
		for (var td of el.childNodes) {
			td.classList.remove('fgtable-row-over')
		}
	}


	if (window.isMobileOrTablet()) {
		tr.addEventListener('click', (ev) => {
			var el = document.getElementById(trid)
			global.OnRowSelect(self.lasttridactive, false)
	
			global.OnRowSelect(trid, true)
			self.lasttridactive = trid
			row.OnClick(el, ev)
		})
	} else {
		tr.addEventListener('click', (ev) => {
			global.OnRowSelect(self.lasttridactive, false)
			global.OnRowSelect(trid, true)
			self.lasttridactive = trid
		})

		tr.addEventListener('dblclick', (ev) => {
			var el = document.getElementById(trid)
			global.OnRowSelect(self.lasttridactive, false)
	
			global.OnRowSelect(trid, true)
			self.lasttridactive = trid
			row.OnClick(el, ev)
		})
	}





	$(tr).appendTo(tbl.body)


	return tr
}


function CreateButton(self, button) {
	let active = true
	
	var text = button.text === undefined ? 'button' : button.text
	var el = document.createElement('span')

	el.setAttribute("href", "javascript:void(0)")
	el.setAttribute("style", `
		margin-left: 8px; 
		margin-right: 8px;
		-webkit-touch-callout: none; 
		-webkit-user-select: none;
		 -khtml-user-select: none;
		   -moz-user-select: none;
			-ms-user-select: none;
				user-select: none;	
	`);
	
	el.innerHTML = text

	el.isEnabled = () => {
		return active
	}

	el.enable = () => {
		active = true
		el.classList.add('fgpaging-link')
	}

	el.disable = () => {
		active = false
		el.classList.remove('fgpaging-link')
	}

	el.addEventListener('click', (ev) => {
		if (active) {
			if (typeof button.OnClick === 'function') {
				button.OnClick(self)
			}
		}
	})

	el.enable()

	return el
}


function CreateCheckbox(self, opt) {
	var el = document.createElement('input')
	el.type = 'checkbox'
	
	el.setAttribute('id', opt.chkid)
	el.setAttribute('trid', opt.trid)
	el.setAttribute('onchange', "global.OnTableCheckedChange(this)")
	el.setAttribute('rowselector', "true")

	el.addEventListener('click', (ev)=>{
		ev.stopPropagation()
	})

	return el
}


function fill(self, data) {
	var row = {
		OnClick: (typeof self.options.OnRowClick === 'function') ? self.options.OnRowClick : (tr)=>{},
		OnRender: (typeof self.options.OnRowRender === 'function') ? self.options.OnRowRender : (tr)=>{},
		OnCellRender: (typeof self.options.OnCellRender === 'function') ? self.options.OnCellRender : (td)=>{},
		hasCellClickEvent: (typeof self.options.OnCellClick === 'function') ? true : false,
	
	}

	for (var i in data) {
		++self.rowcount

		self.DATA[self.rowcount] = Object.assign({
			_state: STATE_ORIGINAL
		}, data[i])

		row.record = self.DATA[self.rowcount]
		var tr = RenderRow(self, row)

		self.DATA[self.rowcount]._trid = tr.id
	}

	self.lasttrid = tr.id
}

function clear(self) {


	for (var dataid in self.DATA) {
		var trid = self.DATA[dataid]._trid
		var tr = document.getElementById(trid)
		delete self.DATA[dataid]
		$(tr).remove()
	}

	self.datastate.total = 0
	self.datastate.offset = 0
	self.datastate.maxrow = 0
	self.datastate.criteria = {}

	delete self.datastate.fn_listloading
	delete self.datastate.fn_listloaded

	self.btnNext.disable()
}

async function removechecked(self, options) {
	var tbl = self.table

	var chks = tbl.find('[rowselector="true"]')
	var trids = []
	for (var chk of chks) {
		if (chk.checked) {
			var trid = chk.getAttribute('trid')
			trids.push(trid)
		}
	}

	var trid
	while (trid = trids.pop()) {
		var tr = document.getElementById(trid)
		var dataid = tr.getAttribute('dataid')
		var data = self.DATA[dataid]	
		if (typeof options.OnRemoving === 'function') {
			var opt = { data: data, remove: true}
			await options.OnRemoving(opt)
			if (opt.remove) {
				removerow(self, trid)
			}
		}
	}
	

}

// function btnFirst_click(self) {
// 	console.log('first')
// }

// function btnPrev_click(self) {
// 	console.log('prev')
// }


function btnNext_click(self) {
	console.log('next')
	listload(self)
}

// function btnLast_click(self) {
// 	console.log('last')
// }

function btnCheckAll_click(self) {
	//console.log('checkall')
	var tbl = self.table
	var text = self.btnCheckAll.innerHTML


	tbl.find('[rowselector="true"]').each((key, chk)=>{
		// console.log(key)
		if (text==txtUnCheckAll) {
			chk.checked = false
			self.btnCheckAll.innerHTML = txtCheckAll
		} else {
			chk.checked = true
			self.btnCheckAll.innerHTML = txtUnCheckAll
		}
		
		global.OnTableCheckedChange(chk)
	})
	
	// .prop('checked', true);
}


function update (self, trid, data) {
	var row = {
		OnRender: (typeof self.options.OnRowRender === 'function') ? self.options.OnRowRender : (tr)=>{},
		OnCellRender: (typeof self.options.OnCellRender === 'function') ? self.options.OnCellRender : (td)=>{}
	}

	var tr = document.getElementById(trid)
	var dataid = tr.getAttribute('dataid')
	var record = self.DATA[dataid]
	

	// update record
	for (var mapping in record) {
		if (data[mapping]!==undefined) {
			record[mapping] = data[mapping]
		}
	}
	
	// update view table
	for (var col of self.maps) {
		var mapid = col.mapid
		var mapping = col.mapping
		let tdid = `${trid}-col-${mapid}`

		if (data[mapping]!==undefined) {
			var td = document.getElementById(tdid)
			td.innerHTML = data[mapping]
		}
		row.OnCellRender(td)
	}

	row.OnRender(tr)
	
}


function getLastId(self) {
	return self.lasttrid
}

function removerow(self, trid) {
	
	var tr = document.getElementById(trid)
	var dataid = tr.getAttribute('dataid')

	delete self.DATA[dataid]	
	tr.remove()
}


async function dataload(self, records) {
	let result = {
		records: records,
		total: records.length,
		offset: records.length,
		maxrow: records.length
	}

	self.datastate.total = result.total
	self.datastate.offset = result.offset
	self.datastate.maxrow = result.maxrow



	if (result.records.length>0) {
		fill(self, result.records)


		if (self.datastate.offset<self.datastate.total) {
			var sisa = self.datastate.total - self.datastate.offset; 
			self.btnNext.enable()
			self.btnNext.innerHTML = `Load next ${sisa} records`
		} else {
			self.btnNext.disable()
			self.btnNext.innerHTML = `<b>Finished</b> load ${self.datastate.total} records`
		}
	} else {
		self.btnNext.disable()
		self.btnNext.innerHTML = 'no data'
	}	

}


async function listload(self, fn_listloading, fn_listloaded) {
	var options = {
		api: `${global.modulefullname}/list`,
		offset: self.datastate.offset,
		criteria: {},
		loadmask: true
	}

	if (typeof fn_listloading === 'function') {
		self.datastate.fn_listloading = fn_listloading
	}

	if (typeof fn_listloading === 'function') {
		self.datastate.fn_listloaded = fn_listloaded
	}


	if (typeof self.datastate.fn_listloading === 'function') {
		self.datastate.fn_listloading(options)
	}

	self.datastate.criteria = options.criteria

	var args = {
		options: options
	}

	if (options.loadmask===true) {
		$ui.mask('loading...')
	}

	var apiurl = options.api
	try {
		let result = await $ui.apicall(apiurl, args)

		if (result.records===undefined) {
			result.records = []
		}

		if (typeof self.datastate.fn_listloaded === 'function') {
			$ui.unmask()
			self.datastate.fn_listloaded(result, options)
		}		

		self.datastate.total = result.total
		self.datastate.offset = result.offset
		self.datastate.maxrow = result.maxrow

		if (result.records.length>0) {
			fill(self, result.records)


			if (self.datastate.offset<self.datastate.total) {
				var sisa = self.datastate.total - self.datastate.offset; 
				self.btnNext.enable()
				self.btnNext.innerHTML = `Load next ${sisa} records`
			} else {
				self.btnNext.disable()
				self.btnNext.innerHTML = `<b>Finished</b> load ${self.datastate.total} records`
			}
		} else {
			self.btnNext.disable()
			self.btnNext.innerHTML = 'no data'
		}
		
	} catch (err) {
		var errormessage = err.errormessage !== undefined ? err.errormessage : err
		$ui.ShowMessage(`[ERROR]${errormessage}`, {
			'Ok' : () => {
				$ui.unmask()
			}
		})
	}
}


function clearactiverow(self) {
	for (var dname in self.DATA) {
		var d = self.DATA[dname]
		var trid = d._trid

		// console.log(trid)
		var tds = $(`#${trid}`).find('td')
		tds.removeClass('fgtable-row-cellactive')

	}
}