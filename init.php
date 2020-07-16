<?php


class init {

	function __construct($args) {
		$this->args = $args;
	}


	function CheckCommand() {
		if (count($this->args) < 2) {
			$msg  = "Target direktori tujuan belum ditentukan.\n";
			$msg .= "syntax:  php init.php <nama_project_tanpa_spasi>";
			throw new Exception($msg);
		}

		$this->projectname = $this->args[1];
	}

	function CreateProjectDir($namaproject) {
		$path = dirname(__FILE__)."/public_$namaproject";
		if (is_dir($path) || is_file($path)) {
			$msg  = "\x1b[33m"."public_$namaproject"."\x1b[0m"." konflik dengan path "."\x1b[1m".$path."\x1b[0m"." yang sudah ada\n";
			throw new Exception($msg);			
		}

		mkdir($path);
		$this->projectpath = $path;
		$this->projectpath_win = dirname(__FILE__)."\\public_$namaproject";

	}

	
	function CreateSymlink() {
		$tosymlink = ["images", "jslibs", "templates", "index.php", "getotp.php", "info.php"];
		foreach ($tosymlink as $objname) {
			$source = dirname(__FILE__)."\\public\\$objname";
			$target = $this->projectpath_win."\\$objname";	
			
			$cmd = "MKLINK /D $target $source";
			// echo $cmd;
			system($cmd);	
		}
	}


	function CopyFromPublic() {
		//$source = dirname(__FILE__)."/public/dbconfig";
		$tocopy = ['dbconfig.php', 'favicon.ico', 'manifest.json'];
		foreach ($tocopy as $filename) {
			$source = dirname(__FILE__)."/public/$filename";
			$target = $this->projectpath."/$filename";

			echo "copying $filename ...\r\n";
			copy($source, $target);
		}

	}


	function CreateHtaccess() {
		$target = $this->projectpath_win."\\.htaccess";
		$fp = fopen($target, "w");
		// fputs($p)			
	}


	function execute() {
		try {

			$this->CheckCommand();
			$this->CreateProjectDir($this->projectname);
			$this->CreateSymlink();
			$this->CopyFromPublic();
			$this->CreateHtaccess();
			

		} catch (Exception $ex) {
			echo "\x1b[31m"."ERROR"."\x1b[0m"."\r\n";
			echo $ex->getMessage();
		} finally {
			die("\r\n\r\n");
		}
	}

}

(new init($argv))->execute();
