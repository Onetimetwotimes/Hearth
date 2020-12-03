
var user;
var pass;

function CreateAccount() {

    user = document.getElementsByName("Username")[0].value;
    pass = document.getElementsByName("Password")[0].value;

    if (user && pass) {


        $.ajax({
            url: 'https://api.apispreadsheets.com/data/3973/',
            type: 'post',
            data: $("#myForm").serializeArray(),
            success: function () {
                alert("Successful")
            },
            error: function () {
                alert("An Error Has Occurred")
            }
        });
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
                    document.getElementById("headline").innerHTML = " Hello, " + user;
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
