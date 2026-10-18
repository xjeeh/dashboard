import React from "react";
import { getErrorMessage, type FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

export const AppError = ({ error, resetErrorBoundary }: FallbackProps) => {
  alert(error);
  const title = "An error has occurred";
  const body = `The application encountered an error and you have been returned to the entry page. If this error persists, or
      unexpected behavior occurred during or before this error, please contact your administrator.`;

  const navigate = useNavigate();

  const goBack = () => {
    resetErrorBoundary();
    navigate("/");
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
      <pre>{getErrorMessage(error)}</pre>
      <button onClick={goBack}>Try again</button>
    </div>
  );
};
