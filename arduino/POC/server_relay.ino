#include <FS.h>                   //this needs to be first, or it all crashes and burns...
#include <WiFiManager.h>          //https://github.com/tzapu/WiFiManager

#ifdef ESP32
  #include <SPIFFS.h>
#endif

#include <ArduinoJson.h>          //https://github.com/bblanchon/ArduinoJson

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

WiFiClient wifiClient;
ESP8266WebServer server(80);
WiFiManager wifiManager;
HTTPClient http;

char mqtt_server[40] = "192.168.1.22";
char mqtt_name[40] = "HYDROS_15248";
WiFiManagerParameter custom_mqtt_server("server", "mqtt server", mqtt_server, 40);
WiFiManagerParameter custom_mqtt_name("port", "mqtt port", mqtt_name, 40);

bool isEnableConfig = false;

//flag for saving data
bool shouldSaveConfig = false;

//callback notifying us of the need to save config
void saveConfigCallback () {
  Serial.println("Should save config");
  shouldSaveConfig = true;
}

float getValue_0(){
  return 23.2;
}

float getValue_1(){
  return 55.3;
}

int getValue_2(){
  return 954;
}

void getIpServer(){
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", String(mqtt_server));
}

void getServerName(){
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", String(mqtt_name));
}

void reboot(){
  String message = server.arg("plain");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", "");
  ESP.restart();
}

void enableConfig(){
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", "");
  wifiManager.resetSettings();
  ESP.restart();
}

void changeIpServer(){
  String message = server.arg("plain");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", "");

  setParameters(message, String(mqtt_name));
  ESP.restart();
}

void changeServerName(){
  //isEnableConfig = true;
  String message = server.arg("plain");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", "");

  setParameters(String(mqtt_server), message);
  ESP.restart();
}

void disableConfig(){
  isEnableConfig = false;
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", "");
}

void returnValue_0(){
  float temp = 21.3;//dht.readTemperature(false);
  Serial.print("Water temperatuure: ");
  Serial.println(temp);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", String(temp));
}

void returnValue_1(){
  float hum = 1.35;//dht.readHumidity();
  Serial.print("Water EC: ");
  Serial.println(hum);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", String(hum));
}

void returnValue_2(){
  int hum = 54.2;//lux
  Serial.print("Water oxygene: ");
  Serial.println(hum);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", String(hum));
}

void returnStateNotFound(){
  server.send(404, "text/plain", "Not found");
}

void handle_OnConnect() {
  float temp = getValue_0();
  float hum = getValue_1();
  int lum = getValue_2();
  server.send(200, "text/html", SendHTML(temp, hum, lum));
}

//TODO: change password (add password to AP), change espName + message (Redémarrage dasn 3 secondes)

