<?php

if(function_exists('xdebug_disable')) { 
	echo "disabling xdebug\r\n";
	xdebug_disable(); 
}

// copy akses program dan konfigurasi di deployment server
// contoh target:  /home/agung/Development/fgtacloud4u/server_data/progaccess

$apps_dir = dirname(__FILE__). '/apps';
$target_config_dir = $argv[1];

if ($argc<2) {
	echo "Target direktori tujuan belum ditentukan.\n";
	echo "syntax:  php copyproaccess.php <direktori-tujuan>";
	die();
}

if (!is_dir($target_config_dir)) {
	echo "Direktori $target_config_dir tidak ditemukan!";
	die();
}

class CopyprogAccess {

	function Execute() {
		global $apps_dir, $target_config_dir;
		echo "Reading directory: '$apps_dir' ...\r\n";
	
		$dircontents = opendir($apps_dir);
		while ($prj_dc_name = readdir($dircontents)) {
			if ($prj_dc_name=='.' || $prj_dc_name=='..' || $prj_dc_name=='fgta') { continue; }
			$prj_path = $apps_dir . "/$prj_dc_name";	
			if (!is_dir($prj_path)) { continue; }
			// echo $prj_path."\r\n";	
			$this->PrjReadDir($prj_path);
		
		}
		closedir($dircontents);

		echo "\r\n\r\n\r\n";
	}


	function PrjReadDir($prj_path) {
		$prj_dircontents = opendir($prj_path);
		while ($mod_dc_name = readdir($prj_dircontents)) {
			if ($mod_dc_name=='.' || $mod_dc_name=='..' || $mod_dc_name=='.git' || $mod_dc_name=='.vscode') { continue; }
			$mod_path = $prj_path . "/$mod_dc_name";
			if (!is_dir($mod_path)) { continue; }
			// echo "$mod_path\n";
			$this->ProReadDir($mod_path);

		}
		closedir($prj_dircontents);
	}


	function ProReadDir($mod_path) {
		$pro_dircontents = opendir($mod_path);
		while ($pro_dc_name = readdir($pro_dircontents)) {
			if ($pro_dc_name=='.' || $pro_dc_name=='..' ) { continue; }
			$pro_path = $mod_path . "/$pro_dc_name";
			if (!is_dir($pro_path)) { continue; }
			// echo "$pro_path\n";
			$this->CopyJson($pro_dc_name, $pro_path);

		}
	}


	function CopyJson($pro_dc_name, $pro_path) {
		global $apps_dir, $target_config_dir;
		$json_config_path = "$pro_path/$pro_dc_name.json";
		// echo "$json_config_path\n";
		if (is_file($json_config_path)) {
			$new_json_config_path = $target_config_dir. "/" . str_replace(array($apps_dir.'/', '/'), array('', '#'), "$pro_path.json");
			if (is_file($new_json_config_path)) {
				return;
			}

			echo "$new_json_config_path\n";
			copy($json_config_path, $new_json_config_path);

		}
	}


}

(new CopyprogAccess())->Execute();
die();

