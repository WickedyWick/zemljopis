# Nacionalna geografija / zemljopis web aplikacija

Nacionalna geografija / zemljopis web aplikacija

# ANDROID KLIJENT

* [Android](https://github.com/WickedyWick/Zemljopis-Android) - android

# DOZVOLE
Zabranjeno kopiranje i korišćenje koda osim za lične potrebe (testiranje i lokalno igranje za maksimalno 2 igrača).
    
## PLANOVI
- Projekat je planiran da bude hostovan i potpuno besplatan za sve korisnike , projekat će sadrzati reklame (jedan baner na strani koji ne ometa rad igre, GOOGLE AD SENSE).
- Najverovatnije će biti opcija da škole dobiju ili kupe(možda jos nisam siguran kako će sve ići ali neće biti više od 25 evra po školi godišnje) specijalnu dozvolu gde mogu da menjaju kod -po njihovim potrebama i hostuju lokalno.
- Cilj je da se barem isplati cena hostovanja i domena.
- Sve navedeno je moguće da se promeni.

## STATE
    In development

## Potrebne alatke, tehnologije, frameworkovi

* [NodeJS](https://nodejs.org/en/) - server
* [XAMPP](https://www.apachefriends.org/index.html) - baza podataka

## DEMO 

* [90s](https://www.youtube.com/watch?v=lvL02iGEqRk) -90 sekundi
* [FULL DEMO](https://www.youtube.com/watch?v=COptxK_RlOs) - FULL DEMO
* [ANDROID DEMO](https://www.youtube.com/watch?v=CoAYXbh9bSI) - Android demo

## Instalacija i konfiguracija 

### XAMPP
- Nakon instalacije XAMPP-a , pokrenuti program sa administratorskim pravima.
- Ako prvi put pokrećete program potrebno je promeniti način autentifikacije tako što ćemo otvoriti **config.inc** fajl (*Apache sekcija -> config -> config.inc*) i promeniti **auth_type** u **cookie** ( *$cfg['Servers'][$i]['auth_type'] = 'cookie';*).
- Nakon toga pokrenuti Apache i MySQL klikom na **Start** . Sada bi trebalo da je moguće pristupiti **phpmyadmin** (*DEFAULT : localhost:80*) web interfejsu pomoću kojeg možemo upravljati bazom podataka.
- Potrebno je ulogovati se (*DEFAULT username je root a šifra je prazna*).
- Nakon toga mogu se dodati useri ukoliko je potrebno.
- Napraviti novu bazu klikom na **New** sa leve strane.
- Database name je proizvoljno dok je **OBAVEZNO** promeniti ***utf8mb4_general_ci*** u ***utf8mb4_croatian_ci*** zbog slova poput č,ć,š,ž.
- Potom je potrebno ući u panel kreirane baze podataka i importovati spremljeni .sql fajl (**Import -> Choose File -> zemljopisv2.sql -> Go**) , u ovom slučaju .sql se nalazi u *db* folderu.

### NODEJS
- Nakon instalacije Node-a, potrebno je otvoriti konzolu u root folderu gde je projekat kloniran 
- Potrebno je uneti lokalnu adresu sa portom u formatu *lokalnaAdresa:3000* (**3000 je default port**) u ***public/javascripts/config.js*** fajlu
- Takođe je potrebno konfigurisati bazu podataka , to je moguće uraditi u ***public/javascripts/trueMysql.js*** fajlu
- Izvršiti sledeće komande ``` npm install ``` i ``` node app ``` da bi pokrenuli aplikaciju
- Default adresa aplikacije je *localhost:3000*

### FILE STRUCTURE
    .
    ├── db                      # Folder za baze
    ├── public                  # Folder za slike, js i css fajlove (express layout)
    │   ├── images              # Folder za slike
    │   ├── javascripts         # Folder za javascript fajlove
    │   └── stylesheets         # Folder za style fajlove
    ├── scraper_scripts         # Folder za skripte
    │   ├── biljke              # Fajlovi vezani za biljke (za unošenje u bazu)
    │   ├── data                # Fajlovi vezani za za unošenje u bazu (OLD)
    │   ├── drzave              # Fajlovi vezani za drzava (za unošenje u bazu)
    │   ├── generalScripts      # Generalne scripte za manipulaciju podacima
    │   ├── gradovi             # Fajlovi vezani za gradove (za unošenje u bazu)
    │   ├── imena               # Fajlovi vezani za imena (za unošenje u bazu)
    │   ├── oldScripts          # Stare scripte (OLD)
    │   ├── planine             # Fajlovi vezani za planine (za unošenje u bazu)
    │   ├── reke                # Fajlovi vezani za reke (za unošenje u bazu)
    │   └── zivotinje           # Fajlovi vezani za zivotinje (za unošenje u bazu)
    ├── tests                   # Testovi 
    ├── views                   # Html fajlovi (express layout)
    ├── WindowsFormsApp1        # C# aplikacija za brze sortiranje validnih podataka
    ├── xls                     # xls fajlovi 
    ├── app.js                  # server
    ├── errCodeList.json        # beskorisno
    ├── idea.txt                # OLD
    ├── package-lock.json       # package-lock.json
    ├── package.json            # package.json
    ├── README.md               # README.md
    ├── sucCodeList.json        # beskorisno
    └── todo                    # licna todo lista (localno updatovana)
     
### FUNKCIONALNOSTI
- Podaci prihvaćeni u latinici (sa kvačicama i bez) i ćirilici
- Bodovovanje i pregled rezultata drugih igrača u sobi po rundama
- Vote kick sistem, da ne mora da se pravi nova soba ako jedan igrač odluči da prestane da igra
- Jednostavan Base64 sessionToken koji se čuva u localStorage-u koji ograničava da korisnik ne može da bude u više soba u isto vreme 
- -> Takođe omogućava da samo registrovani korisnik u tom browseru može da pristupi sobi , a ne neko drugi ko zna sobu i ime 
- Room-based sistem

### POZNATI BUGOVI
- Daje server error nekada kada se korisnik disconnectuje (playerUnready event)
- Omogucava predlozi dugme nekada na prazan rezultat
- Moguće ući više puta u sobu sa istim korisnikom u istom browseru 
- Nepravilne poruke u nekim situacijama 

### PLANOVI
- Mogući neki live chat u sobi
- Mogući account sistem ako projekat bude išao dobro

### TODO
- Dodaj bug tracking i reporting sistem 
- Refactoring
- Napravi external javascript fajlove za game.html i index.html
- Dodaj 'Room Cleaner' koji jednom u 24h briše neaktivne sobe u localData

### BASIC LOGIC
- Podaci koji je koriste više puta u sobi se čuvaju u memoriji u formi dictionary-a
- Igrač se mora registrovati na index.js stranici
- Prilikom registracije svakom igraču je dodeljen base64 sessionToken da neko drugi ne može da udje u sobu ako zna ime i kod sobe
- Postoji history i vote kick sistem
- Da bi runda počela svi igrači moraju biti spremni
- Na početku svake runde proverava se da li je sessionToken isti kao i kada ste ušli u sobu , tako se brani da korisnik ne može da igra u dve sobe u isto vreme
- Ako izađete iz sobe i uđete u drugu sobu , ne može se vratiti u prvobitnu
- Ako izađete iz sobe i ne uđete u drugu sobu, moguće je vratiti se pritiskom na dugme "Vrati se u sobu" ili jednostavno ulaženjem na isti URL sa odgovarajućim parametrima
- Window.onload event regexuje parametre i salje ih na proveru
- Load listener prima odgovarajuće podatke i ispisuje ih
- Runda počinje na gameStartNotification eventu
- Klijent može da okonča rundu ako je popunio validno sva polja (clientEndRound) ili server request (roundEnd)

### TTM
- Neće biti dodate nove funkcionalnosti za TTM takmičenje osim možda bug fixova , sto čini ovu verziju finalnu za takmičenje
- Baza podataka je još jako mala
- Glavni cilj mog projekta je zabava, ali to nije jedina stvar što doprinosi. Iz mog ličnog iskustva i okruženja primetio sam da tokom godina počnu da se zaboravljaju stvari naučene iz škole ako se ne upotrebljavaju , moj projekat omogućava da se upotrebljava znanje iz oblasti geografije. Odlučio sam da napravim (portujem , kako god) online verziju igre poznatu u narodu kao nacionalna geografija ili zemljopis. Sa sve većom upotrebnom računara, mobilnih telefona , tableta ... potrebno je imati mogućnost igrati igru i na tim uređajima , pogotovo u trenutnoj pandemiji. Ovaj projekat ne pomaže direktno studentima ali je tu da pruži zabavu sa drugarima i u isto vreme proširi ili održava znanje o geografiji.