import CartProduct from '../components/CartProduct'
import Nav from '../components/navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../axiosConfig';

const Cart = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate()
    const email = useSelector((state) => state.user.email); // Get email from Redux store
    useEffect(() => {
        if (!email) return;
        axios.get(`/api/v2/product/cartproducts?email=${email}`)
        // fetch(`http://localhost:8000/api/v2/product/cartproducts?email=${'abhisa8888@gmail.com'}`)
        //   .then((res) => {
        //     if (!res.ok) {
        //       throw new Error(`HTTP error! status: ${res.status}`);
        //     }
        //     return res.json();
        //   })
          .then((data) => {
            setProducts(data.cart.map(product => ({quantity: product['quantity'], ...product['productId']})));
            console.log("Products fetched:", data.cart);
          })

          // {
          //   "quantity": 2,
          //   "productId": {
          //     "_id": "123",
          //     "name": "Laptop",   //product.productId.name
          //     "price": 50000
          //   }
          // }

          // into:

          // {
          //   "quantity": 2,
          //   "_id": "123",
          //   "name": "Laptop",   //product.name
          //   "price": 50000
          // }
          
          .catch((err) => {
            console.error(" Error fetching products:", err);
          });
      }, [email]);
    
      console.log("Products:", products);

     const handlePlaceOrder= () => {
      navigate('/select-address')
     }
    return (
        <div className='w-full h-screen'>
            <Nav />
            <div className='w-full h-full justify-center items-center flex'>
                <div className='w-full md:w-4/5 lg:w-4/6 2xl:w-2/3 h-full border-l border-r border-neutral-300 flex flex-col'>
                    <div className='w-full h-16  flex items-center justify-center'>
                        <h1 className='text-2xl font-semibold'>Cart</h1>
                    </div>
                    <div className='w-full flex-grow overflow-auto px-3 py-2 gap-y-2'>
                        {
                            products.map(product => (
                                <CartProduct key={product._id} {...product} />
                            ))
                        }
                    </div>
                    <div className='w-full flex p-4 justify-end'>
                         <button 
                         onClick={handlePlaceOrder}
                         className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700'
                         >
                           Place Order
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Cart;