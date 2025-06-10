import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./Layout.tsx";
import Layout2 from "./Layout2.tsx";
import FilterContextProvider from "./Context/filterProvider.tsx";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <FilterContextProvider>
      {role === "ROLE_ADMIN" ? <Layout2 /> : <Layout />}
    </FilterContextProvider>
  );
}

export default App;
