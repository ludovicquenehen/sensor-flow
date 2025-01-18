#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>

#define NUM_PINS 5
#define EEPROM_SIZE 512

WiFiClient wifiClient;
ESP8266WebServer server(80);

// Déclaration des pins
int pinNumbers[NUM_PINS] = {16, 5, 4, 0, 2};
int pinStates[NUM_PINS] = {LOW, LOW, LOW, LOW, LOW};
int pinWifiOn = 14;
int buttonPin = 12;
int APModeLedPin = 13;

// Struct pour regrouper tous les paramètres gérés en EEPROM
struct WiFiConfig {
  char serverName[100];
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
        isAPMode = true;
        startAPMode();
      }
    }
    isButtonPressed = false;
  }
}

// Mettre à jour l'état de la LED en fonction du mode
void updateLEDState() {
  digitalWrite(APModeLedPin, isAPMode ? HIGH : LOW);
	digitalWrite(pinWifiOn, WiFi.status() != WL_CONNECTED ? LOW : HIGH);
}

// Fonction pour démarrer le mode AP et serveur web
void startAPMode() {
  WiFi.softAP("ESP8266_Config", "12345678"); // Démarre le mode AP
  initializeAPWebServer(); // Démarre le serveur web
}

void initializeWebServer() {
	server.stop();
	server.on("/", HTTP_GET, handlePinState);

	// Configuration des pins pour changer leur état via des requêtes HTTP
	for (int i = 0; i < NUM_PINS; i++) {
		pinMode(pinNumbers[i], OUTPUT);
		digitalWrite(pinNumbers[i], LOW);  // Initialise les pins à LOW

		// Route pour éteindre la pin
		server.on("/state/" + String(i) + "/0", HTTP_GET, [i]() {
			digitalWrite(pinNumbers[i], LOW);  // Éteindre la pin
			server.send(200, "text/html", "");
		});

		// Route pour allumer la pin
		server.on("/state/" + String(i) + "/1", HTTP_GET, [i]() {
			digitalWrite(pinNumbers[i], HIGH);  // Allumer la pin
			server.send(200, "text/html", "");
		});
	}
	server.begin();
	Serial.println("HTTP server started");
}

// Initialiser le serveur web
void initializeAPWebServer() {
	server.stop();
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
    page += "<button><a href='/state/" + String(i) + "/1'><div>1</div><div>" + pinStateStr + "</div></a></button>";
  }

  page += "</body></html>";
  server.send(200, "text/html", page);
}

// Fonction pour configurer le Wi-Fi via une page web
void handleWiFiConfig() {
	String page = "<html><head><style>body { margin-left: 35%; margin-top: 15%; } h1 { color: #34eb89; } form { display: flex; flex-direction: column; gap: 2px; width: 300px;}span { font-weight: bold; color: #505050;}input { border-radius: 4px; padding: 8px 16px;}input[type=submit] { background: #34eb89;}</style></head><body>";
	page += "<h1>Configurer le serveur</h1>";
	page += "<form action='/save' method='POST'>";
	page += "<span>IP Address</span> <input type='text' name='ip_address' value='" + String(wifiConfig.ipAddress) + "'><br>";
	page += "<span>Gateway</span> <input type='text' name='gateway' value='" + String(wifiConfig.gateway) + "'><br>";
	page += "<span>Subnet</span> <input type='text' name='subnet' value='" + String(wifiConfig.subnet) + "'><br><br>";
	page += "<span>Scheduler server IP</span> <input type='text' name='server_name' value='" + String(wifiConfig.serverName) + "'><br><br>";
	page += "<span>Wifi SSID</span> <input type='text' name='ssid' value='" + String(wifiConfig.ssid) + "'><br>";
	page += "<span>Wifi Password</span> <input type='password' name='password' value='" + String(wifiConfig.password) + "'><br>";
	page += "<input type='submit' value='Save'>";
	page += "</form>";
	page += "</body></html>";

  server.send(200, "text/html", page);
}

