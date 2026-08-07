# 🌱 Hortus — Crop & Garden AI Assistant

**Hortus** est une application web interactive, légère et intuitive, conçue pour vous accompagner dans la planification, la plantation et l'entretien de votre jardin ou de votre potager à petite échelle.

Grâce à l'intégration d'un **expert horticole virtuel** basé sur l'API de **Mistral AI**, Hortus répond instantanément à vos questions de jardinage avec des conseils ultra-rapides, précis et concis (ne dépassant jamais 2 lignes).

Le projet a été mis à jour pour exploiter le modèle ultra-économique et récent **`ministral-3b-latest`**, consommant un minimum de crédits API.

---

## ✨ Fonctionnalités

- **Planificateur de Potager** : Gérez vos données de plantation d'herbes aromatiques, légumes et fruits.
- **Expert Horticole IA** : Interrogez l'intelligence artificielle sur l'entretien, l'arrosage, l'exposition au soleil ou la récolte de vos plantes et obtenez des réponses immédiates et synthétiques.
- **Modèle Économique & Récent** : Utilise le modèle **`ministral-3b-latest`** ($0.04 par million de tokens) pour des coûts d'API quasi-nuls.
- **Zéro installation** : Entièrement basé sur des technologies web standards (HTML5, CSS3, JavaScript), s'exécute directement dans n'importe quel navigateur moderne.

---

## ⚙️ Configuration & Utilisation

1. Obtenez une clé d'API Mistral sur [Mistral Console (La Plateforme)](https://console.mistral.ai/).
2. Ouvrez le fichier `mistral.js` et insérez votre clé d'API à la ligne dédiée :
   ```javascript
   const apiKey = "VOTRE_CLE_API_MISTRAL";
   ```
3. Ouvrez simplement `index.html` dans votre navigateur.
4. Sélectionnez vos plantes, gérez votre potager et demandez des conseils personnalisés à l'expert IA !
