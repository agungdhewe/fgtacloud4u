<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class AssetRoute extends Route {

	const ALLOWED_EXTENSIONS = array(
		'js' => ['contenttype'=>'application/javascript'],
		'mjs' => ['contenttype'=>'application/javascript'],
		'css' => ['contenttype'=>'text/css'],
		'gif' => ['contenttype'=>'image/gif'],
		'png' => ['contenttype'=>'image/png'],
		'svg' => ['contenttype'=>'image/svg+xml'],
		'pdf' => ['contenttype'=>'application/pdf'],
		'woff2' => ['contenttype'=>'font/woff2']
	);

	public function ProcessRequest($reqinfo) {
		$reqinfo->assetextension = pathinfo($reqinfo->modulerequestinfo, PATHINFO_EXTENSION);
		$reqinfo->assetpath = "$reqinfo->moduledir/$reqinfo->modulerequestinfo";
		var_dump($reqinfo);

		if ($reqinfo->modulerequestinfo=='') {
			$err = new \Exception("Asset tidak didefinisikan!");
			$err->title = 'Bad Request';
			header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request', true, 400);
			throw $err;			
		}

	
		// if (!in_array($reqinfo->assetextension, self::ALLOWED_EXTENSIONS)) {
		if (!array_key_exists($reqinfo->assetextension, self::ALLOWED_EXTENSIONS)) {
			$err = new \Exception("Akses ke asset tidak diperbolehkan!");
			$err->title = 'Not Allowed';
			header($_SERVER['SERVER_PROTOCOL'] . ' 403 Not Allowed', true, 403);
			throw $err;
		}	

		if (!is_file($reqinfo->assetpath)) {
			$err = new \Exception("Asset '$reqinfo->assetpath' tidak ditemukan!");
			$err->title = 'Not Found';
			header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
			throw $err;
		}

		$this->reqinfo = $reqinfo;
	}

	public function ShowResult($content) {
		$reqinfo = $this->reqinfo;
		//header("Content-type: " . mime_content_type ( $reqinfo->assetpath));

		$assetpath = $reqinfo->assetpath;
		// if ($reqinfo->assetextension=='mjs') {
		// 	$assetpath_min = \str_replace('.mjs', '.min.mjs', $reqinfo->assetpath);
		// 	if (\is_file($assetpath_min)) {
		// 		$pmin_time = \filemtime($assetpath_min);
		// 		$pori_time = \filemtime($assetpath);
		// 		if ($pmin_time > $pori_time) {
		// 			$assetpath = $assetpath_min;
		// 		}
		// 	} else {
		// 		// minify js

		// 	}
		// }

		if ($reqinfo->assetextension=='mjs') {
			$modulerequest_min = \str_replace('.mjs', '.min.mjs', $reqinfo->modulerequestinfo);

			// cek di localdb dir
			$assetpath_min = __OBFUSCATED_DIR . "/$reqinfo->appsgroup/". $reqinfo->appsname . "%D%" .  $reqinfo->modulename . "%D%" . $modulerequest_min;
			if (\is_file($assetpath_min)) {
				$pmin_time = \filemtime($assetpath_min);
				$pori_time = \filemtime($assetpath);
				if ($pmin_time > $pori_time) {
					$assetpath = $assetpath_min;
				}				
			}
		}

		header("Content-type: " . self::ALLOWED_EXTENSIONS[$reqinfo->assetextension]['contenttype']);
		header('Content-Length: ' . filesize($assetpath));
		readfile($assetpath);		
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

$ROUTER = new AssetRoute();
