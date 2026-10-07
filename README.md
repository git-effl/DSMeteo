# DSMeteo - Nintendo DSi Weather Application

**DSMeteo** is a lightweight, modern weather application designed for the **Nintendo DS and Nintendo DSi**.

## Features

- **Open-Meteo REST API**: Fetches real-time worldwide meteorological data without requiring API keys.
- **Dynamic Sky Background**: Adaptive blue sky palette that dynamically changes according to live weather conditions (Sunny Blue Sky, Soft Overcast, Rainy Blue, Thunderstorm, Winter Frost, Misty Fog, and Starry Midnight).
- **Clean Vector Weather Symbols**: Modern, non-pixelated iconography for sun, clouds, rain, snow, lightning, and moon.
- **Dual Screen Interface**:
  - **Top Screen**: Current location, temperature, conditions, humidity, wind, pressure, UV index, and 5-day forecast.
  - **Bottom Screen (Touch Panel)**:
    - **Use City**: Fast switching between saved/preset cities.
    - **Add City**: Search and add cities worldwide.
    - **Indicators**: Instant toggle between Celsius (°C), Fahrenheit (°F), and Kelvin (K).
    - **DSi Menu**: Exit to the Nintendo DSi home launcher.

## Building from Source

To compile the `.nds` ROM:

```bash
# Using BlocksDS / devkitARM:
make
```

The resulting `DSMeteo.nds` can be launched on real hardware via **TWiLight Menu++**, **Unlaunch**, or standard DS flashcards.

## License

MIT License.
