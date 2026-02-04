# Strapi Pages Structure - Single Types & Collection Types

## Overzicht

Dit document beschrijft hoe Strapi pagina's zijn opgebouwd en welke velden/elementen worden gebruikt per **SINGLE TYPES** en **COLLECTION TYPES**.

---

## 📊 STRAPI CONTENT MANAGER OVERZICHT

### COLLECTION TYPES (7)
| Type | Schema Aanwezig | Frontend Gebruikt |
|------|-----------------|-------------------|
| Article | ✅ | ✅ `pages/artikel/[slug].js`, `pages/nieuws.js` |
| Process Step | ✅ | ✅ Homepage (process sectie) |
| Project | ✅ | ✅ `pages/projecten.js`, `pages/projecten/[slug].js` |
| Sector | ✅ | ✅ `pages/sectoren/[slug].js` |
| Service / Dienst | ✅ | ✅ Homepage (services accordions) |
| Solution | ✅ | ✅ `pages/oplossingen/[slug].js` |
| User | ⚙️ Built-in | ⚙️ Strapi Admin (niet voor frontend) |

### SINGLE TYPES (7)
| Type | Schema Aanwezig | Frontend Gebruikt |
|------|-----------------|-------------------|
| About Page | ✅ | ✅ `pages/over-ons.js` |
| Contact Page | ✅ | ✅ `pages/contact.js` |
| Footer | ✅ | ✅ Alle pagina's (Footer component) |
| Forms Configuration | ❓ Plugin/Admin | ❓ Niet gevonden in frontend code |
| Homepage | ✅ | ✅ `pages/index.js` |
| Navigation | ✅ | ✅ Alle pagina's (Navigation component) |
| SEO Settings | ✅ | ✅ `pages/index.js` (SEO component) |

---

## SINGLE TYPES

Single Types zijn unieke content types waarvan er maar één instantie bestaat. Ze worden gebruikt voor globale pagina's zoals homepage, footer, navigation, etc.

### 1. **Homepage** (`homepage`)
**Type:** `singleType`  
**Draft & Publish:** ✅ Ja

**Velden/Componenten:**
- `hero` (component: `sections.hero`) - Hero sectie met titel, subtitel, beschrijving, carousel en buttons
- `intro` (component: `sections.intro`) - Introductie sectie
- `gallery` (component: `sections.gallery`) - Galerij sectie
- `darkTextComponent` (component: `content.dark-text-component`) - Donkere tekst component met afbeelding
- `sectors` (component: `sections.sectors-section`) - Sectoren overzicht sectie
- `services` (component: `sections.services-section`) - Diensten sectie
- `benefits` (component: `sections.benefits-section`) - Voordelen sectie

---

### 2. **Footer** (`footer`)
**Type:** `singleType`  
**Draft & Publish:** ❌ Nee

**Velden/Componenten:**
- `logo` (component: `ui.logo`) - Logo component
- `tagline` (string) - Tagline tekst
- `company` (component: `ui.company-info`) - Bedrijfsinformatie
- `sections` (component: `ui.footer-section`, repeatable: true) - Footer kolommen (meestal 3 kolommen)
- `social` (component: `ui.social-link`, repeatable: true) - Social media links
- `cta` (component: `page.cta-section`) - Standaard CTA voor footer contact sectie

---

### 3. **Navigation** (`navigation`)
**Type:** `singleType`  
**Draft & Publish:** ❌ Nee

**Velden/Componenten:**
- `logo` (component: `ui.logo`) - Logo component
- `menuItems` (component: `ui.menu-item`, repeatable: true) - Menu items

---

### 4. **About Page** (`about-page`)
**Type:** `singleType`  
**Draft & Publish:** ✅ Ja

