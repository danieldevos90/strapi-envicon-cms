/**
 * Populate Homepage Content via Strapi API
 * 
 * This script fills the homepage with default content using the Strapi API
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '15e2e2aa60a826d46ae6963e2dc90d5d4d292195fec1dbd8b96a1b73de1de3d60948669ad44f55bca6648b011b6087f9d4bdc7d279b55764c6b1f4ed7ad9d7b5b0f78a4f9fda5fc834885de679224fc499f92ac2f00334b2dfea4c93178a88dfabdf583f78b5996959e990ea461b2cff77df74255dcc611e2025140c3785d716';

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function populateHomepage() {
  console.log('🚀 Populating homepage content...');
  console.log('📡 Strapi URL:', STRAPI_URL);
  console.log('');

  try {
    // Homepage content structure
    const homepageData = {
      data: {
        hero: {
          title: "Snel, duurzaam en zorgeloos bouwen",
          subtitle: "WELKOM BIJ ENVICON",
          description: "Wij helpen je met het realiseren van jouw bouwproject met hoogwaardige modulaire oplossingen.",
          carousel: JSON.stringify([
            "/images/Giessenburg/DJI_20250901152006_0054_VERWAAIJ_MEDIA_.jpg",
            "/images/Giessenburg/Dave Weij-2.jpg",
            "/images/Giessenburg/DJI_20250728160030_0269_VERWAAIJ_MEDIA_.jpg"
          ]),
          videoUrl: "",
          buttons: JSON.stringify({
            primary: {
              text: "Offerte aanvragen",
              href: "/offerte-aanvragen",
              mobileText: "Offerte aanvragen",
              mobileHref: "/offerte-aanvragen",
              showOnMobile: true,
              showOnDesktop: true
            },
            secondary: {
              text: "Plan een adviesgesprek",
              href: "/adviesgesprek",
              mobileText: "Contact",
              mobileHref: "#contact",
              showOnMobile: true,
              showOnDesktop: true
            }
          })
        },
        intro: {
          title: "Tijdelijke bouw, permanente kwaliteit",
          description: "Tijdelijke bouw hoeft niet tijdelijk aan te voelen. Wij ontwikkelen modulaire gebouwen die net zo comfortabel en gebruiksvriendelijk zijn als permanente gebouwen.\n\nWij blijven gedurende het hele bouwproject – en daarna – betrokken. Ontstaat er tijdens het bouwproject een aanvullende vraag? Denk bijvoorbeeld aan de plaatsing van een fietsenstalling naast een tijdelijk klaslokaal. Dan regelen we dat! Heb je vragen over vergunningen of elektra? We geven eerlijk advies en zoeken samen naar de beste oplossing.",
          buttonText: "Meer over ons",
          buttonHref: "/about",
          imageAltTexts: JSON.stringify([
            "Giessenburg project - Afbeelding 1",
            "Giessenburg project - Drone opname 1",
            "Giessenburg project - Drone opname 2"
          ])
        },
        about: {
          subtitle: "OVER ENVICON",
          title: "Waarom kiezen voor Envicon?",
          description: "Bij Envicon staat kwaliteit en snelheid voorop. Wij leveren modulaire bouwoplossingen die niet alleen snel te realiseren zijn, maar ook voldoen aan de hoogste standaarden.",
          features: [
            {
              icon: "check",
              title: "Snelle realisatie",
              description: "Dankzij onze modulaire bouwmethode realiseren wij projecten in een fractie van de tijd."
            },
            {
              icon: "shield",
              title: "Hoogwaardige kwaliteit",
              description: "Alle modules voldoen aan de hoogste kwaliteits- en duurzaamheidsnormen."
            },
            {
              icon: "building",
              title: "Flexibele oplossingen",
              description: "Wij stemmen elk project af op jouw specifieke wensen en de locatie."
            },
            {
              icon: "heart",
              title: "Persoonlijke service",
              description: "Eén vaste partner die met je meedenkt en eerlijk advies geeft."
            }
          ]
        },
        solutions: {
          subtitle: "OPLOSSINGEN",
          title: "Welke oplossing past bij jouw project?",
          description: "Ontdek onze verschillende bouwoplossingen voor elk type project"
        },
        sectors: {
          subtitle: "SECTOREN",
          title: "Ontdek maatwerk voor jouw sector",
          description: "Wij bieden oplossingen voor verschillende sectoren"
        },
        services: {
          subtitle: "DIENSTEN",
          title: "Volledige ontzorging voor jouw bouwproject",
          description: "Met Envicon ben je verzekerd van een hassle-free project. Wij nemen alle stappen voor je uit handen:"
        },
        benefits: {
          title: "De voordelen van modulair bouwen met Envicon",
          subtitle: "",
          benefits: [
            {
              icon: "check",
              title: "Alles geregeld van de eerste schets tot de oplevering.",
              description: ""
            },
            {
              icon: "check",
              title: "Flexibele bouwoplossingen die passen bij jouw wensen en locatie.",
              description: ""
            },
            {
              icon: "check",
              title: "Eén vaste partner die met je meedenkt en eerlijk advies geeft.",
              description: ""
            },
            {
              icon: "check",
              title: "Korte lijnen zodat je geen onnodige vertraging oploopt.",
              description: ""
            }
          ]
        },
        contact: {
          title: "Op zoek naar een specialist in modulair bouwen?",
          subtitle: "CONTACT",
          description: "Neem contact met ons op voor een vrijblijvend adviesgesprek.",
          buttons: JSON.stringify({
            quote: {
              text: "Vraag offerte aan",
              href: "/offerte-aanvragen"
            }
          })
        }
      }
    };

    console.log('📤 Sending homepage data to Strapi...');
    
    // Update homepage
    const response = await api.put('/homepage', homepageData);
    
    console.log('✅ Homepage content created successfully!');
    console.log('📋 Response status:', response.status);
    console.log('');
    console.log('🎉 Done! Check your homepage at:');
    console.log('   https://cms.envicon.nl/admin/content-manager/single-types/api::homepage.homepage');
    console.log('');
    console.log('⚠️  Remember to PUBLISH the homepage in Strapi Admin!');
    
  } catch (error) {
    console.error('❌ Error populating homepage:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.error('');
      console.error('🔑 Authentication failed. Check API token.');
    } else if (error.response?.status === 404) {
      console.error('');
      console.error('❌ Homepage endpoint not found. Is Strapi running?');
    }
    
    process.exit(1);
  }
}

populateHomepage();
