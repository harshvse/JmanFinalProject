import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles/Register.module.css";
import { history } from "../helpers";
import { authActions } from "../store";
import { Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x.auth.user);
  const authError = useSelector((x) => x.auth.error);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ email, password, firstName, lastName, photo }) {
    return dispatch(
      authActions.register({ email, password, firstName, lastName, photo })
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src="/loginPoster.jpg" alt="" className={styles.image} />
        </div>
        <div className={styles.inputElements}>
          <h4 className={styles.cardHeader}>Register</h4>
          <div className={styles.cardBody}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                <div className={styles.invalidFeedback}>
                  {errors.email?.message}
                </div>
              </div>
              <div className="form-group">
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
              <div className="form-group">
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className={`form-control ${
                    errors.firstName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.firstName?.message}
                </div>
              </div>
              <div className="form-group">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.lastName?.message}
                </div>
              </div>
              <button disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Register
              </button>
              {authError && (
                <div className="alert alert-danger mt-3 mb-0">
                  {authError.message}
                </div>
              )}
              <p>
                Already have an Account?{" "}
                <Link to="/login" className={styles.link}>
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
