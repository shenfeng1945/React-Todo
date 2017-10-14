import React, {Component} from 'react'

export default class Weather extends Component {
    render() {
        return (
            <ul className="weather">
                <li>时间：{this.props.weather.currTime}</li>
                <li>星期：{this.props.weather.week}</li>
                <li>天气：{this.props.weather.currWeather}</li>
                <li>城市：{this.props.weather.city}</li>
            </ul>
        )
    }
}