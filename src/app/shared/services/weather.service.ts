import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = '1f3ee12329ac4bc69dd180216241909';
  private baseUrl: string = 'https://api.weatherapi.com/v1';

  constructor() { }

  /**
   * Metodo para obtener el clima.
   */

  async getWeather(location: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/current.json?key=${this.apiKey}&q=${location}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }



  async searchLocations(query: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/search.json?key=${this.apiKey}&q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }
}
