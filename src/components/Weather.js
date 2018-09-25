import React, {Component} from 'react'
import '../modules/css/Weather.css'

export default class Weather extends Component {
    render() {
        return (
            <ul className="weather">
                <li>时间：<span>{this.props.weather.currTime}</span></li>
                <li>星期：<span>{this.props.weather.week}</span></li>
                <li>天气：<span>{this.props.weather.currWeather}</span></li>
                <li>城市：<span>{this.props.weather.city}</span></li>
            </ul>
        )
    }
}