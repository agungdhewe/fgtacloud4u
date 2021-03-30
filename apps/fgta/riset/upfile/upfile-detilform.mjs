var this_page_id;
var this_page_options;



const txt_title = $('#pnl_editdetilform-title')
const btn_edit = $('#pnl_editdetilform-btn_edit')
const btn_save = $('#pnl_editdetilform-btn_save')
const btn_delete = $('#pnl_editdetilform-btn_delete')
const btn_prev = $('#pnl_editdetilform-btn_prev')
const btn_next = $('#pnl_editdetilform-btn_next')
const btn_addnew = $('#pnl_editdetilform-btn_addnew')
const chk_autoadd = $('#pnl_editdetilform-autoadd')

const fl_upfiledetil_data01_img = $('#pnl_editdetilform-fl_upfiledetil_data01_img');
const fl_upfiledetil_data01_lnk = $('#pnl_editdetilform-fl_upfiledetil_data01_link');				
			
const fl_upfiledetil_data02_img = $('#pnl_editdetilform-fl_upfiledetil_data02_img');
const fl_upfiledetil_data02_lnk = $('#pnl_editdetilform-fl_upfiledetil_data02_link');				
			

const pnl_form = $('#pnl_editdetilform-form')
const obj = {
	txt_upfiledetil_id: $('#pnl_editdetilform-txt_upfiledetil_id'),
	txt_upfiledetil_name: $('#pnl_editdetilform-txt_upfiledetil_name'),
	fl_upfiledetil_data01: $('#pnl_editdetilform-fl_upfiledetil_data01'),
	fl_upfiledetil_data02: $('#pnl_editdetilform-fl_upfiledetil_data02'),
	txt_upfile_id: $('#pnl_editdetilform-txt_upfile_id')
}


let form = {}
let header_data = {}



export async function init(opt) {
	this_page_id = opt.id
	this_page_options = opt;

	
	form = new global.fgta4form(pnl_form, {
		primary: obj.txt_upfiledetil_id,
		autoid: true,
		logview: 'mst_upfiledetil',
		btn_edit: btn_edit,
		btn_save: btn_save,
		btn_delete: btn_delete,		
		objects : obj,
		OnDataSaving: async (data, options) => { await form_datasaving(data, options) },
		OnDataSaved: async (result, options) => {  await form_datasaved(result, options) },
		OnDataDeleting: async (data, options) => { await form_deleting(data, options) },
		OnDataDeleted: async (result, options) => { await form_deleted(result, options) },
		OnIdSetup : (options) => { form_idsetup(options) },
		OnViewModeChanged : (viewonly) => { form_viewmodechanged(viewonly) }
	})	

	form.AllowAddRecord = true
	form.AllowRemoveRecord = true
	form.AllowEditRecord = true
	form.CreateRecordStatusPage(this_page_id)
	form.CreateLogPage(this_page_id)


	obj.fl_upfiledetil_data01.filebox({
		onChange: function(value) {
			var files = obj.fl_upfiledetil_data01.filebox('files');
			var f = files[0];
			var reader = new FileReader();
			reader.onload = (function(loaded) {
				return function(e) {
					if (loaded.type.startsWith('image')) {
						var image = new Image();
						image.src = e.target.result;
						image.onload = function() {
							fl_upfiledetil_data01_img.attr('src', e.target.result);
							fl_upfiledetil_data01_img.show();
							fl_upfiledetil_data01_lnk.hide();
						}
					} else {
						fl_upfiledetil_data01_img.hide();
						fl_upfiledetil_data01_lnk.hide();
					}
				}
			})(f);
			if (f!==undefined) { reader.readAsDataURL(f) }
		}
	})				
			
	obj.fl_upfiledetil_data02.filebox({
		onChange: function(value) {
			var files = obj.fl_upfiledetil_data02.filebox('files');
			var f = files[0];
			var reader = new FileReader();
			reader.onload = (function(loaded) {
				return function(e) {
					if (loaded.type.startsWith('image')) {
						var image = new Image();
						image.src = e.target.result;
						image.onload = function() {
							fl_upfiledetil_data02_img.attr('src', e.target.result);
							fl_upfiledetil_data02_img.show();
							fl_upfiledetil_data02_lnk.hide();
						}
					} else {
						fl_upfiledetil_data02_img.hide();
						fl_upfiledetil_data02_lnk.hide();
					}
				}
			})(f);
			if (f!==undefined) { reader.readAsDataURL(f) }
		}
	})				
			




	btn_addnew.linkbutton({
		onClick: () => { btn_addnew_click() }
	})

	btn_prev.linkbutton({
		onClick: () => { btn_prev_click() }
	})

	btn_next.linkbutton({
		onClick: () => { btn_next_click() }
	})

	document.addEventListener('keydown', (ev)=>{
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			if (ev.code=='KeyS' && ev.ctrlKey==true) {
				if (!form.isInViewMode()) {
					form.btn_save_click();
				}
				ev.stopPropagation()
				ev.preventDefault()
			}
		}
	}, true)
	
	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
			if (form.isDataChanged()) {
				form.canceledit(()=>{
					$ui.getPages().show('pnl_editdetilgrid', ()=>{
						form.setViewMode()
						$ui.getPages().ITEMS['pnl_editdetilgrid'].handler.scrolllast()
					})					
				})
			} else {
				$ui.getPages().show('pnl_editdetilgrid', ()=>{
					form.setViewMode()
					$ui.getPages().ITEMS['pnl_editdetilgrid'].handler.scrolllast()
				})
			}
		
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
	
	
	document.addEventListener('OnViewModeChanged', (ev) => {
		if (ev.detail.viewmode===true) {
			form.lock(true)
			btn_addnew.allow = false
			btn_addnew.linkbutton('disable')
			chk_autoadd.attr("disabled", true);	
			chk_autoadd.prop("checked", false);			
		} else {
			form.lock(false)
			btn_addnew.allow = true
			btn_addnew.linkbutton('enable')
			chk_autoadd.removeAttr("disabled");
			chk_autoadd.prop("checked", false);
		}
	})
}