String SendHTML(float temp, float hum, int lum){
  String ptr = "<!DOCTYPE html>";
ptr+="<html><body>";
ptr+="<script src='https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.min.js' integrity='sha512-u9akINsQsAkG9xjc1cnGF4zw5TFDwkxuc9vUp5dltDWYCSmyd0meygbvgXrlc/z7/o4a19Fb5V0OUE58J7dcyw==' crossorigin='anonymous' referrerpolicy='no-referrer'></script>";
ptr+="<script>const ArduinoRelay=()=>{return axios.create({baseURL:'http://192.168.2.50'})},ArduinoWeather=()=>{return axios.create({baseURL:'192.168.2.51'})},ArduinoWater=()=>{return axios.create({baseURL:'192.168.2.52'})},formatHour=e=>(parseInt(e.split(':')[0])<10?'0'+e.split(':')[0]:e.split(':')[0])+':'+(parseInt(e.split(':')[1])<10?'0'+e.split(':')[1]:e.split(':')[1]),checkDuration=e=>{let t=new Date,a=t.getHours()+':'+t.getMinutes();return a=formatHour(a),e.start>e.end?!(e.start<=a&&a<=e.end):e.start<=a&&a<=e.end},checkInterval=e=>{let t=[],a=new Date('July 4 2000 '+e.dayStart),n=new Date('July 4 2000 '+e.dayEnd),r=null,s=parseInt(3600*e.dayOnInterval.split(':')[0])+parseInt(60*e.dayOnInterval.split(':')[1]),i=parseInt(3600*e.dayOffInterval.split(':')[0])+parseInt(60*e.dayOffInterval.split(':')[1]);for(;a<=n;)t.push(formatHour(a.getHours()+':'+a.getMinutes())),r=new Date('July 4 2000 '+a.getHours()+':'+a.getMinutes()),a=new Date(r.getTime()+1e3*s),t.push(formatHour(a.getHours()+':'+a.getMinutes())),a=new Date(a.getTime()+1e3*i);for(a=new Date('July 4 2000 '+e.nightStart),n=new Date('July 4 2000 '+e.nightEnd),r=null,s=parseInt(3600*e.nightOnInterval.split(':')[0])+parseInt(60*e.nightOnInterval.split(':')[1]),i=parseInt(3600*e.nightOffInterval.split(':')[0])+parseInt(60*e.nightOffInterval.split(':')[1]);a<=n;)t.push(formatHour(a.getHours()+':'+a.getMinutes())),r=new Date('July 4 2000 '+a.getHours()+':'+a.getMinutes()),a=new Date(r.getTime()+1e3*s),t.push(formatHour(a.getHours()+':'+a.getMinutes())),a=new Date(a.getTime()+1e3*i);let l=new Date,o=l.getHours()+':'+l.getMinutes();o=(l=new Date).getHours()+':'+l.getMinutes(),o=formatHour(o);let u=t[0],c=0;for(;u<o;)u=t[c],c++;return c%2==1&&c--,t[c-2]<=o&&o<=t[c-1]},checkSensor=async e=>{let t=[];for(let a of e.sensors){const e=new Promise(async(e,t)=>{try{let t='weather'===a.type?await axios.create({baseURL:'192.168.2.51'}).get('/value/'+a.pin):await axios.create({baseURL:'192.168.2.52'}).get('/value/'+a.pin);t=parseFloat(t.data),a.minValue=parseFloat(a.minValue),a.maxValue=parseFloat(a.maxValue),a.minValue>a.maxValue?t<a.minValue||t>a.maxValue?e(!1):e(!0):t>a.minValue&&t<a.maxValue?e(!0):e(!1)}catch(t){e(!1)}});t.push(e)}let a=await Promise.all(t).then(e=>e).catch(e=>{console.log(e)});return''!==Object.values(a).map(e=>e?'e':'').join('')},checkPin=async e=>{let t=[];if(save[e]){if(!save[e].isLock){for(let a of save[e].config){const n=new Promise(async(t,n)=>{console.log(e);let r=a.type,s='duration'==r?checkDuration(a):'interval'==r?checkInterval(a):await checkSensor(a);t(s),console.log(e,r,s)});t.push(n)}let a=await Promise.all(t).then(e=>e).catch(e=>{console.log(e)}),n=''!==Object.values(a).map(e=>e?'e':'').join('');save[e].state=n,console.log('  - CHECK PIN',e,n)}return save[e].state}return console.log('  - CHECK PIN',e,'undefined'),-1},checkPins=async()=>{try{let e=new Date,t=e.getHours()+':'+e.getMinutes();t=formatHour(t),console.log('BEGIN CHECK PINs',t);for(let e=0;e<5;e++)checkPin(e);console.log('END CHECK PINs')}catch(e){}},cleanPins=async()=>{for(let e=0;e<5;e++)save[e].isLock=!1};let save={0:{state:!0,config:[{type:'duration',start:'06:00:00',end:'23:59:00'}],arduino:'weather',isLock:!1},1:{state:!1,config:[{type:'interval',dayStart:'06:00:00',dayEnd:'23:59:00',nightStart:'23:59:00',nightEnd:'06:00:00',dayOnInterval:'00:05:00',dayOffInterval:'03:00:00',nightOnInterval:'00:00:00',nightOffInterval:'06:00:00'}],arduino:'weather',isLock:!1},2:{state:!1,config:[{type:'interval',dayStart:'06:00:00',dayEnd:'23:59:00',nightStart:'23:59:00',nightEnd:'06:00:00',dayOnInterval:'06:00:00',dayOffInterval:'00:00:00',nightOnInterval:'00:10:00',nightOffInterval:'01:00:00'}],arduino:'weather',isLock:!1},3:{state:!1,config:[{type:'interval',dayStart:'06:00:00',dayEnd:'23:59:00',nightStart:'23:59:00',nightEnd:'06:00:00',dayOnInterval:'00:05:00',dayOffInterval:'00:25:00',nightOnInterval:'00:05:00',nightOffInterval:'01:00:00'}],arduino:'weather',isLock:!1},4:{state:!1,config:[{type:'interval',dayStart:'06:00:00',dayEnd:'23:59:00',nightStart:'23:59:00',nightEnd:'06:00:00',dayOnInterval:'00:05:00',dayOffInterval:'00:15:00',nightOnInterval:'00:05:00',nightOffInterval:'04:00:00'}],arduino:'water',isLock:!1},5:{arduino:'water',isLock:!1,config:[{type:'sensor',sensors:[{name:'phLevel',pin:1,maxValue:6.5,duration:'00:00:02',minValue:7},{name:'EC',pin:2,maxValue:1.55,duration:'00:00:02',minValue:1.5},{name:'waterLevel',pin:3,maxValue:0,duration:'00:00:30',minValue:100}]}],state:!1},6:{isLock:!1,config:[{type:'sensor',sensors:[{name:'phLevel',pin:1,maxValue:6.5,duration:'00:00:02',minValue:7}]}],arduino:'water',state:!1},7:{isLock:!1,config:[{type:'sensor',sensors:[{name:'EC',pin:2,minValue:1.2,maxValue:0,duration:'00:00:02'}]}],arduino:'water',state:!1}};cleanPins(),checkPins(),setInterval(()=>{checkPins()},3e4);</script>";
ptr+="</body></html>";
  return ptr;
}

