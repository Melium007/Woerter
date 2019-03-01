// ############Globale Variablen  ###############
const cards = document.querySelectorAll(".memory-card");
const keyLocalBook = "persoenlichesWoerterbuch";
const KeyLocalKonfig = "persoenlichesWoerterbuchKonfig";
//const ajaxBook="woerterbuch.jason";
const fehlerDiv = document.getElementById("fehler");
const maxLength = 18; //länge des String für die Karten
const timeoutTimer = 4000; // timer für die Fehlermeldung

var buch = [];
var cardsContent = [];
var orgLang = 0;
var transLang = 1;
var mitHilfe = true; //bestimmt ob IndexZahlen als Hilfe angezeigt werden
var timer; // index des TimeOuts
var aufgedecktCount = 0;
var turnCount = 0;

let hasFlippedCard = false;
let lockBoard = true; //Spielbrett blockieren solange ausgewertet wird
let firstCard, secondCard;

var konfig = new Object();
konfig = {
  sprache1: "Schwäbisch",
  sprache2: "Deutsch",
  dateiName: "woerterbuch.json"
};

//################################

function getBuch() {
  loadKonfig();
  var xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    var jsonDoc = xhttp.responseText;
    buch = JSON.parse(jsonDoc);
    //console.log(buch);
    //console.log(buch.length);
    setGame();
  };
  xhttp.open("GET", konfig.dateiName, true);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send();
} //end getBuch()
// #########################################
function loadKonfig() {
  var textkonfig = readCookie(KeyLocalKonfig);

  if (textkonfig != null) {
    //und nun String in Array:
    konfig = JSON.parse(
      textkonfig
    ); /*konfig={sprache1:'' , sprache2:'' ,dateiName:''}*/
    //console.log(konfig);
  }
} //end load
function load(art) {
  flipAllCards();
  turnCount = 0;
  if (art == 1) {
    //lade ganzes Buch
    //Holen der JasonDatei!!!!!!!
    getBuch();
  } else {
    //lade gemerkte Wörter
    var textcatalog = readCookie(keyLocalBook);
    //console.log(textcatalog);
    if (textcatalog != null) {
      //und nun String in Array:
      buch = JSON.parse(textcatalog);
      //console.log(buch);
      // Worte auf die Spielkarten
      if (buch.length >= 6) {
        // es werden mindestens 6 Wörter benötigt
        setGame();
      } else {
        showError(
          "zuwenig gemerkten Wörter vorhanden (nur " + buch.length + ")"
        );
      }
    } else {
      //fehlermeldung
      showError("keine gemerkten Wörter vorhanden");
    }
  }
} //end load

//Fehler Div füllen und anzeigen
function showError(text) {
  clearTimeout(timer);
  deleteAllChilds(fehlerDiv);

  var textNode = document.createTextNode(text);
  fehlerDiv.appendChild(textNode);
  fehlerDiv.setAttribute("class", "showMe");
  fehlerDiv.setAttribute("z-index", "99");
  timer = setTimeout(hideFehlerMeldung, timeoutTimer);
} //end showError
function hideFehlerMeldung() {
  fehlerDiv.classList.toggle("hideMe");
  fehlerDiv.classList.toggle("showMe");
}

function defineCard() {// erzeugen der 12 Karten
  while (cardsContent.length < 12) {
    let randomPos = Math.floor(Math.random() * buch.length);
    // console.log(cardsContent.length);
    if (cardsContent.length == 0) {
      cardsContent.push(randomPos);
    } else {
      if (cardsContent.indexOf(randomPos) < 0) {// falls es das Wort nocht nicht gibt darf es aufgenommen werden.
        cardsContent.push(randomPos);
      }
    }
  } //while
  //console.log(cardsContent);
} //end defineCards

function setGame() {
  setFront(" ");
  defineCard();
  aufgedecktCount = 0;

  var checkBox = document.querySelector("#mitHilfe");
  // console.log("checkBox"+index+checkBox.checked)
  mitHilfe = checkBox.checked;

  var divMemoryCard = document.querySelectorAll(".memory-card");
  var cardIndex = 0;
  //console.log(divMemoryCard.length);
let l=divMemoryCard.length;
  for (let i = 0; i < l; i += 2) {
    // <div class="front-face"> </div>
    //console.log("cards[cardIndex]="+cardsContent[cardIndex]);
    let index = cardsContent[cardIndex];
    //console.log(index);
    var frontFace1 = divMemoryCard[i].querySelector(".front-face");
    deleteAllChilds(frontFace1);
    //console.log(backFace1)
    var frontFace2 = divMemoryCard[i + 1].querySelector(".front-face");
    deleteAllChilds(frontFace2);
    // erste Sprache

    let ltext = buch[index][orgLang].trim();
    ltext = ltext.slice(0, maxLength); //kürzen auf maxLength Zeichen
    if (mitHilfe) {
      ltext = ltext + " " + cardIndex;
    }
    var textNode = document.createTextNode(ltext);
    frontFace1.appendChild(textNode);

    //zweite Sprache
    ltext = buch[index][transLang].trim();
    ltext = ltext.slice(0, maxLength); //kürzen auf maxLength Zeichen
    if (mitHilfe) {
      ltext = ltext + " " + cardIndex;
    }
    textNode = document.createTextNode(ltext);
    frontFace2.appendChild(textNode);
    cardIndex++;
    shuffle();
    removeHideGame();

    lockBoard = false;
    // hideMenue()
  } //for i
} //setGame

//removeHideGame
function removeHideGame() {
  let gameDiv = document.getElementById("hideGame");
  //console.log("verstecken");
  gameDiv.setAttribute("class", "hideMe");
}
function gameWin() {
  let ausgabeDiv = document.getElementById("ausgabe");
  var textNode = document.createTextNode("gelöst in " + turnCount + " Zügen");
  ausgabeDiv.appendChild(textNode);
  ausgabeDiv.setAttribute("class", "showMe");
  setTimeout(function() {
    ausgabeDiv.setAttribute("class", "hideMe");
  }, timeoutTimer);
}

function flipAllCards() {
  cards.forEach(card => card.classList.remove("flip"));
}

//löschen aller KindElemente
function deleteAllChilds(elternteil) {
  if (elternteil.hasChildNodes()) {
    //find out if wordText has any child nodes
    // löschen der Kinder
    while (elternteil.firstChild) {
      elternteil.removeChild(elternteil.firstChild);
    }
  } //if
}

function setFront(text) {
  var divMemoryCard = document.querySelectorAll(".back-face");
    let l=divMemoryCard.length;
  for (let i = 0; i < l; i++) {
    var textNode = document.createTextNode(text);
    divMemoryCard[i].appendChild(textNode);
  }
} //setFront

function flipCard() {
  "use strict";
  if (lockBoard) return;
  if (this === firstCard) return; // wenn jemand ein zweitesmal auf die erste Karte klickt

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  turnCount++;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    aufgedecktCount++;
    if (aufgedecktCount == 6) {
      gameWin();
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    // damit man das umdrehen sieht
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  // ES6 destruktion Assignment
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

//(// durch die klammern wird die Funktion sofort nach der deklaration aufgerufen
function shuffle() {
  //flexbox order um Karten zu mischen
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}
//)();

cards.forEach(card => card.addEventListener("click", flipCard));

/*		Helferfunktion für das Auslesen  des Webstorage:*/

function readCookie(name) {
  var wert = localStorage.getItem(name);
  if (wert != null) {
    return wert;
  } else {
    return null;
  }
}
