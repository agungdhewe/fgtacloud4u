<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __DIR__ . '/webprog.php';


class WebAPI extends \FGTA4\WebProg {
	
	public function ActionIsAllowedFor($api_info, $user_owned_groups) {
	
		try {
			if ($user_owned_groups==null) {
				$user_owned_groups = ['public'];
			}

			$api_allowed_groups = property_exists($api_info, 'allowedgroups') ? $api_info->allowedgroups : ['public'];
			foreach ($api_allowed_groups as $allowed_group) {
				if (in_array($allowed_group, $user_owned_groups)) {
					return true;
				}
			}
			return false;
		} catch (\Exception $ex) {
			throw $ex;
		}

	}	

	
	public function RequestIsAllowedFor($reqinfo, $apiname, $user_owned_groups) {
		try {

			if ($user_owned_groups==null) {
				$user_owned_groups = ['public'];
			}

			if (!property_exists($reqinfo->moduleconfig->apis, $apiname)) {
				return false;
			}
			
			$api_info = $reqinfo->moduleconfig->apis->$apiname;


			$api_allowed_groups = property_exists($api_info, 'allowedgroups') ? $api_info->allowedgroups : ['public'];
			foreach ($api_allowed_groups as $allowed_group) {
				if (in_array($allowed_group, $user_owned_groups)) {
					return true;
				}
			}

			return false;

			return false;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public function debug($obj) {
		$this->debugoutput = true;
		if (is_array($obj) || \is_object($obj)) {
			echo "<pre>";
			var_dump($obj);
			echo "</pre>";
		} else {
			echo nl2br($obj);
		}
	}

	public function isDebugOutput() {
		$debugoutput = \property_exists($this, 'debugoutput') ? $this->debugoutput : false;
		return $debugoutput;
	}

}

