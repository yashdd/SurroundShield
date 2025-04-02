import requests
from flask import Flask, request, jsonify
app = Flask(__name__)
from dotenv import load_dotenv
import os
from pathlib import Path
# load_dotenv()

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

DATABRICKS_API_URL = os.getenv("DATABRICKS_API_URL")
DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN")
WEATHERBIT_API_KEY = os.getenv("WEATHERBIT_API_KEY")
print(WEATHERBIT_API_KEY)

def fetch_current_weather(api_key, lat,lon):
    base_url = "https://api.weatherbit.io/v2.0/current"
    params = {
        "lat": lat,
        "lon":lon,
        "key": api_key,
        "units": "metric"
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error fetching current weather data:", response.status_code, response.text)
        return None

def fetch_weather_alerts(api_key, lat,lon):
    url = f"https://api.weatherbit.io/v2.0/alerts?lat={lat}&lon={lon}&key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        alert_data = response.json()
        if alert_data.get('alerts'):
            return alert_data
        else:
            return None
    else:
        print("Error fetching weather alerts:", response.status_code, response.text)
        return None

def fetch_hourly_forecast(api_key, lat,lon, hours=24):
    base_url = "https://api.weatherbit.io/v2.0/forecast/hourly"
    params = {
        "lat": lat,
        "lon":lon,
        "hours": hours,
        "key": api_key,
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
            {"role": "system", "content": "you are SurondShield AI-powered app that provides real-time, personalized risk alerts based on location and health data, helping users stay safe from weather changes , pollution, and natural disasters. and you can make use of ewmojis to make repsonse more interactive "},
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
@app.route('/risk_assessment', methods=['POST'])
def risk_ass():
    data = request.get_json(force=True)
    
    lat= data.get("lat")
    lon=data.get("lon")
    alert = fetch_weather_alerts(WEATHERBIT_API_KEY, lat,lon)    
    if not alert:
        alert = None
    name=data.get("name")
    email=data.get("email")
    age = data.get("age")
    weight = data.get("weight")
    height = data.get("height")
    bmi =data.get("bmi")

    current_data = fetch_current_weather(WEATHERBIT_API_KEY, lat,lon)
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

    forecast_data = fetch_hourly_forecast(WEATHERBIT_API_KEY, lat,lon, hours=24)
    if forecast_data and "data" in forecast_data:
    # Create JSON structure for hourly data
        hourly_forecast = [
            {
                "time": hour.get("timestamp_local"),
                "temperature": hour.get("temp"),
                "uv_index": hour.get("uv"),
                "precipitation": hour.get("precip"),
                "humidity": hour.get("rh"),
                "wind_speed": hour.get("wind_spd")
            } 
            for hour in forecast_data.get("data", [])
        ]        
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
        f"BMI: {bmi}\n\n"
        f"Weather Data:\n"
        f"- UV Index: {uv_index}\n"
        f"- AQI (Air Quality Index): {aqi}\n"
        f"- Liquid equivalent rain (mm): {precip}\n"
        f"- Probability of rain (%): {pop}\n"
        f"- Wind speed (m/s): {wind_speed}\n"
        f"- hourly_forcast : {hourly_forecast}\n"
        f"- Wind direction (degrees): {wind_direction} ({wind_cardinal})\n"
        f"- Accumulated snowfall (mm): {snow if snow else 'None'}\n"
        f"- Total snow depth (mm): {snow_depth if snow_depth else 'None'}\n"
        f"- Cloud coverage (%): {clouds}\n\n"
        f"Weather Alerts: {'Present' if alert else 'None'}\n\n"
        f"Forecast Summary:\n{forecast_summary}\n\n"
        f"Based on the above data, please provide recommendations and alerts if any significant risk also mention if user has good health form given data "
        f"is present for this individual. If there are no alerts or risks, simply say 'None'."
    )
        



    risk_response = get_risk_assessment(initial_prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
    if risk_response:
        risk_assessment = risk_response.get("choices", [{}])[0].get("message", {}).get("content", "No detailed risk assessment returned.") 
        result = {
            "name":name,
            "email":email,
            "location":city_name,
            "weight":weight,
            "age":age,
            "height":height,
            "city": city_name,
            "current_temp": current_temp,
            "bmi": bmi,
            "uv_index": uv_index,
            "aqi": aqi,
            "weather_alerts":  alert if alert else "None",
            "forecast_summary": forecast_summary,
            "risk_assessment": risk_assessment,
            "precip": precip,
            "pop": pop,
            "wind_speed": wind_speed,
            "wind_direction": wind_direction,
            "wind_cardinal": wind_cardinal,
            "snow": snow,
            "snow_depth": snow_depth,
            "clouds": clouds,
            "weather_description": weather_description,
            "hourly_forcast":hourly_forecast,
        }
        return jsonify(result), 200

    else:
        print("Databricks Playground API call for risk assessment failed.")
    
@app.route('/followup_query', methods=['POST'])
def followup_query():
    data = request.get_json(force=True)
    extracted_data = {
        "user_query": data.get("user_query", "No question provided so ask user to enter something"),
        "city_name": data.get("city_name", "Unknown"),
        "current_temp": data.get("current_temp", "N/A"),
        "uv_index": data.get("uv", "N/A"),
        "aqi": data.get("aqi", "N/A"),
        "precip": data.get("precip"),
        "pop": data.get("pop"),
        "wind_speed": data.get("wind_spd", "N/A"),
        "wind_direction": data.get("wind_dir", "N/A"),
        "wind_cardinal": data.get("wind_cdir", "N/A"),
        "snow": data.get("snow", "N/A"),
        "snow_depth": data.get("snow_depth", "N/A"),
        "clouds": data.get("clouds", "N/A"),
        "forecast_summary": data.get("forecast_summary", "No forecast available"),
        "weather_alerts": data.get("weather_alerts", "None"),
        "hourly_forcast":data.get("hourly_forcast"),
        # "weather_alert":data.get("alert")
    }        

    followup_prompt = (
        f"Based on current weather data for {extracted_data['city_name']}:\n"
        f"- Temperature: {extracted_data['current_temp']}°C\n"
        f"- UV Index: {extracted_data['uv_index']}\n"
        f"- AQI: {extracted_data['aqi']}\n"
        f"- Precipitation: {extracted_data['precip']} mm\n"
        f"- Rain Probability: {extracted_data['pop']}%\n"
        f"- Wind: {extracted_data['wind_speed']} m/s, {extracted_data['wind_direction']}° ({extracted_data['wind_cardinal']})\n"
        f"- hourly_forcast : {extracted_data['hourly_forcast']}\n"
        f"- Snow: {extracted_data['snow']} mm\n"
        f"- Snow Depth: {extracted_data['snow_depth']} mm\n"
        f"- Cloud Cover: {extracted_data['clouds']}%\n"
        f"- Alerts: {extracted_data['weather_alerts']}\n\n"
        f"User Question: {extracted_data['user_query']}\n\n"
        f"Please provide recommendations if applicable and only when needed dont bring it up everytime. and if you get empty query or user ask somwething out of context things liek who's president of usa or what is 1+2 means anything that is not related to data we have ask user to give something, dont answer that")     
    
    followup_response = get_risk_assessment(followup_prompt, DATABRICKS_API_URL, DATABRICKS_TOKEN)
    if not followup_response:
        return jsonify({"error": "Failed to call Databricks for follow-up query."}), 500

    answer = followup_response.get("choices", [{}])[0].get("message", {}).get("content", "No answer returned.")
    return jsonify({"answer": answer}), 200

            
if __name__ == "__main__":

    app.run(debug=True, port=2400)

   

