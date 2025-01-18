class Hydros extends HTMLElement {
	ipServer() {
		var requestOptions = { method: 'GET', redirect: 'follow' };
		fetch('/info/ip', requestOptions)
		.then((response) => response.text())
		.then((result) => this.mqtt_server = result)
		.catch((error) => console.log('error', error));
	}

	serverName() {
		var requestOptions = { method: 'GET', redirect: 'follow' };
		fetch('/info/name', requestOptions)
		.then((response) => response.text())
		.then((result) => this.mqtt_name = result)
		.catch((error) => console.log('error', error));
	}

	enableConfig() {
			this.showRebootMessage();
			var requestOptions = { method: 'GET', redirect: 'follow' };
			fetch('/config', requestOptions)
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

	toggleConfirmReinitConfig(){
		var x = this.shadowRoot.getElementById('confirm-reinit-config');
		var y = this.shadowRoot.getElementById('config');
		if (x.style.display === 'none') {
			this.modalIsOpen = true;
			x.style.display = 'block';
			y.style.filter = 'blur(10px)';
		} else {
			this.modalIsOpen = false;
			x.style.display = 'none';
			y.style.filter = '';
		}
	}

	reboot() {
		var requestOptions = { method: 'GET', headers: { 'Content-Type': 'text/plain' }, redirect: 'follow' };
		fetch('/reboot', requestOptions)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.log('error', error));
		setTimeout(() => { location.reload(); }, 3000);
	}

	changeIpServer() {
		var x = this.shadowRoot.getElementById('ip_server');
		x = x.value;
		var requestOptions = { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: x, redirect: 'follow' };
		fetch('/info/ip', requestOptions)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.log('error', error));
		setTimeout(() => { location.reload(); }, 3000);
	}

	changeServerName() {
		var x = this.shadowRoot.getElementById('name_server');
		x = x.value;
		var requestOptions = { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: x, redirect: 'follow' };
		fetch('/info/name', requestOptions)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.log('error', error));
		setTimeout(() => { location.reload(); }, 3000);
}

	constructor() {
			super();

			this.shadow = this.attachShadow({mode: 'open'});

			this.mqtt_server = "";//"192.168.1.22";
			this.mqtt_name = "";//"HYDROS_15248";
			this.ipServer();
			this.serverName();

			this.temp = 23.3;
			this.ec = 1.35;
			this.oxygene = 55.1;

			this.modalIsOpen = false;

			this.svg_check = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='check' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' class='svg-inline--fa fa-check fa-w-16 fa-3x' style='margin-bottom: -6px; margin-left: 8px;'><path fill='#20c997' d='M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z' class=''></path></svg>";
			this.svg_times = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='times' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 352 512' class='svg-inline--fa fa-times fa-w-11 fa-3x'><path fill='#dc3545' d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z' class=''></path></svg>";
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
			style+="        height: 100%;";
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
			style+="        /*height: 18px;";
			style+="        padding: 2px;";
			style+="        font-size: 16px;*/";
			style+="        margin: auto";
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
			style+="      #reboot {";
			style+="            padding: 4px;";
			style+="            font-weight: 600;";
			style+="            background: #6c757d;";
			style+="            color: #f8f9fa;";
			style+="            margin: 4px;";
			style+="            width: 90%;";
			style+="      }";
			style+="      #enable-config {";
			style+="            padding: 4px;";
			style+="            font-weight: 600;";
			style+="            background: #6c757d;";
			style+="            color: #f8f9fa;";
			style+="            margin: 4px;";
			style+="            width: 90%;";
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
			style+="      #sticky-foot {";
			style+="            position: absolute;";
			style+="            bottom: 0;";
			style+="            left: 0;";
			style+="            padding: 4px;";
			style+="            font-weight: 600;";
			style+="            color: #f8f9fa;";
			style+="            display: flex;";
			style+="            flex-wrap: wrap;";
			style+="            justify-content: center;";
			style+="      }";
			style+="      #reboot-message {";
			style+="          padding: 16px;";
			style+="          color: #dc3545;";
			style+="          font-weight: 700;";
			style+="      }";
			style+="      #confirm-reinit-config {";
			style+="          display: none;";
			style+="          position: absolute;";
			style+="          height: 100%;";
			style+="          width: 100%;";
			style+="          z-index: 99;";
			style+="      }";
			style+="    </style>";

			wrapper.innerHTML = wrapper.innerHTML + style;

			var config = document.createElement('div');
			config.id = 'config';
			var stickyHead = document.createElement('div');
			stickyHead.id = 'sticky-head';
			stickyHead.innerHTML += "<h1>HYDROS</h1>";
			var toggleConfig = document.createElement('div');
			toggleConfig.id = 'toggle-config';

			var rebootMessage = document.createElement('div');
			rebootMessage.id = 'reboot-message';
			rebootMessage.innerHTML = "&nbsp;"

			var confirmReinitConfig = document.createElement('div');
			confirmReinitConfig.id = 'confirm-reinit-config';
			confirmReinitConfig.style.display = 'none';

			var text = document.createElement('p');
			text.style.paddingTop = "50%";
			text.innerHTML = "Etes-vous sûre de vouloir réinitialiser la configuration d'usine ?";

			var buttonYes = document.createElement('div');
			buttonYes.id = 'confirm-reinit-config-yes';
			buttonYes.innerHTML = this.svg_check;
			buttonYes.style.marginRight = "16px";
			buttonYes.onclick = () => {
				this.toggleConfirmReinitConfig();
				this.enableConfig();
			};

			var buttonNo = document.createElement('div');
			buttonNo.id = 'confirm-reinit-config-no';
			buttonNo.innerHTML = this.svg_times;
			buttonNo.style.marginLeft = "16px";
			buttonNo.onclick = () => {
				this.toggleConfirmReinitConfig();
			};

			var buttons = document.createElement('div');
			buttons.style.display = "flex";
			buttons.style.justifyContent = "center";

			confirmReinitConfig.appendChild(text);
			buttons.appendChild(buttonYes);
			buttons.appendChild(buttonNo);
			confirmReinitConfig.appendChild(buttons);
			wrapper.appendChild(confirmReinitConfig)

			toggleConfig.innerHTML = "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='undo' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' class='svg-inline--fa fa-undo fa-w-16 fa-3x' > <path fill='#f8f9fa' d='M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z' class='' ></path> </svg>";
			stickyHead.appendChild(toggleConfig)
			config.appendChild(stickyHead)
			config.appendChild(rebootMessage)

			var ptr = "";
			ptr +="     <div style='display: flex; color:#f8f9fa; margin-bottom: 16px; margin-right: 4px;'><span style='margin-top: 4px; margin-left: 16px; width: 30%;'>IP Server&nbsp;</span><input maxLength='35' type='text' id='ip_server' placeholder='" + this.mqtt_server + "'><div id='change-ip-server'>" + this.svg_check + "</div></div>";
			ptr +="     <div style='display: flex; color:#f8f9fa; margin-bottom: 16px; margin-right: 4px;'><span style='margin-top: 4px; margin-left: 16px; width: 30%;'>Server Name&nbsp;</span><input maxLength='35' type='text' id='name_server' placeholder='" + this.mqtt_name + "'><div id='change-server-name'>" + this.svg_check + "</div></div>";
			ptr +="   <div id='sticky-foot'>";
			ptr+="      <div id='reboot'>";
			ptr+="        <div>Redémarer l'appareil</div>";
			ptr+="      </div>";
			ptr+="      <div id='enable-config'>";
			ptr+="        <div>Réinitialiser la configuration d'usine</div>";
			ptr+="      </div>";
			ptr+="    </div>";

			ptr+="    </div>";
			config.innerHTML += ptr;
			wrapper.appendChild(config);

			var main = document.createElement('div');
			main.id = 'main';
			var stickyHead2 = document.createElement('div');
			stickyHead2.id = 'sticky-head2';
			var toggleConfig2 = document.createElement('div');
			toggleConfig2.id = 'toggle-config2';
			stickyHead2.innerHTML += "<h1>HYDROS</h1>";

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
			ptr+="          <path fill='#007bff' d='M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z' class=''></path></svg";
			ptr+="        >EC <span style='color: #007bff'>";
			ptr+=this.ec;
			ptr+="        ppm</span>";
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
			ptr+="          <path fill='#17a2b8' d='M160.1 22.1C109.1 179.8 0 222.7 0 333.9 0 432.3 85.9 512 192 512s192-79.7 192-178.1c0-111.8-108.9-153.3-160.1-311.8-8.7-28.8-54-30.1-63.8 0zM416 0c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z' class=''></path></svg";
			ptr+="        >Oxygène <span style='color: #17a2b8'>";
			ptr+=this.oxygene;
			ptr+="        %</span>";
			ptr+="      </p>";
			ptr+="      <canvas id='luminosity' width='400' height='200'></canvas>";

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
							data: [1.35, 1.35, 1.35, 1.35, 1.35, 1.35, ],
							fill: false,
							borderColor: '#007bff',
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
							data: [54.2, 54., 54.4, 55.0, 55.2, 55.1],
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

	setGraphs(){
			this.setTemperatureGraph();
			this.setHumidityGraph();
			this.setLuminosityGraph();
	}

	showRebootMessage(){
		var rebootMessage = this.shadowRoot.getElementById('reboot-message');
		rebootMessage.innerHTML = "Attention: redémarrage..."
		setTimeout(() => {
			rebootMessage.innerHTML = "&nbsp;"
			setTimeout(() => {
				location.reload();
			}, 300)
		}, 2000)
	}

	connectedCallback(){
			this.drawInterface();
			this.setGraphs();

			var reboot = this.shadowRoot.getElementById('reboot');
			reboot.onclick = () => {
				if(!this.modalIsOpen)
					this.reboot();
					this.showRebootMessage();
			};

			var toggleC = this.shadowRoot.getElementById('toggle-config');
			toggleC.onclick = () => {
				if(!this.modalIsOpen)
					this.toggleConfig();
			};

			toggleC = this.shadowRoot.getElementById('toggle-config2');
			toggleC.onclick = () => {
				if(!this.modalIsOpen)
					this.toggleConfig();
			};

			var enableConfig = this.shadowRoot.getElementById('enable-config');
			enableConfig.onclick = () => {
					this.toggleConfirmReinitConfig();
			};

			var changeIpServer = this.shadowRoot.getElementById('change-ip-server');
			changeIpServer.onclick = () => {
				if(!this.modalIsOpen)
					this.changeIpServer();
					this.showRebootMessage();
			};

			var changeServerName = this.shadowRoot.getElementById('change-server-name');
			changeServerName.onclick = () => {
				if(!this.modalIsOpen)
					this.changeServerName();
					this.showRebootMessage();
			};
	}
}

customElements.define('esp-hydros', Hydros);