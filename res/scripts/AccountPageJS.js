
var user;
var pass;
var IsLoggedIn = false;

var userNew = sessionStorage.getItem("userKey");
var IsLoggedInNew = sessionStorage.getItem("IsLoggedInKey");

function ChangeContent() {
    console.log(userNew);
    console.log(IsLoggedInNew);
    if (userNew)
    {
        document.getElementById("userGreeting").innerHTML = "Welcome Back " + userNew;
    }
    else
    {
        document.getElementById("userGreeting").innerHTML = "Hello Guest!";
    }

    if (IsLoggedInNew != true) {
        document.getElementById("btnGoToDeckPage").style.visibility = 'hidden';
    }
    if(IsLoggedInNew == true) {
        document.getElementById("btnGoToDeckPage").style.visibility = 'visible';
    }

}


function CreateAccount() {

    user = document.getElementsByName("Username")[0].value;
    pass = document.getElementsByName("Password")[0].value;

    if (user && pass) {

        fetch("https://api.apispreadsheets.com/data/3973/?query=select*from3973whereUsername='" + user + "'").then(res => {
            if (res.status === 200) {
                // SUCCESS
                res.json().then(data => {
                    const yourData = data
                    var result = yourData.data.filter(obj => {
                        return obj.Username === user
                    })
                    //console.log(result)
                    if (result.length != 0 && result[0].Username == user) {                    
                        document.getElementById("headline").innerHTML = "User Already exist";
                    }
                    else {
                        fetch("https://api.apispreadsheets.com/data/3973/", {
                            method: "POST",
                            body: JSON.stringify({ "data": { "Password": pass, "Username": user } }),
                        }).then(res => {
                            if (res.status === 201) {
                                // SUCCESS
                                alert("Successful")
                            }
                            else {
                                // ERROR
                            }
                        })
                    }

                }).catch(err => console.log(err))
            }
            else {
                // ERROR
            }
        })
    }
    else {
        document.getElementById("headline").innerHTML = "Please fill in all the empty fields"
    }
}

function LogIn()
{
    user = document.getElementsByName("Username")[0].value;
    pass = document.getElementsByName("Password")[0].value;
    //localStorage.setItem("userKey", user);
    sessionStorage.setItem('userKey', user);


    if (user && pass) {
        fetch("https://api.apispreadsheets.com/data/3973/?query=select*from3973whereUsername='" + user + "'ANDPassword='" + pass + "'").then(res => {
            if (res.status === 200) {
                // SUCCESS
                res.json().then(data => {
                    const yourData = data
                    console.log(yourData)
                    
                    if (yourData.data.length != 0) {
                        document.getElementById("headline").innerHTML = " Hello, " + user;
                        IsLoggedIn = true;
                        sessionStorage.setItem("IsLoggedInKey", IsLoggedIn);
                        if (IsLoggedIn) {
                            location.href = "PersonalDeckPage.html";
                        }
                    }
                    else {
                        document.getElementById("headline").innerHTML = "Information Entered Does Not Match A User";
                    }

                    }).catch(err => console.log(err))
            }
            else {
                // ERROR
            }
        })
    }
    else
    {
        document.getElementById("headline").innerHTML = "Please fill in all the empty fields"
    }
}


function GoToDeckPage() {
    location.href = "PersonalDeckPage.html";
}

function GoToHomePage() {
    location.href = "home.html";
}

function GoToLogInPage() {
    location.href = "AccountPage.html";
}

function GoToDeckPage() {
    location.href = "PersonalDeckPage.html";
}

function GoToDeckPage() {
    location.href = "PersonalDeckPage.html";
}

//Below is for adding a greeting to the user. If user is logged in, it says the user's name, otherwise it says guest

//Add To Any HTML PAGE In Body This Is the greeting
//<p1 id="userGreeting"></p1>

//Add To the JS of the page
//var userNew = sessionStorage.getItem("userKey");

// Add to your onload Function
/*if (userNew) {
document.getElementById("userGreeting").innerHTML = "Welcome Back " + userNew;
    }
    else {
    document.getElementById("userGreeting").innerHTML = "Hello Guest!";
}*/