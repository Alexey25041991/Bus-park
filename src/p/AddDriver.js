import React from 'react'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import createHash from 'hash-generator'
import db from 'dbConnection'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'
import { Link } from 'react-router-dom'

class AddDriver extends React.Component {
  constructor(props) {
    super(props)
    this.getAllDrivers()
    this.getAllBuses()
  }

  state = {
    newDriver: {
      surname: '',
      name: '',
      patronymic: '',
      birthDate: null,
      drivingBuses: []
    },
    drivers: null,
    buses: null
  }

  // Get all drivers
  getAllDrivers = _ => {
    const transformToArray = driversObj => {
      return Object.keys(driversObj).map(key => {
        return {
          id: key,
          ...driversObj[key]
        }
      })
    }

    db.ref('drivers').once('value')
      .then(drivers => {
        this.setState({ drivers: drivers.toJSON() ? transformToArray(drivers.toJSON()) : [] })
      })
  }

  // Get all buses
  getAllBuses = _ => {
    const transformToArray = busesObj => {
      return Object.keys(busesObj).map(key => {
        return {
          id: key,
          ...busesObj[key]
        }
      })
    }

    db.ref('buses').once('value')
      .then(buses => this.setState({ buses: transformToArray(buses.toJSON()) }))
  }

  // Change input
  changeInput = e => {
    this.setState({
      newDriver: {
        ...this.state.newDriver,
        [e.target.name]: e.target.value
      }
    })
  }

  handleChangeMultiple = e => {
    this.setState({
      newDriver: {
        ...this.state.newDriver,
        drivingBuses: e.target.value
      }
    })
  }

  // Сохранить нового водителя
  addDriver = _ => {
    const { surname, name, patronymic, birthDate, drivingBuses } = this.state.newDriver

    db.ref('drivers/' + createHash(12)).set({
      surname, name, patronymic, birthDate, drivingBuses
    })

    this.setState(state => ({
      newDriver: {
        surname: '',
        name: '',
        patronymic: '',
        birthDate: null,
        drivingBuses: []
      },

      drivers: [
        ...state.drivers,
        { surname, name, patronymic, birthDate, drivingBuses }
      ]
    }))
  }



  render() {
    const { surname, name, patronymic, birthDate, drivingBuses } = this.state.newDriver
    const { drivers, buses } = this.state

    return (
      <div>
        <Link to='/'><b>&laquo; Назад</b></Link>

        <h1>Все водители</h1>

        {drivers ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Марка</TableCell>
                <TableCell>Модель</TableCell>
                <TableCell>Год выпуска</TableCell>
                <TableCell>Средняя скорость</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {drivers.map(driver => {
                return (
                  <TableRow key={driver.id}>
                    <>
                      <TableCell>{driver.surname ? driver.surname : 'Не заполнено'}</TableCell>
                      <TableCell>{driver.name ? driver.name : 'Не заполнено'}</TableCell>
                      <TableCell>{driver.patronymic ? driver.patronymic : 'Не заполнено'}</TableCell>
                      <TableCell>{driver.birthDate ? driver.birthDate : 'Не заполнено'}</TableCell>
                    </>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : <h3>Нет данных</h3>}



        {buses ? (
          <>
            <h1>Добавление нового водителя</h1>

            <div className='formItem'>
              <label>Фамилия:</label>
              <input name='surname' value={surname} onChange={this.changeInput} />
            </div>

            <div className='formItem'>
              <label>Имя:</label>
              <input name='name' value={name} onChange={this.changeInput} />
            </div>

            <div className='formItem'>
              <label>Отчество:</label>
              <input name='patronymic' value={patronymic} onChange={this.changeInput} />
            </div>

            <div className='formItem'>
              <label>Дата рождения:</label>
              <input type='date' name='birthDate' value={birthDate} onChange={this.changeInput} />
            </div>

            <div className='formItem'>
              <Select
                multiple
                value={drivingBuses}
                onChange={this.handleChangeMultiple}
                input={<Input id="select-multiple-chip" />}
                renderValue={selected => (
                  <div>
                    {selected.map(value => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )}
              >
                {buses.map(bus => (
                  <MenuItem key={bus.id} value={bus.id}>
                    {`${bus.mark} ${bus.model}`}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <Button variant="contained" color="primary"  onClick={this.addDriver}>
              + Добавить
            </Button>
          </>
        ) : null}
      </div>
    )
  }
}

export default AddDriver
