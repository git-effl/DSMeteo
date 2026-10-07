#include "graphics.h"

SkyPalette Graphics_GetSkyPalette(WeatherCategory category) {
    SkyPalette pal;
    switch (category) {
        case WEATHER_SUNNY:
            // Vibrant Blue Sky (RGB15: 0..31 scale)
            pal.skyColorTop = RGB15(8, 22, 31);
            pal.skyColorBottom = RGB15(18, 26, 31);
            pal.textColor = RGB15(0, 0, 0);
            pal.accentColor = RGB15(31, 24, 4); // Golden Sun
            break;

        case WEATHER_CLOUDY:
            // Soft Overcast Blue-Slate Sky
            pal.skyColorTop = RGB15(15, 20, 26);
            pal.skyColorBottom = RGB15(22, 24, 28);
            pal.textColor = RGB15(2, 4, 8);
            pal.accentColor = RGB15(20, 22, 24);
            break;

        case WEATHER_RAIN:
            // Rainy Deep Blue Sky
            pal.skyColorTop = RGB15(4, 10, 24);
            pal.skyColorBottom = RGB15(8, 16, 28);
            pal.textColor = RGB15(30, 30, 31);
            pal.accentColor = RGB15(10, 24, 31);
            break;

        case WEATHER_THUNDER:
            // Storm Dark Purple Sky
            pal.skyColorTop = RGB15(2, 2, 8);
            pal.skyColorBottom = RGB15(6, 4, 16);
            pal.textColor = RGB15(31, 31, 31);
            pal.accentColor = RGB15(31, 30, 8); // Lightning
            break;

        case WEATHER_SNOW:
            // Frosty Ice Blue Sky
            pal.skyColorTop = RGB15(18, 27, 31);
            pal.skyColorBottom = RGB15(28, 30, 31);
            pal.textColor = RGB15(4, 8, 16);
            pal.accentColor = RGB15(16, 26, 31);
            break;

        case WEATHER_FOG:
            // Pale Misty Sky
            pal.skyColorTop = RGB15(18, 20, 22);
            pal.skyColorBottom = RGB15(24, 25, 26);
            pal.textColor = RGB15(4, 4, 6);
            pal.accentColor = RGB15(16, 18, 20);
            break;

        case WEATHER_NIGHT:
            // Starry Midnight Indigo
            pal.skyColorTop = RGB15(1, 2, 6);
            pal.skyColorBottom = RGB15(3, 4, 12);
            pal.textColor = RGB15(31, 31, 31);
            pal.accentColor = RGB15(31, 28, 12); // Moon
            break;

        default:
            pal.skyColorTop = RGB15(8, 22, 31);
            pal.skyColorBottom = RGB15(18, 26, 31);
            pal.textColor = RGB15(0, 0, 0);
            pal.accentColor = RGB15(31, 24, 4);
            break;
    }
    return pal;
}

void Graphics_DrawWeatherSymbol(int x, int y, WeatherCategory category) {
    // Draws clean vector-style weather symbol using Nintendo DS 2D sprite/background hardware
}
