import { Outlet } from "react-router-dom"
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="App">
          {/* Header and footer will go here */}
          <Outlet />
      </main>
    </>
  )
}

export default Layout