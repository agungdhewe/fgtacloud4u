var this_page_id;

const txt_title = $('#pnl_selfld-txt_title')
const img_schema = $('#pnl_selfld-img_schema')

const pnl_header = $('#pnl_selfld-pnl_header')
const pnl_items = $('#pnl_selfld-pnl_items')
const pnl_payments = $('#pnl_selfld-pnl_payments')

const boards = {
	header: $('#pnl_selfld-pnl_header-board'),
	items: $('#pnl_selfld-pnl_items-board'),
	payments: $('#pnl_selfld-pnl_payments-board')
}

const obj = {
	txt_header_table: $('#pnl_selfld-txt_header_table'),
	txt_header_query: $('#pnl_selfld-txt_header_query'),
	txt_items_table: $('#pnl_selfld-txt_items_table'),
	txt_items_query: $('#pnl_selfld-txt_items_query'),
	txt_payments_table: $('#pnl_selfld-txt_payments_table'),
	txt_payments_query: $('#pnl_selfld-txt_payments_query')
}

var SelectedTextbox = null
var ScrollTopPosition = 0

export async function init(opt) {
	this_page_id = opt.id

	pnl_header.hide()
	pnl_items.hide()
	pnl_payments.hide()


	obj.txt_header_table.board = boards.header
	obj.txt_header_table.textbox({
		onClickButton: function() { obj_textboxtable_click(obj.txt_header_table) }
	})

	obj.txt_items_table.board = boards.items
	obj.txt_items_table.textbox({
		disabled: true,
		onClickButton: function() { obj_textboxtable_click(obj.txt_items_table) }
	})

	obj.txt_payments_table.board = boards.payments
	obj.txt_payments_table.textbox({
		disabled: true,
		onClickButton: function() { obj_textboxtable_click(obj.txt_payments_table) }
	})	






	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	

	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
			$ui.getPages().show('pnl_selscm')
		}
	})
	

	setTimeout(()=>{
		$.parser.parse('#pnl_selfld');
	}, 500)

}


export function OnSizeRecalculated(width, height) {
	var w50 = Math.round(width/2)
	obj.txt_header_query.textbox('resize', `${w50-40}`)
	obj.txt_items_query.textbox('resize', `${w50-40}`)
	obj.txt_payments_query.textbox('resize', `${w50-40}`)
}




export function SetSchema(schema) {
	var title, image

	switch (schema) {
		case "1":
			title = "Konfigurasi Field untuk Schema 1 (Single Table)";
			image = "/index.php/asset/etap/client/config/images/schema1.svg";			
			pnl_header.show()
			pnl_items.hide()
			pnl_payments.hide()

			
			break;

		case "2":
			title = "Konfigurasi Field untuk Schema 2 (Master - Detil, single payment)";
			image = "/index.php/asset/etap/client/config/images/schema2.svg";
			pnl_header.show()
			pnl_items.show()
			pnl_payments.hide()

			
			break;

		case "3":
			title = "Konfigurasi Field untuk Schema 3 (Master - Detil, multi payment)";	
			image = "/index.php/asset/etap/client/config/images/schema3.svg";
			pnl_header.show()
			pnl_items.show()
			pnl_payments.show()
			break;
	}

	txt_title.html(title)
	img_schema.attr('src', image)


	obj.txt_header_table.textbox('setText', '')
	obj.txt_header_table.textbox('enable')

	obj.txt_items_table.textbox('setText', '')
	obj.txt_items_table.textbox('disable')

	obj.txt_payments_table.textbox('setText', '')
	obj.txt_payments_table.textbox('disable')


	SetFieldHeader(schema)
	SetFieldItems(schema)
	SetFieldPayments(schema)

	$ui.getPages().ITEMS['pnl_lsttbl'].handler.ShowTables()	
}


