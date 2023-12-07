/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import Layout from '@/components/Layout'
import NotFoundView from '@/pages/NotFoundView'
import Dashboard from '@/pages/Dashboard'
import PersonDetail from '@/pages/PersonDetail'
import LoginView from '@/pages/LoginView'
import Home from '@/components/Home'
import PeoplePublic from '@/pages/PeoplePublic'

const AUTH_REQUIRED: RouteObject[] = [
  {
    index: true,
    path: '',
    element: <Home />
  },
  {
    path: 'admin',
    element: <Dashboard />
  }
]

const router = createBrowserRouter([
  {
    path: 'login',
    element: <LoginView />
  },
  {
    path: '/',
    element: <Layout />,
    children: AUTH_REQUIRED
  },
  {
    path: 'usuario',
    element: <PersonDetail />
  },
  {
    path: 'usuarios',
    element: <PeoplePublic />
  },
  {
    path: '*',
    element: <NotFoundView />
  }
])

export default router
