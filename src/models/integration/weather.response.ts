export interface WeatherResponse {
  data: {
    list: Array<{
      dt: string,
      main: { temp: number, temp_min: number, temp_max: number },
      weather: Array<{ main: string, icon: string }>
    }>;
  }
}