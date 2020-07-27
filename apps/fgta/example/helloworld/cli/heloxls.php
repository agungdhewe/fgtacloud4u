<?php

require_once __ROOT_DIR . "/rootdir/phpmailer/class.phpmailer.php";
require_once __ROOT_DIR . "/rootdir/phpmailer/class.smtp.php";
require_once __ROOT_DIR . "/rootdir/phpoffice_phpspreadsheet_1.13.0.0/vendor/autoload.php";



use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;

console::class(new class($args) extends cli {
	function __construct($args) {
		$this->args = $args;
		$DB_CONFIG = DB_CONFIG['DSR'];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM['mariadb'];
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);		
	}

	function execute() {
		// workbook_create($this);
		debug::start(__LOCALDB_DIR . "/output/log-fgta-example-helloworld-heloxls.txt");

	hello_execute($this);
		debug::close(true);
	}
});


function hello_execute($self) {
	debug::log(DB_CONFIG);
	debug::log(color::red . uniqid() . color::reset);
}





function workbook_create($obj) {
	$filename = 'testxls.xlsx';
	$filepath = __LOCALDB_DIR . "/output/$filename";

	
	$createsheet = function($doc, $sheetsinfo) {
		$sheets = [];
		$i=0;
		foreach ($sheetsinfo as $name => $title) {
			if ($i==0) {
				$doc->setActiveSheetIndex(0);
				$sheet = $doc->getActiveSheet();
			} else {
				$sheet = $doc->createSheet();
			}
			$sheet->setTitle($title);
			$sheets[$name] = $sheet;
			$i++;
		}
	};

	$doc = new Spreadsheet();
	$doc->getActiveSheet()->getProtection()->setPassword('PhpSpreadsheet');
	$doc->getActiveSheet()->getProtection()->setSheet(true);
	$doc->getActiveSheet()->getProtection()->setSort(true);
	$doc->getActiveSheet()->getProtection()->setInsertRows(true);
	$doc->getActiveSheet()->getProtection()->setFormatCells(true);

	$doc->getProperties()->setCreator("Agung Nugroho DW")
						->setLastModifiedBy("Agung Nugroho DW")
						->setTitle("Judul Dokumen yang dibuat pakai PHP")
						->setSubject("Judul Dokumen yang dibuat pakai PHP");

	$doc->sheets = $createsheet($doc, [
		"satu" => "Sheet Pertama",
		"dua" => "Sheet Kedua",
		"tiga" => "Sheet Ketiga"
	]);


	spreadsheet_createsummary($obj, $doc->sheets['satu']);


	$writer = new Xls($doc);
	$writer->save($filepath);

	
}


function spreadsheet_createsummary($obj, $sheet) {

}


