import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Adapted mock data for Rafiki Likastore
const mockFavorites = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJGdD_b4Qapa7cJTja4q_KtPtMDKtw0wNTJXVh47CQBf5398MGoe7y5zgIpIx5DY-qj0E4yRz6kD5ZUI2bxH7ThA-obckCE_LZ1B80kZYfp8sXtU9HfG5Q5_tv2jobQjAe2h28raSJfLK1ENvWzG8X0FvK78qcIkIWassrWsF5WeBDdRhtOLMwaspSc1wrOt9q3qzOrdHPuzl6q_tocF6T87B0mwjW0maW18YrLCzB8jgPr43HRQQfRLTgkDklhdG8vgNjAPQgVYg",
    title: "Jameson Irish Whiskey",
    subtitle: "$24.99",
    link: "/product/jameson",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI2lPm1XZ5XFwxelbRh5H9ERrPyait1Ylwb4AR6Y7Oj6-4mBs0Tm48tgCYM-10xNqS_K40r0Zh_Axy-V79e3aZ-nKDQ-7mSUxUj9qZS6VWgKrX2KZ9dk_p2kPyeU2X0wZDo-Y8yTGNj4-2qnUDhyFHGRdgr5eRWCGBOw1vA0jyHYI7W76j_WegouSc2gBxbvWUKsD3Ccf9K55Y1LL8wrCe72q-jqeRAuVwzx3SaNDEEpFo0YW16BCdZfTfeVjnQpaTG2L7uPiNrIw",
    title: "Captain Morgan Spiced Rum",
    subtitle: "$19.99",
    link: "/product/captain-morgan",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDihd4fUj0wTP6wDhPCR-7nkAMUpUMsg7hoIKF_Z0EaznxzYPqYGC1G8fzXmxtVT062dcOk0iNbTf3_Fktx8HOkvKEStTTdaUPQO2Y6takGvBC4vlDvr1hebl0eyfHMeNY_7yQpEtwGQXFgi_mHYVmWEzmLVJzZJ_W8dv7cIwb314oafXXu_Km87l06QqT1rB207bllquxn67PF0wE3YMXu4PaxRSDRmyrn-jiX7MExREDKet-cNvwkHGYW-5NgdN57AKbH-fd-DWY",
    title: "Jose Cuervo Tequila",
    subtitle: "$21.99",
    link: "/product/jose-cuervo",
  },
];

const FavoriteItem = ({ img, title, subtitle, onRemove, link }) => {
  const navigate = useNavigate();
  return (
    <div className="min-w-[220px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm flex flex-col items-center p-4 relative hover:shadow-md transition-all">
      <div
        onClick={() => navigate(link)}
        className="cursor-pointer w-full flex flex-col items-center"
      >
        <img
          src={img}
          alt={title}
          className="w-28 h-28 rounded-lg object-contain mb-3"
        />
        <p className="font-semibold text-zinc-900 dark:text-white text-center">
          {title}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
          {subtitle}
        </p>
      </div>
      <button
        className="absolute top-3 right-3 text-red-600 hover:text-red-700 transition"
        aria-label="remove favorite"
        onClick={onRemove}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </button>
    </div>
  );
};

const FavoritesCard = () => {
  // This should be fetched from the user object or API
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleRemoveFavorite = (index) => {
    // This would also make an API call
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border dark:border-zinc-800"
      id="favorites"
    >
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
        My Favorites
      </h3>

      {favorites.length > 0 ? (
        <div className="flex overflow-x-auto space-x-4 pb-3 -mb-3">
          {favorites.map((fav, index) => (
            <FavoriteItem
              key={index}
              {...fav}
              onRemove={() => handleRemoveFavorite(index)}
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-6">
          You haven’t added any favorites yet.
        </p>
      )}
    </div>
  );
};

export default FavoritesCard;
