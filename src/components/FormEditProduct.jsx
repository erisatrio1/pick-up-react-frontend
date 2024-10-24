import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import axiosJWT from "../helpers/axios-inter"

const FormEditProduct = () => {
  const [name, setName] = useState(""); // state untuk nama produk
  const [price, setPrice] = useState(""); // state untuk harga produk
  const [categories, setCategories] = useState([{ category: "" }]); // state untuk kategori produk
  const [msg, setMsg] = useState(""); // state untuk pesan error atau sukses
  const navigate = useNavigate(); // untuk navigasi setelah berhasil mengedit produk
  const { id } = useParams(); // mengambil id dari parameter URL

  // Mengambil data produk berdasarkan id saat pertama kali component dimuat
  useEffect(() => {
    const getProductById = async () => {
      try {
        // Memanggil API untuk mendapatkan produk berdasarkan id
        const response = await axiosJWT.get(`http://localhost:3000/api/units/${unitId}`);
        // Mengisi form dengan data produk yang didapatkan
        setName(response.data.name);
        setPrice(response.data.price);
        setCategories(response.data.categories); // Mengisi kategori produk
      } catch (error) {
        // Menangani error jika produk tidak ditemukan atau terjadi masalah pada API
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getProductById();
  }, [id]); // effect akan dijalankan ketika id berubah

  // Fungsi untuk menangani perubahan kategori
  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].category = value; // Update kategori berdasarkan index
    setCategories(updatedCategories);
  };

  // Fungsi untuk menambahkan kategori baru
  const addCategory = () => {
    setCategories([...categories, { category: "" }]); // Tambahkan kategori baru
  };

  // Fungsi untuk menghapus kategori
  const removeCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories); // Update kategori setelah dihapus
  };

  // Fungsi untuk menangani submit form
  const updateProduct = async (e) => {
    e.preventDefault(); // mencegah reload page secara default ketika form disubmit
    try {
      // Mengirim permintaan PATCH untuk memperbarui produk
      await axiosJWT.patch(`http://localhost:3000/api/units/${unitId}`, {
        name: name,
        categories: categories,
        price: price,
      });
      // Mengarahkan ke halaman produk setelah berhasil mengedit produk
      navigate("/products");
    } catch (error) {
      // Menangani error yang terjadi dan menampilkan pesan error dari server
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
              {/* Menampilkan pesan error atau pesan dari server */}
              <p className="has-text-centered">{msg}</p>

              {/* Input untuk nama produk */}
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // Mengubah state 'name' saat input diubah
                    placeholder="Product Name"
                    required // Menandai input sebagai wajib
                  />
                </div>
              </div>

              {/* Input untuk kategori produk */}
              <div className="field">
                <label className="label">Categories</label>
                {categories.map((category, index) => (
                  <div key={index} className="control">
                    <input
                      type="text"
                      className="input"
                      value={category.category}
                      onChange={(e) => handleCategoryChange(index, e.target.value)} // Mengubah state kategori saat input diubah
                      placeholder="Category"
                      required // Menandai input sebagai wajib
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

              {/* Input untuk harga produk */}
              <div className="field">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} // Mengubah state 'price' saat input diubah
                    placeholder="Price"
                    required // Menandai input sebagai wajib
                  />
                </div>
              </div>

              {/* Tombol submit untuk memperbarui produk */}
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
