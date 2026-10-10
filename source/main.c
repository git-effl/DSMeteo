#include <stdio.h>
#include <stdbool.h>
#include "weather.h"
#include "graphics.h"

// Nintendo DS hardware headers
#ifdef __NDS__
#include <nds.h>
#if defined(__has_include)
#if __has_include(<dswifi9.h>)
#include <dswifi9.h>
#endif
#endif
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
#define KEY_R      (1 << 8)
#define KEY_L      (1 << 9)
#define KEY_X      (1 << 10)
#define KEY_Y      (1 << 11)
#define KEY_TOUCH  (1 << 12)
#endif

static void DisplayMeteoScreen(const CurrentWeather *currentWeather, TempUnit activeUnit) {
    #ifdef __NDS__
    consoleClear();
    #endif

    printf("==========================================\n");
    printf("   DSMeteo\n");
    printf("   The Weather,On your Nintendo DS.\n");
    printf("==========================================\n\n");

    printf("TOP SCREEN:\n");
    printf("Location:     %s, %s\n", currentWeather->cityName, currentWeather->country);
    printf("Temperature:  %.1f%s\n", 
           Weather_ConvertTemp(currentWeather->temperature, activeUnit), 
           Weather_GetUnitSuffix(activeUnit));
    printf("Condition:    %s\n", currentWeather->conditionText);
    printf("Alert Level:  [%s]\n", currentWeather->alertTitle);
    printf("Alert Info:   %s\n", currentWeather->alertMessage);
    printf("Humidity:     %d%%\n", currentWeather->humidity);
    printf("Wind Speed:   %.1f km/h\n", currentWeather->windSpeed);
    printf("Pressure:     %d hPa\n\n", currentWeather->pressure);

    printf("BOTTOM SCREEN (TOUCH CONTROLS):\n");
    printf("[1] USE CITY: Switch between saved cities\n");
    printf("[2] ADD CITY: Add location via Open-Meteo API\n");
    printf("[3] INDICATORS: [Celsius] [Fahrenheit] [Kelvin]\n");
    printf("[4] LAUNCHER: Exit to Launcher\n\n");
}

int main(void) {
    #ifdef __NDS__
    // Power on 2D engines and initialize text console for real DS/DSi hardware
    powerOn(POWER_ALL_2D);
    videoSetMode(MODE_0_2D);
    videoSetModeSub(MODE_0_2D);
    vramSetBankA(VRAM_A_MAIN_BG);
    vramSetBankC(VRAM_C_SUB_BG);
    consoleDemoInit();
    #endif

    int activeCityIndex = 0;
    TempUnit activeUnit = UNIT_CELSIUS;
    CurrentWeather currentWeather;

    // Load initial weather data and alerts
    Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);
    DisplayMeteoScreen(&currentWeather, activeUnit);

    // Main interactive game loop for Nintendo DS / DSi hardware
    while (1) {
        #ifdef __NDS__
        swiWaitForVBlank();
        scanKeys();
        uint32_t kDown = keysDown();
        touchPosition touch;

        // D-Pad / Shoulder buttons to cycle cities
        if (kDown & (KEY_UP | KEY_RIGHT | KEY_R)) {
            activeCityIndex = (activeCityIndex + 1) % DEFAULT_CITIES_COUNT;
            Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);
            DisplayMeteoScreen(&currentWeather, activeUnit);
        }
        if (kDown & (KEY_DOWN | KEY_LEFT | KEY_L)) {
            activeCityIndex = (activeCityIndex + DEFAULT_CITIES_COUNT - 1) % DEFAULT_CITIES_COUNT;
            Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);
            DisplayMeteoScreen(&currentWeather, activeUnit);
        }
        // Button X or Y cycles temperature indicator units
        if (kDown & (KEY_X | KEY_Y)) {
            activeUnit = (activeUnit + 1) % 3;
            DisplayMeteoScreen(&currentWeather, activeUnit);
        }
        // Button A or SELECT triggers [2] ADD CITY
        if (kDown & (KEY_A | KEY_SELECT)) {
            activeCityIndex = (activeCityIndex + 1) % DEFAULT_CITIES_COUNT;
            Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);
            DisplayMeteoScreen(&currentWeather, activeUnit);
        }
        // Button START or B exits
        if (kDown & (KEY_START | KEY_B)) {
            break;
        }
        // Touch screen interaction
        if (kDown & KEY_TOUCH) {
            touchRead(&touch);
            if (touch.py > 90 && touch.py < 125) {
                // [1] USE CITY
                activeCityIndex = (activeCityIndex + 1) % DEFAULT_CITIES_COUNT;
                Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);
                DisplayMeteoScreen(&currentWeather, activeUnit);
            } else if (touch.py >= 125 && touch.py < 150) {
                // [2] ADD CITY
                activeCityIndex = (activeCityIndex + 2) % DEFAULT_CITIES_COUNT;
                Weather_FetchOpenMeteo(&DEFAULT_CITIES[activeCityIndex], &currentWeather);
                DisplayMeteoScreen(&currentWeather, activeUnit);
            } else if (touch.py >= 150 && touch.py < 175) {
                // [3] INDICATORS
                activeUnit = (activeUnit + 1) % 3;
                DisplayMeteoScreen(&currentWeather, activeUnit);
            } else if (touch.py >= 175) {
                // [4] LAUNCHER
                break;
            }
        }
        #else
        break;
        #endif
    }

    return 0;
}
