import React, { useEffect, useState } from "react";

export default function Product({ name, description, images, price }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000); // Change image every 3 seconds

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [images.length]);

    return (
        <div className="bg-neutral-200 p-4 rounded-lg shadow-md flex flex-col justify-between">
            <div className="w-full">
                <img 
                    src={`http://localhost:8000/${images[currentImageIndex]}`} 
                    alt={name} 
                    className="w-full h-56 object-cover rounded-lg mb-2 transition-opacity duration-500" 
                />
                <h2 className="text-lg font-bold">{name}</h2>
                <p className="text-sm opacity-50 line-clamp-2">{description}</p>
            </div>
            
            <div className="w-full">
                <p className="text-lg font-bold my-2">${price}</p>
                <button className="w-full text-white px-4 py-2 rounded-md bg-neutral-900">
                    More Info
                </button>
            </div>
        </div>
    );
}
