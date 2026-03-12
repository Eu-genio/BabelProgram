import { login } from "../api/authApi";
import { useAuth } from "../auth/useAuth";

function Login() {
const { login: setAuth } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = await login(email, password);

  setAuth(result.token);
};
  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" placeholder="Enter username" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;