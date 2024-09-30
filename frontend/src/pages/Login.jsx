import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles/Login.module.css";
import { history } from "../helpers";
import { authActions } from "../store";

const Login = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x.auth.user);
  const authError = useSelector((x) => x.auth.error);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }) {
    return dispatch(authActions.login({ username, password }));
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src="/loginPoster.jpg" alt="" className={styles.image} />
        </div>
        <div className={styles.inputElements}>
          <h4 className={styles.cardHeader}>Login</h4>
          <div className={styles.cardBody}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <input
                  name="username"
                  type="email"
                  placeholder="Email"
                  {...register("username")}
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                />
                <div className={styles.invalidFeedback}>
                  {errors.username?.message}
                </div>
              </div>
              <div className="form-group">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <div className={styles.invalidFeedback}>
                  {errors.password?.message}
                </div>
              </div>
              <button disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Login
              </button>
              {authError && (
                <div className="alert alert-danger mt-3 mb-0">
                  {authError.message}
                </div>
              )}
              <p>
                Don't have an account yet?
                <Link to="/register" className={styles.link}>
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
