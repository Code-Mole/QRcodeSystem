import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    program: "",
    contact: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5005/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.program.toLowerCase().includes(search.toLowerCase()) ||
      user.contact.toLowerCase().includes(search.toLowerCase()) ||
      (user.accessCode &&
        user.accessCode.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditForm({
      name: user.name,
      program: user.program,
      contact: user.contact,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    await fetch(`http://localhost:5005/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditUserId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5005/api/users/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          className="dashboard-search"
        />
        <button className="dashboard-export" onClick={handleExport}>
          Export to Excel
        </button>
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>
              Name {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("program")}>
              Program{" "}
              {sortKey === "program" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("contact")}>
              Contact{" "}
              {sortKey === "contact" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("accessCode")}>
              Access Code{" "}
              {sortKey === "accessCode"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user._id}>
              <td>
                {editUserId === user._id ? (
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editUserId === user._id ? (
                  <input
                    name="program"
                    value={editForm.program}
                    onChange={handleEditChange}
                  />
                ) : (
                  user.program
                )}
              </td>
              <td>
                {editUserId === user._id ? (
                  <input
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                  />
                ) : (
                  user.contact
                )}
              </td>
              <td>{user.accessCode}</td>
              <td>
                {editUserId === user._id ? (
                  <>
                    <button
                      className="dashboard-btn"
                      onClick={() => handleUpdate(user._id)}
                    >
                      Save
                    </button>
                    <button
                      className="dashboard-btn"
                      onClick={() => setEditUserId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="dashboard-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="dashboard-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