export function OnSizeRecalculated(width, height) {
}


export function getForm() {
	return form
}

export function open(data, rowid, hdata) {
	// console.log(header_data)
	txt_title.html(hdata.upfile_name)
	header_data = hdata

	var fn_dataopening = async (options) => {
		options.api = `${global.modulefullname}/detil-open`
		options.criteria[form.primary.mapping] = data[form.primary.mapping]
	}

	var fn_dataopened = async (result, options) => {

		updatefilebox(result.record);



		form.SuspendEvent(true);
		form
			.fill(result.record)
			.commit()
			.setViewMode()
			.rowid = rowid

		form.SuspendEvent(false);


		// Editable
		if (form.AllowEditRecord!=true) {
			btn_edit.hide();
			btn_save.hide();
			btn_delete.hide();
		}
		

		// tambah baris
		if (form.AllowAddRecord) {
			btn_addnew.show()
		} else {
			btn_addnew.hide()
		}	

		// hapus baris
		if (form.AllowRemoveRecord) {
			btn_delete.show()
		} else {
			btn_delete.hide()
		}

		var prevnode = $(`#${rowid}`).prev()
		if (prevnode.length>0) {
			btn_prev.linkbutton('enable')
		} else {
			btn_prev.linkbutton('disable')
		}

		var nextode = $(`#${rowid}`).next()
		if (nextode.length>0) {
			btn_next.linkbutton('enable')
		} else {
			btn_next.linkbutton('disable')
		}		
	}

	var fn_dataopenerror = (err) => {
		$ui.ShowMessage('[ERROR]'+err.errormessage);
	}

	form.dataload(fn_dataopening, fn_dataopened, fn_dataopenerror)	
}

export function createnew(hdata) {
	header_data = hdata

	txt_title.html('Create New Row')
	form.createnew(async (data, options)=>{
		data.upfile_id= hdata.upfile_id
		data.detil_value = 0





		fl_upfiledetil_data01_img.hide();
		fl_upfiledetil_data01_lnk.hide();	
		obj.fl_upfiledetil_data01.filebox('clear');		
			
		fl_upfiledetil_data02_img.hide();
		fl_upfiledetil_data02_lnk.hide();	
		obj.fl_upfiledetil_data02.filebox('clear');		
			

		form.rowid = null
		options.OnCanceled = () => {
			$ui.getPages().show('pnl_editdetilgrid')
		}
	})
}


async function form_datasaving(data, options) {
	options.api = `${global.modulefullname}/detil-save`



}

