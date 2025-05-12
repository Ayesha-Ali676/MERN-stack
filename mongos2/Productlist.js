import '../Style/style.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
    const [product, setProduct] = useState([]);
  

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = async () => {
        let result = await fetch('http://localhost:5000/product');
        result = await result.json();
        setProduct(result);
    };


    let productdelet = async (id) => {
        let res = await fetch(`http://localhost:5000/products/${id}`, {
            method: "DELETE"
        });
        res = await res.json();
        getProduct();

    };

    // const handleChange = async (e) => {
    //     let key = e.target.value;
      
    //     if (key) {
    //         let result = await fetch(`http://localhost:5000/search/${key}`);
    //         result = await result.json();
    //         console.log(result); // You can remove this in production
    //         setProduct(result); // Update the product list based on search result
    //     } else {
    //         getProduct(); // If no key is entered, fetch all products
    //     }
    // };

    const handleChange = async (e) => {
        let key = e.target.value;
        
        if (key) {
            let result = await fetch(`http://localhost:5000/search/${key}`);
            if (!result.ok) {
                console.error('Failed to fetch data');
                return;
            }
            result = await result.json();
            if (result.length === 0) {
                console.log('No products found');
                setProduct([]); // Handle empty results gracefully
            } else {
                setProduct(result);
            }
        } else {
            getProduct();
        }
    };



    return (
        <div className="parent">
            <h1>Product list</h1>
            <input placeholder=" search" onChange={handleChange} className="form_style" type="text" />
            <ul className="list">
                <li>serial No</li>
                <li>Name</li>
                <li> price</li>
                <li>category</li>
                <li>company</li>
            </ul>
            {product.map((item, index) => {
                return (
                    <ul key={item._id}>
                        <li><span>Serial No</span> {index + 1}</li>
                        <li><span>Name</span> {item.name}</li>
                        <li><span>Price</span> {item.price}</li>
                        <li><span>Category</span> {item.category}</li>
                        <li><span>Company</span> {item.company}</li>
                        <li>
                            <button className='delet' onClick={() => productdelet(item._id)}>Delete</button>
                            <Link  className="update" to={`/update/${item._id}`}>Update</Link>
                        </li>

                    </ul>
                )
            })}
        </div>
    );
}
export default ProductList;