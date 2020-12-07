var currentPageNum = 1;
var selectedCard;

var deck_builder = new deckBuilder;
var deckID;

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

// function SelectCard(card)
// {
//     DeselectCard();
//     selectedCard = card;
//     //$("#" + selectedCard.id).css("background-color", "darkgray");
// }

// function DeselectCard()
// {
//     if(selectedCard.id >= 0)
//     {
//         //$("#" + selectedCard).css("background-color", "white");
//         $("#" + selectedCard.id).hover(function() {
//             $(this).css("background-color", lightgray);
//         });
//     }
// }

function CardData(c)
{
    var retData = "" +
    "<div id='" + c.id + "' class='cardDataSec' style='background-image: url(" + String.raw`${c.image}` + ");'" +
    //"onclick=SelectCard(" + c.id + ")" +
    ">" +
    // c.name +
    "</div>";
    

    return retData;
}

function SetTitle()
{
    document.title = document.getElementsByName("txt_DeckName")[0].value;
}

async function loadMoreCards(params)
{
    let cardList;
    while(!cardList)
    {
        cardList = await Promise.resolve(cardsearch(params));
    }

    cardList = cardList.data;

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
                AddCardToDeck(cardList.cards, this.id);
            }
            this.className += " active";
        });
    }

    currentPageNum++;
}

function ClearAllCardsInList()
{
    $("#cardListSection").html("");
}

async function AddCardToDeck(cardList, cardId)
{
    if(deck_builder.cards.length < 30)
    {
        var card;
        cardList.forEach(c => {
            if(c.id == cardId)
            {
                card = c;
                return;
            }
        });
        
        var addCard = true;
        deck_builder.cards.forEach(c => {
            if(c.id == card.id)
            {
                addCard = false;
                return;
            }
        });
        
        if(addCard && card)
        {
            deck_builder.push(card.id);
            $("#" + card.id).appendTo("#deckCardList");
            $("#cardCount").html(deck_builder.cards.length + " / 30 cards");
        }
    }
    else
    {
        let deckID = await Promise.resolve(deck_builder.build());
        deckID = deckID.data;
    }
}

$(window).scroll(function() {
    if(Math.ceil($(window).scrollTop() + $(window).height()) >= $(document).height())
    {
        loadMoreCards({"region" : "us", "page" : currentPageNum});
    }
 });



function showCheckboxes(checks) {
  var checkboxes = document.getElementById(checks);
  if (checkboxes.style.display == "none") {
    checkboxes.style.display = "block";
  } else {
    checkboxes.style.display = "none";
  }
}

function ClearDeckList()
{
    for (let i = deck_builder.cards.length - 1; i >= 0; i--) {
        deck_builder.remove(document.getElementById("deckCardList").children[i].id);
        $("#" + document.getElementById("deckCardList").children[i].id).appendTo("#cardListSection");
        $("#cardCount").html(deck_builder.cards.length + " / 30 cards");
    }
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
    
}