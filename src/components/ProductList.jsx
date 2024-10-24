import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import axiosJWT from "../helpers/axios-inter"

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:3000/api/units");
      setProducts(response.data.data); // Mengakses data dari respons API
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axiosJWT.delete(`http://localhost:3000/api/units/${productId}`);
      getProducts(); // Memperbarui daftar produk setelah dihapus
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">List of Products</h2>
      <Link to="/products/add" className="button is-primary mb-2">
        Add New
      </Link>
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
                {/* Menampilkan kategori produk */}
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
                  to={`/products/edit/${product.id}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
