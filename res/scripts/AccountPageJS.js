
var user;
var pass;
var IsLoggedIn = false;


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


