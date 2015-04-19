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
	private function POST($args)
	{
		switch($args['functionName'])
		{
			case 'login': $this->login($args);
			break;
			case 'checkUsername': $this->checkUsername($args);
			break;
			case 'addUser': $this->addUser($args);
			break;
		}
	}

	private function login($args)
	{
		header('Content-type: application/json');
		header('X-Content-Type-Options: nosniff');

		$userModel = new UserModel();
		$login = $userModel->checkLogin($args);

		if($login === true)
		{
			$result = $userModel->getUserInfo($args['username']);
			$result['result'] = true;
			echo json_encode($result);
		}	
		else
		{
			$result['result'] = false;
			echo json_encode($result);
		}		
	}

	private function checkUsername($args)
	{
		header('Content-type: application/json');
		header('X-Content-Type-Options: nosniff');

		$userModel = new UserModel();
		$username = $userModel->checkUsername($args['username']);

		if($username === null)
		{
			$result['result'] = false;
			echo json_encode($result);
		}
		else
		{
			$result['result'] = true;
			echo json_encode($result);
		}
	}

	private function addUser($args)
	{
		$salt = mcrypt_create_iv(22, MCRYPT_DEV_URANDOM);
		$options = [
			'cost' => 10,
		    'salt' => $salt
		];

		$hash = password_hash($args['password'], PASSWORD_BCRYPT, $options);
		$args['password'] = $hash;

		$userModel = new UserModel();
		$newUser = $userModel->addUser($args);

		if($newUser === true)
		{
			$newDir = '../../music/'.$args['username'];
			//catch error
			mkdir($newDir, 0777, false);
			// $files1 = scandir('../../music');
			// var_dump($files1);
		}
		$result['result'] = $newUser;
		
		echo json_encode($result);
	}

	private function removeUser($args)
	{
		//remove all user's music first
		//remove entry from user table 
		//rmdir their folder on
	}
}

$user = new User();
$user->HandleRequest();

?>