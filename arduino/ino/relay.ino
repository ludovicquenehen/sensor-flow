#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>

#define NUM_PINS 4
#define EEPROM_SIZE 512

WiFiClient wifiClient;
ESP8266WebServer server(80);

// Déclaration des pins
int pinNumbers[NUM_PINS] = {16, 5, 4, 0};
int pinStates[NUM_PINS] = {LOW, LOW, LOW, LOW};
int pinWifiOn = 14;
int buttonPin = 12;
int APModeLedPin = 13;

// Struct pour regrouper tous les paramètres gérés en EEPROM
struct WiFiConfig {
  char ssid[32];
  char password[32];
  char ipAddress[16];
  char gateway[16];
  char subnet[16];
};

WiFiConfig wifiConfig;

// Variables pour la gestion du bouton et du mode AP
bool isButtonPressed = false;
bool isAPMode = false;
int buttonPressStart = millis();

// Fonction pour gérer la pression du bouton pour passer en AP Mode
void handleButtonPress() {
  if (digitalRead(buttonPin) == LOW && !isButtonPressed) {
    buttonPressStart = millis();
    isButtonPressed = true;
  }

  // Vérifie si le bouton a été relâché après une pression prolongée
  if (isButtonPressed && digitalRead(buttonPin) == HIGH) {
    unsigned long buttonPressDuration = millis() - buttonPressStart;
    if (buttonPressDuration > 2000) {
      // Si la pression dure plus de 2 secondes, passer en mode AP
      if (!isAPMode) {  // Evite de redémarrer le mode AP si déjà activé
        startAPMode();
        updateLEDState();
      }
    }
    isButtonPressed = false;
  }
}

// Mettre à jour l'état de la LED en fonction du mode
void updateLEDState() {
  digitalWrite(APModeLedPin, isAPMode ? HIGH : LOW);
  digitalWrite(pinWifiOn, WiFi.status() != WL_CONNECTED || isAPMode ? LOW : HIGH);
}

// Fonction pour démarrer le mode AP et serveur web
void startAPMode() {
  isAPMode = true;
  WiFi.softAP("ESP8266_Config", "12345678"); // Démarre le mode AP
  IPAddress apIP = WiFi.softAPIP();
  Serial.print("AP IP Address: ");
  Serial.println(apIP);
  initializeAPWebServer(); // Démarre le serveur web
}

void reinitServer() {
  //server.stop();    // Arrête le serveur actuel
  //delete server;     // Libère l'ancienne instance
  //server = new ESP8266WebServer(80); // Crée une nouvelle instance
}

void initializeWebServer() {
  server.on("/pins", HTTP_GET, handlePinState);

  // Configuration des pins pour changer leur état via des requêtes HTTP
  for (int i = 0; i < NUM_PINS; i++) {
    pinMode(pinNumbers[i], OUTPUT);
    digitalWrite(pinNumbers[i], LOW);  // Initialise les pins à LOW

    // Route pour éteindre la pin
    server.on("/state/" + String(i) + "/0", HTTP_GET, [i]() {
      digitalWrite(pinNumbers[i], LOW);  // Éteindre la pin
      pinStates[i] = LOW;
      server.send(200, "text/html", "");
    });

    // Route pour allumer la pin
    server.on("/state/" + String(i) + "/1", HTTP_GET, [i]() {
      digitalWrite(pinNumbers[i], HIGH);  // Allumer la pin
      pinStates[i] = HIGH;
      server.send(200, "text/html", "");
    });

    // Route pour renvoyer l'état du pin
    server.on("/state/" + String(i), HTTP_GET, [i]() {
      server.send(200, "text/html", pinStates[i] == HIGH ? "1" : "0" );
    });
  }
  server.begin();
  Serial.println("HTTP server started");
}

// Initialiser le serveur web
void initializeAPWebServer() {
  reinitServer();
  server.on("/", HTTP_GET, handleWiFiConfig);
  server.on("/save", HTTP_POST, handleSaveConfig);
  server.begin();
  Serial.println("HTTP server AP Mode started");
}

void handlePinState() {
  String page = "<html><head><script>setInterval(() => { window.location.reload() }, 30000)</script><style>a { text-decoration: none; color: black; display: flex; flex-direction: column; padding: 32px; } button { border-radius: 8px; }</style></head><body>";

  // Boucle pour afficher l'état actuel de chaque pin
  for (int i = 0; i < NUM_PINS; i++) {
    String pinStateStr = (pinStates[i] == HIGH) ? "OFF" : "ON";
    String pinNextState = (pinStates[i] == HIGH) ? "0" : "1";
    page += "<button><a href='/state/" + String(i) + "/" + pinNextState  + "'><div>" + (i+1) + "</div><div>" + pinStateStr + "</div></a></button>";
  }

  page += "</body></html>";
  server.send(200, "text/html", page);
}

