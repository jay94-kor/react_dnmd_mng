import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RootLayout } from '@/layouts/RootLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectListPage } from '@/pages/projects/ProjectListPage'
import { ProjectFormPage } from '@/pages/projects/ProjectFormPage'
import { ProjectDetailPage } from '@/pages/projects/ProjectDetailPage'
import { POListPage } from '@/pages/pos/POListPage'
import { POFormPage } from '@/pages/pos/POFormPage'
import { PODetailPage } from '@/pages/pos/PODetailPage'
import { SettingsPage } from '@/pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: '/',
                element: <DashboardPage />,
              },
              {
                path: 'projects',
                children: [
                  {
                    index: true,
                    element: <ProjectListPage />,
                  },
                  {
                    path: 'new',
                    element: <ProjectFormPage />,
                  },
                  {
                    path: ':id',
                    element: <ProjectDetailPage />,
                  },
                  {
                    path: ':id/edit',
                    element: <ProjectFormPage mode="edit" />,
                  },
                ],
              },
              {
                path: 'pos',
                children: [
                  {
                    index: true,
                    element: <POListPage />,
                  },
                  {
                    path: 'new',
                    element: <POFormPage />,
                  },
                  {
                    path: ':id',
                    element: <PODetailPage />,
                  },
                ],
              },
              {
                path: 'settings',
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
