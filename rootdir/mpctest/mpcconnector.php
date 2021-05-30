<?php namespace TransFashion\MPC;

require_once __DIR__ . '/impc.php';
require_once __DIR__ . '/mpcresponse.php';
require_once __DIR__ . '/mpcprotocol.php';
require_once __DIR__ . '/mpceventnames.php';


/**
 * MPC Connector
 * Untuk keperluan koneksi ke platform MPC CTCOrp
 * 
 * @package MPCConnector
 * @author Agung Nugroho
 **/
class MPCConnector implements iMPC {
	
	const api_reqauthpage = ['00000000000001', 'cas/auth-page/query'];
	const api_verifytoken = ['00000000000002', 'cas/profile/query'];
	const api_authorizetoken = ['00000000000003', 'cas/id-token/authorize'];
	const api_generateotp = ['00000000000004', 'common/otp/generate'];
	const api_validateotp = ['00000000000005', 'common/otp/validate'];
	const api_isphonenumberexist = ['00000000000006', 'member/existence/check'];
	const api_genuserprofile = ['00000000000007', 'member/profile/query'];
	const api_pointadd = ['00000000000008', 'point/add'];
	const api_pointgetbalance = ['00000000000009', 'point/balance/query'];
	const api_pointlisthistory = ['00000000000010', 'point/history/query'];

	private object $config;

	function __construct(object $config) {
		$defaultConfig = [
		];
		$this->config = (object) array_merge($defaultConfig, (array) $config);
	}

	private function onDataSent($args) {
		// print_r($args);
	}




	/**
     * Minta URL halaman registrasi
     * @return string url yang berupa form halaman login
     */
	public function RequestRegistrationPage() : string {
		$requestData = [
			"codeChallenge"=> MPCHelper::CreateChalangeCode(),
			"redirectPageType" => 'REGISTER'
		];

		try {
			$mp = new MPCProtocol($this->config);
			$mp->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

			$res = $mp->ApiExecute(self::api_reqauthpage, $requestData);
			$data = $res->getData();
			
			if (!property_exists($data, 'url')) {
				throw new \Exception('Exekusi API tidak mengembalikan variable url yang diinginkan');
			}
			
			$url ="{$data->url}?nonceCode={$data->nonceCode}&channelId={$this->config->ApplicationId}&equipmentId={$data->equipmentId}&channelType=1";
			return $url;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}



	/**
     * Minta URL halaman login
     * @return string url yang berupa form halaman login
     */
	public function RequestAuthenticationPage() : string {
		$requestData = [
			"codeChallenge"=> MPCHelper::CreateChalangeCode(),
			"redirectPageType" => 'LOGIN'
		];

		try {
			$mp = new MPCProtocol($this->config);
			$mp->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

			$res = $mp->ApiExecute(self::api_reqauthpage, $requestData);
			$data = $res->getData();
			
			if (!property_exists($data, 'url')) {
				throw new \Exception('Exekusi API tidak mengembalikan variable url yang diinginkan');
			}
			
			$url ="{$data->url}?nonceCode={$data->nonceCode}&channelId={$this->config->ApplicationId}&equipmentId={$data->equipmentId}&channelType=1";
			return $url;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}



	/**
	 * Verifikasi Id Token yang belaku general seluruh BU
	 * @param string $tokenid idtoken
	 * @return MPCProfile Profile user yang bersangkutan yang berhasil di verifikasi
	 */
	public function VerifyTokenId(string $tokenid, string $equipmentId, string $nonceCode) : MPCProfile {
	    $requestData = (object) [
	        "idToken" => $tokenid,
            "nonceCode" => $nonceCode,
            "codeVerifier" => MPCHelper::CreateVerifierCode(),
            "equipmentId" => $equipmentId,
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_verifytoken, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}

	/**
	 * Authorisasi Id Token yang belaku general seluruh BU
	 * @param string $tokenid idtoken
	 * @return MPCProfile Profile user yang bersangkutan yang berhasil di verifikasi
	 */	
	public function AuthorizeTokenId(string $tokenid, string $equipmentId) : MPCProfile {
	    $requestData = (object) [
	        "idToken" => $tokenid,
            "equipmentId" => $equipmentId
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_authorizetoken, $requestData);
            $data = $res->getData();

			print_r($data);

			$obj = new MPCProfile();
            return $obj;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}


	/**
	 * Menggerate OTP, mengirimkan nomor OTP ke henphone user
	 * @param string $phonenumber nomor yang akan dikirim OTP
	 * @param string $scene
	 * @return string otpSeqNo sequnce otp untuk proses validasi 
	 */
	public function GenerateOTP(string $phonenumber, string $scene) : string {
	    $requestData = (object) [
	        "phoneNo" => $phonenumber,
            "scene" => $scene,
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_generateotp, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}

	/**
	 * Melakukan validasi OTP yang diinput oleh user
	 * @param string $phonenumber nomor yang akan dikirim OTP
	 * @param string $scene	 
	 * @param string $otpSeqNo sequnce otp, didapat pada saat generate OTP
	 * @param string $otp data otp yang diinput oleh user (sesuai yang dikirimkan ke henponenya)  
	 * @return bool true apabila otp benar
	 */
	public function ValidateOTP(string $phonenumber, string $scene, $otpSeqNo, $otp) : bool {
	    $requestData = (object) [
	        "phoneNo" => $phonenumber,
            "scene" => $scene,
            "otpSeqNo" => $otpSeqNo,
            "otp" => $otp,
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_validateotp, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}



	/**
	 * Cek apakah nomor telpon terdaftar di MPC
	 * @param string $phonenumber nomor yang akan dikirim OTP
	 * @return bool true apabila otp benar
	 */
	public function isPhoneNumberExist(string $phonenumber) : bool {
	    $requestData = (object) [
	        "phoneNo" => $phonenumber,
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_isphonenumberexist, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}


	/**
	 * Mengambil informasi profile dari user berdasarkan nomor telpon yang terdaftar
	 * @param string $phonenumber nomor yang akan dikirim OTP
	 * @return MPCProfile Profile user yang bersangkutan
	 */
	public function getUserProfile(string $phonenumber) : MPCProfile {
	    $requestData = (object) [
	        "phoneNo" => $phonenumber,
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_genuserprofile, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}



	public function PointAdd(string $phonenumber, float $amount) {
	    $requestData = (object) [
	        "phoneNo" => $phonenumber,
            "amount" => $amount,
        ];

        try {
            $mpcProcotol = new MPCProtocol($this->config);
            $mpcProcotol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProcotol->ApiExecute(self::api_pointadd, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}


	public function PointGetBalance(string $phonenumber) : float {
	    $requestData = (object) [
	        "phoneNo" => $phonenumber,
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_pointgetbalance, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}
	
	
	
	public function PointListHistory() {
	    $requestData = (object) [
	        "phoneNo" => "string",
            "startTime" => "string",
            "endTime" => "string",
            "type" => "string",
            "page" => [
                "currentPage" => 0,
                "pageSize" => 0
            ]
        ];

        try {
            $mpcProtocol = new MPCProtocol($this->config);
            $mpcProtocol->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

            $res = $mpcProtocol->ApiExecute(self::api_pointlisthistory, $requestData);
            $data = $res->getData();

            return $data;
        } catch (\Exception $exception) {
            throw $exception;
        }
	}



}


