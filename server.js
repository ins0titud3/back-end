const express = require('express')
const axios = require('axios')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

// Обработка статических файлов
app.use(express.static(__dirname))

app.get('/weather', async (req, res) => {
  try {
    const cityName = req.query.city
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' })
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0ee29dad1cbaad6deb693f90108382e0`
    )
    const weatherData = weatherResponse.data

    res.json({
      temp: weatherData.main.temp,
      feels: weatherData.main.feels_like,
      icon: weatherData.weather[0].icon,
      iconURL: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
      desc: weatherData.weather[0].description,
      humid: weatherData.main.humidity,
      press: weatherData.main.pressure,
      wspeed: weatherData.wind.speed,
      countryCod: weatherData.cod,
      coord: weatherData.coord.lon,
      coord2: weatherData.coord.lat,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/exchange-rates', async (req, res) => {
  try {
    const exchangeRatesResponse = await axios.get('https://open.er-api.com/v6/latest')

    const exchangeRatesData = exchangeRatesResponse.data.rates

    res.json({
      exchangeRates: exchangeRatesData,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
