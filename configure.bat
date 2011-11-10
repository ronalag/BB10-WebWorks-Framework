SETLOCAL
git submodule update --init && ^
npm install -g jake jshint@0.5.0 csslint uglify-js && ^
npm install jasmine-node express && ^
npm install && ^
npm install dependencies/BBX-Emulator/ && ^
for /F "delims=''" %%i in ('npm root -g') do SET nodemodules="%%i\bbx-framework" && ^
junction %nodemodules% .
ENDLOCAL