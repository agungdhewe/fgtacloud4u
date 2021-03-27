<?php namespace TransFashion\MPC;




class MPCRequestBody {
	private $_transactionNo;
	private $_data;

	function __construct($data, $apiCode='00000000000000') {
		$this->_transactionNo = MPCHelper::GenerateTransactionNo($apiCode);
		$this->_data = $data;

	}

	function getData() {
		return (object)[
			"transactionNo" => 	$this->_transactionNo,
			"requestData" => $this->_data
		];
	}

	function getFormattedData() {
		$data = $this->getData();
		return json_encode($data);
	}

}

