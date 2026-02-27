import { useState } from 'react'
import { Visitor } from './pages/visitor'     
import { AdminLogin } from './pages/adminlogin'
import { Admin } from './pages/admin'


function App() {
  const [page, setPage] = useState(0)

  return (
    <>
      {page === 0 && <Visitor switchPage={() => setPage(1)} />}
      {page === 1 && <AdminLogin goBack={() => setPage(0)} switchPage={() => setPage(2)}/>}
      {page === 2 && <Admin switchPage={() => setPage(0)}/>}
    </>
  )
}

export default App
