#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Keypad.h>

// WiFi configuration
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* serverName = "http://host.wokwi.internal:5000/api/device/start"; // Server URL

// Servo and LED parameters
const int ledPinRed = 2;   // Pin for red LED
const int ledPinGreen = 13; // Pin for green LED
const int servoPin = 5;    // Pin for servo (changed to 5)
const int servoMin = 500;  // Minimum pulse width for servo (500 microseconds)
const int servoMax = 2400; // Maximum pulse width for servo (2400 microseconds)

// Keypad configuration
const byte ROWS = 4; // four rows
const byte COLS = 4; // four columns
char keys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
byte rowPins[ROWS] = {23, 22, 21, 19}; // Connect to the row pins
byte colPins[COLS] = {18, 17, 16, 15}; // Connect to the column pins

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

String code = "";

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32 started");

  WiFi.begin(ssid, password, 6);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  pinMode(ledPinRed, OUTPUT);
  pinMode(ledPinGreen, OUTPUT);

  // Configure the channel for servo control
  ledcSetup(0, 50, 16); // channel 0, frequency 50 Hz, 16-bit resolution
  ledcAttachPin(servoPin, 0);

  Serial.println("Enter 7-digit code:");
}

void loop() {
  char key = keypad.getKey();
  if (key) {
    if (key >= '0' && key <= '9') {
      code += key;
      Serial.print(key);
    } else if (key == '#') {
      Serial.println();
      if (code.length() == 7) {
        Serial.println("Sending code to server: " + code);
        if (verifyCode(code)) {
          turnServo(90); // Turn the servo to 90 degrees
          digitalWrite(ledPinGreen, HIGH); // Turn on the green LED
          delay(1000); // Wait for 5 seconds
          turnServo(0); // Return the servo to the initial position
          delay(1000); // Wait for 5 seconds
          turnServo(90); // Turn the servo to 90 degrees
          digitalWrite(ledPinGreen, LOW); // Turn off the green LED
        } else {
          digitalWrite(ledPinRed, HIGH); // Turn on the red LED
          delay(5000); // Wait for 5 seconds
          digitalWrite(ledPinRed, LOW); // Turn off the red LED
        }
        code = ""; // Reset the entered code
        Serial.println("Enter 7-digit code:");
      } else {
        Serial.println("Invalid code length. Enter 7-digit code:");
        code = "";
      }
    } else if (key == '*') {
      code = "";
      Serial.println("\nCode reset. Enter 7-digit code:");
    }
  }
}

void turnServo(int angle) {
  int pulseWidth = map(angle, 0, 180, servoMin, servoMax);
  int dutyCycle = (pulseWidth * pow(2, 16)) / 20000; // For 16-bit resolution
  ledcWrite(0, dutyCycle);
}

bool verifyCode(String code) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"IOTCode\": \"" + code + "\"}";
    Serial.println("JSON Payload: " + jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);

      DynamicJsonDocument doc(200);
      deserializeJson(doc, response);

      bool exists = doc["exists"];
      http.end();
      return exists;
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
      if (httpResponseCode == HTTPC_ERROR_CONNECTION_REFUSED) {
        Serial.println("Connection refused");
      } else if (httpResponseCode == HTTPC_ERROR_SEND_HEADER_FAILED) {
        Serial.println("Send header failed");
      } else if (httpResponseCode == HTTPC_ERROR_SEND_PAYLOAD_FAILED) {
        Serial.println("Send payload failed");
      } else if (httpResponseCode == HTTPC_ERROR_NOT_CONNECTED) {
        Serial.println("Not connected");
      } else if (httpResponseCode == HTTPC_ERROR_CONNECTION_LOST) {
        Serial.println("Connection lost");
      } else if (httpResponseCode == HTTPC_ERROR_NO_STREAM) {
        Serial.println("No stream");
      } else if (httpResponseCode == HTTPC_ERROR_NO_HTTP_SERVER) {
        Serial.println("No HTTP server");
      } else if (httpResponseCode == HTTPC_ERROR_TOO_LESS_RAM) {
        Serial.println("Too less RAM");
      } else if (httpResponseCode == HTTPC_ERROR_ENCODING) {
        Serial.println("Encoding error");
      } else if (httpResponseCode == HTTPC_ERROR_STREAM_WRITE) {
        Serial.println("Stream write error");
      } else if (httpResponseCode == HTTPC_ERROR_READ_TIMEOUT) {
        Serial.println("Read timeout");
      }
      http.end();
      return false;
    }
  } else {
    Serial.println("WiFi Disconnected");
    return false;
  }
}
