import { Card } from "./card.js";

class PhraseSearch {
	constructor() {
		class Trie {
			constructor() {
				this.phraseWordCount = {};
				this.children = {};
			}
			addPhraseWord(phrase, word) {
				if (word !== "") {
					const first = word.charAt(0);

					if (!this.children.hasOwnProperty(first)) {
						this.children[first] = new Trie();
					}
					const rest = word.substring(1);
					this.children[first].addPhraseWord(phrase, rest);
				}
				if (!this.phraseWordCount.hasOwnProperty(phrase)) {
					this.phraseWordCount[phrase] = 0;
				}
				this.phraseWordCount[phrase]++;
			}
			getPhraseWordCount(prefix) {
				if (prefix !== "") {
					const first = prefix.charAt(0);

					if (this.children.hasOwnProperty(first)) {
						const rest = prefix.substring(1);
						return this.children[first].getPhraseWordCount(rest);
					} else {
						return {};
					}
				} else {
					return this.phraseWordCount;
				}
			}
		}

		this.trie = new Trie();
	}
	addPhrase(phrase) {
		const words = phrase.trim().toLowerCase().split(/\s+/);
		words.forEach(function (word) {
			this.trie.addPhraseWord(phrase, word);
		}, this);
	}
	search(query) {
		const answer = {};
		let phraseWordCount = this.trie.getPhraseWordCount("");
		for (const phrase in phraseWordCount) {
			if (phraseWordCount.hasOwnProperty(phrase)) {
				answer[phrase] = true;
			}
		}

		const prefixes = query.trim().toLowerCase().split(/\s+/);

		prefixes.sort();
		prefixes.reverse();

		let prevPrefix = "";
		let superprefixCount = 0;

		prefixes.forEach(function (prefix) {
			if (prevPrefix.indexOf(prefix) !== 0) {
				superprefixCount = 0;
			}
			phraseWordCount = this.trie.getPhraseWordCount(prefix);

			function phraseMatchedWordCount(phrase) {
				return phraseWordCount.hasOwnProperty(phrase)
					? phraseWordCount[phrase] - superprefixCount
					: 0;
			}

			for (const phrase in answer) {
				if (
					answer.hasOwnProperty(phrase) &&
					phraseMatchedWordCount(phrase) < 1
				) {
					delete answer[phrase];
				}
			}

			prevPrefix = prefix;
			superprefixCount++;
		}, this);

		return answer;
	}
}

function CardTrie({ recepieList, recepieSearch }) {
	const phraseSearch = new PhraseSearch();

	const recepiesName = recepieList.map((recepie) => {
		return recepie.name;
	});

	recepiesName.forEach((recepie) => {
		phraseSearch.addPhrase(recepie);
	});

	const recepiesIngredients = recepieList.map((recepie) => {
		return recepie.ingredients;
	});

	recepiesIngredients.forEach((ingredient) => {
		let ingredientArray = [];
		ingredient.forEach((ing) => {
			ingredientArray.push(ing.ingredient);
		});
		ingredientArray.forEach((ing) => {
			phraseSearch.addPhrase(ing);
		});
	});

	const ustensils = recepieList.map((recepie) => {
		return recepie.ustensils;
	});

	ustensils.forEach((ustensil) => {
		let ustensilArray = [];
		ustensil.forEach((ust) => {
			ustensilArray.push(ust);
		});
		ustensilArray.forEach((ust) => {
			phraseSearch.addPhrase(ust);
		});
	});
	const query = recepieSearch.value;

	const results = phraseSearch.search(query);

	const resultsArray = Object.keys(results);

	const resultsList = resultsArray.map((result) => {
		return result;
	});

	// clean the cards container before adding new cards
	const cardsContainer = document.getElementById("cards");
	cardsContainer.innerHTML = "";

	// creates a new array of recepies that match the search
	const recepies = recepieList.filter((recepie) => {
		// return recepie name or ingredients that match the search
		return (
			resultsList.includes(recepie.name) ||
			// check if the recepie ingredients match the search
			recepie.ingredients.some((ingredient) => {
				return resultsList.includes(ingredient.ingredient);
			}) ||
			// check if the recepie ustensils match the search
			recepie.ustensils.some((ustensil) => {
				return resultsList.includes(ustensil);
			})
		);
	});
	// creates the cards for the recepies from the array of recepies that match the search
	recepies.forEach((recepie) => {
		Card(recepie);
	});
}

export { PhraseSearch, CardTrie };
