var currentPageNum = 1;
var selectedCard = -1;

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

function SelectCard(cardID)
{
    DeselectCard();
    selectedCard = cardID;
    $("#" + selectedCard).css("background-color", "darkgray");
}

function DeselectCard()
{
    if(selectedCard >= 0)
    {
        $("#" + selectedCard).css("background-color", "white");
    }
}

function CardData(c)
{
    var retData = "" +
    "<div id='" + c.id + "' class='cardDataSec' style='background-image: url(" + String.raw`${c.image}` + ");' onclick=SelectCard(" 
    + c.id + ")" +
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

    currentPageNum++;
}


function AddCardToDeck(cardID)
{

}

$(window).scroll(function() {
    //console.log(Math.ceil($(window).scrollTop() + $(window).height()) + " " + $(document).height());
    if(Math.ceil($(window).scrollTop() + $(window).height()) >= $(document).height())
    {
        loadMoreCards({"region" : "us", "page" : currentPageNum});
    }
 });