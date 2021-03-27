<?php namespace TransFashion\MPC;


require_once __DIR__ . '/mpchelper.php';
require_once __DIR__ . '/mpcheader.php';
require_once __DIR__ . '/mpcrequestbody.php';
require_once __DIR__ . '/mpcresponse.php';
require_once __DIR__ . '/mpceventnames.php';




/**
 * MPC Procotol
 * Untuk core koneksi ke MPC Open API
 * 
 * @package MPCConnector
 * @link https://gitlab.com/agung12/mpcconnect
 * @author Abdul Syakur
 * @author Agung Nugroho
 **/
class MPCProtocol {
	
	const ConnectTimeout = 10;
	const ExecuteTimemout = 30;


	private object $config;
	private Array $handlers = [];

	function __construct(object $config) {
		$defaultConfig = [
			'Host' => 'http://47.242.35.254:18084/api/v1.0/mpc',
			'ApplicationId' => '',
			'ApplicationSecret' => '',
			'PrivateKey' => ''
		];
		$this->config = (object) array_merge($defaultConfig, (array) $config);		
	}

	public function AddEventHandler($eventname, callable $fn_handler) {
		MPCHelper::AddEventHandler($this->handlers, $eventname, $fn_handler);
	}


	public function ApiExecute(array $apiinfo, $data) : MPCResponse {
		try {

			$apiCode = $apiinfo[0];
			$apiTarget = $apiinfo[1];

			$url = $this->config->Host . '/' . $apiTarget;
			$appid = $this->config->ApplicationId;
			$appsecret = $this->config->ApplicationSecret;
			$privatekey = $this->config->PrivateKey;

			$body = new MPCRequestBody($data, $apiCode);
			$header = new MPCHeader($appid, $appsecret, $privatekey,  $body);

			/* lakukan kirim data ke Open MPC disini */
			$res = $this->SendData($url, $header, $body);

			$result = new MPCResponse($res);

			if ($result->getCode()!=0) {
				throw new \Exception($result->getMessage());
			}

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	function SendData($url, $header, $body) {
		try {
			$timestart = microtime(true);

			$headerdata =  $header->getFormattedData();
			$bodydata = $body->getFormattedData();

			// header
			$ch = \curl_init(); 
			\curl_setopt($ch, CURLOPT_URL, $url); 
			\curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
			\curl_setopt($ch, CURLOPT_HTTPHEADER, $headerdata);
			\curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, self::ConnectTimeout);
			\curl_setopt($ch, CURLOPT_TIMEOUT, self::ExecuteTimemout);
			
			// body
            \curl_setopt($ch, CURLOPT_POSTFIELDS, $bodydata);


			$output = \curl_exec($ch);
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			$curl_errno = curl_errno($ch);
    		$curl_error = curl_error($ch);			
			\curl_close($ch); 

			$timeend = microtime(true);


			if ($curl_errno > 0) {
				throw new \Exception("cURL Error ($curl_errno): $curl_error");
			} 

			$args = (object)[
				'url' => $url,
				'header' => $headerdata,
				'body' => $bodydata,
				'httpcode' => $httpcode,
				'output' => $output,
				'time' => date('Y-m-d H:i:s'),
				'time_elapsed' =>  $timeend - $timestart
			];
			MPCHelper::RaiseEvent(_MPCPROTOCOL_ONDATASENT_, $this->handlers, $args);

			$result = json_decode($output);
			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}


