export const Card = (props) => {
	const ingredients = props.ingredients;
	const ingredientList = ingredients.map((ingredient) => {
		if (ingredient.unit) {
			return `<li><strong>${ingredient.ingredient}:</strong> ${ingredient.quantity} ${ingredient.unit} </li>`;
		} else if (ingredient.unit === undefined) {
			return `<li><strong>${ingredient.ingredient}</strong></li>`;
		}
		return `<li><strong>${ingredient.ingredient}:</strong> ${ingredient.quantity}</li>`;
	});

	const card = `<div class="card">
			<img src="./assets/img.png" class="card-img-top" alt="..." />
							<div class="card-body">
								<div class="card-head">
									<h5 class="card-title">${props.name}</h5>
									<div class="time">
										<i class="fa-regular fa-clock"></i>
										<span class="card-text">${props.time} min</span>
									</div>
								</div>
								<div class="card-description">
									<ul class="card-ingredients">
										${ingredientList.join("")}
									</ul>
									<p class="card-text">
									${
										props.description.length >= 200
											? props.description.substring(0, 220) + "..."
											: props.description
									}
					</p>
				</div>
		</div>`;
	// append the card to the DOM
	const cardContainer = document.getElementById("cards");
	cardContainer.innerHTML += card;
};
