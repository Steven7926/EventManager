<?php
	$inData = getRequestInfo();
	
	$title = $inData["title"];
	$description = $inData["description"];
	$url = $inData["url"];
    	$userId = $inData["userId"];
    	$startdate = $inData["startDate"];
    	$enddate = $inData["endDate"];
    	$address = $inData["address"];

	$conn = new mysqli("localhost", "root", "", "eventmanager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "insert into events (UserID, Title, Description, URL, StartDate, EndDate, Address, ApprovalFlag) VALUES ( '$userId', '$title', '$description', '$url', '$startdate', '$enddate', '$address', 0)";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );

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
	
?>