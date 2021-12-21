<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}


use FGTA4\WebModuleConfig;
use FGTA4\exceptions\WebException;



class ListModules extends WebAPI {

	function __construct() {
		$this->debugoutput = true;
		// switch (__APPNAME) {
		// 	case "kalista" :
		// 		WebModuleConfig::$DefaultShortcutBackgroundColor = "#9d6da9";
		// 		WebModuleConfig::$DefaultModulegroupBackgroundColor = "#9d6da9";
		// 		break;

		// 	default:
		// 		WebModuleConfig::$DefaultShortcutBackgroundColor = "#3F4756"; // "#9d6da9";
		// 		WebModuleConfig::$DefaultModulegroupBackgroundColor = "#3F4756"; //"#9d6da9";ssss
		// }

		try {
			$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
			$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];
			$this->db = new \PDO(
						$DB_CONFIG['DSN'], 
						$DB_CONFIG['user'], 
						$DB_CONFIG['pass'], 
						$DB_CONFIG['param']
			);
		} catch (\Exception $ex) {
		}

		WebModuleConfig::$DefaultShortcutBackgroundColor = '';
		WebModuleConfig::$DefaultModulegroupBackgroundColor = '';

	}

	static function getModuleListPath() {
		$appid = array_key_exists('appid', $_COOKIE) ? $_COOKIE['appid'] : '';

		switch ($appid) {
			case 'xasafanrjdnf84rhu4fh04fhos0f4wofw40':
				// etap
				return realpath(__LOCALDB_DIR . '/menus/modules-etap.json');

			default:
				$menu = realpath(__LOCALDB_DIR . '/menus/modules-public.json');
				$userdata = json_decode($_SESSION['userdata']);
				// if (array_key_exists('menu', $userdata)) {
				if (property_exists($userdata, 'menu')) {	
					$usermenu = __LOCALDB_DIR . "/menus/$userdata->menu";
					if (is_file($usermenu)) {
						$menu = realpath($usermenu);
					} else {
						throw new \Exception("File Menu: '<b>$usermenu</b>' tidak ditemukan");
					}
				}


				// if (!is_file($menu)) {
				// 	echo "<hr>";
				// 	echo $menu;
				// 	echo "<hr>";
				// 	print_r($userdata);
				// 	echo "<hr>";
				// 	echo __LOCALDB_DIR;
				// 	echo "<hr>";
				// 	throw new \Exception('path: '. __LOCALDB_DIR);
				// }


				return $menu;
		}
	
	}

	public function execute($username) {

		$userdata = $this->auth->session_get_user();

		$modulepath = self::getModuleListPath();
		$modulesjsondata = file_get_contents($modulepath);
		$modulesrawdata = json_decode($modulesjsondata, true);
		if (json_last_error()) {
			throw new WebException("format json pada file '$modulepath' salah",  500);
		}

		$USERMODULES = $this->CreateModuleHierarchy($modulepath, $modulesrawdata['modules'], $userdata);
		return $USERMODULES;
	}


	public function CreateModuleHierarchy($modulepath, $modules, $userdata) {
		if (!is_array($modules)) 
			return;

		$USERMODULES = array();
		foreach ($modules as $moduleitem) {
			
			$itemtype = 'program';
			if (is_array($moduleitem)) {
				if (array_key_exists('program', $moduleitem)) {
					$itemtype = 'program-withparam';
				} else {
					$itemtype = 'programgroup';
				}
			}

			if ($itemtype=='programgroup') {
				// module group
				$mdl = new ModuleGroup($moduleitem, $userdata);
				if (array_key_exists('modules', $moduleitem)) {
					$mdl->MODULES = $this->CreateModuleHierarchy($modulepath, $moduleitem['modules'], $userdata);
				} else if (array_key_exists('file', $moduleitem)) {
					// link ke file lain
					$childmodulepath = dirname($modulepath) . "/" . $moduleitem['file'];
					if (!is_file($childmodulepath)) {
						throw new WebException("child module menu '$childmodulepath' tidak ditemukan. Cek konfigurasi menu di '$modulepath'",  500);
					}

					$modulesjsondata = file_get_contents($childmodulepath);
					$modulesrawdata = json_decode($modulesjsondata, true);
					if (json_last_error()) {
						throw new WebException("format json pada file '$childmodulepath' salah",  500);
					}
					
					if (!array_key_exists('modules', $modulesrawdata)) {
						throw new WebException("array module tidak ditemukan di root '$childmodulepath'",  500);
					}

					$mdl->MODULES = $this->CreateModuleHierarchy($childmodulepath, $modulesrawdata['modules'], $userdata);
					
				}
			} else if ($itemtype=='program-withparam') {
				$modulefullname = $moduleitem['program'];
				$variancename =  $moduleitem['variancename'];
				$mdl = new ModuleShorcut($modulefullname, $userdata, $variancename);
			} else {
				$modulefullname = $moduleitem;
				$mdl = new ModuleShorcut($modulefullname, $userdata);
			}

			if (\property_exists($this, 'db')) {
				$mdl->db = $this->db;
			}
			array_push($USERMODULES, $mdl);
		}

		return $USERMODULES;
		
	}

}


class ModuleIcon {
	public $type;
	public $title;
	public $icon;
	public $forecolor;
	public $backcolor;
	public $disabled = false;
}

