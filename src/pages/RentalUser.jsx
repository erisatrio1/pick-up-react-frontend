import React, { useEffect } from "react";
import Layout from "./Layout";
import ProductList from "../components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../slice/authSlice";
import RentalList from "../components/RentalList";
import RentalUserList from "../components/RentalUserList";

const RentalUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);
  return (
    <Layout>
      <RentalUserList />
    </Layout>
  );
};

export default RentalUser;
