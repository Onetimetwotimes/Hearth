fetch("https://api.apispreadsheets.com/data/3973/").then(res => {
    if (res.status === 200) {
        // SUCCESS
        res.json().then(data => {
            const yourData = data
        }).catch(err => console.log(err))
    }
    else {
        // ERROR
    }
})

function CreateAccount() {
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

function LogIn()
    {
        document.getElementById("headline").innerHTML = " Hello, (Person who signed in goes here)";
    }
