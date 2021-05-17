<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR.'/core/couchdbclient.php';

use \FGTA4\CouchDbClient;



class CFSRoute extends Route {


	public function ProcessRequest($reqinfo) {
		
		$count = 1;
		$datarequestline = str_replace($_SERVER['SCRIPT_NAME'] . '/cfs/', "", $_SERVER['REQUEST_URI'], $count);	
		$datarequests = explode("/", $datarequestline);
		$this->id = urldecode($datarequests[0]);
		$this->attachmentname = urldecode($datarequests[1]);
		$this->reqinfo = $reqinfo;
		$this->datarequests = $datarequests;
	}


	public function ShowResult($content) {
		$this->cdb = new CouchDbClient((object)DB_CONFIG['FGTAFS']);
		try {
			$fileid = $this->id;
			$result = $this->cdb->getAttachment($fileid, 'filedata');
			$base64data = explode(',', $result->attachmentdata);
			header("Content-type: " . $result->type);
			header('Content-Length: ' . $result->size);
			echo base64_decode($base64data[1]);
		} catch (\Exception $ex) {
			throw $ex;
		}
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
