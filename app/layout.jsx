'use client'
import React, { createContext, useState } from 'react'
import { Roboto } from 'next/font/google'


export const UserContext = createContext(null)

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          {children}
        </UserContext.Provider>
      </body>
    </html>
  )
}