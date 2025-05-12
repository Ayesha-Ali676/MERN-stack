import { useState } from 'react';
import '../Style/style.css';

function Addproduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const[error, setError] = useState(false);

  const click =  async () =>  {
    console.log(name, price, category, company)
if (!name|| !price || !category|| !company){
  setError(true);
  return false;
}


    let res = await fetch('http://localhost:5000/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  name, price, category, company})
    });
    res = await res.json();
    console.log(res);
   };
 
   
  return (
    <>
       <div className="signup-container">
       <div className="signup-box">
        <input placeholder=" Name"value={name} onChange={(e) => setName(e.target.value)} className="form_style" type="text" />
        {error && !name && <span>name is required</span>}
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="form_style" type="text" />
        {error && !price && <span>price is required</span>}
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="form_style" type="text" />
        {error && !category && <span>category is required</span>}
        <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="form_style" type="text" />
        {error && !company && <span>company is required</span>}
        <button type ="button" onClick={click}>Add Product</button>
      </div>
      </div>
    </>
  );
};

export default Addproduct;