class ModuleGroup extends ModuleIcon  {
	public $type = "modulegroup";
	function __construct($modulegroup, $userdata) {

		$this->title = array_key_exists('title', $modulegroup) ? $modulegroup['title'] : 'modules group';
		$this->icon = array_key_exists('icon', $modulegroup) ? $modulegroup['icon'] : 'icon-folder-white.png';
		$this->forecolor = array_key_exists('forecolor', $modulegroup) ? $modulegroup['forecolor'] : 'white';
		$this->backcolor = array_key_exists('backcolor', $modulegroup) ? $modulegroup['backcolor'] : WebModuleConfig::$DefaultModulegroupBackgroundColor;
		$this->disabled = array_key_exists('disabled', $modulegroup) ? $modulegroup['disabled'] : false;


	}
}

class ModuleShorcut extends ModuleIcon {
	public $type = "module";

	private $userdata;

	function __construct($modulefullname, $userdata, $variancename=null) {
		$this->userdata = $userdata;
		$this->modulefullname = $modulefullname;
		$this->url_param = '';
		
		/* patch module name: add parameter */
		$modpar = explode('?', $this->modulefullname);
		if (count($modpar)>1) {
			$this->modulefullname = $modpar[0];
			$this->url_param = $modpar[1];
		}

		$moduleinfo = $this->get_module_info($this->modulefullname, $variancename);

	}

	function get_module_info($modulefullname, $variancename=null) {

		$modulepath = __ROOT_DIR."/apps/$modulefullname";
		$modulename = basename($modulepath);

		if ($variancename!=null) {
			$x = 0;
		}

		// cek file konfigurasi
		$moduleconfigpath = "$modulepath/$modulename.json";
		$moduleconfigpath_original =  $moduleconfigpath;
		$moduleconfigpath_ovveride = __LOCALDB_DIR . '/progaccess/' . str_replace("/", "#", $modulefullname) . ".json";
		if (is_file($moduleconfigpath_ovveride)) {
			$moduleconfigpath = $moduleconfigpath_ovveride;
		}	

		if (!is_file($moduleconfigpath)) {
			$modulelistpath = ListModules::getModuleListPath();
			throw new WebException("file konfigurasi untuk '$modulename' tidak ditemukan. ($moduleconfigpath). Cek file konfigurasi, atau mungkin salah penulisan di daftar module pada file '$modulelistpath'",  500);
		}

		//$mcori = new WebModuleConfig($moduleconfigpath_original);
		//$moduleconfig = $mcori;
		$moduleconfig = new WebModuleConfig($moduleconfigpath_original);
		if ($moduleconfigpath!=$moduleconfigpath_original) {
			$mcovr = new WebModuleConfig($moduleconfigpath, true); 
			$moduleconfig = (object) array_merge((array)$moduleconfig, (array)$mcovr);
		}


		$this->title = $moduleconfig->title;
		$this->icon = $moduleconfig->icon;
		$this->forecolor = $moduleconfig->forecolor;
		$this->backcolor = $moduleconfig->backcolor;
		$this->allowedgroups = $moduleconfig->allowedgroups;

		$iconinfo = IconInfo::getIconInfo($moduleconfig->icon);
		if (array_key_exists('backgrounColor', $iconinfo)) {
			// WebAPI::log($iconinfo['backgrounColor'] . ' -- ' . $this->backcolor);
			if ($this->backcolor=='' && !($iconinfo['backgrounColor'] == '#000000' || $iconinfo['backgrounColor'] == '#ffffff')) {
				$this->backcolor = $iconinfo['backgrounColor'];
			}
		}
		
		// cek apakah modulenya diperbolehkan
		$this->disabled = true;

		// variance
		if ($variancename!=null) {

			$this->variancename = $variancename;

			if (property_exists($moduleconfig->variance, $variancename)) {
				$variancedata = $moduleconfig->variance->{$variancename};
			} else {
				$variancedata = new \stdClass;
			}

			if (property_exists($variancedata, 'title')) {
				$this->title = $variancedata->title;
			}


			if (property_exists($variancedata, 'backcolor')) {
				$this->backcolor = $variancedata->backcolor;

			}


			if (property_exists($variancedata, 'icon')) {
				$this->icon = $variancedata->icon;
				$iconinfo = IconInfo::getIconInfo($this->icon);
				if (array_key_exists('backgrounColor', $iconinfo)) {
					// WebAPI::log($iconinfo['backgrounColor'] . ' -- ' . $this->backcolor);
					if ($this->backcolor=='' && !($iconinfo['backgrounColor'] == '#000000' || $iconinfo['backgrounColor'] == '#ffffff')) {
						$this->backcolor = $iconinfo['backgrounColor'];
					}
				}
			}


			if (property_exists($variancedata, 'allowedgroups')) {
				$this->allowedgroups = $variancedata->allowedgroups;
			}			

		}

		if (\property_exists($this, 'db')) {
			// TODO: Ambil info program dari database
		}


		foreach ($this->allowedgroups as $allowed_group) {
			if (in_array($allowed_group, $this->userdata->groups)) {
				$this->disabled = false;
				break;
			}
		}		

		
	}

}


class IconInfo {
	public function getIconInfo($icon) {
		$info = [];

		$path = __ROOT_DIR . '/public/images/icons/' . $icon;
		if (\is_file($path)) {
			$ext = pathinfo($path, PATHINFO_EXTENSION);
			if ($ext=='svg') {
				$svgDoc = new \DOMDocument();
				$svgDoc->load($path);

				$pagecolor="";
				$svgEl = $svgDoc->documentElement;
				foreach ($svgEl->childNodes as $el) {
					// echo $el->nodeName . "\r\n";
					if ($el->nodeName=='sodipodi:namedview') {
						$pagecolor = $el->getAttribute('pagecolor');
						break;
					}
				}

				if ($pagecolor!="") {
					$info['backgrounColor'] = $pagecolor;
				}
			}
		}

		return $info;

	}
}




$API = new ListModules();