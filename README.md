# Taller 1 - Pruebas de software

This script extracts data from `portalinmobiliario` and generate JSON file with this data. Optionally this script can filter the obtained data by maximumPrice

## How to use

### Install libraries

`npm install`

### IMPORTANT

**Please, first create the `json` and `xlsx` folder in the root of the project**

### Run with default configuration

`npm run start`

### Arguments Variables

| Name         | Details                                          | Default             |
| ------------ | ------------------------------------------------ | ------------------- |
| location     | Location to use for web searches                 | temuco-la-araucania |
| maxPages     | Maximum number of pages to search                | 1                   |
| perPage      | Maximum number of houses per page                | 50                  |
| maximumPrice | Maximum price used on filter by house.priceInCLP |                     |

### How to / Playground

- Obtain 100 houses in "Puerto Montt Los Lagos" and generate a json file with the houses that have a price lower than 120M

```
npm run start -- --location=puerto-montt-los-lagos --maxPages=2 --maximumPrice=120000000
```

- Obtain 80 houses in "Temuco" and generate a json file with the houses that have a price lower than 80M

```
npm run start -- --perPage=80 --maximumPrice=80000000
```