void setParameters(String server, String lib){
  //read updated parameters
  strcpy(mqtt_server, server.c_str());
  strcpy(mqtt_name, lib.c_str());
  Serial.println("The values in the file are: ");
  Serial.println("\tmqtt_server : " + String(mqtt_server));
  Serial.println("\tmqtt_name : " + String(mqtt_name));

  shouldSaveConfig = true;

  //save the custom parameters to FS
  if (shouldSaveConfig) {
    Serial.println("saving config");
#ifdef ARDUINOJSON_VERSION_MAJOR >= 6
    DynamicJsonDocument json(1024);
#else
    DynamicJsonBuffer jsonBuffer;
    JsonObject& json = jsonBuffer.createObject();
#endif

    json["mqtt_server"] = mqtt_server;
    json["mqtt_name"] = mqtt_name;

    File configFile = SPIFFS.open("/config.json", "w");
    if (!configFile) {
      Serial.println("failed to open config file for writing");
    }

#ifdef ARDUINOJSON_VERSION_MAJOR >= 6
    serializeJson(json, Serial);
    serializeJson(json, configFile);
#else
    json.printTo(Serial);
    json.printTo(configFile);
#endif
    configFile.close();
    Serial.println("The values printed in the file are: ");
    Serial.println("\tmqtt_server : " + String(json["mqtt_server"]));
    Serial.println("\tmqtt_name : " + String(json["mqtt_name"]));
    //end save
  }
}

bool setAPConfig(bool active){
  //WiFi.mode(WIFI_STA);
  //wifiManager.resetSettings();
  if(active){
    if (!wifiManager.startConfigPortal("EOLE_AP")) {
      Serial.println("failed to connect and hit timeout");
      delay(3000);
      return false;
      //reset and try again, or maybe put it to deep sleep
      ESP.restart();
      delay(5000);
    }
  }else{
    if (!wifiManager.autoConnect("EOLE_AP")) {
      Serial.println("failed to connect and hit timeout");
      delay(3000);
      return false;
      //reset and try again, or maybe put it to deep sleep
      ESP.restart();
      delay(5000);
    }
  }

  //if you get here you have connected to the WiFi
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  setParameters(String(mqtt_server), String(mqtt_name));

  return true;
}

