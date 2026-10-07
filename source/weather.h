#ifndef WEATHER_H
#define WEATHER_H

#include <stdbool.h>

typedef enum {
    UNIT_CELSIUS = 0,
    UNIT_FAHRENHEIT = 1,
    UNIT_KELVIN = 2
} TempUnit;

typedef enum {
    WEATHER_SUNNY = 0,
    WEATHER_CLOUDY = 1,
    WEATHER_RAIN = 2,
    WEATHER_THUNDER = 3,
    WEATHER_SNOW = 4,
    WEATHER_FOG = 5,
    WEATHER_NIGHT = 6
} WeatherCategory;

typedef struct {
    const char *name;
    const char *country;
    float latitude;
    float longitude;
} City;

typedef struct {
    char cityName[64];
    char country[32];
    float temperature;    // In Celsius
    float feelsLike;
    int weatherCode;
    WeatherCategory category;
    const char *conditionText;
    int humidity;
    float windSpeed;
    int pressure;
    int uvIndex;
    bool isDay;
} CurrentWeather;

// Default preloaded cities
extern const City DEFAULT_CITIES[];
extern const int DEFAULT_CITIES_COUNT;

// Weather functions
void Weather_Init(void);
bool Weather_FetchOpenMeteo(const City *city, CurrentWeather *outWeather);
const char* Weather_GetConditionLabel(int code, bool isDay);
WeatherCategory Weather_GetCategory(int code, bool isDay);
float Weather_ConvertTemp(float celsius, TempUnit unit);
const char* Weather_GetUnitSuffix(TempUnit unit);

#endif // WEATHER_H
