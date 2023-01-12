import { PeopleService } from '@/api/person.service'
import PersonDetail from '@/components/public/Person'
import React, { ReactElement, useEffect, useState } from 'react'

const isNumber = (value: string): boolean => {
  return /^\d+$/.test(value)
}

const PeoplePublic = (): ReactElement => {
  const peopleService = new PeopleService()
  const [dni, setDni] = useState('')
  const [error, setError] = useState('')

  const [person, setPerson] = useState<ReactElement>((<div></div>))

  useEffect(() => {
    if (dni.trim() !== '') {
      setError(isNumber(dni) ? '' : 'Formato inválido')
    } else {
      setError('Inserta un valor')
    }
  }, [dni])

  const handleSubmitDni = (): void => {
    void peopleService.findByDni(dni)
      .then(response => {
        setPerson(<PersonDetail dni={response.docNum} />)
      })
      .catch(error => {
        const { message } = error.data
        setError(message)
      })
  }

  const clear = (): void => {
    setDni('')
    setPerson((<div></div>))
  }

  const onDniChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setDni(value)
  }

  return (
    <>
      <header className='bg-black shadow-lg py-4'>
        <div className='container'>
          <img className='max-w-[120px]' src="/logo-blanco.png" alt="" />
        </div>
      </header>
      <div className='container'>
        <div className='mt-5'>
          <div className='mb-5'>
            <label className='font-medium uppercase'>Enter your dni</label>
            <input
              onChange={onDniChange}
              className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
              type='text'
              placeholder='Dni'
              value={dni}
            />
            <p className='lowercase text-red'>{error}</p>
            <div className='flex items-center gap-3'>
              <button
                disabled={error !== ''}
                onClick={handleSubmitDni}
                className={`${error !== '' ? 'bg-red-dark' : 'bg-red'}  text-white px-5 py-1 rounded-lg text-lg mt-4`}
              >Search</button>

              <button
                onClick={clear}
                className='bg-black text-white px-5 py-1 rounded-lg text-lg mt-4'
              >Clear</button>
            </div>
          </div>

          <section>
            {person}
          </section>
        </div>
      </div>
    </>
  )
}

export default PeoplePublic
