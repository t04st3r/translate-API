// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");

const enTranslation = JSON.parse(
  fs.readFileSync("./locales/en/translation.json")
);
const esTranslation = JSON.parse(
  fs.readFileSync("./locales/es/translation.json")
);
const frTranslation = JSON.parse(
  fs.readFileSync("./locales/fr/translation.json")
);

const emptyString = "__STRING_NOT_TRANSLATED__";

// Creates a client
const translate = new Translate();

const translateText = async (text, target) => {
  let [translations] = await translate.translate(text, target);
  return Array.isArray(translations) ? translations[0] : translations;
};

let promiseEsArr = Object.keys(esTranslation).map((key) => {
  const spanishValue = esTranslation[key];
  if (typeof spanishValue === "string") {
    if (spanishValue === emptyString) {
      const englishValue = enTranslation[key] || null;
      if (englishValue !== null) {
        return translateText(englishValue, "es").then((res) => {
          console.log(`TRANSLATED: (${englishValue}) => (${res})`);
          return { [key]: res };
        });
      }
    }
  }
  return { [key]: spanishValue };
});

let promiseFrArr = Object.keys(frTranslation).map((key) => {
  const frenchValue = frTranslation[key];
  if (typeof frenchValue === "string") {
    if (frenchValue === emptyString) {
      const englishValue = enTranslation[key] || null;
      if (englishValue !== null) {
        return translateText(englishValue, "fr").then((res) => {
          console.log(`TRANSLATED: (${englishValue}) => (${res})`);
          return { [key]: res };
        });
      }
    }
  }
  return { [key]: frenchValue };
});

Promise.all(promiseFrArr).then((resultsArray) => {
  let finalObject = {};
  resultsArray.forEach((item) => {
    finalObject = { ...finalObject, ...item };
  });
  let data = JSON.stringify(finalObject);
  fs.writeFileSync("translation-fr.json", data);
  console.log("File successfully saved!");
});
