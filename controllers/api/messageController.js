const helpers = require('../../_helpers')
const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const db = require('../../models')
const Message = db.Message
const User = db.User
const { Op } = require("sequelize")
const messageService = require('../../services/messageService.js')

const messageController = {
  getPrivateInbox: async (req, res) => {
    messageService.getPrivateInbox(req, res, data => {
      return data
    })
  }
}

module.exports = messageController