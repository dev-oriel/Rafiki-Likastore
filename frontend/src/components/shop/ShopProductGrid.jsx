import React from "react";
import ShopProductCard from "./ShopProductCard";
import Pagination from "./Pagination";

// Mock data, this will come from your API
const products = [
  {
    _id: "1",
    name: "Trusted Brand Whiskey",
    price: 29.99,
    rating: 4.5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiNn9m5p9kVeyOKfND9-jyuMhXvSKd2yZypQqWlqt-I2nBaJSlyDVlm8we9pOEBdQROTvHipWb-NGDEwpPFar7lqvwkyG44IczHyEyn59zoptP_pi91u2QQcjnkvYy43osxkoe1gG0ZhICbBXjWtHNgv0NmPfEBprhtJAvZBd-yw6A3fBYHBnNiLF2FzLrfs_PM29EpvLG20SPxIa7oUoRuuPeLTaOGuLURTjUcbKu5NCOBytecjlhhLwv8Pdujxp0Q2OKm-Uv9-0",
  },
  {
    _id: "2",
    name: "Classic Vodka",
    price: 24.99,
    rating: 4.7,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXrNo-YPkK-zffMgKi8u19MxsEztAfE8qynFh6n3Elye1NftD_zZVu1ix8W9rGQ8oYcfmUt1b50NK8RqaUAc8Ezo_Bbg4KR18YaiKXx_SHRwmV_XXm4bQOj0glrvg1kJpj3TQ6pdVCkmHns_4P3l9j1O17n1nrLLZnW3eeO9Ba-x4KGfH8mVO2p0A4BicHgVwA2HV2K0MI8l-kDbB6iZLnnaCHoMw9_rbHaef7o0VemluNzokCACzx-auqI9CMAPB6xF6jUxT_HnQ",
  },
  {
    _id: "3",
    name: "Imported Gin",
    price: 32.5,
    rating: 4.6,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHEMJnhNT2KAbFoAMtPTyGThV-g7qoj5KqcOzcoPBALf8o_cD-nBrmqByid6Zxm6VDgF1fjdSLd-RmAow5mjwN6Xsb5KjktPQ0lDggPCo3d1yEybL3ylILWNTr5UXBXdYAn6gkz2Y2a73swLLTIwwx64bpFHfdGoBnBCH8WBIVZFlaTi83Yvycenp7ECvTH4ImE_0A_NWLP-NdjZv6OiVK4vc2yOSX2jrm12bOMuPNbgeqmIsVy-uXkF6KWR2XH5bMoMJYCYsN-g",
  },
  {
    _id: "4",
    name: "Local Craft Beer",
    price: 18.0,
    rating: 4.3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4gCT7TzdXkUbOo9q6Xbz204mVz7AlK7Y1RaDG1EWjPHMBvdwh6cdIC6ib_bZpzY3s75ZLP9wDJm9jmBRSD3EE47YwXt2JNqXXCLnOqI8tW8LjiGt8d3sRnrMa_ljUc3Hj-dV8AyhEGAHcxjonj-wFNHdtMMrzwacQyJlJPbbfSuSdajZDM2v7XxBs-UrcnnfsiN8J3fKLzENA2Wx-pqH5MH5pwHYnRU6QhAyZAXYgxhgkjM6-LzbNRZ-wNp4aG0gKXcRBuWn42bs",
  },
  {
    _id: "5",
    name: "Premium Tequila",
    price: 45.0,
    rating: 4.8,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAx6uwmL-A2-5O-ptZ9TNoWMrKJGGawYtzPD_nQf_no1UEjr2-PsSq38_BMBd9HvoaO6_ubFxl6faKfu7vsrK4c8KsCLPyLZYUQ6S_SPoiqCkWfoS_k2kMaQOFvW7Ijkz5JJTmvmw616xc2pUNDmZWgOCabHLfdysRsO15iO_VTq5-bVh7GaH7cAWDYTXsTCFPjGy5eKIdNFGmA1Rox3-J7Rb44woFtWzN8Gn20K_Xd-2qUS3g1CsJLtiUQrb0wqOEPkxfiS6pWGmM",
  },
  {
    _id: "6",
    name: "Aged Rum",
    price: 28.0,
    rating: 4.4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5jGsfFWeWSVRk0VTjWBYih4Vs7kJWfoRKwGFtxZssBL1YbxclxhibFl8zsKamsmmIUcwJ2Rx183pckZ2Rp-KHo5_NbUufqbMNjQC-Ts8F6TNnuhDPMGlkMPTS07sT0_R2sr5jEu38Crx9CgG9TQogb216ZS2GMeSubgdkvvU9lRIbbBKPNiN6zsaubg-avXOj7HX-i59NUujVbdnqHbjYK4XfU1nrvgR_7PizUH34tCuPAbTjfJzdRCUKPTx61rXjC1_DnJuBBms",
  },
  {
    _id: "7",
    name: "Smooth Scotch",
    price: 55.0,
    rating: 4.9,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmwJVhd6CJcQraXWYXYRPG3VV1U9TpqORL7QTLbBW3zmmPxo2SW_ncfjzqRjoU3NTg15Q8v6oyzz_4eQY_9jJcGlsWugkJy2bjn-ni1bBrmBfq7ZAUNg2CSQOWAdKE5GqAOLN30M8C4TSRB-2t_slVZUogp5nh25Ob5iilgBalOsAEdTpfCCdmjChmKVzmeksZ3FzpkvHOONSCu0EDa6jVbywjaq_6OcRoyGZE7VH49WCi7W5fNf7pAgqYq-eQrXfeR-043Ufxcbc",
  },
  {
    _id: "8",
    name: "Red Wine Select",
    price: 22.0,
    rating: 4.5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfjsCNi9--Brkd30QaHf3dMvx-iLXp22HwT-n-B28UQT6Gx1OrIh7NFhfJd6tvWPmsfINfMm83ericSM90qUVjcs5Aw4giff5tfbXxMs660NAxEi1rpqyrN6rsOWfq4w9SmozJcwa7MY53AEC5M4xL51zlJOF6-4Uya_ArDK8nc-la34E81JRzJmqp_vqUIJ0zrXeLL6hH2sedlum10AmhrcOZjz2CPON01tn-kPldNqdybYy_4LKo-EnIm0fC932xG3IBk1RxFTY",
  },
  {
    _id: "9",
    name: "Crisp White Wine",
    price: 21.0,
    rating: 4.6,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEmPJrVMnwnITXartJPyqOvHEga4HNABZqdovOfzSpMygIkdP0I3OB2pRxYUJvcvhE1hi8kYxSH_8pdLI1WCU-xW_l_P06ZpQlQ-B4qHJUZqzDa_4fyoFITU2xWzNJnhWbDInakeeQuIBtI32H33FdQ0PqXoXgMFm4GNggGjWMdG3VLs_ld_y-D21FlSwD8YOH-sd1zgLwb09218hF4f1kVGvr1bYRJ3A621wxALQDNWfXFJpajc2Q5myFRHCefRWmU-7gfyWebMo",
  },
];

const ShopProductGrid = () => {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ShopProductCard key={product._id} product={product} />
        ))}
      </div>

      <Pagination />
    </div>
  );
};

export default ShopProductGrid;
