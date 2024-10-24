import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import axiosJWT from "../helpers/axios-inter"
import { useSelector } from "react-redux";

const FormAddRental = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { unitId } = useParams();
  const { accessToken, } = useSelector((state) => state.auth);

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/rentals/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    );
      navigate("/rental");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.errors);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Add New Rental</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveProduct}>
              <p className="has-text-centered">{msg}</p>

              <div className="field">
                <label className="label">Due date</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
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

export default FormAddRental;
