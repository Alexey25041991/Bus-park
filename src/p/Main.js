import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ymaps from 'ymaps'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import db from 'dbConnection'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.getAllDrivers()
    this.getAllBuses()

    ymaps.load().then(api => {
      this.ymapsApi = api
      this.setState({ ymapsApiLoaded: true })
    })
  }

  state = {
    from: 'Ярославль',
    to: 'Москва',
    selectedDriver: 0,
    drivers: null,
    buses: null,
    ymapsApiLoaded: false,
    calculatedTimes: null
  }

  ymapsApi = null
  // api.coordSystem.geo.getDistance()

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

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

  calculateTime = async () => {
    const { from, to, selectedDriver, drivers, buses } = this.state

    const fromCoords = await this.ymapsApi.geocode(from)
      .then(res => res.geoObjects.get(0).geometry.getCoordinates())

    const toCoords = await this.ymapsApi.geocode(to)
      .then(res => res.geoObjects.get(0).geometry.getCoordinates())

    const distance = Math.ceil(this.ymapsApi.coordSystem.geo.getDistance(fromCoords, toCoords) / 1000)

    let calculatedTimes = []

    const driverData = drivers.filter(driver => driver.id === selectedDriver)[0]

    Object.keys(driverData.drivingBuses).map(key => {
      const busId = driverData.drivingBuses[+key]
      const busData = buses.filter(bus => bus.id === busId)[0]

      calculatedTimes.push({
        time: +distance / +busData.avgSpeed,
        bus: busData.mark + ' ' + busData.model
      })
    })

    this.setState({ calculatedTimes })
  }



  render() {
    const { from, to, drivers, buses, ymapsApiLoaded, selectedDriver, calculatedTimes } = this.state

    if (!ymapsApiLoaded || !drivers || !buses) return null

    return (
      <div>
        <br/>
        <br/>

        <div>
          <Link to='/add/bus'>
            <Button variant="contained" color="primary">
              + Добавить автобус
            </Button>
          </Link>
        </div>

        <br/>

        <div>
          <Link to='/add/driver'>
            <Button variant="contained" color="primary">
              + Добавить водителя
            </Button>
          </Link>
        </div>

        <br/>
        <hr />

        <div>
          <TextField
            label="Откуда"
            value={from}
            name='from'
            onChange={this.handleChange}
            margin="normal"
          />
        </div>

        <div>
          <TextField
            label="Куда"
            value={to}
            name='to'
            onChange={this.handleChange}
            margin="normal"
          />
        </div>

        <br/>

        <div>
          <FormControl>
            <InputLabel htmlFor="age-simple">Водитель</InputLabel>

            <Select
              name='selectedDriver'
              value={selectedDriver}
              onChange={this.handleChange}
            >
              <MenuItem value={0}><em>Не выбран</em></MenuItem>

              {drivers.map(driver => (
                <MenuItem key={driver.id} value={driver.id}>
                  {`${driver.surname} ${driver.name} ${driver.patronymic}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <br />

        <Button variant="contained" color="primary" onClick={this.calculateTime}>
          Рассчитать время маршрута
        </Button>

        {calculatedTimes ? (
          <div>
            <h1>Возможные варианты:</h1>

            {calculatedTimes.map((variant, i) => (
              <p key={i}>Вариант {i + 1} ({variant.bus}): ~{Math.round(variant.time * 100) / 100}ч</p>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}

export default Main
