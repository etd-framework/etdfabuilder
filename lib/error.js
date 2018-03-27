function EtdFaBuilderError (message) {
  this.name = 'EtdFaBuilderError'
  this.message = message || ''
  this.etdfabuilder = true
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, EtdFaBuilderError)
  }
}

EtdFaBuilderError.prototype = Error.prototype

module.exports = EtdFaBuilderError
