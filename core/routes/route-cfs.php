<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class CFSRoute extends Route {


	public function ProcessRequest($reqinfo) {
		
		$count = 1;
		$datarequestline = str_replace($_SERVER['SCRIPT_NAME'] . '/cfs/', "", $_SERVER['REQUEST_URI'], $count);	
		$datarequests = urldecode($datarequestline);
		preg_match_all('/{(.*?)}/', $datarequests, $matches);
		$request = $matches[1];
		$id = $request[0];
		$attachmentname = $request[1];

		$this->reqinfo = $reqinfo;
		$this->datarequests = $datarequests;
	}


	public function ShowResult($content) {
		
	}

	
	public function ShowError($ex) {
		$content = ob_get_contents();
		ob_end_clean();

		$title = 'Error';
		if (property_exists($ex, 'title')) {
			$title = $ex->title;
		}

		$err = new \FGTA4\ErrorPage($title);
		$err->titlestyle = 'color:orange; margin-top: 0px';
		$err->content = $content;
		$err->Show($ex->getMessage());		
	}

}

$ROUTER = new CFSRoute();
