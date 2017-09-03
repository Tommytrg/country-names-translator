require('dotenv').config({path: '.env'})

const fs = require('fs')
const translator = require('yandex-translate-api-wrapper')

// Can't translate all together because are too many request. Need setTimeout 
const languages = [
  'en-be', 'en-ca', 'en-cs', 'en-da', 'en-de', 'en-el', 'en-es', 'en-et',
  'en-fi', 'en-fr', 'en-hu', 'en-it', 'en-lt', 'en-lv', 'en-mk', 'en-nl',
  'en-no', 'en-pt', 'en-ru', 'en-sk', 'en-sl', 'en-sq', 'en-sv', 'en-tr',
  'en-uk']

function readCountries () {
  return JSON.parse(fs.readFileSync('countries2.json', 'utf8'))
}

function writeCountries (countries) {
  fs.writeFile(`countries2.json`, JSON.stringify(countries), err => {
    if (err) console.log('Error saving countries2.json')
    else {
      console.log('The file countries2.json has been saved!')
    }
  })
}

function translate (text, language) {
  return new Promise((resolve, reject) => {
    const textTranslated = translator.translateText(process.env.API_KEY_YANDEX_TRANSLATE, language, text)
    resolve(textTranslated)
  })
}

function translateCountryList (countries, language) {
  const translated = countries.map(async country => {
    return await translate(country.name.en, language)
  })
  return Promise.all(translated)
}

function addName (countries, namesList, language) {
  return countries.map((country, index) => {
    const newCountry = country
    newCountry.name[language] = namesList[index].text[0]
    return newCountry
  })
}

async function translateCountryNames (language) {
  const countries = readCountries()
  const namesList = await translateCountryList(countries, language)
  const lang = language.split('-')[1]
  const newCountryList = addName(countries, namesList, lang)
  writeCountries(newCountryList)
}

translateCountryNames(languages[0])
