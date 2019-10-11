import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

// a component is a function that takes a prop param
// and returns JSX

// a HOC is a function that takes a component function as a param
// and returns a new component function

const OnboardingForm = props => {
  const [users, setUsers] = useState([]);

  const { status, touched, errors, values } = props;

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div className="user-form">
      <Form>
        <Field type="text" name="name" placeholder="name" />
        {touched.species && errors.species && (
          <p className="error">{errors.species}</p>
        )}
        <Field type="email" name="email" placeholder="email" />
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        <Field type="password" name="password" placeholder="password" />
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}
        <label className="checkbox-container">
          <Field type="checkbox" name="tos" checked={values.tos} /> Terms of
          Service
          <span className="checkmark" />
        </label>
        <button type="submit">Submit!</button>
      </Form>
      {users.map(user => (
        <ul key={user.id}>
          <li>Name: {user.name}</li>
          <li>Email: {user.email}</li>
          <li>Password: {user.password}</li>
          <li>Terms of Service: {user.tos ? "Yes" : "No"}</li>
        </ul>
      ))}
    </div>
  );
};

const myMapPropsToValues = props => {
  const { name, email, password, tos } = props;

  console.log(props);

  const returnObj = {
    name: name || "",
    email: email || "",
    password: password || "",
    tos: tos || false
  };

  return returnObj;
};

const myHandleSubmit = (values, { setStatus }) => {
  console.log("submit pressed! ... sending...");
  axios
    .post("https://reqres.in/api/users/", values)
    .then(res => {
      console.log(res);
      setStatus(res.data);
    })
    .catch(err => console.log(err));
};

const yupSchema = Yup.object().shape({
  name: Yup.string().required("Please enter your  name."),
  email: Yup.string().required("Please enter your email address."),
  password: Yup.string().required("Please enter a password.")
});

const formikObj = {
  mapPropsToValues: myMapPropsToValues,
  handleSubmit: myHandleSubmit,
  validationSchema: yupSchema
};

const EnhancedFormHOC = withFormik(formikObj);

const EnhancedForm = EnhancedFormHOC(OnboardingForm);

export default EnhancedForm;
