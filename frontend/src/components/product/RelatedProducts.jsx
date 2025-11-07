import React from "react";
import RelatedProductCard from "./RelatedProductCard";

// Mock data
const related = [
  {
    _id: "1",
    name: "The Kraken Black Spiced Rum",
    category: "Spiced Rum",
    price: 27.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHXmTmrgRWTmpckuoV9coM4S7AR0zJa1WXoRV7wZvTn2JvjLAWkRpLkMCWTK-jyqP_MWRBHncevQi5FItwe-FSzHMw4KYkF4LBRSYLyReR-UD7TxxQnTZOodAdp21zyWQOfnsa_-4nHKOjF027TjLVGm7y8geyE77F25DeFJKBYpPoZqfiY8OsKaOEX4vI4Z1Ac4XLZAOJFVjpcvvVgd4B_wcXlS-xNkVse3yOyml0GwG1L8eJazQ5dJsBRamjHhsoqjRvwylxwKw",
    slug: "kraken-rum",
  },
  {
    _id: "2",
    name: "Bacardi Carta Blanca",
    category: "White Rum",
    price: 21.5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLtuhj-y_wLwZtFzN3QDuWFUK0nn9hlrv1DboUZzVc5CBAJqjcBjH07SAV-Mi9JnusglQirlSCQA-QNhffDqktxQPJewnEHbZolZpNjndrv3LBq1JQrHqob1mvmagjpWm1jZM5dx4dTe2Ys9-RF_Z62DiYPK5hxod0ixxbLraf5DQ2H7aeKt_FprWYdeFFIXVf6OwiflpPPr_MUqtvRp5DgqLojHL89pozi2NVeXq4BliMLDFAr1JNSpN5EZnTxbs1qGqdSbeEOho",
    slug: "bacardi-blanca",
  },
  {
    _id: "3",
    name: "Sailor Jerry Spiced Rum",
    category: "Spiced Rum",
    price: 23.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwcpGGKwpi0Ir7g5Ycz1DL9yWcIzC6wBM1M-PSlvm2Sai1oimT54LDC5HvbosJdLImqxPwopXMCbx5k_EHvjwWnCz5Bu6eetdF4CB2rJR7tbMz3eNMcdqR6J_v-3SmZitdc5sq3scs6TI7eIvGJbywm_VF_w8mRYqmJiUPp0O4lOBl4I8tiuqz673cYoUQoX4uFsG5HL0PGeVqMpKZWa-oG3Jd9NhLZkRFm4EkfLS7TFdnW89gu8WX3AIweGqQs7QG8ZSUTNugjCE",
    slug: "sailor-jerry",
  },
  {
    _id: "4",
    name: "Mount Gay Eclipse Rum",
    category: "Golden Rum",
    price: 26.5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBH55IDW4nPl9dk1TXh6yt2GDajBJwHdr7tajAngmHA5XBr5Tp2VZCduerJ1Gh5v8Xs8vzq14qm1eyZkBDiPIE27Gc8BGHzcyRdX4aTB6ZNqHezDCE3Bt4VP0P3gtB-806oDzMEzDvR4KIt8GOOzpZBHqj8ZFJZlpdsbGtbAUKGgpNE0HJRPTYyHKPSzzOk9pU_AUy6m8rrhfuVVVMsoBY-c4J23t7S1SmTsyQ1UrqHLlJXh24cObNkvw8934rfCbjZDGXFuf4qdg4",
    slug: "mount-gay",
  },
];

const RelatedProducts = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        You Might Also Like
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {related.map((product) => (
          <RelatedProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
