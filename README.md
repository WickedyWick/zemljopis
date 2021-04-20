# Nacionalna geografija / zemljopis web aplikacija

Nacionalna geografija / zemljopis web aplikacija

## STATE
    In development
    
## Potrebne alatke, tehnologije, frameworkovi

* [NodeJS](https://nodejs.org/en/) - server
* [XAMPP](https://www.apachefriends.org/index.html) - baza podataka

## Instalacija i konfiguracija 

### XAMPP
- Nakon instalacije XAMPP-a , pokrenuti program sa administratorskim pravima.
- Ako prvi put pokrećete program potrebno je promeniti način autentifikacije tako što ćemo otvoriti **config.inc** fajl (*Apache sekcija -> config -> config.inc*) i promeniti **auth_type** u **cookie** ( *$cfg['Servers'][$i]['auth_type'] = 'cookie';*).
- Nakon toga pokrenuti Apache i MySQL klikom na **Start** . Sada bi trebalo da je moguće pristupiti **phpmyadmin** (*DEFAULT : localhost:80*) web interfejsu pomoću kojeg možemo upravljati bazom podataka.
- Potrebno je ulogovati se (*DEFAULT username je root a šifra je prazna*).
- Nakon toga mogu se dodati useri ukoliko je potrebno.
- Napraviti novu bazu klikom na **New** sa leve strane.
- Database name je proizvoljno dok je **OBAVEZNO** promeniti *utf8mb4_general_ci* u *utf8mb4_croatian_ci* zbog slova poput č,ć,š,ž.
- Potom je potrebno ući u panel kreirane baze podataka i importovati spremljeni .sql fajl (**Import -> Choose File -> zemljopisv2.sql -> Go**) , u ovom slučaju .sql se nalazi u *db* folderu.

### NODEJS
- Nakon instalacije Node-a, potrebno je otvoriti konzolu u root folderu gde je projekat kloniran 
- Potrebno je uneti lokalnu adresu sa portom u formatu lokalnaAdresa:3000 (3000 je default port) u public/javascripts/config.js fajlu
- Takodje je potrebno konfigurisati bazu podataka , to je moguće uraditi u public/javascripts/trueMysql.js fajlu
- Izvršiti sledeće komande ''' npm install ''' i ''' npm app ''' da bi pokrenuli aplikaciju
- Default adresa aplikacije je localhost:3000
