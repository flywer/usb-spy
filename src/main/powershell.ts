const Shell = require('node-powershell-updates');
export const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true,
});

export const ADMIN_START = 'Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList'
