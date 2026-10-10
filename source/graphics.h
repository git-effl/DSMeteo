#ifndef GRAPHICS_H
#define GRAPHICS_H

#include "weather.h"
#include <stdint.h>

#ifndef RGB15
#define RGB15(r, g, b)  ((r) | ((g) << 5) | ((b) << 10))
#endif

typedef struct {
    uint16_t skyColorTop;
    uint16_t skyColorBottom;
    uint16_t textColor;
    uint16_t accentColor;
} SkyPalette;

// Returns the dynamic sky palette according to weather condition
SkyPalette Graphics_GetSkyPalette(WeatherCategory category);

// Weather symbol rendering routines
void Graphics_DrawWeatherSymbol(int x, int y, WeatherCategory category);

#endif // GRAPHICS_H
