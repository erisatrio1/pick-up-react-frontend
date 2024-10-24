import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import AddUser from './pages/AddUser'
import Products from './pages/Products'
import AddProduct from './pages/Addproduct'
import EditProduct from './pages/EditProduct'
import Users from './pages/Users'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          {/* <Route path="/users/edit/:id" element={<EditUser />} /> */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
