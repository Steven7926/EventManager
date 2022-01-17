<?php
	$inData = getRequestInfo();
	
	$userID = $inData["UserID"];
	$url = $inData["URL"];

	$conn = new mysqli("localhost", "root", "", "eventmanager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "INSERT INTO registers VALUES (" . $userID . ", '" . $url . "')";
					
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
			echo "Record updated successfully";
		}
		$conn->close();
	}

	returnWithError("");

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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>