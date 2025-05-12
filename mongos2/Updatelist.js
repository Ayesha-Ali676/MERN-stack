// import React from 'react';
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from "react-router-dom"
// import '../Style/style.css';

// function Updatelist() {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [company, setCompany] = useState("");
//   let params = useParams();
 
//   let navigate = useNavigate();
// useEffect(() => {
//   getProductdetail();
// }, []);


//   const click = async () => {
//     let res = await fetch(`http://localhost:5000/products/${params.id}`, {
//       method: 'PUT',  
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({ name, price, category, company })
//     });
  
//     res = await res.json();
//     navigate("/");
//     console.log(res);
//   };
  

// let getProductdetail = async () => {
//   try {
//     let res = await fetch(`http://localhost:5000/products/${params.id}`);
//     if (!res.ok) {
//       throw new Error("Failed to fetch product");
//     }
//     res = await res.json();
//     console.log(res);
//     setName(res.name);
//     setPrice(res.price);
//     setCategory(res.category);
//     setCompany(res.company);
//   } catch (error) {
//     console.error("Error fetching product:", error.message);
//   }
// };
   
//   return (
//     <>
//        <div className="signup-container">
      
//        <div className="signup-box">
//        <h1>Update Product</h1>
//         <input placeholder=" Name"value={name} onChange={(e) => setName(e.target.value)} className="form_style" type="text" />
    
//         <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="form_style" type="text" />
       
//         <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="form_style" type="text" />
        
//         <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="form_style" type="text" />
      
//         <button type ="button"onClick={click} >Update Product</button>
//       </div>
//       </div>
//     </>
//   );
// };

// export default Updatelist;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Style/style.css';

function Updatelist() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/products/${id}`)
        .then(res => {
          if (!res.ok) {
            console.error("Failed to fetch product");
            return;
          }
          return res.json();
        })
        .then(data => {
          setName(data.name || "");
          setPrice(data.price || "");
          setCategory(data.category || "");
          setCompany(data.company || "");
        });
      }
  }, [id]);

  const updateProduct = () => {
    fetch(`http://localhost:5000/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, category, company })
    })
      .then(res => {
        if (!res.ok) {
          console.error("Failed to update product");
          return;
        }
        return res.json();
      })
      .then(result => {
        console.log("Product updated:", result);
        navigate("/");
      });
  };
  // Fetch product details
  // useEffect(() => {
  //   async function getProductDetail() {
  //     const res = await fetch(`http://localhost:5000/products/${id}`);
  //     const data = await res.json();

  //     setName(data.name || "");
  //     setPrice(data.price || "");
  //     setCategory(data.category || "");
  //     setCompany(data.company || "");
  //   }

  //   getProductDetail();
  // }, [id]);

  // // Update product details
  // const updateProduct = async () => {
  //   const res = await fetch(`http://localhost:5000/products/${id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ name, price, category, company })
  //   });

  //   const result = await res.json();
  //   console.log("Product updated:", result);
  //   navigate("/");
  // };


  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Update Product</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="form_style"
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="form_style"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="form_style"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="form_style"
        />
        <button type="button" onClick={updateProduct}>
          Update Product
        </button>
      </div>
    </div>
  );
}

export default Updatelist;
