# Utiliser une image Node.js comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'application tourne
EXPOSE 5000

# Démarrer l'application
CMD ["node", "index.js"]
