import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";

// This serves as mock data - for fun (or aesthetics) I added styles to engage with the code a bit more
const recipeData = [
  {
    id: 1,
    name: "Vegetarian Lasagna",
    description: "A delicious and healthy vegetarian lasagna.",
    time: "1 hour",
    imageName: "images/lasagna.png",
    ingredients: [
      "Lasagna noodles",
      "Tomato sauce",
      "Spinach",
      "Ricotta cheese",
    ],
    dietary: ["Vegetarian"],
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    description: "A refreshing and protein-packed salad.",
    time: "30 minutes",
    imageName: "images/chicken.png",
    ingredients: [
      "Chicken breasts",
      "Lettuce",
      "Tomatoes",
      "Avocado",
      "Balsamic vinaigrette",
    ],
    dietary: ["Keto", "Gluten-free"],
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    description: "A decadent and indulgent chocolate dessert.",
    time: "45 minutes",
    imageName: "images/cake.png",
    ingredients: ["Chocolate", "Eggs", "Butter", "Flour"],
    dietary: ["Dessert"],
  },
];

function App() {
  // State variables to manage recipes, favorites, filters, and whether to show favorites only
  const [recipes] = useState(recipeData);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filters, setFilters] = useState({ dietary: [], search: "" });

  // Function to handle adding/removing a recipe to/from favorites
  const handleFavorite = (recipeId) => {
    if (favorites.includes(recipeId)) {
      setFavorites(favorites.filter((id) => id !== recipeId));
    } else {
      setFavorites([...favorites, recipeId]);
    }
  };

  // This handles applying dietary filters - using arrow functions because they're easier
  const handleDietaryFilter = (dietary) => {
    setFilters({ ...filters, dietary });
  };

  // Handle searching for recipes by name
  const handleSearchFilter = (search) => {
    setFilters({ ...filters, search });
  };

  // This here is for filtering recipes based on current filters and favorites state (I had a tough time with this and had some AI assistence, even though it was a constant uphill battle to get the result I'd understand and want)
  const filteredRecipes = recipes.filter((recipe) => {
    const { dietary, search } = filters;
    // React actually has strange multiple if statements (in terms of layering), so this was an interesting exp
    if (showFavoritesOnly && !favorites.includes(recipe.id)) {
      return false;
    }
    if (
      dietary.length > 0 &&
      !dietary.every((tag) => recipe.dietary.includes(tag))
    ) {
      return false;
    }
    if (search && !recipe.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  // The rendering part
  return (
    <div className="App container">
      <header className="App-header">
        <h1>Interactive Recipe Book</h1>
      </header>
      {/* A filter section */}
      <div className="filters App-body">
        <h2>Dietary Restrictions:</h2>
        {/* A search bar */}
        <input
          className="search-bar"
          type="text"
          placeholder="Search recipe"
          value={filters.search}
          onChange={(e) => handleSearchFilter(e.target.value)}
        />
        {/* The part for dietary filters - I made it a drop down for easy access */}
        <label>
          <select
            className="select-filter"
            multiple
            value={filters.dietary}
            onChange={(e) =>
              handleDietaryFilter(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {/* Generate options from unique dietary tags? I had some AI assistence with this, working with tags plus array properties (aside from the map property - my favorite) tired me out */}
            {[...new Set(recipeData.flatMap((recipe) => recipe.dietary))].map(
              (tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              )
            )}
          </select>
        </label>
        {/* A button for showing only favorites */}
        <button
          className="favorite-btn"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          {showFavoritesOnly ? "Show All Recipes" : "Show Favorites Only"}
        </button>
        {/* Button to clear filters */}
        <button className="clear-btn" onClick={() => handleDietaryFilter([])}>
          Clear Filters
        </button>
      </div>
      {/* The list of recipes */}
      <RecipeList
        recipes={filteredRecipes}
        favorites={favorites}
        onFavorite={handleFavorite}
        showFavoritesOnly={showFavoritesOnly}
      />
    </div>
  );
}

// RecipeCard component
const RecipeCard = ({ recipe, onFavorite, isFavorite, showFavoritesOnly }) => {
  // Destructuring the recipe object for easy access to all its properties
  const { id, name, description, time, imageName, ingredients, dietary } =
    recipe;

  // Function to handle adding/removing recipe from favorites
  const handleFavorite = () => {
    onFavorite(id);
  };

  // Render nothing if showFavoritesOnly is true and recipe is not a favorite
  if (showFavoritesOnly && !isFavorite) {
    return null;
  }

  // Rendering the recipe card
  return (
    <ul className="App-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Cooking Time: {time}</p>
      <img className="images" src={imageName} alt={name}></img>
      <h4>Ingredients:</h4>
      <ul className="recipe-card">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <div className="dietary-tags">
        {dietary.map((tag, index) => (
          <span key={index} className="dietary-tag">
            {tag}
          </span>
        ))}
      </div>
      {/* Button to add/remove from favorites */}
      <button className="add-btn" onClick={handleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Favorite"}
      </button>
    </ul>
  );
};

// RecipeList component
const RecipeList = ({ recipes, favorites, onFavorite, showFavoritesOnly }) => {
  // Rendering list of RecipeCard components
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(recipe.id)}
          showFavoritesOnly={showFavoritesOnly}
        />
      ))}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
