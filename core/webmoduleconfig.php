<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

use FGTA4\exceptions\WebException;



class WebModuleConfig {

	public static $DefaultShortcutBackgroundColor = "";
	public static $DefaultModulegroupBackgroundColor = "";


	function __construct($moduleconfigpath, $ovr=false) {
		if (!is_file($moduleconfigpath)) {
			throw new WebException("File config '$moduleconfigpath' tidak ditemukan", 500);		
		}

		try {

			$jsonconfigstr = file_get_contents($moduleconfigpath);
			$moduleconfig = json_decode($jsonconfigstr);
			if (json_last_error()>0) {
				throw new \Exception("format json di '$moduleconfigpath' salah.");
			}

			if (!$ovr) {
				// baca dari original json setting

				if (!property_exists($moduleconfig, 'title')) {
					$moduleconfig->title = $modulefullname;
				}

				if (!property_exists($moduleconfig, 'variance')) {
					$moduleconfig->variance = new \stdClass;
				}

				if (!property_exists($moduleconfig, 'main')) {
					$moduleconfig->main = null;
				}

				if (!property_exists($moduleconfig, 'allowanonymous')) {
					$moduleconfig->allowanonymous = false;
				}
				
				if (!property_exists($moduleconfig, 'allowedgroups')) {
					$moduleconfig->allowedgroups = ['public'];
				}

				if (!property_exists($moduleconfig, 'disabled')) {
					$moduleconfig->disabled = false;
				}					
				
				if (!property_exists($moduleconfig, 'icon')) {
					$moduleconfig->icon = 'icon-application-white.png';
				}					

				if (!property_exists($moduleconfig, 'forecolor')) {
					$moduleconfig->forecolor = 'white';
				}	

				if (!property_exists($moduleconfig, 'backcolor')) {
					$moduleconfig->backcolor = self::$DefaultShortcutBackgroundColor;
				}	

				if (!property_exists($moduleconfig, 'data')) {
					$moduleconfig->data = new \stdClass;
				}	
						
				$this->title = $moduleconfig->title;
				$this->variance = $moduleconfig->variance;
				$this->main = $moduleconfig->main;
				$this->allowanonymous = $moduleconfig->allowanonymous;
				$this->allowedgroups = $moduleconfig->allowedgroups;
				$this->disabled = $moduleconfig->disabled;
				$this->icon = $moduleconfig->icon;
				$this->forecolor = $moduleconfig->forecolor;
				$this->backcolor = $moduleconfig->backcolor;
				$this->data = $moduleconfig->data;
			
			} else {
				// baca setting yang di ovveride

				if (property_exists($moduleconfig, 'title')) {
					$this->title = $moduleconfig->title;
				}


				if (property_exists($moduleconfig, 'variance')) {
					$this->variance = $moduleconfig->variance;
				}				


				if (property_exists($moduleconfig, 'main')) {
					$this->main = $moduleconfig->main;
				}


				if (property_exists($moduleconfig, 'allowanonymous')) {
					$this->allowanonymous = $moduleconfig->allowanonymous;
				}

				if (property_exists($moduleconfig, 'allowedgroups')) {
					$this->allowedgroups = $moduleconfig->allowedgroups;
				}

				if (property_exists($moduleconfig, 'disabled')) {
					$this->disabled =  $moduleconfig->disabled;
				}	

				if (property_exists($moduleconfig, 'icon')) {
					$this->icon =  $moduleconfig->icon;
				}
				
				if (property_exists($moduleconfig, 'forecolor')) {
					$this->forecolor = $moduleconfig->forecolor;
				}	

				if (property_exists($moduleconfig, 'backcolor')) {
					$this->backcolor = $moduleconfig->backcolor;
				}	

				if (property_exists($moduleconfig, 'data')) {
					$this->data = $moduleconfig->data;
				}				

			}



			if (!property_exists($moduleconfig, 'apis')) {
				$moduleconfig->apis = new \stdClass;
			}

			if (!is_object($moduleconfig->apis)) {
				throw new \Exception("variable apis di '$moduleconfigpath' harus dalam bentuk object.");
			}

			foreach ($moduleconfig->apis as $apiname => $apiinfo) {
				if (!is_object($apiinfo)) {
					throw new \Exception("variable apis->$apiname di '$moduleconfigpath' harus dalam bentuk object.");
				}

				if (!property_exists($apiinfo, 'allowanonymous')) {
					$moduleconfig->apis[$apiname]->allowanonymous = false;
				}
			}
			$this->apis = $moduleconfig->apis;
		

	




		} catch (\Exception $ex) {
			throw new WebException($ex->getMessage(), 500);	
		}		

	}	
}