**Velden/Componenten:**
- `hero` (component: `page.centered-hero`) - Gecentreerde hero sectie
- `ourStory` (component: `page.image-text-right`) - Ons verhaal sectie met afbeelding rechts
- `quote` (component: `page.quote-section`) - Quote sectie
- `team` (component: `page.team-section`) - Team sectie
- `modulairBouwer` (component: `page.image-text-right`) - Modulair bouwer sectie
- `certificates` (component: `page.certificates-section`) - Certificaten sectie
- `cta` (component: `page.cta-section`) - Call-to-action sectie
- `metaTitle` (string, default: "Over Ons - Envicon") - SEO meta titel
- `metaDescription` (text) - SEO meta beschrijving

---

### 5. **Contact Page** (`contact-page`)
**Type:** `singleType`  
**Draft & Publish:** ✅ Ja

**Velden/Componenten:**
- `title` (string, required, default: "Contact") - Pagina titel
- `description` (text, required) - Beschrijving
- `heroTitle` (string, required, default: "Neem contact op") - Hero titel
- `formTitle` (string) - Formulier titel
- `formDescription` (text) - Formulier beschrijving
- `contactBlock` (component: `ui.contact-block`, required) - Contact informatie blok
- `faq` (component: `content.faq-section`) - FAQ sectie
- `map` (json) - Kaart data
- `metaTitle` (string, default: "Neem contact op | Envicon") - SEO meta titel
- `metaDescription` (text) - SEO meta beschrijving

---

## COLLECTION TYPES

Collection Types zijn content types waarvan er meerdere instanties kunnen bestaan. Ze worden gebruikt voor artikelen, projecten, sectoren, etc.

### 1. **Article** (`article`)
**Type:** `collectionType`  
**Draft & Publish:** ✅ Ja

**Velden:**
- `slug` (uid, required, targetField: "title") - URL slug gegenereerd van titel
- `title` (string, required) - Artikel titel
- `excerpt` (text, required) - Korte samenvatting
- `author` (string, default: "Envicon") - Auteur
- `featuredImage` (media, single image) - Hoofdafbeelding
- `category` (string, default: "Projecten") - Categorie
- `content` (richtext, required) - Hoofdinhoud (rich text)
- `vimeoUrl` (string) - Vimeo video URL
- `youtubeUrl` (string) - YouTube video URL
- `imageGallery` (media, multiple images) - Afbeeldingen galerij

---

### 2. **Sector** (`sector`)
**Type:** `collectionType`  
**Draft & Publish:** ✅ Ja

**Velden:**
- `slug` (uid, required, targetField: "title") - URL slug
- `title` (string, required) - Sector titel
- `category` (string, default: "SECTOR") - Categorie
- `description` (text, required) - Beschrijving
- `image` (media, single image) - Sector afbeelding
- `order` (integer, default: 0) - Sorteer volgorde
- `contentLabel` (string) - Content label
- `contentTitle` (string) - Content titel
- `contentSubtitle` (text) - Content subtitel
- `textBlocks` (component: `content.text-block`, repeatable: true) - Tekst blokken
- `solutionsLabel` (string) - Oplossingen label
- `solutionsTitle` (string) - Oplossingen titel
- `solutionsDescription` (text) - Oplossingen beschrijving
- `solutionsBlockNumber` (integer) - Aantal oplossingen blokken
- `solutions` (relation: manyToMany → `api::solution.solution`) - Gerelateerde oplossingen
- `sectorContent` (component: `sector.content-section`) - Sector content sectie
- `sectorFeatures` (component: `sector.features-section`) - Sector features sectie
- `sectorAccordions` (component: `sector.accordions-section`) - Sector accordeons sectie
- `cta` (component: `page.cta-section`) - Call-to-action sectie

---

### 3. **Project** (`project`)
**Type:** `collectionType`  
**Draft & Publish:** ✅ Ja

**Velden:**
- `slug` (uid, required, targetField: "title") - URL slug
- `title` (string, required) - Project titel
- `description` (text, required) - Beschrijving
- `image` (media, single image) - Hoofdafbeelding
- `client` (string) - Klant naam
- `location` (string) - Locatie
- `year` (string) - Jaar
- `sector` (string) - Sector
- `content` (richtext) - Project inhoud
- `gallery` (media, multiple images) - Project galerij
- `featured` (boolean, default: false) - Uitgelicht project
- `order` (integer, default: 0) - Sorteer volgorde

