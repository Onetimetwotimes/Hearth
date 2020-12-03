const AUTH_TARGET = 'https://us.battle.net/oauth/authorize';
const TOKEN_TARGET = 'https://us.battle.net/oauth/token';
const CARDSEARCH_TARGET = 'https://us.api.blizzard.com/hearthstone/cards';

var apiToken;


function getAPIToken(client) {
    axios.get(TOKEN_TARGET,
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

/**
 * [Makes a call to the target url with the provided parameters and returns the data response]
 * @param {string} url
 * @param {object} param
 */
async function getAPICall(url, data) {
    return result = await Promise.resolve(
        axios.get(url,
            {
                "headers":
                {
                    "Authorization": `Bearer ${apiToken}`
                },
                params: data
            }
        )
    )
}

/**
 * searches cards with the provided parameters.
 * parameters should be passed as a JSON object
 * 
 * Valid search parameters:
 * set - The slug of the card set to search, searches all cards by default
 * class - The slug of the card's class
 * manaCost
 * attack
 * health
 * collectible
 * rarity
 * type - The type of the card (e.g. minion, spell, etc)
 * minionType
 * gameMode - A recognized gameMode (e.g. battlegrounds or constructed)
 * page - page number
 * pageSize - results per page
 * sort - desc or asc (default asc)
 * @param {object} params
 * 
 */
async function cardsearch(params) {
    params.locale = "en_US";
    return result = await Promise.resolve(getAPICall(CARDSEARCH_TARGET, params));
}

/**
 * returns 
 * @param {number} id
 */
async function getCard(id) {
    return result = await Promise.resolve(getAPICall(`${CARDSEARCH_TARGET}/${id}`));
}


$.getJSON("res/client.json", function (data) { getAPIToken(data); });