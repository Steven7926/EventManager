<?php
	
	$inData = getRequestInfo();
	
	$userID = $_POST["userID"];


	$conn = new mysqli("localhost", "root", "", "eventmanager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$query = "SELECT * FROM events WHERE UserID = " . $userID;
		$result = mysqli_query($conn, $query);
		$rows = array();
		while ($row = mysqli_fetch_array($result))
		{
            		$startmonth = intval(substr($row[4], 0, 2));
			$startday = intval(substr($row[4], 3, 2));
			$startyear = intval(substr($row[4], 6, 4));
			$endmonth = intval(substr($row[5], 0, 2));
			$endday = intval(substr($row[5], 3, 2));
			$endyear = intval(substr($row[5], 6, 4));
			
			if (($startyear - $endyear) <= 0) 
			{
				if (($startmonth - $endmonth) <= 0)
				{
					if (($startday - $endday) <= 0)
					{
						if ((idate("Y") <= $endyear) && (idate("m") <= $endmonth) && (idate("d") <= $endday))
						{
							if ((idate("Y") >= $startyear) && (idate("m") >= $startmonth) && (idate("d") >= $startday))
							{
								$rows[] = $row;
							}
						}
					}
				}
			} 

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