<?php namespace TransFashion\MPC;

class MPCHelper {

	static function CreateNonce($timestamp) {
		$_iter = 10;
		$_hash = 'sha256';
		$_secret = 'maraigendheng';
		$_uid = self::GenerateUid();
		$hash = hash($_hash, $timestamp . $_secret . $_uid);
		$i = 0;
		do{
			$hash = hash($_hash, $hash);
			$i++;
		} while ($i < $_iter);
			return $hash;
	}

	static function GenerateUid() {
		$length = 32;
		if(extension_loaded('openssl')){
			$seed = bin2hex(openssl_random_pseudo_bytes($length));
			return base64_encode($seed);
		}
		for ($i = 0; $i < $length; $i++) {
			$seed .= chr(mt_rand(0, 255));
		}
		return base64_encode($seed);
	}


	static function GenerateTransactionNo($apiCode) {
		return date('ymd') . $apiCode . substr(uniqid(), -12);
	}

	static function AddEventHandler(&$handlers, $eventname, callable $fn_handler) {
		if (!is_callable($fn_handler)) {
			throw new \Exception("Handler is invalid for '$eventname'");
		}

		if (!array_key_exists($eventname, $handlers)) {
			$handlers[$eventname] = [];
		}

		$handlers[$eventname][] = $fn_handler;
	}	

	static function RaiseEvent($eventname, &$handlers, &$args) {
		if (array_key_exists($eventname, $handlers)) {
			foreach ($handlers[$eventname] as $fn_handler) {
				$fn_handler($args);
			}
		}
	}


	static function CreateVerifierCode() {
		$verifier_bytes = random_bytes(64);
		$code_verifier = rtrim(strtr(base64_encode($verifier_bytes), "+/", "-_"), "=");
		return $code_verifier;
	}

	static function CreateChalangeCode() {
		$code_verifier = self::CreateVerifierCode();
		$challenge_bytes = hash("sha256", $code_verifier, true);
		$code_challenge = rtrim(strtr(base64_encode($challenge_bytes), "+/", "-_"), "=");
		return $code_challenge;
	}	

	
}
