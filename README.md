# Verbdash
====

Quickly consolidate your "actions, sequences, segments, pose sets" into [Collada](https://www.khronos.org/collada/) files from [MODO](http://thefoundry.co.uk) *or potentially a bunch of other apps that claim to write Collada format files.*

This script is written in Javascript meant to be run using [NodeJS](http://nodejs.org) - setting NodeJS up is really simple, on most platforms it's an installer. I wrote this using an older version of the library so it should probably work fine for most folks. If not, open an issue.

Usage:
0. Install NodeJS and `npm`
1. Clone the repository (or download a tarball and unzip it.)
2. Open a command line and cd into the directory containing Verbdash.js
3. Execute the command:  
    npm install
    node Verbdash.js
4. You'll get a couple of options such that a command to run the tool will look like:  
    node Verbdash.js --input ~/Documents/GameProject/OriginalAssets/Character/DAE/ --dash "|" --output ~/Desktop

There are lots of ways things can go wrong. If you have files that don't consolidate let me know and I'll definitely take a look. It's really frustrating not being able to just use the Actions as set up in MODO in SceneKit.
