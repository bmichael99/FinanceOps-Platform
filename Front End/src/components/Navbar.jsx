import React from 'react'

function navbar() {
  return (
    <>
    
    <header className="flex justify-center">
      <nav className="flex flex-1 max-w-6xl justify-between items-center">
        <a href="#"className="text-2xl">LOGO</a>
        <ul className="flex gap-2">
          <li><a href="#">Home</a></li>
          <li><a href="#">Log Out</a></li>
        </ul>
      </nav>
    </header>
    </>
  )
}

export default navbar