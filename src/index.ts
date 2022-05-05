import app from './app';

const PORT = process.env.PORT || 3000;

(async function start () {
  app.listen(PORT, () => {
    console.log('App is running!!');
  })
})();
