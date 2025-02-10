// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8000/api/products");
//                 setProducts(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 setError("Failed to fetch products.");
//                 setLoading(false);
//             }
//         };

//         fetchProducts();
//     }, []);

//     if (loading) return <p className="text-white text-center">Loading products...</p>;
//     if (error) return <p className="text-red-500 text-center">{error}</p>;

//     return (
//         <div className="bg-black min-h-screen p-10">
//             <h2 className="text-3xl font-bold text-white text-center mb-6">My Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {products.map((product) => (
//                     <ProductCard key={product._id} product={product} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// const ProductCard = ({ product }) => {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     useEffect(() => {
//         if (product.images.length > 1) {
//             const interval = setInterval(() => {
//                 setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
//             }, 3000); 

//             return () => clearInterval(interval); 
//         }
//     }, [product.images.length]);

//     return (
//         <div className="border border-gray-700 bg-gray-900 rounded-lg p-4 shadow-lg text-white">
//             <img
//                 src={`http://localhost:8000/${product.images[currentImageIndex]}`}
//                 alt={product.name}
//                 className="w-full h-40 object-cover rounded transition-opacity duration-500"
//             />
//             <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
//             <p className="text-gray-400">{product.category}</p>
//             <p className="text-gray-200 font-bold">${product.price}</p>
//             <p className="text-sm text-gray-400">{product.description}</p>
//         </div>
//     );
// };

// export default MyProducts;
