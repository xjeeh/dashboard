import { getErrorMessage, type FallbackProps } from "react-error-boundary";

export const AppError = ({ error, resetErrorBoundary }: FallbackProps) => {
  const title = "An error has occurred";
  const body = `The application encountered an error. If this persists, please contact your administrator.`;

  return (
    <div style={{ padding: 24, color: "#eee", background: "#2f3242", minHeight: "100vh" }}>
      <h1>{title}</h1>
      <p>{body}</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{getErrorMessage(error)}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
};
