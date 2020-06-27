<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class ImageRoute extends Route {

	const ALLOWED_EXTENSIONS = array(
		'css' => ['contenttype'=>'text/css'],
		'gif' => ['contenttype'=>'image/gif'],
		'png' => ['contenttype'=>'image/png'],
		'svg' => ['contenttype'=>'image/svg+xml']
	);


	public function ProcessRequest($reqinfo) {
		
		$count = 1;
		$imgpath = str_replace($_SERVER['SCRIPT_NAME'] . '/images/', "", $_SERVER['REQUEST_URI'], $count);	
		$count = 1;
		$imgpath = str_replace('?' . $_SERVER['QUERY_STRING'] , "", $imgpath);
		
		$reqinfo->img_path = __ROOT_DIR . '/public/images/' . $imgpath ;
		$reqinfo->img_extension = pathinfo($reqinfo->img_path, PATHINFO_EXTENSION);

		if (!is_file($reqinfo->img_path)) {
			$err = new \Exception("'$imgpath' tidak ditemukan!");
			$err->title = 'Not Found';
			header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
			throw $err;
		}		
	

		if (!array_key_exists($reqinfo->img_extension, self::ALLOWED_EXTENSIONS)) {
			$err = new \Exception("Akses ke asset tidak diperbolehkan!");
			$err->title = 'Not Allowed';
			header($_SERVER['SERVER_PROTOCOL'] . ' 403 Not Allowed', true, 403);
			throw $err;
		}	

		$this->reqinfo = $reqinfo;
	}


	public function ShowResult($content) {
		$reqinfo = $this->reqinfo;
		header("Content-type: " . self::ALLOWED_EXTENSIONS[$reqinfo->img_extension]['contenttype']);
		header('Content-Length: ' . filesize($reqinfo->img_path));
		readfile($reqinfo->img_path);	
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

$ROUTER = new ImageRoute();
