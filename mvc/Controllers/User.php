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
			case 'POST': 
				$this->POST( json_decode(file_get_contents('php://input'), true)); 
			break;
		}
	}

	//TODO create method to test request method from HTTP request and implement GET, PUT, DELETE etc.. 
	public function POST($args)
	{
		if($args['functionName'] === 'login')
		{
			header('Content-type: application/json');
			header('X-Content-Type-Options: nosniff');

			$userModel = new UserModel();
			$login = $userModel->checkLogin($args);

			if($login === 'Successful')
			{
				$result = $userModel->getUserInfo($args['username']);
				var_dump($result);
				echo json_encode($result);
			}	
			else
			{
				$result['Result'] = 'Failure';
				echo json_encode($result);
			}
		}
	}
}

$user = new User();
$user->HandleRequest();

?>