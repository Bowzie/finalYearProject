<?php
include_once 'Controller.php';
include_once '/../Models/UserModel.php';

header('Content-type: application/json');
header('X-Content-Type-Options: nosniff');
if(isset($_POST)) {
	$blah = array('value' => file_get_contents('php://input'));	
}
else {
	$blah = array('value' => 'Feck');	
}

echo json_encode($blah);

class User extends Controller 
{
	function __construct() //Empty Constructor
	{

	}

	public function HandleRequest() {
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