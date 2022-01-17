var urlBase = '/API';
var extension = 'php';

var username = "";
var userId = 0;
var firstName = "";
var lastName = "";
var userType = 0;

// Global Variables for Actions delete and edit
var title = "";
var description = "";
var urltable = "";
var startd = "";
var endd = "";
var address = "";

function doLogin(emptyuserpass, emptyuser, emptypass, errorUser) // This function gets the users login and password, sends it to PHP through a JSON package,
{																// then allows the user access if their creds exist in the DB
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		if( userId < 1 )
		{
			checkError(emptyuserpass, emptyuser, emptypass, errorUser);
			document.getElementById("loginButton").insertAdjacentHTML("afterend", 
                "<p style = 'color: red;' id = 'errorUser'> Username or password is incorrect. </p>"
                                                                      );
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;
		userType = jsonObject.userType;
		console.log(userType);
		saveCookie();
		if (userType == 0)
			window.location.href = "participant.html";
		else if (userType == 1)
			window.location.href = "superadmin.html";
	}
	catch(err)
	{
		document.getElementById("loginButton").innerHTML = err.message;
	}

}

function welcomeUser() // This function is called in the onload tag of the mainPage.html, it welcomes the user on a name basis
{
	readCookie();
	var usersLevel ="";
	console.log(userType)
	if (userType == 0)
		usersLevel = "Participant";
	if (userType == 1)
		usersLevel = "Admin";
	if (userType == 2) 
		usersLevel = "Superadmin";
	document.getElementById("userwelcome").insertAdjacentHTML("afterbegin", 
	"<p class = 'descriptions' id = 'welcome'> Welcome, " + firstName + "!</p><!--<span class = 'userLevel'>(You are a " + usersLevel + ".)<span>-->"
														  );
	getTable();
}

function userEmpty()	// This function ensures the user cannot attempt to login with blank credentials. 
{
	var user = document.getElementById("loginName").value;
	var pass = document.getElementById("loginPassword").value;
	var emptyuserpass = document.getElementById("empty");
	var emptyuser = document.getElementById("emptyusername");
	var emptypass = document.getElementById("emptypassword");
	var errorUser = document.getElementById("errorUser");

	if (user == "" && pass == "")
	{
		checkError(emptyuserpass, emptyuser, emptypass, errorUser);

		document.getElementById("loginButton").insertAdjacentHTML("afterend", 
		"<p style = 'color: red;' id = 'empty'> Please enter a username and password.</p>"
															  );
	}
	else if (user != "" && pass == ""){

		checkError(emptyuserpass, emptyuser, emptypass, errorUser);

		document.getElementById("loginButton").insertAdjacentHTML("afterend", 
		"<p style = 'color: red;' id = 'emptypassword'> Please enter a password.</p>"
															  );
	}
	else if (user == "" && pass != ""){

		checkError(emptyuserpass, emptyuser, emptypass, errorUser);

		document.getElementById("loginButton").insertAdjacentHTML("afterend", 
		"<p style = 'color: red;' id = 'emptyusername'> Please enter a username.</p>"
															  );
	}
	else 
	{
		doLogin(emptyuserpass, emptyuser, emptypass, errorUser);
	}
}
function checkError(emptyuserpass, emptyuser, emptypass, errorUser)	// Simply removes the previous "user/pass incorrect" message if it exists if the html
{
	if (document.contains(emptyuserpass))
		emptyuserpass.remove();

	else if (document.contains(emptyuser))
		emptyuser.remove();

	else if (document.contains(emptypass))
		emptypass.remove();

	else if (document.contains(errorUser))
		errorUser.remove();
}


function saveCookie()	// Saves a cookie consisting of the current users info
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userType" + userType + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() // Reads the current users info and saves it in the proper variable
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userType" )
		{
			userType = parseInt( tokens[1].trim() );
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
}

function doLogout()
{
	var now = new Date();
	var time = now.getTime();
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "login.html";
}

