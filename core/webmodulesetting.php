<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

use FGTA4\exceptions\WebException;


class WebModuleSetting {
	public $path;
	public $data;

	function __construct($modulesettingpath) {
		$this->path = $modulesettingpath;
		if (is_file($modulesettingpath)) {
			try {

				$jsonsettingstr = file_get_contents($modulesettingpath);
				$this->data = json_decode($jsonsettingstr);
				if (json_last_error()>0) {
					throw new \Exception("format json di '$modulesettingpath' salah.");
				}
			} catch (\Exception $ex) {
				throw new WebException($ex->getMessage(), 500);	
			}	
		} else {
			$this->data = new \stdClass;
		}		
	}

	function get($settingpath) {
		$pathdata = explode('/', $settingpath);
		$currentobj = $this->data;
		foreach ($pathdata as $pk) {
			if (property_exists($currentobj, $pk)) {
				$currentobj = $currentobj->{$pk};
			} else {
				return "";
			}
		}

		return $currentobj;
	}

}