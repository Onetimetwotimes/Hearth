const AUTH_TARGET = 'https://us.battle.net/oauth/authorize';
const TOKEN_TARGET = 'https://us.battle.net/oauth/token';

var apiToken;

function getAPIToken(client) {
    results = axios.get(TOKEN_TARGET,
    {
        auth:
        {
            username: client.clientID,
            password: client.clientSecret
        },
        params:
        {
            grant_type: 'client_credentials'
        }
    }
    ).then(function (response) {
        apiToken = response.data.access_token;
        //console.log(response);
        //console.log(apiToken);
    });

}

function getAPICall(url) {
    results = axios.get(url,
        {
            "headers":
            {
                "Authorization": `Bearer ${apiToken}`
            }
        }
    )
    .then(function (response) {
        console.log(response);    
    })
}


$.getJSON("res/client.json", function (data) { getAPIToken(data); });