'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var gobytecore = require('@gobytecoin/gobytecore-lib');
var BufferUtil = gobytecore.util.buffer;
var $ = gobytecore.util.preconditions;
var _ = gobytecore.deps._;

/**
 * Contains information about a MerkleBlock
 * @see https://en.bitcoin.it/wiki/Protocol_documentation
 * @param {MerkleBlock} arg - An instance of MerkleBlock
 * @param {Object=} options
 * @param {Function} options.MerkleBlock - a MerkleBlock constructor
 * @extends Message
 * @constructor
 */
function MerkleblockMessage(arg, options) {
  Message.call(this, options);
  this.MerkleBlock = options.MerkleBlock; // constructor
  this.command = 'merkleblock';
  $.checkArgument(
    _.isUndefined(arg) || arg instanceof this.MerkleBlock,
    'An instance of MerkleBlock or undefined is expected'
  );
  this.merkleBlock = arg;
}
inherits(MerkleblockMessage, Message);

MerkleblockMessage.prototype.setPayload = function(payload) {
  $.checkArgument(BufferUtil.isBuffer(payload));
  this.merkleBlock = this.MerkleBlock.fromBuffer(payload);
};

MerkleblockMessage.prototype.getPayload = function() {
  return this.merkleBlock ? this.merkleBlock.toBuffer() : BufferUtil.EMPTY_BUFFER;
};

module.exports = MerkleblockMessage;
