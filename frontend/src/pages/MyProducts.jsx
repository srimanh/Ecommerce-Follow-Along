import React, { useEffect, useState } from "react";
// import Product from "../components/Products/Product";
import  MyProducts  from "../components/MyProduct/myproducts";
import Navbar from "../components/navbar";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
export default function MyProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const email = "srimandgl2004@gmail.com";
    const email = useSelector((state) => state.user.email);
    // const navigate = useNavigate();
   
    console.log(email); 
        

    useEffect(() => {
        if (!email) return; // If no email, do not fetch products
        fetch(`http://localhost:8000/api/v2/product/my-products?email=${email}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setProducts(data.products);
                setLoading(false);
            })
            .catch((err) => {
                console.error(" Error fetching products:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [email]);

    if (loading) {
        return <div className="text-center text-white mt-10">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }

    return (
        <>
        <Navbar />
        <div className="w-full min-h-screen bg-neutral-800">
            <h1 className="text-3xl text-center text-white py-6">My products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                {products.map((product) => (
                    <MyProducts key={product._id} {...product} />
                ))}
            </div>
        </div>
        </>
    );
}