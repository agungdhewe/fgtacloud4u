var this_page_id;
var this_page_options;



const txt_title = $('#pnl_editapprovalform-title')
const btn_edit = $('#pnl_editapprovalform-btn_edit')
const btn_save = $('#pnl_editapprovalform-btn_save')
const btn_delete = $('#pnl_editapprovalform-btn_delete')
const btn_prev = $('#pnl_editapprovalform-btn_prev')
const btn_next = $('#pnl_editapprovalform-btn_next')
const btn_addnew = $('#pnl_editapprovalform-btn_addnew')
const chk_autoadd = $('#pnl_editapprovalform-autoadd')

const pnl_form = $('#pnl_editapprovalform-form')
const obj = {
	txt_prosappr_id: $('#pnl_editapprovalform-txt_prosappr_id'),
	chk_prosappr_isapproved: $('#pnl_editapprovalform-chk_prosappr_isapproved'),
	txt_prosappr_by: $('#pnl_editapprovalform-txt_prosappr_by'),
	txt_prosappr_date: $('#pnl_editapprovalform-txt_prosappr_date'),
	txt_pros_version: $('#pnl_editapprovalform-txt_pros_version'),
	chk_prosappr_isdeclined: $('#pnl_editapprovalform-chk_prosappr_isdeclined'),
	txt_prosappr_declinedby: $('#pnl_editapprovalform-txt_prosappr_declinedby'),
	txt_prosappr_declineddate: $('#pnl_editapprovalform-txt_prosappr_declineddate'),
	txt_prosappr_notes: $('#pnl_editapprovalform-txt_prosappr_notes'),
	txt_pros_id: $('#pnl_editapprovalform-txt_pros_id'),
	txt_docauth_descr: $('#pnl_editapprovalform-txt_docauth_descr'),
	txt_docauth_order: $('#pnl_editapprovalform-txt_docauth_order'),
	txt_docauth_value: $('#pnl_editapprovalform-txt_docauth_value'),
	txt_docauth_min: $('#pnl_editapprovalform-txt_docauth_min'),
	txt_authlevel_id: $('#pnl_editapprovalform-txt_authlevel_id'),
	txt_authlevel_name: $('#pnl_editapprovalform-txt_authlevel_name'),
	txt_auth_id: $('#pnl_editapprovalform-txt_auth_id'),
	txt_auth_name: $('#pnl_editapprovalform-txt_auth_name')
}


let form = {}
let header_data = {}



export async function init(opt) {
	this_page_id = opt.id
	this_page_options = opt;

	
	form = new global.fgta4form(pnl_form, {
		primary: obj.txt_prosappr_id,
		autoid: true,
		logview: 'mst_prosappr',
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

	form.AllowAddRecord = false
	form.AllowRemoveRecord = false
	form.AllowEditRecord = false
	form.CreateRecordStatusPage(this_page_id)
	form.CreateLogPage(this_page_id)




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
					$ui.getPages().show('pnl_editapprovalgrid', ()=>{
						form.setViewMode()
						$ui.getPages().ITEMS['pnl_editapprovalgrid'].handler.scrolllast()
					})					
				})
			} else {
				$ui.getPages().show('pnl_editapprovalgrid', ()=>{
					form.setViewMode()
					$ui.getPages().ITEMS['pnl_editapprovalgrid'].handler.scrolllast()
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
	txt_title.html(hdata.pros_id)
	header_data = hdata

	var fn_dataopening = async (options) => {
		options.api = `${global.modulefullname}/approval-open`
		options.criteria[form.primary.mapping] = data[form.primary.mapping]
	}

	var fn_dataopened = async (result, options) => {



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
		data.pros_id= hdata.pros_id
		data.approval_value = 0

		data.pros_version = 0
		data.docauth_order = 0
		data.docauth_value = 0
		data.docauth_min = 0




		form.rowid = null
		options.OnCanceled = () => {
			$ui.getPages().show('pnl_editapprovalgrid')
		}
	})
}


async function form_datasaving(data, options) {
	options.api = `${global.modulefullname}/approval-save`



}

async function form_datasaved(result, options) {
	var data = {}
	Object.assign(data, form.getData(), result.dataresponse)


	form.rowid = $ui.getPages().ITEMS['pnl_editapprovalgrid'].handler.updategrid(data, form.rowid)

	var autoadd = chk_autoadd.prop("checked")
	if (autoadd) {
		setTimeout(()=>{
			btn_addnew_click()
		}, 1000)
	}
}

async function form_deleting(data, options) {
	options.api = `${global.modulefullname}/approval-delete`
}

async function form_deleted(result, options) {
	options.suppressdialog = true
	$ui.getPages().show('pnl_editapprovalgrid', ()=>{
		$ui.getPages().ITEMS['pnl_editapprovalgrid'].handler.removerow(form.rowid)
	})
	
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
	var objid = obj.txt_prosappr_id
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
	var record = $ui.getPages().ITEMS['pnl_editapprovalgrid'].handler.getGrid().DATA[dataid]

	open(record, trid, header_data)
}

function btn_next_click() {
	var nextode = $(`#${form.rowid}`).next()
	if (nextode.length==0) {
		return
	} 

	var trid = nextode.attr('id')
	var dataid = nextode.attr('dataid')
	var record = $ui.getPages().ITEMS['pnl_editapprovalgrid'].handler.getGrid().DATA[dataid]

	open(record, trid, header_data)
}