function addUser()	// Sends a JSON package with the user information to be added, then the PHP contacts the DB and adds the user
{
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var login = document.getElementById("login").value;
	var password = document.getElementById("password").value;
	document.getElementById("userAddResult").innerHTML = "";

	if (firstname.length == 0 || lastname.length == 0 || login.length == 0 || password.length == 0) // This entire if block ensures all info is filled out
	{
		var firststar = document.getElementById("firststar");
		var laststar = document.getElementById("laststar");
		var loginstar = document.getElementById("loginstar");
		var passstar = document.getElementById("passstar");
		if (firstname == "")
		{
			if (document.contains(firststar))
				firststar.remove();

			document.getElementById("firstname").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'firststar'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(firststar))
				firststar.remove();
		}
		if (lastname == "")
		{
			if (document.contains(laststar))
				laststar.remove();

			document.getElementById("lastname").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'laststar'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(laststar))
				laststar.remove();
		}
		if (login == "")
		{
			if (document.contains(loginstar))
				loginstar.remove();

			document.getElementById("login").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'loginstar'> *required</r>"
															  );	
		}
		else
		{
			if (document.contains(loginstar))
				loginstar.remove();
		}
		if (password == "")
		{
			if (document.contains(passstar))
				passstar.remove();

			document.getElementById("password").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'passstar'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(passstar))
				passstar.remove();
		}
		
	}
	else	// Form the JSON payload and send it for the PHP to grab
	{
		var jsonPayload = '{"firstname" : "' + firstname + '", "lastname" : "' + lastname + '", "login" : "' + login + '", "password" : "' + password + '"}';
		var url = urlBase + '/AddUser.' + extension;
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) // On successfully adding the user to DB close modal
				{
					modal.style.display = "none"
					document.getElementById("loginframe").insertAdjacentHTML("afterend", 
					"<div class = 'successuser'> <br> <p class = 'success'> Account Added Successfully! </p></div>"
																		);
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("userAddResult").innerHTML = err.message;
		}
		
	}
	
}


function addEvent() // Pretty similar to add user
{
	var titleadd = document.getElementById("titleadd").value;
	var descriptionadd = document.getElementById("descriptionadd").value;
	var urladd = document.getElementById("urladd").value;
	var startadd = document.getElementById("startadd").value;
	var endadd = document.getElementById("endadd").value;
	var starttimeadd = document.getElementById("starttimeadd").value;
	var endtimeadd = document.getElementById("endtimeadd").value;
	var addressadd = document.getElementById("addressadd").value;
	document.getElementById("contactAddResult").innerHTML = "";
	console.log(urladd);
	readCookie();

	if (titleadd.length == 0 || descriptionadd.length == 0 || urladd.length == 0 || startadd.length == 0 || endadd.length == 0 || addressadd.length == 0) // Ensures all the info is filled out
	{
		var titreq = document.getElementById("titreq");
		var descreq = document.getElementById("descreq");
		var urlreq = document.getElementById("urlreq");
		var startreq = document.getElementById("startreq");
		var endreq = document.getElementById("endreq");
		var addressreq = document.getElementById("addressreq");

		if (titleadd == "")
		{
			if (document.contains(titreq))
			titreq.remove();

			document.getElementById("titleadd").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'titreq'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(titreq))
				titreq.remove();
		}
		if (descriptionadd == "")
		{
			if (document.contains(descreq))
			descreq.remove();

			document.getElementById("descriptionadd").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'descreq'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(descreq))
				descreq.remove();
		}
		if (urladd == "")
		{
			if (document.contains(urlreq))
			urlreq.remove();

			document.getElementById("urladd").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'urlreq'> *required</r>"
															  );	
		}
		else
		{
			if (document.contains(urlreq))
				urlreq.remove();
		}
		if (startadd == "")
		{
			if (document.contains(startreq))
			startreq.remove();

			document.getElementById("startadd").style.borderColor = "red";
		}
		else
		{
			if (document.contains(startreq))
				startreq.remove();
		}
		if (endadd == "")
		{
			if (document.contains(endreq))
				endreq.remove();

			document.getElementById("endadd").style.borderColor = "red";
		}
		else
		{
			if (document.contains(endreq))
				endreq.remove();
		}
		if (addressadd == "")
		{
			if (document.contains(addressreq))
				addressreq.remove();

			document.getElementById("addressadd").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'addressreq'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(addressreq))
				addressreq.remove();
		}
		
	}

	else	// Form the JSON payload and send it for the PHP to grab
	{
		var wholestartdate = startadd + ' ' + starttimeadd;
		var wholeenddate = endadd + ' ' + endtimeadd;

		var jsonPayload = '{"title" : "' + titleadd + '", "description" : "' + descriptionadd + '", "url" : "' + urladd + '", "startDate" : "' + wholestartdate +  '", "endDate" : "' + wholeenddate + '", "address" : "' + addressadd +'", "userId" : "' + userId + '"}';
		var url = urlBase + '/AddEvent.' + extension;


		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()  // On success close the modal
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					modal.style.display = "none"
					location.reload();
				}
			};
			xhr.send(jsonPayload);

			alert("Event Added Successfully. Your event is now pending approval.");
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = err.message;
		}
	}
	
}

