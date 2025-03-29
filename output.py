import requests

def fetch_current_weather(api_key, location):
    """
    Fetches current weather 
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

def fetch_hourly_forecast(api_key, location, hours=24):
    """
    Retrieves hourly forecast data for the given location .
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
    Calculates Body Mass Index (BMI) ,in future can direct take bmi from frontend.
    """
    height_m = height / 100.0  # convert height to meters
    bmi = weight / (height_m * height_m)
    return bmi

def get_risk_assessment(prompt, databricks_api_url, databricks_token):
    """
    Calls the Databricks Playground API
    """
    headers = {
        "Authorization": f"Bearer {databricks_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
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
    WEATHERBIT_API_KEY = "44fe16882bcd435ca332f1b4d6b83fc6" 
    location = "DELHI,IN"  

    # User details
    age = 65        
    weight = 80     
    height = 170  
    bmi = calculate_bmi(weight, height)

    # Fetch current weather data
    current_data = fetch_current_weather(WEATHERBIT_API_KEY, location)
    if current_data and "data" in current_data and len(current_data["data"]) > 0:
        weather_info = current_data["data"][0]
        city_name = weather_info.get("city_name", "Unknown")
        current_temp = weather_info.get("temp", "N/A")
        uv_index = weather_info.get("uv", "N/A")
        aqi = weather_info.get("aqi", "N/A")
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
            f"forecast temperatures range from {first_hour.get('temp', 'N/A')}°C to {last_hour.get('temp', 'N/A')}°C."
        )
    else:
        forecast_summary = "No hourly forecast available."

    # Compose prompt with user details and weather data for analysis
    prompt = (
        f"User Details:\n"
        f"Age: {age}\n"
        f"Weight: {weight} kg\n"
        f"Height: {height} cm\n"
        f"BMI: {bmi:.1f}\n\n"
        f"Current Weather in {city_name}:\n"
        f"Temperature: {current_temp}°C\n"
        f"UV Index: {uv_index}\n"
        f"AQI: {aqi}\n\n"
        f"Forecast Summary:\n"
        f"{forecast_summary}\n\n"
        f"Based on the above data, please assess whether there is any significant weather risk "
        f"for this individual. Consider factors such as high UV exposure, poor air quality, extreme "
        f"temperatures, and if applicable, potential hurricane or storm warnings. Provide recommendations if necessary."
    )

    # Databricks Playground API details 
    DATABRICKS_API_URL = "https://dbc-01e46c6b-3bd2.cloud.databricks.com/serving-endpoints/databricks-meta-llama-3-3-70b-instruct/invocations"
    DATABRICKS_TOKEN = "dapie742d896626e16ed5a8c20015bd748ff"

    # Call Databricks Playground API to get a risk assessment using the composed prompt
    risk_response = get_risk_assessment(prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
    if risk_response:
        # Assuming the response follows a conversation completion format.
        risk_assessment = risk_response.get("choices", [{}])[0].get("message", {}).get("content", "No detailed risk assessment returned.")
        print("Risk Assessment Report:")
        print(risk_assessment)
    else:
        print("Databricks Playground API call failed.")

if __name__ == "__main__":
    main()
