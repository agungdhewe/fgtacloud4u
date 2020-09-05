<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


class BlankPage extends WebModule {
	
	public function LoadPage() {
		$this->preloadscripts = [
			'jslibs/qrious.js'
		];

		$this->printdate = date('d/m/Y');
		$this->document_id = 'AB/4CD/89012345678901234567890';
	}
}

$MODULE = new BlankPage();