# A library for Ogame

## Introduction

I always wanted an Ogame calculator that suited me, all those I could see online are, either too old in graphic terms, or it didn't work, it was calculating badly the number of resources to send for each exchange...

So I decided to write a library in Javascript to create accessible methods to perform all calculations in a simple way for anyone who wants to create a graphical interface.

## Use

All available methods will be listed here

- Exchange of deuterium for %metal/%crystal

```javascript
getDeut(metal = 0, crystal = 0, metalPercent = 60, crystalPercent = 0) {}
```

Function signature accept float values and return the `deut` value for the trade.
