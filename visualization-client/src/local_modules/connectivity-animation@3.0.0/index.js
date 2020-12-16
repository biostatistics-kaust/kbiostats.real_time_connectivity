/*jshint esversion: 6, browser: true*/

import Kefir from "../../lib/kefir@3.8.6/kefir.js";
import { el, mount, setStyle } from "../../lib/redom@3.24.1/index.js";
import htm from "../../lib/htm@2.2.1/index.js";
import MetroUI from "../../lib/metro-ui@4.3.1/js/metro.js";
//
import { JSONStream, checkConditionOnObjectList } from "../base-structure@1.0.0/functional-utils.js";
import { checkModuleDescriptionList } from "../base-structure@1.0.0/bootloader.js";
import { MenuScreen } from "../base-structure@1.0.0/menu-screen.js";
import { WelcomeScreen } from "../base-structure@1.0.0/welcome-screen.js";
import { CreateWindowWithAppTabBar } from "../base-structure@1.0.0/main-window.js";
//
import { SequentialEEGConnectivityScreen } from "./sequential-eeg-connectivity.js";
//
MetroUI.init();

const html = htm.bind(el);

mount(
  document.body,
  html`
    <div id="main-application" class="application-container"></div>
  `
);
mount(document.getElementById("main-application"), SequentialEEGConnectivityScreen());
