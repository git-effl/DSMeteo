#include <stdio.h>
#include <stdbool.h>
#include "weather.h"
#include "graphics.h"

// Simulated libnds types if compiling outside devkitARM toolchain
#ifdef __NDS__
#include <nds.h>
#include <dswifi9.h>
#else
typedef struct { int x; int y; } touchPosition;
#define KEY_A      (1 << 0)
#define KEY_B      (1 << 1)
#define KEY_SELECT (1 << 2)
#define KEY_START  (1 << 3)
#define KEY_RIGHT  (1 << 4)
#define KEY_LEFT   (1 << 5)
#define KEY_UP     (1 << 6)
#define KEY_DOWN   (1 << 7)
#define KEY_TOUCH  (1 << 12)
#endif

int main(void) {
    int activeCityIndex = 0;
    TempUnit activeUnit = UNIT_CELSIUS;
    CurrentWeather currentWeather;

    // Load initial weather data for active city
    Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);

    printf("==========================================\n");
    printf("   Nintendo DSi Weather (DSMeteo)\n");
    printf("   Open-Meteo REST API Engine\n");
    printf("==========================================\n\n");

    printf("TOP SCREEN:\n");
    printf("Location:     %s, %s\n", currentWeather.cityName, currentWeather.country);
    printf("Temperature:  %.1f%s\n", 
           Weather_ConvertTemp(currentWeather.temperature, activeUnit), 
           Weather_GetUnitSuffix(activeUnit));
    printf("Condition:    %s\n", currentWeather.conditionText);
    printf("Humidity:     %d%%\n", currentWeather.humidity);
    printf("Wind Speed:   %.1f km/h\n", currentWeather.windSpeed);
    printf("Pressure:     %d hPa\n\n", currentWeather.pressure);

    printf("BOTTOM SCREEN (TOUCH CONTROLS):\n");
    printf("[1] USE CITY: Switch between saved cities\n");
    printf("[2] ADD CITY: Add location via Open-Meteo API\n");
    printf("[3] INDICATORS: [Celsius] [Fahrenheit] [Kelvin]\n");
    printf("[4] DSi MENU: Exit to Nintendo DSi Launcher\n\n");

    // Main interactive game loop for Nintendo DS / DSi hardware
    while (1) {
        #ifdef __NDS__
        swiWaitForVBlank();
        scanKeys();
        uint32_t keysDown = keysDown();
        touchPosition touch;

        // D-Pad / Touch controls
        if (keysDown & KEY_UP) {
            activeCityIndex = (activeCityIndex + 1) % DEFAULT_CITIES_COUNT;
            Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);
        }
        if (keysDown & KEY_X) {
            activeUnit = (activeUnit + 1) % 3;
        }
        if (keysDown & KEY_START) {
            break; // Exit to DSi Launcher
        }
        if (keysDown & KEY_TOUCH) {
            touchRead(&touch);
            // Process touch zones for: Add City, Use City, Unit, Exit
        }
        #else
        break;
        #endif
    }

    return 0;
}
