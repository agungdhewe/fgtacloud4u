<?php namespace TransFashion\MPC;

require_once __DIR__ . '/mpcprofile.php';

/**
 * MPC Interface
 * Untuk keperluan koneksi ke platform MPC CTCOrp
 * 
 * @package MPCConnector
 * @link https://gitlab.com/agung12/mpcconnect
 * @author Agung Nugroho
 **/

interface iMPC {

	public function RequestRegistrationPage() : string;
	public function RequestAuthenticationPage() : string;
	public function VerifyTokenId(string $tokenid, string $equipmentId, string $nonceCode) : MPCProfile;
	public function AuthorizeTokenId(string $tokenid, string $equipmentId) : MPCProfile;


	public function GenerateOTP(string $phonenumber, string $scene) : string;
	public function ValidateOTP(string $phonenumber, string $scene, $otpSeqNo, $otp) : bool;


	public function isPhoneNumberExist(string $phonenumber) : bool;
	public function getUserProfile(string $phonenumber) : MPCProfile;



	public function PointAdd(string $phonenumber, float $amount);
	public function PointGetBalance(string $phonenumber) : float;
	public function PointListHistory();


	/*
	public function CouponAcquire(string $phonenumber, string $couponid) : bool;
	public function CouponCalculateAvailable();
	public function CouponGetInstance();
	public function CouponListAquirable();
	public function CouponListAll();
	public function CouponRedeem();
	public function CouponReverseRedeemed();

	public function WalletCreateOrder();
	public function WalletGetBalance();
	*/

}
