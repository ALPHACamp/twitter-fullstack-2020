const request = require('request');

const fs = require('fs').promises;

const { IMGUR_CLIENT_ID } = process.env;

const uploadFile = async (file) => {
  const data = await fs.readFile(file.path);
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
      } else {
        resolve(JSON.parse(response.body).data);
      }
    });
  });
};

module.exports = {
  uploadFile,
};
