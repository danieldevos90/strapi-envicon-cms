#!/usr/bin/env node

const http = require('http');

const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`${method} ${path} failed: ${res.statusCode} ${res.statusMessage}\n${body}`));
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function populateHomepage() {
  console.log('📝 Creating Homepage Content...');
  
  try {
    const homepageData = {
      data: {
        heroTitle: "Specialist in modulair bouwen",
        heroSubtitle: "Tijdelijke bouw, permanente kwaliteit",
        heroDescription: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
        heroButton1Text: "Meer over modulair bouwen",
        heroButton1Url: "/diensten/modulair-bouwen",
        heroButton2Text: "Vraag een adviesgesprek aan",
        heroButton2Url: "/adviesgesprek",
        publishedAt: new Date().toISOString()
      }
    };

    const result = await makeRequest('/homepage', 'PUT', homepageData);
    console.log('✅ Homepage created successfully!');
    console.log('Data:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Failed to create homepage:', error.message);
  }
}

async function populateService() {
  console.log('📝 Creating Service: Modulair bouwen...');
  
  try {
    const serviceData = {
      data: {
        slug: "modulair-bouwen",
        title: "Modulair bouwen",
        category: "DIENST",
        description: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules",
        heroTitle: "Wat is modulair bouwen?",
        heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.",
        metaTitle: "Wat is modulair bouwen? | Envicon",
        metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen.",
        publishedAt: new Date().toISOString()
      }
    };

    const result = await makeRequest('/services', 'POST', serviceData);
    console.log('✅ Service created successfully!');
    console.log('Data:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Failed to create service:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Content Population...\n');
  
  await populateHomepage();
  console.log('');
  await populateService();
  
  console.log('\n🎉 Content population completed!');
}

main();
