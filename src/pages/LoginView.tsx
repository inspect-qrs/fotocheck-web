import { AuthService } from '@/api/auth.service'
import { useAuthStore } from '@/config/store/auth'
import React, { ReactElement, useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

export interface Login {
  username: string
  password: string
}

const INITIAL_VALUE = {
  username: '',
  password: ''
}

const LoginView = (): ReactElement => {
  const authService = new AuthService()
  const setToken = useAuthStore((state) => state.setToken)
  const setUser = useAuthStore((state) => state.setUser)

  const isAuth = useAuthStore((state) => state.isAuth)

  const [data, setData] = useState<Login>(INITIAL_VALUE)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/dashboard')
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void authService.login(data)
      .then(response => {
        setToken(response.token)
        setUser(response.user)
        navigate('/dashboard')
      })
      .catch(error => {
        const { message } = error.data
        setError(message)
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    setData({
      ...data,
      [name]: value
    })
  }
  return (
    <div className='grid place-items-center h-screen container'>
      <div className='w-full max-w-[600px]'>
        <div className='flex justify-center mb-16'>
          <img className='max-w-[300px]' src="/logo.png" alt="" />
        </div>
        <h2 className='block uppercase font-medium text-xl'>Ingresa tus credenciales</h2>
        <form onSubmit={handleSubmit}>
          <input
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none mb-5'
            onChange={handleChange} type="text" placeholder='Usuario' value={data.username} name='username'/>
          <input
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none  mb-5'
            onChange={handleChange} type="password" placeholder='Contraseña' value={data.password} name='password'/>
          <p className='m-0 my-1 text-red lowercase'>{error}</p>
          <button className='block w-full bg-red text-white px-5 py-2 rounded-lg text-lg' type='submit'>Iniciar Sesión</button>
        </form>
        <div className='flex justify-center mt-6'>
          <img className='max-w-[200px] contrast-50' src="/brand.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default LoginView
