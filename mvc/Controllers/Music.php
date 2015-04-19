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
				$this->POST(); 
			break;
		}
	}

	public function POST()
	{
		$args =  json_decode(file_get_contents('php://input'), true);
		if(isset($args))
		{	
			
			switch($args['functionName'])
			{
				case 'getTrackList': $this->getTrackList($args);
				break;
				case 'getTrackPath': $this->getTrackPath($args);
				break;
				case 'addTrack': $this->addTrack($args);
				break;
				case 'addDbEntry': $this->addDbEntry($args);
				break;
				case 'deleteTrack': $this->deleteTrack($args);
				break;
				case 'deleteDbEntry': $this->deleteDbEntry($args);
				break;
			}
		}
		else if(isset($_FILES))
		{
			$this->addTrack();
		}
		else {
			$result['result'] = false;
			$result['error'] = 'Error';
			echo json_encode($result);
		}
		

	}

	private function getTrackList($args)
	{
		$musicModel = new MusicModel();
		$music = $musicModel->getTrackList($args['_userId']);
		echo json_encode($music);		
	}

	private function getTrackPath($args) //args id username trackname
	{
		$musicModel = new MusicModel();
		$trackPath = $musicModel->getTrackPath($args);
		$title =  $trackPath[0]['path'];

		$trackPath = '/../finalYearProject/music/' . $args['username'] . '/' . $title;
		$result['result'] = true;
		$result['trackPath'] = $trackPath;

		echo json_encode($result);
	}

	private function addTrack() //file
	{
		// print_r($_FILES);

		//add file to path 
		$uploadDir = '../../music/' . $_FILES['file']['name'][1] . '/';
		$tmp_name =  $_FILES['file']['tmp_name'][0];
		$filename = $_FILES['file']['name'][0];
		$uploadPath = $uploadDir . $filename;
		if(move_uploaded_file($tmp_name, $uploadPath))
		{
			$result['result'] = true;
			// $result['filename'] = $filename;
		}
		else {
			$result['result'] = false;	
			$result['error'] = 'Error uploading file';
		}

		echo json_encode($result);
	}

	private function deleteTrack($args) //args trackname username
	{
		//delete file
		$uploadDir = '../../music/' . $args['username'] . '/';
		$deleted = unlink($uploadDir . $args['path']);

		$result['result'] = $deleted;
		echo json_encode($result);
	}

	private function addDbEntry($args) //_userId title path
	{
		//add entry to db;
		$musicModel = new MusicModel();
		$music = $musicModel->addTrackEntryToDb($args);

		if($music === true)
		{
			$result['result'] = true;
		}
		else {
			$result['result'] = false;
		}
		echo json_encode($result);
	}

	private function deleteDbEntry($args) //_userId title
	{		
		$musicModel = new MusicModel();
		$music = $musicModel->deleteTrackEntryFromDb($args);

		if($music === true)
		{
			$result['result'] = true;
		}
		else {
			$result['result'] = false;
		}

		echo json_encode($result);
	}
}

$music = new Music();
$music->HandleRequest();

?>