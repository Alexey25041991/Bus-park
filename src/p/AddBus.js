import React from 'react'
import Button from '@material-ui/core/Button'
import createHash from 'hash-generator'
import db from 'dbConnection'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom'

class AddBus extends React.Component {
  constructor(props) {
    super(props)
    this.getAllBuses()
  }

  state = {
    newBus: {
      mark: '',
      model: '',
      releaseYear: '',
      avgSpeed: ''
    },
    buses: null
  }

  // Change input
  changeInput = e => {
    this.setState({
      newBus: {
        ...this.state.newBus,
        [e.target.name]: e.target.value
      }
    })
  }

  // Сохранить новый автобус
  addBus = _ => {
    const { mark, model, releaseYear, avgSpeed } = this.state.newBus

    db.ref('buses/' + createHash(12)).set({
      mark, model, releaseYear, avgSpeed
    })

    this.setState(state => ({
      newBus: {
        mark: '',
        model: '',
        releaseYear: '',
        avgSpeed: ''
      },

      buses: [
        ...state.buses,
        { mark, model, releaseYear, avgSpeed }
      ]
    }))
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

  render() {
    const { mark, model, releaseYear, avgSpeed } = this.state.newBus
    const { buses } = this.state

    return (
      <div>
        <Link to='/'><b>&laquo; Назад</b></Link>

        <h1>Все автобусы</h1>

        {buses ? (
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
              {buses.map(bus => {
                return (
                  <TableRow key={bus.id}>
                    <>
                      <TableCell>{bus.mark ? bus.mark : 'Не заполнено'}</TableCell>
                      <TableCell>{bus.model ? bus.model : 'Не заполнено'}</TableCell>
                      <TableCell>{bus.releaseYear ? bus.releaseYear : 'Не заполнено'}</TableCell>
                      <TableCell>{bus.avgSpeed ? bus.avgSpeed : 'Не заполнено'}</TableCell>
                    </>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : <h3>Нет данных</h3>}



        <h1>Добавление нового автобуса</h1>

        <label>Марка:</label>
        <input
          name='mark' value={mark}
          onChange={this.changeInput}
        />

        <label>Модель:</label>
        <input
          name='model' value={model}
          onChange={this.changeInput}
        />

        <label>Год выпуска:</label>
        <input
          name='releaseYear' value={releaseYear}
          onChange={this.changeInput}
        />

        <label>Средняя скорость:</label>
        <input
          name='avgSpeed' value={avgSpeed}
          onChange={this.changeInput}
        />

        <Button variant="contained" color="primary" onClick={this.addBus}>
          + Добавить
        </Button>
      </div>
    )
  }
}

export default AddBus
