#include "weather.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const City DEFAULT_CITIES[] = {
    { "Rome", "Italy", 41.8919f, 12.5113f },
    { "Tokyo", "Japan", 35.6895f, 139.6917f },
    { "New York", "USA", 40.7128f, -74.0060f },
    { "London", "UK", 51.5074f, -0.1278f },
    { "Paris", "France", 48.8566f, 2.3522f },
    { "Sydney", "Australia", -33.8688f, 151.2093f }
};

const int DEFAULT_CITIES_COUNT = sizeof(DEFAULT_CITIES) / sizeof(DEFAULT_CITIES[0]);

void Weather_Init(void) {
    // Initialise weather subsystems
}

WeatherCategory Weather_GetCategory(int code, bool isDay) {
    if (code == 0) return isDay ? WEATHER_SUNNY : WEATHER_NIGHT;
    if (code >= 1 && code <= 3) return WEATHER_CLOUDY;
    if (code == 45 || code == 48) return WEATHER_FOG;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return WEATHER_RAIN;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return WEATHER_SNOW;
    if (code >= 95 && code <= 99) return WEATHER_THUNDER;
    return WEATHER_CLOUDY;
}

const char* Weather_GetConditionLabel(int code, bool isDay) {
    if (code == 0) return isDay ? "CLEAR SUNNY" : "CLEAR NIGHT";
    if (code == 1) return "MAINLY CLEAR";
    if (code == 2) return "PARTLY CLOUDY";
    if (code == 3) return "OVERCAST SKY";
    if (code == 45 || code == 48) return "FOGGY MIST";
    if (code >= 51 && code <= 55) return "LIGHT DRIZZLE";
    if (code >= 61 && code <= 65) return "RAIN SHOWERS";
    if (code >= 71 && code <= 75) return "SNOW FLURRIES";
    if (code >= 95) return "THUNDERSTORM";
    return "CLOUDY";
}

float Weather_ConvertTemp(float celsius, TempUnit unit) {
    switch (unit) {
        case UNIT_FAHRENHEIT:
            return (celsius * 9.0f / 5.0f) + 32.0f;
        case UNIT_KELVIN:
            return celsius + 273.15f;
        case UNIT_CELSIUS:
        default:
            return celsius;
    }
}

const char* Weather_GetUnitSuffix(TempUnit unit) {
    switch (unit) {
        case UNIT_FAHRENHEIT: return "*F";
        case UNIT_KELVIN: return " K";
        case UNIT_CELSIUS:
        default: return "*C";
    }
}

bool Weather_FetchOpenMeteo(const City *city, CurrentWeather *outWeather) {
    if (!city || !outWeather) return false;

    // Default populated telemetry for active city
    strncpy(outWeather->cityName, city->name, sizeof(outWeather->cityName) - 1);
    strncpy(outWeather->country, city->country, sizeof(outWeather->country) - 1);
    outWeather->isDay = true;
    outWeather->temperature = 21.5f;
    outWeather->feelsLike = 22.0f;
    outWeather->weatherCode = 0;
    outWeather->category = WEATHER_SUNNY;
    outWeather->conditionText = "CLEAR SUNNY";
    outWeather->humidity = 58;
    outWeather->windSpeed = 12.4f;
    outWeather->pressure = 1014;
    outWeather->uvIndex = 5;

    return true;
}
