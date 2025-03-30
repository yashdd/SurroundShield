import requests

def fetch_current_weather(api_key, location):
    """
    Fetches current weather data (temperature, UV index, and AQI) for the given location
    using Weatherbit's Current Weather API with a location string.
    """
    base_url = "https://api.weatherbit.io/v2.0/current"
    params = {
        "city": location,
        "key": api_key,
        "units": "metric"
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error fetching current weather data:", response.status_code, response.text)
        return None

def fetch_weather_alerts(api_key, city):
    """
    Retrieves active weather alerts for the given city using Weatherbit's Alerts API.
    If there are no alerts, the caller can treat the result as None.
    """
    url = f"https://api.weatherbit.io/v2.0/alerts?city={city}&key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        alert_data = response.json()
        # Assume if "alerts" key is empty or not present, then return None.
        if alert_data.get('alerts'):
            return alert_data
        else:
            return None
    else:
        print("Error fetching weather alerts:", response.status_code, response.text)
        return None

def fetch_hourly_forecast(api_key, location, hours=24):
    """
    Retrieves hourly forecast data for the given location for the next specified hours
    using Weatherbit's Hourly Forecast API.
    """
    base_url = "https://api.weatherbit.io/v2.0/forecast/hourly"
    params = {
        "city": location,
        "key": api_key,
        "hours": hours,
        "units": "metric"
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error fetching hourly forecast data:", response.status_code, response.text)
        return None

def calculate_bmi(weight, height):
    """
    Calculates Body Mass Index (BMI) from weight in kilograms and height in centimeters.
    """
    height_m = height / 100.0
    bmi = weight / (height_m * height_m)
    return bmi

def get_risk_assessment(prompt, databricks_api_url, databricks_token):
    """
    Calls the Databricks Playground API (Foundation Model API) with a structured payload,
    using the 'messages' format.
    """
    headers = {
        "Authorization": f"Bearer {databricks_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a community risk awareness assistant gin=ving alerts and recommondations. Respond only on topics related to weather,weather alerts, environmental conditions, and crime safety in the community. If the query is not in this domain, say that you only handle community risk-related topics."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }
    response = requests.post(databricks_api_url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error calling Databricks API:", response.status_code, response.text)
        return None

def main():
    # Weatherbit API details
    WEATHERBIT_API_KEY = "44fe16882bcd435ca332f1b4d6b83fc6"  # Replace with your actual Weatherbit API key
    location = "DELHI,IN"  # Location in "City,Country" format

    # Fetch weather alerts for the location
    alert = fetch_weather_alerts(WEATHERBIT_API_KEY, location)
    
    # If there are no alerts, set it to None
    if not alert:
        alert = None

    # User details (could be extended as needed)
    age = 65         # Age in years
    weight = 80      # Weight in kilograms
    height = 170     # Height in centimeters
    bmi = calculate_bmi(weight, height)

    # Fetch current weather data
    current_data = fetch_current_weather(WEATHERBIT_API_KEY, location)
    if current_data and "data" in current_data and len(current_data["data"]) > 0:
        weather_info = current_data["data"][0]
        city_name = weather_info.get("city_name", "Unknown")
        current_temp = weather_info.get("temp", "N/A")
        uv_index = weather_info.get("uv", "N/A")
        aqi = weather_info.get("aqi", "N/A")
        precip = weather_info.get("precip", "N/A")
        pop = weather_info.get("pop", "N/A")
        wind_speed = weather_info.get("wind_spd", "N/A")
        wind_direction = weather_info.get("wind_dir", "N/A")
        wind_cardinal = weather_info.get("wind_cdir", "N/A")
        snow = weather_info.get("snow", "N/A")
        snow_depth = weather_info.get("snow_depth", "N/A")
        clouds = weather_info.get("clouds", "N/A")
        weather_description = weather_info.get("weather", {}).get("description", "N/A")
        print("City:", city_name)
        print("Current Temperature:", current_temp, "°C")
        print("UV Index:", uv_index)
        print("AQI:", aqi)
        print("Weather Alerts:", alert if alert else "None")
    else:
        print("No current weather data available.")
        return

    # Fetch 24-hour forecast data and generate a simple summary
    forecast_data = fetch_hourly_forecast(WEATHERBIT_API_KEY, location, hours=24)
    if forecast_data and "data" in forecast_data:
        first_hour = forecast_data["data"][0]
        last_hour = forecast_data["data"][-1]
        forecast_summary = (
            f"From {first_hour.get('timestamp_local', 'N/A')} to {last_hour.get('timestamp_local', 'N/A')}, "
            f"temperatures range from {first_hour.get('temp', 'N/A')}°C to {last_hour.get('temp', 'N/A')}°C."
        )
    else:
        forecast_summary = "No hourly forecast available."

    # Compose a prompt combining user details, current weather, alerts, and forecast summary for initial recommendation.
    # initial_prompt = (
    #     f"User Details:\n"
    #     f"Age: {age}\n"
    #     f"Weight: {weight} kg\n"
    #     f"Height: {height} cm\n"
    #     f"BMI: {bmi:.1f}\n\n"
    #     f"Current Weather in {city_name}:\n"
    #     f"Temperature: {current_temp}°C\n"
    #     f"UV Index: {uv_index}\n"
    #     f"AQI: {aqi}\n\n"
    #     f"Weather Alerts: {'Present' if alert else 'None'}\n\n"
    #     f"Liquid equivalent rain in mm:{precip}\n\n"
    #     f"Probability of rain:{pop}\n\n"
    #     f"Wind speed m/s:{wind_speed}\n\n"
    #     f"Wind direction:{wind_direction}\n\n"
    #     f"Cardinal wind direction (e.g., NE, SW):{wind_cardinal}\n\n"
    #     f"Accumulated snowfall :{snow if snow else None}\n\n"
    #     f"Forecast: {forecast_summary}\n\n"
    #     f"cloud:{clouds}\n\n"
    #     f"Total snow depth{snow_depth if snow_depth else None}\n"
    #     f"Based on the above data, please provide recommendations and alerts if any significant weather risk "
    #     f"is present for this individual. If there are no alerts or risks, simply say 'None'."
    # )
    initial_prompt = (
        f"User Details:\n"
        f"Age: {age}\n"
        f"Weight: {weight} kg\n"
        f"Height: {height} cm\n"
        f"BMI: {bmi:.1f}\n\n"
        f"Weather Data:\n"
        f"- UV Index: {uv_index}\n"
        f"- AQI (Air Quality Index): {aqi}\n"
        f"- Liquid equivalent rain (mm): {precip}\n"
        f"- Probability of rain (%): {pop}\n"
        f"- Wind speed (m/s): {wind_speed}\n"
        f"- Wind direction (degrees): {wind_direction} ({wind_cardinal})\n"
        f"- Accumulated snowfall (mm): {snow if snow else 'None'}\n"
        f"- Total snow depth (mm): {snow_depth if snow_depth else 'None'}\n"
        f"- Cloud coverage (%): {clouds}\n\n"
        f"Weather Alerts: {'Present' if alert else 'None'}\n\n"
        f"Forecast Summary:\n{forecast_summary}\n\n"
        f"Based on the above data, please provide recommendations and alerts if any significant weather risk "
        f"is present for this individual. If there are no alerts or risks, simply say 'None'."
    )
        

    # Databricks Playground API details (update with your actual endpoint and token)
    DATABRICKS_API_URL = "https://dbc-01e46c6b-3bd2.cloud.databricks.com/serving-endpoints/databricks-meta-llama-3-3-70b-instruct/invocations"
    DATABRICKS_TOKEN = "dapie742d896626e16ed5a8c20015bd748ff"

    # Get initial risk assessment / recommendation using the composed prompt.
    risk_response = get_risk_assessment(initial_prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
    if risk_response:
        risk_assessment = risk_response.get("choices", [{}])[0].get("message", {}).get("content", "No detailed risk assessment returned.")
        print("\nRisk Assessment Report:")
        print(risk_assessment)
    else:
        print("Databricks Playground API call for risk assessment failed.")
        return

    # After initial recommendations, allow user to interact with follow-up queries
    print("\nYou can now ask follow-up questions related to community risk awareness.")
    print("For example, try asking: 'Is the current UV index safe?' or 'Is there any hurricane approaching?'")
    print("Type 'exit' to quit the interactive session.")
    
    while True:
        user_query = input("\nEnter your question: ")
        if user_query.lower() in ["exit", "quit"]:
            print("Thank you for using the community risk awareness tool.")
            break

        # Build a prompt for the follow-up question including context
        # followup_prompt = (
        #     f"Based on the current weather data for {city_name} (Temperature: {current_temp}°C, UV Index: {uv_index}, AQI: {aqi},Liquid equivalent rain (mm): {precip}, Probability of rain (%): {pop},Wind speed (m/s): {wind_speed}\n,
        #       Wind direction (degrees): {wind_direction} ({wind_cardinal}),
        #       Accumulated snowfall (mm): {snow if snow else 'None'},
        #       Total snow depth (mm): {snow_depth if snow_depth else 'None'},
        #       Cloud coverage (%): {clouds},
        #       Weather Alerts: {'Present' if alert else 'None'},
        #       Forecast Summary:\n{forecast_summary}\n\n") 
        followup_prompt = (
            f"Based on the current weather data for {city_name} "
            f"(Temperature: {current_temp}°C, UV Index: {uv_index}, AQI: {aqi}, "
            f"Liquid equivalent rain (mm): {precip}, Probability of rain (%): {pop}, "
            f"Wind speed (m/s): {wind_speed}, Wind direction (degrees): {wind_direction} ({wind_cardinal}), "
            f"Accumulated snowfall (mm): {snow if snow else 'None'}, "
            f"Total snow depth (mm): {snow_depth if snow_depth else 'None'}, "
            f"Cloud coverage (%): {clouds}, Weather Alerts: {'Present' if alert else 'None'})\n"
            f"Forecast Summary:\n{forecast_summary}\n\n"   )     
        followup_response = get_risk_assessment(followup_prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
        if followup_response:
            followup_answer = followup_response.get("choices", [{}])[0].get("message", {}).get("content", "No answer provided.")
            print("Answer:", followup_answer)
        else:
            print("Failed to retrieve an answer from the Databricks API.")
            return False
            
if __name__ == "__main__":
    main()
