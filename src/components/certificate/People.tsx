import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { PeopleService } from '@/api/person.service'
import { Person } from '@/types/person.interface'
import ImportExcel from './ImportExcel'
import { useNavigate } from 'react-router-dom'
import { SortIconDesc, SortIconAsc } from '@/assets/SortIcons'
import useMediaQuery from '@/hooks/UseMediaQuery'
import { Column } from 'react-table'
import Table from '../Table'

interface CertificatesProps {
  dni?: string
  isModalShowed?: boolean
  close?: () => void
}

const COLUMNS = ['profile', 'name', 'lastName', 'docNum', 'course', 'company', 'place', 'certification']

const Certificates = ({ dni = '', isModalShowed = false, close = () => { console.log('close') } }: CertificatesProps): ReactElement => {
  const certificatesService = new PeopleService()
  const [certificates, setCertificates] = useState<Person[]>([])

  const [sortColumn, setSortColumn] = useState<keyof Person>('profile')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterColumn, setFilterColumn] = useState<keyof Person>('docNum')
  const [filterText, setFilterText] = useState('')

  const navigate = useNavigate()

  const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    void certificatesService.findAll()
      .then(setCertificates)
  }, [])

  const handleSortColumn = (column: string): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }

    setSortColumn(column as keyof Person)
  }

  const getSortIcon = (column: string): React.ReactElement => {
    if (sortColumn !== column) return (<span></span>)
    const className = 'text-white w-6 h-6'
    return sortDirection === 'asc' ? <SortIconAsc className={className} /> : <SortIconDesc className={className} />
  }

  const filteredData = useMemo(() => {
    let filtered = certificates
    if (filterText) {
      filtered = filtered.filter(item =>
        item[filterColumn].toLowerCase().includes(filterText.toLowerCase())
      )
    }
    if (sortColumn) {
      filtered.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
          return sortDirection === 'asc' ? -1 : 1
        }
        if (a[sortColumn] > b[sortColumn]) {
          return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return filtered
  }, [certificates, filterText, sortColumn, sortDirection])

  const handleChangeFilterColumn = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    setFilterText('')
    setFilterColumn(value as keyof Person)
  }

  const handleImportExcel = (newCertificates: Person[]): void => {
    setCertificates(certificates.concat(newCertificates))
  }

  const handleRowClick = (id: string): void => {
    navigate(`/person?id=${id}`)
  }

  const COLUMN_HEADERS: Array<Column<Person>> = [
    { Header: 'Perfil', accessor: 'profile' },
    { Header: 'Documento de Identidad', accessor: 'docType' },
    { Header: 'Número de documento', accessor: 'docNum' },
    { Header: 'Nombres', accessor: 'name' },
    { Header: 'Apellidos', accessor: 'lastName' },
    { Header: 'Empresa', accessor: 'company' },
    { Header: 'Credential', accessor: 'credential' },
    { Header: 'Vigencia', accessor: 'credentialLife' }
  ]

  const filterMobile = (): ReactElement => (
    <>
      <div className='mb-2'>
        <p className='font-medium uppercase'>Filter</p>
        <input
          type="text"
          value={filterText}
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
          placeholder='Enter value to filter'
          onChange={e => { setFilterText(e.target.value) }}
        />
      </div>
      <div>
        <p className='font-medium uppercase'>Column to filter</p>
        <select value={filterColumn} onChange={handleChangeFilterColumn} className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none uppercase'>
          {
            COLUMNS.map((column, index) => (
              <option key={index} value={column}>{column}</option>
            ))
          }
        </select>
      </div>
    </>
  )

  const filterDesktop = (): ReactElement => (
    <>
      <div className='grid grid-cols-filter gap-4'>
        <p className='font-medium uppercase'>Filter</p>
        <p className='font-medium uppercase'>Column to filter</p>
      </div>
      <div className='mb-6 grid grid-cols-filter gap-4'>
        <input
          type="text"
          value={filterText}
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
          placeholder='Enter value to filter'
          onChange={e => { setFilterText(e.target.value) }}
        />
        <select value={filterColumn} onChange={handleChangeFilterColumn} className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none uppercase'>
          {
            COLUMNS.map((column, index) => (
              <option key={index} value={column}>{column}</option>
            ))
          }
        </select>
      </div>
    </>
  )

  return (
    <main className='mb-5'>
      {isModalShowed && <ImportExcel close={close} addCertificates={handleImportExcel} />}
      <div className='mb-4'>
        {isAboveSmallScreens ? filterDesktop() : filterMobile()}
      </div>
      <Table columns={COLUMN_HEADERS} data={filteredData} sortIcon={getSortIcon} setSortColumn={handleSortColumn} onRowClick={handleRowClick} />
    </main >
  )
}

export default Certificates
