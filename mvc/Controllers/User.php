<?php
include_once 'Controller.php';
include_once '/../Models/UserModel.php';

class User extends Controller 
{
	function __construct() //Empty Constructor
	{
	}

	public function HandleRequest() {
		//TODO switch other request methods (will probably only be delete used) and do switch in controller.php instead
		switch($_SERVER['REQUEST_METHOD']) {
			case 'POST': $this->POST(json_decode(file_get_contents('php://input'), true)); 
			break;
			default: echo 'crap';
		}
	}

	//TODO create method to test request method from HTTP request and implement GET, PUT, DELETE etc.. 
	public function POST($args)
	{
		header('Content-type: application/json');
		header('X-Content-Type-Options: nosniff');
		$userModel = new UserModel();
		$userInfo = $userModel->getUserInfo($args['id']);

		echo json_encode($userInfo);
	}
}

//TODO Remove code below and have HandleRequest() called in class instead
$user = new User();
$user->HandleRequest();
?>