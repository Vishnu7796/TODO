import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

export default function Header(props) {
  const { keycloak, initialized } = useKeycloak();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {props.title}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          {!props.subscription && (
            <Link to="/makepayment">
              <button type="button" className="btn btn-primary">
                Buy Premium
              </button>
            </Link>
          )}

          {!keycloak.authenticated && (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => keycloak.login()}
            >
              Login
            </button>
          )}

          {!!keycloak.authenticated && (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => keycloak.logout()}
            >
              Logout ({keycloak.tokenParsed.preferred_username})
            </button>
          )}
          {props.searchBar ? (
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
}
Header.defaultProps = {
  title: "Your Title Here",
  searchBar: true,
};

Header.propTypes = {
  title: PropTypes.string,
  searchBar: PropTypes.bool.isRequired,
};
