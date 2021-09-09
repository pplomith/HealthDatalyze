# HealthDatalyze

IT
HealthDatalyze è una Dashboard Web per la visualizzazione interattiva dei dati in ambito medico, consentendo ai dottori di monitorare la condizione dei pazienti, al fine di individuare le possibili malattie o delle cure nei valori misurati. Inoltre, per ogni paziente vengono mostrate le malattie precedentemente diagnosticate, periodi in cui sono stati assunti farmaci e la visualizzazione su una timeline di eventi particolari (operazioni, ricoveri).

EN
HealthDatalyze is a Web Dashboard for the interactive visualization of data in the medical field, allowing doctors to monitor the condition of patients, in order to identify possible diseases or treatments in the measured values. In addition, for each patient the previously diagnosed diseases, periods in which drugs were taken and the visualization on a timeline of particular events (operations, hospitalizations) are shown.

### Requisiti per l'installazione del sistema: 
- Connessione ad Internet.
- Web Browser (es. Chrome, Firefox, Opera).
- Server Tomcat.
- MySQL Workbench.
- IDE per lo sviluppo (es. Intellij, Eclipse).

##### Versioni:
- **Tomcat 9.0.31**
- **Java 15**
- **MySQL 8.0.18**

### Setup e installazione del sistema:

1) Avviare l'IDE selezionato e compiere una fork del repository corrente per ottenere il codice sorgente.
2) Connessione al DB del sistema:
- Scaricare [MySQL Workbench](https://downloads.mysql.com/archives/workbench/) in base al proprio sistema operativo.
- Installare **MySQL Workbench seguendo** la [Guida di installazione e configurazione](https://docs.appspace.com/latest/how-to/setup-mysql-with-mysql-workbench/).
- Connettersi al proprio database e importare ([Guida](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html)) i dati dal file:
```  
~/src/main/resources/dataset/DBcreation.sql.
```
3) Accedere alla classe *ConPool* ed impostare **Username** e **Password** utilizzate nella configurazione del database.
4) Installare il server **Tomcat** ed integrarlo nell'IDE:
- Scaricare ed installare [Tomcat](https://tomcat.apache.org/download-90.cgi) in base al proprio sistema operativo.
- L'integrazione varia in base all'IDE in utilizzo. 
  La spiegazione avviene sull'integrazione con Intellij:
    - Il primo step è la [definizione dell'application sever](https://www.jetbrains.com/help/idea/configuring-and-managing-application-server-integration.html).
    - Successivamente eseguire la [configurazione di avvio](https://www.jetbrains.com/help/idea/creating-run-debug-configuration-for-application-server.html).
5) Il sistema è stato correttamente installato ed è possibile avviarlo cliccando **Run 'Tomcat'** rappresentato con una freccia verde.

### Compilazione:
Per attuare le modifiche effettuate in JavaScript deve essere eseguita una compilazione del codice.

##### Creazione ambiente di compilazione:
Spiegazione eseguita sull'IDE Intellij.
1) Installazione di **webpack**:
- Digitare ed eseguire nel terminale dell'IDE il seguente comando:
```
npm install --save-dev webpack
```
2) Recarsi in **Run/Debug Configurations**.
3) Aggiungere una nuova configurazione: **npm**.
4) Impostazioni della configurazione:
```  
    package.json: ~\IdeaProjects\[nome progetto]\package.json
    Command: run
    Scripts: build
    Node interpreter: Project node (*~\nodejs\node.exe)
    Package manager: Project ~\nodejs\node_modules\npm
``` 
5) Eseguire la nuova configurazione cliccando **Run 'build'**.

6) Riavviare il server **Tomcat** per aggiornare l'applicazione.