import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'

let baseUrl = '';
if (window.location.href.split(':')[0] === 'http') {
    baseUrl = 'http://localhost:5001';
}

const ViewProducts = () => {
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        getAllProducts()
    }, [])

    const getAllProducts = async () => {
        try {
            const response = await axios.get(`${baseUrl}/products`)
            console.log("Fetching Products: ", response.data);
            setAllProducts(response.data.data)
        } catch (error) {
            console.log("Error Fetching Products", error);
        }
    }
    return (
        <div className='allProducts'>
            {
                allProducts.map((product) => (
                    <div className="card">
                        <div className="cardImage">
                            <img src="https://source.unsplash.com/345x140/?products" alt="Product" />
                        </div>
                        <div className="cardName">{product.name}</div>
                        <div className="cardPrice">$ {product.price}</div>
                        <div className="cardDescription">{product.description}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default ViewProducts