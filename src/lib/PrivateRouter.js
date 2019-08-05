import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRouter = ({
  component: Component,
  authed,
  adminCheck,
  ...rest
}) => {
  const redirectRoute = adminCheck ? "/" : "/login";

  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: redirectRoute, state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRouter;
