import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    return (
        <div className='navbar'>
            <h1>Ecommerce Store</h1>
            <div>
                <button onClick={() => { navigate('/addproduct') }}>Add Product</button>
                <button onClick={() => { navigate('/') }}>View Products</button>
            </div>
        </div>
    )
}

export default Navbar