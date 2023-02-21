import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { PeopleService } from '@/api/person.service'
import { Person } from '@/types/person.interface'
import ImportExcel from './ImportExcel'
import { useNavigate } from 'react-router-dom'
import { SortIconDesc, SortIconAsc } from '@/assets/SortIcons'
import useMediaQuery from '@/hooks/UseMediaQuery'
import { Column } from 'react-table'
import Table from '../Table'
import DeleteModal from './DeleteModal'
import { useAuthStore } from '@/config/store/auth'
import { User } from '@/types/user.interface'

interface PeopleProps {
  isExcelModalShowed?: boolean
  closeExcelModal?: () => void
  isDeleteModalShowed?: boolean
  closeDeletelModal?: () => void
}

const FILTER_COLUMNS = [
  { name: 'Perfil', value: 'profile' },
  { name: 'Nombre', value: 'name' },
  { name: 'Apellido', value: 'lastName' },
  { name: 'Número de Documento', value: 'docNum' },
  { name: 'Empresa', value: 'company' },
  { name: 'Credencial', value: 'credential' }
]

const People = ({ isExcelModalShowed = false, closeExcelModal = () => { console.log('closeExcelModal') }, isDeleteModalShowed = false, closeDeletelModal = () => { console.log('closeExcelModal') } }: PeopleProps): ReactElement => {
  const peopleService = new PeopleService()
  const [people, setPeople] = useState<Person[]>([])

  const [sortColumn, setSortColumn] = useState<keyof Person>('profile')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterColumn, setFilterColumn] = useState<keyof Person>('docNum')
  const [filterText, setFilterText] = useState('')

  const userAuth = useAuthStore<User>((state) => state.user)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    setIsAdmin(userAuth.role === 'admin')
  }, [userAuth])

  const navigate = useNavigate()

  const isAboveSmallScreens = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    void peopleService.findAll()
      .then(setPeople)
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
    let filtered = people
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
  }, [people, filterText, sortColumn, sortDirection])

  const handleChangeFilterColumn = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    setFilterText('')
    setFilterColumn(value as keyof Person)
  }

  const handleImportExcel = (newPeople: Person[]): void => {
    setPeople(people.concat(newPeople))
  }

  const handleRemovePeople = (peopleToRemove: Person[]): void => {
    const peopleToRemoveDocNums = peopleToRemove.map(person => person.docNum)
    setPeople(people.filter(person => !peopleToRemoveDocNums.includes(person.docNum)))
  }
  const handleRowClick = (id: string): void => {
    navigate(`/usuario?id=${id}`)
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const COLUMN_HEADERS: Array<Column<Person>> = [
    { Header: 'Perfil', accessor: 'profile' },
    { Header: 'Documento de Identidad', accessor: 'docType' },
    { Header: 'Número de documento', accessor: 'docNum' },
    { Header: 'Nombres', accessor: 'name' },
    { Header: 'Apellidos', accessor: 'lastName' },
    { Header: 'Empresa', accessor: 'company' },
    { Header: 'Credencial', accessor: 'credential' },
    { Header: 'Vigencia', accessor: row => formatDate(row.credentialLife) }
  ]

  const filterMobile = (): ReactElement => (
    <>
      <div className='mb-2'>
        <p className='font-medium uppercase'>Filtro</p>
        <input
          type="text"
          value={filterText}
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
          placeholder='Enter value to filter'
          onChange={e => { setFilterText(e.target.value) }}
        />
      </div>
      <div>
        <p className='font-medium uppercase'>Columna a filtrar</p>
        <select value={filterColumn} onChange={handleChangeFilterColumn}
          className='block cursor-pointer w-full h-10 px-2 border-b border-solid border-blue-dark outline-none uppercase'>
          {
            FILTER_COLUMNS.map((column, index) => (
              <option key={index} value={column.value}>{column.name}</option>
            ))
          }
        </select>
      </div>
    </>
  )

  const filterDesktop = (): ReactElement => (
    <>
      <div className='grid grid-cols-filter gap-4'>
        <p className='font-medium uppercase'>Filtro</p>
        <p className='font-medium uppercase'>Columna a filtrar</p>
      </div>
      <div className='mb-6 grid grid-cols-filter gap-4'>
        <input
          type="text"
          value={filterText}
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none'
          placeholder='Enter value to filter'
          onChange={e => { setFilterText(e.target.value) }}
        />
        <select value={filterColumn} onChange={handleChangeFilterColumn}
          className='block w-full h-10 px-2 border-b border-solid cursor-pointer border-blue-dark outline-none uppercase'>
          {
            FILTER_COLUMNS.map((column, index) => (
              <option key={index} value={column.value}>{column.name}</option>
            ))
          }
        </select>
      </div>
    </>
  )

  return (
    <main className='mb-5'>
      {isDeleteModalShowed && <DeleteModal close={closeDeletelModal} removePeople={handleRemovePeople}/>}
      {isExcelModalShowed && <ImportExcel close={closeExcelModal} addPeople={handleImportExcel} />}
      <div className='mb-4'>
        {isAboveSmallScreens ? filterDesktop() : filterMobile()}
      </div>
      <Table columns={COLUMN_HEADERS} data={filteredData} sortIcon={getSortIcon} setSortColumn={handleSortColumn} onRowClick={isAdmin ? handleRowClick : () => {}} />
    </main >
  )
}

export default People
