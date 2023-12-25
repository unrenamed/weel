import { faker } from "@faker-js/faker";
import fs from "fs";
import { stringify } from "csv-stringify";
import { Command, InvalidArgumentError } from "@commander-js/extra-typings";

const colors = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const COLUMNS = [
  "bot",
  "browser",
  "browser_version",
  "city",
  "country",
  "cpu_architecture",
  "device",
  "device_model",
  "device_vendor",
  "domain",
  "engine",
  "engine_version",
  "key",
  "latitude",
  "longitude",
  "os",
  "os_version",
  "referrer",
  "region",
  "timestamp",
  "ua",
];

const OS = [
  "Windows",
  "macOS",
  "Linux",
  "Android",
  "iOS",
  "Unix",
  "FreeBSD",
  "Chrome OS",
  "Solaris",
  "AIX (IBM)",
  "HP-UX (Hewlett Packard Unix)",
  "CentOS",
  "Ubuntu",
  "Fedora",
  "Debian",
  "Red Hat Enterprise Linux",
  "Mint",
  "OpenBSD",
  "SUSE Linux",
  "Arch Linux",
];

const BROWSERS = [
  "Google Chrome",
  "Mozilla Firefox",
  "Microsoft Edge",
  "Safari",
  "Opera",
  "Internet Explorer",
  "Brave",
  "Vivaldi",
  "Chromium",
  "Tor Browser",
  "UC Browser",
  "Maxthon",
  "Avant Browser",
  "Midori",
  "Pale Moon",
  "Waterfox",
  "Slimjet",
  "Epic Privacy Browser",
  "Yandex Browser",
  "Seamonkey",
];

const ENGINES = [
  "Gecko",
  "Blink",
  "Trident",
  "WebKit",
  "Presto",
  "EdgeHTML",
  "Servo",
  "Quantum",
  "KHTML",
  "Tasman",
  "Goanna",
  "Trident/NetFront",
  "Chromium",
  "Quantum",
  "SlimerJS",
  "Otter",
  "Links",
  "Dillo",
  "NetSurf",
  "Lynx",
];

const DEVICES = [
  "Desktop",
  "Mobile",
  "Tablet",
  "Wearable",
  "Console",
  "Embedded",
  "SmartTV",
];

const DEVICE_VENDORS = [
  "Samsung",
  "Apple",
  "Huawei",
  "Xiaomi",
  "Oppo",
  "Vivo",
  "Lenovo",
  "LG",
  "Sony",
  "Motorola",
  "Nokia",
  "HTC",
  "ZTE",
  "Google",
  "OnePlus",
  "ASUS",
  "Alcatel",
  "BlackBerry",
  "Ulefone",
  "Meizu",
];

const DEVICE_MODELS = [
  "HP Pavilion",
  "Dell Inspiron",
  "Lenovo ThinkCentre",
  "ASUS ROG",
  "Apple iMac",
  "Microsoft Surface Studio",
  "Acer Aspire",
  "MSI Infinite",
  "CyberPowerPC Gamer Xtreme",
  "Alienware Aurora",
  "Apple iPad",
  "Samsung Galaxy Tab",
  "Amazon Fire HD",
  "Lenovo Tab",
  "Huawei MediaPad",
  "Microsoft Surface Pro",
  "ASUS ZenPad",
  "Google Pixel Slate",
  "Sony Xperia Tablet",
  "Xiaomi Mi Pad",
  "Apple iPhone",
  "Samsung Galaxy S",
  "Huawei P",
  "Xiaomi Mi",
  "OnePlus",
  "Oppo Find",
  "Google Pixel",
  "Samsung Galaxy Note",
  "Apple iPhone SE",
  "Realme",
];

const CPU = [
  "x86-64",
  "ARM",
  "Power Architecture",
  "MIPS",
  "SPARC",
  "RISC-V",
  "Itanium (Intel IA-64)",
  "Motorola 68k",
  "Alpha (DEC Alpha)",
  "SuperH",
];

const versions = {
  browser: () =>
    [
      faker.number.int({ min: 13, max: 39 }),
      0,
      faker.number.int({ min: 800, max: 899 }),
      0,
    ].join("."),
  os: () =>
    [faker.number.int({ min: 5, max: 6 }), faker.number.int(3)].join("."),
  engine: () =>
    [faker.number.int({ min: 3, max: 7 }), faker.number.int(1)].join("."),
};

const genRandEvent = () => {
  return {
    key: "github",
    domain: "weel.vercel.app",
    bot: faker.datatype.boolean({ probability: 0.15 }) ? 1 : 0,
    country: faker.location.countryCode("alpha-2"),
    region: faker.location.state(),
    city: faker.location.city(),
    ua: faker.internet.userAgent(),
    os: faker.helpers.arrayElement(OS),
    os_version: versions.os(),
    browser: faker.helpers.arrayElement(BROWSERS),
    browser_version: versions.browser(),
    engine: faker.helpers.arrayElement(ENGINES),
    engine_version: versions.engine(),
    device: faker.helpers.arrayElement(DEVICES),
    device_model: faker.helpers.arrayElement(DEVICE_MODELS),
    device_vendor: faker.helpers.arrayElement(DEVICE_VENDORS),
    cpu_architecture: faker.helpers.arrayElement(CPU),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    timestamp: faker.date.between({
      from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      to: new Date(),
    }),
    referrer:
      faker.helpers.maybe(() => faker.internet.domainName(), {
        probability: 0.65,
      }) ?? "(direct)",
  };
};

function create_and_write_clicks_to_file(filename: string, rows: number) {
  const writableStream = fs.createWriteStream(filename);
  const stringifier = stringify({ header: true, columns: COLUMNS });

  // Pipe the stringifier to the writable stream
  stringifier.pipe(writableStream);

  console.log(colors.yellow, "Start generating 🌱");
  console.log(colors.blue, "Create events and write them to the CSV file ✍️");
  [...Array(rows)].forEach(() => {
    const event = genRandEvent();
    stringifier.write(event);
  });

  // End the stringifier to trigger the finish event
  stringifier.end();

  writableStream.on("finish", () => {
    console.log(colors.cyan, "Finished writting events to the file 🏁");
  });

  writableStream.on("error", (err: Error) => {
    console.error(colors.red, "Error writing to the CSV file: ", err);
  });
}

function parseIntOption(value: string) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsedValue;
}

const commander = new Command()
  .option(
    "-f, --filename <value>",
    "A name of a file to write fixture data to.",
    "link_clicks.csv"
  )
  .option(
    "-r, --rows <value>",
    "A number of rows, i.e. click events, to generate.",
    parseIntOption,
    100
  )
  .parse(process.argv);

const options = commander.opts();

create_and_write_clicks_to_file(options.filename, options.rows);
