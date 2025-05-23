# Configuration simple

## 🚀 Démarrage rapide

1. **Développement local**

   ```bash
   ./start.sh
   ```

2. **Production**

   ```bash
   mkdir -p logs
   pm2 start ecosystem.config.js
   ```

3. **Redémarrage**
   ```bash
   pm2 restart aleks
   ```

## 📋 Configuration

- **Port** : 3002
- **PM2 nom** : aleks
- **Serveur** : Python
- **Workflow** : Push sur main = restart automatique

## ✅ C'est tout !

Aucune installation npm, aucun build, juste Python et PM2.
