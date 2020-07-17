<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class WebAuth {


	const SESSION_LIFETIME = 10*60; // menit

	public function __construct() {
	}

	public function SessionCheck() {
		$currentCookieParams = session_get_cookie_params(); 
		session_set_cookie_params(
			$currentCookieParams["lifetime"], 
			'/;SameSite=Strict'
		);


		$tokenid = '';
		if (array_key_exists('tokenid', $_COOKIE)) {
			$tokenid = $_COOKIE['tokenid'];
		} else if (array_key_exists('HTTP_TOKENID', $_SERVER)) {
			$tokenid = $_SERVER['HTTP_TOKENID'];
		}

		if ($tokenid!='') {
			session_id($tokenid);
			session_start(["name" => 'tokenid']);
			$this->session_autologout(self::SESSION_LIFETIME);
		}
	}

	public function session_autologout($expireAfter) {
		global $_SESSION;

		if(isset($_SESSION['last_action'])){
			$secondsInactive = time() - $_SESSION['last_action'];
			$expireAfterSeconds = $expireAfter * 60;
			if($secondsInactive >= $expireAfterSeconds){
				session_unset();
				session_destroy();
			}
		}
		$_SESSION['last_action'] = time();
	}


	public function get_tokenid() {
		return session_id();
	}

	public function is_login() {
		global $_SESSION;
		if (!isset($_SESSION)) {
			return false;
		}

		if (!array_key_exists('islogin', $_SESSION)) {
			return false;
		}

		return ($_SESSION['islogin']==1);
	}

	public function get_groups() {
		return ['public'];
	}

	public function session_user_start($userdata) {
		global $_SESSION;
		$_SESSION['islogin']=1;
		$_SESSION['userdata'] =  json_encode($userdata);
	}

	public function session_get_user() {
		global $_SESSION;

		if (is_array($_SESSION)) {
			if (array_key_exists('userdata', $_SESSION)) {
				return json_decode($_SESSION['userdata']);
			}
		}
		return json_decode("{}");
	}

	public function session_user_logout() {
		global $_SESSION;
		unset($_SESSION['islogin']);
		unset($_SESSION['userdata']);
		session_destroy();
	}

	public function session_get_user_jsondata() {
		global $_SESSION;

		if (!isset($_SESSION)) {
			return '';
		}	
		
		if (!array_key_exists('userdata', $_SESSION)) {
			return '';
		}
		
		return $_SESSION['userdata'];
	}
}
