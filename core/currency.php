<?php namespace FGTA4\utils;

class Currency {
	public $db;

	private $data;

	function __construct($db) {
		try {
			$this->data = (object)[
				// TODO: ambil rate dari database, sebaiknya buat class global yang bisa dipakai di tempat lain
				'USD' => 14000,
				'SGD' => 6000
			];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public function getRate($curr_id) {
		if (!\property_exists($this->data, $curr_id)) {
			return 1;
		} else {
			return $this->data->{$curr_id};
		}	
	}

	public function getConvertion($foreign, $local, $curr_id) {
		$local_curr_id = $this->getLocalCurrency();
		$rate = $this->getRate($curr_id);
		if ($curr_id==$local_curr_id) {
			return (object)[
				'foreign' => $local,
				'local' => $local,
				'rate' => $rate
			];
		} else {
			return (object)[
				'foreign' => $foreign,
				'local' => $foreign * $rate,
				'rate' => $rate
			];
		}	 
		
	}


	public function getLocalCurrency() {
		return defined('__LOCAL_CURR') ? __LOCAL_CURR : 'IDR';
	}
}
