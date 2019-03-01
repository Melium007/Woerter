"use strict";
//V2 nun mit ÜbersetzungsWähler
//V3 nun mit Array Sortierung und markieren der des gefundenen Eintrags
//V4 markieren und speichern von LieblingsWorten
//V5 div für Fehlermeldungen
//V6 zähler der gemerkten Wörter
//V7 mit konfigDatei
// ############Globale Variablen  ###############
var buch = [];
var translate2 = 1;
//  var textOrgLang="Schwäbisch";
var orgLang = 0;
//   var texttransLang="Deutsch";
var transLang = 1;
var lastIndexLi = null;
var timer; // index des TimeOuts
var konfig = new Object();
konfig = {
  sprache1: "Schwäbisch",
  sprache2: "Deutsch",
  dateiName: "woerterbuch.json"
};
const keyLocalBook = "persoenlichesWoerterbuch";
const KeyLocalKonfig = "persoenlichesWoerterbuchKonfig";
const fehlerDiv = document.getElementById("fehler");
const timeoutTimer = 4000; // timer für die Fehlermeldung
const maxLength = 20; //länge des String für Wortliste

// let konfig.dateiName="woerterbuch.jason";

var merkCounter = 0; //zähler für markierte Einträge
//################################

function getBuch() {
  loadKonfig();
  var xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    var jsonDoc = xhttp.responseText;
    buch = JSON.parse(jsonDoc);
    //console.log(buch);
    // console.log(buch.length);
    buildWortList();
  };
  xhttp.open("GET", konfig.dateiName, true);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send();
} //end getBuch()
function loadKonfig() {
  var textkonfig = readCookie(KeyLocalKonfig);

  if (textkonfig != null) {
    //und nun String in Array:
    konfig = JSON.parse(
      textkonfig
    ); /*konfig={sprache1:'' , sprache2:'' ,dateiName:''}*/
    //console.log(konfig);
  }
  setDaten();
  /*else
        {
            //fehlermeldung
            showError("keine gemerkten KonfigDaten vorhanden");
        }*/
} //end load
function setDaten() {
  /*konfig.sprache1; konfig.sprache2; konfig.dateiName;*/
  document.querySelector("h1").innerHTML =
    "Wörterbuch " + konfig.sprache1 + " " + konfig.sprache2;
  /*<button id="textOrgLang"  onclick="selectLang (1)">Schwäbisch</button>  
        <button id="texttransLang"  onclick="selectLang (2)">Deutsch</button>  */
  document.querySelector("#textOrgLang").innerHTML = konfig.sprache1;
  document.querySelector("#texttransLang").innerHTML = konfig.sprache2;
} //end setDaten
// #########################################
//Holen der JasonDatei!!!!!!!
getBuch();

//********* add EventListener     *****************
//Return im Eingabefeld
document.getElementById("search").addEventListener("keypress", function(e) {
  var key = e.which || e.keyCode;
  //console.log(key);
  if (key === 13) {
    // 13 is enter
    // code for enter
    search();
  }
});
//click in die Checkbox
document.getElementById("merken").addEventListener("click", buildWortList);
//https://stackoverflow.com/questions/14544104/checkbox-check-event-listener

//click auf die Überschift stellt das original Wörterbuch wieder her
document.getElementsByTagName("h1")[0].addEventListener("click", getBuch);

//#############################################

//sortieren des Buches
function sortArr(colIndex) {
  //console.log(colIndex);
  //console.log(buch);
  var arr = buch;
  arr.sort(sortFunction);
  function sortFunction(a, b) {
    a = a[colIndex].trim();
    b = b[colIndex].trim();
    // console.log(a+"  ?  "+b);
    return a.toLowerCase().localeCompare(b.toLowerCase()); //https://www.mediaevent.de/javascript/sort.html
  } //end sortFunction(a, b)
  buch = arr;
} // sortArr(colIndex)

