const delay_create_panel = 300


export function fgta4slideselect2(obj, options) {
	let self = {
		obj: obj,
		grd_list: {}
	}


	// if (typeof obj.form.setValue !== 'function') {
	// 	obj.colorbase = obj.css('color')
	// 	if (obj.hasClass('easyui-combo')) {
	// 		console.log('test test test')
	// 		// // obj.combo('readonly', true)
	// 		// obj.combo({})
	// 		obj.colorbase = obj.css('color')
	// 		var textbox = obj.textbox('textbox')
	// 		$(textbox).attr('disabled', true)
	// 		textbox.css('color', obj.colorbase)
	// 	}
	// }

	

	self.options = Object.assign({
		form: obj.form,
		title: 'Slide Select',
		returnpage: 'pnl_edit',
		panelname: 'pnl_' + self.obj.name + '_select',
		api: null,
		fieldValue: 'id',
		fieldDisplay: 'text',
		fieldValueMap: options.fieldValue,
		fields: [],
		data: null,
		OnDataLoading: async (criteria) => {},
		OnDataLoaded : async (result, options) => {},
		OnSelected: (value, display, record) => {},
	}, options)

	CreatePanel(self)

	return {
		obj: self.obj,
		options: self.options,
		grd_list : self.grd_list,
		btn_load: self.btn_load,
		tbl_list: self.tbl_list,
	}
}


function CreatePanel(self) {

	var pnl_returnpage = document.getElementById(self.options.returnpage)
	if (pnl_returnpage==null) { return }

	var content = CreatePanelContent(self)
	setTimeout(()=>{
		if ($ui.getPages().ITEMS[self.options.panelname]!==undefined) { 
			return 
		}

		$(content).insertAfter(`#${self.options.returnpage}`)
		$.parser.parse(`#${self.options.panelname}`)
		
		var pHandler = CreateHandler(self)
		var pnl_content = $(`#${self.options.panelname}`)		

		var page = {panel: pnl_content, handler: pHandler}
		page.panel.id = self.options.panelname
		page.panel.pagenum = Object.keys($ui.getPages().ITEMS).length + 1
		page.panel.handler = page.handler
		$ui.getPages().ITEMS[page.panel.id] = page.panel

		self.pnl_searchbox = $(`#${self.options.panelname}-searchbox`)
		if (self.options.data!=null) {
			self.pnl_searchbox.hide() 
		}

		pnl_content.hide()

		self.obj.combo({
			panelHeight: '0px',
			onShowPanel: () => { 
				$ui.KeepScroll()
				self.obj.combo('hidePanel'); 
				$ui.getPages().show(self.options.panelname)
				$ui.getPages().ITEMS[self.options.panelname].handler.retrieveData()							
			}
		})		


		if (self.options.initialvalue!=null) {
			self.obj.combo('setValue', self.options.initialvalue.id);
			self.obj.combo('setText', self.options.initialvalue.text);
			console.log('set init value');
		}

		if (typeof self.obj.form.setValue !== 'function') {
			self.obj.bgcolorbase = self.obj.css('background-color')
			self.obj.colorbase = self.obj.css('color')
			var textbox = self.obj.textbox('textbox')
			$(textbox).attr('disabled', true)
			textbox.css('color', self.obj.colorbase)
			textbox.css('background-color', self.obj.bgcolorbase)
		}


		

	}, delay_create_panel)


}


