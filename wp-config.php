<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'lightsource');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'nPk3ZHX$sfZuZ:SDUE<g}fxQeJ|>%GN/8Zck geS,d?T0}Hn7}q1qv_0Y!jFK3[]');
define('SECURE_AUTH_KEY',  'UH2C_L7WcP0rMXVqXO*}x!GK61t3:6#2kPs`*/.@Gks)[U7MVHIbs[Mid-#v?|.C');
define('LOGGED_IN_KEY',    'U`4PxsE,q7JPzub:z!/w{!X,*00T8`qE=&2%c2(wzpX[]gG>&-8=2Q:=6uP&#U{.');
define('NONCE_KEY',        'j+E`u]~<:vy2+9Kw[Jl,gIvG2U_u.*-Y+rFCq9u($JVr,U6p!`8&^pWY$K7j0f2/');
define('AUTH_SALT',        'c>+J?!xB=.G|J`6jM70u/g/tP3G>mo4uCB%]m@nf-rgD?Rd.D{-p>:x&GGv5{kC4');
define('SECURE_AUTH_SALT', 'uB{r|Ul1Pkn6ock^gVs!T&1b7/LLRXLJ/~DqsiC&-(8nh~b4xGSQ~=yXRud<owJX');
define('LOGGED_IN_SALT',   'w4XHBhDAr@zKt2)2mlQzHE92Z3]up(`rczZFW-n=KC1gW{X*/WGugN/X87EQ^k9-');
define('NONCE_SALT',       'cRhCV!&)bM9Yl]q/|9GG k~4~AY_;&{jvvq5l@M2ys6fT(ztCae_INA~=Oz I).H');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