function getTable()
{
	console.log(userId)

	// jQuery starts
	var table = $('#contactTable').DataTable({
		"searching": true,
		"lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"pageLength": 15,
		//"processing": true,
		//"serverSide": true,
		"ajax": {
			url: "/API/GetEvents.php",
			type: "POST",
			dataSrc: "",
			data: {
			},
		},
		columns: [
			{data: "Title"},
			{data: "Description"},
			{"data": "URL",
			 "render" : function(data, type, row, meta){
					if(type === 'display')
						data = '<a target = "_blank" href="' + data + '">' + data + '</a>';
					return data;
				}
			},
			{data: "StartDate"},
			{data: "EndDate"},
			{data: "Address"},
			{
				"className": '',
				"data": null,
				"render": function(data, type, full, meta)
				{
					if (userId == data[0])
					   	return '<button  id = "deletebutton" class="deletebtn">Delete</button>';
					else
						return '<button id = "attendbutton" class="editbtn">Register</button>';
				}
			},
		]
	});

	
	$("#contactTable_paginate").addClass('tableinfo'); // Pages
	$("#contactTable_filter").addClass('tableinfo'); // Search
	$("#contactTable_length").addClass('tableinfo'); // Show x Entries
	$("#contactTable_info").addClass('tableinfo'); // Showing entry numbers
	$("#contactTable_wrapper").addClass('data');
	$("#contactTable").css("border",  "4px solid grey");

	$("#contactTable_filter").addClass('searchtable');
	$("#contactTable_length").addClass('showentriestable');
	$("#contactTable_info").addClass('showentriestable');
	

	$('#contactTable tbody').on('click', '#deletebutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		deleteEvent();
	});

	$('#contactTable tbody').on('click', '#editbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[5];
		startd = data[6];
		endd = data[7];
		address = data[8];
		editEvent();
	});

	$('#contactTable tbody').on('click', '#attendbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		register();
	});
	// jQuery ends

	document.getElementById("contactTable_filter").innerHTML.replace()

}

function register()
{
	var jsonPayload = '{"UserID" : ' + userId + ', "URL" : "' + urltable + '"}';
	var url = urlBase + '/Register.' + extension;
	console.log(jsonPayload);
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) // On successfully adding the user to DB close modal
				{
					location.reload();
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			console.log("error event not deleted.");
		}
}

function goRegistered()
{
	localStorage.setItem('UserID', userId);
	window.location.href = "registered.html";
}

function goCreated()
{
	localStorage.setItem('UserID', userId);
	window.location.href = "created.html";
}

function goActive()
{
	localStorage.setItem('UserID', userId);
	window.location.href = "active.html";
}

function getRegistered()
{
	var UserID = localStorage.getItem('UserID');
	//console.log(UserID);

	// jQuery starts
	var table = $('#contactTable').DataTable({
		"searching": true,
		"lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"pageLength": 15,
		//"processing": true,
		//"serverSide": true,
		"ajax": {
			url: "/API/GetRegisteredEvents.php",
			type: "POST",
			dataSrc: "",
			data: {"userID": UserID},
		},
		columns: [
			{data: "Title"},
			{data: "Description"},
			{"data": "URL",
			 "render" : function(data, type, row, meta){
					if(type === 'display')
						data = '<a target = "_blank" href="' + data + '">' + data + '</a>';
					return data;
				}
			},
			{data: "StartDate"},
			{data: "EndDate"},
			{data: "Address"},
			{
				"className": '',
				"data": null,
				"render": function(data, type, full, meta)
				{
					
					 return '<button  id = "regdbutton" class="regbtn">REGISTERED</button>';
				}
			},
		]
	});

	
	$("#contactTable_paginate").addClass('tableinfo'); // Pages
	$("#contactTable_filter").addClass('tableinfo'); // Search
	$("#contactTable_length").addClass('tableinfo'); // Show x Entries
	$("#contactTable_info").addClass('tableinfo'); // Showing entry numbers
	$("#contactTable_wrapper").addClass('data');
	$("#contactTable").css("border",  "4px solid grey");

	$("#contactTable_filter").addClass('searchtable');
	$("#contactTable_length").addClass('showentriestable');
	$("#contactTable_info").addClass('showentriestable');
	

	$('#contactTable tbody').on('click', '#deletebutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		deleteEvent();
	});

	$('#contactTable tbody').on('click', '#editbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[5];
		startd = data[6];
		endd = data[7];
		address = data[8];
		editEvent();
	});

	$('#contactTable tbody').on('click', '#attendbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		register();
	});
	// jQuery ends

	document.getElementById("contactTable_filter").innerHTML.replace()
}

