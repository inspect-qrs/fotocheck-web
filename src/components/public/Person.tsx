import React, { ReactElement, useEffect, useState } from 'react'
import { PeopleService } from '@/api/person.service'
import { Person } from '@/types/person.interface'
import QRCode from 'react-qr-code'

const INITIAL_VALUE = {
  id: '',
  profile: '',
  inductionDate: '',
  docType: '',
  docNum: '',
  name: '',
  lastName: '',
  company: '',
  credential: '',
  credentialLife: '',
  profileImage: ''
}

interface PersonDetailProps {
  id?: string
  dni?: string
}

const QR_BASE_URL: string = import.meta.env.VITE_QR_BASE_URL ?? ''

const PersonDetail = ({ id = '', dni = '' }: PersonDetailProps): ReactElement => {
  const certificatesService = new PeopleService()
  const [person, setPerson] = useState<Person>(INITIAL_VALUE)
  const [qrValue, setQrValue] = useState<string>('')
  const [date, setDate] = useState<string>('')

  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (id !== '') {
      void certificatesService.findOneById(id)
        .then(response => {
          setDate(new Date(response.credentialLife).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))
          setPerson(response)
        })
    } else {
      void certificatesService.findByDni(dni)
        .then(response => {
          setDate(new Date(response.credentialLife).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }))
          setPerson(response)
        })
    }

    setQrValue(`${QR_BASE_URL}?id=${id}`)
  }, [id])

  return (
    <div className='w-full min-h-screen flex justify-center flex-col gap-5 sm:flex-row md:gap-10 py-7'>
      { !imageLoaded && (
        <div className='bg-white z-[100] absolute top-0 left-0 w-full h-full rounded-xl after:absolute after:w-10 after:h-10 after:top-0 after:right-0 after:left-0 after:bottom-0 after:m-auto after:border-8 after:border-t-black after:opacity-100 after:rounded-[50%] after:animate-spin'>
        </div>
      )}

      <div className='w-full border border-solid border-gray-light shadow-card p-6 rounded-xl text-center sm:w-1/2 uppercase overflow-hidden'>
        <div className='h-full flex flex-col justify-between'>
          <p className='text-2xl font-bold'>Certificación de {person.profile}</p>
          <div className='max-w-[180px] mx-auto my-5'>
            <img src={person.profileImage} alt="profile-image" onLoad={() => { setImageLoaded(true) }} />
          </div>
          <p className='font-medium text-2xl'>{person.name} {person.lastName}</p>
          <p className='font-medium text-2xl'>Dni: {person.docNum}</p>
          <p className='font-medium text-lg'>Empresa: {person.company}</p>
          <div className='-mx-10 text-left w-[90%] mt-5 bg-red skew-x-[-25deg] before:w-full before:h-3 before:absolute before:-top-3 before:bg-black before:-left-4 '>
            <p className='mx-7 text-white p-3 font-bold text-2xl skew-x-[25deg]'>{person.profile}</p>
          </div>
          <div className='w-auto max-w-[120px] mx-auto mt-3'>
            <QRCode
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={qrValue}
            />
          </div>
          <p>{person.credential}</p>
        </div>
      </div>
      <div className='w-full border border-solid border-gray-light shadow-card p-6 rounded-xl sm:w-1/2'>
        <div className='flex flex-col justify-between h-full gap-4 sm:gap-0'>
          <div className='text-center uppercase font-bold text-3xl'>
            <p>Certificación de</p>
            <p>{person.profile}</p>
          </div>
          <div className='text-lg'>
            <p>Otorgado por ESSAC al haber aprobado la evaluación del curso de referencia</p>
            <p className='font-medium'>Vigencia hasta</p>
          </div>
          <p className='text-center font-bold uppercase text-2xl'>{date}</p>
          <div className='text-lg'>
            <p>Solo válido en las instituciones de Alicorp y subsidiarias</p>
            {/* <p className='text-red font-medium'>Válido para actividades de alto riesgo</p> */}
          </div>

          <div>
            <p>Organiza y certifica</p>
            <div className='w-[250px] mt-2'>
              <img className='' src="/logo.png" alt="" />
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default PersonDetail
