const Shell = require('node-powershell-updates');
export const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true,
});
