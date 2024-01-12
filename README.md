<a href="https://weel.vercel.app">
    <p align="center">
        <img src="public/_static/dark-logo.png?raw=true" width="150" height="150">
    </p>
</a>

## Introduction

This is an <b>experimental</b> URL shortener based on [Dub.co](https://github.com/dubinc/dub) idea and architecture.

<b>IMPORTANT NOTICE:</b> I do not intend to utilize this for monetary gain, nor do I plan to support the production instance. In fact, the deployed app solely serves as a staging server dedicated to my acceptance testing.

## About

Weel (or <b>'wee link'</b>) serves as a link management tool designed for marketing teams, enabling them to generate, distribute, and monitor short links.

## Project Features

- Dynamic 3D globe displaying top-clicked links within the last 24 hours
- Advanced analytics for precise click tracking
- QR Codes for easy sharing
- Enhanced security with password-protected links
- Targeted link delivery with device and geo-targeting capabilities
- Time-sensitive links with customizable expiration dates

## Application features

- Dark theme for enhanced visual comfort
- Streamlined links view with intuitive infinite scroll
- Link management capabilities: create, edit, duplicate, archive, and delete
- Rate limiter for protection against potential DoS attacks
- Analytics page offering a time-series data view for in-depth analysis
- Click insights encompassing geo-location, device, browser, and referrer information

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Upstash](https://upstash.com/) – Redis
- [Tinybird](https://tinybird.com/) – real-time analytics
- [PlanetScale](https://planetscale.com/) – MySQL database
- [Vercel](https://vercel.com/) – deployments to Node.js and Edge runtimes
- [Prisma](https://www.prisma.io/) – ORM
- [Prisma Accelerate](https://console.prisma.io/login) - global database cache with scalable connection pooling. Used for connecting to the database from the Edge Runtime

## Architecture

We believe that the key principal of any URL shortener is a fast redirection mechanism. End users should feel minimal latency when addressing their short links.

<b>Weel</b> prioritizes swift redirection to minimize user latency. Deployed on [Vercel](https://vercel.com/) as a serverless application, it leverages [Vercel Edge](https://vercel.com/docs/functions/edge-functions) computing for geographical proximity to end users, ensuring faster communication and responses.

In this architecture, [Redis](https://redis.io/) serves as a crucial data store for short links, delivering fast access, persistence, and high availability. [Tinybird](https://www.tinybird.co/) enhances the system with real-time data analytics, offering rapid writes and reads with millisecond latency.

<img src="assets/weel-architecture.png?raw=true">

## Development

First, copy `.env.example` content to `.env.local` and provide the corresponding values.

<i>Optional:</i> create `.env.studio` containing a single variable, `DATABASE_URL`, serving as the direct path to the MySQL database. This file is utilized for reading environment variables when running `yarn db:studio`, enabling the opening of [Prisma Studio](https://github.com/prisma/studio) — a local database IDE.

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm i
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
