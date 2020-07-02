<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class ImageRoute extends Route {

	public function ProcessRequest($reqinfo) {
	}


	public function ShowResult($content) {
		$global_public_dir = __ROOT_DIR . '/public';
		$local_public_dir = dirname($_SERVER['SCRIPT_FILENAME']);

		$faviconpath = $global_public_dir . '/favicon.ico';
		$local_faviconpath = $local_public_dir . '/favicon.ico';
		if (is_file($local_faviconpath)) {
			$faviconpath = $local_faviconpath; 
		} else if (!is_file($faviconpath)) {
			$err = new \Exception("'$faviconpath' tidak ditemukan!");
			$err->title = 'Not Found';
			header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
			throw $err;
		}
		header('Content-type: image/x-icon');
		header('Content-Length: ' . filesize($faviconpath));
		readfile($faviconpath);		

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
