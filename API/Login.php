<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$userType = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "root", "", "eventmanager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$passhash = md5($inData["password"], FALSE);
		$sql = "SELECT UserID, FirstName, LastName, AccessLevel FROM users where Username='" . $inData["login"] . "' and Password='" . $passhash . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			$id = $row["UserID"];
			$userType = $row["AccessLevel"];
			
			returnWithInfo($firstName, $lastName, $id, $userType);
		}
		else
		{
			returnWithError( "No Records Found" );
		}
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
	
	function returnWithInfo( $firstName, $lastName, $id, $userType )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","userType":'. $userType .',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>