import React from "react";

const products = [
  { id: 1, name: "Product 1", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  { id: 2, name: "Product 2", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  { id: 3, name: "Product 3", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  { id: 4, name: "Product 4", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  { id: 5, name: "Product 5", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  { id: 6, name: "Product 6", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  { id: 7, name: "Product 7", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  { id: 8, name: "Product 8", image: "https://m.media-amazon.com/images/I/21sUKve+LOL._SX100_SY100_.png" },
  // Add more products as needed
];

const ProductMenu = () => {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex mx-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[70px] rounded-lg flex flex-col items-center justify-center mt-2"
          >
            <img src={product.image} alt={product.name} className="h-full object-cover rounded-md w-12" />
            <p className="text-center mt-2 text-xs">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMenu;
