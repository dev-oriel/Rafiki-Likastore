import React from "react";
import FavoriteCard from "./FavoriteCard";

// Mock data, this will come from your API
const favorites = [
  {
    _id: "1",
    name: "Jose Cuervo Tequila",
    slug: "jose-cuervo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDihd4fUj0wTP6wDhPCR-7nkAMUpUMsg7hoIKF_Z0EaznxzYPqYGC1G8fzXmxtVT062dcOk0iNbTf3_Fktx8HOkvKEStTTdaUPQO2Y6takGvBC4vlDvr1hebl0eyfHMeNY_7yQpEtwGQXFgi_mHYVmWEzmLVJzZJ_W8dv7cIwb314oafXXu_Km87l06QqT1rB207bllquxn67PF0wE3YMXu4PaxRSDRmyrn-jiX7MExREDKet-cNvwkHGYW-5NgdN57AKbH-fd-DWY",
    price: 21.99,
    deal: "15% OFF",
  },
  {
    _id: "2",
    name: "White Claw Variety Pack",
    slug: "white-claw",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdhwMlP-hSOYqXAz0cBd8RdlFy4zjYY_quP5MQPsxOGfRhdM89j-R-uSXlchuWb1hmpSZE_LPAwUgpq-dQyDkpDKX1shYAuKKAsqv8FEteLLCj_rAGoKiCtIShyMQ3WYhXvh2yvu87I__VYWxpiCBF5x88MZl7LK0y13S1rXt8ewJ4jgNBsg0_CPnphnR3BfqpGFqbT79cA7rJQigg5ywe088ls8R6uAfiCyhSmSSyEvgRIQceLKQE79suUvuUWSMMJ14ZAb2tt5M",
    price: 17.99,
    deal: "DEAL",
  },
  {
    _id: "3",
    name: "Fireball Cinnamon Whisky",
    slug: "fireball",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTG-FpRCBKGcSzOctfwH11iZBmFvfg8VpQcRN5VVLpWEjCfu4t9Sl-YsT_qJaY_a88AxZUR03pFlriHhhlvYl4yg-3SkKqRwjArRxIK3-0ExflX35TbaW25uris6Qs_q8ojUoKKJupSX1n5h3j2UOtaRJ86bPgPem3JiQ6Maj7Fmx324u-ovCtWR_GSrVud1Rxm6bBqCT9cpC-xBt0EgV1mqVYMrE4dY9p93hpV74c5bMxtQVWNXBti8RdamoCd6KwFw1M_mx6u_0",
    price: 15.99,
    deal: "SAVE $5",
  },
  {
    _id: "4",
    name: "Smirnoff No. 21 Vodka",
    slug: "smirnoff",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvycM53QV_4YjkOngBOopZ7dM1Si_OQnPB4CPQghPhcoM0FjAM_XOmpn6s0xXZTO5EJzuaJb3UGWSlhwyHZPainUJt3LIc8XNt9lgUiyUD_HgAzRvYCXugnZeqVoweM8YVZVy7eMhxS3ENP1gWMaLnGpAOPa3U_K69hySbmny8h5ruKwSTMO3lmDAaxnBFSgcvNwsErn5mdcCaw09jZbLHTOOELK9vujimyMtde6uXGEclvi_HbeIvndTJIDR3bk9y7uBtxdJzcRs",
    price: 18.99,
    deal: null,
  },
  {
    _id: "5",
    name: "Bud Light 12-Pack",
    slug: "bud-light",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAijGqH97_xjg2R2-m4miDd_wd-fcWnef6Im39e0eqpbHL6SIhcDDGbH9luUqg7kLD4o4pbprI5orCbOeS3N254WwQXJAb4sa2959hVo66yRcFoRdaEoshGK5-_zOWxmVib3R86XYvPFcGyN8k30wIPvBtIHQQDgCqzyzUG72YmfDfvlRS1_gqWcT8Y_HSmoX1z7G0QYzXeHtqBFxW3rK_IvrOYqL8QdstqrplS49sDccmKER-PmAvLaI0M5t7RKXhGUiXI5gaZlA8",
    price: 12.99,
    deal: null,
  },
];

const StudentFavorites = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Student Favorites
        </h2>
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4">
          <div className="flex items-stretch px-4 gap-6">
            {favorites.map((product) => (
              <FavoriteCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentFavorites;
