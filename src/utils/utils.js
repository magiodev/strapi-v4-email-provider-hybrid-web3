const Web3 = require('web3');
const web3provider = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER_URL))

const utils = {
  /*
   * @param ownerAddress String The address given by the Web2 entry as creator
   * @param request      Object The clear message and the signature from requester to check if ECDSA returns same ownerAddress to validate
   *
   * return Boolean
   */
  async isEthSignatureValid(request) {
    let signerAddress = web3provider.eth.accounts.recover(request.message, request.signature)
    return this.toChecksumAddress(signerAddress) === this.toChecksumAddress(request.signer)
  },

  // Mirror method to do not import web3 on any component
  toChecksumAddress(address) {
    return web3provider.utils.toChecksumAddress(address)
  }
}

module.exports = utils
