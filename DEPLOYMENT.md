# Guide de déploiement sur O2switch

Ce guide vous explique comment déployer votre serveur de mail Telsig sur O2switch avec CI/CD GitHub Actions.

## 📋 Prérequis

- Un compte O2switch avec accès SSH
- Un repository GitHub
- Node.js installé sur votre serveur O2switch
- PM2 installé globalement sur le serveur

## 🚀 Configuration initiale sur O2switch

### 1. Connexion SSH à votre serveur

```bash
ssh votre-utilisateur@votre-serveur.o2switch.net
```

### 2. Installation de Node.js et PM2

```bash
# Installer Node.js (si pas déjà fait)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 globalement
npm install -g pm2

# Vérifier les installations
node --version
npm --version
pm2 --version
```

### 3. Cloner votre projet

```bash
# Aller dans votre répertoire web
cd /home/votre-utilisateur/www/

# Cloner votre repository
git clone https://github.com/votre-username/telsig_mail.git
cd telsig_mail

# Installer les dépendances
npm install
```

### 4. Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer le fichier .env avec vos paramètres
nano .env
```

Exemple de configuration `.env` pour la production :

```env
# Configuration du serveur
PORT=3000
NODE_ENV=production

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
CORS_ORIGIN=https://votre-domaine.com
```

### 5. Premier déploiement

```bash
# Construire le projet
npm run build

# Démarrer avec PM2
npm run pm2:start

# Sauvegarder la configuration PM2
pm2 save

# Configurer le démarrage automatique
pm2 startup
```

## 🔧 Configuration GitHub Actions

### 1. Créer les secrets GitHub

Dans votre repository GitHub, allez dans **Settings > Secrets and variables > Actions** et ajoutez les secrets suivants :

- `O2SWITCH_HOST` : L'adresse IP ou le nom de domaine de votre serveur
- `O2SWITCH_USERNAME` : Votre nom d'utilisateur O2switch
- `O2SWITCH_SSH_KEY` : Votre clé SSH privée
- `O2SWITCH_PORT` : Le port SSH (généralement 22)
- `O2SWITCH_PROJECT_PATH` : Le chemin vers votre projet (ex: `/home/votre-utilisateur/www/telsig_mail`)

### 2. Générer une clé SSH

```bash
# Sur votre machine locale
ssh-keygen -t rsa -b 4096 -C "github-actions@telsig.com"

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_rsa.pub votre-utilisateur@votre-serveur.o2switch.net

# Afficher la clé privée pour la copier dans GitHub
cat ~/.ssh/id_rsa
```

### 3. Tester le déploiement

Poussez vos modifications sur la branche `main` :

```bash
git add .
git commit -m "Configuration CI/CD"
git push origin main
```

Le workflow GitHub Actions se déclenchera automatiquement.

## 📊 Monitoring et gestion

### Commandes PM2 utiles

```bash
# Voir le statut des applications
npm run pm2:status

# Voir les logs
npm run pm2:logs

# Redémarrer l'application
npm run pm2:restart

# Arrêter l'application
npm run pm2:stop

# Démarrer l'application
npm run pm2:start
```

### Logs et monitoring

```bash
# Voir les logs en temps réel
pm2 logs telsig-mail-server --lines 100

# Voir les logs d'erreur
pm2 logs telsig-mail-server --err

# Voir les logs de sortie
pm2 logs telsig-mail-server --out

# Monitoring en temps réel
pm2 monit
```

## 🔒 Sécurité

### 1. Firewall

Assurez-vous que seul le port nécessaire est ouvert :

```bash
# Vérifier les ports ouverts
sudo netstat -tlnp

# Si vous utilisez UFW
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Variables d'environnement

- Ne jamais commiter le fichier `.env`
- Utiliser des mots de passe forts pour SMTP
- Limiter les accès CORS à vos domaines

### 3. Rate limiting

Le serveur inclut déjà un rate limiting. Vous pouvez ajuster les paramètres dans le fichier `.env` :

```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requêtes max par fenêtre
```

## 🚨 Dépannage

### Problèmes courants

1. **L'application ne démarre pas**
   ```bash
   # Vérifier les logs
   pm2 logs telsig-mail-server
   
   # Vérifier la configuration
   node dist/index.js
   ```

2. **Erreur de connexion SMTP**
   - Vérifier les paramètres SMTP dans `.env`
   - Tester la connexion manuellement
   - Vérifier les logs d'erreur

3. **Problème de permissions**
   ```bash
   # Donner les bonnes permissions
   chmod +x scripts/deploy.sh
   chmod 600 .env
   ```

4. **Port déjà utilisé**
   ```bash
   # Vérifier les processus
   lsof -i :3000
   
   # Tuer le processus si nécessaire
   kill -9 <PID>
   ```

### Logs utiles

```bash
# Logs PM2
pm2 logs

# Logs système
sudo journalctl -u pm2-votre-utilisateur

# Logs d'erreur
tail -f logs/err.log
```

## 📈 Performance

### Optimisations recommandées

1. **Utiliser un reverse proxy (Nginx)**
2. **Configurer HTTPS**
3. **Mettre en place un monitoring**
4. **Sauvegarder régulièrement les données**

### Exemple de configuration Nginx

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🎯 Tests de déploiement

Après le déploiement, testez vos endpoints :

```bash
# Test de santé
curl https://votre-domaine.com/api/mail/health

# Test d'envoi de mail
curl -X POST https://votre-domaine.com/api/mail/send \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","text":"Test"}'

# Test de contact
curl -X POST https://votre-domaine.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test"}'
```

Votre serveur de mail est maintenant déployé et configuré pour le CI/CD ! 🚀 