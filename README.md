# Games gallery

[Show me the games!](https://games-gallery.jacobcarpenter.com/)

## Description

A gallery view of [MakeCode Arcade](https://arcade.makecode.com/) games posted to the [MakeCode forums](https://forum.makecode.com/).

## Platform Description

The site is a [Next.js](https://nextjs.org/) app employing [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) deployed to [Vercel's cloud platform](https://vercel.com/docs). 😍

It consumes the Discourse API for the [MakeCode forums](https://forum.makecode.com/). Due to Discourse's API design and rate limits (and execution time limits on my Vercel free hobby account), there's also a post cache in a [serverless Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/serverless) store that's updated on a schedule by a GitHub action in this repo.
