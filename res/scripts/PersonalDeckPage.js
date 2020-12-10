var currentPageNum = 1;
var selectedCard;

var deck_builder = new deckBuilder;
var deckID;

var userNew = sessionStorage.getItem("userKey");

var fullCardList = [];

var classOfCurrentDeck = "";
/*
RARITYIDs
1 - common
2 - free
3 - rare
4 - epic
5 - legendary
*/

//Remove this when done testing basics
function showPage(txtNameThing)
{
    if (userNew)
    {
        document.getElementById("userGreeting").innerHTML = "Welcome Back " + userNew;
    }
    else
    {
        document.getElementById("userGreeting").innerHTML = "Hello Guest!";
    }
    switch(txtNameThing)
    {
        case "deckBuilder":
            $("#deckBuilder").show();
            $("#newDeckSetup").hide();
            $("#deckList").hide();

            // $("#searchCardName").on('input', function(e) {
            //     ClearAllCardsInList();
            //     loadMoreCards({"region" : "us", "page" : currentPageNum, "keyword" : $("#searchCardName").value});
            //  });

            loadMoreCards({"region" : "us", "page" : currentPageNum});
            break;
        case "newDeckSetup":
            $("#deckBuilder").hide();
            $("#newDeckSetup").show();
            $("#deckList").hide();
            break;
        case "deckList":
            $("#deckBuilder").hide();
            $("#newDeckSetup").hide();
            $("#deckList").show();
            break;
    }
}

function CardData(c)
{
    var retData = "" +
    "<div id='" + c.id + "' class='cardDataSec'" +
    
    ">" +
        "<div class='cardDataLarge' style='background-image: url(" + String.raw`${c.image}` + ");'></div>" +
        "<div class='cardDataSmall' style='display: none'>" + 
            "<p style='float: left; background-color: #2c6bd1; width: 5%; height: 50%; text-align: center; margin: 10px;'>" + 0 + "</p>" + 
            "<p style='float: left; width: 45%; height: 100%; text-align: left; margin: 10px; margin-left: 0px;'>" + c.name + "</p>" +
            "<img style='float: right;' src='" + String.raw`${c.cropImage}` + "'; />" +
        "</div>" +
    "</div>";
    

    return retData;
}

function SetTitle()
{
    document.title = document.getElementsByName("txt_DeckName")[0].value;
}

function RefreshCards()
{
    ClearAllCardsInList();

    loadMoreCards({"region" : "us", "page" : currentPageNum});

    $("#attackOpt").val(-1);
    $("#healthOpt").val(-1);
    $("#cardTypeOpt").val(-1);
    $("#rarityOpt").val(-1);
    $("#minionTypeOpt").val(-1);
    $("#keywordOpt").val(-1);

}

async function loadMoreCards(params)
{
    params.class = classOfCurrentDeck;
    let cardList = await Promise.resolve(cardsearch(params));

    cardList = cardList.data;

    fullCardList[currentPageNum - 1] = cardList.cards;
    console.log(fullCardList);
    if(currentPageNum < cardList.pageCount);
    cardList.cards.forEach(c => {
        if(c.cardTypeId != 3)
        {
            $("#cardListSection").html($("#cardListSection").html() + CardData(c));
        }
    });

    var header = document.getElementById("cardListSection");
    var cards = header.getElementsByClassName("cardDataSec");
    for (var i = 0; i < cards.length; i++) 
    {
        cards[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");
            if(current.length > 0)
            {
                current[0].className = current[0].className.replace(" active", "");
                Card_OnClick(cardList.cards, this.id, this);
            }
            this.className += " active";
        });

        for(var x = 0; x < fullCardList.length; x++)
        {
            fullCardList[x].forEach(c => {
                if(c.id == cards[i].id)
                {
                    $("#" + cards[i].id).data('CardData', c);
                    console.log($("#" + cards[i].id).data('CardData'));
                    return;
                }
            });
        }
    }

    if(cardList.cardCount == 0)
    {
        $("#cardListSection").html("<h3>No cards found!<br/>Please check your search</h3>");
    }
    else
    {
        currentPageNum++;
    }
}

function ClearAllCardsInList()
{
    $("#cardListSection").html("");
    currentPageNum = 1;
}

async function BuildDeck()
{
    let deckID = await Promise.resolve(deck_builder.build());
    deckID = deckID.data;

    console.log(deckID);
    $("#deckIDUser").val(deckID.deckCode);
}

