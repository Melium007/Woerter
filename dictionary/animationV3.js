"use strict";
//V2 mehr divs
//V3 eingabeFeld für die Fragen
// ############Globale Variablen  ###############
var counter = 0;
var time = 100;
var main;
var timer;

const keyLocalBook = "persoenlichesWoerterbuch";
const KeyLocalKonfig = "persoenlichesWoerterbuchKonfig";
// const ajaxBook="woerterbuch.jason";
const fehlerDiv = document.getElementById("fehler");
const maxLength = 10; //länge des String für die Karten
const timeoutTimer = 4000; // timer für die Fehlermeldung
const aniSpeed = 3000; //2500;

var runGame=false;
var buch = [];
var quiz = [];
var antwortDivs = [];
var orgLang = 0;
var transLang = 1;
var timer; // index des TimeOuts
var turnCount = 0;
var anzahlFragen = 0;
var korrekteAntworten = 0;
var falscheAntworten = 0;
var counterSpan = document.querySelector("#merkCounter");
let antwortDivsNode = [];
var konfig = new Object();
konfig = {
  sprache1: "Schwäbisch",
  sprache2: "Deutsch",
  dateiName: "woerterbuch.json"
};
var timerId;
var antwortFalsch = false;
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
      //  console.log("buch geholt");
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
    //  console.log(konfig);
  }
} //end load
// #########################################

function load(art) {
  //console.log("art="+art);
  turnCount = 0;
  korrekteAntworten = 0;
  falscheAntworten = 0;
  document.querySelector("#turnCount").childNodes[0].nodeValue = "Frage: " + turnCount;
  document.querySelector("#korrekteAntworten").childNodes[0].nodeValue =
    " korrekte: " + korrekteAntworten;
  document.querySelector("#falscheAntworten").childNodes[0].nodeValue =
    " falsche: " + falscheAntworten;

  if (art == 1) {
    //lade ganzes Buch Holen der JasonDatei!!!!!!!
    // console.log("hole ganzes buch")
    getBuch();
  } else {
    //lade gemerkte Wörter
    var textcatalog = readCookie(keyLocalBook);
    //console.log(textcatalog);
    if (textcatalog != null) {
      //und nun String in Array:
      buch = JSON.parse(textcatalog);
      //console.log(buch);

      if (buch.length >= 1) {
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
    //anzahlFragen=3
    anzahlFragen = document.getElementById("anzahlFragen").value;
    //  console.log(anzahlFragen);

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
            console.log("buchlänge" + buch.length);

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

            //quiz=  [ frage [0] / Antwort korrekt [1]/ Fehler [2] / fehler [3] ]
            tempArr[0] = buch[randomArr[0]][orgLang].trim().slice(0, maxLength);
            tempArr[1] = buch[randomArr[0]][transLang].trim().slice(0, maxLength);
            tempArr[2] = buch[randomArr[1]][transLang].trim().slice(0, maxLength);
            tempArr[3] = buch[randomArr[2]][transLang].trim().slice(0, maxLength);

            quiz[i] = tempArr;
            i++;
          }
        }
          //  console.log(quiz);
        }//while
   
    setFrage();
         }//else von if (anzahlFragen == "")
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

    // console.log(cardsContent.length);
    if (randomArr.length == 0) {
      randomArr.push(randomZ);
    } else {
      if (randomArr.indexOf(randomZ) < 0) {
        // wenn es nicht im Array ist ist der Returnwert -1
        randomArr.push(randomZ);
      }
    }
  } //while

  return randomArr;
} //end zufallszahl

function setFrage() {
  // console.log(turnCount+" turnCount/anzahlFragen "+anzahlFragen)
  let frageDiv = document.getElementById("frageText");
  //frageDiv leeren
  deleteAllChilds(frageDiv);
  if (turnCount == anzahlFragen) {
    clearInterval(timer);
    clearInterval(timerId);
    clearInterval(main);
    ausgabe(
      korrekteAntworten +
        " korrekte Antworten und " +
        falscheAntworten +
        " falsche Antworten"  );
      runGame=false;

    return;
  } else {
    //frageDiv mit Frage füllen
    let textNode = document.createTextNode(quiz[turnCount][0]);
    frageDiv.appendChild(textNode);
    setAntworten(true);
  }
} //end setFrage()

