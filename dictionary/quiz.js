"use strict";
// ############Globale Variablen  ###############
const keyLocalBook = "persoenlichesWoerterbuch";
const KeyLocalKonfig = "persoenlichesWoerterbuchKonfig";
// const ajaxBook="woerterbuch.jason";
const fehlerDiv = document.getElementById("fehler");
const maxLength = 18; //länge des String für die Karten
const timeoutTimer = 3000; // timer für die Fehlermeldung,korrekte Antwort, nächste Frage und Ergebniss anzeige

var buch = [];
var quiz = [];
var orgLang = 0;
var transLang = 1;
var timer; // index des TimeOuts
var turnCount = 0;
var anzahlFragen = 0;
var korrekteAntworten = 0;
var falscheAntworten = 0;
var counterSpan = document.querySelector("#merkCounter");

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
   // console.log(buch.length);
    if (0 == buch.length) {
      showError("ganzes Buch konnte nicht geladen werden");
    } else {
      buildQuiz();
    }
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
   // console.log(konfig);
  }
} //end load
// #########################################

function load(art) {
  counterSpan.setAttribute("class", "hideMe");

  turnCount = 0;
  if (art == 1) {
    //lade ganzes Buch Holen der JasonDatei!!!!!!!
    getBuch();
  } else {
    //lade gemerkte Wörter
    var textcatalog = readCookie(keyLocalBook);
    //console.log(textcatalog);
    if (textcatalog != null) {
      //und nun String in Array:
      buch = JSON.parse(textcatalog);
      //console.log(buch);

      let anzahlFragen = document.getElementById("anzahlFragen").value;
      if (buch.length >= anzahlFragen) {
        buildQuiz();
      } else {
        showError(
          "zuwenig gemerkten Wörter vorhanden (nur " +
            buch.length +
            ") das reicht nicht für " +
            anzahlFragen +
            "Fragen"
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
//QuizFragen aus ArrayBuch gennerieren
function buildQuiz() {
  if (buch.length > 0) {
    korrekteAntworten = 0;
    falscheAntworten = 0;
    turnCount = 0;
    //AnzahlFragen abfragen #anzahlFragen
    anzahlFragen = document.getElementById("anzahlFragen").value;
    //console.log(anzahlFragen);

    if (anzahlFragen == "") {
      showError("Bitte etwas Eingeben");
      return;
      //Fehlermeldung zeigen
    } //nix eingegeben
    else {
      anzahlFragen = Number(anzahlFragen);
      //Fragen aufbauen
        
        let i = 0;  
        let frageIndex=[];
   //   for (let i = 0; i < anzahlFragen; )
              /*das Problem ist, das nach jeder Schleife neue zufällige Zahlen geholt werden und somit
              im quiz gleiche Frage auftauchen können. Um dies zu verhindern, wird die For Schleife wie beim erzeugen der Zufallszahl durch eine While Schleife ersetzt. 
              Um einfach zu Vergleichen ob die Frage (der Index eines Wortes im Buch) schon vorhanden ist wird das Array fragenIndex genutzt.Es speichert allen schon erzeugten FragenIndexe ab. */
       while (quiz.length < anzahlFragen) // es werden "anzahlFragen" unterschiedliche Fragen benötigt
   { 
              let tempArr = [];
            let randomArr = [];
           // console.log("buchlänge" + buch.length);

            //   let randomZ = Math.floor(Math.random() * buch.length);

            
              randomArr = zufallsZahl(0, buch.length);//es werden drei zufällige zahlen die nicht gleich sind geholt
      if (frageIndex.length == 0) 
      {
           frageIndex.push(randomArr[0]);
      }
      else
      {
          if (frageIndex.indexOf(randomArr[0]) < 0)//vergleich ob es die Frage schon gab bei -1 ist der Index neu
          {
            frageIndex.push(randomArr[0]);

            //quiz=   frage [0] / Antwort korrekt [1]/ Fehler [2] / fehler [3]
            tempArr[0] = buch[randomArr[0]][orgLang];
            tempArr[1] = buch[randomArr[0]][transLang];
            tempArr[2] = buch[randomArr[1]][transLang];
            tempArr[3] = buch[randomArr[2]][transLang];

            quiz[i] = tempArr;
            i++;
          }
        }
          //  console.log(quiz);
        }//while
        showFrage();
        }
      } //end if(buch.length>0)
      else {
        showError("Buch konnte nicht korrekt geladen werden");
  }
} //endbuildQuiz

function zufallsZahl(min, max) {
  let randomArr = [];
  while (
    randomArr.length < 3 // es werden 3 unterschiedliche Zufallszahlen benötigt
  ) {
    // console.log("while"+randomArr.length);
    let randomZ = Math.floor(Math.random() * max + min);

    // console.log(randomZ);
    if (randomArr.length == 0) {
      randomArr.push(randomZ);
    } else {
      if (randomArr.indexOf(randomZ) < 0) {
        randomArr.push(randomZ);
      }
    }
  } //while
  // console.log("randomArr:");
    //console.log(randomArr);
  return randomArr;
} //end zufallszahl

//Frage anzeigen
function showFrage() {
  if (turnCount == anzahlFragen) {
    ausgabe(
      korrekteAntworten +
        " korrekte Antworten und " +
        falscheAntworten +
        " falsche Antworten"
    );
  } else {
    let antwortArr = [];
    //   for (let i=0;i<anzahlFragen;i++){
    let frageDiv = document.getElementById("frageText");
    //frageDiv leeren
    deleteAllChilds(frageDiv);

    //frageDiv mit Frage füllen
    //quiz=  frage [0] / Antwort korrekt [1]/ Fehler [2] / fehler [3]
    let textNode = document.createTextNode(quiz[turnCount][0]);
    frageDiv.appendChild(textNode);
    antwortArr = zufallsZahl(0.5, 3);
    for (let j = 0; j < 3; j++) {
      let antwortDiv = document.getElementById("antwort" + (j + 1));
      //AntwortDivs leeren
      deleteAllChilds(antwortDiv);
      //AntwortDivs zufällig füllen
     // console.log("j= " + j + " " + quiz[turnCount][antwortArr[j]]);
      // es wird zufällig einer in das j.te Feld geschrieben
      textNode = document.createTextNode(quiz[turnCount][antwortArr[j]]);

      if (antwortArr[j] == 1) {
        quiz[turnCount].push(j + 1);
      }
      //  console.log(quiz[turnCount]);
      antwortDiv.appendChild(textNode);
    } //for j

    
   // console.log(quiz[turnCount]);
  }
} //end showFrage

//Antwort auswerten
function answer(index) {
  //console.log(index + "index/arr " + quiz[turnCount][4]);
  // auswerten der antwort
  //quiz=frage[0] | Antwortkorrekt[1]| Fehler[2] | Fehler[3] | korrektesFeld[4]
  //console.log(quiz[turnCount])

  //   let antwortDiv=document.getElementById("antwort"+(index));
  //    let antwort=antwortDiv.innerHTML;
  //  console.log(antwort)

  //  if (antwort== quiz[turnCount][1])
  if (index == quiz[turnCount][4]) {
    //  alert("yeah");
    //Anzahl korrekteAntwort anpassen
    korrekteAntworten++;
    //ausgabe(quiz[turnCount][1]+" ist richtig.")
    ausgabe("Richtig");
  } else {
    falscheAntworten++;
    //Anzahl falsche Antwort anpassen
    // alert("nöööe");
    // ausgabe(quiz[turnCount][1]+" wäre richtig, Leider Falsch.")
    ausgabe("Leider Falsch");
  }
  //korrekte Lösung zeigen
  showKorrekt(quiz[turnCount][4]);

  // erst hier turnCount erhöhen weil man ihn vorher zum vergleichen brauch!!
  turnCount++;
  gemerkteCount(turnCount);

  //nächste Frage anzeigen
  setTimeout(showFrage, timeoutTimer);
} //end answer

function gemerkteCount(index) {
  if (turnCount > 0) {
    counterSpan.innerHTML = turnCount;
    counterSpan.setAttribute("class", "showMe");
  } else {
    counterSpan.innerHTML = "";
    counterSpan.setAttribute("class", "hideMe");
  }
}
function ausgabe(text) {
  let ausgabeDiv = document.getElementById("ausgabe");
  deleteAllChilds(ausgabeDiv);
  var textNode = document.createTextNode(text);
  ausgabeDiv.appendChild(textNode);
  ausgabeDiv.setAttribute("class", "showMe");
  setTimeout(function() {
    ausgabeDiv.setAttribute("class", "hideMe");
  }, timeoutTimer);
} //end ausgabe

function showKorrekt(index) {
  let antwortDiv = document.getElementById("antwort" + index);
  antwortDiv.setAttribute("class", "korrekt");
  setTimeout(function() {
    antwortDiv.setAttribute("class", "quiz");
  }, timeoutTimer);
} //end ausgabe

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

/*		Helferfunktion für das Auslesen  des Webstorage:*/

function readCookie(name) {
  var wert = localStorage.getItem(name);
  if (wert != null) {
    return wert;
  } else {
    return null;
  }
}
