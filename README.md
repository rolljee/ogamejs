# A library for Ogame

## Introduction

I always wanted an Ogame calculator that suited me, all those I could see online are, either too old in graphic terms, or it didn't work, it was calculating badly the number of resources to send for each exchange...

So I decided to write a library in Javascript to create accessible methods to perform all calculations in a simple way for anyone who wants to create a graphical interface.

## Api documentation

All available methods will be listed below

- `sellDeut` Exchange of deuterium against `Metal` and `Crystal`

```javascript
// All params are optionnals
// values placed here will be used if not specified
sellDeut(deut = 0, percentM = 60, percentC = 40, rate = '2:1.5:1')
@return {
  metal: Number,
  crystal: Number
}
```

- `parseRate()` Parse the exchange rate

```javascript
// All params are optionnals
// values placed here will be used if not specified
parseRate(rate = '2:1.5:1') {};
@return {
  rateDeut: Number,
  rateMetal: Number,
  rateCrystal: Number
};
```
