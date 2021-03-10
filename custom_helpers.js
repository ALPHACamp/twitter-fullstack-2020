const request = require('request');

const fs = require('fs').promises;

const { IMGUR_CLIENT_ID } = process.env;

const uploadFile = async (file) => {
  const data = await fs.readFile(file.path);
  console.log('uploadFile data', data);
  const options = {
    method : 'POST',
    url    : 'https://api.imgur.com/3/image',
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
    formData: {
      image: data,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
        console.log('error', error);
      } else {
        resolve(JSON.parse(response.body).data);
        console.log('response.body', response.body);
      }
    });
  });
};

module.exports = {
  uploadFile,
};