function setAntworten(firsttime) {
  let antwortArr = [];
  let aniDivList = document.getElementsByClassName("animate"); //alle 8 div holen
  // zufällig 3 unterschiedliche aus den 12 Divs wählen
  let antwortDivsID = [];
  antwortDivsID = zufallsZahl(0, aniDivList.length - 1);
  // zum beobachten:
  //   console.log("________________________________________");
  //    console.log("array antwortDivsID=")
  //  console.log(antwortDivsID);
  //      console.log("________________________________________");
  antwortArr = zufallsZahl(0.5, 3);

  //alle AntwortDivs leeren
  clearAllAntwortDivs(aniDivList);
  antwortDivsNode = [];

  // in drei zufälligen div (der aniDivList.length Anzahl Divs)  wird je eine Antwort geschrieben
  for (let j = 0; j < 3; j++) {
    //AntwortDivs zufällig füllen
    //  console.log("j= "+j+" "+quiz[turnCount][antwortArr[j]]);
    // es wird zufällig einer der drei gespeicherten werte in das j.te Feld geschrieben
    //  im antwortArr sind 3 zufallszahlen zwischen 1 und 3 gespeichert  z.B antwortArr["3","1","2"]

    let textNode = document.createTextNode(quiz[turnCount][antwortArr[j]]);
    if (antwortArr[j] == 1) {
      //handelt es sich um die korrekte Antwort, dann die divID merken
      if (firsttime) {
        /*quiz= [0] frage /
                            [1] Antwort korrekt /
                            [2] Fehler  /
                            [3] fehler /
                            [4] DivId der korrekten Antwort (wechselt ständig)
                    */
        quiz[turnCount].push(antwortDivsID[j]);
      } else {
        // wenn die Antworten nur neu positioniert werden sollen, wird zuvor der alte wert mittels pop gelöscht.
        quiz[turnCount].pop();
        quiz[turnCount].push(antwortDivsID[j]);
        // klasse für fehler mitsetzen??
      }
    }
    //  console.log("quiz[turnCount] =");
    //  console.log(quiz[turnCount]);

    // in ein zufälliges div (zufallZahl in antwortDivsID[j]) wird eine Antwort geschrieben
    aniDivList[antwortDivsID[j]].appendChild(textNode);

    let tarr = [];
    tarr.push(aniDivList[antwortDivsID[j]]);
    tarr.push(antwortDivsID[j]);
    antwortDivsNode.push(tarr);
    //   console.log("antwortDivsNode");
    //   console.log(antwortDivsNode);
  } //for j

  //  console.log(quiz[turnCount]);
  if (turnCount == 0 && firsttime) {
    beginnen();
  }
} //setAntworten()

function meineAnimation() {
  //div container mit zufallzahl klickbar machen
  var opa;
  var halb;

  for (let i = 0; i < 3; i++) {
    antwortDivsNode[i][0].setAttribute(
      "onclick",
      "prüfen(" + antwortDivsNode[i][1] + ")"
    );
  }
  opa = 0;
  halb = false;
  timerId = setInterval(frame, 60);/* geschwindigkeit des Ein und Ausblendens beim ändern muss auch der hauptIntervall angepasst werden!*/

function frame() {
    //  console.log("timerId : "+timerId);
    if (!halb) {
      if (opa >= 1) {
        opa = 1;
        halb = true;
      } else {
        opa += 0.1;
        //   console.log(" +setze opa= "+opa);
        setOpa(opa);
      }
    } else {
      if (opa <= 0) {
        opa = 0;
        halb = false;
        clearInterval(timerId);
        for (let i = 0; i < 3; i++) {
          antwortDivsNode[i][0].removeAttribute("onclick");
        }
        //  console.log("neue Antworten");
        setAntworten(false);
      } else {
        opa -= 0.1;
        //  console.log(" - opa= "+opa);
        setOpa(opa);
      }
    }
  } //frame()
} //meineAnimation()