async function Card_OnClick(cardList, cardId, sender)
{
    if(sender.parentElement.id == "deckCardList")
    {
        deck_builder.remove(cardId);
        $("#" + cardId).appendTo("#cardListSection");
        $("#cardCount").html(deck_builder.cards.length + " / 30 cards");
        $("#" + cardId + " .cardDataLarge").css("display", "block");
        $("#" + cardId + " .cardDataSmall").css("display", "none");
    }
    else
    {
        let val = await AddCardToDeck(cardList, cardId);
        console.log(val);
        if(val == true)
        {
            $("#" + cardId + " .cardDataLarge").css("display", "none");
            $("#" + cardId + " .cardDataSmall").css("display", "block");
        }
    }
}

async function AddCardToDeck(cardList, cardId)
{
    if(deck_builder.cards.length < 30)
    {
        var card = $("#" + cardId).data('CardData');
        console.log(card);
        
        var addCard = true;
        deck_builder.cards.forEach(c => {
            if(c.id == cardId)
            {
                addCard = false;
                console.log("Hello");
                return false;
            }
        });
        
        if(addCard && card)
        {
            deck_builder.push(card.id);
            $("#" + card.id).appendTo("#deckCardList");
            $("#cardCount").html(deck_builder.cards.length + " / 30 cards");
            return true;
        }
        return false;
    }
    else
    {
        return false;
    }
}

$(window).scroll(function() {
    if(Math.ceil($(window).scrollTop() + $(window).height()) >= $(document).height())
    {
        loadMoreCards({"region" : "us", "page" : currentPageNum});
    }
 });

function ClearDeckList()
{
    for (let i = deck_builder.cards.length - 1; i >= 0; i--) 
    {
        deck_builder.remove(document.getElementById("deckCardList").children[i].id);
        $("#" + document.getElementById("deckCardList").children[i].id).appendTo("#cardListSection");
        $("#cardCount").html(deck_builder.cards.length + " / 30 cards");
    }

    $("#deckIDUser").val("");
}

async function LoadDeck(deckIDCode)
{
    ClearDeckList();

    var deckB = new deckBuilder;

    if(deckIDCode)
    {
        var d = await Promise.resolve(deckIDCode);
        var cardListToLoad = d.data.cards;
        console.log(cardListToLoad);
        cardListToLoad.forEach(c => {
            deckB.push(c.id);
            $("#deckCardList").html($("#deckCardList").html() + CardData(c));
        });
        var a = await Promise.resolve(deckB.build()).data;
        deck_builder = deckB;
        
        $("#cardCount").html(deck_builder.cards.length + " / 30 cards");  
    }
    else
    {
        var d = await Promise.resolve(getDeck($("#deckIDUser").val()));
        $("#deckIDUser").val("");
        var cardListToLoad = d.data.cards;
        console.log(cardListToLoad);
        cardListToLoad.forEach(c => {
            deckB.push(c.id);
            $("#deckCardList").html($("#deckCardList").html() + CardData(c));
        });
        var a = await Promise.resolve(deckB.build()).data;
        deck_builder = deckB;
        
        $("#cardCount").html(deck_builder.cards.length + " / 30 cards");   
    }

}

function SetParams()
{
    ClearAllCardsInList();

    var params = {
        "region" : "us", 
        "page" : currentPageNum
    };

    if($("#attackOpt").val() != -1)
    {
        params.attack = $("#attackOpt").val();
    }

    if($("#healthOpt").val() != -1)
    {
        params.health = $("#healthOpt").val();
    }

    if($("#cardTypeOpt").val() != -1)
    {
        params.type = $("#cardTypeOpt").val();
    }

    if($("#rarityOpt").val() != -1)
    {
        params.rarity = $("#rarityOpt").val();
    }

    if($("#minionTypeOpt").val() != -1)
    {
        params.minionType = $("#minionTypeOpt").val();
    }

    if($("#keywordOpt").val() != -1)
    {
        params.keyword = $("#keywordOpt").val();
    }

    loadMoreCards(params);
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

// TODO: Continue setting up the new deck stuff

function CreateNewDeck()
{
    var hero = $("#heroSelect").val();
    if(hero != -1)
    {
        $("#heroTypeTitle").html(hero);
    }
    else
    {
        $("#heroTypeTitle").html("No hero chosen. Hero will be selected when deck is built");
    }

    showPage('deckBuilder');
}