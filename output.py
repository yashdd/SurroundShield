import requests
def fetch_current_weather(api_key, location):
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
    height_m = height / 100.0
    bmi = weight / (height_m * height_m)
    return bmi

def get_risk_assessment(prompt, databricks_api_url, databricks_token):
    headers = {
        "Authorization": f"Bearer {databricks_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "you are SurondShield AI-powered app that provides real-time, personalized risk alerts based on location and health data, helping users stay safe from weather changes, pollution, and natural disasters. Respond only on topics related to weather,weather alerts, environmental conditions, and crime safety in the community. If the query is not in this domain, say that you only handle community risk-related topics."},
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
    WEATHERBIT_API_KEY = "44fe16882bcd435ca332f1b4d6b83fc6" 
    location = "hoboken,nj"
    alert = fetch_weather_alerts(WEATHERBIT_API_KEY, location)    
    if not alert:
        alert = None

    age = 65         
    weight = 80      
    height = 170    
    bmi = calculate_bmi(weight, height)
    current_data = fetch_current_weather(WEATHERBIT_API_KEY, location)
    if current_data and "data" in current_data and len(current_data["data"]) > 0:
        weather_info = current_data["data"][0]
        city_name = weather_info.get("city_name", "Unknown")
        current_temp = weather_info.get("temp", "N/A")
        uv_index = weather_info.get("uv", "N/A")
        aqi = weather_info.get("aqi", "N/A")
        precip = weather_info.get("precip")
        pop = weather_info.get("pop")
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
        f"Based on the above data, please provide recommendations and alerts if any significant risk "
        f"is present for this individual. If there are no alerts or risks, simply say 'None'."
    )
        

    DATABRICKS_API_URL = "https://dbc-01e46c6b-3bd2.cloud.databricks.com/serving-endpoints/databricks-meta-llama-3-3-70b-instruct/invocations"
    DATABRICKS_TOKEN = "dapie742d896626e16ed5a8c20015bd748ff"

    risk_response = get_risk_assessment(initial_prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
    if risk_response:
        risk_assessment = risk_response.get("choices", [{}])[0].get("message", {}).get("content", "No detailed risk assessment returned.")
        print("\Recommodations:")
        print(risk_assessment)
    else:
        print("Databricks Playground API call for risk assessment failed.")
    
    while True:
        user_query = input("\nEnter your question: ")
        if user_query.lower() in ["exit", "quit"]:
            print("Thank you for using the community risk awareness tool.")
            break

        followup_prompt = (
            f"Based on the current weather data for {city_name} "
            f"(Temperature: {current_temp}°C, UV Index: {uv_index}, AQI: {aqi}, "
            f"Liquid equivalent rain (mm): {precip}, Probability of rain (%): {pop}, "
            f"Wind speed (m/s): {wind_speed}, Wind direction (degrees): {wind_direction} ({wind_cardinal}), "
            f"Accumulated snowfall (mm): {snow if snow else 'None'}, "
            f"Total snow depth (mm): {snow_depth if snow_depth else 'None'}, "
            f"Cloud coverage (%): {clouds}, Weather Alerts: {'Present' if alert else 'None'}),"
            f"and the forecast summary: {forecast_summary},you are  a friendly chatbot and intreact with user assit them and answer the following question regarding any alert:,"
            f"{user_query},"
            f"Please provide recommendations if applicable and only when needed dont bring it up everytime.")     
        followup_response = get_risk_assessment(followup_prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
        if followup_response:
            followup_answer = followup_response.get("choices", [{}])[0].get("message", {}).get("content", "No answer provided.")
            print("Answer:", followup_answer)
        else:
            print("Failed to retrieve an answer from the Databricks API.")
            return False
            
if __name__ == "__main__":
    main()
