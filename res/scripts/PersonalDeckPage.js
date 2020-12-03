var currentPageNum = 1;
var selectedCard;

var currentDeckList = [];
var cardDataObj = {};
/*
Each cardDataObj will have
num - number of this card in the deck
max - max number of this card allowed in the deck
card - the card object returned from the API
*/

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
    console.log(cardList);

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


function AddCardToDeck(cardList, cardId)
{
    if(currentDeckList.length < 30)
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
        currentDeckList.forEach(c => {
            if(c.id == card.id)
            {
                addCard = false;
                return;
            }
        });
        
        if(addCard)
        {
            currentDeckList[currentDeckList.length] = card;
            $("#" + card.id).appendTo("#deckCardList");
            $("#cardCount").html(currentDeckList.length + " / 30 cards");
        }
    }
}

$(window).scroll(function() {
    if(Math.ceil($(window).scrollTop() + $(window).height()) >= $(document).height())
    {
        loadMoreCards({"region" : "us", "page" : currentPageNum});
    }
 });