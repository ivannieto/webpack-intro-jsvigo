import './assets/css/main.css';
import 'purecss';
import 'react';

require("font-awesome-webpack2");

import navComponent from './assets/js/navComponent';
import contentComponent from './assets/js/contentComponent';

import { uno } from  './assets/js/shake';

const body = document.body;

body.appendChild(navComponent());
body.appendChild(contentComponent());

uno();