// aufbauen der Li Liste aus dem Array Buch
function buildWortList() {
  let counterSpan = document.querySelector("#merkCounter");
  counterSpan.setAttribute("class", "hideMe");
  sortArr(orgLang); //sortieren des Buches
  var merken = document.getElementById("merken").checked;
  // console.log(merken);
  //  var formWordList= document.getElementById("formWortListe");
  var wordList = document.getElementById("wordList"); //Wortliste aufbauen
  //console.log("kinder="+wordList.hasChildNodes())
  deleteAllChilds(wordList);
    let l=buch.length;
  for (let i = 0; i < l; i++) {
    var liNode = document.createElement("li");
    liNode.setAttribute("onclick", "show(" + i + ")");
    //erstellen der Texte aus dem Array
    let ltext = buch[i][orgLang].trim();
    ltext = ltext.slice(0, maxLength); //kürzen auf maxLength Zeichen
    //console.log(ltext);

    if (merken) {
      //sollen checkBoxen zum merken von Wörtern angezeigt werden
      var inputField = document.createElement("INPUT");
      inputField.setAttribute("type", "checkbox");
      inputField.setAttribute("name", "wort" + i);
      inputField.setAttribute("class", "wortMerker");
      inputField.setAttribute("onclick", "gemerkteCount(" + i + ")");
      liNode.appendChild(inputField);
    }
    var textNode = document.createTextNode(ltext);
    liNode.appendChild(textNode);
    wordList.appendChild(liNode);
  } //end for i
} //end buildWortList()

//löschen aller KindElemente
function deleteAllChilds(elternteil) {
  if (elternteil.hasChildNodes()) {
    //find out if wordText has any child nodes
    // löschen der Kinder
    while (elternteil.firstChild) {
      elternteil.removeChild(elternteil.firstChild);
    }
  } //if
} //end deleteAllChilds

//verändere den merkCounter
function gemerkteCount(index) {
  var formular = document.forms["formWortListe"];
  var checkBox = formular["wort" + index];
  // console.log("checkBox"+index+checkBox.checked)
  if (checkBox.checked) {
    merkCounter++;
  } else {
    merkCounter--;
  }
  let counterSpan = document.querySelector("#merkCounter");
  if (merkCounter > 0) {
    counterSpan.innerHTML = merkCounter;
    counterSpan.setAttribute("class", "showMe");
  } else {
    counterSpan.innerHTML = "";
    counterSpan.setAttribute("class", "hideMe");
  }
}

//zeige den gefundenen Eintrag
function show(index) {
  var orgText = document.getElementById("original");
  var meaningText = document.getElementById("meaning");
  clearAusgabe();
  //wort zeigen
  var textNode = document.createTextNode(buch[index][orgLang]);
  orgText.appendChild(textNode);
  //anzeigen der Übersetzung
  textNode = document.createTextNode(buch[index][transLang]);
  meaningText.appendChild(textNode);
} //end show

//suche nach Eintrag
function search() {
  var suchText = document.getElementById("search").value;
  //console.log(suchText);
  var orgText = document.getElementById("original");
  var meaningText = document.getElementById("meaning");
  clearAusgabe();
  if (suchText == "") {
    showError("Bitte etwas Eingeben");
    return;
    //Fehlermeldung zeigen
  } //nix eingegeben

  var found = -1;
let l=buch.length;
  for (var i = 0; i < l; i++) {
    /*if (suchText.toUpperCase()==buch[i][orgLang].toUpperCase() )
               {
                   found=i;
                    
                   break;
               }else
               {*/
    //damit es egal ist ob Gross- oder kleinbuchtaben
    let ttext = buch[i][orgLang].toUpperCase();
    if (ttext.startsWith(suchText.toUpperCase())) {
      found = i;

      break;
    }
    // }
  } //end for
  if (found >= 0) {
    var wordList = document.getElementById("wordList");
    var liNode = wordList.getElementsByTagName("li");
    liNode[found].scrollIntoView(true); //https://www.the-art-of-web.com/javascript/remove-anchor-links/

    //wie wäre es mit einer class damit es sichtbarer wird??
    liNode[found].setAttribute("class", "highlight");
    if (lastIndexLi != null) {
      //console.log(lastIndexLi);
      liNode[lastIndexLi].removeAttribute("class");
    }
    lastIndexLi = found;
    show(found);
  } else {
    var textNode = document.createTextNode(
      "kein  " + suchText + " in dem Wörterbuch gefunden"
    );
    orgText.appendChild(textNode);
    textNode = document.createTextNode(
      "Es konnte leider kein Eintrag gefunden werden"
    );
    meaningText.appendChild(textNode);
  }
} //end search()

