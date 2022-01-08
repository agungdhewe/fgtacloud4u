import {fgta4grid} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4grid.mjs'
import {fgta4form} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4form.mjs'
import * as fgta4pages from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pages.mjs'
import * as fgta4pageslider from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pageslider.mjs'
import * as pForm from './preference-form.mjs'

const pnl_form = $('#pnl_form')




var pages = fgta4pages;
var slider = fgta4pageslider;


export const SIZE = {width:0, height:0}



export async function init(opt) {
	global.fgta4grid = fgta4grid
	global.fgta4form = fgta4form

	document.getElementsByTagName("body")[0].style.margin = '5px 20px 5px 20px'


	pages
		.setSlider(slider)
		.initPages([
			{panel: pnl_form, handler: pForm},
		], opt)

	$ui.setPages(pages)


	document.addEventListener('OnButtonHome', (ev) => {
		if (ev.detail.cancel) {
			return
		}

		ev.detail.cancel = true;
		ExitModule();
	})
	
	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	

	await PreloadData()

}


export function OnSizeRecalculated(width, height) {
	SIZE.width = width
	SIZE.height = height
}

export async function ExitModule() {
	$ui.home();
}



async function PreloadData() {
}


