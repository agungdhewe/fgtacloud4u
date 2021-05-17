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
 * @link https://gitlab.com/agung12/mpcconnect
 * @author Abdul Syakur
 * @author Agung Nugroho
 **/
class MPCConnector implements iMPC {
	
	const api_reqauthpage = ['00000000000001', 'cas/auth-page/query'];
	const api_verifytoken = ['00000000000002', 'cas/profile/query'];
	const api_authorizetoken = ['00000000000003', 'cas/id-token/authorize'];



	private object $config;

	function __construct(object $config) {
		$defaultConfig = [
		];
		$this->config = (object) array_merge($defaultConfig, (array) $config);
	}

	private function onDataSent($args) {
		print_r($args);
	}








	/**
     * Minta URL halaman login
     * @return string url yang berupa form halaman login
     */
	public function RequestAuthenticationPage() : string {
		$requestData = (object)[
			"codeChallenge"=> $this->CreateChalangeCode(),
			"osType" => "",
			"idfa" => "",
			"imei"=> "",
		];

		try {
			$mp = new MPCProtocol($this->config);
			$mp->AddEventHandler(_MPCPROTOCOL_ONDATASENT_, function ($args) { $this->onDataSent($args); });

			$res = $mp->ApiExecute(self::api_reqauthpage, $requestData);
			$data = $res->getData();
			if (!property_exists($data, 'url')) {
				throw new \Exception('Exekusi API tidak mengembalikan variable url yang diinginkan');
			}

			return $data->url;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}



	/**
	 * Verifikasi Id Token yang belaku general seluruh BU
	 * @param string $tokenid idtoken
	 * @return MPCProfile Profile user yang bersangkutan yang berhasil di verifikasi
	 */
	public function VerifyTokenId(string $tokenid) : MPCProfile {

	}

	/**
	 * Authorisasi Id Token yang belaku general seluruh BU
	 * @param string $tokenid idtoken
	 * @return MPCProfile Profile user yang bersangkutan yang berhasil di verifikasi
	 */	
	public function AuthorizeTokenId(string $tokenid) : MPCProfile {

	}


	/**
	 * Menggerate OTP, mengirimkan nomor OTP ke henphone user
	 * @param string $phonenumber nomor yang akan dikirim OTP
	 * @param string $scene
	 * @return string otpSeqNo sequnce otp untuk proses validasi 
	 */
	public function GenerateOTP(string $phonenumber, string $scene) : string {

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

	}



	/**
	 * Cek apakah nomor telpon terdaftar di MPC
	 * @param string $phonenumber nomor yang akan dikirim OTP
	 * @return bool true apabila otp benar
	 */
	public function isPhoneNumberExist(string $phonenumber) : bool {

	}


	/**
	 * Mengambil informasi profile dari user berdasarkan nomor telpon yang terdaftar
	 * @param string $phonenumber nomor yang akan dikirim OTP
	 * @return MPCProfile Profile user yang bersangkutan
	 */
	public function getUserProfile(string $phonenumber) : MPCProfile {



	}



	public function PointAdd(string $phonenumber, float $amount) {

	}


	public function PointGetBalance(string $phonenumber) : float {

	}
	
	
	
	public function PointListHistory() {

	}



}


