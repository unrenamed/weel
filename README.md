<a href="https://weel.vercel.app">
    <p align="center">
        <img src="public/_static/dark-logo.png?raw=true" width="150" height="150">
    </p>
</a>

## Introduction

This is an <b>experimental</b> link management tool based on [Dub.co code](https://github.com/dubinc/dub). Used for learning purposes only.

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
- Robust rate limiter for protection against potential DoS attacks
- Analytics page offering a time-series data view for in-depth analysis
- Detailed click insights encompassing geo-location, device, browser, and referrer information

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Upstash](https://upstash.com/) – redis
- [Tinybird](https://tinybird.com/) – analytics
- [PlanetScale](https://planetscale.com/) – database
- [Vercel](https://vercel.com/) – deployments
- [Prisma](https://www.prisma.io/) – ORM
- [Prisma Accelerate](https://console.prisma.io/login) - global database cache with scalable connection pooling. Used for connecting to the database from the Edge Runtime

## Getting Started

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
