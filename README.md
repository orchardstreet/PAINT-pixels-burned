# PAINT-pixels-burned

Calculates umber of $PAINT tokens burned through painting on the online collaboritive mural called, "Murall".  Unnofficial code.

Can only calculate those burned on ETH at the moment, but not MATIC, so may be over half off right now.

# Installation
sudo apt install git nodejs

git clone https://github.com/orchardstreet/PAINT-pixels-burned

cd PAINT-pixels-burned

Put Ethereum API key in line 2 of blockchaincredentials.js

npm init

npm install web3

# Run
node index.js

# What the program assumes
If the transparent pixels in transparentPixelGroups weren't burned, that's 0.5 PAINT burned per 1 byte in that array that isn't "0x00"

And 16 PAINT burned per array element in pixelGroups array

And 0.5 PAINT burned 4 bytes in pixelData array
