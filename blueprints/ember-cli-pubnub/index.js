module.exports = {
  description: 'Install external pubnub javascript.',

  /*
   * Prevent error when the entityName is
   * not specified (since that doesn't
   * actually matter to us).
   *
   * @method normalizeEntityName
   */
  normalizeEntityName: function() {
    // noop
  },

  /*
   * The default blueprint will be
   * automatically run after install.
   * This is where to include bower
   * dependencies within the consumer
   * application.
   *
   * @method afterInstall
   *
   * @return {Promise}
   *   A promise that resolves when the package is installed.
   */
  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'pubnub', target: '~3.7.15' }
    ]);
  }
};