function SetFieldHeader(schema) {
	boards.header.html('')
	boards.header.obj = {}

	if (schema<1) { return }
	
	var fields;
	if (schema>1) {
		fields = [
			{id: 'txt_header_ticketid', text:'TicketID'},
			{id: 'txt_header_date', text:'Date'}
		]
	} else {
		fields = [
			{id: 'txt_header_ticketid', text:'TicketID'},
			{id: 'txt_header_date', text:'Date'},
			{id: 'txt_header_payment', text:'Payment'},
			{id: 'txt_header_value', text: 'Value'}			
		]		
	}

	CreateFields(boards.header, fields)
}


function SetFieldItems(schema) {
	boards.items.html('')
	boards.items.obj = {}

	if (schema<2) { return }
	CreateFields(boards.items, [
		{id: 'txt_items_ticketid', text:'TicketID'},	
		{id: 'txt_items_sku', text:'SKU'},
		{id: 'txt_items_name', text:'Name'},
		{id: 'txt_items_qty', text:'Qty'},
		{id: 'txt_items_subtotal', text:'Subtotal'}
	])
}


function SetFieldPayments(schema) {
	boards.payments.html('')
	boards.payments.obj = {}

	if (schema<3) { return }
	CreateFields(boards.payments, [
		{id: 'txt_payments_ticketid', text:'TicketID'},
		{id: 'txt_payments_name', text:'Name'},
		{id: 'txt_payments_value', text:'Value'}
	])	
}


function CreateFields(board, fields) {
	for (let field of fields) {
		var html = `
			<div class="fld-ent-field">
				<div class="fld-ent-label">${field.text}</div>
				<div class="fld-ent-value">
					<input id="pnl_selfld-${field.id}" class="easyui-textbox" style="width: 100%" data-options="disabled:true,editable:false,buttonText:'...',buttonAlign:'right',prompt:'Pilih...'">
				</div>
			</div>			
		`
		board.append(html)

		board.obj[field.id] =  $(`#pnl_selfld-${field.id}`)
		board.obj[field.id].id = field.id
		board.obj[field.id].textbox({
			onClickButton: function() { obj_textboxfield_click(board.obj[field.id]) }			
		})

	}
}

function obj_textboxfield_click(sender) {
	SelectedTextbox = sender
	$ui.getPages().show('pnl_lstfld')

}


function obj_textboxtable_click(sender) {
	SelectedTextbox = sender

	ScrollTopPosition = $(window).scrollTop()
	$ui.getPages().show('pnl_lsttbl')

}



export function SetActiveTextboxValue(value) {
	SelectedTextbox.textbox('setText', value)

	setTimeout(()=>{
		$(window).scrollTop(ScrollTopPosition)
	}, 500)
	
	$ui.getPages().ITEMS['pnl_lstfld'].handler.ShowFields(value)	
	if (SelectedTextbox.board!=null) {
		for (var field_id in SelectedTextbox.board.obj) {
			var fields = SelectedTextbox.board.obj[field_id]
			fields.textbox('enable')
		}
	}

	var reset_fields_items = () => {
		for (var objname in boards.items.obj) {
			var obj = boards.items.obj[objname]
			obj.textbox('setText' , '')
		}
	}
	

	var reset_fields_payments = () => {
		for (var objname in boards.payments.obj) {
			var obj = boards.payments.obj[objname]
			obj.textbox('setText' , '')
		}
	}	
	
	if (SelectedTextbox.attr('id')=='pnl_selfld-txt_header_table') {
		// reset semua items
		obj.txt_items_table.textbox('enable')
		reset_fields_items()

		// reset semua payments
		obj.txt_payments_table.textbox('enable')
		reset_fields_payments()
	}


	if (SelectedTextbox.attr('id')=='pnl_selfld-txt_items_table') {
		reset_fields_items()
	}

	if (SelectedTextbox.attr('id')=='pnl_selfld-txt_payments_table') {
		reset_fields_payments()
	}	

}


export function Preview(args) {
	ScrollTopPosition = $(window).scrollTop()
	$ui.getPages().show('pnl_preview')	
}

export function CommitPreview() {
	setTimeout(()=>{
		$(window).scrollTop(ScrollTopPosition)
	}, 500)


}