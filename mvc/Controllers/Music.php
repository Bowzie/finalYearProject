<?php
include_once 'Controller.php';
include_once '/../Models/MusicModel.php';

class Music extends Controller 
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
		$musicModel = new MusicModel();
		$music = $musicModel->getMusicInfo($args['id']);
		echo json_encode($music);
	}
}

$music = new Music();
$music->HandleRequest();

?>