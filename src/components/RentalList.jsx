import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import axiosJWT from "../helpers/axios-inter"
import { useSelector } from "react-redux";

const RentalList = ({access_token}) => {
  const [products, setProducts] = useState([]);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
        console.log(accessToken);
      const response = await axios.get("http://localhost:3000/api/units", {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
      setProducts(response.data.data); 
    } catch (error) {
      console.error("Error fetching products:", error);
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
            <th>Product Name</th>
            <th>Categories</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>
                {product.categories.map((cat, idx) => (
                  <span key={idx}>
                    {cat.category}
                    {idx < product.categories.length - 1 ? ", " : ""}
                  </span>
                ))}
              </td>
              <td>{product.price}</td>
              <td>
                <Link
                  to={`/rental/${product.id}`}
                  className="button is-small is-info"
                >
                  Rental
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalList;
