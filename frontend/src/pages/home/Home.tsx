export const Home: React.FC = () => {
  const token = localStorage.getItem("token");
  return (
    <div>
      <h1>Home Page</h1>
      {token ? <h1>LoggedIn</h1> : <h1>Not LoggedIn</h1>}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Signout
      </button>
    </div>
  );
};