async function form_datasaved(result, options) {
	var data = {}
	Object.assign(data, form.getData(), result.dataresponse)


	form.rowid = $ui.getPages().ITEMS['pnl_editdetilgrid'].handler.updategrid(data, form.rowid)

	var autoadd = chk_autoadd.prop("checked")
	if (autoadd) {
		setTimeout(()=>{
			btn_addnew_click()
		}, 1000)
	}
}

async function form_deleting(data, options) {
	options.api = `${global.modulefullname}/detil-delete`
}

async function form_deleted(result, options) {
	options.suppressdialog = true
	$ui.getPages().show('pnl_editdetilgrid', ()=>{
		$ui.getPages().ITEMS['pnl_editdetilgrid'].handler.removerow(form.rowid)
	})
	
}

function updatefilebox(record) {
	// apabila ada keperluan untuk menampilkan data dari object storage

	obj.fl_upfiledetil_data01.filebox('clear');			
	if (record.upfiledetil_data01_doc!=undefined) {
		if (record.upfiledetil_data01_doc.type.startsWith('image')) {
			fl_upfiledetil_data01_lnk.hide();
			fl_upfiledetil_data01_img.show();
			fl_upfiledetil_data01_img.attr('src', record.upfiledetil_data01_doc.attachmentdata);
		} else {
			fl_upfiledetil_data01_img.hide();
			fl_upfiledetil_data01_lnk.show();
			fl_upfiledetil_data01_lnk[0].onclick = () => {
				fl_upfiledetil_data01_lnk.attr('download', record.upfiledetil_data01_doc.name);
				fl_upfiledetil_data01_lnk.attr('href', record.upfiledetil_data01_doc.attachmentdata);
			}
		}	
	} else {
		fl_upfiledetil_data01_img.hide();
		fl_upfiledetil_data01_lnk.hide();			
	}				
			
	obj.fl_upfiledetil_data02.filebox('clear');			
	if (record.upfiledetil_data02_doc!=undefined) {
		if (record.upfiledetil_data02_doc.type.startsWith('image')) {
			fl_upfiledetil_data02_lnk.hide();
			fl_upfiledetil_data02_img.show();
			fl_upfiledetil_data02_img.attr('src', record.upfiledetil_data02_doc.attachmentdata);
		} else {
			fl_upfiledetil_data02_img.hide();
			fl_upfiledetil_data02_lnk.show();
			fl_upfiledetil_data02_lnk[0].onclick = () => {
				fl_upfiledetil_data02_lnk.attr('download', record.upfiledetil_data02_doc.name);
				fl_upfiledetil_data02_lnk.attr('href', record.upfiledetil_data02_doc.attachmentdata);
			}
		}	
	} else {
		fl_upfiledetil_data02_img.hide();
		fl_upfiledetil_data02_lnk.hide();			
	}				
			
}

function form_viewmodechanged(viewonly) {
	if (viewonly) {
		btn_prev.linkbutton('enable')
		btn_next.linkbutton('enable')
		if (btn_addnew.allow) {
			btn_addnew.linkbutton('enable')
		} else {
			btn_addnew.linkbutton('disable')
		}
	} else {
		btn_prev.linkbutton('disable')
		btn_next.linkbutton('disable')
		btn_addnew.linkbutton('disable')
	}
}


function form_idsetup(options) {
	var objid = obj.txt_upfiledetil_id
	switch (options.action) {
		case 'fill' :
			objid.textbox('disable') 
			break;

		case 'createnew' :
			// console.log('new')
			if (form.autoid) {
				objid.textbox('disable') 
				objid.textbox('setText', '[AUTO]') 
			} else {
				objid.textbox('enable') 
			}
			break;
			
		case 'save' :
			objid.textbox('disable') 
			break;	
	}
}

function btn_addnew_click() {
	createnew(header_data)
}


function btn_prev_click() {
	var prevode = $(`#${form.rowid}`).prev()
	if (prevode.length==0) {
		return
	} 
	
	var trid = prevode.attr('id')
	var dataid = prevode.attr('dataid')
	var record = $ui.getPages().ITEMS['pnl_editdetilgrid'].handler.getGrid().DATA[dataid]

	open(record, trid, header_data)
}

function btn_next_click() {
	var nextode = $(`#${form.rowid}`).next()
	if (nextode.length==0) {
		return
	} 

	var trid = nextode.attr('id')
	var dataid = nextode.attr('dataid')
	var record = $ui.getPages().ITEMS['pnl_editdetilgrid'].handler.getGrid().DATA[dataid]

	open(record, trid, header_data)
}