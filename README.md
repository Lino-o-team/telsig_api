# Serveur d'envoi de mail Telsig

Un serveur d'envoi de mail robuste et sécurisé construit avec TypeScript, Express et Nodemailer.

## 🚀 Fonctionnalités

- ✅ Envoi de mails via SMTP
- ✅ Support des pièces jointes
- ✅ Validation des données avec Joi
- ✅ Rate limiting pour la sécurité
- ✅ CORS configurable
- ✅ Gestion d'erreurs robuste
- ✅ TypeScript pour la sécurité des types
- ✅ Configuration via variables d'environnement
- ✅ Endpoint de contact pour site vitrine

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Un compte email avec accès SMTP (Gmail, Outlook, etc.)

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd telsig_mail
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp env.example .env
   ```
   
   Puis éditez le fichier `.env` avec vos paramètres SMTP :
   ```env
   # Configuration du serveur
   PORT=3000
   NODE_ENV=development
   
   # Configuration SMTP pour l'envoi de mails
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=votre-email@gmail.com
   SMTP_PASS=votre-mot-de-passe-app
   
   # Configuration de sécurité
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Configuration CORS
   CORS_ORIGIN=http://localhost:3000
   ```

## 🔧 Configuration SMTP

### Gmail
Pour utiliser Gmail, vous devez :
1. Activer l'authentification à 2 facteurs
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `SMTP_PASS`

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Autres fournisseurs
Consultez la documentation de votre fournisseur pour les paramètres SMTP.

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## 📡 API Endpoints

### 1. Vérifier la santé du service
```http
GET /api/mail/health
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion SMTP OK"
}
```

### 2. Envoyer un mail
```http
POST /api/mail/send
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "to": "destinataire@example.com",
  "subject": "Sujet du mail",
  "text": "Contenu texte du mail",
  "html": "<h1>Contenu HTML du mail</h1>",
  "cc": ["copie@example.com"],
  "bcc": ["copie-cachee@example.com"],
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content",
      "contentType": "application/pdf"
    }
  ]
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Mail envoyé avec succès",
  "messageId": "<message-id>"
}
```

### 3. Formulaire de contact (pour site vitrine)
```http
POST /api/contact
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+33 1 23 45 67 89",
  "company": "Entreprise Test",
  "subject": "Demande de devis",
  "message": "Bonjour, je souhaite obtenir un devis pour..."
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
}
```

**Validation :**
- `name` : 2-100 caractères (requis)
- `email` : email valide (requis)
- `phone` : format téléphone français (optionnel)
- `company` : 0-100 caractères (optionnel)
- `subject` : 5-200 caractères (requis)
- `message` : 10-2000 caractères (requis)

**Note :** Les mails de contact sont automatiquement envoyés à `info@telsig.com`

## 🔒 Sécurité

- **Rate Limiting** : Limite le nombre de requêtes par IP
- **Helmet** : Headers de sécurité HTTP
- **CORS** : Contrôle d'accès cross-origin
- **Validation** : Validation stricte des données d'entrée
- **Variables d'environnement** : Configuration sécurisée

## 🧪 Tests

```bash
npm test
```

### Tests manuels
```bash
# Test de l'API mail
node examples/test-mail.js

# Test de l'API contact
node examples/test-contact.js
```

## 📁 Structure du projet

```
src/
├── config/
│   └── env.ts              # Configuration des variables d'environnement
├── middleware/
│   ├── validation.ts       # Validation des requêtes mail
│   └── contactValidation.ts # Validation des formulaires de contact
├── routes/
│   ├── mailRoutes.ts       # Routes de l'API mail
│   └── contactRoutes.ts    # Routes de l'API contact
├── services/
│   └── mailService.ts      # Service d'envoi de mail
├── types/
│   ├── mail.ts             # Types pour les mails
│   └── contact.ts          # Types pour les contacts
└── index.ts                # Point d'entrée de l'application
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License

## 🆘 Support

Pour toute question ou problème, ouvrez une issue sur GitHub. 