import { Person } from '@/types/person.interface'
import { AppServices } from './api.service'

export class PeopleService extends AppServices {
  constructor () {
    super({ url: 'people' })
  }

  findAll = async (): Promise<Person[]> => {
    return await this.get<Person[]>('')
      .then(response => response.data)
  }

  findByDni = async (dni: string): Promise<Person> => {
    return await this.get<Person>(`/dni/${dni}`)
      .then(response => response.data)
  }

  findOneById = async (id: string): Promise<Person> => {
    return await this.get<Person>(`/${id}`)
      .then(response => response.data)
  }

  importExcel = async (file: any): Promise<Person[]> => {
    return await this.post<Person[]>('/import-excel', file)
      .then(response => response.data)
  }

  removeMultiple = async (ids: string[]): Promise<Person[]> => {
    return await this.patch<Person[]>('/remove-multiple', { ids })
      .then(response => response.data)
  }
}