//lösche die Anzeige des Fundes
function clearAusgabe() {
  var orgText = document.getElementById("original");
  var meaningText = document.getElementById("meaning");
  if (orgText.hasChildNodes()) {
    //find out if wordText has any child nodes
    // löschen der Kinder
    orgText.removeChild(orgText.firstChild);
    // löscht das erste Kind (TextKnoten) vom p
    meaningText.removeChild(meaningText.firstChild);
    // löscht das erste Kind (TextKnoten) vom p
  }
} //clearAusgabe

//Auswahl der Sprache
function selectLang(translate2) {
  switch (translate2) {
    case 1:
      orgLang = 0;
      transLang = 1;
      break;
    case 2:
      orgLang = 1;
      transLang = 0;
      break;
  }
  buildWortList();
} //selectLang

// speichern der markierten Wörter
function save() {
  var localBuch = []; // var tabArray=[]

  //neue Array erzeugen  aus Liste Daten holen

  // var x = document.querySelectorAll(".beispiel");
  var wordList = document.getElementById("wordList");
  var liNode = wordList.getElementsByTagName("li");
  //  var checkBoxes=document.querySelectorAll(".wortMerker");
  var formular = document.forms["formWortListe"];

  //  console.log( checkBoxes);
 let l=liNode.length;
  for (var i = 0; i <= l - 1; i++) {
    var checkBox = formular["wort" + i];
    if (checkBox.checked) {
      //schauen ob ausgewählt
      localBuch.push(buch[i]);
      // console.log(buch[i])
    } //if
  } //for i
  //console.log(localBuch);

  //abspeichern der gemerkten Wörter
  var jasonText = JSON.stringify(localBuch);
  createCookie(keyLocalBook, jasonText);
  //console.log("geschrieben!");
} //end save

//laden der gemerkten Wörter
function load() {
  var textcatalog = readCookie(keyLocalBook);
  // text= document.createTextNode(textcatalog);
  //document.getElementById("shopping-cart-items").appendChild(text);
  if (textcatalog != null) {
    //und nun String in Array:
    buch = JSON.parse(textcatalog);
    //console.log(buch);
    // nun in eine Liste
    buildWortList();
  } else {
    //fehlermeldung
    showError("keine gemerkten Wörter vorhanden");
  }
} //end load

//lösche gemerkte
function deleteIt() {
  deleteCookie(keyLocalBook);
  getBuch();
} //end delete()

//Fehler Div füllen und anzeigen
function showError(text) {
  clearTimeout(timer);
  if (fehlerDiv.hasChildNodes()) {
    //find out if wordText has any child nodes
    // löschen der Kinder
    fehlerDiv.removeChild(fehlerDiv.firstChild);
    // löscht das erste Kind (TextKnoten) vom div
  }

  var textNode = document.createTextNode(text);
  fehlerDiv.appendChild(textNode);
  fehlerDiv.setAttribute("class", "showMe");
  timer = setTimeout(hideFehlerMeldung, timeoutTimer);
} //end showError

function hideFehlerMeldung() {
  fehlerDiv.classList.toggle("hideMe");
  fehlerDiv.classList.toggle("showMe");
}

//*************************************************************
/*    Helferfunktion für das Setzen des Webstorage:	*/

function createCookie(name, value) {
  localStorage.setItem(name, value);
}

/*		Helferfunktion für das Auslesen  des Webstorage:*/

function readCookie(name) {
  var wert = localStorage.getItem(name);
  if (wert != null) {
    return wert;
  } else {
    return null;
  }
}

/*		Helferfunktion für das Löschen des  des Webstorage:			*/
function deleteCookie(name) {
  localStorage.removeItem(name);
}
