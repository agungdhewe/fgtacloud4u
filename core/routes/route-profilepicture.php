<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class ImageRoute extends Route {

	public function ProcessRequest($reqinfo) {
		
		$count = 1;
		$user_id = str_replace($_SERVER['SCRIPT_NAME'] . '/profilepicture/', "", $_SERVER['REQUEST_URI'], $count);	

		$count = 1;
		$user_id = str_replace('?' . $_SERVER['QUERY_STRING'] , "", $user_id);
		


		$datapath = __LOCALDB_DIR . '/userprofiles/' . $user_id . ".json" ;


		if (is_file($datapath)) {
			$reqinfo->datapath = $datapath;
		} else {
			$err = new \Exception("'$user_id' tidak ditemukan!");
			$err->title = 'Not Found';
			header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
			throw $err;
		}

		$this->reqinfo = $reqinfo;
	}


	public function ShowResult($content) {
		$reqinfo = $this->reqinfo;

		// baca data dari $reqinfo->datapath
		$fp = fopen($reqinfo->datapath, "r");
		$jsondata = fread($fp, filesize($reqinfo->datapath));

		$obj = json_decode($jsondata);

		$base64data = explode(',', $obj->data);
		header("Content-type: " . $obj->type);
		header('Content-Length: ' . $obj->size);
		echo base64_decode($base64data[1]);
	}

	
	public function ShowError($ex) {
		$blankimgpath = __ROOT_DIR . '/public/images/1x1-ffff007f.png';	
		if (is_file($blankimgpath )) {
			$mime = mime_content_type($blankimgpath);
			header("Content-type: " . $mime);
			header('Content-Length: ' . filesize($blankimgpath));
			$fp = fopen($blankimgpath, "r");
			echo fread($fp, filesize($blankimgpath));
			fclose($fp);
		} else {
			$err = new \FGTA4\ErrorPage("Not Found");
			$err->titlestyle = 'color:orange; margin-top: 0px';
			$err->content = $content;
			$err->Show("Image not found");
		}
	}

}

$ROUTER = new ImageRoute();