function clearAllAntwortDivs(aniDivList) {
    let l=aniDivList.length;
  for (let i = 0; i < l; i++) {
    deleteAllChilds(aniDivList[i]);
  }
} //clearAllAntwortDivs

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
function ausgabe(text) {
  var ausgabeDiv = document.getElementById("ausgabe");
  deleteAllChilds(ausgabeDiv);
  var textNode = document.createTextNode(text);
  ausgabeDiv.appendChild(textNode);
  ausgabeDiv.setAttribute("class", "showMe");
  setTimeout(function() {
  ausgabeDiv.setAttribute("class", "hideMe");
  }, timeoutTimer);
} //end ausgabe

//############### spielFunktionen##############

function prüfen(index) {
  // console.log(index);
  // wurde die korrekte lösung angeklickt??
  if (index == quiz[turnCount][4]) {
    // dann hochzählen
    turnCount++;
    document.querySelector("#turnCount").childNodes[0].nodeValue = "Frage: " + turnCount;
      
    korrekteAntworten++;
    antwortFalsch = false;
    clearInterval(timerId);
    let divK= document.querySelector("#korrekteAntworten");
    divK.childNodes[0].nodeValue = " korrekte: " + korrekteAntworten;
    // divK.innerHTML =" korrekte: " + korrekteAntworten;
    setHighlight(divK,"green");// Zahler Korrekte Antwort grün markieren
    setTimeout(setNormal, 1000);// Zähler wieder normal färben
    setOpa(0);
    
    //neue Frage stellen
    setFrage();
  } else {
    //  alert("nooooe") ;
    //fehler hochzählen
    //  console.log("quiz[turnCount][index]=")
    //    console.log(quiz[turnCount][index]);
    falscheAntworten++;
    antwortFalsch = true;
    let divF=document.querySelector("#falscheAntworten");
    divF.childNodes[0].nodeValue =" falsche: " + falscheAntworten;
    setHighlight(divF,"red");// Zahler falsche Antwort rot markieren
    setTimeout(setNormal, 1000);// Zähler wieder normal färben
    setOpa(0);
  }
} //end prüfen(index)

function setOpa(opa) {
  for (let i = 0; i < 3; i++) {
    antwortDivsNode[i][0].style.opacity = opa;
  }
}

function setNormal()
{
    document.querySelector("#korrekteAntworten").removeAttribute('class');
    document.querySelector("#falscheAntworten").removeAttribute('class');
    
}//setNormal

function setHighlight(div,className)
{
    div.setAttribute('class',className);
}//setHighlight

//erstmal ohne Zeit, wäre aber eine nette Erweiterung, das man auswählen kann auch gegen die Zeit zu spielen....
/*function zeit() {
  time--;
  // document.querySelector("#counter span:last-child").innerHTML = "Zeit: " + time;
  if (time <= 0) {
    clearInterval(main);
    clearInterval(timer);
    document.querySelector("#counter span:last-child").style.color = "red";
  }
} //end zeit()*/

function beginnen() {
  if(!runGame){
      runGame=true;//verhindern das setIntervall mehrmal aufgerufen wird!
      document.getElementById("counter").style.display = "block";
      main = setInterval(meineAnimation, aniSpeed); 
/* in 10 schritten einblenden, pro schritt 60msec und das selbe fürs ausblenden (60*10erschritte zum ein/ausblenden) =1200 plus etwas luft damit das programm im Hintergrund die daten eintragen kann=2200*/
  //timer = setInterval(zeit, 1000);//timer function wird derzeit noch nicht genutzt!
  }
    }

//#############zusatz Funktionen###################

/*		Helferfunktion für das Auslesen  des Webstorage:*/

function readCookie(name) {
  var wert = localStorage.getItem(name);
  if (wert != null) {
    return wert;
  } else {
    return null;
  }
}
