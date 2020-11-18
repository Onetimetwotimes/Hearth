//Remove this when done testing basics
function showPage()
{
    switch(document.getElementById("testDrop").value)
    {
        case "deckBuilder":
            $("#deckBuilder").show();
            $("#newDeckSetup").hide();
            $("#deckList").hide();
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

function SetTitle()
{
    document.title = document.getElementsByName("txt_DeckName")[0].value;
}