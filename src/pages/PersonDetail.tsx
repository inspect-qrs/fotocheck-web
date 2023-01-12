import React, { ReactElement, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PersonDetail from '@/components/public/Person'

const CertificateDetail = (): ReactElement => {
  const [searchParams] = useSearchParams()
  const [id, setId] = useState<string>('')

  useEffect(() => {
    setId(searchParams.get('id') ?? '')
  }, [])

  return (
    <>

      {
        id !== ''
          ? (
            <>
              <div className='container mt-4'>
                <PersonDetail id={id} />
              </div>
            </>
            )
          : (<p className='text-center text-3xl font-bold uppercase'>There was an error, try it later</p>)
      }
    </>

  )
}

export default CertificateDetail
