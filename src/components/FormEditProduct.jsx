import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import axiosJWT from "../helpers/axios-inter"
import { useSelector } from "react-redux";

const FormEditProduct = () => {
  const [name, setName] = useState(""); 
  const [price, setPrice] = useState(0); 
  const [categories, setCategories] = useState([{ category: "" }]); 
  const [msg, setMsg] = useState(""); 
  const navigate = useNavigate(); 
  const { unitId } = useParams(); 
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/units/${unitId}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        });
        setName(response.data.name);
        setPrice(response.data.price);
        setCategories(response.data.categories); 
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.errors);
        }
      }
    };
    getProductById();
  }, [unitId]); 

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].category = value; 
    setCategories(updatedCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { category: "" }]); 
  };

  const removeCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories); 
  };

  const updateProduct = async (e) => {
    e.preventDefault(); 
    try {
      await axios.patch(`http://localhost:3000/api/units/${unitId}`, {
        name: name,
        categories: categories,
        price: Number(price),
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      navigate("/products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Edit Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateProduct}>
              <p className="has-text-centered">{msg}</p>

              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Product Name"
                    required 
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Categories</label>
                {categories.map((category, index) => (
                  <div key={index} className="control">
                    <input
                      type="text"
                      className="input"
                      value={category.category}
                      onChange={(e) => handleCategoryChange(index, e.target.value)} 
                      placeholder="Category"
                      required 
                    />
                    <button type="button" onClick={() => removeCategory(index)} className="button is-danger is-small">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addCategory} className="button is-info is-small">
                  Add Category
                </button>
              </div>

              <div className="field">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="Price"
                    required 
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditProduct;
