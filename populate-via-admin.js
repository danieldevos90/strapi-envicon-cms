#!/usr/bin/env node

const http = require('http');

const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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

async function loginAdmin() {
  console.log('🔐 Logging in as admin...');
  
  try {
    const loginData = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    };

    const result = await makeRequest('/admin/login', 'POST', loginData);
    console.log('✅ Admin login successful');
    return result.data.token;
    
  } catch (error) {
    console.error('❌ Admin login failed:', error.message);
    throw error;
  }
}

async function createHomepage(token) {
  console.log('📝 Creating Homepage via Content Manager...');
  
  try {
    const homepageData = {
      heroTitle: "Specialist in modulair bouwen",
      heroSubtitle: "Tijdelijke bouw, permanente kwaliteit", 
      heroDescription: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
      heroButton1Text: "Meer over modulair bouwen",
      heroButton1Url: "/diensten/modulair-bouwen",
      heroButton2Text: "Vraag een adviesgesprek aan", 
      heroButton2Url: "/adviesgesprek",
      publishedAt: new Date().toISOString()
    };

    const result = await makeRequest('/content-manager/single-types/api::homepage.homepage', 'PUT', homepageData, token);
    console.log('✅ Homepage created successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Failed to create homepage:', error.message);
    throw error;
  }
}

async function createService(token) {
  console.log('📝 Creating Service: Modulair bouwen...');
  
  try {
    const serviceData = {
      slug: "modulair-bouwen",
      title: "Modulair bouwen",
      category: "DIENST",
      description: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules",
      heroTitle: "Wat is modulair bouwen?",
      heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.",
      contentBlocks: [
        {
          title: "Persoonlijk advies over jouw modulair bouwproject",
          content: "Elk bouwproject is anders, dus kijken we samen naar wat er nodig is. Dankzij onze flexibele bouwsystemen leveren we altijd maatwerk: een bouwoplossing die past bij jouw locatie, planning en wensen."
        }
      ],
      advantages: [
        {
          icon: "speed",
          title: "Snel gebouwd, minimale overlast",
          description: "Omdat we de bouwonderdelen grotendeels in de werkplaats voorbereiden, kunnen we op locatie snel en efficiënt werken."
        }
      ],
      metaTitle: "Wat is modulair bouwen? | Envicon",
      metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen.",
      publishedAt: new Date().toISOString()
    };

    const result = await makeRequest('/content-manager/collection-types/api::service.service', 'POST', serviceData, token);
    console.log('✅ Service created successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Failed to create service:', error.message);
    throw error;
  }
}

async function createAboutPage(token) {
  console.log('📝 Creating About Page...');
  
  try {
    const aboutData = {
      heroTitle: "Tijdelijke bouw, permanente kwaliteit",
      heroDescription: "Envicon bouwt sneller en slimmer, zonder in te leveren op kwaliteit. Onze tijdelijke gebouwen zijn net zo comfortabel en gebruiksvriendelijk als permanente huisvesting. We leveren modulaire gebouwen waarin mensen graag werken, leren of sporten én die er ook nog eens goed uitzien.",
      teamTitle: "Het team",
      teamContent: "Envicon is opgericht door Kyle Lambert en Steven Hageman, twee professionals met een hart voor de bouw. Ze zagen dat er tijdens bouwprojecten regelmatig een afstand ontstond tussen opdrachtgever en bouwer, en besloten het anders te doen: persoonlijker, sneller en transparanter.",
      companyTitle: "Modulair bouwer in Nederland",
      companyContent: "Als modulair bouwer werken we door heel Nederland. We ontwikkelen diverse tijdelijke bouwoplossingen: van tijdelijke klaslokalen en flexwoningen tot kantoorruimtes en personeelshuisvesting in de bouw en industrie.",
      certificationsTitle: "Certificeringen & lidmaatschappen",
      certificationsContent: "Op de website plaatsen als de certificaten binnen zijn.",
      ctaTitle: "Op zoek naar een modulair bouwer in Nederland?",
      metaTitle: "Over ons – Envicon – Modulair bouwer",
      metaDescription: "Als modulair bouwer in Nederland ontwikkelen wij tijdelijke huisvestingsoplossingen.",
      publishedAt: new Date().toISOString()
    };

    const result = await makeRequest('/content-manager/single-types/api::about-page.about-page', 'PUT', aboutData, token);
    console.log('✅ About page created successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Failed to create about page:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Content Population via Admin API...\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Create content
    await createHomepage(token);
    console.log('');
    await createAboutPage(token);
    console.log('');
    await createService(token);
    
    console.log('\n🎉 Content population completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Check content in Strapi admin panel');
    console.log('2. Test API endpoints');
    console.log('3. Add more content as needed');
    
  } catch (error) {
    console.error('\n❌ Content population failed:', error.message);
    process.exit(1);
  }
}

main();
