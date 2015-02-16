<?php
include_once 'Controller.php';
include_once '/../Models/UserModel.php';

class User extends Controller 
{
	function __construct() //Empty Constructor
	{

	}

	//TODO create method to test request method from HTTP request and implement GET, PUT, DELETE etc.. 
	public function GET($args)
	{
		$userModel = new UserModel();
		$userInfo = $userModel->getUserInfo($args[0]);

        foreach($userInfo as $d => $val) {
        	echo $d . ' : ' . $val .  "<br>";
        }
	}
}
?>