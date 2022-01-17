<?php
	
	$inData = getRequestInfo();
	
	$username = $_POST["username"];


	$conn = new mysqli("localhost", "root", "", "eventmanager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$query = "SELECT * FROM events WHERE UserID in (SELECT UserID FROM users WHERE Username = '" . $username . "')";
		$result = mysqli_query($conn, $query);
		$rows = array();
		while ($row = mysqli_fetch_array($result))
		{
            		$rows[] = $row;
		}
		echo json_encode($rows);
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
    }
    
	
?>