void setup() {
  //IPAddress    apIP(192, 168, 1, 55);

  Serial.begin(115200);
  /*WiFi.mode(WIFI_AP_STA);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP("GROWTECK_MESH");*/
  WiFi.mode(WIFI_STA);

  std::vector<const char *> menu = {"wifi", "info"};
  wifiManager.setMenu(menu);

  //SPIFFS.format();

  Serial.println("Mounting FS...");

  if (SPIFFS.begin()) {
    Serial.println("mounted file system");
    if (SPIFFS.exists("/config.json")) {
      //file exists, reading and loading
      Serial.println("reading config file");
      File configFile = SPIFFS.open("/config.json", "r");
      if (configFile) {
        Serial.println("opened config file");
        size_t size = configFile.size();
        // Allocate a buffer to store contents of the file.
        std::unique_ptr<char[]> buf(new char[size]);

        configFile.readBytes(buf.get(), size);

#ifdef ARDUINOJSON_VERSION_MAJOR >= 6
        DynamicJsonDocument json(1024);
        auto deserializeError = deserializeJson(json, buf.get());
        serializeJson(json, Serial);
        if ( ! deserializeError ) {
#else
        DynamicJsonBuffer jsonBuffer;
        JsonObject& json = jsonBuffer.parseObject(buf.get());
        json.printTo(Serial);
        if (json.success()) {
#endif
          Serial.println("\nparsed json");
          strcpy(mqtt_server, json["mqtt_server"]);
          strcpy(mqtt_name, json["mqtt_name"]);
        } else {
          Serial.println("failed to load json config");
        }
        configFile.close();
      }
    }
  } else {
    Serial.println("failed to mount FS");
  }
  //end read

  //WiFiManager
  //Local intialization. Once its business is done, there is no need to keep it around
  //WiFiManager wifiManager;

  //set config save notify callback
  wifiManager.setSaveConfigCallback(saveConfigCallback);

  //set static ip
  //wifiManager.setSTAStaticIPConfig(IPAddress(10, 0, 1, 99), IPAddress(10, 0, 1, 1), IPAddress(255, 255, 255, 0));

  //add all your parameters here
  wifiManager.addParameter(&custom_mqtt_server);
  wifiManager.addParameter(&custom_mqtt_name);

  //reset settings - for testing
  //wifiManager.resetSettings();

  //set minimu quality of signal so it ignores AP's under that quality
  //defaults to 8%
  //wifiManager.setMinimumSignalQuality();

  //sets timeout until configuration portal gets turned off
  //useful to make it all retry or go to sleep
  //in seconds
  //wifiManager.setTimeout(120);

  setAPConfig(false);

  server.on("/", HTTP_GET, handle_OnConnect);

  server.on("/reboot", HTTP_GET, reboot);
  server.on("/config/enable", HTTP_GET, enableConfig);
  server.on("/config/disable", HTTP_GET, disableConfig);
  server.on("/info/server", HTTP_POST, changeIpServer);
  server.on("/info/name", HTTP_POST, changeServerName);

  server.on("/info/ip", HTTP_GET, getIpServer);
  server.on("/info/name", HTTP_GET, getServerName);

  server.on("/value/0", HTTP_GET, returnValue_0);
  server.on("/value/1", HTTP_GET, returnValue_1);
  server.on("/value/2", HTTP_GET, returnValue_2);

  server.onNotFound(returnStateNotFound);

  server.begin();
}

void loop() {
  server.handleClient();

  // put your main code here, to run repeatedly:
  /*http.begin(wifiClient, "http://" + String(mqtt_server) + ":" + String(mqtt_name) + "/value/0");
  http.addHeader("Content-Type", "application/json");
  float sensorValue = getValue_0();
  int httpCode = http.POST("{\"value\": \"" + String(sensorValue) + "\"}");
  http.end();

  http.begin(wifiClient, "http://" + String(mqtt_server) + ":" + String(mqtt_name) + "/value/1");
  http.addHeader("Content-Type", "application/json");
  sensorValue = getValue_1();
  httpCode = http.POST("{\"value\": \"" + String(sensorValue) + "\"}");
  http.end();

  http.begin(wifiClient, "http://" + String(mqtt_server) + ":" + String(mqtt_name) + "/value/2");
  http.addHeader("Content-Type", "application/json");
  sensorValue = getValue_2();
  httpCode = http.POST("{\"value\": \"" + String(sensorValue) + "\"}");
  http.end();*/

  if (isEnableConfig) {
    bool connected = setAPConfig(true);
    if(connected){
      isEnableConfig = false;
    }
  }

  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    Serial.printf("Command received %s \n", command);
  }
}