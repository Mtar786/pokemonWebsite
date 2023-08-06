/*
 * Name: Muhammad Rahman
 * Date: 7/25/23
 * Ta: Allison Ho
 *
 * This is the index.js page for my Pokemon Website. This implments the logic
 * to call on the API of both PokeAPI and AmiiboAPI to generate images and
 * to display some of their data on my website.
 */

"use strict";
(function() {

  const POKE_URL = 'https://pokeapi.co/api/v2/';
  const AMIBO_URL = 'https://www.amiiboapi.com/api/';
  let count = 0;
  let array = ['ivysaur', 'incineroar', 'jigglypuff', 'lucario', 'mewtwo', 'pichu', 'pikachu',
  'Pokemon Trainer', 'squirtle', 'Detective Pikachu', 'charizard', 'greninja'];
  window.addEventListener('load', init);

  /** initializer function that helps initialize the program*/
  function init() {
    let button = id('random-poke');
    button.addEventListener('click', getRandomPokemon);
    let submit = id('pokemon-btn');
    submit.addEventListener('click', handleManualEntry);
    id('amibo').addEventListener('click', genAmibo);
  }

  /** Feteches a random Pokemon and dispalys its attributes*/
  async function getRandomPokemon() {
    try {
      const num = 1000;
      let random = Math.floor(Math.random() * num);
      let pokemon = await fetch(`${POKE_URL}pokemon/${random}`);
      let check = await statusCheck(pokemon);
      let randomPoke = await check.json();
      getAttributes(randomPoke);
      getType(randomPoke);
      getMoves(randomPoke);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Finds the image asscoiated with given pokemon and displays it on website
   * @param {JSON} data - the pokemon we want an image of
   */
  function getAttributes(data) {
    let url = data.sprites.front_default;
    let pokeImg = gen('img');
    pokeImg.src = url;
    pokeImg.alt = 'random pokemon image';
    let addTo = id('random-pokemon-section');
    addTo.appendChild(pokeImg);
    pokeImg.classList.add('resize');
  }

  /**
   * Finds the type and ability associated with given pokemon and displays it
   * @param {JSON} data - the selected pokemon
   */
  function getType(data) {
    let type = data.types[0].type.name;
    let ability = data.abilities[0].ability.name;
    let pTag = gen('p');
    pTag.textContent = `Pokemon ${data.forms[0].name} is ${type} type & has ability ${ability}`;
    id('pokemon-type').appendChild(pTag);
  }

  /**
   * Finds moves associated with given pokemon and dispalys it
   * @param {JSON} data - the selected pokemon
   */
  function getMoves(data) {
    const update = 4;
    let tag = gen('p');
    tag.textContent = `Some moves of ${data.forms[0].name} are: `;
    for (let i = 0; i < update; i++) {
      let moves = data.moves[i].move.name;
      if (moves) {
        tag.textContent += moves + ', ';
        id('moves').appendChild(tag);
      }
    }
  }

  /**
   * chekcs the status of a fetch response and throws error if not working
   * @param {JSON} res - the error
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * function that dispalys an error message alongside an image when an error occurs
   * @param {JSON} err - the error
   */
  function handleError(err) {
    // image from nicepng: nicepng.com/ourpic/u2e6t4y3u2r5y3i1_sad-pikachu-no-background/
    let img = gen('img');
    img.src = './pikachu.png';
    img.alt = 'sad pikachu';
    let tag = gen('p');
    tag.id = 'error';
    tag.textContent = err + ' ERROR Something Went Wrong!! Please try again later';
    qs('header').appendChild(img);
    qs('header').appendChild(tag);
  }

  /** functoin that handles the manual entry of a specific pokemon and displays its attributes*/
  async function handleManualEntry() {
    let input = id('pokemon').value;
    let pokemonNameInput = input.trim().toLowerCase();
    try {
      let message = id('error');
      if (pokemonNameInput !== '') {
        let response = await fetch(`${POKE_URL}pokemon/${pokemonNameInput}`);
        let check = await statusCheck(response);
        let pokemonData = await check.json();
        getAttributes(pokemonData);
        getType(pokemonData);
        getMoves(pokemonData);
        if (message) {
          message.remove();
        }
      }
    } catch (err) {
      handleError2(err);
    }
  }

  /**
   * function that dispalys an error message when a spelling mistake occurs
   * @param {JSON} err - the error
   */
  function handleError2(err) {
    let tag = gen('p');
    tag.id = 'error';
    tag.textContent = err + ' There is a spelling mistake!! Please retype';
    qs('header').appendChild(tag);
  }

  /** function that fetches a random amiibo from the api and dispalys its attributes*/
  async function genAmibo() {
    try {
      let index = Math.floor(Math.random() * array.length);
      let randPoke = array[index];
      array.splice(index, 1);
      let amibo = await fetch(`${AMIBO_URL}amiibo/?name=${randPoke}`);
      let check = await statusCheck(amibo);
      let randAmibo = await check.json();
      getAmibo(randAmibo);
      getAmiiboAtrributes(randAmibo);
    } catch (err) {
      handleError3(err);
    }
  }

  /**
   * function that dispalys the amiibo image and stops dispalying anymore if there are 12 amiibos
   * @param {JSON} data - the given amiibo
   */
  function getAmibo(data) {
    let url = data.amiibo[0].image;
    let amiiboImg = gen('img');
    amiiboImg.src = url;
    amiiboImg.alt = 'random pokemon amiibo image';
    let addTo = id('amiibo-part');
    addTo.appendChild(amiiboImg);
    amiiboImg.classList.add('resize');
    count++;
    const target = 12;
    if (count === target) {
      id('amibo').disabled = true;
      let tag = gen('p');
      tag.textContent = 'All Amiibos are displayed. Button is disabled';
      id('amiibo-part').appendChild(tag);
    }
  }

  /**
   * function that dispalys the amiibo attributes on the website
   * @param {JSON} data - the given amiibo
   */
  function getAmiiboAtrributes(data) {
    let url = data.amiibo[0].name;
    let date = data.amiibo[0].release.na;
    let tag = gen('p');
    tag.id = url;
    tag.textContent = "Amiibo " + url + " was released on " + date;
    let add = id('amiibo-attribute');
    add.appendChild(tag);
  }

  /**
   * function that displays an error message when error occurs
   * @param {JSON} err - the error
   */
  function handleError3(err) {
    let tag = gen('p');
    tag.textContent = err + " Error: Unexpected Result! Please Try again later.";
    id('amiibo-part').appendChild(tag);
  }

  /**
   * Finds the element with the speciifed ID attribute
   * @param {string} id - element Id
   * @returns {HTMLElement | null} DOM object associated with id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Finds first element with specifed CSS selector
   * @param {string} selector - CSS selector
   * @returns {HTMLElement | null} first DOM object associated with CSS selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element that matches the specified tag name
   * @param {string} query - the element's tag name
   * @returns {object} - newly-created DOM object
   */
  function gen(query) {
    return document.createElement(query);
  }

})();