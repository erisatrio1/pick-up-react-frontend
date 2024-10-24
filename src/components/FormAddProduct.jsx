import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosJWT from "../helpers/axios-inter"
import { useSelector } from "react-redux";

const FormAddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category1, setCategory1] = useState(""); // For first category
  const [category2, setCategory2] = useState(""); // For second category
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/units", {
        name: name,
        categories: [
          { category: category1 }, 
          { category: category2 }
        ],
        price: Number(price),
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      navigate("/products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.errors);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Add New Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveProduct}>
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
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Category 1</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={category1}
                    onChange={(e) => setCategory1(e.target.value)}
                    placeholder="Category 1"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Category 2</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={category2}
                    onChange={(e) => setCategory2(e.target.value)}
                    placeholder="Category 2"
                  />
                </div>
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
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Save
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

export default FormAddProduct;
