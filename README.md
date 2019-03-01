# Woerter
Wörterbuch mit Übungsspielen

•	konfig.html ermöglicht die Konfiguration des Wörterbuches und das Erstellen der JasonDatei aus Excel 2003 XML:
o	„Datenimport“ aus Excel 2003 XML Datei Wandlung in JSON Objekt.
Erzeugter JSON String muss manuell in eine Datei gespeichert werden.
Die neue JSON Datei muss im Konfig in „neues WörterBuch“ angemeldet werden.
Soll die Datei fest eingebunden werden, muss derzeit im Javascript das Objekt konfigList angepasst werden. 
o	Lokale Speicherung des gewählten Wörterbuches im Web Storage.
•	Wörterbuch Applikation (index.html, indexV7.js, style.css, normalize.css). 
o	Erzeugen einer anklickbaren Wortliste aus dem Wörterbuch
o	Suchen in der sortierten Liste mit Anzeige der Fundstelle und zeigen der Übersetzung
o	Übersetzungsrichtung wechseln
o	Markieren und lokales Speichern der ausgewählten Wörter.
o	Laden der lokalen Liste
o	Löschen der lokalen Wortliste
o	Mit Klick auf die Überschrift kommt man wieder zum gesamten Wörterbuch
o	Wechseln zu den anderen Seiten
•	Memory spiel (memory.html, memory.js, memory.css)
o	Spielen mit Worten aus dem gesamten Wörterbuch oder mit den lokalgespeicherten Worten.
o	Fehlermeldung, wenn man weniger Wörter lokal gespeichert hat als zu Spielen mit den lokalen Wörtern benötigt wird
o	Anzeige einer Hilfszahl, damit man auch spielen kann wenn man noch nicht so sicher die Vokabeln kann.
o	Wechsel zu den anderen Seiten
•	Quiz1  (quiz.html, quiz.js, quiz.css)
o	Spielen mit Worten aus dem gesamten Wörterbuch oder mit den lokalgespeicherten Worten.
o	Auswahl der Anzahl der Fragen
o	Anzeige der schon geschafften Fragen
o	Grüne Farbe für korrekte Übersetzung

•	Quiz2 (animation.html, animationV3.js, animationV3.css)
o	Spielen mit Worten aus dem gesamten Wörterbuch oder mit den lokalgespeicherten Worten.
o	Auswahl der Anzahl der Fragen
o	Anzeige der schon geschafften Fragen
o	Anzeige der Richtigen Lösungen (grünes Aufleuchten bei korrekterAntwort)
o	Nur nach einer korrekten antwort gibt es eine neue Frage
o	Anzeige der falschen Lösungen (rotes Aufleuchten bei Fehler)



Datenstruktur JSON:
[
[ „sprache1“][ „sprache2“]
[ „sprache1“][ „sprache2“]
…
]
Derzeitige Auswahl Möglichkeit in konfig.html
var konfigList= 
    [
        ["Schwäbisch", "Deutsch", "woerterbuch.json"],
        ["Englisch", "Deutsch", "englischWoerterbuch.json"],
        ["Platt", "Deutsch", "platt.json"]
    ];

Keys zum lokalen speichern:
const keyLocalBook="persoenlichesWoerterbuch";
 const KeyLocalKonfig="persoenlichesWoerterbuchKonfig"

