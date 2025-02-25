'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var gobytecore = require('@gobytecoin/gobytecore-lib');
var utils = require('../utils');
var BufferReader = gobytecore.encoding.BufferReader;
var BufferWriter = gobytecore.encoding.BufferWriter;
var _ = gobytecore.deps._;

/**
 * @param {Array=} arg - An array of inventory
 * @param {Object} options
 * @param {Array=} options.inventory - An array of inventory items
 * @extends Message
 * @constructor
 */
function InvMessage(arg, options) {
  Message.call(this, options);
  this.command = 'inv';
  utils.checkInventory(arg);
  this.inventory = arg;
}
inherits(InvMessage, Message);

InvMessage.prototype.setPayload = function(payload) {
  this.inventory = [];

  var parser = new BufferReader(payload);
  var count = parser.readVarintNum();
  for (var i = 0; i < count; i++) {
    var type = parser.readUInt32LE();
    var hash = parser.read(32);
    this.inventory.push({type: type, hash: hash});
  }

  utils.checkFinished(parser);
};

InvMessage.prototype.getPayload = function() {
  var bw = new BufferWriter();
  utils.writeInventory(this.inventory, bw);
  return bw.concat();
};

module.exports = InvMessage;
