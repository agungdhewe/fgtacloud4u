var prev_window_onload = window.onload;

window.onload = function() {
	var res = prev_window_onload({
		show_footer_after_load: false
	});

	var pdfurlpath = `catalog/${window.global.brand_id}/${window.global.catalog_filename}`;
	renderPDF(pdfurlpath, document.getElementById('pdfcontainer'));


	var maincontainer_el = document.getElementById('maincontainer-default');
	maincontainer_el.style.paddingLeft = '0px';
	maincontainer_el.style.paddingRight = '0px';
	maincontainer_el.style.paddingTop = '0px';
	maincontainer_el.style.paddingBottom = '0px';

	var pdfcontainer_el = this.document.getElementById('pdfcontainer');
	
	pdfcontainer_el.style.width = `${res.hd_size.width}px`
	pdfcontainer_el.style.paddingTop = '5px';


	

}



function renderPDF(url, canvasContainer, options) {
	var w = window.innerWidth;


	var md = this.document.getElementById('maincontainer-default');
	var options = options || { scale: 1 };
	var md_width_string = `${w-5}px`	;
	
 
    function renderPage(page) {
        var viewport = page.getViewport(options.scale);
		var canvas = document.createElement('canvas');

		canvas.style.width = md_width_string;
		
		canvas.height = viewport.height;
        canvas.width = viewport.width;

        var ctx = canvas.getContext('2d');
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        

        canvasContainer.appendChild(canvas);
        
		page.render(renderContext);
		

    }
    
    function renderPages(pdfDoc) {
        for(let num = 1; num <= pdfDoc.numPages; num++) {
			pdfDoc.getPage(num).then((page)=>{
				renderPage(page);
				if (num==pdfDoc.numPages) {
					var loader_el = document.getElementById('loader');
					loader_el.style.display = 'none';
					
					var md = this.document.getElementById('maincontainer-default');
					var md_size = canvasContainer.getBoundingClientRect();

					var maincontent_height = Math.ceil(md_size.height);
					md.style.height = `${maincontent_height}px`;


					var fd = this.document.getElementById('foot-default');
					fd.style.visibility = 'visible';


					// tambahkan download catalog
					var divDwnContainer = document.createElement('div')
					var aDwnContainer = document.createElement('a')

					aDwnContainer.href = url
					aDwnContainer.appendChild(document.createTextNode('download this catalog'))
					aDwnContainer.classList.add('download-catalog');

					divDwnContainer.appendChild(aDwnContainer);
					divDwnContainer.classList.add('download-container');

					fd.parentNode.insertBefore(divDwnContainer,  fd);
				}
			});
		}

    }

    pdfjsLib.disableWorker = true;
    pdfjsLib.getDocument(url).then(renderPages);

} 