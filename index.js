const API_KEY = "0efe164ad3914f5dbbfdf81c37cbe081";
const recipeListEl = document.getElementById("recipe-list");

async function displayRecipes(recipes) {
  recipeListEl.innerHTML = "";
  
  if (recipes[0] && !recipes[0].extendedIngredients) {
    try {
      const recipesId = recipes.map((r) => r.id).join(",");
      const response = await fetch(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${recipesId}&apiKey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipe information');
      }

      const data = await response.json();
      recipes = data;
    } catch (error) {
      console.error('Error fetching recipe information:', error);
      return; // Exit if there's an error
    }
  }

  recipes.forEach((recipe) => {
    const recipeItemEl = document.createElement("li");
    recipeItemEl.classList.add("recipe-item");

    const recipeImageEl = document.createElement("img");
    recipeImageEl.src = recipe.image;
    recipeImageEl.alt = "recipe image";

    const recipeTitleEl = document.createElement("h2");
    recipeTitleEl.innerText = recipe.title;

    const recipeIngredientsEl = document.createElement("p");
    recipeIngredientsEl.innerHTML = `
      <strong>Ingredients:</strong> ${recipe.extendedIngredients
        .map((ingredient) => ingredient.original)
        .join(", ")}
    `;

    const recipeLinkEl = document.createElement("a");
    recipeLinkEl.href = recipe.sourceUrl;
    recipeLinkEl.innerText = "View Recipe";

    recipeItemEl.appendChild(recipeImageEl);
    recipeItemEl.appendChild(recipeTitleEl);
    recipeItemEl.appendChild(recipeIngredientsEl);
    recipeItemEl.appendChild(recipeLinkEl);
    recipeListEl.appendChild(recipeItemEl);
  });
}

// Get the input field
const searchbar = document.getElementById("searchbar");

// Execute a function when the user presses a key on the keyboard
searchbar.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    search_recipe();
  }
});

async function search_recipe() {
  const input = searchbar.value.toLowerCase();
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?number=10&apiKey=${API_KEY}&query=${input}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    displayRecipes(data.results);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

async function getRecipes(id) {
  const path = id ? `informationBulk?ids=${id}` : "random?number=10";
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${path}&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();

    // In case of search
    if (id) data.recipes = data;

    return data.recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return []; // Return an empty array in case of error
  }
}

async function init() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const recipes = await getRecipes(id);
  displayRecipes(recipes);
}

init();