function getSuperRegistered()
{
	var UserName = localStorage.getItem('username');

	// jQuery starts
	var table = $('#contactTable').DataTable({
		"searching": true,
		"lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"pageLength": 15,
		//"processing": true,
		//"serverSide": true,
		"ajax": {
			url: "/API/SuperRegisteredEvents.php",
			type: "POST",
			dataSrc: "",
			data: {"username": UserName},
		},
		columns: [
			{data: "Title"},
			{data: "Description"},
			{"data": "URL",
			 "render" : function(data, type, row, meta){
					if(type === 'display')
						data = '<a target = "_blank" href="' + data + '">' + data + '</a>';
					return data;
				}
			},
			{data: "StartDate"},
			{data: "EndDate"},
			{data: "Address"},
			{
				"className": '',
				"data": null,
				"render": function(data, type, full, meta)
				{
					
					 return '<button  id = "regdbutton" class="regbtn">REGISTERED</button>';
				}
			},
		]
	});

	
	$("#contactTable_paginate").addClass('tableinfo'); // Pages
	$("#contactTable_filter").addClass('tableinfo'); // Search
	$("#contactTable_length").addClass('tableinfo'); // Show x Entries
	$("#contactTable_info").addClass('tableinfo'); // Showing entry numbers
	$("#contactTable_wrapper").addClass('data');
	$("#contactTable").css("border",  "4px solid grey");

	$("#contactTable_filter").addClass('searchtable');
	$("#contactTable_length").addClass('showentriestable');
	$("#contactTable_info").addClass('showentriestable');
	

	$('#contactTable tbody').on('click', '#deletebutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		deleteEvent();
	});

	$('#contactTable tbody').on('click', '#editbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[5];
		startd = data[6];
		endd = data[7];
		address = data[8];
		editEvent();
	});

	$('#contactTable tbody').on('click', '#attendbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		register();
	});
	// jQuery ends

	document.getElementById("contactTable_filter").innerHTML.replace()
}

function getSuperCreated()
{
	var UserName = localStorage.getItem('username');

	// jQuery starts
	var table = $('#contactTable').DataTable({
		"searching": true,
		"lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"pageLength": 15,
		//"processing": true,
		//"serverSide": true,
		"ajax": {
			url: "/API/SuperCreatedEvents.php",
			type: "POST",
			dataSrc: "",
			data: {"username": UserName},
		},
		columns: [
			{data: "Title"},
			{data: "Description"},
			{"data": "URL",
			 "render" : function(data, type, row, meta){
					if(type === 'display')
						data = '<a target = "_blank" href="' + data + '">' + data + '</a>';
					return data;
				}
			},
			{data: "StartDate"},
			{data: "EndDate"},
			{data: "Address"},
			{
				"className": '',
				"data": null,
				"render": function(data, type, full, meta)
				{
					
					 return '<button  id = "regdbutton" class="regbtn">CREATED</button>';
				}
			},
		]
	});

	
	$("#contactTable_paginate").addClass('tableinfo'); // Pages
	$("#contactTable_filter").addClass('tableinfo'); // Search
	$("#contactTable_length").addClass('tableinfo'); // Show x Entries
	$("#contactTable_info").addClass('tableinfo'); // Showing entry numbers
	$("#contactTable_wrapper").addClass('data');
	$("#contactTable").css("border",  "4px solid grey");

	$("#contactTable_filter").addClass('searchtable');
	$("#contactTable_length").addClass('showentriestable');
	$("#contactTable_info").addClass('showentriestable');
	

	$('#contactTable tbody').on('click', '#deletebutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		deleteEvent();
	});

	$('#contactTable tbody').on('click', '#editbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[5];
		startd = data[6];
		endd = data[7];
		address = data[8];
		editEvent();
	});

	$('#contactTable tbody').on('click', '#attendbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		register();
	});
	// jQuery ends

	document.getElementById("contactTable_filter").innerHTML.replace()
}

