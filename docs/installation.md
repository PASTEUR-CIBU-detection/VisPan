# Installation

To use VisPan, you must first install RAMPART with conda!

## Step 1 : RAMPART Installation

Install dependencies 
```bash
python -m pip install git+https://github.com/artic-network/Porechop.git@v0.3.2pre
python -m pip install binlorry==1.3.0_alpha1
```
Install Rampart
```bash
git clone https://github.com/artic-network/rampart.git
cd rampart/
conda env create -f environment.yml
conda activate artic-rampart
```
This step is necessary to use the post-processing feature and export reads.
```bash
pip install --upgrade binlorry 
```
Check that it works
```bash
rampart --help
```

## Step 2 : VISPAN installation

install VisPan from source
```bash
git clone https://gitlab.pasteur.fr/cibu-detection/VisPan.git
cd VisPan/
export NODE_OPTIONS=--openssl-legacy-provider
npm install
npm run build
```
Check that it works with the sample dataset and configuration files from the respiratory panel.
```bash
./vispan.js --basecalledPath  /path-to-datatset/dataset/ --protocol  /path-to-panels-panRespi/panels/panRespi/ --clearAnnotated
```
In a browser at [localhost:3000](http://localhost:3000) view data & interact with the results.

