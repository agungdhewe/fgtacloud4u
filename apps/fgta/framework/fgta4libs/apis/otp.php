<?php namespace FGTA4\apis;

class OTP {

	public static function Verify($db, $otp, $code) {
		try {
			// throw new \Exception('OTP yang anda masukkan tidak valid');
			$sql = "
				select * from fgt_otp
				where
				otp = :otp and code = :code 
			";

			$stmt = $db->prepare($sql);
			$stmt->execute([':otp'=> $otp , ':code'=> $code]);
			$rows  = $stmt->fetchall(\PDO::FETCH_ASSOC);
			if (count($rows)==0) {
				throw new \Exception('OTP yang anda masukkan tidak valid');
			}

			return true;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}
}