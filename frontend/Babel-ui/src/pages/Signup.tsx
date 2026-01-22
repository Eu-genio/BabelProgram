import { useState } from "react";
import type { UserResponse } from "../types/UserResponse";

function Signup() {
  const [usersList, setUsersList] = useState<UserResponse[]>([]);
  

  return (
    <div>
      <h1>Users</h1>
      <form>
        <div>
          <label>Name</label>
          <input type="text"/>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" />
        </div>
        <div>
          <label>Role:
            <select name="userRole">
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>
        <button type="submit">Register User</button>
      </form>

      <ul>
        {usersList.map (u => (
          <li key={u.id}> 
            {u.name} - {u.email} - {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Signup;