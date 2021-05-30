<?php namespace TransFashion\MPC;

require_once __DIR__ . '/mpchelper.php';

class MPCHeader {
	private $_appid;
	private $_appsecret;
	private $_privatekey;
	private $_body;

	private $_nonce;
	private $_timestamp;


	function __construct($appid, $appsecret, $privatekey,  $body) {
		$this->_appid = $appid;
		$this->_appsecret = $appsecret;
		$this->_privatekey = $privatekey;
		$this->_timestamp = MPCHelper::CreateTimestamp(); 
		$this->_nonce = MPCHelper::CreateNonce($this->_timestamp);
		$this->_body = $body;
		$this->_sign = $this->CreateSign();
	}

	private function CreateSign() {
		$strBody = $this->_body->getFormattedData();
        $arr = [$this->_appid, $this->_nonce, $this->_timestamp, $this->_appsecret, $strBody];

		asort($arr,2);
        $data = join('', $arr);

		$obj = hash('sha256', $data);
        $objBin = hex2bin($obj);
	
		$strSign = '';
		$encrypted = openssl_private_encrypt($objBin, $crypttext, $this->_privatekey);
		if ($encrypted) {
            $strSign = bin2hex($crypttext);
		}
		return $strSign;
	}


	public function getData() {
		return [
			'nonce' => $this->_nonce,
			'timestamp' => $this->_timestamp,
			'appid' => $this->_appid,
			'sign' => $this->_sign,
            'Content-Type' => 'application/json'
		];
	}


	public function getFormattedData() {
		$headerdata = $this->getData();

		$header = [];
		foreach ($headerdata as $key=>$value) {
			$header[] = "$key: $value";
		}
		return $header;
	}

}
