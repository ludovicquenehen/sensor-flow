class Eole extends HTMLElement {
  enableConfig() {
      var requestOptions = { method: 'GET', redirect: 'follow' };
      fetch('/enableConfig', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }

  toggleConfig() {
      var x = this.shadowRoot.getElementById('main');
      var y = this.shadowRoot.getElementById('config');
      if (x.style.display === 'none') {
      x.style.display = 'block';
      y.style.display = 'none';
      } else {
      x.style.display = 'none';
      y.style.display = 'block';
      }
  }

  changeIpServer() {
      var x = this.shadowRoot.getElementById('ip_server');
      x = x.value;
      var requestOptions = { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: x, redirect: 'follow' };
      fetch('/changeIpServer', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
      setTimeout(function(){ location.reload(); }, 3000);
  }

  constructor() {
      super();

      this.shadow = this.attachShadow({mode: 'open'});
      this.temp = 23.3;
      this.hum = 53.2;
      this.lum = 954;
      this.mqtt_server = "192.168.1.22";
  }

  drawInterface(){
      var wrapper = document.createElement('div');
      wrapper.className = 'wrapper';
      wrapper.id = 'wrapper';

      var style = "";
      style+="    <style>";
      style+="      .wrapper {";
      style+="        font-family: Helvetica;";
      style+="        margin: 0px auto;";
      style+="        text-align: center;";
      style+="        background: #343a40;";
      style+="      }";
      style+="      h1 {";
      style+="        color: #20c997;";
      style+="        margin: 4px auto 30px;";
      style+="        margin-left: 24px !important;";
      style+="      }";
      style+="      p {";
      style+="        font-size: 24px;";
      style+="        color: #f8f9fa;";
      style+="        margin-bottom: 10px;";
      style+="      }";
      style+="      svg {";
      style+="        height: 24px;";
      style+="        margin-right: 4px;";
      style+="      }";
      style+="      input {";
      style+="        height: 24px;";
      style+="        width: 50%;";
      style+="        padding: 2px;";
      style+="        font-size: 16px;";
      style+="        margin: 4px auto 4px;";
      style+="      }";
      style+="      #config {";
      style+="            display: none;";
      style+="      }";
      style+="      #toggle-config {";
      style+="            position: absolute;"
      style+="            right: 8px;";
      style+="            top: 8px;";
      style+="            color: #f8f9fa;";
      style+="      }";
      style+="      #toggle-config2 {";
      style+="            position: absolute;"
      style+="            right: 8px;";
      style+="            top: 8px;";
      style+="            color: #f8f9fa;";
      style+="      }";
      style+="      #enable-config {";
      style+="            padding: 4px;";
      style+="            margin-top: 32px;";
      style+="            font-weight: 600;";
      style+="            background: #6c757d;";
      style+="            color: #f8f9fa;";
      style+="      }";
      style+="      #sticky-head {";
      style+="            padding: 4px;";
      style+="            font-weight: 600;";
      style+="            color: #f8f9fa;";
      style+="      }";
      style+="      #sticky-head2 {";
      style+="            padding: 4px;";
      style+="            font-weight: 600;";
      style+="            color: #f8f9fa;";
      style+="      }";
      style+="      #reboot-message {";
      style+="          padding: 16px;";
      style+="          color: #dc3545;";
      style+="          font-weight: 700;";
      style+="      }";
      style+="    </style>";

      wrapper.innerHTML = wrapper.innerHTML + style;
      //TODO: créer les svg et bouton dans le code et appendChild

      var config = document.createElement('div');
      config.id = 'config';
      var stickyHead = document.createElement('div');
      stickyHead.id = 'sticky-head';
      var toggleConfig = document.createElement('div');
      toggleConfig.id = 'toggle-config';

      var rebootMessage = document.createElement('div');
      rebootMessage.id = 'reboot-message';
      rebootMessage.innerHTML = "&nbsp;"

      toggleConfig.innerHTML = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='undo' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' class='svg-inline--fa fa-undo fa-w-16 fa-3x' > <path fill='#f8f9fa' d='M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z' class='' ></path> </svg>";
      stickyHead.appendChild(toggleConfig)
      config.appendChild(stickyHead)
      config.appendChild(rebootMessage)

      var ptr = "";
      ptr +="     <span style='color:#f8f9fa; margin-right: 4px;'>IP Server&nbsp;</span><input maxLength='35' type='text' id='ip_server' placeholder='" + this.mqtt_server + "'><svg id='change-ip-server' aria-hidden='true' focusable='false' data-prefix='fas' data-icon='check' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' class='svg-inline--fa fa-check fa-w-16 fa-3x' style='margin-bottom: -6px; margin-left: 8px;'><path fill='#28a745' d='M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z' class=''></path></svg>";
      ptr+="      <div id='enable-config'>";
      ptr+="        Réinitialiser la configuration d'usine";
      ptr+="      </div>";
      ptr+="    </div>";
      config.innerHTML += ptr;
      wrapper.appendChild(config);

      var main = document.createElement('div');
      main.id = 'main';
      var stickyHead2 = document.createElement('div');
      stickyHead.id = 'sticky-head2';
      var toggleConfig2 = document.createElement('div');
      toggleConfig2.id = 'toggle-config2';
      stickyHead2.innerHTML += "<h1>EOLE</h1>";

      toggleConfig2.innerHTML = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='cog' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' class='svg-inline--fa fa-cog fa-w-16 fa-3x' > <path fill='#f8f9fa' d='M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z' class='' ></path> </svg>";
      stickyHead2.appendChild(toggleConfig2)
      main.appendChild(stickyHead2)

      ptr = "";
      ptr+="      <p>";
      ptr+="        <svg";
      ptr+="          aria-hidden='true'";
      ptr+="          focusable='false'";
      ptr+="          data-prefix='fas'";
      ptr+="          data-icon='temperature-high'";
      ptr+="          role='img'";
      ptr+="          xmlns='http://www.w3.org/2000/svg'";
      ptr+="          viewBox='0 0 512 512'";
      ptr+="          class='svg-inline--fa fa-temperature-high fa-w-16 fa-3x'";
      ptr+="        >";
      ptr+="          <path";
      ptr+="            fill='#ffc107'";
      ptr+="            d='M416 0c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm-160-16C256 50.1 205.9 0 144 0S32 50.1 32 112v166.5C12.3 303.2 0 334 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-34-12.3-64.9-32-89.5V112zM144 448c-44.1 0-80-35.9-80-80 0-25.5 12.2-48.9 32-63.8V112c0-26.5 21.5-48 48-48s48 21.5 48 48v192.2c19.8 14.8 32 38.3 32 63.8 0 44.1-35.9 80-80 80zm16-125.1V112c0-8.8-7.2-16-16-16s-16 7.2-16 16v210.9c-18.6 6.6-32 24.2-32 45.1 0 26.5 21.5 48 48 48s48-21.5 48-48c0-20.9-13.4-38.5-32-45.1z'";
      ptr+="            class=''";
      ptr+="          ></path></svg";
      ptr+="        >Température <span style='color: #ffc107'>";
      ptr+=this.temp;
      ptr+="        °C</span>";
      ptr+="      </p>";
      ptr+="      <canvas id='temperature' width='400' height='200'></canvas>";
      ptr+="";
      ptr+="      <p>";
      ptr+="        <svg";
      ptr+="          aria-hidden='true'";
      ptr+="          focusable='false'";
      ptr+="          data-prefix='fas'";
      ptr+="          data-icon='humidity'";
      ptr+="          role='img'";
      ptr+="          xmlns='http://www.w3.org/2000/svg'";
      ptr+="          viewBox='0 0 384 512'";
      ptr+="          class='svg-inline--fa fa-humidity fa-w-12 fa-3x'";
      ptr+="        >";
      ptr+="          <path";
      ptr+="            fill='#17a2b8'";
      ptr+="            d='M223.9 22.1c-8.7-28.8-53.9-30.1-63.8 0C109.1 179.8 0 222.7 0 333.9 0 432.3 85.9 512 192 512s192-79.7 192-178.1c0-111.7-108.9-153.3-160.1-311.8zM96 288c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm49.5 131.8c-2.8 3.5-7.8 4-11.2 1.2l-12.5-10c-3.4-2.8-4-7.8-1.2-11.2l118-147.5c2.8-3.4 7.8-4 11.2-1.2l12.5 10c3.5 2.8 4 7.8 1.2 11.2l-118 147.5zM256 416c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z'";
      ptr+="            class=''";
      ptr+="          ></path></svg";
      ptr+="        >Humidité <span style='color: #17a2b8'>";
      ptr+=this.hum;
      ptr+="        %</span>";
      ptr+="      </p>";
      ptr+="      <canvas id='humidity' width='400' height='200'></canvas>";
      ptr+="      <p>";
      ptr+="        <svg";
      ptr+="          aria-hidden='true'";
      ptr+="          focusable='false'";
      ptr+="          data-prefix='fas'";
      ptr+="          data-icon='sun'";
      ptr+="          role='img'";
      ptr+="          xmlns='http://www.w3.org/2000/svg'";
      ptr+="          viewBox='0 0 512 512'";
      ptr+="          class='svg-inline--fa fa-sun fa-w-16 fa-3x'";
      ptr+="        >";
      ptr+="          <path";
      ptr+="            fill='#6f42c1'";
      ptr+="            d='M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z'";
      ptr+="            class=''";
      ptr+="          ></path></svg";
      ptr+="        >Luminosité <span style='color: #6f42c1'>";
      ptr+=this.lum;
      ptr+="        lumens</span>";
      ptr+="      </p>";
      ptr+="      <canvas id='luminosity' width='400' height='200'></canvas>";

      console.log(ptr);

      main.innerHTML += ptr;
      wrapper.appendChild(main);
      this.shadow.appendChild(wrapper);
  }

  setTemperatureGraph(){
      var ctx = this.shadowRoot.getElementById('temperature').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
          datasets: [
            {
              data: [23.2, 25.4, 24.7, 29.7, 30.1, 23.2],
              fill: false,
              borderColor: '#ffc107',
              tension: 0.1,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {},
        },
      });
  }

  setHumidityGraph(){
      var ctx = this.shadowRoot.getElementById('humidity').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
          datasets: [
            {
              data: [65.2, 63.1, 55.3, 55.1, 54.9, 55.3],
              fill: false,
              borderColor: '#17a2b8',
              tension: 0.1,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {},
        },
      });
  }

  setLuminosityGraph(){
      var ctx = this.shadowRoot.getElementById('luminosity').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
          datasets: [
            {
              data: [0, 954, 954, 954, 954, 954],
              fill: false,
              borderColor: '#6f42c1',
              tension: 0.1,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {},
        },
      });
  }

  setGraphs(){
      this.setTemperatureGraph();
      this.setHumidityGraph();
      this.setLuminosityGraph();
  }

  connectedCallback(){
      this.drawInterface();
      this.setGraphs();

      var toggleC = this.shadowRoot.getElementById('toggle-config');
      toggleC.onclick = () => {
          this.toggleConfig();
      };

      toggleC = this.shadowRoot.getElementById('toggle-config2');
      toggleC.onclick = () => {
          this.toggleConfig();
      };

      var enableConfig = this.shadowRoot.getElementById('enable-config');
      enableConfig.onclick = () => {
          this.enableConfig();
      };

      var changeIpServer = this.shadowRoot.getElementById('change-ip-server');
      changeIpServer.onclick = () => {
          this.changeIpServer();
          var rebootMessage = this.shadowRoot.getElementById('reboot-message');
          rebootMessage.innerHTML = "Attention: redémarrage..."
          setTimeout(function(){
            rebootMessage.innerHTML = "&nbsp;"
          }, 2000)
      };
  }
}

customElements.define('esp-eole', Eole);