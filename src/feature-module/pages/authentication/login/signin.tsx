import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { all_routes } from "../../../../routes/all_routes";
import { appleLogo, facebookLogo, googleLogo, logoPng, logoWhitePng } from "../../../../utils/imagepath";
import { loginUser } from "../../../../core/redux/authSlice";
// import { RootState, AppDispatch } from "../../../../core/redux/store";
import type { RootState, AppDispatch } from "@/core/redux/store";

const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const route = all_routes;

  const { loading, userInfo, error, success } = useSelector(
    (state: RootState) => state.auth
  );

  const togglePasswordVisibility = (): void => {
    setPasswordVisible((prevState: boolean) => !prevState);
  };

  useEffect(() => {
    // Redirect if login is successful or user info already exists
    if (success || userInfo) {
      navigate(route.newdashboard);
    }
  }, [navigate, userInfo, success, route.newdashboard]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const loginData = {
        "Email id": email,
        Password: password,
      };
      dispatch(loginUser(loginData));
    }
  };

  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper bg-img">
            <div className="login-content authent-content">
              <form onSubmit={handleLogin}>
                <div className="login-userset">
                  <div className="login-logo logo-normal">
                    <img src={logoPng} alt="img" />
                  </div>
                  <Link to={route.dashboard} className="login-logo logo-white">
                    <img src={logoWhitePng} alt="Img" />
                  </Link>
                  <div className="login-userheading">
                    <h3>Sign In</h3>
                    <h4 className="fs-16">
                      Access Grandeur Bath v2.0 with email & passcode.
                    </h4>
                  </div>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger"> *</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control border-end-0"
                        required
                      />
                      <span className="input-group-text border-start-0">
                        <i className="ti ti-mail" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Password <span className="text-danger"> *</span>
                    </label>
                    <div className="pass-group">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="pass-input form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        className={`ti toggle-password text-gray-9 ${isPasswordVisible ? "ti-eye" : "ti-eye-off"
                          }`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    </div>
                  </div>
                  <div className="form-login authentication-check">
                    <div className="row">
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <div className="custom-control custom-checkbox">
                          <label className="checkboxs ps-4 mb-0 pb-0 line-height-1 fs-16 text-gray-6">
                            <input type="checkbox" className="form-control" />
                            <span className="checkmarks" />
                            Remember me
                          </label>
                        </div>
                        {/* <div className="text-end">
                          <Link
                            className="text-orange fs-16 fw-medium"
                            to={route.forgotPassword}
                          >
                            Forgot Password?
                          </Link>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </button>
                  </div>
                  {/* <div className="signinform">
                    <h4>
                      New on our platform?
                      <Link to={route.register} className="hover-a">
                        {" "}
                        Create an account
                      </Link>
                    </h4>
                  </div> */}
                  {/* <div className="form-setlogin or-text">
                    <h4>OR</h4>
                  </div> 
                  {/* <div className="mt-2">
                    <div className="d-flex align-items-center justify-content-center flex-wrap">
                      <div className="text-center me-2 flex-fill">
                        <Link
                          to="#"
                          className="br-10 p-2 btn btn-info d-flex align-items-center justify-content-center"
                        >
                          <img
                            className="img-fluid m-1"
                            src={facebookLogo}
                            alt="Facebook"
                          />
                        </Link>
                      </div>
                      <div className="text-center me-2 flex-fill">
                        <Link
                          to="#"
                          className="btn btn-white br-10 p-2  border d-flex align-items-center justify-content-center"
                        >
                          <img
                            className="img-fluid m-1"
                            src={googleLogo}
                            alt="google"
                          />
                        </Link>
                      </div>
                      <div className="text-center flex-fill">
                        <Link
                          to="#"
                          className="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center"
                        >
                          <img
                            className="img-fluid m-1"
                            src={appleLogo}
                            alt="Apple"
                          />
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © 2025 Grandeur Bath v2.0</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default Signin;