function goHome()
{
	window.location.href = "participant.html";
}

function goBack()
{
	window.location.href = "superadmin.html";
}

function getCreated()
{
	var UserID = localStorage.getItem('UserID');
	//console.log(UserID);

	// jQuery starts
	var table = $('#contactTable').DataTable({
		"searching": true,
		"lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"pageLength": 15,
		//"processing": true,
		//"serverSide": true,
		"ajax": {
			url: "/API/GetCreatedEvents.php",
			type: "POST",
			dataSrc: "",
			data: {"userID": UserID},
		},
		columns: [
			{data: "Title"},
			{data: "Description"},
			{"data": "URL",
			 "render" : function(data, type, row, meta){
					if(type === 'display')
						data = '<a target = "_blank" href="' + data + '">' + data + '</a>';
					return data;
				}
			},
			{data: "StartDate"},
			{data: "EndDate"},
			{data: "Address"},
			{
				"className": '',
				"data": null,
				"render": function(data, type, full, meta)
				{
					
					 return '<button  id = "regdbutton" class="regbtn">CREATED</button>';
				}
			},
		]
	});

	
	$("#contactTable_paginate").addClass('tableinfo'); // Pages
	$("#contactTable_filter").addClass('tableinfo'); // Search
	$("#contactTable_length").addClass('tableinfo'); // Show x Entries
	$("#contactTable_info").addClass('tableinfo'); // Showing entry numbers
	$("#contactTable_wrapper").addClass('data');
	$("#contactTable").css("border",  "4px solid grey");

	$("#contactTable_filter").addClass('searchtable');
	$("#contactTable_length").addClass('showentriestable');
	$("#contactTable_info").addClass('showentriestable');
	

	$('#contactTable tbody').on('click', '#deletebutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		deleteEvent();
	});

	$('#contactTable tbody').on('click', '#editbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[5];
		startd = data[6];
		endd = data[7];
		address = data[8];
		editEvent();
	});

	$('#contactTable tbody').on('click', '#attendbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		register();
	});
	// jQuery ends

	document.getElementById("contactTable_filter").innerHTML.replace()
}

function getActive()
{
	var UserID = localStorage.getItem('UserID');
	//console.log(UserID);

	// jQuery starts
	var table = $('#contactTable').DataTable({
		"searching": true,
		"lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"pageLength": 15,
		//"processing": true,
		//"serverSide": true,
		"ajax": {
			url: "/API/GetActiveEvents.php",
			type: "POST",
			dataSrc: "",
			data: {"userID": UserID},
		},
		columns: [
			{data: "Title"},
			{data: "Description"},
			{"data": "URL",
			 "render" : function(data, type, row, meta){
					if(type === 'display')
						data = '<a target = "_blank" href="' + data + '">' + data + '</a>';
					return data;
				}
			},
			{data: "StartDate"},
			{data: "EndDate"},
			{data: "Address"},
			{
				"className": '',
				"data": null,
				"render": function(data, type, full, meta)
				{
					
					 return '<button  id = "regdbutton" class="regbtn">ACTIVE</button>';
				}
			},
		]
	});

	
	$("#contactTable_paginate").addClass('tableinfo'); // Pages
	$("#contactTable_filter").addClass('tableinfo'); // Search
	$("#contactTable_length").addClass('tableinfo'); // Show x Entries
	$("#contactTable_info").addClass('tableinfo'); // Showing entry numbers
	$("#contactTable_wrapper").addClass('data');
	$("#contactTable").css("border",  "4px solid grey");

	$("#contactTable_filter").addClass('searchtable');
	$("#contactTable_length").addClass('showentriestable');
	$("#contactTable_info").addClass('showentriestable');
	

	$('#contactTable tbody').on('click', '#deletebutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		deleteEvent();
	});

	$('#contactTable tbody').on('click', '#editbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[5];
		startd = data[6];
		endd = data[7];
		address = data[8];
		editEvent();
	});

	$('#contactTable tbody').on('click', '#attendbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		register();
	});
	// jQuery ends

	document.getElementById("contactTable_filter").innerHTML.replace()
}

