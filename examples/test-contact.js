// Exemple de test pour l'API de contact
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3120/api';

async function testContactAPI() {
  try {
    console.log('🧪 Test de l\'API de contact...\n');

    // Test 1: Envoi d'un message de contact valide
    console.log('1. Test d\'envoi de message de contact...');
    const contactData = {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '+33 1 23 45 67 89',
      company: 'Entreprise Test',
      subject: 'Demande de devis pour projet web',
      message: 'Bonjour,\n\nJe souhaite obtenir un devis pour la création d\'un site web pour mon entreprise.\n\nNous avons besoin d\'un site vitrine moderne avec les fonctionnalités suivantes :\n- Page d\'accueil\n- À propos\n- Services\n- Contact\n\nPouvez-vous me contacter pour discuter de ce projet ?\n\nCordialement,\nJean Dupont'
    };

    const contactResponse = await axios.post(`${API_BASE_URL}/contact`, contactData);
    console.log('✅ Contact:', contactResponse.data);
    console.log('');

    // Test 2: Test avec données minimales
    console.log('2. Test avec données minimales...');
    const minimalContactData = {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      subject: 'Question générale',
      message: 'Bonjour, j\'ai une question générale concernant vos services. Pouvez-vous me recontacter ?'
    };

    const minimalResponse = await axios.post(`${API_BASE_URL}/contact`, minimalContactData);
    console.log('✅ Contact minimal:', minimalResponse.data);
    console.log('');

    // Test 3: Test de validation (email invalide)
    console.log('3. Test de validation (email invalide)...');
    const invalidData = {
      name: 'Test',
      email: 'email-invalide',
      subject: 'Test',
      message: 'Message de test'
    };

    try {
      await axios.post(`${API_BASE_URL}/contact`, invalidData);
    } catch (error) {
      console.log('✅ Validation échouée comme attendu:', error.response.data);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Exécuter le test
testContactAPI(); 