---

### 4. **Service** (`service`)
**Type:** `collectionType`  
**Draft & Publish:** ✅ Ja

**Velden:**
- `title` (string, required) - Service titel
- `description` (text, required) - Beschrijving
- `order` (integer, default: 0) - Sorteer volgorde
- `cta` (component: `page.cta-section`) - Call-to-action sectie

---

### 5. **Solution** (`solution`)
**Type:** `collectionType`  
**Draft & Publish:** ✅ Ja

**Velden:**
- `slug` (uid, required, targetField: "title") - URL slug
- `title` (string, required) - Oplossing titel
- `description` (text, required) - Beschrijving
- `image` (media, single image) - Hoofdafbeelding
- `icon` (media, single image) - Icoon
- `order` (integer, default: 0) - Sorteer volgorde
- `content` (richtext) - Hoofdinhoud
- `metaTitle` (string) - SEO meta titel
- `metaDescription` (text) - SEO meta beschrijving
- `intro` (component: `solution.intro`) - Introductie sectie
- `personalSection` (component: `solution.personal-section`) - Persoonlijke sectie
- `sustainableSection` (component: `solution.sustainable-section`) - Duurzaamheid sectie
- `solutionFeatures` (component: `solution.solution-features`) - Features sectie
- `solutionActivities` (component: `solution.solution-activities`) - Activiteiten sectie
- `safetySection` (component: `solution.safety-section`) - Veiligheid sectie
- `accordionSection` (component: `solution.accordion-section`) - Accordion sectie
- `cta` (component: `page.cta-section`) - Call-to-action sectie

---

## Component Categorieën

### **Sections Components** (`sections.*`)
Gebruikt voor grote pagina secties:
- `sections.hero` - Hero sectie met carousel en buttons
- `sections.intro` - Introductie sectie
- `sections.gallery` - Galerij sectie
- `sections.sectors-section` - Sectoren overzicht
- `sections.services-section` - Diensten overzicht
- `sections.benefits-section` - Voordelen sectie
- `sections.articles-section` - Artikelen overzicht
- `sections.solutions-section` - Oplossingen overzicht
- `sections.process-section` - Proces sectie
- `sections.contact` - Contact sectie
- `sections.about` - Over sectie

### **Page Components** (`page.*`)
Gebruikt voor specifieke pagina componenten:
- `page.centered-hero` - Gecentreerde hero
- `page.image-text-right` - Afbeelding-tekst sectie (afbeelding rechts)
- `page.quote-section` - Quote sectie
- `page.team-section` - Team sectie
- `page.certificates-section` - Certificaten sectie
- `page.cta-section` - Call-to-action sectie
- `page.team-member` - Team lid component
- `page.certificate` - Certificaat component

### **Content Components** (`content.*`)
Gebruikt voor content blokken:
- `content.dark-text-component` - Donkere tekst component met afbeelding
- `content.text-block` - Tekst blok
- `content.simple-text` - Eenvoudige tekst
- `content.faq-section` - FAQ sectie
- `content.faq-entry` - FAQ item
- `content.icon-feature` - Icoon feature
- `content.accordion-item` - Accordion item

### **Sector Components** (`sector.*`)
Specifiek voor sector pagina's:
- `sector.content-section` - Content sectie met features
- `sector.features-section` - Features sectie
- `sector.accordions-section` - Accordions sectie

### **Solution Components** (`solution.*`)
Specifiek voor solution pagina's:
- `solution.intro` - Introductie
- `solution.personal-section` - Persoonlijke sectie
- `solution.sustainable-section` - Duurzaamheid sectie
- `solution.solution-features` - Features
- `solution.solution-activities` - Activiteiten
- `solution.safety-section` - Veiligheid sectie
- `solution.accordion-section` - Accordion sectie
- `solution.solution-feature` - Feature item
- `solution.solution-activity` - Activiteit item
- `solution.accordion-entry` - Accordion item
- `solution.safety-entry` - Veiligheid item

