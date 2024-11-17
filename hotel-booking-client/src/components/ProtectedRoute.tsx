import React, { PropsWithChildren } from "react";
import { User } from "../modules/types";
import { useAuth } from "./AuthProvider";
import LoadingSpinner from "./LoadingSpinner";
import NotFoundPage from "../pages/NotFoundPage";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: User["groups"];
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();
  if (currentUser === undefined) {
    return <LoadingSpinner />;
  }
  if (
    currentUser === null ||
    (allowedRoles && !allowedRoles.every((g) => currentUser.groups.includes(g)))
  ) {
    return <NotFoundPage />;
  }
  return children;
};

export default ProtectedRoute;
