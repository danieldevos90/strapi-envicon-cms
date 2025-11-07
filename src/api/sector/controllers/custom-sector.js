'use strict';

/**
 * Sector controller - Custom populate endpoint
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::sector.sector', ({ strapi }) => ({
  async populateAll(ctx) {
    try {
      const sectorsData = {
        onderwijs: {
          intro: {
            title: "Tijdelijke onderwijshuisvesting",
            description: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig. We bouwen tijdelijke klaslokalen, kantines, gymzalen en complete schoolgebouwen voor kindcentra, basisscholen, middelbare scholen en universiteiten. Onze modulaire units en demontabele bouwsystemen zijn veilig en voelen aan als een permanent schoolgebouw: een plek waar leerlingen prettig kunnen leren."
          },
          sectorContent: {
            title: "Snel een oplossing voor jouw schoolgebouw",
            description: "Als school wil je dat de lessen gewoon door kunnen blijven gaan. Daarom bouwen we snel en met zo min mogelijk overlast. Onze modulaire units en demontabele bouwsystemen zijn eenvoudig aan te passen als het aantal leerlingen verandert. We leveren ze gebruiksklaar op met verlichting, sanitair en garderobes.",
            additionalText: "De tijdelijke gebouwen kunnen wij realiseren volgens het Programma van Eisen Frisse Scholen (klasse B of C). Daarmee creëren we een gezonde, veilige en energiezuinige leeromgeving met:",
            features: [
              { text: "Gebalanceerde ventilatie met CO₂-sturing" },
              { text: "Veel daglicht en goed akoestisch comfort" },
              { text: "Energiezuinige installaties" },
              { text: "Een aangenaam binnenklimaat" }
            ],
            imageAlt: "Modulaire schoolgebouw unit"
          },
          sectorFeatures: {
            title: "De voordelen van onderwijshuisvesting door Envicon",
            features: [
              {
                icon: "settings",
                title: "Flexibel inzetbaar",
                description: "Onze modulaire gebouwen zijn flexibel inzetbaar: als uitbreiding van een permanent schoolgebouw of dependance."
              },
              {
                icon: "check",
                title: "Comfortabel in elk seizoen",
                description: "Dankzij slimme klimaatbeheersing is de ruimte comfortabel in elk seizoen."
              },
              {
                icon: "volume2",
                title: "Goede akoestiek",
                description: "Goede akoestiek zorgt voor rust in de klas en een fijne leeromgeving."
              },
              {
                icon: "building",
                title: "Meer dan alleen het gebouw",
                description: "We denken verder dan het gebouw, zoals een extra fietsenhok of speeltuin."
              }
            ]
          },
          sectorAccordions: {
            title: "Onze modulaire oplossingen voor het onderwijs",
            description: "We bieden diverse oplossingen voor tijdelijke onderwijshuisvesting. Van een paar extra noodlokalen tot uitbreiding van een campus, met onze jarenlange ervaring weten we precies wat er nodig is om snel en soepel te bouwen.",
            accordions: [
              {
                title: "Noodlokaal",
                content: "Tijdelijke klaslokalen die snel geplaatst kunnen worden bij acute ruimtenood."
              },
              {
                title: "Gymzaal",
                content: "Modulaire sportfaciliteiten voor lichamelijke opvoeding en schoolsport."
              },
              {
                title: "Kantine",
                content: "Eetruimtes en keukenfaciliteiten voor schoolmaaltijden en pauzes."
              },
              {
                title: "Kinderopvang",
                content: "Veilige en kindvriendelijke ruimtes voor voor- en naschoolse opvang."
              }
            ],
            imageAlt: "Modulaire gymzaal voor onderwijs"
          }
        },
        wonen: {
          intro: {
            title: "Tijdelijke woningen laten bouwen",
            description: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten. Je wilt vooral een snelle en praktische oplossing. Met onze modulaire units en demontabele bouwsystemen is dat mogelijk.\n\nWe realiseren tijdelijke woonunits en complete wooncomplexen die veilig en energiezuinig zijn. Onze modulaire gebouwen voelen aan als een echte woning, een plek waar mensen zich thuis voelen, ook al is het tijdelijk."
          },
          sectorContent: {
            title: "Snel een oplossing voor jouw huisvestingsvraag",
            description: "Als gemeente, woningcorporatie of bedrijf wil je dat mensen snel een fijne woonplek krijgen. Envicon realiseert modulaire woningen die in korte tijd op locatie worden opgebouwd. Ze bieden hetzelfde comfort als permanente huisvesting en kunnen later eenvoudig worden gedemonteerd. Deze materialen worden hergebruikt.",
            additionalText: "We bouwen met zo min mogelijk overlast en leveren de woningen gebruiksklaar op, compleet met keuken, sanitair en alle aansluitingen.",
            features: [],
            imageAlt: "Modulaire woning unit"
          },
          sectorFeatures: {
            title: "De voordelen van tijdelijke huisvesting door Envicon",
            features: [
              {
                icon: "check",
                title: "Duurzame keuze",
                description: "Een duurzame keuze: onze woningen zijn herbruikbaar en energiezuinig."
              },
              {
                icon: "settings",
                title: "Alles geregeld",
                description: "We regelen alles: van vergunning tot oplevering."
              },
              {
                icon: "check",
                title: "Comfortabel in elk seizoen",
                description: "Dankzij slimme klimaatbeheersing is de woning comfortabel in elk seizoen."
              },
              {
                icon: "building",
                title: "Meedenken",
                description: "We denken met je mee over de verdere inrichting van het terrein, zoals parkeerplaatsen en groenvoorziening."
              }
            ]
          },
          sectorAccordions: {
            title: "Onze modulaire oplossingen voor tijdelijke huisvesting",
            description: "Of het nu gaat om tijdelijke huisvesting voor arbeidsmigranten, personeel dat dicht bij de werklocatie moet wonen of containerwoningen voor studenten, wij regelen dat er snel goede woonruimte is.",
            accordions: [],
            imageAlt: "Modulaire woning"
          }
        },
        "bouw-industrie": {
          intro: {
            title: "Tijdelijke huisvesting voor bouw en industrie",
            description: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie. Dan wil je snel kunnen schakelen.\n\nEnvicon biedt modulaire units en demontabele bouwsystemen die in korte tijd op locatie worden opgebouwd. We bouwen tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen. Ook voor tijdelijke personeelshuisvesting en tijdelijke kantooruitbreiding bieden we praktische oplossingen."
          },
          sectorContent: {
            title: "Modulaire units voor tijdelijke huisvesting",
            description: "Onze modulaire units en demontabele bouwsystemen voldoen aan alle veiligheidseisen en worden gebruiksklaar opgeleverd, zodat jouw team direct aan de slag kan. We nemen alles uit handen: van vergunningen tot oplevering. Zo weet je zeker dat alles goed geregeld is.",
            additionalText: "",
            features: [],
            imageAlt: "Modulaire bouw unit"
          },
          sectorFeatures: {
            title: "De voordelen van tijdelijke huisvesting door Envicon",
            features: [
              {
                icon: "check",
                title: "Snel opgebouwd",
                description: "Snel opgebouwd en direct gebruiksklaar."
              },
              {
                icon: "settings",
                title: "Flexibel",
                description: "Flexibel aan te passen of te verplaatsen naar een nieuwe bouwlocatie."
              },
              {
                icon: "check",
                title: "Duurzaam",
                description: "Duurzame keuze dankzij herbruikbare bouwsystemen."
              },
              {
                icon: "building",
                title: "Alles geregeld",
                description: "Alles van A tot Z geregeld."
              }
            ]
          },
          sectorAccordions: {
            title: "Onze modulaire oplossingen voor bouw en industrie",
            description: "Bij ons vind je huisvestingsoplossingen voor allerlei toepassingen binnen de bouw en industrie. Onze modulaire units zijn makkelijk te demonteren en te verplaatsen, zodat je snel kunt inspelen op veranderingen op jouw bouw- of industrieterrein.",
            accordions: [],
            imageAlt: "Modulaire bouw unit"
          }
        },
        sport: {
          intro: {
            title: "Tijdelijke sporthal laten bouwen",
            description: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal, Envicon zorgt dat mensen kunnen blijven sporten. Zelfs een overkapping van een buitenbaan regelen we zo.\n\nMet onze modulaire units en demontabele bouwsystemen bouwen we tijdelijke sportvoorzieningen die net zo comfortabel zijn als vaste gebouwen. We richten de tijdelijke sporthal volledig in met kleedruimtes, douches, behandelruimtes, tribune, kantine en kantoorvoorzieningen. Volledig afgestemd op jouw wensen en gebruik."
          },
          sectorContent: {
            title: "Modulaire sporthal als tijdelijke oplossing",
            description: "Envicon bouwt tijdelijke sportvoorzieningen door heel Nederland. We begeleiden het project van A tot Z. Daarbij denken we mee over een praktische indeling en zorgen we dat elke ruimte voldoet aan alle veiligheidseisen. We letten op een goede akoestiek, leggen veilige sportvloeren en kunnen de hal volledig voorzien van sporttoestellen.",
            additionalText: "Onze demontabele sporthallen zijn flexibel aan te passen én weer snel te demonteren. Dankzij goede isolatie en klimaatbeheersing zijn ze energiezuinig én fijn om in te sporten.",
            features: [],
            imageAlt: "Modulaire sporthal"
          },
          sectorFeatures: {
            title: "De voordelen van een tijdelijke sporthal door Envicon",
            features: [
              {
                icon: "check",
                title: "Vaste partner",
                description: "Eén vaste partner die met je meedenkt en eerlijk advies geeft."
              },
              {
                icon: "building",
                title: "Representatieve uitstraling",
                description: "De representatieve uitstraling van een permanente sporthal."
              },
              {
                icon: "settings",
                title: "Flexibel gebruik",
                description: "Te gebruiken van enkele maanden tot meerdere jaren."
              },
              {
                icon: "check",
                title: "Comfortabel sporten",
                description: "Comfortabel sporten dankzij goede isolatie en optimale akoestiek."
              }
            ]
          },
          sectorAccordions: {
            title: "Onze modulaire oplossingen voor tijdelijke sportvoorzieningen",
            description: "Met onze modulaire gebouwen ontwikkelen we in korte tijd een flexibele oplossing voor jouw sportlocatie. Van een extra kleedruimte naast het voetbalveld tot een compleet sportcomplex met verschillende faciliteiten.",
            accordions: [],
            imageAlt: "Modulaire sporthal"
          }
        }
      };

      const results = [];

      for (const [slug, data] of Object.entries(sectorsData)) {
        // Find existing sector
        const sectors = await strapi.entityService.findMany('api::sector.sector', {
          filters: { slug },
        });

        if (!sectors || sectors.length === 0) {
          results.push({ slug, status: 'not_found' });
          continue;
        }

        const sector = sectors[0];
        const descriptionParts = data.intro.description.split('\n\n');
        const firstParagraph = descriptionParts[0];

        // Update using Entity Service API
        await strapi.entityService.update('api::sector.sector', sector.id, {
          data: {
            description: firstParagraph,
            contentTitle: data.intro.title,
            sectorContent: data.sectorContent,
            sectorFeatures: data.sectorFeatures,
            sectorAccordions: data.sectorAccordions,
          },
        });

        results.push({ slug, status: 'updated', id: sector.id });
      }

      ctx.body = {
        success: true,
        message: 'Sectors populated successfully',
        results,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
