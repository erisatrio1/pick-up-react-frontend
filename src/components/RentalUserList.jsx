import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import axiosJWT from "../helpers/axios-inter"
import { useSelector } from "react-redux";

const RentalUserList = ({access_token}) => {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { accessToken, user } = useSelector((state) => state.auth);

  useEffect(() => {
    getProducts();
  }, [refresh]);

  const getProducts = async () => {
    try {
        console.log(accessToken);
      const response = await axios.get("http://localhost:3000/api/rentals", {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      setProducts(response.data.data); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const saveProduct = async (unitId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/rentals/${unitId}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        }
      );
      setRefresh(!refresh)
    } catch (error) {
    }
  };
  

  return (
    <div>
      <h1 className="title">Rentals</h1>
      <h2 className="subtitle">List of Rentals</h2>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Rent Start Time</th>
            <th>Rent End Time</th>
            <th>Due Date</th>
            <th>Fine per day</th>
            <th>Total Fine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.rent_start}</td>
              {product.rent_end === null ? (
                <td>Belum Return</td>
                ) : (
                <td>{product.rent_end}</td>
                )}
              <td>{product.due_date}</td>
              <td>{product.fine_per_day}</td>
              <td>{product.total_fine}</td>
              <td>
              <button
                  onClick={() => saveProduct(product.id)}
                  className="button is-small is-info"
                >
                  Done
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalUserList;
