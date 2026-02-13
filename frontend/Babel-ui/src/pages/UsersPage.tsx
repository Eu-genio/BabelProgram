import { useEffect, useState } from "react";
import type { UserResponse } from "../types/UserResponse";
import type { CreateUserRequest } from "../types/SignUpRequest"; // if you insist on this name
import type { UserRole } from "../types/UserRole"; // note: UserRole (PascalCase)
import { createUser, getUsers } from "../services/usersApi";

const emptyForm: CreateUserRequest = {
  name: "",
  email: "",
  role: "Student",
};

function UsersPage() {
  const [usersList, setUsersList] = useState<UserResponse[]>([]);
  const [formData, setFormData] = useState<CreateUserRequest>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const users = await getUsers();
      setUsersList(users);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? (value as UserRole) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await createUser(formData);
      setFormData(emptyForm);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create user");
    }
  };

  return (
    <div>
      <h1>Users</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading…</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <label>
            Role
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>

        <button type="submit">Register User</button>
      </form>

      <ul>
        <li>
        {usersList.map((u) => (
          <li key={u.id}>
            {u.id} - {u.name} - {u.email} - {u.role}
          </li>
        ))}
        </li>
      </ul>
    </div>
  );
}

export default UsersPage;
