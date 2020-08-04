<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class JslibsRoute extends Route {

	const ALLOWED_EXTENSIONS = array(
		'js' => ['contenttype'=>'application/javascript'],
		'mjs' => ['contenttype'=>'application/javascript'],
		'css' => ['contenttype'=>'text/css'],
		'gif' => ['contenttype'=>'image/gif'],
		'png' => ['contenttype'=>'image/png'],
		'svg' => ['contenttype'=>'image/svg+xml']
	);


	public function ProcessRequest($reqinfo) {
		
		$count = 1;
		$jspath = str_replace($_SERVER['SCRIPT_NAME'] . '/jslibs/', "", $_SERVER['REQUEST_URI'], $count);	
		$count = 1;
		$jspath = str_replace('?' . $_SERVER['QUERY_STRING'] , "", $jspath);
		
		$reqinfo->jslibs_path = __ROOT_DIR . '/public/jslibs/' . $jspath ;
		$reqinfo->jslibs_extension = pathinfo($reqinfo->jslibs_path, PATHINFO_EXTENSION);

		if (!is_file($reqinfo->jslibs_path)) {
			$err = new \Exception("'$jspath' tidak ditemukan!");
			$err->title = 'Not Found';
			header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
			throw $err;
		}		
	

		if (!array_key_exists($reqinfo->jslibs_extension, self::ALLOWED_EXTENSIONS)) {
			$err = new \Exception("Akses ke asset tidak diperbolehkan!");
			$err->title = 'Not Allowed';
			header($_SERVER['SERVER_PROTOCOL'] . ' 403 Not Allowed', true, 403);
			throw $err;
		}	

		$this->reqinfo = $reqinfo;
	}


	public function ShowResult($content) {
		$reqinfo = $this->reqinfo;

		$jslibs_path = $reqinfo->jslibs_path;
		if ($reqinfo->jslibs_extension=='mjs' || $reqinfo->jslibs_extension=='js') {
			$jslibs_pathmin = \str_replace(['.mjs', '.js'], ['.min.mjs', '.min.js'], $reqinfo->jslibs_path);
			if (\is_file($jslibs_pathmin)) {
				$pmin_time = \filemtime($jslibs_pathmin);
				$pori_time = \filemtime($jslibs_path);
				if ($pmin_time > $pori_time) {
					$jslibs_path = $jslibs_pathmin;
				}
			}
		}

		header("Access-Control-Allow-Origin: *");
		header("Content-type: " . self::ALLOWED_EXTENSIONS[$reqinfo->jslibs_extension]['contenttype']);
		header('Content-Length: ' . filesize($jslibs_path));
		readfile($jslibs_path);	
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

$ROUTER = new JslibsRoute();
