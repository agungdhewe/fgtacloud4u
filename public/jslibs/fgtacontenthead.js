/***
 * Mengatur header halaman model FGTA, 
 * big header, setelah di scroll stay dengan small header, logo menyesuaikan;
 */


if (window.$fgta===undefined) {
	window.$fgta = {
		useminiheader: false,
		showmenulist: true,
		showaccount: true
	};
}

window.addEventListener("load", async function() {
	var scrollTop = getScrollTop();

	var pagedata = CalculateHeaderSize({
		headbig: document.getElementById('page_head-big'),
		headmini: document.getElementById('page_head-mini'),
		logo: document.getElementById('page_head-logo'),
		menu: document.getElementById('page_head-menu'),
		menu_split: document.getElementById('page_head-menu_split'),
		menu_account: document.getElementById('page_head-menu_account'),
		menu_list: document.getElementById('page_head-menu_list'),
		content: document.getElementById('page_content')
	});
	
	// detect event scroll apabila menggunakan header yang gede
	if (window.$fgta.useminiheader) {
		InitMiniHeader(pagedata);
	} else {
		InitBigHeader(pagedata);
		SetBigHeader(pagedata, scrollTop);
		document.addEventListener("scroll", function (ev) {
			var scrollTop = getScrollTop();
			SetBigHeader(pagedata, scrollTop);
		});
	}
});


function getScrollTop() {
	var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return Math.floor(scrollTop);
}

function CalculateHeaderSize(pagedata) {
	pagedata.headbig.rect = pagedata.headbig.getBoundingClientRect();
	pagedata.headmini.rect = pagedata.headmini.getBoundingClientRect();
	pagedata.logo.rect = pagedata.logo.getBoundingClientRect();
	//pagedata.menu.rect = pagedata.menu.getBoundingClientRect();

	var menustyle = pagedata.menu.currentStyle || window.getComputedStyle(pagedata.menu);
	pagedata.menu.verticalmargintotal = parseInt(menustyle.marginTop) + parseInt(menustyle.marginBottom);

	pagedata.DELTAMINI = pagedata.headbig.rect.height - pagedata.headmini.rect.height;
	pagedata.LOGOTOPMARGIN = pagedata.logo.rect.top;

	return pagedata;
}



function InitMiniHeader(pagedata) {
	// console.log('set mini header');


	pagedata.headbig.style.display = 'none';

	pagedata.headmini.style.opacity = 1;


	pagedata.logo.style.height = `${pagedata.headmini.rect.height}px`;
	pagedata.logo.style.minHeight = `${pagedata.headmini.rect.height}px`;
	pagedata.logo.style.marginTop = '0px';
	pagedata.logo.style.opacity = 1;

	pagedata.content.style.zIndex = 0;
	pagedata.content.style.marginTop = `${pagedata.headmini.rect.height}px`;
	pagedata.content.style.opacity = 1;



	pagedata.menu.style.height = 'auto';
	pagedata.menu.style.flexDirection = 'row-reverse';
	pagedata.menu.style.alignItems = 'flex-end';
	pagedata.menu.style.justifyContent = 'flex-end';

	SetMenuPosition(pagedata);
	
}

function InitBigHeader(pagedata) {
	// console.log('set big header')

	pagedata.headbig.style.position = 'relative';
	pagedata.headbig.style.opacity = 1;
	
	pagedata.headmini.style.opacity = 0;

	pagedata.logo.style.opacity = 1;

	pagedata.content.style.zIndex = 0;
	pagedata.content.style.position = 'relative'
	pagedata.content.style.opacity = 1;

	pagedata.MENUISLOATING = false;
	pagedata.INMINMODE = false;
	pagedata.LOGOSTARTSHIRNK = pagedata.headbig.rect.height - pagedata.logo.rect.height;
	pagedata.LOGOHEIGHT = pagedata.logo.rect.height;
}


function SetBigHeader(pagedata, scrollTop) {
	if (scrollTop<=pagedata.DELTAMINI) {

		var lmt = pagedata.LOGOTOPMARGIN-scrollTop; 
		if (scrollTop<=pagedata.LOGOTOPMARGIN) {
			pagedata.INMINMODE = false;
			// console.log('big mode');
		} else {
			lmt = 0;
		}

		if (pagedata.headmini.style.opacity!==0) {
			pagedata.headmini.style.opacity=0
		}


		var lhe = pagedata.headbig.rect.height - scrollTop;
		pagedata.logo.style.marginTop = `${lmt}px`;
		if (scrollTop>pagedata.LOGOSTARTSHIRNK) {
			if (lhe>=pagedata.headmini.rect.height) {
				// console.log(lhe);
				pagedata.logo.style.height = `${lhe}px`;
				pagedata.logo.style.minHeight = `${lhe}px`;
			} 
		} else {
			// pagedata.logo.style.height = `${pagedata.headmini.rect.height}px`;
			pagedata.logo.style.minHeight = `${pagedata.LOGOHEIGHT}px`;
			pagedata.logo.style.height = `${pagedata.LOGOHEIGHT}px`;
		}


		//  menu handling: big
		var mhe = lhe - pagedata.menu.verticalmargintotal;
		pagedata.menu.style.height = `${mhe}px`;
		pagedata.menu.style.flexDirection = 'column';
		pagedata.menu.style.alignItems = 'flex-end';
		pagedata.menu.style.justifyContent = 'space-between';


		pagedata.MENUISLOATING = true;
		SetMenuPosition(pagedata, 'big');

	} else {
		if (pagedata.INMINMODE !== true) {
			pagedata.INMINMODE = true;
			// console.log('mini mode');

			pagedata.logo.style.marginTop = '0px';
			pagedata.logo.style.height = `${pagedata.headmini.rect.height}px`;
			pagedata.logo.style.minHeight = `${pagedata.headmini.rect.height}px`;


		}

		if (pagedata.headmini.style.opacity !== 1) {
			pagedata.headmini.style.opacity = 1;
		}

		// menu handling: mini
		// pagedata.menu.style.height = `${pagedata.headmini.rect.height - pagedata.menu.verticalmargintotal}px`;
		pagedata.menu.style.height = 'auto';
		pagedata.menu.style.flexDirection = 'row-reverse';
		pagedata.menu.style.alignItems = 'flex-end';
		pagedata.menu.style.justifyContent = 'flex-end';

		if (pagedata.MENUISLOATING===true) {
			pagedata.MENUISLOATING = false;
			SetMenuPosition(pagedata);
		}
	}

	

}


function SetMenuPosition(pagedata, headmode) {
	// console.log('set menu')
	if (window.$fgta.showaccount && window.$fgta.showmenulist) {
		if (headmode==='big') {
			pagedata.menu_split.style.display = 'none';
			pagedata.menu_split.style.opacity = 0;
		} else {
			pagedata.menu_split.style.display = 'block';
			pagedata.menu_split.style.opacity = 1;
		}
	} else {
		pagedata.menu_split.style.display = 'none';
		pagedata.menu_split.style.opacity = 0;
	}

	if (window.$fgta.showaccount) {
		pagedata.menu_account.style.display = 'block';
		pagedata.menu_account.style.opacity = 1;
	} else {
		pagedata.menu_account.style.display = 'none';
		pagedata.menu_account.style.opacity = 0;
	}

	if (window.$fgta.showmenulist) {
		pagedata.menu_list.style.display = 'block';
		pagedata.menu_list.style.opacity = 1;
	} else {
		pagedata.menu_list.style.display = 'none';
		pagedata.menu_list.style.opacity = 0;			
	}
}