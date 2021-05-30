<?php namespace TransFashion\MPC;

require_once __DIR__ . '/mpchelper.php';

class MPCResponse {
	private $_code;
	private $_message;
	private $_bizSeqNo;
	private $_transactionNo;
	private $_data;

	function __construct($data) {

		//print_r($data);
		//echo "========================";

		// olah data sehingga mengisi data2 private
		if (\property_exists($data, 'code')) {
			$this->_code = (int)$data->code;
		}

		if (\property_exists($data, 'message')) {
			$this->_message = $data->message;
		}

		if (\property_exists($data, 'bizSeqNo')) {
			$this->_bizSeqNo = $data->bizSeqNo;
		}

		if (\property_exists($data, 'transactionNo')) {
			$this->_transactionNo = $data->transactionNo;
		}

		if (\property_exists($data, 'responseData')) {
			$this->_data = $data->responseData;
		}
	}

	public function getCode() {
		return $this->_code;
	}

	public function getMessage() {
		return $this->_message;
	}

	public function getBizSeqNo() {
		return $this->_bizSeqNo;
	}

	public function getTransactionNo() {
		return $this->_transactionNo;
	}

	public function getData() {
		return $this->_data;
	}

	

}