function getUsers()
{
	// jQuery starts
	var table = $('#contactTable').DataTable({
		"searching": true,
		"lengthMenu": [[5, 10, 15], [5, 10, 15]],
		"pageLength": 15,
		//"processing": true,
		//"serverSide": true,
		"ajax": {
			url: "/API/GetUsers.php",
			type: "POST",
			dataSrc: "",
			data: {},
		},
		columns: [
			{data: "Username"},
			{data: "FirstName"},
			{"data": "LastName"},
			{
				"className": '',
				"data": null,
				"render": function(data, type, full, meta)
				{
					
					 return '<button  id = "viewreg" class="regbtn">View Registered</button><button  id = "viewcrtd" class="regbtn">View Created</button>';
				}
			},
		]
	});

	
	$("#contactTable_paginate").addClass('tableinfo'); // Pages
	$("#contactTable_filter").addClass('tableinfo'); // Search
	$("#contactTable_length").addClass('tableinfo'); // Show x Entries
	$("#contactTable_info").addClass('tableinfo'); // Showing entry numbers
	$("#contactTable_wrapper").addClass('data');
	$("#contactTable").css("border",  "4px solid grey");

	$("#contactTable_filter").addClass('searchtable');
	$("#contactTable_length").addClass('showentriestable');
	$("#contactTable_info").addClass('showentriestable');
	

	$('#contactTable tbody').on('click', '#viewreg', function () {
		var data = table.row($(this).parents('tr')).data();
		username = data[0];
		localStorage.setItem('username', username);
		viewRegistered();
	});

	$('#contactTable tbody').on('click', '#viewcrtd', function () {
		var data = table.row($(this).parents('tr')).data();
		username = data[0];
		localStorage.setItem('username', username);
		viewCreated();
	});

	$('#contactTable tbody').on('click', '#attendbutton', function () {
		var data = table.row($(this).parents('tr')).data();
		title = data[3];
		description = data[4];
		urltable = data[3];
		startd = data[6];
		endd = data[7];
		address = data[8];
		register();
	});
	// jQuery ends

	document.getElementById("contactTable_filter").innerHTML.replace()
}

function viewRegistered()
{
	localStorage.setItem('UserID', userId);
	window.location.href = "superregistered.html";
}

function viewCreated()
{
	localStorage.setItem('UserID', userId);
	window.location.href = "supercreated.html";
}


function deleteEvent()
{
	var jsonPayload = '{"URL" : "' + urltable + '"}';
	var url = urlBase + '/DeleteEvent.' + extension;
	console.log(jsonPayload);
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) // On successfully adding the user to DB close modal
				{
					location.reload();
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			console.log("error event not deleted.");
		}
}

function editEvent()
{
	document.getElementById("modaladdcontact").insertAdjacentHTML("afterend", 
				"<div id='editbuttoncontact'>" +
				"<div class='modaleditting' id = 'modaledit'>" +
						"<div class='modal-content'>"+
							" <span class='close-btn'></span>" +
							"<div class='container'>"+
							"<br>"+
								"<u style='color: rgb(83, 83, 83);'>"+
									"<h1 id='heading' style='font-size: x-large;'>Edit Event</h1>"+
								"</u>"+
								"<p class = 'descriptions'>Please make any necessary changes.</p>"+
								"<hr>"+
								"<br><br>"+
								"<form>"+
									"<div style='text-align: center; margin-top: -25px; margin-bottom: -15px;'>"+
										"<span class='fa fa-calendar icon' style='color: rgb(105, 89, 179);' aria-hidden='true'></span>"+
										"<input id = 'titleedit' type='text' class='logininputs' placeholder='Title' value = '" + title + "'></input>"+
										"<br><br>"+
										"<span class='fa fa-pencil icon' style='color: rgb(105, 89, 179);' aria-hidden='true'></span>"+
										"<input id = 'descriptionedit' type='text' class='logininputs' placeholder='Description' value = '" + description + "'></input>"+
										"<br><br>"+
										"<span class='fa fa-link' style='color: rgb(105, 89, 179);' aria-hidden='true'></span>"+
										"<input id = 'urledit' type='text' class='logininputs' placeholder=' URL' value = '" + urltable + "'></input>"+
										"<br><br>"+
										"<span class='fa fa-calendar' style='color: rgb(105, 89, 179);' aria-hidden='true'></span>"+
										"<input id = 'startedit' type='phone-number' class='logininputs' placeholder=' Start Date' value = '" + startd + "'></input>"+
										"<br><br>"+
										"<span class='fa fa-calendar' style='color: rgb(105, 89, 179);' aria-hidden='true'></span>"+
										"<input id = 'endedit' type='phone-number' class='logininputs' placeholder=' End Date' value = '" + endd + "'></input>"+
										"<br><br>"+
										"<span class='fa fa-home' style='color: rgb(105, 89, 179);' aria-hidden='true'></span>"+
										"<input id = 'addressedit' type='address' class='logininputs' placeholder=' Address' value = '" + address + "'></input>"+
									"</div>"+
								"</form>"+
								"<br><br>"+
								"<div>"+
									"<input id = 'editcontact' type='button' class='signupbtn' value = 'Save Event' onclick = 'updateEvent();'></input>"+
									"<input id = 'canceledit' type='button' class='signupbtn' value = 'Cancel' onclick = 'removeHTML();'></input>"+
								"</div>"   +
							"</div>"+
						"</div>"+
				"</div>"+
			"</div>");
			var modalBtnedit = document.getElementById("editbutton");
			var modaledit = document.querySelector(".modaleditting");
			modalBtnedit.onclick = function () {
					modaledit.style.display = "block";
			}	
}

