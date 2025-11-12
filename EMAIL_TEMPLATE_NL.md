# E-mail Template voor Hosting Provider (Nederlands)

## Casual/Vriendelijke Versie (Aanbevolen)

**Onderwerp:** Hulp nodig: ModSecurity blokkeert Strapi CMS

---

**Beste [Naam],**

Ik loop tegen een probleem aan met ModSecurity op onze server. Het blokkeert de upload functionaliteit van Strapi CMS op cms.envicon.nl.

**Wat er gebeurt:**
- Als ik probeer bestanden te uploaden in Strapi krijg ik 403 errors
- ModSecurity regel 211760 blokkeert de API verzoeken
- De regel ziet MongoDB query operators (`$and`, `$eq`) als SQL injection pogingen
- Maar dit zijn gewoon standaard Strapi parameters die nodig zijn voor filtering

**Foutmelding die ik zie:**
```
403 Forbidden
ModSecurity: Access denied - Rule ID: 211760
URI: /upload/files?filters[$and][0][folderPath][$eq]=/
```

**Wat ik nodig heb:**
Ik heb hulp nodig om dit op te lossen. Kunnen jullie ModSecurity regel 211760 uitschakelen voor cms.envicon.nl? Of hebben jullie een andere oplossing?

**Wat ik al geprobeerd heb:**
- Ik heb gekeken in Plesk maar zie geen ModSecurity instellingen
- WordPress werkt prima op dezelfde server (gebruikt deze operators niet)
- Het probleem zit specifiek bij Strapi CMS

**Domein:** cms.envicon.nl

Zouden jullie dit kunnen oplossen? Of kunnen jullie me vertellen wat de beste aanpak is?

Alvast bedankt!

Groeten,  
[Uw naam]  
[Uw e-mail/telefoon]

---

## Nog Casualer Versie

**Onderwerp:** Probleem met Strapi CMS upload

---

Hoi [Naam],

Ik heb een probleem met Strapi CMS op cms.envicon.nl. De upload functionaliteit werkt niet omdat ModSecurity de API verzoeken blokkeert.

De foutmelding is:
- 403 Forbidden
- ModSecurity regel 211760
- Het blokkeert MongoDB operators die Strapi gebruikt (`$and`, `$eq`)

WordPress werkt gewoon prima, dus het probleem zit specifiek bij Strapi.

Kunnen jullie dit oplossen? Ik zie geen ModSecurity instellingen in Plesk, dus ik heb jullie hulp nodig.

Domein: cms.envicon.nl

Wat is de beste oplossing hiervoor?

Bedankt!

[Uw naam]

---

## Professionele Versie (Origineel)

---

**Beste [Naam hosting provider],**

Ik heb een probleem met ModSecurity op onze server die legitieme API-verzoeken van Strapi CMS blokkeert.

**Het probleem:**
- ModSecurity regel 211760 blokkeert API-verzoeken naar `/upload/files` en `/api/*` endpoints
- De regel detecteert MongoDB query operators (`$and`, `$eq`, `$in`, etc.) als SQL injection pogingen
- Dit zijn echter **legitieme** query parameters die Strapi CMS gebruikt voor filtering

**Foutmelding:**
```
ModSecurity: Access denied with code 403
Rule ID: 211760
Pattern: MongoDB SQL injection attempts
URI: /upload/files?filters[$and][0][folderPath][$eq]=/
```

**Waarom dit een probleem is:**
- Strapi CMS gebruikt MongoDB-stijl query operators voor filtering (ook bij MySQL database)
- Deze operators zijn standaard functionaliteit van Strapi, geen security risico
- WordPress werkt prima omdat het deze operators niet gebruikt
- Alleen Strapi heeft deze uitzondering nodig

**Gevraagde oplossing:**
Kunt u alstublieft ModSecurity regel 211760 uitschakelen voor het domein **cms.envicon.nl**?

Dit kan door een van de volgende opties:
1. Regel 211760 uitschakelen voor cms.envicon.nl specifiek
2. Of ModSecurity volledig uitschakelen voor cms.envicon.nl (als optie 1 niet mogelijk is)

**Apache configuratie die nodig is:**
```apache
<IfModule mod_security2.c>
    <VirtualHost *:443>
        ServerName cms.envicon.nl
        SecRuleRemoveById 211760
    </VirtualHost>
</IfModule>
```

**Alternatief (als volledige uitzondering nodig):**
```apache
<IfModule mod_security2.c>
    <VirtualHost *:443>
        ServerName cms.envicon.nl
        SecRuleEngine Off
    </VirtualHost>
</IfModule>
```

Dit heeft geen invloed op andere domeinen of de beveiliging van WordPress sites, omdat WordPress deze MongoDB operators niet gebruikt.

**Domein:** cms.envicon.nl  
**Server:** [Uw server naam/IP indien bekend]  
**Impact:** Upload functionaliteit in Strapi CMS werkt niet

Alvast bedankt voor uw hulp!

Met vriendelijke groet,  
[Uw naam]  
[Uw contactgegevens]

---

## Korte Versie (Snelle E-mail)

**Onderwerp:** ModSecurity blokkeert Strapi CMS - verzoek uitzondering

Beste [Naam],

ModSecurity regel 211760 blokkeert legitieme Strapi CMS API verzoeken op cms.envicon.nl. De regel detecteert MongoDB query operators (`$and`, `$eq`) als SQL injection, maar dit zijn standaard Strapi parameters.

Kunt u regel 211760 uitschakelen voor cms.envicon.nl? Dit heeft geen invloed op andere sites (zoals WordPress) die deze operators niet gebruiken.

Domein: cms.envicon.nl  
Fout: 403 ModSecurity rule 211760

Alvast bedankt!

Groeten,  
[Uw naam]

---

## Nog Korter (1 Regel)

**Onderwerp:** ModSecurity regel 211760 uitschakelen voor cms.envicon.nl

Beste [Naam],

Kunt u ModSecurity regel 211760 uitschakelen voor cms.envicon.nl? Deze blokkeert legitieme Strapi CMS API verzoeken die MongoDB operators gebruiken.

Bedankt!

---

## Belangrijke Punten om te Vermelden

1. ✅ **Legitiem gebruik** - Geen security risico, standaard Strapi functionaliteit
2. ✅ **Geen impact op andere sites** - WordPress gebruikt deze operators niet
3. ✅ **Specifiek domein** - Alleen cms.envicon.nl heeft uitzondering nodig
4. ✅ **Duidelijke regel ID** - Regel 211760 (COMODO WAF)
5. ✅ **Concrete oplossing** - Apache configuratie voorbeelden gegeven

---

## Extra Informatie (Als Ze Vragen)

**Wat is Strapi CMS?**
- Headless CMS systeem (zoals WordPress maar voor API's)
- Gebruikt MongoDB-stijl filtering voor geavanceerde queries
- Veilig en legitiem gebruik van query operators

**Waarom WordPress wel werkt?**
- WordPress gebruikt traditionele SQL queries (`?page=1`)
- Strapi gebruikt moderne API filtering (`?filters[$and][0][$eq]=value`)
- ModSecurity ziet alleen Strapi's operators als verdacht

**Is dit een security risico?**
- Nee, dit zijn standaard Strapi functionaliteiten
- De operators worden gebruikt voor filtering, niet voor injectie
- Alleen het domein cms.envicon.nl heeft deze uitzondering nodig

