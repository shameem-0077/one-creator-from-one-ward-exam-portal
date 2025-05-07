export default function ProtectedWarning() {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>🚫 Access Denied</h1>
        <p>This page is protected. Please log in to access it.</p>
        <a href="/login" style={{ color: "blue", textDecoration: "underline" }}>
          Go to Login
        </a>
      </div>
    );
  }
  