function CreateHandler(self) {
	self.btn_load = $(`#${self.options.panelname}-btn_load`)
	self.tbl_list = $(`#${self.options.panelname}-tbl_list`)
	self.txt_search = $(`#${self.options.panelname}-txt_search`)


	
	self.txt_search.textbox('textbox').bind('keypress', (evt)=>{
		if (evt.key==='Enter') {
			btn_load_click(self)
		}
	})


	self.grd_list = new global.fgta4grid(self.tbl_list, {
		OnRowClick: (tr, ev) => { 
			grd_list_rowclick(self, tr, ev)
		},
	})

	self.btn_load.linkbutton({
		onClick: () => { btn_load_click(self) }
	})

	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==self.options.panelname) {
			ev.detail.cancel = true;
			$ui.getPages().show(self.options.returnpage)
			$ui.ResumeScroll()
		}
	})	

	document.addEventListener('OnButtonHome', (ev) => {
		if ($ui.getPages().getCurrentPage()==self.options.panelname) {
			ev.detail.cancel = true;
			$ui.getPages().show(self.options.returnpage)
			$ui.ResumeScroll()			
		}
	})	

	return {
		init: async (opt) => { },
		retrieveData: () => { 
			self.txt_search.textbox('setText', '')
			retrieveData(self) 
		}
	}

}


function CreatePanelContent(self) {
	var th = ''
	var trhead = ''
	for (var t of self.options.fields) {
		th += `<th mapping="${t.mapping}">${t.text}</th>`
		trhead += `<td class="fgtable-head-alt1" style="width: 100px; border-bottom: 1px solid #000000">${t.text}</td>`
	}
	

	return `
		<div id="${self.options.panelname}">
			<div class="fgta-page-title" style="display: flex; align-items: center ">
				<div>${self.options.title}</div>
			</div>

			<div id="${self.options.panelname}-searchbox" class="list-search-wrap" style="width: calc(100% - 65px); display: flex;">
				<div class="list-search-item" style="width: 50px;">Cari</div>
				<div class="list-search-item">
					<input id="${self.options.panelname}-txt_search" class="easyui-textbox" style="width: 100%">
				</div>
				<div class="list-search-item" style="width: 45px">
					<a href="javascript:void(0)" id="${self.options.panelname}-btn_load" class="easyui-linkbutton c8" style="width: 45px">Load</a>
				</div>
			</div>

			<div style="margin-top: 10px">
				<table id="${self.options.panelname}-tbl_list" paging="true" cellspacing="0" width="100%">
					<thead>
						<tr>
							${th}
						</tr>
						<tr style="background-color: #cccccc; height: 30px">
							${trhead}
						</tr>
					</thead>
				</table>
			</div>

		</div>		
	`	
}


function btn_load_click(self) {
	retrieveData(self)
}


function grd_list_rowclick(self, tr, ev) {
	var dataid = tr.getAttribute('dataid')
	var record = self.grd_list.DATA[dataid]
	$ui.getPages().show(self.options.returnpage)
	$ui.ResumeScroll(()=>{})

	if (typeof self.options.form.setValue === 'function') {
		self.options.form.setValue(self.obj, record[self.options.fieldValueMap], record[self.options.fieldDisplay])
	} else {
		self.obj.combo('setValue', record[self.options.fieldValueMap])
		self.obj.combo('setText', record[self.options.fieldDisplay])
	}

	self.options.OnSelected(record[self.options.fieldValue], record[self.options.fieldDisplay], record)

}

async function retrieveData(self) {
	self.grd_list.clear();

	if (self.options.api==null) {
		var data = await self.options.OnDataLoading()
		if (data==null) {
			data = self.options.data;
		}
		var result = {
			maxrow: data.length,
			offset: data.length,
			records: data,
			total: data.length
		}

		await self.options.OnDataLoaded(result)
		self.grd_list.dataload(result.records)
	} else {
		var fn_listloading = async (options) => {
			options.api = self.options.api
			var search = self.txt_search.textbox('getText')
			if (search!='') {
				options.criteria['search'] = search
			}
	
			await self.options.OnDataLoading(options.criteria, options)
		}
		
		var fn_listloaded = async (result, options) => {
			await self.options.OnDataLoaded(result, options)
		}	
	
		self.grd_list.listload(fn_listloading, fn_listloaded)
	}

	setTimeout(()=>{
		self.txt_search.textbox('textbox').focus()
	}, 500)
	

}