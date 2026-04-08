import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './layouts/MainLayout'
import ColorPalette from './pages/ColorPalette'
import LandingPage from './pages/landing/LandingPage'
import Game from './pages/game/Game'
import SignIn from './pages/signin/SignIn'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'color-palette', element: <ColorPalette /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'game', element: <Game /> },
    ],
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