### **UI Components** (`ui.*`)
Herbruikbare UI componenten:
- `ui.logo` - Logo component
- `ui.button` - Button component
- `ui.menu-item` - Menu item
- `ui.submenu-item` - Submenu item
- `ui.footer-section` - Footer sectie
- `ui.social-link` - Social media link
- `ui.contact-block` - Contact blok
- `ui.contact-method` - Contact methode
- `ui.company-info` - Bedrijfsinformatie
- `ui.feature` - Feature component

---

## Belangrijke Velden Types

### **Basis Types:**
- `string` - Tekst veld (kort)
- `text` - Tekst veld (lang, meerdere regels)
- `richtext` - Rich text editor (HTML formatting)
- `integer` - Geheel getal
- `boolean` - True/false
- `json` - JSON data
- `uid` - Unique identifier (vaak gegenereerd van ander veld)

### **Media Types:**
- `media` - Media upload (afbeeldingen, video's)
  - `multiple: false` - Enkele afbeelding
  - `multiple: true` - Meerdere afbeeldingen
  - `allowedTypes: ["images"]` - Alleen afbeeldingen
  - `allowedTypes: ["videos"]` - Alleen video's
  - `allowedTypes: ["images", "videos"]` - Beide

### **Relation Types:**
- `relation` - Relatie naar andere content type
  - `manyToMany` - Veel-op-veel relatie
  - `manyToOne` - Veel-op-één relatie
  - `oneToMany` - Één-op-veel relatie
  - `oneToOne` - Één-op-één relatie

### **Component Types:**
- `component` - Herbruikbare component
  - `repeatable: false` - Enkele component
  - `repeatable: true` - Herhaalbare component (lijst)
  - `min` / `max` - Minimum/maximum aantal

---

## Pagina Opbouw Patroon

### **Single Type Pagina's:**
1. **Hero sectie** - Meestal eerste component
2. **Content secties** - Verschillende componenten voor verschillende secties
3. **CTA sectie** - Meestal laatste component voor call-to-action

### **Collection Type Pagina's:**
1. **Basis velden** - Titel, beschrijving, slug, afbeelding
2. **Metadata** - SEO velden (metaTitle, metaDescription)
3. **Content componenten** - Verschillende secties met componenten
4. **Relaties** - Links naar andere content types
5. **CTA** - Call-to-action component

---

## Draft & Publish

- **Single Types met Draft & Publish:** Homepage, About Page, Contact Page
- **Single Types zonder Draft & Publish:** Footer, Navigation
- **Alle Collection Types hebben Draft & Publish:** ✅ Ja

Dit betekent dat je wijzigingen kunt maken zonder ze direct live te zetten voor types met Draft & Publish enabled.

---

## 🔍 FRONTEND AUDIT - Velden Gebruik

### SINGLE TYPES - Velden Gebruik

#### Homepage
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `hero` | ✅ | ✅ `Hero` component | ✅ GEBRUIKT |
| `intro` | ✅ | ✅ `IntroSection` component | ✅ GEBRUIKT |
| `gallery` | ✅ | ✅ `ImageGallery` component | ✅ GEBRUIKT |
| `darkTextComponent` | ✅ | ✅ `DarkTextComponent` component | ✅ GEBRUIKT |
| `sectors` | ✅ | ✅ `Solutions` component (sectors carousel) | ✅ GEBRUIKT |
| `services` | ✅ | ✅ `Services` component (accordions) | ✅ GEBRUIKT |
| `benefits` | ✅ | ✅ `BenefitsEnvicon` component | ✅ GEBRUIKT |

**Status: ✅ Alle velden worden gebruikt**

---

#### Footer
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `logo` | ✅ | ✅ Footer logo | ✅ GEBRUIKT |
| `tagline` | ✅ | ✅ Footer tagline | ✅ GEBRUIKT |
| `company` | ✅ | ✅ Company info | ✅ GEBRUIKT |
| `sections` | ✅ | ✅ Footer columns | ✅ GEBRUIKT |
| `social` | ✅ | ✅ Social links | ✅ GEBRUIKT |
| `cta` | ✅ | ✅ Default CTA | ✅ GEBRUIKT |

**Status: ✅ Alle velden worden gebruikt**

---

#### Navigation
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `logo` | ✅ | ✅ Navigation logo | ✅ GEBRUIKT |
| `menuItems` | ✅ | ✅ Menu items met submenus | ✅ GEBRUIKT |

**Status: ✅ Alle velden worden gebruikt**

---

#### About Page
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `hero` | ✅ | ✅ `AboutHero` component | ✅ GEBRUIKT |
| `ourStory` | ✅ | ✅ `AboutOurStory` component | ✅ GEBRUIKT |
| `quote` | ✅ | ✅ `AboutQuote` component | ✅ GEBRUIKT |
| `team` | ✅ | ✅ `AboutTeam` component | ✅ GEBRUIKT |
| `modulairBouwer` | ✅ | ✅ `AboutModulairBouwer` component | ✅ GEBRUIKT |
| `certificates` | ✅ | ✅ `AboutCertificates` component | ✅ GEBRUIKT |
| `cta` | ✅ | ✅ Footer CTA override | ✅ GEBRUIKT |
| `metaTitle` | ✅ | ⚠️ Niet expliciet gebruikt (hardcoded in Head) | ⚠️ NIET GEBRUIKT |
| `metaDescription` | ✅ | ⚠️ Niet expliciet gebruikt (hardcoded in Head) | ⚠️ NIET GEBRUIKT |

**Status: ⚠️ metaTitle/metaDescription worden niet dynamisch geladen**

---

#### Contact Page
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `title` | ✅ | ✅ SEO title | ✅ GEBRUIKT |
| `description` | ✅ | ✅ SEO description + form description | ✅ GEBRUIKT |
| `heroTitle` | ✅ | ✅ Hero title | ✅ GEBRUIKT |
| `formTitle` | ✅ | ⚠️ Niet zichtbaar in ContactForm code | ⚠️ CHECK |
| `formDescription` | ✅ | ⚠️ Niet zichtbaar in ContactForm code | ⚠️ CHECK |
| `contactBlock` | ✅ | ✅ `ContactInfo` component | ✅ GEBRUIKT |
| `faq` | ✅ | ✅ `AccordionGroup` component | ✅ GEBRUIKT |
| `map` | ✅ | ✅ Doorgegeven aan ContactInfo | ✅ GEBRUIKT |
| `metaTitle` | ✅ | ⚠️ Niet expliciet gebruikt | ⚠️ NIET GEBRUIKT |
| `metaDescription` | ✅ | ⚠️ Niet expliciet gebruikt | ⚠️ NIET GEBRUIKT |

**Status: ⚠️ Sommige meta velden en form velden mogelijk niet gebruikt**

---

#### SEO Settings (envicon-seo-config)
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `title` | ✅ | ✅ SEO component | ✅ GEBRUIKT |
| `description` | ✅ | ✅ SEO component | ✅ GEBRUIKT |
| `keywords` | ✅ | ✅ SEO component | ✅ GEBRUIKT |
| `canonicalUrl` | ✅ | ✅ SEO component | ✅ GEBRUIKT |
| `pageTitle` | ✅ | ✅ SEO component | ✅ GEBRUIKT |
| `pageDescription` | ✅ | ✅ SEO component | ✅ GEBRUIKT |

**Status: ✅ Alle velden worden gebruikt**

---

### COLLECTION TYPES - Velden Gebruik

#### Article
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `slug` | ✅ | ✅ URL routing | ✅ GEBRUIKT |
| `title` | ✅ | ✅ Artikel titel | ✅ GEBRUIKT |
| `excerpt` | ✅ | ✅ Overzicht cards | ✅ GEBRUIKT |
| `author` | ✅ | ✅ Artikel pagina | ✅ GEBRUIKT |
| `featuredImage` | ✅ | ✅ Artikel cards + hero | ✅ GEBRUIKT |
| `category` | ✅ | ✅ Filtering | ✅ GEBRUIKT |
| `content` | ✅ | ✅ Artikel body | ✅ GEBRUIKT |
| `vimeoUrl` | ✅ | ✅ Video embedding | ✅ GEBRUIKT |
| `youtubeUrl` | ✅ | ✅ Video embedding | ✅ GEBRUIKT |
| `imageGallery` | ✅ | ✅ Artikel galerij | ✅ GEBRUIKT |

**Status: ✅ Alle velden worden gebruikt**

---

#### Sector
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `slug` | ✅ | ✅ URL routing | ✅ GEBRUIKT |
| `title` | ✅ | ✅ Sector titel | ✅ GEBRUIKT |
| `category` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `description` | ✅ | ✅ SectorIntro | ✅ GEBRUIKT |
| `image` | ✅ | ✅ SubpageHero background | ✅ GEBRUIKT |
| `order` | ✅ | ✅ Sorteer volgorde | ✅ GEBRUIKT |
| `contentLabel` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `contentTitle` | ✅ | ✅ SectorIntro title fallback | ✅ GEBRUIKT |
| `contentSubtitle` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `textBlocks` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `solutionsLabel` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `solutionsTitle` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `solutionsDescription` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `solutionsBlockNumber` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `solutions` | ✅ | ⚠️ Niet zichtbaar in frontend | ⚠️ NIET GEBRUIKT |
| `sectorContent` | ✅ | ✅ SectorContent component | ✅ GEBRUIKT |
| `sectorFeatures` | ✅ | ✅ SectorFeatures component | ✅ GEBRUIKT |
| `sectorAccordions` | ✅ | ✅ SectorAccordions component | ✅ GEBRUIKT |
| `cta` | ✅ | ✅ Footer CTA override | ✅ GEBRUIKT |

**Status: ⚠️ Veel legacy velden worden niet gebruikt - overwegen voor cleanup:**
- `category` - niet nodig
- `contentLabel`, `contentSubtitle` - vervangen door sectorContent component
- `textBlocks` - vervangen door sectorContent component  
- `solutionsLabel`, `solutionsTitle`, `solutionsDescription`, `solutionsBlockNumber`, `solutions` - NIET GEBRUIKT, mogelijke legacy velden

---

#### Project
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `slug` | ✅ | ✅ URL routing | ✅ GEBRUIKT |
| `title` | ✅ | ✅ Project titel | ✅ GEBRUIKT |
| `description` | ✅ | ✅ Project beschrijving | ✅ GEBRUIKT |
| `image` | ✅ | ✅ Project afbeelding | ✅ GEBRUIKT |
| `client` | ✅ | ✅ Klant info | ✅ GEBRUIKT |
| `location` | ✅ | ✅ Locatie info | ✅ GEBRUIKT |
| `year` | ✅ | ✅ Jaar info | ✅ GEBRUIKT |
| `sector` | ✅ | ✅ Sector filtering | ✅ GEBRUIKT |
| `content` | ✅ | ✅ Project body | ✅ GEBRUIKT |
| `gallery` | ✅ | ✅ Project galerij | ✅ GEBRUIKT |
| `featured` | ✅ | ✅ Featured filtering | ✅ GEBRUIKT |
| `order` | ✅ | ✅ Sorteer volgorde | ✅ GEBRUIKT |

**Status: ✅ Alle velden worden gebruikt**

---

#### Service
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `title` | ✅ | ✅ Accordion title | ✅ GEBRUIKT |
| `description` | ✅ | ✅ Accordion content | ✅ GEBRUIKT |
| `order` | ✅ | ✅ Sorteer volgorde | ✅ GEBRUIKT |
| `cta` | ✅ | ⚠️ Niet zichtbaar in Services component | ⚠️ NIET GEBRUIKT |

**Status: ⚠️ CTA veld per service wordt niet gebruikt (alleen footer CTA)**

---

#### Solution
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `slug` | ✅ | ✅ URL routing | ✅ GEBRUIKT |
| `title` | ✅ | ✅ Solution titel | ✅ GEBRUIKT |
| `description` | ✅ | ✅ Fallback meta description | ✅ GEBRUIKT |
| `image` | ✅ | ✅ SubpageHero background | ✅ GEBRUIKT |
| `icon` | ✅ | ⚠️ Niet zichtbaar in solution page | ⚠️ NIET GEBRUIKT |
| `order` | ✅ | ✅ Sorteer volgorde | ✅ GEBRUIKT |
| `content` | ✅ | ⚠️ Niet zichtbaar in solution page | ⚠️ NIET GEBRUIKT |
| `metaTitle` | ✅ | ✅ Page title | ✅ GEBRUIKT |
| `metaDescription` | ✅ | ✅ Meta description | ✅ GEBRUIKT |
| `intro` | ✅ | ✅ SolutionIntro component | ✅ GEBRUIKT |
| `personalSection` | ✅ | ✅ ImageTextSectionRight component | ✅ GEBRUIKT |
| `sustainableSection` | ✅ | ✅ ImageTextSection component | ✅ GEBRUIKT |
| `solutionFeatures` | ✅ | ✅ SolutionFeatures component | ✅ GEBRUIKT |
| `solutionActivities` | ✅ | ✅ SolutionActivities component | ✅ GEBRUIKT |
| `safetySection` | ✅ | ✅ SolutionSafety component | ✅ GEBRUIKT |
| `accordionSection` | ✅ | ✅ SolutionAccordion component | ✅ GEBRUIKT |
| `cta` | ✅ | ✅ Footer CTA override | ✅ GEBRUIKT |

**Status: ⚠️ `icon` en `content` velden worden niet gebruikt in solution pagina**

---

#### Process Step
| Veld | Strapi Schema | Frontend Gebruik | Status |
|------|---------------|------------------|--------|
| `number` | ✅ | ✅ Step number | ✅ GEBRUIKT |
| `title` | ✅ | ✅ Step title | ✅ GEBRUIKT |
| `description` | ✅ | ✅ Step description | ✅ GEBRUIKT |

**Status: ✅ Alle velden worden gebruikt**

---

## 📋 SAMENVATTING - Ongebruikte Velden

### Te Verwijderen/Overwegen:

#### Sector (veel legacy velden):
- `category` - niet nodig
- `contentLabel` - niet gebruikt
- `contentSubtitle` - niet gebruikt  
- `textBlocks` - niet gebruikt (vervangen door sectorContent)
- `solutionsLabel` - niet gebruikt
- `solutionsTitle` - niet gebruikt
- `solutionsDescription` - niet gebruikt
- `solutionsBlockNumber` - niet gebruikt
- `solutions` (relatie) - niet gebruikt

#### Solution:
- `icon` - niet gebruikt in solution detail page
- `content` (richtext) - niet gebruikt (vervangen door component secties)

#### Service:
- `cta` - niet gebruikt (services tonen geen individuele CTA's)

#### About Page:
- `metaTitle` - niet dynamisch geladen (hardcoded)
- `metaDescription` - niet dynamisch geladen (hardcoded)

#### Contact Page:
- `formTitle` - mogelijk niet gebruikt
- `formDescription` - mogelijk niet gebruikt
- `metaTitle` - niet dynamisch geladen
- `metaDescription` - niet dynamisch geladen

---

## ❓ Onbekende Types

### Forms Configuration
Dit type verschijnt in de Strapi admin maar heeft geen schema in `src/api/`. 
Mogelijk:
- Een plugin configuratie
- Aangemaakt via Strapi Admin UI
- Onderdeel van een form builder plugin

**Actie:** Onderzoeken wat dit type doet en of het nodig is.






