import React, { useEffect, useState } from "react";
import axios from "axios";
import Product from "../components/Products/Product";

export default function ByProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // 🔥 Change this to your actual email
    const userEmail = "kalviumS76@gmail.com";  

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/by-email/${userEmail}`);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError("No products found for this email.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [userEmail]);

    if (loading) return <p className="text-white text-center">Loading products...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="w-full min-h-screen bg-neutral-800 p-10">
            <h2 className="text-3xl font-bold text-white text-center mb-6">My Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <Product 
                        key={product._id}
                        name={product.name}
                        description={product.description}
                        images={product.images}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    );
}
