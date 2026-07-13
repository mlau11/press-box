import { createContext, useContext, useState } from 'react'

interface AuthModalContextType {
  isOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AuthModalContext = createContext<AuthModalContextType>({
  isOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
})

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openAuthModal = () => setIsOpen(true)
  const closeAuthModal = () => setIsOpen(false)

  return (
    <AuthModalContext.Provider value={{ isOpen, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => useContext(AuthModalContext)