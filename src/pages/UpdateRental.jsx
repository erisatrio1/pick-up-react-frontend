import React, { useEffect } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../slice/authSlice";
import FormAddRental from "../components/FormAddRental";

const AddRental = () => {
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
      <FormAddRental/>
    </Layout>
  );
};

export default AddRental;
