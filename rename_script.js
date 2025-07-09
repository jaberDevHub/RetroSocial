const fs = require('fs');
fs.rename('E:/retro social/retro/src/utils/firebase.config.js', 'E:/retro social/retro/src/utils/api.js', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});