function removeHTML()
{
	var modalBtnedit = document.getElementById("editbutton");
	var modaledit = document.querySelector(".modaleditting");
	var remove = document.getElementById("editbuttoncontact");
	remove.remove();
	modaledit.style.display = "none";
}

function adminRequest()
{
	alert("Admin access has been request. You are pending approval.");
	var modaledit = document.querySelector(".modaleditting");
	var remove = document.getElementById("editbuttoncontact");
	remove.remove();
	modaledit.style.display = "none";
}

function updateEvent()
{
	var titlee = document.getElementById("titleedit").value;
	var descriptione = document.getElementById("descriptionedit").value;
	var urle = document.getElementById("urledit").value;
	var starte = document.getElementById("startedit").value;
	var ende = document.getElementById("endedit").value;
	var addresse = document.getElementById("addressedit").value;
	var jsonPayload = '{"firstnameo" : "' + fname + 
						'", "lastnameo" : "' + lname + 
						'", "emailo" : "' + emailaddy + 
						'", "phoneo" : "' + phonenum + 
						'", "addresso" : "' + homeaddy + 
						'", "userId" : ' + userId + 
						', "firstnamee" : "' + firstnamee +
						'", "lastnamee" : "'+ lastnamee +
						'", "emaile" : "'+ emaile +
						'", "phonenume" : "' + phonenume + 
						'", "addresse" : "' + addresse + '"}';
	var url = urlBase + '/UpdateContact.' + extension; 

	if (firstnamee.length == 0 || lastnamee.length == 0 || emaile.length == 0 || phonenume.length == 0 || addresse.length == 0) // Ensures all the info is filled out
	{
		var firstreq = document.getElementById("firstreq");
		var lastreq = document.getElementById("lastreq");
		var emailreq = document.getElementById("emailreq");
		var phonereq = document.getElementById("phonereq");
		var addrreq = document.getElementById("addrreq");

		if (firstnamee == "")
		{
			if (document.contains(firstreq))
				firstreq.remove();

			document.getElementById("firstnameedit").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'firstreq'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(firstreq))
				firstreq.remove();
		}
		if (lastnamee == "")
		{
			if (document.contains(lastreq))
				lastreq.remove();

			document.getElementById("lastnameedit").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'lastreq'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(lastreq))
				lastreq.remove();
		}
		if (emaile == "")
		{
			if (document.contains(emailreq))
				emailreq.remove();

			document.getElementById("emailedit").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'emailreq'> *required</r>"
															  );	
		}
		else
		{
			if (document.contains(emailreq))
				emailreq.remove();
		}
		if (phonenume == "")
		{
			if (document.contains(phonereq))
				phonereq.remove();

			document.getElementById("phoneedit").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'phonereq'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(phonereq))
				phonereq.remove();
		}
		if (addresse == "")
		{
			if (document.contains(addrreq))
				addrreq.remove();

			document.getElementById("addressedit").insertAdjacentHTML("afterend", 
			"<r style = 'color: red;' id = 'addrreq'> *required</r>"
															  );
		}
		else
		{
			if (document.contains(addrreq))
				addrreq.remove();
		}
	}
	else
	{	
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) // On successfully adding the user to DB close modal
				{
					location.reload();
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			console.log("error contact not deleted.");
		}
	}
}