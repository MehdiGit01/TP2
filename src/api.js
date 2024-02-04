import fetch from 'node-fetch';
import CryptoJS from 'crypto-js';

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    try {
        const hash = CryptoJS.MD5(`${timestamp}${privateKey}${publicKey}`).toString();
        return hash;
    } catch (error) {
        console.error('Error generating hash:', error);
        throw error;
    }
}

const publicKey = "4127f72f71e72c08b584350b149981f6";
const privateKey = "51420b3b2ced406ece06dd286c9b5d4bda5c9b3b";
const ts = Date.now();

const hash = await getHash(publicKey, privateKey, ts);
console.log(ts);
console.log(hash);

const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&name=Hulk`;
const marvelData = await getData(url);



console.log(marvelData);

const hulkData = marvelData.data.results.find(character => character.name === 'Hulk');

if (hulkData) {
    console.log('Données de Hulk:', hulkData);


    if (hulkData.thumbnail && hulkData.thumbnail.path && hulkData.thumbnail.extension) {
        console.log('Thumbnail URL:', `${hulkData.thumbnail.path}.${hulkData.thumbnail.extension}`);
    } else {
        console.log('Il n\'a pas d\'image thumbnail valide pour Hulk.');
    }
} else {
    console.log('Hulk n\'a pas été trouvé dans les résultats.');
}

const charactersArray = marvelData.data.results.map(character => {
    const imageUrl = character.thumbnail && character.thumbnail.path && character.thumbnail.extension
        ? `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
        : null;

    return {
        name: character.name,
        imageUrl: imageUrl,
    };
});

console.log('Tableau de personnages :', charactersArray);
