from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# ------------------
# 1. Original Helper Functions
# ------------------

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
        # If "alerts" is empty or not present, return None
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

def calculate_bmi(weight, height_cm):
    height_m = height_cm / 100.0
    bmi = weight / (height_m * height_m)
    return bmi

def get_risk_assessment(prompt, databricks_api_url, databricks_token):
    headers = {
        "Authorization": f"Bearer {databricks_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are SurroundShield, an AI-powered app that provides real-time, "
                    "personalized risk alerts based on location and health data, "
                    "helping users stay safe from weather changes, pollution, "
                    "and natural disasters. Respond only on topics related to weather, "
                    "weather alerts, environmental conditions, and crime safety in the community. "
                    "If the query is not in this domain, say that you only handle community risk-related topics."
                )
            },
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


# ----------------------------------------------------
# 2. Example Route to Perform the “Main” Logic in Flask
# ----------------------------------------------------

@app.route('/risk_assessment', methods=['POST'])
def risk_assessment_route():
    """
    Expects a JSON payload, for example:
    {
        "api_key": "<YOUR_WEATHERBIT_API_KEY>",
        "databricks_token": "<YOUR_DATABRICKS_TOKEN>",
        "location": "Hoboken,NJ",
        "age": 65,
        "weight": 80,
        "height": 170
    }
    """

    data = request.get_json(force=True)
    
    # Extract the needed fields from the request
    # WEATHERBIT_API_KEY = data.get("api_key")
    WEATHERBIT_API_KEY = "44fe16882bcd435ca332f1b4d6b83fc6"
    # DATABRICKS_TOKEN   = data.get("databricks_token")
    DATABRICKS_TOKEN = "dapie742d896626e16ed5a8c20015bd748ff"
    # DATABRICKS_API_URL = data.get("databricks_api_url")  # Provide or store in config
    DATABRICKS_API_URL = "https://dbc-01e46c6b-3bd2.cloud.databricks.com/serving-endpoints/databricks-meta-llama-3-3-70b-instruct/invocations"
    location           = data.get("location", "Hoboken,NJ")
    age                = data.get("age")
    weight             = data.get("weight")
    height             = data.get("height")
    
    # 1. Fetch Weather Alerts
    alert = fetch_weather_alerts(WEATHERBIT_API_KEY, location)
    
    # 2. Calculate BMI
    bmi = calculate_bmi(weight, height)
    
    # 3. Fetch Current Weather
    current_data = fetch_current_weather(WEATHERBIT_API_KEY, location)
    weather_info = None
    weather_alert_str = "None"
    
    if current_data and "data" in current_data and len(current_data["data"]) > 0:
        weather_info = current_data["data"][0]
        weather_alert_str = "Present" if alert else "None"
    else:
        # If we have no data, return or note it
        return jsonify({"error": "No current weather data available."}), 400
    
    # 4. Fetch Hourly Forecast
    forecast_data = fetch_hourly_forecast(WEATHERBIT_API_KEY, location, hours=24)
    forecast_summary = "No hourly forecast available."
    if forecast_data and "data" in forecast_data and len(forecast_data["data"]) > 0:
        first_hour = forecast_data["data"][0]
        last_hour = forecast_data["data"][-1]
        forecast_summary = (
            f"From {first_hour.get('timestamp_local', 'N/A')} to {last_hour.get('timestamp_local', 'N/A')}, "
            f"temperatures range from {first_hour.get('temp', 'N/A')}°C to {last_hour.get('temp', 'N/A')}°C."
        )
    
    # Extract the fields from current weather
    city_name         = weather_info.get("city_name", "Unknown")
    current_temp      = weather_info.get("temp", "N/A")
    uv_index          = weather_info.get("uv", "N/A")
    aqi               = weather_info.get("aqi", "N/A")
    precip            = weather_info.get("precip")
    pop               = weather_info.get("pop")
    wind_speed        = weather_info.get("wind_spd", "N/A")
    wind_direction    = weather_info.get("wind_dir", "N/A")
    wind_cardinal     = weather_info.get("wind_cdir", "N/A")
    snow              = weather_info.get("snow", "N/A")
    snow_depth        = weather_info.get("snow_depth", "N/A")
    clouds            = weather_info.get("clouds", "N/A")

    # 5. Build the prompt for the Databricks API
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
        f"Based on the above data, please provide recommendations and alerts if any significant "
        f"risk is present for this individual. If there are no alerts or risks, simply say 'None'."
    )

    # 6. Call Databricks for risk assessment
    risk_response = get_risk_assessment(initial_prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
    
    if not risk_response:
        return jsonify({"error": "Databricks API call for risk assessment failed."}), 500
    
    risk_assessment = risk_response.get("choices", [{}])[0].get("message", {}).get("content", "No detailed risk assessment returned.")
    
    # Return JSON with relevant data
    result = {
        "city": city_name,
        "current_temp": current_temp,
        "bmi": round(bmi, 1),
        "uv_index": uv_index,
        "aqi": aqi,
        "weather_alerts": "Present" if alert else "None",
        "forecast_summary": forecast_summary,
        "risk_assessment": risk_assessment,
    }
    return jsonify(result), 200


# ------------------------------------
# 3. (Optional) Route for Follow-Up Q&A
# ------------------------------------
@app.route('/followup_query', methods=['POST'])
def followup_query():
    """
    Expects JSON like:
    {
        "databricks_api_url": "...",
        "databricks_token": "...",
        "weather_info": { ... },  # from a previous call
        "query": "user question here"
    }
    """
    data = request.get_json(force=True)
    
    # databricks_api_url = data.get("databricks_api_url")# DATABRICKS_TOKEN   = data.get("databricks_token")
    databricks_token = "dapie742d896626e16ed5a8c20015bd748ff"
    databricks_api_url = "https://dbc-01e46c6b-3bd2.cloud.databricks.com/serving-endpoints/databricks-meta-llama-3-3-70b-instruct/invocations"
    # databricks_token   = data.get("databricks_token")
    weather_info       = data.get("weather_info", {})
    query              = data.get("query", "")

    # Construct a prompt from the provided weather info + user question
    city_name       = weather_info.get("city", "Unknown")
    current_temp    = weather_info.get("current_temp", "N/A")
    uv_index        = weather_info.get("uv_index", "N/A")
    aqi             = weather_info.get("aqi", "N/A")
    forecast_summary= weather_info.get("forecast_summary", "N/A")
    weather_alerts  = weather_info.get("weather_alerts", "None")
    
    followup_prompt = (
        f"Based on the current weather data for {city_name} "
        f"(Temperature: {current_temp}°C, UV Index: {uv_index}, AQI: {aqi}, "
        f"Weather Alerts: {weather_alerts}), "
        f"and the forecast summary: {forecast_summary}, "
        f"please answer the following user question: {query}\n"
        f"Only provide relevant weather/environmental safety advice. "
        f"Do not deviate into unrelated domains."
    )

    followup_response = get_risk_assessment(followup_prompt, databricks_api_url, databricks_token)
    if not followup_response:
        return jsonify({"error": "Failed to call Databricks for follow-up query."}), 500

    answer = followup_response.get("choices", [{}])[0].get("message", {}).get("content", "No answer returned.")
    return jsonify({"answer": answer}), 200


# ---------------------------
# 4. Run the Flask Application
# ---------------------------
if __name__ == "__main__":
    # By default, Flask runs on port 5000
    app.run(debug=True, port=5000)
