# Verbdash

![](https://cloud.githubusercontent.com/assets/265838/9984968/b816ebea-5ff0-11e5-9327-754f040afa25.png)

====

Quickly consolidate your "actions, sequences, segments, pose sets" into [Collada](https://www.khronos.org/collada/) files from [MODO](http://thefoundry.co.uk) *or potentially a bunch of other apps that claim to write Collada format files.*

====

## The Problem

When you work in MODO to create a character and associated animations you create what are known as "Actors and Actions." The documentation from The Foundry, as well as from Apple on how to employ these components in your Collada files on the other end of the pipeline are almost non-existant.

MODO exports a Collada file that contains several animations (one-per-bone-chain in fact) inside of the `<library_animations>` chunk of the DAE file. Likely, this is to ensure that if you want to do mid-tier pose blending (what Unreal Engine calls Montages) you're not limited by a massive singular animation entity. This happens however at the cost of having reasonably named animations with which to work in Apples SceneKit so it's a non-starter.

I did a bunch of digging and found an [Automator action from Steve Baker](https://drive.google.com/file/d/0B1_uvI21ZYGUaGdJckdwaTRZUEk/edit) that helped a little bit but once I realized that the files were just text; well, I'm a programmer. I wanted all my actions stored as animations in a single file ready for transport.

====

This script is written in Javascript meant to be run using [NodeJS](http://nodejs.org) - setting NodeJS up is really simple, on most platforms it's an installer. I wrote this using an older version of the library so it should probably work fine for most folks. If not, open an issue.

Usage:

1. Install NodeJS and `npm`
2. Clone the repository (or download a tarball and unzip it.)
3. Open a command line and cd into the directory containing Verbdash.js
4. Execute the command:  
`    npm install`
`    node Verbdash.js`
5. You'll get a couple of options such that a command to run the tool will look like:  
`    node Verbdash.js --input ~/Documents/GameProject/OriginalAssets/Character/DAE/ --dash "|" --output ~/Desktop`

There are lots of ways things can go wrong. If you have files that don't consolidate let me know and I'll definitely take a look. It's really frustrating not being able to just use the Actions as set up in MODO in SceneKit.
