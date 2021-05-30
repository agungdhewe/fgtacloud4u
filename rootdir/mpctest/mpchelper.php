<?php namespace TransFashion\MPC;

class MPCHelper {

	static function CreateTimestamp() {
		$timestamp = round(microtime(true) * 1000);
		return (string)$timestamp;
	}

	static function CreateNonce($timestamp) {
		$nonce = (string) \floor(100000000 * ((float)rand()/(float)getrandmax()));
		return $nonce;
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
        $verifier_bytes = random_bytes(32);
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