// Fonction pour configurer le Wi-Fi via une page web
void handleWiFiConfig() {
  if (!wifiConfig.ipAddress) {
    strcpy(wifiConfig.ssid, "ssid");
    strcpy(wifiConfig.password, "password");
    strcpy(wifiConfig.ipAddress, "192.168.1.100");
    strcpy(wifiConfig.gateway, "192.168.1.254");
    strcpy(wifiConfig.subnet, "255.255.255.0");
  }

  String page = "<html><head><style>body { margin-left: 35%; margin-top: 15%; } h1 { color: #34eb89; } form { display: flex; flex-direction: column; gap: 2px; width: 300px;}span { font-weight: bold; color: #505050;}input { border-radius: 4px; padding: 8px 16px;}input[type=submit] { background: #34eb89;}</style></head><body>";
  page += "<h1>Configurer le serveur</h1>";
  page += "<form action='/save' method='POST'>";
  page += "<span>IP Address</span> <input type='text' name='ip_address' value='" + String(wifiConfig.ipAddress) + "'><br>";
  page += "<span>Gateway</span> <input type='text' name='gateway' value='" + String(wifiConfig.gateway) + "'><br>";
  page += "<span>Subnet</span> <input type='text' name='subnet' value='" + String(wifiConfig.subnet) + "'><br>";
  page += "<span>Wifi SSID</span> <input type='text' name='ssid' value='" + String(wifiConfig.ssid) + "'><br>";
  page += "<span>Wifi Password</span> <input type='password' name='password' value='" + String(wifiConfig.password) + "'><br>";
  page += "<input type='submit' value='Save'>";
  page += "</form>";
  page += "</body></html>";

  server.send(200, "text/html", page);
}

// Sauvegarder les paramètres Wi-Fi dans l'EEPROM
void saveWiFiConfig() {
  EEPROM.begin(EEPROM_SIZE); // Initialiser l'EEPROM
  EEPROM.put(0, wifiConfig); // Écrire la structure complète à partir de l'adresse 0
  EEPROM.commit();           // Valider les changements
  Serial.println("Configuration WiFi sauvegardée.");
  EEPROM.end();              // Libérer les ressources de l'EEPROM
}

// Charger les paramètres Wi-Fi depuis l'EEPROM
void loadWiFiConfig() {
  EEPROM.begin(EEPROM_SIZE); // Initialiser l'EEPROM
  EEPROM.get(0, wifiConfig); // Lire la structure complète à partir de l'adresse 0
  EEPROM.end();              // Libérer les ressources de l'EEPROM
  Serial.println("Configuration WiFi chargée.");
}

// Sauvegarder la nouvelle configuration Wi-Fi via la page web
void handleSaveConfig() {
  String newIP = server.arg("ip_address");
  String newGateway = server.arg("gateway");
  String newSubnet = server.arg("subnet");
  String newSSID = server.arg("ssid");
  String newPassword = server.arg("password");

  // Vérification des entrées
  if (newIP.length() > 0 && newSSID.length() > 0 && newPassword.length() > 0) {
    newIP.toCharArray(wifiConfig.ipAddress, sizeof(wifiConfig.ipAddress));
    newGateway.toCharArray(wifiConfig.gateway, sizeof(wifiConfig.gateway));
    newSubnet.toCharArray(wifiConfig.subnet, sizeof(wifiConfig.subnet));
    newSSID.toCharArray(wifiConfig.ssid, sizeof(wifiConfig.ssid));
    newPassword.toCharArray(wifiConfig.password, sizeof(wifiConfig.password));

    // Sauvegarde dans l'EEPROM
    saveWiFiConfig();
    server.send(200, "text/html", "<html><body><h1>WiFi Saved! Rebooting...</h1></body></html>");
    delay(2000); // Attente avant le redémarrage
    ESP.restart(); // Redémarre pour appliquer les nouveaux paramètres
  } else {
    server.send(200, "text/html", "<html><body><h1>Invalid input. Please try again.</h1></body></html>");
  }
}

// Connexion Wi-Fi en utilisant les paramètres enregistrés
void connectWiFi() {
  // Arrête le mode AP
  WiFi.softAPdisconnect(true);
  isAPMode = false;
  delay(100); // Petite pause pour éviter les conflits

  // Passe en mode STA
  WiFi.mode(WIFI_STA);
  
  if (strlen(wifiConfig.ssid) > 0 && strlen(wifiConfig.password) > 0) {
    IPAddress ip, gateway, subnet;
    ip.fromString(String(wifiConfig.ipAddress));
    gateway.fromString(String(wifiConfig.gateway));
    subnet.fromString(String(wifiConfig.subnet));

    if (ip.isSet() && gateway.isSet() && subnet.isSet()) {
      Serial.println("Configuring static IP...");
      Serial.print("try to connect on");
      Serial.println(wifiConfig.ssid);
      Serial.print(wifiConfig.password);
      WiFi.config(ip, gateway, subnet);
      WiFi.begin(wifiConfig.ssid, wifiConfig.password);
    } else {
      Serial.println("Invalid static IP configuration, using DHCP...");
      startAPMode();
    }

    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
      digitalWrite(pinWifiOn, HIGH);
      delay(500);
      digitalWrite(pinWifiOn, LOW);
      Serial.print(".");
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nConnected to WiFi");
    } else {
      Serial.println("\nFailed to connect. Entering AP mode for configuration...");
      startAPMode();
    }
  } else {
    Serial.println("No WiFi credentials found in EEPROM");
    startAPMode();
  }
}

void setup() {
  Serial.begin(115200);
  delay(3000);

  // Initialisation des pins
  pinMode(APModeLedPin, OUTPUT);
  pinMode(pinWifiOn, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);

  updateLEDState();

  // Lecture de la configuration et connexion
  loadWiFiConfig();
  connectWiFi();

  if (isAPMode) {
    startAPMode();
  } else {
    initializeWebServer();
  }
}

void loop() {
  server.handleClient();

  if (WiFi.status() != WL_CONNECTED && !isAPMode) {
    connectWiFi();
  }

  handleButtonPress();
  updateLEDState();
}