// Sauvegarder les paramètres Wi-Fi dans l'EEPROM
void saveWiFiConfig() {
  int offset = 0;
	EEPROM.begin(EEPROM_SIZE); // Initialiser l'EEPROM
  EEPROM.write(offset++, wifiConfig.serverName, sizeof(wifiConfig.serverName));
  EEPROM.write(offset++, wifiConfig.ssid, sizeof(wifiConfig.ssid));
  EEPROM.write(offset++, wifiConfig.password, sizeof(wifiConfig.password));
  EEPROM.write(offset++, wifiConfig.ipAddress, sizeof(wifiConfig.ipAddress));
  EEPROM.write(offset++, wifiConfig.gateway, sizeof(wifiConfig.gateway));
  EEPROM.write(offset++, wifiConfig.subnet, sizeof(wifiConfig.subnet));
  EEPROM.commit();
  Serial.println("Configuration WiFi sauvegardée.");
	EEPROM.end(); // Libère les ressources de l'EEPROM
}

// Charger les paramètres Wi-Fi depuis l'EEPROM
void loadWiFiConfig() {
  int offset = 0;
	EEPROM.begin(EEPROM_SIZE); // Initialiser l'EEPROM
  EEPROM.read(offset++, wifiConfig.serverName, sizeof(wifiConfig.serverName));
  EEPROM.read(offset++, wifiConfig.ssid, sizeof(wifiConfig.ssid));
  EEPROM.read(offset++, wifiConfig.password, sizeof(wifiConfig.password));
  EEPROM.read(offset++, wifiConfig.ipAddress, sizeof(wifiConfig.ipAddress));
  EEPROM.read(offset++, wifiConfig.gateway, sizeof(wifiConfig.gateway));
  EEPROM.read(offset++, wifiConfig.subnet, sizeof(wifiConfig.subnet));
	EEPROM.end(); // Libère les ressources de l'EEPROM
  Serial.println("Configuration WiFi chargée.");
}

// Sauvegarder la nouvelle configuration Wi-Fi via la page web
void handleSaveConfig() {
  String newIP = server.arg("ip_address");
  String newGateway = server.arg("gateway");
  String newSubnet = server.arg("subnet");
  String newServerName = server.arg("server_name");
  String newSSID = server.arg("ssid");
  String newPassword = server.arg("password");

  // Vérification des entrées
  if (newServerName.length() > 0 && newSSID.length() > 0 && newPassword.length() > 0) {
    newIP.toCharArray(wifiConfig.ipAddress, sizeof(wifiConfig.ipAddress));
    newGateway.toCharArray(wifiConfig.gateway, sizeof(wifiConfig.gateway));
    newSubnet.toCharArray(wifiConfig.subnet, sizeof(wifiConfig.subnet));
    newServerName.toCharArray(wifiConfig.serverName, sizeof(wifiConfig.serverName));
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
  if (strlen(wifiConfig.ssid) > 0 && strlen(wifiConfig.password) > 0) {
    IPAddress ip, gateway, subnet;
    ip.fromString(String(wifiConfig.ipAddress));
    gateway.fromString(String(wifiConfig.gateway));
    subnet.fromString(String(wifiConfig.subnet));

    if (ip.isSet() && gateway.isSet() && subnet.isSet()) {
      Serial.println("Configuring static IP...");
      WiFi.config(ip, gateway, subnet);
      WiFi.begin(wifiConfig.ssid, wifiConfig.password);
    } else {
      Serial.println("Invalid static IP configuration, using DHCP...");
      isAPMode = true;
    }

    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
      delay(500);
      Serial.print(".");
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nConnected to WiFi");
    } else {
      Serial.println("\nFailed to connect. Entering AP mode for configuration...");
      isAPMode = true;
    }
  } else {
    Serial.println("No WiFi credentials found in EEPROM");
    isAPMode = true;
  }
}

void setup() {
  Serial.begin(115200);
  delay(3000);

  // Initialisation des pins
  pinMode(APModeLedPin, OUTPUT);
  pinMode(pinWifiOn, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);

  // Charger les paramètres WiFi depuis l'EEPROM
  loadWiFiConfig();

  // Tentative de connexion Wi-Fi
  connectWiFi();

  if (isAPMode) {
    startAPMode();
  } else {
		initializeWebServer();
	}
}

void loop() {
  server.handleClient();

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Vérification du bouton AP Mode
  handleButtonPress();

  // Mise à jour des LED
  updateLEDState();
}