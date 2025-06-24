// Exemple de test pour l'API d'envoi de mail
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3120/api/mail';

async function testMailAPI() {
  try {
    console.log('🧪 Test de l\'API d\'envoi de mail...\n');

    // Test 1: Vérifier la santé du service
    console.log('1. Test de santé du service...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Santé:', healthResponse.data);
    console.log('');

    // Test 2: Envoyer un mail simple
    console.log('2. Test d\'envoi de mail simple...');
    const mailData = {
      to: 'test@example.com',
      subject: 'Test du serveur de mail Telsig',
      text: 'Ceci est un test du serveur d\'envoi de mail.',
      html: '<h1>Test du serveur de mail Telsig</h1><p>Ceci est un test du serveur d\'envoi de mail.</p>'
    };

    const sendResponse = await axios.post(`${API_BASE_URL}/send`, mailData);
    console.log('✅ Envoi:', sendResponse.data);
    console.log('');

    // Test 3: Envoyer un mail avec CC et BCC
    console.log('3. Test d\'envoi avec CC et BCC...');
    const mailWithCC = {
      to: 'h.ayinlamouhayad@gmail.com',
      cc: [],
      bcc: [],
      subject: 'Test avec CC et BCC',
      text: 'Mail de test avec copie et copie cachée.',
      html: '<h2>Test avec CC et BCC</h2><p>Mail de test avec copie et copie cachée.</p>'
    };

    const sendCCResponse = await axios.post(`${API_BASE_URL}/send`, mailWithCC);
    console.log('✅ Envoi avec CC/BCC:', sendCCResponse.data);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Exécuter le test
testMailAPI(); 