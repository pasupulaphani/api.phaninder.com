/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   this will be overriden by NEW_RELIC_APP_NAME env var
   */
  app_name : ['phaninder.com'],
  /**
   * Your New Relic license key.
   this will be overriden by NEW_RELIC_LICENSE_KEY env var 
   */
  license_key : '0d642861677d37602',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'info'
  }
};
