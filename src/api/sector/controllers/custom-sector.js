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
        // Add other sectors here...
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
