import { CardTrie } from "./trie.js";
import recipes from "../data/recipes.js";
import { Card } from "./card.js";

// import the recepie list from recepies.js
const recepieList = recipes;

// An array of all the ingredients in the recepie list
const ingredients = recepieList
	.map((recepie) => {
		const ingredients = recepie.ingredients;
		const ingredient = ingredients.map((ingredient) => {
			return ingredient.ingredient;
		});

		return ingredient;
	})
	.flat();

// Created the initial card for each recepie
recepieList.forEach((recepie) => {
	Card(recepie);
});

const recepieSearch = document.getElementById("search");
// recepieSearch.addEventListener("keyup", () => {
// 	CardTrie({ recepieList, recepieSearch });
// });
const searchBarForm = document.getElementById("searchBarForm");
searchBarForm.addEventListener("submit", (e) => {
	e.preventDefault();
	CardTrie({ recepieList, recepieSearch });
});
