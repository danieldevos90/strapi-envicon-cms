# Manual Population Guide for Sectors

## Option 1: Manual via Strapi Admin (Recommended if API doesn't work)

### Steps:

1. **Go to Strapi Admin**: https://cms.envicon.nl/admin
2. **Navigate to**: Content Manager → Sectors
3. **For each sector** (Onderwijs, Wonen, Bouw & Industrie, Sport):

#### For SectorFeatures:
1. Click on the sector
2. Scroll to "Sector Features" section
3. Click "Add an entry" for Features
4. Add each feature with:
   - **Icon**: Select from dropdown (check, settings, volume2, building, etc.)
   - **Title**: Enter the title
   - **Description**: Enter the description

#### For SectorAccordions:
1. Scroll to "Sector Accordions" section
2. Click "Add an entry" for Accordions
3. Add each accordion with:
   - **Title**: Enter the title
   - **Content**: Enter the content

### Data to Add:

#### Onderwijs Sector:

**SectorFeatures:**
1. Icon: settings | Title: Flexibel inzetbaar | Description: Onze modulaire gebouwen zijn flexibel inzetbaar: als uitbreiding van een permanent schoolgebouw of dependance.
2. Icon: check | Title: Comfortabel in elk seizoen | Description: Dankzij slimme klimaatbeheersing is de ruimte comfortabel in elk seizoen.
3. Icon: volume2 | Title: Goede akoestiek | Description: Goede akoestiek zorgt voor rust in de klas en een fijne leeromgeving.
4. Icon: building | Title: Meer dan alleen het gebouw | Description: We denken verder dan het gebouw, zoals een extra fietsenhok of speeltuin.

**SectorAccordions:**
1. Title: Noodlokaal | Content: Tijdelijke klaslokalen die snel geplaatst kunnen worden bij acute ruimtenood.
2. Title: Gymzaal | Content: Modulaire sportfaciliteiten voor lichamelijke opvoeding en schoolsport.
3. Title: Kantine | Content: Eetruimtes en keukenfaciliteiten voor schoolmaaltijden en pauzes.
4. Title: Kinderopvang | Content: Veilige en kindvriendelijke ruimtes voor voor- en naschoolse opvang.

#### Wonen Sector:

**SectorFeatures:**
1. Icon: check | Title: Duurzame keuze | Description: Een duurzame keuze: onze woningen zijn herbruikbaar en energiezuinig.
2. Icon: settings | Title: Alles geregeld | Description: We regelen alles: van vergunning tot oplevering.
3. Icon: check | Title: Comfortabel in elk seizoen | Description: Dankzij slimme klimaatbeheersing is de woning comfortabel in elk seizoen.
4. Icon: building | Title: Meedenken | Description: We denken met je mee over de verdere inrichting van het terrein, zoals parkeerplaatsen en groenvoorziening.

#### Bouw & Industrie Sector:

**SectorFeatures:**
1. Icon: check | Title: Snel opgebouwd | Description: Snel opgebouwd en direct gebruiksklaar.
2. Icon: settings | Title: Flexibel | Description: Flexibel aan te passen of te verplaatsen naar een nieuwe bouwlocatie.
3. Icon: check | Title: Duurzaam | Description: Duurzame keuze dankzij herbruikbare bouwsystemen.
4. Icon: building | Title: Alles geregeld | Description: Alles van A tot Z geregeld.

#### Sport Sector:

**SectorFeatures:**
1. Icon: check | Title: Vaste partner | Description: Eén vaste partner die met je meedenkt en eerlijk advies geeft.
2. Icon: building | Title: Representatieve uitstraling | Description: De representatieve uitstraling van een permanente sporthal.
3. Icon: settings | Title: Flexibel gebruik | Description: Te gebruiken van enkele maanden tot meerdere jaren.
4. Icon: check | Title: Comfortabel sporten | Description: Comfortabel sporten dankzij goede isolatie en optimale akoestiek.

---

## Option 2: Use the REST API Script (Current)

The `populate-all-sectors.js` script will update base content. Features/accordions may need manual addition.

Run: `npm run populate:all` (after rebuilding Strapi)

---

## Option 3: Wait for Custom Endpoint

After rebuilding Strapi with the merged route, the custom endpoint should work:

1. Rebuild: `npm run build`
2. Restart Strapi
3. Run: `npm run populate:all`

The custom endpoint uses Entity Service API which properly handles nested components.
