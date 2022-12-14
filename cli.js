#!/usr/bin/env node

import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

// Print help text
if (args.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
    console.log("    -h            Show this help message and exit.")
    console.log("    -n, -s        Latitude: N positive; S negative.")
    console.log("    -e, -w        Longitude: E positive; W negative.")
    console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.")
    console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.")
    console.log("    -j            Echo pretty JSON from open-meteo API and exit.")
    process.exit(0); 
}

// Get timezone
const tz = args.z || moment.tz.guess()

// Get latitude
let lat = 0;
if (args.n) {
    lat = args.n
} else if (args.s) {
    lat = -args.s
} else {
    console.log("Latitude must be in range");
    process.exit(0);
}

// Get longitude
let long = 0;
if (args.e) {
    long = args.e
} else if (args.w) {
    long = -args.w
} else {
    console.log("Longitude must be in range");
    process.exit(0);
}

// Make call to API
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,precipitation&daily=precipitation_hours&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=" + tz
const response = await fetch(url);

// Get data from request
const data = await response.json();

// Print data and exit
if (args.j) {
    console.log(data);
    process.exit(0);
}

// Day is tomorrow by default
let day = 1

// Change day to d arg if present
if (args.d != null) {
    day = args.d;
}

// Determine if there is precipitation
if (data.daily.precipitation_hours[day] == 0) {
    console.log("No need to wear galoshes")
} else {
    console.log("Wear your galoshes")
}

// Print precipitation for selected day
if (day == 0) {
    console.log("today.")
} else if (day == 1) {
    console.log("tomorrow.")
} else {
    console.log("in " + day + " days.")
}