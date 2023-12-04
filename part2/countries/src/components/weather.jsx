import { useState, useEffect } from "react"
import weatherService from "../services/weatherService";

const Weather = ({capital}) => {
    
    const [wind, setWind] = useState("")
    const [temp, setTemp] = useState("")
    const [imgUrl, setimgUrl] = useState("")

    useEffect(() => {
        weatherService.currentWeather(capital)
            .then(response => {
                setWind(response.wind.speed)
                setTemp(response.main.temp)
                setimgUrl(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
                console.log(response)
                console.log(response.weather.icon)
            })
    }) 

    return (
        
        <div className="weather">
            <h3>Weather in {capital}</h3>
            Temperatue: {temp} &deg;C
            <br></br>
            <img src={imgUrl} alt="weather"></img>
            <br></br>
            Wind: {wind} m/s
        </div>
    )

}

export default Weather