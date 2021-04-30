# PAINT-pixels-burned

Calculates number of $PAINT tokens burned through painting on the online collaboritive mural called, "Murall".  Unofficial code.

# Installation
sudo apt install git nodejs

git clone https://github.com/orchardstreet/PAINT-pixels-burned

cd PAINT-pixels-burned

Put Ethereum API key in line 2 of blockchaincredentials.js

Put Matic API key in line 5 of blockchaincredentials.js

npm init

npm install web3

# Run
node index.js

# What the program assumes
If the transparent pixels in transparentPixelGroups weren't burned, that's 0.5 PAINT burned per 1 byte in that array that isn't "0x00"

And 16 PAINT burned per array element in pixelGroups array

And 0.5 PAINT burned per 4 bytes in pixelData array
