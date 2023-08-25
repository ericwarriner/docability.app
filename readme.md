
[docability.app](https://docability.app)
==========
docability.app is a free and open source AI Assisted PDF Document Review.


Note that this project has environment variables (not included) that are required to deploy on [Firebase](https://firebase.google.com/).
Example variables are:

```
VITE_APP_APIKEY=YOUR_VALUE_HERE 

VITE_APP_AUTHDOMAIN=YOUR_VALUE_HERE

VITE_APP_PROJECTID=YOUR_VALUE_HERE 

VITE_APP_STORAGEBUCKET=YOUR_VALUE_HERE 

VITE_APP_APPID=YOUR_VALUE_HERE 

VITE_APP_MEASUREMENTID=YOUR_VALUE_HERE 

VITE_APP_MESSAGESENDERID=YOUR_VALUE_HERE 

API_KEY=YOUR_VALUE_HERE 

CHROMAURL=YOUR_VALUE_HERE 
```

Additionally, you will have to deploy a [ChromaDB](https://github.com/chroma-core/chroma) instance.
  
Before deployment ensure that you have built the project:
```bash
npm run build
```    

To deploy on Firebase...Use:

```bash
firebase deploy --only functions

firebase deploy --only hosting
``` 
or 
```bash
firebase deploy
``` 

You can view logs of functions by using:
```bash
firebase functions:log
``` 

To run locally use:
```bash
vite

vite build

vite preview
``` 

To update packages use:
```bash
npm-check-update

npm install
``` 


