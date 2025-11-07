import React from "react";
import ProductCard from "./ProductCard"; // Import the new component

// Mock data, this will come from your API
const topPicks = [
  {
    _id: "1",
    name: "Jameson Irish Whiskey",
    slug: "jameson",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJGdD_b4Qapa7cJTja4q_KtPtMDKtw0wNTJXVh47CQBf5398MGoe7y5zgIpIx5DY-qj0E4yRz6kD5ZUI2bxH7ThA-obckCE_LZ1B80kZYfp8sXtU9HfG5Q5_tv2jobQjAe2h28raSJfLK1ENvWzG8X0FvK78qcIkIWassrWsF5WeBDdRhtOLMwaspSc1wrOt9q3qzOrdHPuzl6q_tocF6T87B0mwjW0maW18YrLCzB8jgPr43HRQQfRLTgkDklhdG8vgNjAPQgVYg",
    price: 24.99,
    rating: 4.5,
  },
  {
    _id: "2",
    name: "Smirnoff No. 21 Vodka",
    slug: "smirnoff",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaBBOL_KNDT2LeMLAjb6sahm9x-9A0ZNzvgv50XNwDCgG6rDgYMiUYuMQcEhwoCd_I73z6vh6mtoJB0djBcAW80b2VMD14JQ3Tf9pL_L92IwZSBT8HQ8RQdHvVmHeYTWb4PGR7H0p36e296Hu3PuQ84YUZIDkp4v3x8s-a5eEmU7-JvA12PFmsLxabqAu9bY3SkRr2kkgtyzTcfYn6MyRTP3sIlLEWWa4eLqWH6Jj-pOZPZdVMvziJh_sJuynelmQcbkgJRw9tHdw",
    price: 18.99,
    rating: 4.7,
  },
  {
    _id: "3",
    name: "Captain Morgan Spiced Rum",
    slug: "captain-morgan",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCI2lPm1XZ5XFwxelbRh5H9ERrPyait1Ylwb4AR6Y7Oj6-4mBs0Tm48tgCYM-10xNqS_K40r0Zh_Axy-V79e3aZ-nKDQ-7mSUxUj9qZS6VWgKrX2KZ9dk_p2kPyeU2X0wZDo-Y8yTGNj4-2qnUDhyFHGRdgr5eRWCGBOw1vA0jyHYI7W76j_WegouSc2gBxbvWUKsD3Ccf9K55Y1LL8wrCe72q-jqeRAuVwzx3SaNDEEpFo0YW16BCdZfTfeVjnQpaTG2L7uPiNrIw",
    price: 19.99,
    rating: 4.6,
  },
  {
    _id: "4",
    name: "Tanqueray London Dry Gin",
    slug: "tanqueray",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKgrwfr3GqaZ47zuJ1cuIytHnPZBtOC07uux5zZgov1p4ZxYmsQZN9j-RCoYL6E8HaQTzhO85dPaCm5oi5FYM4L7YOevtNnjJdLYjoCaFrAhO0utoToe_sv6hgiNK5OlF_VaSnRp0nYq4cwptlUXPAgEZzZdgyp_XZsHR41XLRLrWZHKouXxvapgxdAuJd_aM_O6-2jOnsieDuvPN21wB-1UKw7QHdXwCY3chvVkekfQ5iY5lVUVq5mZ7hLjZJIONVPCsURnN4KVI",
    price: 22.99,
    rating: 4.8,
  },
];

const TopPicks = () => {
  // We'll replace this mock data with an API call
  // const { data: products, isLoading } = useGetProductsQuery();

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Top Picks for You
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {topPicks.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPicks;
