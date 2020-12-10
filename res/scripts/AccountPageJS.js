
var user;
var pass;
var IsLoggedIn = false;
var deckIDTemp;
var deckIDSubstring;
var deckNameSubstring;
var deckName;



var userNew = sessionStorage.getItem("userKey");
var passNew = sessionStorage.getItem("passKey");
var IsLoggedInNew = sessionStorage.getItem("IsLoggedInKey");
var deckIDNew = GetDeckID();
var deckNameNew = GetDeckName();

function ChangeContent() {

    console.log(GetDeckName());
    console.log(GetDeckID());

    //UpdateSheet();


    if (userNew && userNew != "null")
    {
        document.getElementById("userGreeting").innerHTML = "Welcome Back " + userNew;
    }
    else
    {
        document.getElementById("userGreeting").innerHTML = "Hello Guest!";
    }

    HideButtons();
}


function CreateAccount() {

    user = document.getElementsByName("Username")[0].value;
    pass = document.getElementsByName("Password")[0].value;
    deckName = document.getElementsByName("DeckName")[0].value;
    deckIDTemp = document.getElementsByName("DeckID")[0].value;

    if (user && pass && deckName && deckIDTemp) {
        fetch("https://api.apispreadsheets.com/data/4792/?query=select*from4792whereUsername='" + user + "'").then(res => {
            if (res.status === 200) {
                // SUCCESS
                res.json().then(data => {
                    const yourData = data
                    var result = yourData.data.filter(obj => {
                        return obj.Username === user
                    })
                    if (result.length != 0 && result[0].Username == user) {                    
                        document.getElementById("headline").innerHTML = "User Already exist";
                    }
                    else {
                        fetch("https://api.apispreadsheets.com/data/4792/", {
                            method: "POST",
                            body: JSON.stringify({ "data": { "Password": pass, "Username": user, "DeckName": deckName, "DeckID": deckIDTemp } }),
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
    sessionStorage.setItem('userKey', user);
    sessionStorage.setItem('passKey', pass);
    var currentDeckID;
    var currentDeckName;

    if (user && pass) {
        fetch("https://api.apispreadsheets.com/data/4792/?query=select*from4792whereUsername='" + user + "'ANDPassword='" + pass + "'").then(res => {
            if (res.status === 200) {
                // SUCCESS
                res.json().then(data => {
                    const yourData = data
                    console.log(yourData)
                    
                    if (yourData.data.length != 0) {
                        document.getElementById("headline").innerHTML = " Hello, " + user;
                        IsLoggedIn = true;

                        currentDeckName = yourData.data[0].DeckName;
                        currentDeckID = yourData.data[0].DeckID;
                        sessionStorage.setItem("IsLoggedInKey", IsLoggedIn);
                        sessionStorage.setItem("deckNameKey", currentDeckName);
                        sessionStorage.setItem("deckIDKey", currentDeckID);
                        if (IsLoggedIn) {
                            //location.href = "PersonalDeckPage.html";
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

function LogOut() {
    IsLoggedIn = false;
    sessionStorage.setItem("IsLoggedInKey", IsLoggedIn);
    user = null;
    sessionStorage.setItem('userKey', user);
    deckName = null;
    sessionStorage.setItem("deckNameKey", deckName);
    deckIDTemp = null;
    sessionStorage.setItem("deckIDKey", deckIDTemp);
    GoToLogInPage();
}

//This is the button's function to add deck. First checks if user is logged in, then checks if user entered anything in the
//deck id field and deck name field. These fields cannot be empty
function AddDeckID(dName, dID) {
    if (dName == null && dID == null) {
        dName = document.getElementsByName("DeckName")[0].value;
        dID = document.getElementsByName("DeckID")[0].value;
    }

    var currentDeckID;
    var currentDeckName;

    if (GetIsLoggedIn()) {
        if (dName && dID) {
            fetch("https://api.apispreadsheets.com/data/4792/?query=select*from4792whereUsername='" + userNew + "'").then(res => {
                if (res.status === 200) {
                    // SUCCESS
                    res.json().then(data => {
                        const yourData = data
                        currentDeckName = GetDeckNameRaw() + "," + dName;
                        currentDeckID = GetDeckIDRaw() + "," + dID;
                        sessionStorage.setItem("deckNameKey", currentDeckName);
                        sessionStorage.setItem("deckIDKey", currentDeckID);
                    }).catch(err => console.log(err))
                }
                else {
                    // ERROR
                }
                //change location to the page that is being used. This is to refresh the page
                location.href = "AccountPage.html"
            })
        }
        else {
            //Optional, lets user know what they screwed up. Change elementid to the one that will be used in your page
            document.getElementById("headline").innerHTML = "When Adding A Deck, You Must Enter A Deck Name And Deck ID";
        }
    }
    else {
        //Optional, lets user know what they screwed up. Change elementid to the one that will be used in your page
        document.getElementById("headline").innerHTML = "You Must Be Logged In First";
    }
}

//Function below allows the user to edit the deckId when given the deck name
function EditDeckID(dName, newDeckID) {
    if (dName == null && newDeckID == null) {
        dName = document.getElementsByName("searchForDeck")[0].value;
        newDeckID = document.getElementsByName("newDeckID")[0].value;
    }
    var allDeckID = GetDeckID();
    var isDeckTrue = GetDeckName().includes(dName);
    var newAllID;

    if (isDeckTrue) {
        var nameIndex = GetDeckName().indexOf(dName);
        allDeckID[nameIndex] = newDeckID;

        newAllID = allDeckID.join();
        sessionStorage.setItem("deckIDKey", newAllID);
        //Reload Page To Update
        }
    else {
        document.getElementById("edit1").innerHTML = "Invalid";
    }
}

//Get functions will return the deckIds and Deck names into an array. Place this where needed

function GetDeckID() {
    var splitID;
    var id;
    id = sessionStorage.getItem("deckIDKey");
    splitID = id.split(",");
    return splitID;
}

function GetDeckName() {
    var splitDeckName;
    var dName;
    dName = sessionStorage.getItem("deckNameKey");
    splitDeckName = dName.split(",");
    return splitDeckName;
}

function GetDeckIDRaw() {
    var id;
    id = sessionStorage.getItem("deckIDKey");
    return id;
}

function GetDeckNameRaw() {
    var dName;
    dName = sessionStorage.getItem("deckNameKey");
    return dName;
}

function GetIsLoggedIn() {
    return sessionStorage.getItem("IsLoggedInKey");
}

function HideButtons() {
    var check = false;
    if (userNew && userNew != "null") {
        check = true;
    }
    else {
        check = false;
    }

    if (check) {
        document.getElementById("btnLogOut").style.visibility = "visible";
        document.getElementById("btnCreateAccount").style.visibility = "hidden";
        document.getElementById("btnLogIn").style.visibility = "hidden";
    }
    else {
        document.getElementById("btnLogOut").style.visibility = "hidden";
        document.getElementById("btnCreateAccount").style.visibility = "visible";
        document.getElementById("btnLogIn").style.visibility = "visible";
    }
}

function UpdateSheet() {
    var logInCheck = (GetIsLoggedIn() == 'true');
    var dName = GetDeckNameRaw();
    var id = GetDeckIDRaw();

    if (logInCheck) {
        fetch("https://api.apispreadsheets.com/data/4792/", {
            method: "POST",
            body: JSON.stringify({ "data": { "DeckID": id, "DeckName": dName}, "query": "select*from4792whereUsername='" + userNew + "'" }),
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
}

function GoToDeckPage() {
    location.href = "PersonalDeckPage.html";
}


function GoToLogInPage() {
    location.href = "AccountPage.html";
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